<template>
    <div>
        <div id="TrendInfoEcharts" :style="{position: 'absolute',width: 'calc(98.6% + 8px)', height: '300px'}"></div>
    </div>
</template>

<script>
export default {
    name: 'TaskInfo',
    data () {
        return {
          type:1,
          chartData:{
            count:[],
            name:[]
          }
        }
    },
    components:{
    },
    mounted(){
        this.getDataCharts();
    },
    methods: {
        getDataCharts(){
          let params = {
            type:this.type
          }
          this.$api.intro.indexFour(params).then((res) => {
            if(res.code == 200){
              // console.log(res.data)
              let drawData = res.data;
              this.cleanCharData();
              drawData.forEach((v,k) => {
                this.chartData.count.push(v.value)
                this.chartData.type.push(v.name)
              });
              this.drawLine()
            }
          })
        },
        cleanCharData(){
          this.chartData.count = [];
          this.chartData.type = [];
        },
        drawLine(){
          // 基于准备好的dom，初始化echarts实例
          let myChart = echarts.init(document.getElementById('TrendInfoEcharts'))

          // 绘制图表
          myChart.setOption({
            tooltip: {
              trigger: 'axis'
            },
            xAxis: [{
              type: 'category',
              boundaryGap: false,
              data: this.chartData.type,
              axisLine: {
                lineStyle: {
                  color: "#999"
                }
              },
              axisLabel :{
                interval:0
              }
            }],
            yAxis: [{
              type: 'value',
              splitNumber: 4,
              max: function(value) {
                return value.max + 2;
              },
              splitLine: {
                lineStyle: {
                  type: 'dashed',
                  color: '#DDD'
                }
              },
              axisLine: {
                show: false,
                lineStyle: {
                  color: "#333"
                },
              },
              nameTextStyle: {
                color: "#F95D01"
              },
              splitArea: {
                show: false
              }
            }],
            series: [{
              name: '数据',
              type: 'line',
              data: this.chartData.count,
              lineStyle: {
                normal: {
                  width: 4,
                  color: {
                    type: 'linear',
                    colorStops: [{
                      offset: 0,
                      color: '#FFE046'
                    }, {
                      offset: 1,
                      color: '#FB5F04'
                    }],
                    globalCoord: true
                  },
                  shadowColor: '#FFF3E7',
                  shadowBlur: 10,
                  shadowOffsetY: 20
                }
              },
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {offset: 0, color: '#FFF9F4'},
                    {offset: 0, color: '#FFF7F3'}
                  ], false),
                  shadowColor: '#FFF7F3',
                  shadowBlur: 10
                }
              },
              itemStyle: {
                normal: {
                  borderWidth: 5,
                  borderColor: "#f00"
                }
              },
              smooth: true
            }]
          });
        }
    }
}
</script>

<style scoped>
    .dates {
        margin-top: 10px;
        margin-right: 8%;
        position: relative;
        z-index: 10;
        float: right;
        list-style:none;
    }
    .dates > li {
        line-height: 25px;
        float: left;
        margin-right: 15px;
        cursor: pointer;
    }
    .date_hover {
        border-bottom: 2px solid #409EFF !important;
        color: #409EFF !important;
    }
</style>
