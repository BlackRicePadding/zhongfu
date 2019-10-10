<template>
    <div id="tag">
        <div class="lar-title">
            <span class="lar-span">策略模板</span>
        </div>
        <div class="pad">
            <div class="pad-title">策略列表
                <el-popover
                    placement="bottom"
                    style="position: absolute;top: 3px;right: 15px;"
                    width="350"
                    trigger="click">
                    <el-form :inline="true" :model="formInline" class="demo-form-inline" style="text-align: left;margin-top: 25px;">
                        <el-form-item label="策略名称" style="margin-left: 25px">
                            <el-input v-model="formInline.name" @keyup.native="validateX" @keydown.native="validateX" style="width: 220px;" placeholder="请输入策略名称"></el-input>
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
                <div class="table-content" style="margin-bottom: 50px;">
                    <el-table
                        ref="table"
                        :data="tableData"
                        tooltip-effect="dark"
                        style="width: 100%"
                        @selection-change="handleSelectionChange">
                        <el-table-column
                            align="center"
                            header-align="center"
                            type="selection"
                            width="55">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            header-align="center"
                            prop="name"
                            label="策略名称"
                            min-width="150">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            header-align="center"
                            prop="blackRange"
                            label="策略范围"
                            min-width="150">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            header-align="center"
                            :show-overflow-tooltip="true"
                            prop="content"
                            label="策略类型"
                            min-width="150">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            header-align="center"
                            prop="enables"
                            min-width="130"
                            label="是否启用">
                            <template slot-scope="scope">
                                <el-switch v-model="scope.row.enables"
                                           active-color="#13ce66"
                                           @change="changeState(scope.$index, scope.row)"></el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" min-width="150px"
                                         align="center"
                                         header-align="center">
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
                        :current-page="currentPage"
                        :page-sizes="[10, 15, 20]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                    </el-pagination>
                </div>
            </div>
        </div>
        <el-dialog title="添加策略" :visible.sync="dialogFormVisible" width="550px" center @closed="clearDia('addForm')">
            <el-form :model="addForm" label-width="100px" ref="addForm" :rules="rules">
                <el-form-item label="策略名称" prop="name" class="is-required">
                    <el-input v-model="addForm.name" @keyup.native="addForm.name=addForm.name.replace(/\s+/g,'')" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="策略范围" prop="blackRange" class="is-required">
                    <el-input v-model="addForm.blackRange" @keyup.native="addForm.blackRange=addForm.blackRange.replace(/\s+/g,'')" placeholder="如果有多个，中间以|隔开" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remarks">
                    <el-input type="textarea" v-model="addForm.remarks" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="onSubmit('addForm')">确 定</el-button>
            </div>
        </el-dialog >
        <el-dialog title="修改策略" :visible.sync="dialogFormVisible1" width="550px" center @closed="clearDia('updateForm')">
            <el-form :model="updateForm" label-width="130px" ref="updateForm" :rules="rules">
                <el-form-item label="策略名称" prop="name" class="is-required">
                    <el-input v-model="updateForm.name" @keyup.native="updateForm.name=updateForm.name.replace(/\s+/g,'')" autocomplete="off" :disabled="isKillVirus"></el-input>
                </el-form-item>
                <el-form-item label="策略范围" prop="blackRange" class="is-required" v-if="!isKillVirus">
                    <el-input v-model="updateForm.blackRange" @keyup.native="updateForm.blackRange=updateForm.blackRange.replace(/\s+/g,'')" autocomplete="off" placeholder="如果有多个，中间以|隔开"></el-input>
                </el-form-item>
                <el-form-item label="反杀毒引擎路径" prop="blackRange" class="is-required" v-if="isKillVirus">
                    <el-input v-model="updateForm.blackRange" @keyup.native="updateForm.blackRange=updateForm.blackRange.replace(/\s+/g,'')" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remarks">
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
            width="400px">
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
        name: "tag",
        data() {
            var checkName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('策略名称为必填项！'));
                } else {
                    if (!(/^[\u4E00-\u9FA5A-Za-z0-9_]{1,20}$/.test(value))) {
                        callback(new Error('策略名称仅限中英文，数字或下划线，策略名称长度不能超过20！'));
                    } else {
                        callback();
                    }
                }
            };
            var checkBlackRange = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('黑名单范围为必填项！'));
                } else {
                    if (value.length > 67) {
                        callback(new Error('黑名单长度不能超过67！'));
                    } else {
                        callback();
                    }
                }
            };
            var checkContent = (rule, value, callback) => {
                if (value) {
                    if (value.length > 255) {
                        return callback(new Error('内容的字符长度不得超过255！'));
                    } else {
                        callback();
                    }
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
                dialogFormVisible: false,
                dialogFormVisible1: false,
                dialogVisible: false,
                isKillVirus: false,// 是否杀毒
                addForm: {
                    name: '',
                    blackRange: '',
                    content: '',
                    type: '',
                    remarks: ''
                },
                updateForm: {
                    id: '',
                    name: '',
                    blackRange: '',
                    content: '',
                    type: '',
                    remarks: ''
                },
                formInline: {
                    name: '',
                },
                tableData: [],
                multipleSelection: [],
                multipleSelectionAll: [],
                // 分页数据
                total: 0,
                currentPage: 1,
                pageSize: 10,
                id: 'id',
                rules: {
                    name: [
                        { validator: checkName, trigger: 'blur' },
                    ],
                    blackRange: [
                        { validator: checkBlackRange, trigger: 'blur' }
                    ],
                    content: [
                        { validator: checkContent, trigger: 'blur' }
                    ],
                    remarks: [
                        { validator: checkRemarks, trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            validateX() {
                this.formInline.name = this.valid.ValidateValue(this.formInline.name);
            },
            // 修改激活状态
            changeState(index, row) {
                this.$api.decision.isEnablePolicy.request({id: [row.id]}).then(() => {
                    // this.tableList();
                }).catch((err) => {
                    console.log(err);
                });
            },
            // 添加标签
            onSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.addPolicy();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            // 修改标签
            onSubmit1(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.updatePolicy();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            onSelect() {
                this.changePageCoreRecordData();
                this.selectPolicy();
            },
            onReset() {
                this.formInline.name = '';
                this.changePageCoreRecordData();
                this.selectPolicy();
            },
            openAdd() {
                this.dialogFormVisible = true;
            },
            tableList() {
                this.$api.decision.policiesList.request({},
                    {restUrl: `page=${this.currentPage - 1}&&size=${this.pageSize}&&name=${this.formInline['name']}`}).then((data) => {
                    this.tableData = data.data.data;
                    this.tableData.forEach((value,index) => {
                       if (value.content === '1') {
                           this.tableData.splice(index,1);
                           this.tableData.unshift(value);
                       }
                    });
                    this.total = data.data.total;
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
                    if (this.tableData[i]['content'] === '1') {
                        this.tableData[i]['content'] = '杀毒'
                    } else {
                        this.tableData[i]['content'] = '黑名单过滤'
                    }
                }
            },
            openDelete() {
                this.changePageCoreRecordData();
                if (this.multipleSelectionAll.length === 0) {
                    this.openWarning();
                } else {
                    this.dialogVisible = true;
                }
            },
            confirmDelete() {
                this.dialogVisible = false;
                this.deletePolicy();
            },
            // 点击修改按钮时的操作
            handleEdit(index, row) {
                this.dialogFormVisible1 = true;
                for (let i in row) {
                    this.updateForm[i] = row[i];
                }
                console.log(row);
                if (this.updateForm.content === '1') {
                    this.isKillVirus = true;
                    console.log(333);
                } else {
                    console.log(444);
                    this.isKillVirus = false;
                }
            },
            // 添加接口
            addPolicy() {
                this.$api.decision.createPolicy.request(this.addForm).then((data) => {
                    if (data.data === 2) {
                        this.$message({
                            showClose: true,
                            message: '添加策略失败，策略重名！',
                            type: 'error'
                        });
                    } else {
                        this.$message({
                            showClose: true,
                            message: '添加策略成功！',
                            type: 'success'
                        });
                        this.dialogFormVisible = false;
                        this.tableList();
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            // 查询接口
            selectPolicy() {
                this.currentPage = 1;
                this.$api.decision.selectPolicy.request({},
                    {restUrl: `page=${0}&&size=${this.pageSize}&&name=${this.formInline['name']}`}).then((data) => {
                    this.tableData = data.data.data;
                    this.total = data.data.total;
                    this.transform(data);
                    setTimeout(() => {
                        this.setSelectRow();
                    }, 20);
                }).catch((err) => {
                    console.log(err);
                });
            },
            // 修改接口
            updatePolicy() {
                this.$api.decision.updatePolicy.request(this.updateForm).then((data) => {
                    if (data.data === 2) {
                        this.$message({
                            showClose: true,
                            message: '修改策略失败，策略重名！',
                            type: 'error'
                        });
                    } else {
                        this.$message({
                            showClose: true,
                            message: '修改策略成功！',
                            type: 'success'
                        });
                        this.dialogFormVisible1 = false;
                        this.tableList();
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            // 删除接口
            deletePolicy() {
                let idsArr = [];
                console.log(this.multipleSelectionAll);
                console.log(this.multipleSelection);
                if (this.multipleSelectionAll.length > 0) {
                    this.multipleSelectionAll.forEach(value => {
                        idsArr.push(value.id);
                        if ( value.content === '杀毒') {
                            this.$message({
                                showClose: true,
                                message: '内置杀毒不可删除！',
                                type: 'error'
                            });
                            this.isKillVirus = true;
                        }
                    })
                } else {
                    this.multipleSelection.forEach(value => {
                        idsArr.push(value.id);
                        if ( value.content === '杀毒') {
                            this.$message({
                                showClose: true,
                                message: '内置杀毒不可删除！',
                                type: 'error'
                            });
                            this.isKillVirus = true;
                        }
                    })
                }
                console.log(this.isKillVirus, 77777);
                if ( !this.isKillVirus ) {
                    this.$api.decision.deletePolicy.request({id: idsArr}).then(() => {
                        this.$message({
                            showClose: true,
                            message: '删除策略成功！',
                            type: 'success'
                        });
                        this.multipleSelectionAll = [];
                        this.selectPolicy();
                    }).catch((err) => {
                        console.log(err);
                    });
                }
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
            // 记忆分页
            handleSizeChange(pageSize) { // 每页条数切换
                this.pageSize = pageSize;
                this.handleCurrentChange(this.currentPage);
            },
            handleCurrentChange(currentPage) {//页码切换
                this.currentPage = currentPage;
                this.changePageCoreRecordData();
                this.tableList();
            },
            // 复选框被勾选时的回调
            handleSelectionChange(val) {
                this.multipleSelection = val;
                this.isKillVirus = false;
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
    .table-content{
        padding: 0 10px;
    }
    .block {
        position: fixed;
        width: 100%;
        margin-bottom: 0;
        float: right;
        background: #f8f8f8;
        bottom: 0;
        right: 0;
        padding-right: 20px;
        height: 47px;
        line-height: 47px;
        z-index: 20;
    }
</style>