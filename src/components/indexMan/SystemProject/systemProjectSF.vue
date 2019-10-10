<template>
    <div>
        <el-row>
            <el-col :span="14" :offset="1">
                <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane v-for="(o,index) in projectData.remarks" :key="index" :label="o.name" :name='"active"+index'>
                        <el-tree
                            :data="o.child"
                            :props="defaultProps"
                            :highlight-current="true"
                            node-key="name"
                            default-expand-all
                            @node-click="clickNode">
                            <div class="custom-tree-node" slot-scope="{ node, data}" style="width: 100%;">
                                <span style="float: left;">{{data.name}}</span>
                                <span style="float:right;margin-right: 20px;">
                                    <el-button class="tree-button" size="mini" icon="el-icon-edit" @click="editNode(node,data)" circle></el-button>
                                    <el-button class="tree-button" size="mini" type="danger"  @click="removeNode(node,data)" icon="el-icon-minus" circle></el-button>
                                    <el-button class="tree-button" size="mini" type="primary"  @click="addNode(node,data)" icon="el-icon-plus" circle></el-button>
                                </span>
                            </div>
                        </el-tree>
                        <el-divider/>
                        <el-row>
                            <el-button size="small" type="primary">保存</el-button>
                        </el-row>
                    </el-tab-pane>
                </el-tabs>
            </el-col>
            <el-col :span="8" :offset="1">
                <el-tabs type="border-card">
                    <el-tab-pane label="选择" >
                        <el-checkbox-group v-if="hasCheckList"  v-model="checkList">
                            <el-checkbox style="width: 40%; text-align: left;float: left;margin-top: 10px;" v-for="(o,i) in indexFormList" v-model="checkList" :label="o.name" border></el-checkbox>
                        </el-checkbox-group>
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
        activeName: 'active1',
        projectData:{
          "objid":this.projectId,
          "remarks":[{"name":"基线期","sort":"1","child":[{"name":"基线期一","sort":"1","child":[{"name":"基线期一1","sort":"1"},{"name":"基线期二1","sort":"2"}]},{"name":"基线期二","sort":"2"}]},{"name":"随访期","sort":"2","child":[{"name":"随访期一","sort":"1"},{"name":"随访期二","sort":"2"}]}]
        },
        defaultProps:{
          'children':'child'
        },
        hasCheckList:false,
        checkList:[],
        indexFormList: [
          { "index": "1", "name": "病例筛选登记表" },
          { "index": "2", "name": "基本信息" },
          { "index": "3", "name": "人口学资料" },
          { "index": "4", "name": "就诊信息" },
          { "index": "5", "name": "诊断信息" },
          { "index": "6", "name": "家族史" },
          { "index": "7", "name": "临床事件记录" },
          { "index": "8", "name": "生活方式信息" },
          { "index": "9", "name": "体格检查" },
          { "index": "10", "name": "生命体征" },
          { "index": "11", "name": "实验室检查" },
          { "index": "12", "name": "治疗现状" },
          { "index": "13", "name": "门诊手术和有创操作" },
          { "index": "14", "name": "低血糖问卷" },
          { "index": "15", "name": "不良事件记录" }
        ]
      }
    },
    mounted(){
      this.projectId = (typeof(this.$route.query.id) != 'undefined')?this.$route.query.id:1;
      this.getIndexInfo()
    },
    methods :{
      editNode(node,data){
        this.$prompt('请输入名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          data.name = value;
          this.$message({
            type: 'success',
            message: '修改成功'
          });
        });
      },
      removeNode(node,data){
        const parent = node.parent;
        const children = parent.data.child || parent.data;
        const index = children.findIndex(d => d.name === data.name);
        children.splice(index, 1);
      },
      addNode(node,data){
        this.$prompt('请输入名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          const parent = node.parent;
          const children = parent.data.child || parent.data;
          const index = children.findIndex(d => d.name === data.name);
          children.splice(index+1,0,{'name':value,'sort':children.length})
          this.$message({
            type: 'success',
            message: '修改成功'
          });
        });
      },
      clickNode(){
        this.hasCheckList = true;
      },
      handleClick(){
        this.hasCheckList = false;
      },
      getIndexInfo() {
        let params = {
          'id':this.projectId,
        }
        this.$api.project.findByid(params).then((res) => {

        })
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