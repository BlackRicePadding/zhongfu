<template>
    <div id="smsTemplate">
        <div class="lar-title">
            <span class="lar-span">短信模板</span>
        </div>
        <div class="pad">
            <div class="pad-title">
                模板列表
                <el-popover
                    placement="bottom"
                    style="position: absolute;top: 3px;right: 15px;"
                    width="350"
                    trigger="click">
                    <el-form :inline="true" :model="formInline" class="demo-form-inline" style="text-align: left;margin-top: 25px;">
                        <el-form-item label="模板名称" style="margin-left: 25px">
                            <el-input v-model="formInline.name" @keyup.native="validateX" @keydown.native="validateX" style="width: 220px;" placeholder="请输入模板名称"></el-input>
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
                            prop="title"
                            label="模板标题"
                            min-width="150">
                        </el-table-column>
                        <el-table-column
                            align="left"
                            header-align="center"
                            prop="content"
                            label="模板内容"
                            min-width="200">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            header-align="center"
                            prop="enables"
                            min-width="150"
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
                        :current-page="currentPage1"
                        :page-sizes="[10, 15, 20]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total1">
                    </el-pagination>
                </div>
            </div>
        </div>
        <el-dialog
            title="创建模板"
            :visible.sync="dialogFormVisible"
            width="550px"
            @close="clearDia('addForm')"
            center>
            <el-form :model="addForm" ref="addForm" :rules="rules">
                <el-form-item label="模板标题" :label-width="formLabelWidth" prop="title" class="is-required">
                    <el-input v-model="addForm.title" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="标签说明" :label-width="formLabelWidth" prop="descriptionId" class="is-required">
                    <div class="tag" style="max-height: 120px;overflow-y: auto">
                        <div class="tagLi" ref="tagLi" @click="addToTemplate(index, tags)" v-for="(tags,index) in tagDeclare"
                                style="cursor: pointer">
                            <span class="tag-title">{{tags.name}}</span>
                            <span class="tag-content">{{tags.signage}}</span>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="模板内容" :label-width="formLabelWidth" prop="content" class="is-required">
                    <el-input ref="tempContent" type="textarea" v-model="addForm.content" @input="setAddFormValue" placeholder="标签内容通过点击获取，可删除，请勿手写和复制粘贴！"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="onSubmit('addForm')">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog
            title="编辑模板"
            :visible.sync="dialogFormVisible1"
            width="550px"
            @close="clearDia('updateForm')"
            center>
            <el-form :model="updateForm" ref="updateForm" :rules="rules">
                <el-form-item label="模板标题" :label-width="formLabelWidth" prop="title" class="is-required">
                    <el-input v-model="updateForm.title" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="标签说明" :label-width="formLabelWidth" prop="descriptionId" class="is-required">
                    <div class="tag" style="max-height: 120px;overflow-y: auto">
                        <div class="tagLi" ref="tagLiEdit" @click="addToTemplateEdit(index, tags)" v-for="(tags,index) in tagDeclareEdit"
                                style="cursor: pointer">
                            <span class="tag-title">{{tags.name}}</span>
                            <span class="tag-content">{{tags.signage}}</span>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="模板内容" :label-width="formLabelWidth" prop="content" class="is-required">
                    <el-input type="textarea" ref="tempContentUp" v-model="updateForm.content" @input="setUpdateContent" placeholder="标签内容通过点击获取，可删除，请勿手写和复制粘贴！"></el-input>
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
        name: "smsTemplate",
        data() {
            var checkTitle = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('模板标题为必填项！'));
                } else {
                    if (!(/^[\u4E00-\u9FA5A-Za-z0-9_]{1,20}$/.test(value))) {
                        callback(new Error('模板标题仅限中英文，数字，下划线，长度不得超过20！'));
                    } else {
                        callback();
                    }
                }
            };
            var checkTagID = (rule, value, callback) => {
                if (!value.length) {
                    return callback(new Error('标签是必选项！'));
                } else {
                    callback();
                }
            };
            var checkContent = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('模板内容为必填项！'));
                } else {
                    if (value.length > 255) {
                        callback(new Error('模板内容字符长度不得超过255！'));
                    } else {
                        callback();
                    }
                }
            };
            return {
                dialogFormVisible: false,
                dialogFormVisible1: false,
                dialogVisible: false,
                isOpen: 0,
                formInline: {
                    name: '',
                },
                formLabelWidth: '100px',
                addForm: {
                    title: '',
                    content: '',
                    descriptionId: []
                },
                updateForm: {
                    id: '',
                    title: '',
                    content: '',
                    descriptionId: []
                },
                tagDeclare: [],
                tagDeclareEdit: [],
                tableData: [],
                // 分页数据
                total1: 0,
                currentPage1: 1,
                pageSize: 10,
                multipleSelection: [],
                multipleSelectionAll: [],
                id: 'id',
                rules: {
                    title: [
                        { validator: checkTitle, trigger: 'blur' },
                    ],
                    descriptionId: [
                        { validator: checkTagID, trigger: 'click' }
                    ],
                    content: [
                        { validator: checkContent, trigger: 'blur' }
                    ],
                },
            //    添加模板 模板内容模拟数组 检查是否标签已点击
                addContentArr: [],
            //    修改模板 模拟
                editContentArr: []
            }
        },
        methods: {
            validateX() {
                this.formInline.name = this.valid.ValidateValue(this.formInline.name);
            },
            // 点击标签说明添加
            addToTemplate(index,tags) {
                this.$refs.tagLi[index].style.backgroundColor = `rgba(200,200,200,0.5)`;
                if (this.addContentArr.indexOf(tags.signage) > -1) {
                    return
                } else {
                    this.AddOnPos(this.$refs.tempContent.$el.getElementsByTagName('textarea')[0],tags.signage);
                    this.addContentArr.push(tags.signage);
                    // this.addForm.content += tags.signage;
                    this.addForm.descriptionId.push(tags.id);
                }
            },
            // 点击标签说明 修改
            addToTemplateEdit(index, tags) {
                this.$refs.tagLiEdit[index].style.backgroundColor = `rgba(200,200,200,0.5)`;
                if (this.editContentArr.indexOf(tags.signage) > -1) {
                    return
                } else {
                    this.AddOnPosUp(this.$refs.tempContentUp.$el.getElementsByTagName('textarea')[0],tags.signage);
                    this.editContentArr.push(tags.signage);
                    // this.updateForm.content += tags.signage;
                    this.updateForm.descriptionId.push(tags.id);
                }
            },
            // 修改激活状态
            changeState(index, row) {
                console.log(row.id,'------------');
                this.$api.decision.isActive.request({id: [row.id]}).then(() => {
                    // this.tableList();
                }).catch((err) => {
                    console.log(err);
                });
            },
            // 监听添加模板中content变化
            setAddFormValue() {
                console.log(this.addForm, 'kkkkkkkk');
                let aa = this.addForm.content.split('}');
                console.log('aa:', aa);
                let str = '';
                aa.forEach((value) => {
                    str += value + ',';
                });
                console.log('str:', str);
                str = str.substring(0, str.length - 1);
                let bb = str.split('{');
                console.log('bb:',bb);
                let arr = [];
                bb.forEach((value) => {
                    if (value !== '') {
                        if (value.split(',').length > 1) {
                            arr.push('{' + value.split(',')[0] + '}');
                        }
                    }
                });
                console.log('arr:', arr);
                var indexArr = [];
                arr.forEach((val) => {
                    // 获取存在的标签名的下标
                    indexArr.push(this.addContentArr.indexOf(val));
                });
                console.log('indexArr:', indexArr);
                var idsArr = [];
                indexArr.forEach((value) => {
                    if (typeof this.addForm.descriptionId[value] !== 'undefined') {
                        idsArr.push(this.addForm.descriptionId[value]);
                    }
                });
                this.addForm.descriptionId = idsArr;
                let numArr = [];
                let styleArr = [];
                for (let i = 0; i < this.tagDeclare.length; i++) {
                    numArr.push(i);
                    for (let j = 0; j < idsArr.length; j++) {
                        if (this.tagDeclare[i].id === idsArr[j]) {
                            this.$refs.tagLi[i].style.backgroundColor = `rgba(200,200,200,0.5)`;
                            styleArr.push(i);
                            console.log(22222);
                        }
                    }
                }
                let changeArr = numArr.filter(el => !~styleArr.indexOf(el));
                changeArr.forEach(val => {
                   this.$refs.tagLi[val].style.backgroundColor = `rgb(248,248,248)`;
                });
                this.addContentArr = arr;
                console.log(this.addContentArr, this.addForm.descriptionId, 'jjjjjjjjjjjjjjjjj');
            },
            // 监听修改模板中content变化
            setUpdateContent() {
                //editContentArr
                let aa = this.updateForm.content.split('}');
                // console.log(aa, 'aaaaaaaaaaa');
                let str = '';
                aa.forEach((value) => {
                    str += value + ',';
                });
                str = str.substring(0, str.length - 1);
                let bb = str.split('{');
                // console.log(bb, 'sssssssssssss', this.addContentArr, this.addForm.descriptionId);
                let arr = [];
                bb.forEach((value) => {
                    if (value !== '') {
                        if (value.split(',').length > 1) {
                            arr.push('{' + value.split(',')[0] + '}');
                        }
                    }
                });
                var indexArr = [];
                arr.forEach((val) => {
                    // 获取存在的标签名的下标
                    indexArr.push(this.editContentArr.indexOf(val));
                });
                var idsArr = [];
                indexArr.forEach((value) => {
                    if (typeof this.updateForm.descriptionId[value] !== 'undefined') {
                        idsArr.push(this.updateForm.descriptionId[value]);
                    }
                });
                this.updateForm.descriptionId = idsArr;
                let numArr = [];
                let styleArr = [];
                for (let i = 0; i < this.tagDeclareEdit.length; i++) {
                    numArr.push(i);
                    for (let j = 0; j < idsArr.length; j++) {
                        if (this.tagDeclareEdit[i].id === idsArr[j]) {
                            this.$refs.tagLiEdit[i].style.backgroundColor = `rgba(200,200,200,0.5)`;
                            styleArr.push(i);
                            console.log(22222);
                        }
                    }
                }
                let changeArr = numArr.filter(el => !~styleArr.indexOf(el));
                changeArr.forEach(val => {
                    this.$refs.tagLiEdit[val].style.backgroundColor = `rgb(248,248,248)`;
                });
                this.editContentArr = arr;
                console.log(this.editContentArr, this.updateForm.descriptionId, 'jjjjjjjjjjjjjjjjj');
            },
            unique(arr) {
                let res = [];
                let json = {};
                for (let i = 0; i < arr.length; i++) {
                    if (!json[arr[i]]) {
                        res.push(arr[i]);
                        json[arr[i]] = 1;
                    }
                }
                return res;
            },
            // 添加模板
            onSubmit(formName) {
                console.log(this.addForm, '********');
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        //        验证添加的content格式是否正确
                        var len1 = this.addForm.content.length - this.addForm.content.replace(/{/g,'').length;
                        var len2 = this.addForm.content.length - this.addForm.content.replace(/}/g,'').length;
                        if (len1 === len2) {
                            console.log(this.addForm.descriptionId.length);
                            console.log(this.unique(this.addForm.descriptionId).length);
                            if (this.addForm.descriptionId.length !== this.unique(this.addForm.descriptionId).length) {
                                console.log(444444);
                                this.$message({
                                    showClose: true,
                                    message: '模板内容中标签不能重复使用！',
                                    type: 'error'
                                });
                            } else {
                                this.addSMSTemplate();
                            }
                        } else {
                            this.$message({
                                showClose: true,
                                message: '模板内容格式错误！',
                                type: 'error'
                            });
                        }
                    } else {
                        console.log('添加失败!');
                        return false;
                    }
                });
            },
            // 修改模板
            onSubmit1(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        const len3 = this.updateForm.content.length - this.updateForm.content.replace(/{/g,'').length;
                        const len4 = this.updateForm.content.length - this.updateForm.content.replace(/}/g,'').length;
                        if (len3 === len4) {
                            if (this.updateForm.descriptionId.length !== this.unique(this.updateForm.descriptionId).length) {
                                console.log(444444);
                                this.$message({
                                    showClose: true,
                                    message: '模板内容中标签不能重复使用！',
                                    type: 'error'
                                });
                            } else {
                                this.updateSMSTemplate();
                            }
                        } else {
                            this.$message.error('模板内容格式错误');
                        }
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            onSelect() {
                this.changePageCoreRecordData();
                this.selectSMSTemplate();
            },
            onReset() {
                this.formInline.name = '';
                this.changePageCoreRecordData();
                this.selectSMSTemplate();
            },
            openAdd() {
                this.addContentArr = [];
                this.addForm = {
                    title: '',
                    content: '',
                    descriptionId: []
                };
                this.dialogFormVisible = true;
                this.receiveTags();
            },
            tableList() {
                this.$api.decision.smsTemplate.request({},
                    {restUrl: `page=${this.currentPage1 - 1}&&size=${this.pageSize}&&name=${this.formInline['name']}`}).then((data) => {
                    this.tableData = data.data.data;
                    this.total1 = data.data.total;
                    setTimeout(() => {
                        this.setSelectRow();
                    }, 20);
                }).catch((err) => {
                    console.log(err);
                });
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
                this.deleteSMSTemplate();
            },
            // 点击修改按钮时的操作
            handleEdit(index, row) {
                console.log(row, 777);
                this.dialogFormVisible1 = true;
                let strDemo = [];
                row.content.split('}').forEach((value) => {
                    if (value !== '') {
                        value.split('{').forEach((val) => {
                            if (val.indexOf('$') > -1) {
                                strDemo.push('{' + val + '}');
                            }
                        })
                    }
                });
                this.editContentArr = strDemo;
                this.receiveTagsEdit(row);
            },
            // 添加接口
            addSMSTemplate() {
                this.$api.decision.createSMSTemplate.request(this.addForm).then((data) => {
                    if (data.data.state === '2') {
                        this.$message({
                            showClose: true,
                            message: '添加模板失败，模板重名！',
                            type: 'error'
                        });
                    } else if (data.data.state === '3') {
                        this.$message({
                            showClose: true,
                            message: data.data.msg,
                            type: 'error'
                        });
                    } else {
                        this.$message({
                            showClose: true,
                            message: '添加模板成功！',
                            type: 'success'
                        });
                        this.dialogFormVisible = false;
                        this.selectSMSTemplate();
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            // 查询接口
            selectSMSTemplate() {
                this.currentPage1 = 1;
                this.$api.decision.selectSMSTemplate.request({},
                    {restUrl: `page=${0}&&size=${this.pageSize}&&name=${this.formInline['name']}`}).then((data) => {
                    this.tableData = data.data.data;
                    this.total1 = data.data.total;
                    setTimeout(() => {
                        this.setSelectRow();
                    }, 20);
                }).catch((err) => {
                    console.log(err);
                });
            },
            // 修改接口
            updateSMSTemplate() {
                this.$api.decision.updateSMSTemplate.request(this.updateForm).then((data) => {
                    if (data.data.state === '2') {
                        this.$message({
                            showClose: true,
                            message: '修改模板失败，模板重名！',
                            type: 'error'
                        });
                    } else if (data.data.state === '3') {
                        this.$message({
                            showClose: true,
                            message: data.data.msg,
                            type: 'error'
                        });
                    } else {
                        this.$message({
                            showClose: true,
                            message: '修改模板成功！',
                            type: 'success'
                        });
                        this.dialogFormVisible1 = false;
                        this.selectSMSTemplate();
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            // 删除接口
            deleteSMSTemplate() {
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
                this.$api.decision.deleteSMSTemplate.request({id: idsArr}).then(() => {
                    this.$message({
                        showClose: true,
                        message: '删除模板成功！',
                        type: 'success'
                    });
                    this.multipleSelectionAll = [];
                    this.selectSMSTemplate();
                }).catch((err) => {
                    console.log(err);
                });
            },
            // 关闭弹窗时清空表单数据
            clearDia(formName) {
                this.$refs[formName].resetFields();
                this.tagDeclare.forEach((val,index) => {
                    this.$refs.tagLi[index].style.backgroundColor = `rgb(248,248,248)`;
                });
                this.tagDeclareEdit.forEach((val,index) => {
                    this.$refs.tagLiEdit[index].style.backgroundColor = `rgb(248,248,248)`;
                });
            },
            // 警告信息
            openWarning() {
                this.$message({
                    showClose: true,
                    message: '请先选择需要删除的数据！',
                    type: 'warning'
                });
            },
            // 弹窗获取标签
            receiveTags() {
                this.$api.decision.receiveSMSTags.request().then((data) => {
                    this.tagDeclare = data.data;
                }).catch((err) => {
                    console.log(err);
                });
            },
            // 修改弹窗获取标签
            receiveTagsEdit(row) {
                this.$api.decision.receiveSMSTags.request().then((data) => {
                    this.tagDeclareEdit = data.data;
                    this.updateForm.id = row.id;
                    this.updateForm.title = row.title;
                    this.updateForm.content = row.content;
                    this.updateForm.descriptionId = [];
                    row.descriptionId.forEach((value) => {
                        this.updateForm.descriptionId.push(value.smsKeyword.id);
                    });
                    for (let i = 0; i < this.tagDeclareEdit.length; i++) {
                        for (let j = 0; j < this.updateForm.descriptionId.length; j++) {
                            if (this.tagDeclareEdit[i].id === this.updateForm.descriptionId[j]) {
                                console.log('aaaaaaa');
                                const that = this;
                                setTimeout(function () {
                                    that.$refs.tagLiEdit[i].style.backgroundColor = `rgba(200,200,200,0.5)`;
                                },20);
                            }
                        }
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            // 记忆分页
            // 分页
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
            AddOnPos(obj, charvalue) {
                if (document.selection) {
                    console.log(2222);
                } else if (obj.selectionStart || obj.selectionStart === 0) {
                    const startPos = obj.selectionStart;
                    const endPos = obj.selectionEnd;
                    const restoreTop = obj.scrollTop;
                    this.addForm.content = this.addForm.content.substring(0, startPos) + charvalue + this.addForm.content.substring(endPos, this.addForm.content.length);
                    if (restoreTop > 0) {
                        obj.scrollTop = restoreTop
                    }
                    obj.focus();
                    setTimeout(() => {
                        obj.selectionStart = startPos + charvalue.length;
                        obj.selectionEnd = startPos + charvalue.length;
                    }, 0)
                } else {
                    this.addForm.content = this.addForm.content + charvalue;
                    obj.focus();
                }
            },
            AddOnPosUp(obj, charvalue) {
                if (document.selection) {
                    console.log(2222);
                } else if (obj.selectionStart || obj.selectionStart === 0) {
                    const startPos = obj.selectionStart;
                    const endPos = obj.selectionEnd;
                    const restoreTop = obj.scrollTop;
                    this.updateForm.content = this.updateForm.content.substring(0, startPos) + charvalue + this.updateForm.content.substring(endPos, this.updateForm.content.length);
                    if (restoreTop > 0) {
                        obj.scrollTop = restoreTop
                    }
                    obj.focus();
                    setTimeout(() => {
                        obj.selectionStart = startPos + charvalue.length;
                        obj.selectionEnd = startPos + charvalue.length;
                    }, 0)
                } else {
                    this.updateForm.content = this.updateForm.content + charvalue;
                    obj.focus();
                }
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
        background: #f8f8f8;
        bottom: 0;
        right: 0;
        padding-right: 20px;
        height: 47px;
        line-height: 47px;
        z-index: 20;
    }
    .tagLi{
        display: inline-block;
        padding: 0 10px;
        margin-right: 5px;
        height: 32px;
        line-height: 30px;
        font-size: 12px;
        color: #409EFF;
        border-radius: 4px;
        box-sizing: border-box;
        border: 1px solid rgba(64,158,255,.2);
        white-space: nowrap;
        background-color: rgb(248, 248, 248);
        cursor: pointer;
    }
    .tagLi:hover{
        background: rgba(248, 248, 248, 0.1);
    }
</style>