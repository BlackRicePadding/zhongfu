<template>
    <div id="addressList" style="position: relative">
        <div class="lar-title">
            <span class="lar-span">通讯录</span>
        </div>
        <div class="pad">
            <div class="pad-title">用户管理
                <el-popover
                    placement="bottom"
                    style="position: absolute;top: 3px;right: 15px;"
                    width="350"
                    trigger="click">
                    <el-form :inline="true" :model="formInline" class="demo-form-inline" style="text-align: left;margin-top: 25px;">
                        <el-form-item label="用户姓名" style="margin-left: 25px">
                            <el-input v-model="formInline.name" @keyup.native="validateX(1)" @keydown.native="validateX(1)" style="width: 220px;" placeholder="请输入用户姓名"></el-input>
                        </el-form-item>
                        <el-form-item label="电话号码" style="margin-left: 25px;">
                            <el-input type="textarea" v-model="formInline.phone" @keyup.native="validateX(2)" @keydown.native="validateX(2)" style="width: 220px;" placeholder="请输入电话号码，多个之间以逗号隔开"></el-input>
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
                <div style="height: 40px;padding: 10px 15px;text-align: right;">
                    <el-button type="success" @click="openAdd">添加</el-button>
                    <el-button type="danger" @click="openDelete">删除</el-button>
                    <el-button type="warning" @click="dialogUploadVisible=true">导入</el-button>
                    <el-button type="primary" @click="openDownLoadAll()">导出</el-button>
                    <el-button type="primary" @click="openDownLoadsAll()">导出全部</el-button>
                </div>
                <el-row :gutter="20" style="padding: 0 10px;margin-bottom: 50px;">
                    <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
                        <div class="grid-content bg-purple" style="overflow: auto;">
                            <div class="userTitle">用户组</div>
                            <ul class="ztree" id="bmTree">

                            </ul>
                        </div>
                    </el-col>
                    <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18">
                        <div class="grid-content bg-purple-light">
                            <el-table
                                ref="table"
                                :data="tableData"
                                tooltip-effect="dark"
                                style="width: 100%"
                                @selection-change="handleSelectionChange">
                                <el-table-column
                                    fixed
                                    align="center"
                                    header-align="center"
                                    type="selection"
                                    width="55">
                                </el-table-column>
                                <el-table-column
                                    align="center"
                                    header-align="center"
                                    prop="name"
                                    label="姓名"
                                    min-width="100">
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
                                    label="电话号码"
                                    min-width="130">
                                </el-table-column>
                                <el-table-column
                                    align="center"
                                    header-align="center"
                                    prop="obligateThree"
                                    label="是否启用"
                                    min-width="130">
                                    <template slot-scope="scope">
                                        <el-switch v-model="scope.row.obligateThree"
                                            active-color="#13ce66"
                                            @change="changeState(scope.$index, scope.row)"></el-switch>
                                    </template>
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
                                    fixed="right"
                                    label="操作" min-width="100">
                                    <template slot-scope="scope">
                                        <el-button
                                            size="medium"
                                            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div class="block">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage1"
                :page-sizes="[7, 10, 15]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total1">
            </el-pagination>
        </div>
        <!--导入/上传弹窗-->
        <el-dialog title="上传文件"
                   :visible.sync="dialogUploadVisible"
                   width="400px"
                   center>
            <el-form enctype ="multipart/form-data" class="demo-ruleForm">
                <el-upload
                    class="upload-demo"
                    action="#"
                    accept=".xls"
                    :auto-upload="false"
                    :before-upload="beforeUpload"
                    :on-preview="handlePreview"
                    :before-remove="beforeRemove"
                    :on-change="onChange"
                    :on-remove="onRemove"
                    :limit="1"
                    ref="newupload"
                    :onSuccess="uploadSuccess"
                    :on-exceed="handleExceed">
                    <el-button size="small" type="primary">点击上传<i class="el-icon-upload el-icon--right"></i></el-button>
                    <div slot="tip" class="el-upload__tip" style="color: #999;">只能上传后缀名为xls的文件</div>
                </el-upload>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogUploadVisible = false">取 消</el-button>
                <el-button type="primary" @click="newSubmitForm()">确 定</el-button>
            </div>
        </el-dialog>
        <!--打开添加用户窗口-->
        <el-dialog title="用户添加"
                   :visible.sync="dialogFormVisible"
                   @close="clearDia('addForm')"
                   width="550px"
                   center>
            <el-form :model="addForm" ref="addForm" :rules="rules" class="demo-dynamic">
                <el-form-item label="成员姓名" :label-width="formLabelWidth" prop="name" class="is-required">
                    <el-input v-model="addForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话号码" :label-width="formLabelWidth" prop="phone" class="is-required">
                    <el-input v-model="addForm.phone" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="所属部门" :label-width="formLabelWidth" prop="department" class="is-required">
                    <ul class="ztree" id="bmTreeA" style="height: 250px;overflow: auto">
                    </ul>
                </el-form-item>
                <el-form-item label="职务名称" :label-width="formLabelWidth" prop="duties">
                    <el-input v-model="addForm.duties" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="单位名称" :label-width="formLabelWidth" prop="obligateTwo">
                    <el-input v-model="addForm.obligateTwo" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱地址" :label-width="formLabelWidth" prop="email">
                    <el-input v-model="addForm.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注信息" :label-width="formLabelWidth" prop="remarks">
                    <el-input type="textarea" v-model="addForm.remarks"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible=false">取 消</el-button>
                <el-button type="primary" @click="onSubmit('addForm')">确 定</el-button>
            </div>
        </el-dialog>
        <!--打开修改用户窗口-->
        <el-dialog title="用户修改"
                   :visible.sync="dialogFormVisible1"
                   @close="clearDia('updateForm')"
                   width="550px"
                   center>
            <el-form :model="updateForm" ref="updateForm" :rules="rules" class="demo-dynamic">
                <el-form-item label="成员姓名" :label-width="formLabelWidth" prop="name" class="is-required">
                    <el-input v-model="updateForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话号码" :label-width="formLabelWidth" prop="phone" class="is-required">
                    <el-input v-model="updateForm.phone" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="所属部门" :label-width="formLabelWidth" prop="department" class="is-required">
                    <ul class="ztree" id="bmTreeB" style="height: 250px;overflow: auto">
                    </ul>
                </el-form-item>
                <el-form-item label="职务名称" :label-width="formLabelWidth" prop="duties">
                    <el-input v-model="updateForm.duties" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="单位名称" :label-width="formLabelWidth" prop="obligateTwo">
                    <el-input v-model="updateForm.obligateTwo" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱地址" :label-width="formLabelWidth" prop="email">
                    <el-input v-model="updateForm.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注信息" :label-width="formLabelWidth" prop="remarks">
                    <el-input type="textarea" v-model="updateForm.remarks"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible1=false">取 消</el-button>
                <el-button type="primary" @click="onSubmit1('updateForm')">确 定</el-button>
            </div>
        </el-dialog>
        <!--打开删除窗口-->
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="300px">
            <span>你确定要删除这些数据吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmDelete()">确 定</el-button>
            </span>
        </el-dialog>
        <!--打开导出(可多个)窗口-->
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible2"
            center
            width="400px">
            <span>你确定要导出当前通讯录吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible2 = false">取 消</el-button>
                <el-button type="primary" @click="confirmDownloads()">确 定</el-button>
            </span>
        </el-dialog>
        <!--打开导出(所有)窗口-->
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible3"
            center
            width="400px">
            <span>你确定要导出当前全部的通讯录人员吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible3 = false">取 消</el-button>
                <el-button type="primary" @click="confirmDownloadsAll()">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="添加部门"
                   :visible.sync="dialogAdd"
                   @close="clearDia('addBmForm')"
                   width="550px" center>
            <el-form :model="addBmForm" ref="addBmForm" class="demo-dynamic" :rules="rules2">
                <el-form-item label="部门名称" :label-width="formLabelWidth" prop="name" class="is-required">
                    <el-input v-model="addBmForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="部门描述" :label-width="formLabelWidth" prop="remarks">
                    <el-input type="textarea" v-model="addBmForm.remarks" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogAdd = false">取 消</el-button>
                <el-button type="primary" @click="addBmSure('addBmForm')">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="修改部门"
                   :visible.sync="dialogEdit"
                   @close="clearDia('editBmForm')"
                   width="550px" center>
            <el-form :model="editBmForm" ref="editBmForm"  class="demo-dynamic" :rules="rules2">
                <el-form-item label="部门名称" :label-width="formLabelWidth" prop="name" class="is-required">
                    <el-input v-model="editBmForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="上级部门" :label-width="formLabelWidth" prop="parentId" v-if="treeLevel">
                    <el-select v-model="editBmForm.parentId" placeholder="请选择">
                        <el-option
                            v-for="item in options"
                            :key="item.id"
                            :label="item.label"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="部门描述" :label-width="formLabelWidth" prop="remarks">
                    <el-input type="textarea" v-model="editBmForm.remarks" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogEdit = false">取 消</el-button>
                <el-button type="primary" @click="editBmSure('editBmForm')">确 定</el-button>
            </div>
        </el-dialog>
        <!--&lt;!&ndash;打开删除窗口&ndash;&gt;-->
        <el-dialog
            title="提示"
            :visible.sync="dialogDel"
            width="400px">
            <span>你确定要删除 {{bmTreeLabel}}？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogDel = false">取 消</el-button>
                <el-button type="primary" @click="delBmSure()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import 'ztree/css/metroStyle/metroStyle.css'
    import 'ztree'
    export default {
        name: "addressList",
        data() {
            var checkName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('真实姓名为必填项！'));
                } else {
                    if (!(/^[\u4E00-\u9FA5]{1,20}$/.test(value)) && !(/^[a-zA-Z][a-zA-Z\·\s]{0,18}[a-zA-Z]?$/.test(value))) {
                        callback(new Error('姓名仅限中文或英文，姓名长度不能超过20！'));
                    } else {
                        callback();
                    }
                }
            };
            var checkDuties = (rule, value, callback) => {
                if (value) {
                    if (!(/^[\u4E00-\u9FA5A-Za-z0-9_]{1,20}$/.test(value))) {
                        callback(new Error('职务名称仅限中英文，数字或下划线，职务名称长度不能超过20！'));
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            };
            var checkObligate = (rule, value, callback) => {
                if (value) {
                    if (!(/^[\u4E00-\u9FA5A-Za-z0-9_]{1,20}$/.test(value))) {
                        callback(new Error('单位名称仅限中英文，数字或下划线，单位名称长度不能超过20！'));
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            };
            var checkPhone = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('手机号为必填项！'));
                } else {
                    if (!(/^1([38][0-9]|4[5-9]|5[0-3,5-9]|6[6]|7[0-8]|9[89])\d{8}$/.test(value))) {
                        callback(new Error('手机号格式不正确！'));
                    } else {
                        callback();
                    }
                }
            };
            var checkEmail = (rule, value, callback) => {
                if (value) {
                    if (!(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(value))) {
                        callback(new Error('邮箱格式不正确！'));
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
            var checkDepartment = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('所属部门为必选项！'));
                } else {
                    callback();
                }
                callback();
            };
            var checkName2 = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('部门名称为必填项！'));
                } else {
                    if (!(/^[\u4E00-\u9FA5A-Za-z0-9_]{1,20}$/.test(value))) {
                        callback(new Error('部门名称格式仅限中英文，数字和下划线，长度不能超过20！'));
                    } else {
                        callback();
                    }
                }
            };
            var checkRemarks2 = (rule, value, callback) => {
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
                addDepartment: [],
                departmentProps: {
                    value: 'id',
                    children: 'children',
                    label: 'label'
                },
                dialogAdd: false,
                dialogEdit: false,
                dialogDel: false,
                treeLevel: 0,
                addBmForm: {
                    name: '',
                    parentId: '',
                    remarks: ''
                },
                // 增加部门中 上级部门下拉选项
                options: [],
                bmTreeId: '',
                bmTreeLabel: '',
                dialogVisible: false,
                dialogFormVisible: false,
                dialogFormVisible1: false,
                dialogUploadVisible: false,
                dialogVisible2: false,
                dialogVisible3: false,
                formInline: {
                    name: '',
                    phone: ''
                },
                departmentID: 0,
                addForm: {
                    name: '',
                    phone: '',
                    email: '',
                    department: '',
                    remarks: '',
                    duties: '',
                    obligateTwo: ''
                },
                editBmForm: {
                    id: '',
                    name: '',
                    parentId: '',
                    remarks: ''
                },
                updateForm: {
                    id: '',
                    name: '',
                    phone: '',
                    email: '',
                    department: '',
                    remarks: '',
                    duties: '',
                    obligateTwo: ''
                },
                departmentArr: [],
                data: [],
                dataA: [],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                tableData: [],
                multipleSelection: [],
                multipleSelectionAll: [],
                id: 'id',
                // 分页数据
                total1: 0,
                currentPage1: 1,
                pageSize: 7,
                formLabelWidth: '100px',
                fileList: [],
                rules: {
                    name: [
                        { validator: checkName, trigger: 'blur' },
                    ],
                    phone: [
                        { validator: checkPhone, trigger: 'blur' }
                    ],
                    email: [
                        { validator: checkEmail, trigger: 'blur' }
                    ],
                    department: [
                        { validator: checkDepartment, trigger: 'change' }
                    ],
                    duties: [
                        { validator: checkDuties, trigger: 'blur' }
                    ],
                    obligateTwo: [
                        { validator: checkObligate, trigger: 'blur' }
                    ],
                    remarks: [
                        { validator: checkRemarks, trigger: 'blur' }
                    ]
                },
                rules2: {
                    name: [
                        { validator: checkName2, trigger: 'blur' },
                    ],
                    remarks: [
                        { validator: checkRemarks2, trigger: 'blur' },
                    ]
                },
            }
        },
        methods: {
            // 修改激活状态
            changeState(index, row) {
                this.$api.decision.addIsStart.request({id: [row.id]}).then(() => {
                }).catch((err) => {
                    console.log(err);
                });
            },
            // 添加部门
            addBmSure(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.addBmForm.parentId = this.bmTreeId;
                        this.$api.decision.createDepartment.request(this.addBmForm).then((data) => {
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
                                this.dialogAdd = false;
                                this.$message({
                                    showClose: true,
                                    message: '创建成功！',
                                    type: 'success'
                                });
                                this.tableTree();
                            }
                        }).catch((err) => {
                            console.log(err);
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            // 修改部门
            editBmSure(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                       this.updateDepartment();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
             },
            // 修改部门接口
            updateDepartment() {
                this.$api.decision.updateDepartment.request(this.editBmForm).then((data) => {
                    console.log(data, 777);
                    if (data.data === 2) {
                        this.$message({
                            showClose: true,
                            message: '修改部门失败，部门重名！',
                            type: 'error'
                        });
                    } else if (data.data === 3) {
                        this.$message({
                            showClose: true,
                            message: '修改部门失败，不能选择自己的子部门作为自己的父部门！',
                            type: 'error'
                        });
                    } else {
                        this.tableTree();
                        this.$message({
                            showClose: true,
                            message: '修改部门成功！',
                            type: 'success'
                        });
                        this.dialogEdit = false;
                        this.tableList();
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            // 确定删除当前部门节点
            delBmSure() {
                if ( !this.treeLevel ) {
                    this.$message({
                        showClose: true,
                        message: '顶级部门不可删除！',
                        type: 'warning'
                    });
                } else {
                    this.$api.decision.deleteDepartment.request({id: [this.bmTreeId]}).then((data) => {
                        if (data.data === 2) {
                            this.$message({
                                showClose: true,
                                message: '删除部门失败，该部门存在子部门，请先删除子部门！',
                                type: 'error'
                            });
                        } else {
                            this.tableTree();
                            this.$message({
                                showClose: true,
                                message: '删除部门成功！',
                                type: 'success'
                            });
                            this.dialogDel = false;
                            this.tableList();
                        }
                    }).catch((err) => {
                        console.log(err);
                    });
                }
            },
            // 加载树
            loadTree() {
                var $this = this;
                var setting = {
                    data: {
                        key: {
                            name: 'label'
                        }
                    },
                    // check: {
                    //     enable: true,
                    //     chkboxType: { "Y": "s", "N": "sp" }
                    // },
                    callback: {
                        onRightClick: $this.zTreeOnRightClick,
                        onClick: $this.zTreeOnClick
                    }
                };
                var zTreeObj;
                console.log(zTreeObj);
                $(document).ready(function () {
                    zTreeObj = $.fn.zTree.init($("#bmTree"), setting, $this.data);
                    var nodeList = zTreeObj.getNodes();
                    //展开第一个根节点
                    zTreeObj.expandNode(nodeList[0], true);
                });
            },
            zTreeOnRightClick(event, treeId, treeNode) {
                let $this = this;
                console.log(treeNode, 8888);
                this.treeLevel = treeNode['level'];
                this.bmTreeId = treeNode.id;
                this.bmTreeLabel = treeNode.label;
                let $div = '<div class="showDiv">' +
                    '<div class="addBtn treeBtn">新增</div>' +
                    '<div class="edit treeBtn">编辑</div>' +
                    '<div class="del treeBtn">删除</div>' +
                    '</div>';
                $('body').append($div);
                $('.showDiv').css({
                    'top': event.clientY,
                    'left': event.clientX + 20,
                    'font-size': '14px',
                    'position': 'absolute',
                    'width': '70px',
                    'background': '#FFFFFF',
                    'border': '1px solid #dddddd',
                    'cursor': 'pointer',
                    'z-index': 999
                });
                $('.treeBtn').css({
                    'width': '100%',
                    'height': '35px',
                    'color': '#333333',
                    'line-height': '35px',
                    'text-align': 'center',
                });
                $('.addBtn').click(() => {
                    $this.dialogAdd = true;
                    $('.showDiv').remove();
                }).hover(function () {
                    $('.addBtn').css({
                        'background': '#F2F2F2',
                    })
                },function () {
                    $('.addBtn').css({
                        'background': '#FFFFFF',
                    })
                });
                $('.edit').click(() => {
                    $this.ADepartmentList();
                    $this.dialogEdit = true;
                    $('.showDiv').remove();
                    this.$api.decision.getBmValues.request({},{restUrl: `id=${this.bmTreeId}`}).then((data) => {
                        console.log(data.data, '66666666666666');
                        this.editBmForm = data.data;
                    }).catch((err) => {
                        console.log(err);
                    });
                }).hover(function () {
                    $('.edit').css({
                        'background': '#F2F2F2',
                    })
                },function () {
                    $('.edit').css({
                        'background': '#FFFFFF',
                    })
                });
                $('.del').click(() => {
                    $this.dialogDel = true;
                    $('.showDiv').remove();
                }).hover(function () {
                    $('.del').css({
                        'background': '#F2F2F2',
                    })
                },function () {
                    $('.del').css({
                        'background': '#FFFFFF',
                    })
                });
                $('body').bind('click', function (e) {
                    let evt = e.srcElement ? e.srcElement : e.target;
                    if (evt.class === 'showDiv' ) {
                        // 如果是元素本身，则返回
                        return;
                    } else {
                        $('.showDiv').remove(); // 如不是则隐藏元素
                    }
                });
            },
            zTreeOnClick(event, treeId, treeNode) {
                this.departmentID = treeNode.id;
                this.$api.decision.employeesList.request({},
                    {restUrl: `page=${this.currentPage1 - 1}&&size=${this.pageSize}&&name=${this.formInline['name']}&&phone=${this.formInline['phone']}&&departmentId=${this.departmentID}`}).then((data) => {
                    this.tableData = data.data.data;
                    this.total1 = data.data.total;
                    this.transform(data);
                }).catch((err) => {
                    console.log(err);
                });
            },
            // 加载添加部门上级部门下拉选项
            // 添加弹窗中的部门树
            loadTree2(value) {
                var $this = this;
                var setting = {
                    data: {
                        key: {
                            name: 'label'
                        }
                    },
                    check: {
                        enable: true,
                        chkStyle: "radio",
                        radioType: "all"
                    },
                    view: {
                        showIcon: false
                    },
                    callback: {
                        onCheck: $this.zTreeOnCheck2
                    }
                };
                var zTreeObj;
                $(document).ready(function () {
                    zTreeObj = $.fn.zTree.init($("#bmTreeA"), setting, $this.data);
                    var nodeList = zTreeObj.getNodes();
                    //展开第一个根节点
                    zTreeObj.expandNode(nodeList[0], true);
                    if ( value ) {
                        let x = zTreeObj.getNodeByParam("id", value, null);
                        zTreeObj.checkNode(x, true, false)
                    }
                });
            },
            // 点击单选框时的回调
            zTreeOnCheck2(event, treeId, treeNode) {
                console.log('event:', event);
                console.log('treeId:', treeId);
                console.log('treeNode:', treeNode);
                if (treeNode.checked === true) {
                    this.addForm.department = treeNode.id;
                } else {
                    this.addForm.department = '';
                }
            },
            loadTree3(value) {
                var $this = this;
                var setting = {
                    data: {
                        key: {
                            name: 'label'
                        }
                    },
                    check: {
                        enable: true,
                        chkStyle: "radio",
                        radioType: "all"
                    },
                    view: {
                        showIcon: false
                    },
                    callback: {
                        onCheck: $this.zTreeOnCheck3
                    }
                };
                var zTreeObj;
                $(document).ready(function () {
                    zTreeObj = $.fn.zTree.init($("#bmTreeB"), setting, $this.data);
                    var nodeList = zTreeObj.getNodes();
                    //展开第一个根节点
                    zTreeObj.expandNode(nodeList[0], true);
                    if ( value ) {
                        let x = zTreeObj.getNodeByParam("id", value, null);
                        zTreeObj.checkNode(x, true, false)
                    }
                });
            },
            // 点击单选框时的回调
            zTreeOnCheck3(event, treeId, treeNode) {
                console.log('treeNode:', treeNode);
                if (treeNode.checked === true) {
                    this.updateForm.department = treeNode.id;
                } else {
                    this.updateForm.department = '';
                }
            },
            ADepartmentList() {
                this.$api.decision.SuperiorDepartmentData.request().then((data) => {
                    this.options = data.data;
                }).catch((err) => {
                    console.log(err);
                });
            },
            // 添加用户
            onSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.addEmployees();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            validateX(x) {
                if (x === 1) {
                    this.formInline.name = this.valid.ValidateValue(this.formInline.name);
                } else {
                    this.formInline.phone = this.valid.ValidateValue(this.formInline.phone);
                }
            },
            // 修改用户信息
            onSubmit1(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.updateEmployees();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            onSelect() {
                this.changePageCoreRecordData();
                this.selectEmployees();
            },
            onReset() {
                this.formInline.name = '';
                this.formInline.phone = '';
                this.changePageCoreRecordData();
                this.selectEmployees();
            },
            // 添加规则上传
            newSubmitForm() {
                this.$refs.newupload.submit();
                this.dialogUploadVisible = false;
            },
            beforeUpload(file) {
                let fd = new FormData();
                fd.append("file", file);
                this.$api.decision.uploadEmployees.request(fd).then((data) => {
                    console.log(data);
                    if (data.data) {
                        this.$message({
                            showClose: true,
                            message: '上传成功！',
                            type: 'success'
                        });
                    } else {
                        this.$message({
                            showClose: true,
                            message: '上传失败！',
                            type: 'error'
                        });
                    }
                    this.tableList();
                }).catch((err) => {
                    this.$message({
                        showClose: true,
                        message: err.response.data.detail,
                        type: 'error'
                    });
                });
                return true;
            },
            // 文件上传功能
            handlePreview(file) {
                console.log(file);
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            onChange(file, fileList) {
                console.log(22222,file, fileList);
                this.fileList = fileList;
            },
            onRemove(file, fileList) {
                this.fileList = fileList;
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${ file.name + fileList }？`);
            },
            // 文件上传成功时的回调
            uploadSuccess(response, file, fileList) {
                console.log(response, file, fileList);
            },
            // 打开导出弹窗
            openDownLoadAll() {
                this.changePageCoreRecordData();
                if (this.multipleSelectionAll.length === 0) {
                    this.$message({
                        showClose: true,
                        message: '请先选择需要导出的用户数据！',
                        type: 'warning'
                    });
                } else {
                    this.dialogVisible2 = true;
                }
            },
            // 打开导出全部数据的弹窗
            openDownLoadsAll() {
                this.dialogVisible3 = true;
            },
            // 导出/下载多个
            confirmDownloads() {
                this.dialogVisible2 = false;
                this.downLoads();
            },
            // 导出全部
            confirmDownloadsAll() {
                this.dialogVisible3 = false;
                this.downLoadsAll();
            },
            // 导出接口(多个)
            downLoads() {
                let idsArr = [];
                if (this.multipleSelectionAll.length > 0) {
                    this.multipleSelectionAll.forEach(value => {
                        idsArr.push(value.id);
                    })
                } else {
                    this.multipleSelection.forEach(value => {
                        idsArr.push(value.id);
                    })
                }
                this.$api.decision.downLoadEmployees.request({id: idsArr}).then((data) => {
                    this.tableList();
                    this.downloadFiles(data.data);
                    this.multipleSelectionAll = [];
                }).catch((err) => {
                    this.$message.error(err.response.data.detail);
                });
            },
            downLoadsAll() {
                this.$api.decision.downLoadEmployees.request({id: []}).then((data) => {
                    this.tableList();
                    this.downloadFiles(data.data);
                    console.log(data);
                }).catch((err) => {
                    this.$message.error(err.response.data.detail);
                });
            },
            downloadFiles(data) {
                if (!data) {
                    return;
                }
                let url = window.URL.createObjectURL(new Blob([data]));
                let link = document.createElement('a');
                link.style.display = 'none';
                link.href = url;
                link.setAttribute('download', `${ new Date().getTime() }.xls`);
                document.body.appendChild(link);
                link.click();
            },
            openAdd() {
                this.addDepartment = [];
                this.dialogFormVisible = true;
                if (this.departmentID) {
                    this.addForm.department = this.departmentID;
                    this.loadTree2(this.departmentID);
                } else {
                    this.loadTree2();
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
                this.deleteEmployees();
            },
            // 点击修改按钮时的操作
            handleEdit(index, row) {
                this.addDepartment = [];
                this.dialogFormVisible1 = true;
                this.loadTree3(row.departmentId);
                for (let i in row) {
                    this.updateForm[i] = row[i];
                }
                this.updateForm.id = row.id;
                this.updateForm.department = row.departmentId;
            },
            tableList() {
                this.$api.decision.employeesList.request({},
                    {restUrl: `page=${this.currentPage1 - 1}&&size=${this.pageSize}&&name=${this.formInline['name']}&&phone=${this.formInline['phone']}&&departmentId=${this.departmentID}`}).then((data) => {
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
            tableTree() {
                this.$api.decision.departmentTree.request().then((data) => {
                    this.data = data.data;
                    this.loadTree();
                }).catch((err) => {
                    console.log(err);
                });
            },
            // 获取部门数据
            getDepartment() {
                this.$api.decision.receiveDepartment.request().then((data) => {
                    this.departmentArr = data.data;
                    this.transform(data);
                }).catch((err) => {
                    console.log(err);
                });
            },
            // 添加接口
            addEmployees() {
                this.$api.decision.createEmployees.request({
                    name: this.addForm.name,
                    phone: this.addForm.phone,
                    email: this.addForm.email,
                    department: this.addForm.department,
                    remarks: this.addForm.remarks,
                    duties: this.addForm.duties,
                    obligateTwo: this.addForm.obligateTwo
                }).then((data) => {
                    if (data.data === 2) {
                        this.$message({
                            showClose: true,
                            message: '添加用户失败，电话号码已存在！',
                            type: 'error'
                        });
                    } else {
                        this.$message({
                            showClose: true,
                            message: '添加用户成功！',
                            type: 'success'
                        });
                        this.dialogFormVisible = false;
                        this.selectEmployees();
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            // 查询接口
            selectEmployees() {
                this.currentPage1 = 1;
                this.$api.decision.selectEmployees.request({},
                    {restUrl: `page=${0}&&size=${this.pageSize}&&name=${this.formInline['name']}&&phone=${this.formInline['phone']}&&departmentId=${this.departmentID}`}).then((data) => {
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
            // 修改接口
            updateEmployees() {
                this.$api.decision.updateEmployees.request(
                    {
                        name: this.updateForm.name,
                        phone: this.updateForm.phone,
                        email: this.updateForm.email,
                        department: this.updateForm.department,
                        remarks: this.updateForm.remarks,
                        id: this.updateForm.id,
                        duties: this.updateForm.duties,
                        obligateTwo: this.updateForm.obligateTwo
                    }
                ).then((data) => {
                    if (data.data === 2) {
                        this.$message({
                            showClose: true,
                            message: '修改用户失败，电话号码已存在！',
                            type: 'error'
                        });
                    } else {
                        this.$message({
                            showClose: true,
                            message: '修改用户成功！',
                            type: 'success'
                        });
                        this.dialogFormVisible1 = false;
                        this.selectEmployees();
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            // 删除接口
            deleteEmployees() {
                let idsArr = [];
                if (this.multipleSelectionAll.length > 0) {
                    this.multipleSelectionAll.forEach(value => {
                        idsArr.push(value.id);
                    })
                } else {
                    this.multipleSelection.forEach(value => {
                        idsArr.push(value.id);
                    })
                }
                this.$api.decision.deleteEmployees.request({id: idsArr}).then(() => {
                    this.$message({
                        showClose: true,
                        message: '删除用户成功！',
                        type: 'success'
                    });
                    this.multipleSelectionAll = [];
                    this.selectEmployees();
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
            // 关闭弹窗时清空表单数据
            clearDia(formName) {
                this.$refs[formName].resetFields();
                this.addForm.department = '';
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
                if (!this.multipleSelectionAll || this.multipleSelectionAll.length <= 0) {
                    return;
                }
                // 标识当前行的唯一键的名称
                let id = this.id;
                let selectAllIds = [];
                this.multipleSelectionAll.forEach(row => {
                    selectAllIds.push(row[id]);
                });
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
            });
            this.tableTree();
        }
    }
</script>

<style>
    .el-tooltip__popper{
        max-width: 260px;
        line-height: 1.5;
    }
</style>
<style scoped>
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
