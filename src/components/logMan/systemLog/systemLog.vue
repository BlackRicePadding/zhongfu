<template>
    <div id="newsLog">
        <div class="lar-title">
            <span class="lar-span">系统日志</span>
        </div>
        <div class="pad">
            <div class="pad-title">日志管理
                <el-popover
                    placement="bottom"
                    style="position: absolute;top: 3px;right: 15px;"
                    width="520"
                    trigger="click">
                    <el-form :inline="true" :model="formInline" class="demo-form-inline" style="text-align: left;margin-top: 25px;">
                        <el-form-item label="添加时间" style="margin-left: 30px;">
                            <el-date-picker
                                v-model="formInline['addTime']"
                                type="datetimerange"
                                range-separator="~"
                                value-format="yyyy-MM-ddTHH:mm:ss"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="日志内容" style="margin-left: 30px;">
                            <el-input type="textarea" v-model="formInline['name']" placeholder="请输入日志内容"
                                      @keyup.native="validateX" @keydown.native="validateX" style="width: 400px;"></el-input>
                        </el-form-item>
                        <el-form-item style="margin-left: 194px;">
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
                        <el-button type="warning" @click="dialogUploadVisible=true">导入</el-button>
                        <el-button type="primary" @click="openDownLoadAll()">导出</el-button>
                        <el-button type="primary" @click="openDownLoadsAll()">导出全部</el-button>
                    </div>
                    <div style="clear: both"></div>
                </div>
                <div class="table-content">
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
                            label="日志类型"
                            prop="logtype"
                            min-width="120">
                        </el-table-column>
                        <el-table-column
                            align="left"
                            header-align="center"
                            :show-overflow-tooltip="true"
                            prop="logcontent"
                            label="日志内容"
                            min-width="250">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            header-align="center"
                            prop="addtime"
                            label="日志添加时间"
                            min-width="180">
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
        <!--打开下载(可多个)窗口-->
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible2"
            width="400px" center>
            <span>你确定要导出当前系统日志吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible2 = false">取 消</el-button>
                <el-button type="primary" @click="confirmDownloads()">确 定</el-button>
            </span>
        </el-dialog>
        <!--打开下载(可多个)窗口-->
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible3"
            width="400px" center>
            <span>你确定要导出当前全部的系统日志吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible3 = false">取 消</el-button>
                <el-button type="primary" @click="confirmDownloadsAll()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "newsLog",
        data() {
            return {
                formInline: {
                    name: '',
                    addTime: '',
                },
                isOpen: 0,
                dialogVisible: false,
                dialogVisible2: false,
                dialogVisible3: false,
                dialogUploadVisible: false,
                tableData: [],
                multipleSelection: [],
                multipleSelectionAll: [],
                id: 'id',
                // 分页数据
                total1: 0,
                currentPage1: 1,
                pageSize: 10,
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
            validateX() {
                this.formInline.name = this.valid.ValidateValue(this.formInline.name);
            },
            // 添加规则上传
            newSubmitForm() {
                this.$refs.newupload.submit();
                this.dialogUploadVisible = false;
            },
            beforeUpload(file) {
                let fd = new FormData();
                fd.append("file", file);
                this.$api.decision.uploadSystemLog.request(fd).then((data) => {
                    console.log(data);
                    if (data.data) {
                        this.$message({
                            showClose: true,
                            message: '上传成功',
                            type: 'success'
                        });
                    } else {
                        this.$message({
                            showClose: true,
                            message: '上传失败',
                            type: 'error'
                        });
                    }
                    console.log(111);
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
            // 下载多个
            confirmDownloads() {
                this.dialogVisible2 = false;
                this.downLoads();
            },
            // 下载全部
            confirmDownloadsAll() {
                this.dialogVisible3 = false;
                this.downLoadsAll();
            },
            // 下载接口(多个)
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
                this.$api.decision.downloadSystemLog.request({id: idsArr}).then((data) => {
                    this.tableList();
                    this.multipleSelectionAll = [];
                    this.downloadFiles(data.data);
                }).catch((err) => {
                    this.$message.error(err.response.data.detail);
                });
            },
            // 下载全部的接口
            downLoadsAll() {
                this.$api.decision.downloadSystemLog.request({id: []}).then((data) => {
                    this.tableList();
                    this.downloadFiles(data.data);
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
            onSelect() {
                this.changePageCoreRecordData();
                this.selectLog();
            },
            onReset() {
                this.formInline["name"] = '';
                this.formInline["addTime"] = '';
                this.changePageCoreRecordData();
                this.selectLog();
            },
            // 点击修改按钮时的操作
            handleEdit(index, row) {
                console.log(index, row);
            },
            tableList() {
                let tt = '',
                    tt2 = '';
                if (this.formInline['addTime']) {
                    tt = this.setTime.transformTime(this.formInline['addTime'][0]);
                    tt2 = this.setTime.transformTime(this.formInline['addTime'][1]);
                }
                this.$api.decision.systemLog.request({},
                    {restUrl: `page=${this.currentPage1 - 1}&&size=${this.pageSize}&&name=${this.formInline['name']}&&addTime=${tt}&&endTime=${tt2}`}).then((data) => {
                    this.tableData = data.data.logSysList;
                    this.total1 = data.data.logSysCount;
                    this.transform(data);
                    setTimeout(() => {
                        this.setSelectRow();
                    }, 20);
                }).catch((err) => {
                    console.log(err);
                });
            },
            selectLog() {
                let tt = '',
                    tt2 = '';
                if (this.formInline['addTime']) {
                    tt = this.setTime.transformTime(this.formInline['addTime'][0]);
                    tt2 = this.setTime.transformTime(this.formInline['addTime'][1]);
                }
                this.currentPage1 = 1;
                this.$api.decision.selectSystemLog.request({},
                    {restUrl: `page=${0}&&size=${this.pageSize}&&name=${this.formInline['name']}&&addTime=${tt}&&endTime=${tt2}`}).then((data) => {
                    this.tableData = data.data.logSysList;
                    this.total1 = data.data.logSysCount;
                    this.transform(data);
                    setTimeout(() => {
                        this.setSelectRow();
                    }, 20);
                }).catch((err) => {
                    console.log(err);
                });
            },
            transform(data) {
                for (let i = 0, length = data.data.logSysList.length; i < length; i++) {
                    if (this.tableData[i]['addtime']) {
                        this.tableData[i]['addtime'] = this.tableData[i]['addtime'].split('T')[0] +
                            " " + this.tableData[i]['addtime'].split('T')[1].split('+')[0];
                    }
                    if (this.tableData[i]['logtype'] === 170) {
                        this.tableData[i]['logtype'] = '短信';
                    }
                }
            },
            // 关闭弹窗时清空表单数据
            clearDia(formName) {
                this.$refs[formName].resetFields();
            },
            // 分页
            handleSizeChange(pageSize) {
                // 每页条数切换
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
        bottom: -100px;
        right: 0;
        padding-right: 20px;
        height: 47px;
        line-height: 47px;
        z-index: 20;
    }
</style>