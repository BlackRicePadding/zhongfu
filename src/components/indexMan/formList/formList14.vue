<template>
    <div class="page-container">
        <!--工具栏-->
        <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
            <el-form :inline="true">
                <el-form-item>
                    <el-button type="primary" @click="addData">添加</el-button>
                    <el-button @click="exportToExcel">导出excel</el-button>
                    <el-button  @click="handleForm" style="float: right;margin-right: 60px;">编辑表单</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!--表格树内容栏-->
        <el-table :data="tableData" stripe size="mini" style="width: 100%;" border>
            <el-table-column v-for="(val,key) in showEditor" :key="key" :prop="val.model" :label="val.name" width="150">
            </el-table-column>
            <el-table-column header-align="center" align="center" fixed="right" width="200">
                <template slot-scope="scope">
                    <el-button @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button type="danger" @click="rowDel(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="toolbar" style="padding:10px;">
            <el-pagination layout="total, prev, pager, next, jumper"
                           @current-change="getPage"
                           :current-page.sync="page" :page-size="pageSize" :total="totalSizes" style="float:right;">
            </el-pagination>
        </div>
        <el-dialog @on-close="dialogVisible = false" :title="!editDataId ? '新增数据' : '编辑数据'" width="60%" top="15px" :visible.sync="dialogVisible">
            <hr class="show-hr">
            <GenerateForm
                v-if="hackSet"
                :data="jsonData"
                :value="jsonValue"
                ref="generateForm"
                class="ger"
            >
            </GenerateForm>
            <hr class="show-hr">
            <el-button @click="saveDataInfo()" type="primary" plain>保存表单</el-button>
            <el-button @click="clearInfo()" type="warning" plain>清空表单</el-button>
            <el-button @click="closeDataInfo()" type="info" plain>取消</el-button>
        </el-dialog>
        <el-dialog title="编辑表单" width="99%" top="15px" :visible.sync="dialogVisibleInfo">
            <MakingForm
                ref="makingform"
                style="height: 700px;text-align: left;"
                :discinfo='disc'
                preview
                generate-code
                generate-json
            >
            </MakingForm>
            <hr>
            <el-row>
                <div style="float:right;">
                    <el-button @click="saveInfo()" type="primary" plain>保存表单</el-button>
                    <el-button @click="showInfo()" type="primary" plain>预览表单</el-button>
                    <el-button @click="closeInfo()" type="info" plain>取消</el-button>
                </div>
            </el-row>
        </el-dialog>
        <el-dialog title="预览表单" width="60%" top="30px" :visible.sync="dialogVisibleShowInfo">
            <GenerateForm
                :data="jsonData"
                ref="generateForm"
                style="text-align: left;"
            >
            </GenerateForm>
        </el-dialog>
    </div>
</template>

<script>
  import {
    GenerateForm,
    MakingForm
  } from 'form-making'
  import 'form-making/dist/FormMaking.css'
  import Blob from '../../Excel/Blob.js'
  import Export2Excel from '../../Excel/Export2Excel.js'

  export default {
    components:{
      GenerateForm,
      MakingForm
    },
    name: "formList14",
    data() {
      return {
        formListId:14,
        tableData:[],
        jsonData:JSON.parse('{"list":[],"config":{"labelWidth":100,"labelPosition":"right","size":"small","customClass":""}}'),
        jsonValue:JSON.parse('{}'),
        dialogVisible:false,
        dialogVisibleInfo:false,
        dialogVisibleShowInfo:false,
        editDataId:null,
        page:1,
        pageSize:10,
        totalSizes:0,
        columnFilters:{
          objId:{
            name:"objId",
            value:0
          }
        },
        hackSet:false,
        showEditor:[],
        filterVal:null,
        tHeader:null,
        disc:null,
      }
    },
    methods: {
      exportToExcel() {
        //excel数据导出
        require.ensure([], () => {
          const { export_json_to_excel } = require('../../Excel/Export2Excel.js');
          let params = {
            'page':1,
            'pageSize':3000,
            'columnFilters':this.columnFilters
          }
          this.$api.form.findDataPage(params).then((res) => {
            let list = res.data.content
            list.forEach((v,k)=>{
              let t = JSON.parse(v.content);
              for(let p in t){
                let name = p;//属性名称
                let value=t[p];//属性对应的值
                v[name]=t[p];
              }
            })
            let data = this.formatJson(this.filterVal, list);
            let name = new Date().getTime();
            export_json_to_excel(this.tHeader,data,name)
          })
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      getPage(){
        let id = this.formListId;
        this.columnFilters.objId.value = id;
        let params = {
          'page':this.page,
          'pageSize':this.pageSize,
          'columnFilters':this.columnFilters
        }
        this.$api.form.findDataPage(params).then((res) => {
          this.totalSizes = res.data.totalSize
          this.tableData = res.data.content
          this.tableData.forEach((v,k)=>{
            let t = JSON.parse(v.content);
            for(var p in t){
              let name = p;//属性名称
              let value=t[p];//属性对应的值
              v[name]=t[p];
            }
          })
        })
      },
      getInfo(){
        let params = {
          'id':this.formListId
        }
        this.$api.form.findById(params).then((res) => {
          this.jsonData = JSON.parse(res.data.content);
          // this.showEditor = JSON.parse(JSON.stringify(this.jsonData.list))
          let temp = JSON.parse(JSON.stringify(this.jsonData.list))
          let re = []
          temp.forEach((val,key)=>{
            if(val.name == '栅格布局'){
              val.columns.forEach((c1val,c1key)=>{
                c1val.list.forEach((c2val,c2key)=>{
                  re.push(c2val)
                })
              })
            }else{
              re.push(val)
            }
          })
          this.showEditor = re;
          this.filterVal = []
          this.tHeader = []
          this.showEditor.forEach((v,k)=>{
            this.tHeader.push(v.name)
            this.filterVal.push(v.model)
          })
          console.log(this.tHeader,this.filterVal)
          console.log(this.showEditor,'xxxx');
        })
      },
      getValue(row){
        this.dialogVisible = true;
        this.$nextTick(_ => {
          let params = {
            'id':row.id
          }
          this.$api.form.findByDataId(params).then((res) => {
            this.editDataId = row.id;
            this.jsonValue = JSON.parse(row.content);
            this.hackSet = false;
            this.$nextTick(_ =>{
              this.hackSet = true;
            })
          })
        })
      },
      addData(){
        this.dialogVisible = true;
        this.editDataId = null;
        this.hackSet = true;
        this.$nextTick(_ =>{
          this.$refs.generateForm.reset()
          this.hackSet = false;
          this.$nextTick(_ =>{
            this.hackSet = true;
            this.$nextTick(_ =>{
              this.$refs.generateForm.reset()
            })
          })
        })
      },
      saveDataInfo(){
        this.$nextTick(_ => {
          let res = null;
          this.$refs.generateForm.getData().then(data => {
            res = data;
            let temp = {
              objid:this.columnFilters.objId.value,
              id:this.editDataId,
              content: JSON.stringify(res)
            }
            this.$api.form.saveData(temp).then((res) => {
              if(res.code == 200&&res.data == 1){
                this.$message({
                  type: 'success',
                  message: '保存成功 '
                });
                this.dialogVisible = false;
                this.getPage()
              }
            })
          }).catch(e => {
            this.$message('数据校验失败 请检查输入的数据')
            return false;
          })
        })
      },
      clearInfo(){
        this.hackSet = false;
        this.$nextTick(_ => {
          this.hackSet = true;
          this.$nextTick(_ => {
            this.$refs.generateForm.reset()
          })
        })
      },
      closeDataInfo(){
        this.dialogVisible = false;
      },
      // 显示编辑界面
      handleEdit(row) {
        this.jsonValue = JSON.parse(row.content);
        this.dialogVisible = true;
        this.editDataId = row.id;
        this.hackSet = false;
        this.$nextTick(_=>{
          this.hackSet = true;
          this.hackSet = false;
          this.$nextTick(_=>{
            this.hackSet = true;
            this.$nextTick(_=>{
              this.$refs.generateForm.models = this.jsonValue
            })
          })
        })
      },
      //删除
      rowDel: function (id) {
        this.$confirm('确认删除？', '提示', {}).then(() => {
          let data = []
          let temp = {'id':id}
          data.push(temp)
          this.$api.form.batchDelete(data).then((res) => {
            if(res.code == 200) {
              this.$message({ message: '操作成功', type: 'success' })
            } else {
              this.$message({message: '操作失败, ' + res.msg, type: 'error'})
            }
            this.editLoading = false
            this.dialogVisible = false
            this.getPage()
          })
        })
      },
      // 显示编辑界面
      handleForm(){
        this.dialogVisibleInfo = true;
        this.editJson = this.jsonData;
        this.$nextTick(_ => {
          this.$refs.makingform.setJSON(this.editJson)
        })
      },
      closeInfo(){
        this.dialogVisibleInfo = false;
      },
      showInfo(){
        this.jsonData = '';
        this.$nextTick(_ => {
          this.jsonData = this.$refs.makingform.getJSON()
          this.dialogVisibleShowInfo = true;
        })
      },
      saveInfo(){
        this.$nextTick(_ => {
          let data = {
            id:this.formListId,
            content: JSON.stringify(this.$refs.makingform.getJSON())
          }
          this.$api.form.save(data).then((res) => {
            if(res.code == 200&&res.data == 1){
              this.$message({
                type: 'success',
                message: '保存成功'
              });
              this.dialogVisibleInfo = false;

              this.getPage();
              this.getInfo();
              this.getDisc();
            }
          })
        })

      },
      getDisc(){
        let params = {
          'page':1,
          'pageSize':10000
        }
        this.$api.formDisc.findPage(params).then((res) => {
          let data = res.data.content;
          this.disc = [];
          data.forEach((val,key)=>{
            let cont = JSON.parse(val.content);
            let child = [];
            cont.forEach((v,k)=>{
              child.push({
                label:v.label,
                value:v.value
              })
            })
            let temp = {
              name:val.name,
              key:val.id,
              value:val.name,
              child:child
            }
            this.disc.push(temp)
          })
          console.log(this.disc)
        })
      },
    },
    mounted() {
      this.getPage();
      this.getInfo();
      this.getDisc();
    }
  }
</script>

<style scoped>
    .show-hr {
        border: 0;
        height: 1px;
        margin: 10px;
        background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0));
    }
    .ger{
        text-align: left;
    }
</style>
