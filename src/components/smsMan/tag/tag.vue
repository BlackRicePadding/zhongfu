<template>
    <div id="tag">
        <div class="lar-title">
            <span class="lar-span">标签配置</span>
        </div>
        <div class="pad">
            <div class="pad-title">标签列表
                <el-popover
                    placement="bottom"
                    style="position: absolute;top: 3px;right: 15px;"
                    width="350"
                    trigger="click">
                    <el-form :inline="true" :model="formInline" class="demo-form-inline" style="text-align: left;margin-top: 25px;">
                        <el-form-item label="标签名称" style="margin-left: 25px">
                            <el-input v-model="formInline.name" @keyup.native="validateX" @keydown.native="validateX" style="width: 220px;" placeholder="请输入标签名称"></el-input>
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
                            label="标签名称"
                            min-width="150">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            header-align="center"
                            prop="signage"
                            label="标签标识"
                            min-width="150">
                        </el-table-column>
                        <el-table-column
                            align="left"
                            header-align="center"
                            prop="inRange"
                            label="标签包含范围"
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
        <el-dialog title="添加标签" :visible.sync="dialogFormVisible" width="550px" center @closed="clearDia('addForm')">
            <el-form :model="addForm" label-width="100px" ref="addForm" :rules="rules">
                <el-form-item label="标签名称" prop="name" class="is-required">
                    <el-input v-model="addForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="标签类型" prop="smsKeywordTypeId" class="is-required">
                    <el-select v-model="addForm.smsKeywordTypeId" placeholder="请选择">
                        <el-option
                            v-for="item in options"
                            :key="item.id"
                            :label="item.keywordType"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="标签范围" v-if="addForm.smsKeywordTypeId===1" prop="range1" class="is-required">
                    <p v-for="(item, index) in rangeArr" style="margin-bottom: 2px;">
                        <el-input-number controls-position="right" :precision="2" autocomplete="off" v-model="item.from" style="width: 35%"></el-input-number>
                        <b>～</b>
                        <el-input-number controls-position="right" :precision="2" autocomplete="off" v-model="item.to" style="width: 35%"></el-input-number>
                        <el-button type="danger" size="small" @click="delRangeArr(index)">-</el-button>
                        <el-button type="waring" size="small" @click="addRangeArr(index)">+</el-button>
                    </p>
                </el-form-item>
                <el-form-item label="标签范围" v-if="addForm.smsKeywordTypeId===2" prop="range2" class="is-required">
                    <el-input v-model="addInRange" autocomplete="off" placeholder="如果有多个，请以|隔开"></el-input>
                </el-form-item>
                <el-form-item label="标签范围" v-if="addForm.smsKeywordTypeId===3" prop="range3" class="is-required">
                    <p v-for="(item, index) in timeRangeArr" style="margin-bottom: 2px;">
                        <el-date-picker
                            style="width: 75%;"
                            v-model="item.time"
                            type="datetimerange"
                            range-separator="～"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :default-time="['12:00:00']"
                            value-format="yyyy/MM/dd HH:mm:ss">
                        </el-date-picker>
                        <el-button type="danger" size="small" @click="delTimeArr(index)">-</el-button>
                        <el-button type="waring" size="small" @click="addTimeArr(index)">+</el-button>
                    </p>
                </el-form-item>
                <el-form-item label="标签标识" prop="signage" class="is-required">
                    <el-input v-model="addForm.signage" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="标签描述" prop="remarks">
                    <el-input type="textarea" v-model="addForm.remarks" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="onSubmit('addForm')">确 定</el-button>
            </div>
        </el-dialog >
        <el-dialog title="修改标签" :visible.sync="dialogFormVisible1" width="550px" center @closed="clearDia('updateForm')">
            <el-form :model="updateForm" label-width="100px" ref="updateForm" :rules="rules">
                <el-form-item label="标签名称" prop="name" class="is-required">
                    <el-input v-model="updateForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="标签类型" prop="smsKeywordTypeId" class="is-required">
                    <el-select v-model="updateForm.smsKeywordTypeId" placeholder="请选择">
                        <el-option
                            v-for="item in options"
                            :key="item.id"
                            :label="item.keywordType"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="标签范围" v-if="updateForm.smsKeywordTypeId===1" class="is-required" prop="range1">
                    <p v-for="(item, index) in rangeArr" style="margin-bottom: 2px;">
                        <el-input-number controls-position="right" :precision="2" autocomplete="off" v-model="item.from" style="width: 35%"></el-input-number>
                        <b>～</b>
                        <el-input-number controls-position="right" :precision="2" autocomplete="off" v-model="item.to" style="width: 35%"></el-input-number>
                        <el-button type="danger" size="small" @click="delRangeArr(index)">-</el-button>
                        <el-button type="waring" size="small" @click="addRangeArr(index)">+</el-button>
                    </p>
                </el-form-item>
                <el-form-item label="标签范围" v-if="updateForm.smsKeywordTypeId===2" prop="range2" class="is-required">
                    <el-input v-model="addInRange" autocomplete="off" placeholder="如果有多个，请以|隔开"></el-input>
                </el-form-item>
                <el-form-item label="标签范围" v-if="updateForm.smsKeywordTypeId===3" prop="range3" class="is-required">
                    <p v-for="(item, index) in timeRangeArr" style="margin-bottom: 2px;">
                        <el-date-picker
                            style="width: 75%;"
                            v-model="item.time"
                            type="datetimerange"
                            range-separator="～"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :default-time="['12:00:00']"
                            value-format="yyyy/MM/dd HH:mm:ss">
                        </el-date-picker>
                        <el-button type="danger" size="small" @click="delTimeArr(index)">-</el-button>
                        <el-button type="waring" size="small" @click="addTimeArr(index)">+</el-button>
                    </p>
                </el-form-item>
                <el-form-item label="标签标识" prop="signage" class="is-required">
                    <el-input v-model="updateForm.signage" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="标签描述" prop="remarks">
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
                    return callback(new Error('标签名称为必填项！'));
                } else {
                    if (!(/^[\u4e00-\u9fa5_a-zA-Z0-9]{1,20}$/.test(value))) {
                        callback(new Error('标签名称格式仅限中英文，数字和下划线，长度不得超过20！'));
                    } else {
                        callback();
                    }
                }
            };
            var checkType = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('标签类型为必选项！'));
                } else {
                    callback();
                }
            };
            var checkSignage = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('标签标识为必填项！'));
                } else {
                    if (!(/^\{\$[_a-zA-Z]{1,27}\}$/.test(value))) {
                        callback(new Error('标签标识以{$开头，以}结尾，中间仅限英文和下划线，长度不得超过30！'));
                    } else {
                        callback();
                    }
                }//;
            };
            var checkRange1 = (rule, value, callback) => {
                console.log(this.rangeArr, 111111111);
                this.rangeArr.forEach( (val, index)=>{
                    if ( val.from === '' || val.to === '') {
                        return callback(new Error('数字标签范围不能为空！'));
                    } else {
                        if (parseFloat(val.from) > parseFloat(val.to)) {
                            callback(new Error('左边数字不能大于右边数字！'));
                        } else {
                            if ( index === this.rangeArr.length - 1 ) {
                                callback();
                            }
                        }
                    }
                } );
            };
            var checkRange2 = (rule, value, callback) => {
                if (!this.addInRange) {
                    return callback(new Error('标签范围为必填项！'));
                } else {
                    callback();
                }
            };
            var checkRange3 = (rule, value, callback) => {
                this.timeRangeArr.forEach( (val, index)=>{
                    console.log(val, '123213');
                    if (val.time === null) {
                        return callback(new Error('标签范围为必填项！'));
                    } else if (!val.time.length) {
                        callback(new Error('标签范围为必填项！'));
                    } else {
                        console.log(val, '456456');
                        if (!val.time[0] || !val.time[1]) {
                            callback(new Error('标签范围为必填项！'));
                        } else {
                            if (index === this.timeRangeArr.length - 1) {
                                callback();
                            }
                        }
                    }
                } );
            };
            var checkRemarks = (rule, value, callback) => {
                if (value) {
                    if (value.length > 255) {
                        return callback(new Error('标签描述的字符长度不得超过255！'));
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            };
            return {
                // 数字格式标签范围
                rangeArr: [{from: '0', to: '0'}],
                // 时间格式标签范围
                timeRangeArr: [{time: []}],
                // string
                addInRange: '',
                dialogFormVisible: false,
                dialogFormVisible1: false,
                dialogVisible: false,
                isOpen: 0,
                addForm: {
                    name: '',
                    smsKeywordTypeId: '',
                    inRange: '',
                    signage: '',
                    remarks: ''
                },
                updateForm: {
                    id: '',
                    name: '',
                    smsKeywordTypeId: '',
                    inRange: '',
                    signage: '',
                    remarks: ''
                },
                formInline: {
                    name: '',
                },
                options: [],
                tableData: [],
                multipleSelection: [],
                multipleSelectionAll: [],
                id: 'id',
                // 分页数据
                total: 0,
                currentPage: 1,
                pageSize: 10,
                rules: {
                    name: [
                        { validator: checkName, trigger: 'blur' },
                    ],
                    smsKeywordTypeId: [
                        { validator: checkType, trigger: 'change' }
                    ],
                    signage: [
                        { validator: checkSignage, trigger: 'change' }
                    ],
                    range1: [
                        { validator: checkRange1, trigger: 'blur' }
                    ],
                    range2: [
                        { validator: checkRange2, trigger: 'blur' }
                    ],
                    range3: [
                        { validator: checkRange3, trigger: 'blur' }
                    ],
                    remarks: [
                        { validator: checkRemarks, trigger: 'blur' }
                    ]
                },
                // 中间存储的值
                dateRange: []
            }
        },
        methods: {
            validateX() {
                this.formInline.name = this.valid.ValidateValue(this.formInline.name);
            },
            // 数字范围+号按钮
            addRangeArr(index) {
                let canAdd = false;
                this.rangeArr.forEach((value) => {
                    if (value.from === '' && value.to === '') {
                        canAdd = true;
                        this.$message('请完善数字标签数据信息！');
                    }
                });
                if (canAdd === false) {
                    this.rangeArr.push({from: '0', to: '0'});
                    console.log(index, '加', this.rangeArr);
                }
            },
            delRangeArr(index) {
                if (this.rangeArr.length === 1) {
                    this.$message('不能再删除了！');
                    return
                }
                this.rangeArr.splice(index, 1);
                console.log(index, '减号', this.rangeArr);
            },
            // 时间范围+号
            addTimeArr(index) {
                let canAdd = false;
                this.timeRangeArr.forEach((value) => {
                    if (value.time.length === 0) {
                        canAdd = true;
                        this.$message('请完善时间标签数据信息！');
                    }
                });
                if (canAdd === false) {
                    console.log(index, '时间加');
                    this.timeRangeArr.push({time: []});
                }
            },
            delTimeArr(index) {
                if (this.timeRangeArr.length === 1) {
                    this.$message('不能再删除了！');
                    return
                }
                console.log(index, '时间减');
                this.timeRangeArr.splice(index, 1);
            },
            // 修改激活状态
            changeState(index, row) {
                this.$api.decision.isEnables.request({id: [row.id]}).then(() => {
                    // this.tableList();
                }).catch((err) => {
                    console.log(err);
                });
            },
            // 添加标签
            onSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.addTag();
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
                        this.updateTag();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            onSelect() {
                this.changePageCoreRecordData();
                if (this.formInline.name) {
                    this.formInline.name = this.formInline.name.replace(/(^\s*)|(\s*$)/g, "")
                }
                this.selectTag();
            },
            onReset() {
                this.formInline.name = '';
                this.changePageCoreRecordData();
                this.selectTag();
            },
            openAdd() {
                this.dialogFormVisible = true;
                this.addForm = {name: '', smsKeywordTypeId: '', inRange: '', signage: '', remarks: ''};
                this.rangeArr = [{from: '0', to: '0'}];
                this.timeRangeArr = [{time: []}];
                this.tagsTypeList();
            },
            tableList() {
                this.$api.decision.tagsList.request({},
                    {restUrl: `page=${this.currentPage - 1}&&size=${this.pageSize}&&name=${this.formInline['name']}`}).then((data) => {
                    this.tableData = data.data.data;
                    this.total = data.data.total;
                    setTimeout(() => {
                        this.setSelectRow();
                    }, 20);
                }).catch((err) => {
                    console.log(err);
                });
            },
            tagsTypeList() {
                this.$api.decision.tagsTypeList.request().then((data) => {
                    this.options = data.data;
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
                this.deleteTag();
            },
            // 点击修改按钮时的操作
            handleEdit(index, row) {
                this.dialogFormVisible1 = true;
                this.tagsTypeList();
                for (let i in row) {
                    this.updateForm[i] = row[i];
                }
                console.log(this.rangeArr, 123123132123);
                this.updateForm.id = row.id;
                if (this.updateForm.smsKeywordTypeId === 1 ) {
                    let numberArr = this.updateForm.inRange.split('|');
                    this.rangeArr = [];
                    for (let x = 0; x < numberArr.length; x++) {
                        this.rangeArr.push({from: '0', to: '0'});
                    }
                    numberArr.forEach((value, index2) => {
                        let item = value.split('～');
                        if (item[0] === 'N') {
                            this.rangeArr[index2].from = '0';
                        } else {
                            this.rangeArr[index2].from = item[0];
                        }
                        if (item[1] === 'N') {
                            this.rangeArr[index2].to = '0';
                        } else {
                            this.rangeArr[index2].to = item[1];
                        }
                    })
                }
                if (this.updateForm.smsKeywordTypeId === 2 ) {
                    this.addInRange = this.updateForm.inRange;
                }
                if (this.updateForm.smsKeywordTypeId === 3 ) {
                    // 2017-05-10 8:0:0-2018-01-12 8:0:0|2018-12-5 8:0:0-2019-01-24 8:0:0
                    let timeArr = this.updateForm.inRange.split('|');
                    this.timeRangeArr = [];
                    for (let x = 0; x < timeArr.length; x++) {
                        this.timeRangeArr.push({time: []});
                    }
                    timeArr.forEach((value, index1) => {
                        let item = value.split('-');
                        this.timeRangeArr[index1].time = [item[0], item[1]];
                    })
                }
                console.log(index, row);
            },
            // 添加接口
            addTag() {
                let inRange = '';
                // 数字标签范围
                if (this.addForm.smsKeywordTypeId === 1) {
                    this.rangeArr.forEach((value) => {
                        let fromNumber = value.from === '' ? 'N' : value.from;
                        let toNumber = value.to === '' ? 'N' : value.to;
                        inRange += fromNumber + '～' + toNumber + '|';
                    });
                    inRange = inRange.substring(0, inRange.length - 1);
                }
                // 字符串标签
                if (this.addForm.smsKeywordTypeId === 2) {
                    inRange = this.addInRange;
                }
                // 时间标签范围
                if (this.addForm.smsKeywordTypeId === 3) {
                    this.timeRangeArr.forEach((value) => {
                        inRange += value.time[0] + '-' + value.time[1] + '|';
                    });
                    inRange = inRange.substring(0, inRange.length - 1);
                }
                this.$api.decision.createTags.request({
                    name: this.addForm.name,
                    smsKeywordTypeId: this.addForm.smsKeywordTypeId,
                    inRange: inRange,
                    signage: this.addForm.signage,
                    remarks: this.addForm.remarks,
                }).then((data) => {
                    if (data.data === 2) {
                        this.$message({
                            showClose: true,
                            message: '添加标签失败，标签名重名！',
                            type: 'error'
                        });
                    } else if (data.data === 3) {
                        this.$message({
                            showClose: true,
                            message: '添加标签失败，标签标识重名！',
                            type: 'error'
                        });
                    } else {
                        this.$message({
                            showClose: true,
                            message: '添加标签成功！',
                            type: 'success'
                        });
                        this.dialogFormVisible = false;
                        this.selectTag();
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            // 时间格式处理方法
            setStringDate(timeValue) {
                // 10:10:10
                let str = '';
                const time = new Date(timeValue);
                const year = time.getFullYear();
                const month = (time.getMonth() + 1) < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1;
                const D = time.getDate();
                const H = time.getHours();
                const F = time.getMinutes();
                const S = time.getSeconds();
                str = year + '/' + month + '/' + D + ' ' + H + ':' + F + ':' + S;
                return str;
            },
            // 查询接口
            selectTag() {
                this.currentPage = 1;
                this.$api.decision.selectTag.request({},
                    {restUrl: `page=${0}&&size=${this.pageSize}&&name=${this.formInline['name']}`}).then((data) => {
                    this.tableData = data.data.data;
                    this.total = data.data.total;
                    setTimeout(() => {
                        this.setSelectRow();
                    }, 20);
                }).catch((err) => {
                    console.log(err);
                });
            },
            // 修改接口
            updateTag() {
                let inRange = '';
                // 数字标签范围
                if (this.updateForm.smsKeywordTypeId === 1) {
                    this.rangeArr.forEach((value) => {
                        let fromNumber = value.from === '' ? 'N' : value.from;
                        let toNumber = value.to === '' ? 'N' : value.to;
                        inRange += fromNumber + '～' + toNumber + '|';
                    });
                    inRange = inRange.substring(0, inRange.length - 1);
                }
                // 字符串标签
                if (this.updateForm.smsKeywordTypeId === 2) {
                    inRange = this.addInRange;
                }
                // 时间标签范围
                if (this.updateForm.smsKeywordTypeId === 3) {
                    this.timeRangeArr.forEach((value) => {
                        console.log(value, 6666);
                        inRange += value.time[0] + '-' + value.time[1] + '|';
                    });
                    inRange = inRange.substring(0, inRange.length - 1);
                }
                this.$api.decision.updateTags.request({
                    id: this.updateForm.id,
                    name: this.updateForm.name,
                    smsKeywordTypeId: this.updateForm.smsKeywordTypeId,
                    inRange: inRange,
                    signage: this.updateForm.signage,
                    remarks: this.updateForm.remarks
                }).then((data) => {
                    if (data.data === 2) {
                        this.$message({
                            showClose: true,
                            message: '修改标签失败，标签重名！',
                            type: 'error'
                        });
                    } else if (data.data === 3) {
                        this.$message({
                            showClose: true,
                            message: '修改标签失败，标签标识重名！',
                            type: 'error'
                        });
                    } else {
                        this.$message({
                            showClose: true,
                            message: '修改标签成功！',
                            type: 'success'
                        });
                        this.dialogFormVisible1 = false;
                        this.selectTag();
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            // 删除接口
            deleteTag() {
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
                console.log(idsArr, 6666);
                this.$api.decision.deleteTags.request({id: idsArr}).then(() => {
                    this.$message({
                        showClose: true,
                        message: '删除标签成功！',
                        type: 'success'
                    });
                    this.multipleSelectionAll = [];
                    this.selectTag();
                }).catch((err) => {
                    console.log(err);
                });
            },
            // 关闭弹窗时清空表单数据
            clearDia(formName) {
                this.$refs[formName].resetFields();
                this.rangeArr = [{from: '', to: ''}];
                this.addInRange = '';
                this.timeRangeArr = [{time: []}];
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
            // 分页
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
</style>