<template>
    <div id="temporary">
        <div class="lar-title">
            <span class="lar-span">临时组</span>
        </div>
        <div class="pad">
            <div class="temporary" v-if="faArr.bol">
                <div class="pad-title">临时组管理
                    <el-popover
                        placement="bottom"
                        style="position: absolute;top: 3px;right: 15px;"
                        width="350"
                        trigger="click">
                        <el-form :inline="true" :model="formInline" class="demo-form-inline" style="text-align: left;margin-top: 25px;">
                            <el-form-item label="临时组名" style="margin-left: 25px" prop="name">
                                <el-input v-model="formInline.name"
                                          @keyup.native="validateX" @keydown.native="validateX"
                                          style="width: 220px;" placeholder="请输入临时组名"></el-input>
                            </el-form-item>
                            <el-form-item style="margin-left: 94px;">
                                <el-button type="primary" size="medium" @click="onSelect">搜索</el-button>
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
                    <div class="table-content">
                        <el-table
                            ref="table"
                            :data="tableData"
                            tooltip-effect="dark"
                            style="width: 100%;cursor: pointer"
                            @selection-change="handleSelectionChange"
                            @row-click="handleRowClick">
                            <el-table-column
                                align="center"
                                header-align="center"
                                fixed
                                type="selection"
                                width="55">
                            </el-table-column>
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
                                label="临时组名"
                                min-width="150">
                            </el-table-column>
                            <el-table-column
                                align="center"
                                header-align="center"
                                prop="durable"
                                label="是否是持久群"
                                min-width="130">
                            </el-table-column>
                            <el-table-column
                                align="center"
                                header-align="center"
                                prop="count"
                                label="人数"
                                min-width="100">
                            </el-table-column>
                            <el-table-column
                                align="center"
                                header-align="center"
                                prop="addTime"
                                label="临时组创建时间"
                                min-width="180">
                            </el-table-column>
                            <el-table-column
                                align="center"
                                header-align="center"
                                :show-overflow-tooltip="true"
                                prop="remarks"
                                label="备注"
                                min-width="180">
                            </el-table-column>
                            <el-table-column
                                align="center"
                                header-align="center"
                                label="操作"
                                fixed="right"
                                min-width="150px">
                                <template slot-scope="scope">
                                    <el-button
                                        size="medium"
                                        @click.stop="handleEdit(scope.$index, scope.row)">编辑</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="block block1">
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
            <el-dialog title="添加临时组"
                       :visible.sync="outerVisible"
                       @closed="clearDia('addForm')"
                       width="550px" center>
                <el-form :model="addForm"  ref="addForm" :rules="rules"  style="text-align: left">
                    <el-form-item label="名称" :label-width="formLabelWidth" prop="name" class="is-required">
                        <el-input v-model="addForm.name" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="是否是持久群" :label-width="formLabelWidth" prop="durable" class="is-required">
                        <el-radio-group v-model="addForm.durable">
                            <el-radio label="1">是</el-radio>
                            <el-radio label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="此群有效时间" :label-width="formLabelWidth" prop="deadTime"
                                  v-if="addForm.durable==='0'" class="is-required">
                        <el-date-picker v-model="addForm.deadTime"
                                        value-format="yyyy-MM-dd"
                                        :picker-options="pickOptions"
                                        type="date" style="width: 380px"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="选择用户" :label-width="formLabelWidth" prop="user" class="is-required">
                        <el-input v-model="nameStr" style="display: inline-block;width: 277px" autocomplete="off" disabled></el-input>
                        <el-button type="success" @click="addUser">添加用户</el-button>
                    </el-form-item>
                    <el-form-item label="备注" :label-width="formLabelWidth" prop="remarks">
                        <el-input type="textarea" v-model="addForm.remarks" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="outerVisible = false">取 消</el-button>
                    <el-button type="primary" @click="onSubmit('addForm')">提 交</el-button>
                </div>
            </el-dialog>
            <el-dialog title="修改临时组"
                       :visible.sync="outerVisible1"
                       @closed="clearDia('updateForm')"
                       width="550px" center>
                <el-form :model="updateForm"  ref="updateForm" :rules="rules"  style="text-align: left">
                    <el-form-item label="名称" :label-width="formLabelWidth" prop="name" class="is-required">
                        <el-input v-model="updateForm.name" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="是否是持久群" :label-width="formLabelWidth" prop="durable" class="is-required">
                        <el-radio-group v-model="updateForm.durable">
                            <el-radio label="1">是</el-radio>
                            <el-radio label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="此群有效时间" :label-width="formLabelWidth" prop="deadTime"
                                  v-if="updateForm.durable==='0'" class="is-required">
                        <el-date-picker v-model="updateForm.deadTime"
                                        type="date"
                                        value-format="yyyy-MM-dd"
                                        :picker-options="pickOptions"
                                        style="width: 380px"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="选择用户" :label-width="formLabelWidth" prop="user" class="is-required">
                        <el-input v-model="nameStr" style="display: inline-block;width: 277px" autocomplete="off" disabled></el-input>
                        <el-button type="success" @click="addUser">添加用户</el-button>
                    </el-form-item>
                    <el-form-item label="备注" :label-width="formLabelWidth" prop="remarks">
                        <el-input type="textarea" v-model="updateForm.remarks" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="outerVisible1 = false">取 消</el-button>
                    <el-button type="primary" @click="onSubmit1('updateForm')">提 交</el-button>
                </div>
            </el-dialog>
            <el-dialog
                title="选择用户"
                :visible.sync="innerVisible" width="1115px" center>
                <div class="head">
                    <el-form :inline="true" :model="userForm" class="demo-form-inline"
                             style="height: 60px;text-align: left">
                        <el-form-item label="用户名称" style="margin-bottom: 0;">
                            <el-input v-model="userForm['name']" placeholder="请输入用户名称"
                                      style="margin-top: 10px;"></el-input>
                        </el-form-item>
                        <el-form-item style="margin-bottom: 0;margin-top: 10px;">
                            <el-button type="primary" size="medium" @click="onSelect1">搜索</el-button>
                            <el-button size="medium" @click="onReset1">重置</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <el-row :gutter="20" style="padding: 0 10px">
                    <el-col :span="24">
                        <div class="grid-content bg-purple-light">
                            <el-table
                                ref="tableAlert"
                                :data="tableData1"
                                tooltip-effect="dark"
                                style="width: 100%"
                                @selection-change="handleSelectionChange1">
                                <el-table-column
                                    align="center"
                                    header-align="center"
                                    fixed
                                    type="selection"
                                    width="55">
                                </el-table-column>
                                <el-table-column
                                    align="center"
                                    header-align="center"
                                    prop="name"
                                    label="姓名"
                                    min-width="80">
                                </el-table-column>
                                <el-table-column
                                    align="center"
                                    header-align="center"
                                    prop="duties"
                                    label="职务"
                                    min-width="80">
                                </el-table-column>
                                <el-table-column
                                    align="center"
                                    header-align="center"
                                    prop="status"
                                    label="人员状态"
                                    min-width="100">
                                </el-table-column>
                                <el-table-column
                                    align="center"
                                    header-align="center"
                                    prop="email"
                                    label="邮箱地址"
                                    min-width="150">
                                </el-table-column>
                                <el-table-column
                                    align="center"
                                    header-align="center"
                                    prop="phone"
                                    label="电话号码"
                                    min-width="130">
                                </el-table-column>
                                <el-table-column
                                    align="center"
                                    header-align="center"
                                    prop="lastTime"
                                    label="更新时间"
                                    min-width="170">
                                </el-table-column>
                                <el-table-column
                                    align="center"
                                    header-align="center"
                                    :show-overflow-tooltip="true"
                                    prop="remarks"
                                    fixed="right"
                                    label="备注"
                                    min-width="160">
                                </el-table-column>
                            </el-table>
                        </div>
                        <div class="block" style="margin-bottom: 30px;">
                            <el-pagination
                                @size-change="handleSizeChange1"
                                @current-change="handleCurrentChange1"
                                :current-page="currentPage2"
                                :page-sizes="[7, 10, 15]"
                                :page-size="pageSize1"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="total2">
                            </el-pagination>
                        </div>
                    </el-col>
                </el-row>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="innerVisible = false">取 消</el-button>
                    <el-button type="primary" @click="onSubmitUser">确 定</el-button>
                </div>
            </el-dialog>
            <!--打开删除窗口-->
            <el-dialog
                title="提示"
                :visible.sync="dialogVisible"
                width="400px">
                <span>你确定要删除这些数据吗？</span>
                <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmDelete()">确 定</el-button>
            </span>
            </el-dialog>
            <div class="temporaryDetail" v-if="!faArr.bol">
                <temporary-detail @temporaryListen="listenDetail" :sonArr="faArr"></temporary-detail>
            </div>
        </div>
    </div>
</template>

<script>
    import TemporaryDetail from '../temporaryDetail/temporaryDetail'
    export default {
        name: "temporary",
        components: {TemporaryDetail},
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
            var checkDeadTime = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('到期时间为必填项！'));
                } else {
                    callback();
                }
            };
            var checkUser = (rule, value, callback) => {
                if (value.length === 0) {
                    return callback(new Error('选择用户为必填项！'));
                } else {
                    callback();
                }
            };
            var checkRemarks = (rule, value, callback) => {
                if (value) {
                    if (value.length > 255) {
                        return callback(new Error('备注的字符长度不得超过255！'));
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            };
            return {
                pickOptions: {
                    disabledDate(value) {
                        if (Date.now() > value) {
                            return true
                        }
                        return false
                    }
                },
                outerVisible: false,
                outerVisible1: false,
                innerVisible: false,
                dialogVisible: false,
                formLabelWidth: '110px',
                formInline: {
                    name: '',
                },
                userForm: {
                    name: '',
                },
                addForm: {
                    name: '',
                    durable: '1',
                    deadTime: '',
                    user: [],
                    remarks: '',
                },
                updateForm: {
                    id: '',
                    name: '',
                    durable: '1',
                    deadTime: '',
                    user: [],
                    remarks: '',
                },
                options: [],
                tableData: [],
                tableData1: [],
                faArr: {
                    row: {},
                    bol: 1
                },
                // 分页数据
                total1: 0,
                currentPage1: 1,
                pageSize: 10,
                multipleSelection: [],
                multipleSelectionAll: [],
                // 弹窗分页数据
                total2: 0,
                currentPage2: 1,
                pageSize1: 10,
                multipleSelection1: [],
                multipleSelectionAll1: [],
                nameStr: '',
                id: 'id',
                rules: {
                    name: [
                        { validator: checkName, trigger: 'blur' },
                    ],
                    deadTime: [
                        { validator: checkDeadTime, trigger: 'blur' },
                    ],
                    user: [
                        { validator: checkUser, trigger: 'change' },
                    ],
                    remarks: [
                        { validator: checkRemarks, trigger: 'blur' },
                    ]
                }
            }
        },
        methods: {
            // 自定义序号
            indexMethod(index) {
                return index + 1;
            },
            onSelect() {
                this.changePageCoreRecordData();
                this.selectGroup();
            },
            onSelect1() {
                this.changePageCoreRecordData1();
                this.selectEmployee();
            },
            onReset() {
                this.formInline['name'] = '';
                this.changePageCoreRecordData();
                this.selectGroup();
            },
            onReset1() {
                this.userForm['name'] = '';
                this.changePageCoreRecordData1();
                this.selectEmployee();
            },
            openAdd() {
                this.outerVisible = true;
            },
            openDelete() {
                this.changePageCoreRecordData();
                if (this.multipleSelectionAll.length === 0) {
                    this.openWarning();
                } else {
                    this.dialogVisible = true;
                }
            },
            addUser() {
                this.innerVisible = true;
                this.$nextTick(function () {
                    this.tableList1();
                });
                this.tableTree1();
            },
            // 点击修改按钮时的操作
            handleEdit(index, row) {
                console.log(row, 456);
                this.outerVisible1 = true;
                for (let i in row) {
                    this.updateForm[i] = row[i];
                    if (this.updateForm['durable'] === '否') {
                        this.updateForm['durable'] = '0'
                    } else if (this.updateForm['durable'] === '是') {
                        this.updateForm['durable'] = '1'
                    }
                    if (this.updateForm['deadTime']) {
                        this.updateForm['deadTime'] = this.updateForm['deadTime'].split('T')[0]
                    }
                }
                this.$api.decision.selectEmployeesGroup.request({},
                    {restUrl: `${row.id}`}).then((data) => {
                    let x = data.data.data;
                    let nameArr = [];
                    this.multipleSelectionAll1 = x;
                    x.forEach(val=>{
                        this.updateForm.user.push(val.id);
                        nameArr.push(val.name);
                    });
                    this.nameStr = nameArr.toString();
                }).catch((err) => {
                    console.log(err);
                });
            },
            validateX() {
                this.formInline.name = this.valid.ValidateValue(this.formInline.name);
            },
            // 添加组
            onSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.addGroup();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            // 修改组
            onSubmit1(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.updateGroup();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            // 表格单行点击回调
            handleRowClick(row) {
                this.faArr.bol = 0;
                this.faArr.row = row;
                console.log(row);
            },
            tableList() {
                this.$api.decision.temporaryGroupList.request({},
                    {restUrl: `page=${this.currentPage1 - 1}&&size=${this.pageSize}&&name=${this.formInline['name']}`}).then((data) => {
                    this.tableData = data.data.data;
                    this.total1 = data.data.total;
                    this.transform(data);
                    setTimeout(() => {
                        this.setSelectRow();
                    }, 20);
                }).catch((err) => {
                    console.log(err);
                });
            },
            // 查询接口
            selectGroup() {
                this.currentPage1 = 1;
                this.$api.decision.selectTemporaryGroup.request({},
                    {restUrl: `page=${0}&&size=${this.pageSize}&&name=${this.formInline['name']}`}).then((data) => {
                    this.tableData = data.data.data;
                    this.total1 = data.data.total;
                    this.transform(data);
                    setTimeout(() => {
                        this.setSelectRow();
                    }, 20);
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
                    if (this.tableData[i]['durable'] === 1) {
                        this.tableData[i]['durable'] = '是';
                    } else {
                        this.tableData[i]['durable'] = '否';
                    }
                    // if (this.tableData[i]['overdue'] === 1) {
                    //     this.tableData[i]['overdue'] = '是';
                    // } else {
                    //     this.tableData[i]['overdue'] = '否';
                    // }
                }
            },
            addGroup() {
                let x = 'T00:00:00' + '+' + '08:00';
                if (this.addForm.deadTime) {
                    this.addForm.deadTime = this.addForm.deadTime + 'T00:00:00' + '+' + '08:00';
                } else if (this.addForm.deadTime === x || this.addForm.deadTime === '') {
                    this.addForm.deadTime = '2099-01-01' + 'T00:00:00' + '+' + '08:00';
                }
                this.$api.decision.createTemporaryGroup.request(this.addForm).then((data) => {
                    if (data.data === 2) {
                        this.$message({
                            showClose: true,
                            message: '添加临时组失败，临时组重名！',
                            type: 'error'
                        });
                        this.addForm.deadTime = this.addForm.deadTime.split('T')[0];
                    } else {
                        this.outerVisible = false;
                        this.selectGroup();
                        this.$message({
                            showClose: true,
                            message: '添加临时组成功！',
                            type: 'success'
                        });
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            updateGroup() {
                let x = 'T00:00:00' + '+' + '08:00';
                if (this.updateForm.deadTime) {
                    this.updateForm.deadTime = this.updateForm.deadTime + 'T00:00:00' + '+' + '08:00';
                } else if (this.updateForm.deadTime === x || this.updateForm.deadTime === '') {
                    this.updateForm.deadTime = '2099-01-01' + 'T00:00:00' + '+' + '08:00';
                }
                this.$api.decision.updateTemporaryGroup.request(this.updateForm).then((data) => {
                    if (data.data === 2) {
                        this.$message({
                            showClose: true,
                            message: '修改临时组失败，临时组重名！',
                            type: 'error'
                        });
                        this.updateForm.deadTime = this.updateForm.deadTime.split('T')[0];
                    } else {
                        this.selectGroup();
                        this.outerVisible1 = false;
                        this.$message({
                            showClose: true,
                            message: '修改临时组成功！',
                            type: 'success'
                        });
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            confirmDelete() {
                this.dialogVisible = false;
                this.deleteGroup();
            },
            deleteGroup() {
                let idsArr = [];
                if (this.multipleSelectionAll.length) {
                    this.multipleSelectionAll.forEach(value => {
                        idsArr.push(value.id);
                    })
                } else {
                    this.multipleSelection.forEach(value => {
                        idsArr.push(value.id);
                    })
                }
                this.$api.decision.deleteTemporaryGroup.request({id: idsArr}).then(() => {
                    this.$message({
                        showClose: true,
                        message: '删除临时组成功！',
                        type: 'success'
                    });
                    this.multipleSelectionAll = [];
                    this.selectGroup();
                }).catch((err) => {
                    console.log(err);
                });
            },
            // 关闭弹窗时清空表单数据
            clearDia(formName) {
                this.$refs[formName].resetFields();
                this.addForm.deadTime = '';
                this.nameStr = '';
                this.updateForm.deadTime = '';
                this.multipleSelectionAll1 = [];
                this.currentPage2 = 1;
            },
            // 警告信息
            openWarning() {
                this.$message({
                    showClose: true,
                    message: '请先选择需要删除的数据！',
                    type: 'warning'
                });
            },
            listenDetail(data) {
                this.faArr.bol = data;
            },
            // 添加用户的弹出窗
            tableList1() {
                const groupState = '1';
                this.$api.decision.employeesList.request({},
                    {restUrl: `page=${this.currentPage2 - 1}&&size=${this.pageSize1}&&name=${this.userForm['name']}&&departmentId=${0}&&groupState=${groupState}`}).then((data) => {
                    this.tableData1 = data.data.data;
                    this.total2 = data.data.total;
                    this.transform1(data);
                    setTimeout(() => {
                        this.setSelectRow1();
                    }, 20);
                }).catch((err) => {
                    console.log(err);
                });
            },
            // 查询用户
            selectEmployee() {
                this.$api.decision.selectEmployees.request({},
                    {restUrl: `page=${0}&&size=${this.pageSize1}&&name=${this.userForm['name']}&&departmentId=${0}&&groupState=${1}`}).then((data) => {
                    this.tableData1 = data.data.data;
                    this.total2 = data.data.total;
                    this.transform1(data);
                    setTimeout(() => {
                        this.setSelectRow1();
                    }, 20);
                }).catch((err) => {
                    console.log(err);
                });
            },
            transform1(data) {
                for (let i = 0, length = data.data.data.length; i < length; i++) {
                    if (this.tableData1[i]['lastTime']) {
                        this.tableData1[i]['lastTime'] = this.tableData1[i]['lastTime'].split('T')[0] +
                            " " + this.tableData1[i]['lastTime'].split('T')[1].split('+')[0];
                    }
                }
            },
            tableTree1() {
                this.$api.decision.departmentTree.request().then((data) => {
                    console.log(data.data);
                    this.data = data.data;
                }).catch((err) => {
                    console.log(err);
                });
            },
            onSubmitUser() {
                this.innerVisible = false;
                this.changePageCoreRecordData1();
                if (this.outerVisible1) {
                    // 这里是编辑
                    let nameArr = [];
                    this.updateForm.user = [];
                    this.multipleSelectionAll1.forEach(value => {
                        this.updateForm.user.push(value.id);
                        nameArr.push(value.name);
                    });
                    this.nameStr = nameArr.toString();
                } else {
                    // 这里是添加
                    let nameArr = [];
                    this.addForm.user = [];
                    this.multipleSelectionAll1.forEach(value => {
                        this.addForm.user.push(value.id);
                        nameArr.push(value.name);
                    });
                    this.nameStr = nameArr.toString();
                }
            },
            // 记忆分页
            handleSizeChange(pageSize) { // 每页条数切换
                this.pageSize = pageSize;
                this.handleCurrentChange(this.currentPage1);
            },
            handleCurrentChange(currentPage) {//页码切换
                this.currentPage1 = currentPage;
                this.changePageCoreRecordData();
                this.tableList();
            },
            // 复选框被勾选时的回调
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 设置选中的方法
            setSelectRow() {
                console.log(this.multipleSelectionAll, 3333);
                if (!this.multipleSelectionAll || this.multipleSelectionAll.length <= 0) {
                    return;
                }
                // 标识当前行的唯一键的名称
                let id = this.id;
                let selectAllIds = [];
                this.multipleSelectionAll.forEach(row => {
                    selectAllIds.push(row[id]);
                });
                console.log(selectAllIds, 4444);
                this.$refs.table.clearSelection();
                for (var i = 0; i < this.tableData.length; i++) {
                    if (selectAllIds.indexOf(this.tableData[i][id]) >= 0) {
                        // 设置选中，记住table组件需要使用ref="table"
                        this.$refs.table.toggleRowSelection(this.tableData[i]);
                    }
                }
            },
            // 记忆选择核心方法
            changePageCoreRecordData() {
                // 标识当前行的唯一键的名称
                let id = this.id;
                let that = this;
                // 如果总记忆中还没有选择的数据，那么就直接取当前页选中的数据，不需要后面一系列计算
                if (this.multipleSelectionAll.length <= 0) {
                    this.multipleSelectionAll = this.multipleSelection;
                    return;
                }
                // 总选择里面的key集合
                let selectAllIds = [];
                this.multipleSelectionAll.forEach(row => {
                    selectAllIds.push(row[id]);
                });
                let selectIds = [];
                // 获取当前页选中的id
                this.multipleSelection.forEach(row => {
                    selectIds.push(row[id]);
                    // 如果总选择里面不包含当前页选中的数据，那么就加入到总选择集合里
                    if (selectAllIds.indexOf(row[id]) < 0) {
                        that.multipleSelectionAll.push(row);
                    }
                });
                let noSelectIds = [];
                // 得到当前页没有选中的id
                this.tableData.forEach(row => {
                    if (selectIds.indexOf(row[id]) < 0) {
                        noSelectIds.push(row[id]);
                    }
                });
                noSelectIds.forEach(idVal => {
                    if (selectAllIds.indexOf(idVal) >= 0) {
                        for (let i = 0; i < that.multipleSelectionAll.length; i++) {
                            if (that.multipleSelectionAll[i][id] === idVal) {
                                // 如果总选择中有未被选中的，那么就删除这条
                                that.multipleSelectionAll.splice(i, 1);
                                break;
                            }
                        }
                    }
                });
            },
            // 记忆分页弹窗
            handleSizeChange1(pageSize) { // 每页条数切换
                this.pageSize1 = pageSize;
                this.handleCurrentChange1(this.currentPage2);
            },
            handleCurrentChange1(currentPage) {//页码切换
                this.currentPage2 = currentPage;
                this.changePageCoreRecordData1();
                this.tableList1();
            },
            // 复选框被勾选时的回调
            handleSelectionChange1(val) {
                this.multipleSelection1 = val;
            },
            // 设置选中的方法
            setSelectRow1() {
                if (!this.multipleSelectionAll1 || this.multipleSelectionAll1.length <= 0) {
                    return;
                }
                // 标识当前行的唯一键的名称
                let id = this.id;
                let selectAllIds = [];
                this.multipleSelectionAll1.forEach(row => {
                    selectAllIds.push(row[id]);
                });
                console.log(selectAllIds, 4444);
                this.$refs.tableAlert.clearSelection();
                for (var i = 0; i < this.tableData1.length; i++) {
                    if (selectAllIds.indexOf(this.tableData1[i][id]) >= 0) {
                        this.$refs.tableAlert.toggleRowSelection(this.tableData1[i]);
                    }
                }
            },
            // 记忆选择核心方法
            changePageCoreRecordData1() {
                // 标识当前行的唯一键的名称
                let id = this.id;
                let that = this;
                // 如果总记忆中还没有选择的数据，那么就直接取当前页选中的数据，不需要后面一系列计算
                if (this.multipleSelectionAll1.length <= 0) {
                    this.multipleSelectionAll1 = this.multipleSelection1;
                    return;
                }
                // 总选择里面的key集合
                let selectAllIds = [];
                this.multipleSelectionAll1.forEach(row => {
                    selectAllIds.push(row[id]);
                });
                let selectIds = [];
                // 获取当前页选中的id
                this.multipleSelection1.forEach(row => {
                    selectIds.push(row[id]);
                    // 如果总选择里面不包含当前页选中的数据，那么就加入到总选择集合里
                    if (selectAllIds.indexOf(row[id]) < 0) {
                        that.multipleSelectionAll1.push(row);
                    }
                });
                let noSelectIds = [];
                // 得到当前页没有选中的id
                this.tableData1.forEach(row => {
                    if (selectIds.indexOf(row[id]) < 0) {
                        noSelectIds.push(row[id]);
                    }
                });
                noSelectIds.forEach(idVal => {
                    if (selectAllIds.indexOf(idVal) >= 0) {
                        for (let i = 0; i < that.multipleSelectionAll1.length; i++) {
                            if (that.multipleSelectionAll1[i][id] === idVal) {
                                // 如果总选择中有未被选中的，那么就删除这条
                                that.multipleSelectionAll1.splice(i, 1);
                                break;
                            }
                        }
                    }
                });
            },
        },
        mounted() {
            this.$nextTick(function () {
                this.tableList();
            })
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
    .userTitle {
        width: 100%;
        height: 40px;
        line-height: 40px;
        text-align: center;
        color: #FFFFFF;
        background: #474747;
    }
    .table-content{
        padding: 0 10px;
    }
    .block{
        float: none;
        margin-bottom: 50px;
    }
    .block1 {
        position: fixed;
        width: 100%;
        background: #f8f8f8;
        bottom: 0;
        margin-bottom: 0;
        right: 0;
        padding-right: 20px;
        height: 47px;
        line-height: 47px;
        z-index: 20;
    }
</style>