<template>
    <div id="department">
        <div class="lar-title">
            <span class="lar-span">部门</span>
        </div>
        <div class="pad">
            <div class="pad-title">部门管理
                <el-popover
                    placement="bottom"
                    style="position: absolute;top: 3px;right: 15px;"
                    width="350"
                    trigger="click">
                    <el-form :inline="true" :model="formInline" class="demo-form-inline" style="text-align: left;margin-top: 25px;">
                        <el-form-item label="部门名称" style="margin-left: 25px" prop="name">
                            <el-input v-model="formInline.name" @keyup.native="validateX" @keydown.native="validateX" style="width: 220px;" placeholder="请输入部门名称"></el-input>
                        </el-form-item>
                        <el-form-item style="margin-left: 94px;">
                            <el-button type="primary" plain size="medium" @click="onSelect">搜索</el-button>
                            <el-button size="medium" @click="onReset">重置</el-button>
                        </el-form-item>
                    </el-form>
                    <el-button slot="reference">筛选</el-button>
                </el-popover>
            </div>
            <div class="content">
                <div class="head">
                    <div class="head-right">
                        <el-button type="primary" @click="openAdd">添加</el-button>
                        <el-button type="danger" @click="openDelete">删除</el-button>
                    </div>
                    <div style="clear: both"></div>
                </div>
                <div class="table-content" style="margin-bottom: 50px;">
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
                        <!--<el-table-column-->
                            <!--label="排序号"-->
                            <!--prop="seq"-->
                            <!--min-width="120">-->
                        <!--</el-table-column>-->
                        <el-table-column
                            prop="name"
                            label="部门名称"
                            min-width="150">
                        </el-table-column>
                        <!--<el-table-column-->
                            <!--prop="levels"-->
                            <!--label="部门等级"-->
                            <!--min-width="100">-->
                        <!--</el-table-column>-->
                        <el-table-column
                            prop="remarks"
                            label="备注"
                            min-width="180">
                        </el-table-column>
                        <el-table-column
                            prop="addTime"
                            label="添加时间"
                            min-width="180">
                        </el-table-column>
                        <el-table-column label="操作" min-width="150px">
                            <template slot-scope="scope">
                                <el-button
                                    size="medium"
                                    @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
        <el-dialog title="添加部门"
                   :visible.sync="dialogFormVisible"
                   @close="clearDia('addForm')"
                   width="550px" center>
            <el-form :model="addForm" ref="addForm" :rules="rules" class="demo-dynamic">
                <el-form-item label="部门名称" :label-width="formLabelWidth" prop="name" class="is-required">
                    <el-input v-model="addForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="上级部门" :label-width="formLabelWidth">
                    <el-select v-model="addForm.parentId" placeholder="请选择">
                        <el-option
                            v-for="item in options"
                            :key="item.id"
                            :label="item.label"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="部门描述" :label-width="formLabelWidth" prop="remarks">
                    <el-input type="textarea" v-model="addForm.remarks" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="onSubmit('addForm')">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="修改部门"
                   :visible.sync="dialogFormVisible1"
                   @close="clearDia('updateForm')"
                   width="550px" center>
            <el-form :model="updateForm" ref="updateForm" :rules="rules" class="demo-dynamic">
                <el-form-item label="部门名称" :label-width="formLabelWidth" prop="name" class="is-required">
                    <el-input v-model="updateForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="上级部门" :label-width="formLabelWidth" prop="parentId">
                    <el-select v-model="updateForm.parentId" :disabled="isTrue" placeholder="请选择">
                        <el-option
                            v-for="item in options"
                            :key="item.id"
                            :label="item.label"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="部门描述" :label-width="formLabelWidth" prop="remarks">
                    <el-input type="textarea" v-model="updateForm.remarks" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible1 = false">取 消</el-button>
                <el-button type="primary" @click="onSubmit1('updateForm')">确 定</el-button>
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
        name: "department",
        data() {
            var checkName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('部门名称为必填项！'));
                } else {
                    if (!(/^[\u4e00-\u9fa5_a-zA-Z0-9]{1,20}$/.test(value))) {
                        callback(new Error('部门名称格式仅限中英文，数字和下划线，长度不能超过20！'));
                    } else {
                        callback();
                    }
                }
            };
            var checkParentId = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('上级部门为必选项！'));
                } else {
                    callback();
                }
            };
            return {
                dialogFormVisible: false,
                dialogFormVisible1: false,
                dialogVisible: false,
                isTrue: false,
                formLabelWidth: '100px',
                formInline: {
                    name: '',
                },
                tableData: [],
                addForm: {
                    name: '',
                    parentId: '',
                    remarks: ''
                },
                updateForm: {
                    id: '',
                    name: '',
                    parentId: '',
                    remarks: ''
                },
                options: [],
                multipleSelection: {
                    id: []
                },
                // 分页数据
                total1: 0,
                currentPage1: 1,
                pageSize: 10,
                id: '',
                rules: {
                    name: [
                        { validator: checkName, trigger: 'blur' },
                    ],
                    parentId: [
                        { validator: checkParentId, trigger: 'change' }
                    ],
                }
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
            validateX() {
                this.formInline.name = this.valid.ValidateValue(this.formInline.name);
            },
            // 添加用户
            onSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.addDepartment();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            // 修改用户信息
            onSubmit1(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.updateDepartment();
                        this.dialogFormVisible1 = false;
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            onSelect() {
                this.selectDepartment();
            },
            onReset() {
                this.formInline.name = '';
                this.selectDepartment();
            },
            openAdd() {
                this.dialogFormVisible = true;
                this.ADepartmentList();
            },
            tableList() {
                this.$api.decision.departmentList.request({},
                    {restUrl: `page=${this.currentPage1 - 1}&&size=${this.pageSize}&&name=${this.formInline['name']}`}).then((data) => {
                    this.tableData = data.data.data;
                    this.total1 = data.data.total;
                    this.transform(data);
                }).catch((err) => {
                    console.log(err);
                });
            },
            transform(data) {
                for (let i = 0, length = data.data.data.length; i < length; i++) {
                    if (this.tableData[i]['addTime']) {
                        this.tableData[i]['addTime'] = this.tableData[i]['addTime'].split('T')[0] +
                            " " + this.tableData[i]['addTime'].split('T')[1].split('+')[0];
                    }
                }
            },
            ADepartmentList() {
                this.$api.decision.SuperiorDepartmentData.request().then((data) => {
                    this.options = data.data;
                }).catch((err) => {
                    console.log(err);
                });
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
                this.deleteDepartment();
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
                this.ADepartmentList();
                this.dialogFormVisible1 = true;
                console.log(row, '************');
                for (let i in row) {
                    this.updateForm[i] = row[i];
                }
                this.updateForm.id = row.id;
                this.id = row.id;
                if (row.parentId === 0) {
                    this.isTrue = true;
                } else {
                    this.isTrue = false;
                }
                console.log(index, row);
            },
            // 添加接口
            addDepartment() {
                this.$api.decision.createDepartment.request(this.addForm).then((data) => {
                    if (data.data === 2) {
                        this.$message({
                            showClose: true,
                            message: '必须选择父部门！',
                            type: 'warning'
                        });
                    } else if (data.data === 3) {
                        this.$message({
                            showClose: true,
                            message: '不能建重名的部门！',
                            type: 'warning'
                        });
                    } else {
                        this.$message({
                            showClose: true,
                            message: '添加部门成功！',
                            type: 'success'
                        });
                        this.dialogFormVisible = false;
                        this.tableList();
                    }
                    this.tableList();
                }).catch((err) => {
                    console.log(err);
                });
            },
            // 查询接口
            selectDepartment() {
                this.$api.decision.selectDepartment.request({},
                    {restUrl: `page=${0}&&size=${this.pageSize}&&name=${this.formInline['name']}`}).then((data) => {
                    this.tableData = data.data.data;
                    this.total1 = data.data.total;
                    this.transform(data);
                }).catch((err) => {
                    console.log(err);
                });
            },
            // 修改接口
            updateDepartment() {
                this.$api.decision.updateDepartment.request(this.updateForm).then(() => {
                    this.$message({
                        showClose: true,
                        message: '修改部门成功！',
                        type: 'success'
                    });
                    this.tableList();
                }).catch((err) => {
                    console.log(err);
                });
            },
            // 删除接口
            deleteDepartment() {
                this.$api.decision.deleteDepartment.request(this.multipleSelection).then(() => {
                    this.$message({
                        showClose: true,
                        message: '删除部门成功！',
                        type: 'success'
                    });
                    this.tableList();
                }).catch((err) => {
                    console.log(err);
                });
            },
            // 关闭弹窗时清空表单数据
            clearDia(formName) {
                this.$refs[formName].resetFields();
                this.addForm.parentId = null;
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