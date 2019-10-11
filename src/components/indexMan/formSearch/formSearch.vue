<template>
    <div class="page-container">
        <el-row>
            <el-col :span="3">
                <el-menu
                    class="el-menu-vertical-demo"
                     background-color="#545c64"
                     text-color="#fff"
                     active-text-color="#ffd04b">
                    <el-menu-item v-for="(o,i) in leftList">
                        <span slot="title" @click="changeId(o.id)">{{o.formname}}</span>
                    </el-menu-item>
                </el-menu>
            </el-col>
            <el-col :span="20":offset="1">
                <!--表格树内容栏-->
                <el-row style="width:1000px;margin-left: 15%;margin-top: 20px;">
                    <el-form label-width="100px">
                        <el-form-item
                            v-for="(value, key) in searchForm"
                            :label="'检索条件：'">
                            <el-select style="width: 300px;float: left;" v-model="value.type" placeholder="请选择">
                                <el-option
                                    v-for="item in showEditor"
                                    :key="item.model"
                                    :label="item.name" :value="item.model">
                                </el-option>
                            </el-select>
                            <el-input style="width: 400px;margin-left:10px;float: left;" v-model="value.value"></el-input>
                            <el-button type="danger" icon="el-icon-delete" circle v-if="key!=0" style="margin-left:10px;float: left;" @click.prevent="removeSearch(value)"></el-button>
                        </el-form-item>
                        <el-form-item style="text-align: left;">
                            <el-button type="success" @click="getPage">检索</el-button>
                            <el-button type="primary" @click="exportToExcel">导出excel</el-button>
                            <el-button @click="addSearch">增加检索条件</el-button>
                        </el-form-item>
                    </el-form>
                </el-row>
                <hr>
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
            </el-col>
        </el-row>

        <el-dialog @on-close="dialogVisible = false" title='编辑数据' width="60%" top="15px" :visible.sync="dialogVisible">
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
            <el-button @click="saveInfo()" type="primary" plain>保存表单</el-button>
            <el-button @click="clearInfo()" type="warning" plain>清空表单</el-button>
            <el-button @click="closeInfo()" type="info" plain>取消</el-button>
        </el-dialog>
    </div>
</template>

<script>
  import {
    GenerateForm,
  } from 'form-making'
  import 'form-making/dist/FormMaking.css'
  export default {
    components:{
      GenerateForm
    },
    name: "formSearch",
    data() {
      return {
        formListId:1,
        tableData:[],
        jsonData:JSON.parse('{"list":[],"config":{"labelWidth":100,"labelPosition":"right","size":"small","customClass":""}}'),
        jsonValue:JSON.parse('{}'),
        dialogVisible:false,
        editDataId:null,
        page:1,
        pageSize:10,
        totalSizes:0,
        columnFilters:{
          objId:{
            name:"objId",
            value:0
          },
          content:{
            name:"content",
            value:''
          }
        },
        hackSet:false,
        showEditor:[],
        searchForm:[{
          type:'',
          value:''
        }],
        filterVal:null,
        tHeader:null,
        disc:null,
        leftList:[]
      }
    },
    methods: {
      exportToExcel() {
        //excel数据导出
        require.ensure([], () => {
          const { export_json_to_excel } = require('../../Excel/Export2Excel.js');
          let form = JSON.parse(JSON.stringify(this.searchForm));
          let res = []
          form.forEach((v,k)=>{
            if(v.type != ''&&v.value != ''){
              let t = "content->'$."+v.type + "' like "+"'%"+v.value+"%'"
              res.push(t)
            }
          })
          let str = res.join(" and ");
          this.columnFilters.content.value = str;
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
      addSearch(){
        this.searchForm.push({
          value: '',
          type: ''
        });
      },
      removeSearch(item){
          var index = this.searchForm.indexOf(item)
          if (index !== -1) {
            this.searchForm.splice(index, 1)
          }
      },
      getPage(){
        let id = this.formListId;
        this.columnFilters.objId.value = id;
        this.columnFilters.content.value = '';
        let form = JSON.parse(JSON.stringify(this.searchForm));
        let res = []
        form.forEach((v,k)=>{
          if(v.type != ''&&v.value != ''){
            let t = "content->'$."+v.type + "' like "+"'%"+v.value+"%'"
            res.push(t)
          }
        })
        let str = res.join(" and ");
        this.columnFilters.content.value = str;
        let params = {
          'page':this.page,
          'pageSize':this.pageSize,
          'columnFilters':this.columnFilters,
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
      saveInfo(){
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
        this.$nextTick(_ => {
          this.$refs.generateForm.reset()
        })
      },
      closeInfo(){
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
      getCases(){
        let params = {
          'page':1,
          'pageSize':100,
        }
        this.$api.form.findPage(params).then((res) => {
          this.leftList = res.data.content;
          console.log(this.leftList)
        })
      },
      changeId(id){
        this.formListId = id;
        this.getPage();
        this.getInfo();
        this.getCases();
      }
    },
    mounted() {
      this.formListId = (typeof(this.$route.query.id) != 'undefined')?this.$route.query.id:1;
      this.getPage();
      this.getInfo();
      this.getCases();
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
