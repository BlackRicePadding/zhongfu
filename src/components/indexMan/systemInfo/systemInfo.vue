<template>
    <div id="systemInfo">
        <div class="lar-title">
            <span class="lar-span">系统信息</span>
        </div>
        <div class="pad">
            <div class="pad-title">系统信息</div>
            <div class="content">
                <div style="height: 20px;"></div>
                <table>
                    <tr>
                        <td>{{titleData[0]}}</td><td>{{contentData[0]}}</td>
                    </tr>
                    <tr>
                        <td>{{titleData[1]}}</td><td>{{contentData[1]}}</td>
                    </tr>
                    <tr>
                        <td>{{titleData[2]}}</td><td>{{contentData[2]}}</td>
                    </tr>
                    <tr>
                        <td>{{titleData[3]}}</td><td>{{contentData[3]}}</td>
                    </tr>
                    <tr>
                        <td>{{titleData[5]}}</td><td>{{contentData[5]}}</td>
                    </tr>
                    <tr>
                        <td>{{titleData[7]}}</td><td>{{contentData[7]}}</td>
                    </tr>
                    <tr>
                        <td>{{titleData[8]}}</td><td>{{contentData[8]}}</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "systemInfo",
        data() {
            return {
                titleData: [],
                contentData: []
            }
        },
        mounted() {
            this.$api.decision.systemInfo.request().then((data) => {
                const obj = JSON.parse(data.data.data);
                console.log(obj);
                Object.keys(obj).forEach((key)=>{
                    this.titleData.push(key);
                    this.contentData.push(obj[key])
                });
                this.listData = data.data;
            }).catch((err) => {
                console.log(err);
            });
        }
    }
</script>

<style scoped>
    table,table tr th, table tr td {
        border:1px solid #dddddd;
    }
    table {
        width: 80%;
        min-width: 600px;
        min-height: 25px;
        margin: 0 auto 250px;
        line-height: 25px;
        text-align: left;
        border-collapse: collapse;
        padding:2px;
    }
    td{
        padding: 10px 20px;
    }
</style>