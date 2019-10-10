<template>
  <div class="page-container">
      <GenerateForm
          :data="jsonData"
          :value="jsonValue"
          ref="generateForm"
          class="ger"
      >
      </GenerateForm>
      <hr class="show-hr">
      <el-button @click="saveInfo()" type="primary" plain>保存表单</el-button>
      <el-button @click="clearInfo()" type="warning" plain>清空表单</el-button>
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
    name: "formInput",
    data() {
      return {
        formListId:1,
        tableData:[],
        jsonData:JSON.parse('{"list":[],"config":{"labelWidth":100,"labelPosition":"right","size":"small","customClass":""}}'),
        jsonValue:JSON.parse('{}'),
        columnFilters:{
          objId:{
            name:"objId",
            value:0
          }
        }
      }
    },
    methods: {
      getForm(){
        let params = {
          'id':this.formListId
        }
        this.$api.form.findById(params).then((res) => {
          this.jsonData = JSON.parse(res.data.content);
        })
      },
      saveInfo(){
        let res = null;
        this.$refs.generateForm.getData().then(data => {
          res = data;
          let temp = {
            objid:this.formListId,
            content: JSON.stringify(res)
          }
          this.$api.form.saveData(temp).then((res) => {
            if(res.code == 200&&res.data == 1){
              this.$message({
                type: 'success',
                message: '保存成功 '
              });
              this.dialogVisible = false;
              this.clearInfo()
            }
          })
        }).catch(e => {
          this.$message('数据校验失败 请检查输入的数据')
          return false;
        })
      },
      clearInfo(){
        this.$refs.generateForm.reset()
      }
    },
    mounted() {
      this.formListId = (typeof(this.$route.query.id) != 'undefined')?this.$route.query.id:1;
      this.getForm();
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
