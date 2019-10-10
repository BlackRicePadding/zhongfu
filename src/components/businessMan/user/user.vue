<template>
    <div id="user">
        <div class="lar-title">
            <span class="lar-span">用户管理</span>
        </div>
        <div class="pad">
            <p>
                <span>筛选查询</span>
                <el-button type="info" plain
                           @click="isOpen=!isOpen"
                           style="height: 25px;line-height: 25px;
                           padding: 0 5px;font-size: 12px;float: right;
                           margin-right: 10px;">
                    <span v-show="isOpen">关闭筛选</span>
                    <span v-show="!isOpen">打开筛选</span>
                </el-button>
            </p>
            <div class="content" v-show="isOpen">
                <div style="height:20px;"></div>
                <div class="select">
                    <el-form :inline="true" :model="formInline" class="demo-form-inline">
                        <el-form-item label="用户账号" style="margin-left: 25px">
                            <el-input v-model="formInline.user_account" placeholder="请输入用户账号"></el-input>
                        </el-form-item>
                        <el-form-item label="用户昵称" style="margin-left: 25px">
                            <el-input v-model="formInline.username" placeholder="请输入用户昵称"></el-input>
                        </el-form-item>
                        <el-form-item label="注册时间" style="margin-left: 25px;">
                            <el-input v-model="formInline.add_time" placeholder="请输入注册时间"></el-input>
                        </el-form-item>
                        <el-form-item style="display: block">
                            <el-button type="success" @click="onSubmit">搜索</el-button>
                            <el-button type="warning" @click="onReset">重置</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <p>用户管理</p>
            <div class="content">
                <div class="head">
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
        <!--打开添加用户窗口-->
        <el-dialog title="用户添加"
                   :visible.sync="dialogFormVisible"
                   @close="clearDia('addForm')"
                   width="550px"
                   center>
            <el-form :model="addForm" ref="addForm" class="demo-dynamic">
                <el-form-item label="成员名称" :label-width="formLabelWidth" prop="username">
                    <el-input v-model="addForm.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="成员姓名" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="addForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱地址" :label-width="formLabelWidth" prop="email">
                    <el-input v-model="addForm.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="所属部门" :label-width="formLabelWidth" prop="department">
                    <el-select v-model="addForm.department" placeholder="请选择所属部门">
                        <el-option label="科研部" value="1"></el-option>
                        <el-option label="测试部" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="登陆密码" :label-width="formLabelWidth" prop="password">
                    <el-input v-model="addForm.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" :label-width="formLabelWidth" prop="password2">
                    <el-input v-model="addForm.password2" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注信息" :label-width="formLabelWidth" prop="remarks">
                    <el-input type="textarea" v-model="addForm.remarks"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible=false">取 消</el-button>
                <el-button type="primary" @click="onSubmit">确 定</el-button>
            </div>
        </el-dialog>
        <!--打开删除窗口-->
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%">
            <span>你确定要删除这些数据吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmDelete()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "user",
        data() {
            return {
                formInline: {
                    user_account: '',
                    username: '',
                    add_time: ''
                },
                isOpen: 1,
                dialogVisible: false,
                dialogFormVisible: false,
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                tableData: [],
                multipleSelection: {
                    id: []
                },
                // 分页数据
                total1: 0,
                currentPage1: 1,
                pageSize: 7,
                arr: [],
                addForm: {
                    username: '',
                    name: '',
                    email: '',
                    department: '',
                    password: '',
                    password2: '',
                    remarks: ''
                },
                formLabelWidth: '100px'
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
            onSubmit() {
                console.log('submit!');
            },
            onReset() {
                console.log('onReset!');
            },
            openDelete() {
                if (this.multipleSelection.id.length === 0) {
                    this.openWarning();
                } else {
                    this.dialogVisible = true;
                }
            },
            confirmDelete() {
                this.dialogVisible = false;
                this.deleteUser();
            },
            // 复选框被勾选时的回调
            handleSelectionChange(val) {
                this.multipleSelection.id = [];
                for (let i = 0,length = val.length; i < length; i++) {
                    this.multipleSelection.id.push(val[i]['id'])
                }
                console.log(this.multipleSelection.id);
            },
            // 点击修改按钮时的操作
            handleEdit(index, row) {
                console.log(index, row);
            },
            tableList() {
                this.$api.decision.userList.request().then((data) => {
                    this.tableData = data.data;
                    this.total1 = data.data.length;
                    this.transform(data);
                    this.arr = this.tableData;
                    this.handleSizeChange(7);
                }).catch((err) => {
                    console.log(err);
                });
            },
            transform(data) {
                for (let i = 0, length = data.data.length; i < length; i++) {
                    if (this.tableData[i]['lastTime']) {
                        this.tableData[i]['lastTime'] = this.tableData[i]['lastTime'].split('T')[0] +
                            " " + this.tableData[i]['lastTime'].split('T')[1].split('+')[0];
                    }
                }
            },
            // 删除接口
            deleteUser() {
                this.$api.decision.deleteUser.request({},{restUrl: `${this.multipleSelection}/`}).then(() => {
                    // this.tableList();
                }).catch((err) => {
                    console.log(err);
                });
            },
            // 关闭弹窗时清空表单数据
            clearDia(formName) {
                this.$refs[formName].resetFields();
            },
            // 警告信息
            openWarning() {
                this.$message({
                    showClose: true,
                    message: '请先选择需要删除的数据！',
                    type: 'warning'
                });
            },
        },
        mounted() {
            this.tableList();
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
    p{
        height: 25px;
        line-height: 25px;
    }
    .userInfo {
        height: 30px;
    }
    .userTitle {
        width: 100%;
        height: 40px;
        line-height: 40px;
        text-align: center;
        color: #FFFFFF;
        background: #474747;
    }
    .block {
        float: none;
        margin-bottom: 100px;
    }
</style>