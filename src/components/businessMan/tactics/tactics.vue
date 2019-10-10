<template>
    <div id="tactics">
        <div class="lar-title">
            <span class="lar-span">策略管理</span>
        </div>
        <div class="pad">
            <p>策略配置</p>
            <div class="content">
                <div class="head">
                    <div class="head-left">
                        <el-form :inline="true" :model="formInline" class="demo-form-inline" style="height: 60px">
                            <el-form-item label="" style="margin-bottom: 0;">
                                <el-input v-model="formInline.user" placeholder="请输入搜索关键字"
                                          style="margin-top: 10px;"></el-input>
                            </el-form-item>
                            <el-form-item style="margin-bottom: 0;margin-top: 10px;">
                                <el-button type="success" @click="onSelect">搜索</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="head-right">
                        <el-button type="primary" @click="onAdd">添加</el-button>
                        <el-button type="danger" @click="onDelete">删除</el-button>
                    </div>
                    <div style="clear: both"></div>
                </div>
                <div class="table-content">
                    <el-table
                        ref="multipleTable"
                        :data="tableData"
                        tooltip-effect="dark"
                        style="width: 100%"
                        @selection-change="handleSelectionChange">
                        <el-table-column
                            type="selection"
                            width="55">
                        </el-table-column>
                        <el-table-column
                            prop="name"
                            label="规则种类"
                            min-width="120">
                        </el-table-column>
                        <el-table-column
                            prop="rule"
                            label="创建用户"
                            min-width="120">
                        </el-table-column>
                        <el-table-column
                            prop="lastTime"
                            label="关键词"
                            min-width="120">
                        </el-table-column>
                        <el-table-column
                            prop="level"
                            label="保密级别"
                            min-width="120">
                            <template slot-scope="scope">
                                <el-rate
                                    v-model="scope.row.level"
                                    :colors="['#99A9BF', '#FF9900', '#F04844']"
                                    allow-half>
                                </el-rate>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="ipAddress"
                            label="IP地址"
                            min-width="150">
                        </el-table-column>
                        <el-table-column
                            prop="addTime"
                            label="创建时间"
                            min-width="170">
                        </el-table-column>
                        <el-table-column
                            prop="isStart"
                            min-width="150"
                            label="是否启用">
                            <template slot-scope="scope">
                                <el-switch v-model="scope.row.isStart"
                                           active-color="#13ce66"></el-switch>
                            </template>
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
        <el-dialog title="添加策略" :visible.sync="dialogFormVisible" center width="550px">
            <el-form :model="addForm">
                <el-form-item label="策略名称" :label-width="formLabelWidth">
                    <el-input v-model="addForm.tacticsName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="保密级别" :label-width="formLabelWidth">
                    <el-select v-model="addForm.secrecyLevel" placeholder="请选择活动区域">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="策略类型" :label-width="formLabelWidth">
                    <el-input v-model="addForm.tacticsType" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="关键词" :label-width="formLabelWidth">
                    <el-input v-model="addForm.keywords" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="标签描述" :label-width="formLabelWidth">
                    <el-input type="textarea" v-model="addForm.tagDesc" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "tactics",
        data() {
            return {
                dialogFormVisible: false,
                formLabelWidth: '100px',
                addForm: {
                    tacticsName: '',
                    secrecyLevel: '',
                    tacticsType: '',
                    keywords: '',
                    tagDesc: ''
                },
                formInline: {
                    departmentName: '',
                },
                tableData: [{
                    name: '标签1',
                    rule: '$Username$',
                    lastTime: '2018-11-16 11:11:11',
                    isStart: 1,
                },{
                    name: '标签1',
                    rule: '$Username$',
                    lastTime: '2018-11-16 11:11:11',
                    isStart: 1,
                },{
                    name: '标签1',
                    rule: '$Username$',
                    lastTime: '2018-11-16 11:11:11',
                    isStart: 1,
                },{
                    name: '标签1',
                    rule: '$Username$',
                    lastTime: '2018-11-16 11:11:11',
                    isStart: 1,
                },{
                    name: '标签1',
                    rule: '$Username$',
                    lastTime: '2018-11-16 11:11:11',
                    isStart: 1,
                },{
                    name: '标签1',
                    rule: '$Username$',
                    lastTime: '2018-11-16 11:11:11',
                    isStart: 1,
                },{
                    name: '标签1',
                    rule: '$Username$',
                    lastTime: '2018-11-16 11:11:11',
                    isStart: 1,
                },{
                    name: '标签1',
                    rule: '$Username$',
                    lastTime: '2018-11-16 11:11:11',
                    isStart: 1,
                },],
                multipleSelection: '',
                // 分页数据
                total1: 0,
                currentPage1: 1,
                pageSize: 10,
                arr: [],
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
                this.currentChangePage(this.arr,currentPage)
            },
            //分页方法
            currentChangePage(list,currentPage) {
                let from = (currentPage - 1) * this.pageSize;
                let to = currentPage * this.pageSize;
                this.tableData = [];
                for (; from < to; from++) {
                    if (list[from]) {
                        this.tableData.push(list[from]);
                    }
                }
            },
            onSelect() {
                console.log('submit!');
            },
            onAdd() {
                this.dialogFormVisible = true;
            },
            onDelete() {
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleEdit(index, row) {
                console.log(index, row);
            },
        }
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
    .block{
        float: none;
        margin-bottom: 150px;
    }
</style>