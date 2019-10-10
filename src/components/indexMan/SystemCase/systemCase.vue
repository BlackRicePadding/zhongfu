<template>
    <el-row style="width:98%;margin-top:15px;margin-left: 1%;">
        <el-col style="margin-top: 10px;padding-right: 10px;" :span="6" v-for="(o, index) in projects">
            <el-card :body-style="{ padding: '0px' }">
                <el-row>
                    <el-col :span="10" class="circle">
                    </el-col>
                    <el-col :span="10">
                        <el-row class="case-title">{{o.formname}}</el-row>
                        <el-row class="case-time">{{doTime(o.updatetime)}}</el-row>
                    </el-col>
                    <el-col :span="2">
                        <el-dropdown trigger="click" placement="bottom" style="float:right;margin-right: 13px;margin-top: 13px;">
                            <span style="float:right" class="el-dropdown-link">
                            · · ·
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item @click.native="handleForm(o.content,o.id)" divided>编辑病例</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-col>
                </el-row>
            </el-card>
        </el-col>
        <el-dialog title="编辑表单" width="99%" top="15px" :visible.sync="dialogVisibleInfo">
            <fm-making-form
                ref="makingform"
                style="height: 700px;text-align: left;"
            >
            </fm-making-form>
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
            <fm-generate-form
                :data="jsonData"
                ref="generateForm"
                style="text-align: left;"
            >
            </fm-generate-form>
        </el-dialog>
    </el-row>
</template>

<script>
  export default {
    data () {
      return {
        page:1,
        pageSize: 1000,
        projects:[],
        jsonData:[],
        dialogVisibleInfo:false,
        dialogVisibleShowInfo:false,
        editId:0,
      }
    },
    mounted(){
      this.getIndexInfo()
    },
    methods :{
      getIndexInfo() {
        let params = {
          'page':this.page,
          'pageSize':this.pageSize,
        }
        this.$api.form.findPage(params).then((res) => {
          this.projects = res.data.content;
          console.log(this.projects)
        })
      },
      handleForm(content,id){
        this.editId = id;
        let t = JSON.parse(content);
        this.dialogVisibleInfo = true;
        this.$nextTick(_ => {
          this.$refs.makingform.setJSON(t)
        })
      },
      saveInfo(){
        let data = {
          id:this.editId,
          content: JSON.stringify(this.$refs.makingform.getJSON())
        }
        this.$api.form.save(data).then((res) => {
          if(res.code == 200&&res.data == 1){
            this.$message({
              type: 'success',
              message: '保存成功'
            });
            this.dialogVisibleInfo = false;
            this.getIndexInfo();
          }
        })
      },
      showInfo(){
        this.jsonData = [];
        this.jsonData = this.$refs.makingform.getJSON()
        this.dialogVisibleShowInfo = true;
      },
      closeInfo(){
        this.dialogVisibleInfo = false;
        this.editId = 0;
      },
      doTime(time){
        let d = new Date(time);
        return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
      }
    }
  }
</script>

<style scoped>
.circle{
    width:149px;
    height:149px;
    /*border-radius:50%;*/
    font-size:45px;
    color:#fff;
    line-height: 149px;
    text-align:center;
    background: url('../../../assets/timg.jpg') no-repeat;
    background-size: 100% auto;
    margin: 20px;
}
.case-title{
    font-size: 16px;
    font-weight: 700;
    margin-top: 40px;
}
.case-time{
    font-size: 14px;
    font-weight: 500;
    margin-top: 10px;
}
</style>