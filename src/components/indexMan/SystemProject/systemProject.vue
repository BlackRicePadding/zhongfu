<template>
    <div>
        <el-row>
            <span class="project-name"><div class="project-logo"></div><div style="float: left;">东南大学附属中大医院糖尿病研究型数据库</div></span>
        </el-row>
        <el-row style="width:98%;margin-top:15px;margin-left: 1%;">
            <el-col style="margin-top: 10px;padding-right: 10px;"  v-for="(o, index) in projects" :span="6" :offset="index%3 == 0?2:1" >
                <el-card :body-style="{ padding: '0px' }">
                    <el-row slot="header" class="clearfix">
                        <span style="font-size: 20px;">{{o.name}}</span>
                        <el-dropdown trigger="click" placement="bottom" style="float:right;margin-right: 13px;">
                        <span style="font-width:900;float:right" class="el-dropdown-link">
                        · · ·
                        </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item @click.native="turnToFS(o.id)" divided>访期/周期</el-dropdown-item>
                                <el-dropdown-item @click.native="handleForm(o.content,o.id)" divided>受试者人员</el-dropdown-item>
                                <el-dropdown-item @click.native="editProject(o)" divided>项目设置</el-dropdown-item>
                                <el-dropdown-item @click.native="removeProject(o)" divided>项目删除</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-row>
                    <el-row  @click.native="showDrawer">
                        <el-row>
                            <div class="circle_info">
                            </div>
                        </el-row>
                        <el-row class="project-title">{{o.flag}}</el-row>
                        <el-row class="project-l">总病历/人</el-row>
                    </el-row>
                </el-card>
            </el-col>
            <el-col @click.native="addProject" style="margin-top: 10px;padding-right: 10px;" :span="6" :offset="projects.length%3 == 0?2:1" >
                <el-card :body-style="{ padding: '0px' }">
                    <el-row slot="header" class="clearfix">
                        <span style="font-size: 20px;">新增项目</span>
                    </el-row>
                    <el-row>
                        <el-row>
                            <div class="circle_add">
                            </div>
                        </el-row>
                        <el-row class="project-title">NEW</el-row>
                        <el-row class="project-l">新增项目</el-row>
                    </el-row>
                </el-card>
            </el-col>
            <el-dialog @on-close="dialogVisible = false" :title="!editId ? '新增项目' : '编辑项目'" width="40%" top="15px" :visible.sync="dialogVisible">
                <el-form ref="ruleForm" :rules="rules" :model="editData" label-width="80px">
                    <el-form-item label="项目名称" prop="name">
                        <el-input v-model="editData.name"></el-input>
                    </el-form-item>
                    <el-form-item label="项目类型">
                        <el-select v-model="editData.types" placeholder="请选择">
                            <el-option
                                v-for="item in types"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="项目编号" prop="encoded">
                        <el-input v-model="editData.encoded"></el-input>
                    </el-form-item>
                    <el-form-item label="活动描述">
                        <el-input type="textarea" v-model="editData.decription"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit('ruleForm')">立即创建</el-button>
                        <el-button @click="closeInfo">取消</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <el-drawer
                title="描述"
                :visible.sync="drawer">
            </el-drawer>
        </el-row>
    </div>
</template>

<script>
  export default {
    data () {
      return {
        page:1,
        pageSize: 1000,
        projects:[],
        dialogVisible:false,
        drawer:false,
        editId:null,
        editData:{
          'name':null,
          'decription':null,
          'types':1,
          'encoded':null,
          'id':null,
        },
        rules: {
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'},
            {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
          ],
          encoded: [
            {required: true, message: '请输入编号', trigger: 'blur'},
            {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
          ],
        },
        types:{}
      }
    },
    mounted(){
      this.getIndexInfo();
      this.getProjectType();
    },
    methods :{
      getIndexInfo() {
        let params = {
          'page':this.page,
          'pageSize':this.pageSize,
        }
        this.$api.project.findPage(params).then((res) => {
          this.projects = res.data.content;
        })
      },
      turnToFS(id){
        this.$router.push({ path: '/SystemProjectSF?id='+id})
      },
      getProjectType() {
        let params = {
          'page':this.page,
          'pageSize':this.pageSize,
        }
        this.$api.project.findType(params).then((res) => {
          this.types = res.data.content;
        })
      },
      addProject(){
        this.editId = null;
        this.dialogVisible = true;
        this.editData = { 'name':null, 'decription':null, 'types':1, 'encoded':null, 'id':null}
      },
      editProject(o){
        this.editId = o.id;
        this.dialogVisible = true;
        this.editData = { 'name':o.name, 'decription':o.decription, 'types':o.types, 'encoded':o.encoded, 'id':o.id}
      },
      removeProject(){

      },
      onSubmit(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$api.project.save(this.editData).then((res) => {
              if(res.code == 200&&res.data == 1){
                this.$message({
                  type: 'success',
                  message: '保存成功'
                });
                this.dialogVisible = false;
                this.getIndexInfo();
              }
            })
          } else {
            return false;
          }
        });
      },
      closeInfo(){
        this.dialogVisible = false;
        this.editId = null;
      },
      showDrawer(){
        this.drawer = true;
      }
    }
  }
</script>

<style scoped>
    .circle_info{
        width:260px;
        height:230px;
        /*border-radius:50%;*/
        font-size:45px;
        color:#fff;
        line-height: 149px;
        text-align:center;
        background: url('../../../assets/project/info-1.png') no-repeat;
        background-size: 100% auto;
        margin: 15px auto 0 auto;
    }
    .circle_add{
        width:230px;
        height:230px;
        /*border-radius:50%;*/
        font-size:45px;
        color:#fff;
        line-height: 149px;
        text-align:center;
        background: url('../../../assets/project/add.png') no-repeat;
        background-size: 100% auto;
        margin: 15px auto 0 auto;
    }
    .project-title{
        font-size: 45px;
        font-weight: 700;
        color: #F9AF41;
    }
    .project-l{
        font-size: 20px;
        font-weight: 500;
        margin-top: 10px;
        margin-bottom: 13px;
    }
    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both
    }
    .project-title-logo {
        width:200px;
        height:200px;
        line-height: 149px;
        background: url('../../../assets/project/add.png') no-repeat;
    }
    .project-name{
        font-size: 36px;
        font-weight: 700;
        line-height: 150px;
        float: left;
        margin-left: 260px;
    }
    .project-logo{
        width:100px;
        height:100px;
        float: left;
        line-height: 300px;
        margin-top: 28px;
        margin-right: 6px;
        margin-left: 40px;
        background: url('../../../assets/logo-2.png') no-repeat;
    }
</style>