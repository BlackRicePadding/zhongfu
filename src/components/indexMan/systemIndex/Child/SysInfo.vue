<template>
    <el-row>
        <div class="object-info" style="height: 180px;">
            <div style="width: 100%;height: 20px;"></div>
            <el-row :gutter="20">
                <el-col v-for="(value, key) in data" :lg="6" :md="6" :xs="24" :sm="24">
                    <div style="width: 60%;margin: 0 auto 20px">
                        <ul>
                            <li>
                                <div class="title-div">{{value.name}}</div>
                                <div class="count-div">(<span class="red">{{value.value}}</span>)个</div>
                                <div style="clear: both;"></div>
                            </li>
                        </ul>
                    </div>
                </el-col>
            </el-row>
        </div>
    </el-row>
</template>

<script>
export default {
    name: 'SysInfo',
    data () {
        return {
          data:[]
        }
    },
    components:{
    },
    mounted(){
      this.getDataCharts()
    },
    methods: {
      getDataCharts(){
        let params = {
          type:this.type
        }
        this.$api.intro.indexFour(params).then((res) => {
          if(res.code == 200){
            this.data = res.data
            console.log(this.data,"11111111111")
          }
        })
      },
    }
}
</script>

<style scoped>
    li{
        height: 38px;
        line-height: 38px;
        font-size: 14px;
        border-bottom: 1px solid #f5f5f5;
    }
    li:hover{
        color: #33c6c3;
        cursor: pointer;
    }
    .title-div{
        float: left;
        text-align: left;
    }
    .count-div{
        float: right;
    }
</style>
