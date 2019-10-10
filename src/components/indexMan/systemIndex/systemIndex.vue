<template>
    <div class="page-container" style="width:99%;margin-top:15px;">
        <el-row class="top-info">
            <el-col :span="6">
                <div class="top-panel blue">
                    <div class="title">备份人数：</div>
                    <div class="info">{{ topinfo.backPeopleSize }}</div>
                </div>
            </el-col>

            <el-col :span="6">
                <div class="top-panel red">
                    <div class="title">人员数量：</div>
                    <div class="info">{{ topinfo.poopleSize }}</div>
                </div>
            </el-col>

            <el-col :span="6">
                <div class="top-panel green">
                    <div class="title">备份表单数：</div>
                    <div class="info">{{ topinfo.backFormSize }}</div>
                </div>
            </el-col>

            <el-col :span="6">
                <div class="top-panel purple">
                    <div class="title">使用表单数：</div>
                    <div class="info">{{ topinfo.formSize }}</div>
                </div>
            </el-col>
        </el-row>
        <el-row class="charts-info">
            <div class="charts-info-col">
                <div class="charts-header">
                    <span class="charts-l"></span>
                    <span class="charts-name">表单</span>
                </div>
                <div class="charts-info-short">
                    <SysInfo></SysInfo>
                </div>
            </div>
        </el-row>

        <el-row class="charts-info">
            <div class="charts-info-col long-long">
                <div class="charts-header">
                    <span class="charts-l"></span>
                    <span class="charts-name">人员</span>
                </div>
                <div class="charts-info-long">
                    <TrendInfo></TrendInfo>
                </div>
            </div>
        </el-row>
    </div>
</template>

<script>
  import SysInfo from './Child/SysInfo'
  import TrendInfo from './Child/TrendInfo'

  export default {
    components:{
      SysInfo:SysInfo,
      TrendInfo:TrendInfo,
    },
    data () {
      return {
        topinfo:{
          sbgqs:0,//设备光驱数
          pl:0,//盘篓
          sbkyp:0,//设备可用盘
          yyp:0,//已用盘
          ydzcs:0,//已打印总次数
          sbs:0,//失败数字
          kymbs:0,//可用模板数
          sqs:0,//授权数
        },
      }
    },
    mounted(){
      this.getIndexInfo()
    },
    methods :{
      getIndexInfo() {
        let params = {
          type:1
        }
        this.$api.intro.indexOne(params).then((res) => {
          if(res.code == 200){
            this.topinfo = res.data;
          }
        })
      }
    }
  }
</script>

<style scoped>
    .charts-info .charts-header {
        height: 35px;
        line-height: 35px;
        color:#000;
        padding-left: 6px;
        margin-top: 12px;
    }

    .charts-l {
        float: left;
        width: 4px;
        height: 30px;
        background: orange;
    }
    .charts-name {
        font-size:17px;
        float: left;
        margin-left:10px;
    }
    .charts-info-col {
        margin-top: 8px;
        margin-left: 8px;
        background: #fff;
        border-radius: 4px;
    }
    .charts-table {
        padding: 10px;
    }
    .long-short {
        width: 24.5%;
        float: left;
        max-height: 350px;
        /*min-width: 395px;*/
    }
    .long-mid {
        width: 36.8%;
        float: left;
        max-height: 350px;
        /*min-width: 600px;*/
    }
    .long-long {
        width: calc(73.6% + 8px);
        float: left;
        max-height: 600px;
    }
    .top-panel {
        margin-bottom: 8px;
        border: none;
        cursor: pointer;
        border-radius: 10px;
        padding: 10px 15px;
        margin-left: 7px;
        background: #3f393b;
        color: #fff;

    }
    .top-panel .title {
        margin-top: 2px;
        font-size: 18px;
        text-align: left;
    }
    .top-panel .info {
        margin-top: 8px;
        font-size: 29px;
        text-align: left;
    }
    .blue {
        background: url('../../../assets/top-panel/blue.png') center;
        background-size: 100%;
    }
    .red {
        background: url('../../../assets/top-panel/red.png') center;
        background-size: 100%;
    }
    .green {
        background: url('../../../assets/top-panel/green.png') center;
        background-size: 100%;
    }
    .purple {
        background: url('../../../assets/top-panel/purple.png') center;
        background-size: 100%;
    }
</style>