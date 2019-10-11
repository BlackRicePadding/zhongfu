<template>
    <div>
        <el-row style="margin-top: 30px;">
            <el-col :span="4" :offset="1">
                <el-tabs style="height: 800px;"  type="border-card">
                    <el-steps style="height: 750px;" direction="vertical" :active="active" finish-status="success">
                        <template v-for="(o,i) in projectData.remarks" >
                            <el-step @click.native="check(oc,getIndex(i,ic))" v-for="(oc,ic) in o.child" :title="o.name+' '+oc.name"></el-step>
                        </template>
                    </el-steps>
                </el-tabs>
            </el-col>
            <el-col :span="17" :offset="1">
                <el-tabs style="height: 800px;" type="border-card">
                    <el-tab-pane v-if="active>=0" style="height: 700px;" label="选择" >
                        <el-row>
                            <el-checkbox-group v-model="checkList">
                                <el-checkbox style="width: 22%; text-align: left;float: left;margin-top: 10px;" v-for="(o,i) in indexFormList" :label="o.name" border></el-checkbox>
                            </el-checkbox-group>
                        </el-row>
                        <el-row v-if="active>=0" style="position: absolute;bottom: 0px;right: 30px;">
                            <el-button type="primary" @click="save">保存</el-button>
                        </el-row>
                    </el-tab-pane>
                </el-tabs>
            </el-col>
        </el-row>
    </div>
</template>

<script>
  export default {
    data () {
      return {
        projectId:1,
        active: -1,
        activeName: 'active1',
        projectData:{
          "remarks":[]
        },
        defaultProps:{
          'children':'child'
        },
        hasCheckList:false,
        checkList:[],
        checkChild:[],
        indexFormList: [
          { id: "1", name: "病例筛选登记表",valueFalg:"0", deleteFalg:"0", sortFalg:"0" },
          { id: "2", name: "基本信息",valueFalg:"0", deleteFalg:"0", sortFalg:"0"  },
          { id: "3", name: "人口学资料",valueFalg:"0", deleteFalg:"0", sortFalg:"0"  },
          { id: "4", name: "就诊信息",valueFalg:"0", deleteFalg:"0", sortFalg:"0"  },
          { id: "5", name: "诊断信息",valueFalg:"0", deleteFalg:"0", sortFalg:"0"  },
          { id: "6", name: "家族史",valueFalg:"0", deleteFalg:"0", sortFalg:"0"  },
          { id: "7", name: "临床事件记录",valueFalg:"0", deleteFalg:"0", sortFalg:"0"  },
          { id: "8", name: "生活方式信息",valueFalg:"0", deleteFalg:"0", sortFalg:"0"  },
          { id: "9", name: "体格检查",valueFalg:"0", deleteFalg:"0", sortFalg:"0"  },
          { id: "10", name: "生命体征",valueFalg:"0", deleteFalg:"0", sortFalg:"0"  },
          { id: "11", name: "实验室检查",valueFalg:"0", deleteFalg:"0", sortFalg:"0"  },
          { id: "12", name: "治疗现状",valueFalg:"0", deleteFalg:"0", sortFalg:"0"  },
          { id: "13", name: "门诊手术和有创操作",valueFalg:"0", deleteFalg:"0", sortFalg:"0"  },
          { id: "14", name: "低血糖问卷",valueFalg:"0", deleteFalg:"0", sortFalg:"0"  },
          { id: "15", name: "不良事件记录",valueFalg:"0", deleteFalg:"0", sortFalg:"0"  }
        ]
      }
    },
    mounted(){
      this.projectId = (typeof(this.$route.query.id) != 'undefined')?this.$route.query.id:1;
      this.getIndexInfo();
      // this.check(this.projectData.remarks[0].child[0],0);
    },
    methods :{
      check(o,i){
        this.active = i;
        this.checkList = [];
        this.checkChild = o;
        if(o.content == null||o.content == ''){
          return;
        }
        o.content = JSON.parse(o.content);
        if(o.content!=[] && o.content!= null &&o.content != ''&&o.content != '"[]"'){
          o.content.forEach((o,i)=>{
            this.checkList.push(o.name)
          })
        }
      },
      save(){
        this.checkChild.content = [];
        this.checkList.forEach((o,i)=>{
            this.indexFormList.forEach((value,index)=>{
              if(value.name == o){
                this.checkChild.content.push(value);
              }
            })
        })
        if(this.checkChild.content.length == 0){
          this.checkChild.content = null;
        }
        this.projectData.objid = this.projectId;
        this.$api.project.saveFollow(this.projectData).then((res) => {
          this.$message('保存成功！');
          this.getIndexInfo();
        })
      },
      clear(){
        this.getIndexInfo();
      },
      getIndexInfo() {
        let params = {
          'id':this.projectId,
        }
        this.$api.project.findByid(params).then((res) => {
          this.projectData.remarks = res.data;
        })
      },
      getIndex(index,cindex){
        if(index == 0){
          return 0;
        }else if(index == 1){
          return 1 + cindex;
        }else {
          return 5 + cindex
        }
      }
    }
  }
</script>

<style scoped>
    .circle_info{
        width:200px;
        height:200px;
        /*border-radius:50%;*/
        font-size:45px;
        color:#fff;
        line-height: 149px;
        text-align:center;
        background: url('../../../assets/project/info.png') no-repeat;
        background-size: 100% auto;
        margin: 20px;
    }
    .circle_add{
        width:200px;
        height:200px;
        /*border-radius:50%;*/
        font-size:45px;
        color:#fff;
        line-height: 149px;
        text-align:center;
        background: url('../../../assets/project/add.png') no-repeat;
        background-size: 100% auto;
        margin: 20px;
    }
    .project-title{
        font-size: 45px;
        font-weight: 700;
        color: #F9AF41;
        margin-top: 80px;
    }
    .project-l{
        font-size: 20px;
        font-weight: 500;
        margin-top: 10px;
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
    .tree-button{
        padding: 3px;
    }
</style>