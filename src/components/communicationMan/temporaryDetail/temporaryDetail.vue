<template>
    <div id="temporaryDetail">
        <div class="pad-title">
            <span>{{sonArr.row.name}}</span><span style="margin-left: 15px;">({{sonArr.row.count}})人</span>
            <el-button @click="Back()" style="position: absolute; right: 10px; top: 3px; ">返回</el-button>
            <!--<el-popover-->
                <!--placement="bottom"-->
                <!--style="position: absolute;top: 3px;right: 15px;"-->
                <!--width="350"-->
                <!--trigger="click">-->
                <!--<el-form :inline="true" :model="formInline" class="demo-form-inline" style="text-align: left;margin-top: 25px;">-->
                    <!--<el-form-item label="用户姓名" style="margin-left: 25px" prop="name">-->
                        <!--<el-input v-model="formInline.name" @keyup.native="validateX" @keydown.native="validateX" style="width: 220px;" placeholder="请输入用户姓名"></el-input>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="注册时间" style="margin-left: 25px;">-->
                        <!--<el-date-picker-->
                            <!--v-model="formInline['addTime']"-->
                            <!--type="date"-->
                            <!--placeholder="选择日期"-->
                            <!--value-format="yyyy-MM-dd">-->
                        <!--</el-date-picker>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item style="margin-left: 94px;">-->
                        <!--<el-button type="primary" plain size="medium" @click="onSelect">搜索</el-button>-->
                        <!--<el-button size="medium" @click="onReset">重置</el-button>-->
                    <!--</el-form-item>-->
                <!--</el-form>-->
                <!--<el-button slot="reference">筛选</el-button>-->
            <!--</el-popover>-->
        </div>
        <div class="content">
            <div style="height: 20px;"></div>
            <div class="table-content">
                <el-table
                    ref="multipleTable"
                    :data="tableData"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleSelectionChange">
                    <el-table-column
                        align="center"
                        header-align="center"
                        label="序号"
                        type="index"
                        width="80"
                        :index="indexMethod">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        header-align="center"
                        prop="name"
                        label="姓名"
                        min-width="130">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        header-align="center"
                        prop="duties"
                        label="职务"
                        min-width="100">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        header-align="center"
                        prop="departmentName"
                        label="部门名称"
                        min-width="130">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        header-align="center"
                        prop="phone"
                        label="手机号"
                        min-width="130">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        header-align="center"
                        prop="lastTime"
                        label="最后修改时间"
                        min-width="170">
                    </el-table-column>
                </el-table>
            </div>
            <div class="block">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage1"
                    :page-sizes="[10, 15, 20]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total1">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "temporaryDetail",
        props: ['sonArr'],
        data() {
            return {
                formInline: {
                    name: '',
                    addTime: ''
                },
                tableData: [],
                multipleSelection: {
                    id: []
                },
                // 分页数据
                total1: 0,
                currentPage1: 1,
                pageSize: 10,
                arr: [],
                id: '',
                bol: this.sonArr.bol,
                row: this.sonArr.row,
            }
        },
        methods: {
            // 分页
            handleSizeChange(pageSize) { // 每页条数切换
                this.pageSize = pageSize;
                this.handleCurrentChange(this.currentPage1);
            },
            handleCurrentChange(currentPage) {//页码切换
                this.currentPage1 = currentPage;
                this.tableList();
            },
            // 自定义序号
            indexMethod(index) {
                return index + 1;
            },
            onSelect() {
                this.selectEmployees();
            },
            onReset() {
                this.formInline['name'] = '';
                this.formInline['addTime'] = '';
                this.selectEmployees();
            },
            validateX() {
                this.formInline.name = this.valid.ValidateValue(this.formInline.name);
            },
            // 复选框被勾选时的回调
            handleSelectionChange(val) {
                this.multipleSelection.id = [];
                for (let i = 0,length = val.length; i < length; i++) {
                    this.multipleSelection.id.push(val[i]['id'])
                }
            },
            tableList() {
                let tt = this.setTime.transformTime(this.formInline['addTime']);
                this.$api.decision.selectEmployeesGroup.request({},
                    {restUrl: `${this.row.id}?page=${this.currentPage1 - 1}&&size=${this.pageSize}&&name=${this.formInline['name']}&&addTime=${tt}`}).then((data) => {
                    this.tableData = data.data.data;
                    this.total1 = data.data.total;
                    this.transform(data);
                }).catch((err) => {
                    console.log(err);
                });
            },
            // 查询接口
            selectEmployees() {
                let tt = this.setTime.transformTime(this.formInline['addTime']);
                this.$api.decision.selectEmployeesGroup.request({},
                    {restUrl: `${this.row.id}?page=${0}&&size=${this.pageSize}&&name=${this.formInline['name']}&&addTime=${tt}`}).then((data) => {
                    this.tableData = data.data.data;
                    this.total1 = data.data.total;
                    this.transform(data);
                }).catch((err) => {
                    console.log(err);
                });
            },
            transform(data) {
                for (let i = 0, length = data.data.data.length; i < length; i++) {
                    if (this.tableData[i]['lastTime']) {
                        this.tableData[i]['lastTime'] = this.tableData[i]['lastTime'].split('T')[0] +
                            " " + this.tableData[i]['lastTime'].split('T')[1].split('+')[0];
                    }
                }
            },
            Back() {
                this.$emit('temporaryListen', 1);
            }
        },
        mounted() {
            this.tableList();
        },
    }
</script>

<style scoped>
    .head{
        height: 60px;
        line-height: 60px;
        padding: 0 10px;
    }
    .head-left{
        float: left;
    }
    .head-right{
        float: right;
    }
    .table-content{
        padding: 0 10px;
    }
    .block {
        position: fixed;
        width: 100%;
        background: #f8f8f8;
        bottom: 0;
        right: 0;
        padding-right: 20px;
        height: 47px;
        line-height: 47px;
        z-index: 20;
    }
</style>