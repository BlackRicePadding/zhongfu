<template>
    <div id="smsRS">
        <div class="smsRS" v-if="decison">
            <div class="lar-title">
                <span class="lar-span">短信列表</span>
            </div>
            <div class="pad">
                <div class="pad-title">短信管理
                    <el-popover
                        placement="bottom"
                        style="position: absolute;top: 3px;right: 15px;"
                        width="520"
                        trigger="click">
                        <el-form :inline="true" :model="formInline" class="demo-form-inline" style="text-align: left;margin-top: 25px;">
                            <el-form-item label="发送时间" style="margin-left: 25px;">
                                <el-date-picker
                                    v-model="formInline['addTime']"
                                    type="datetimerange"
                                    range-separator="~"
                                    value-format="yyyy-MM-ddTHH:mm:ss"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="短信内容" style="margin-left: 25px">
                                <el-input v-model="formInline.content"
                                          type="textarea"
                                          @keyup.native="validateX" @keydown.native="validateX"
                                          style="width: 400px;" placeholder="请输入短信内容"></el-input>
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
                    <div style="height: 20px"></div>
                    <div class="message" v-for="item in listData">
                        <el-row>
                            <el-col :xs="24" :sm="24" :md="18" :lg="18" :xl="18">
                                <div class="mes-left">
                                    <!--<el-checkbox label="" name="type"></el-checkbox>-->
                                    <span class="mes-title">发布人员：</span>
                                    <span class="mes-content">{{item.sender}}</span>
                                    <span class="mes-title">发送时间：</span>
                                    <span class="mes-content">{{item.addTime}}</span>
                                </div>
                            </el-col>
                            <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
                                <div class="mes-right" style="overflow-y: auto">
                                    <el-button type="text" style="padding: 0;" @click="detailData(item)">详情</el-button>
                                </div>
                            </el-col>
                            <el-col :span="24">
                                <div class="mes-bottom">
                                    <div style="float:left;">短信内容：</div>
                                    <div style="float:left;color: #999;">{{item.content}}</div>
                                    <div style="clear: both;"></div>
                                </div>
                            </el-col>
                            <el-col :span="24">
                                <div class="mes-bottom">
                                    <div style="float:left;">发送状态：</div>
                                    <div style="float:left;color: #999;" v-if="item.stat==2">发送成功</div>
                                    <div style="float:left;color: #999;" v-if="item.stat==3">发送失败</div>
                                    <div style="clear: both;"></div>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="block">
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage1"
                            :page-sizes="[5, 7, 10]"
                            :page-size="pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total1">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog title="短信详情" :visible.sync="dialogFormVisible" width="550px" @closed="clearDia()">
            <el-form :model="detailForm" :disabled="true">
                <el-form-item label="短信id码" :label-width="formLabelWidth">
                    <el-input v-model="detailForm.msgId" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="发送类型" :label-width="formLabelWidth">
                    <el-input v-model="detailForm.msgType" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="发送用户" :label-width="formLabelWidth">
                    <el-input v-model="detailForm.sender" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="发送状态" :label-width="formLabelWidth">
                    <el-input v-if="detailForm.state==2" autocomplete="off" value="发送成功"></el-input>
                    <el-input v-if="detailForm.state==3" autocomplete="off" value="发送失败"></el-input>
                </el-form-item>
                <el-form-item label="接收用户" :label-width="formLabelWidth">
                    <el-input v-model="detailForm.receive" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="短信内容" :label-width="formLabelWidth">
                    <el-input type="textarea" v-model="detailForm.content" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" plain @click="dialogFormVisible = false">确 定</el-button>
            </div>
        </el-dialog>
        <div class="smsMassS" v-if="!decison">
            <SMSMassS></SMSMassS>
        </div>
    </div>
</template>

<script>
    import SMSMassS from '../smsMassS/smsMassS';
    const smsRS = {
        name: "smsRS",
        components: {SMSMassS},
        data() {
            return {
                decison: true,
                dialogFormVisible: false,
                formLabelWidth: '100px',
                isOpen: 0,
                formInline: {
                    addTime: '',
                    content: '',
                },
                detailForm: {
                    msgType: '',
                    state: '',
                    msgId: '',
                    sender: '',
                    receive: '',
                    content: '',
                    remarks: ''
                },
                data: [],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                listData: [],
                // 分页数据
                total1: 0,
                currentPage1: 1,
                pageSize: 5,
                peopleInfo: []
            }
        },
        methods: {
            // 分页
            handleSizeChange(pageSize) { // 每页条数切换
                this.pageSize = pageSize;
                this.handleCurrentChange(this.currentPage1);
            },
            handleCurrentChange(currentPage) {//页码切换
                console.log(currentPage,"11111111111111");
                const reg = /^[0-9]*$/;
                if ( !reg.test(currentPage) || currentPage < 1 || currentPage > this.total1 / this.pageSize) {
                    currentPage = 1
                }
                this.currentPage1 = currentPage;
                this.tableList();
            },
            validateX() {
                // this.formInline.name = this.valid.ValidateValue(this.formInline.name);
            },
            onSubmit() {
            },
            tableList() {
                let tt = '',
                    tt2 = '';
                if (this.formInline['addTime']) {
                    tt = this.setTime.transformTime(this.formInline['addTime'][0]);
                    tt2 = this.setTime.transformTime(this.formInline['addTime'][1]);
                }
                this.$api.decision.smsRSList.request({},
                    {restUrl: `page=${this.currentPage1 - 1}&&size=${this.pageSize}&&addTime=${tt}&&endTime=${tt2}&&content=${this.formInline.content}`}).then((data) => {
                    this.listData = data.data.data;
                    this.total1 = data.data.total;
                    this.transform(data);
                }).catch((err) => {
                    console.log(err);
                });
            },
            onSelect() {
                console.log(this.formInline.addTime, 99999999);
                let tt = '',
                    tt2 = '';
                if (this.formInline['addTime']) {
                    tt = this.setTime.transformTime(this.formInline['addTime'][0]);
                    tt2 = this.setTime.transformTime(this.formInline['addTime'][1]);
                }
                this.$api.decision.selectSMSRS.request({},
                    {restUrl: `page=${0}&&size=${this.pageSize}&&addTime=${tt}&&endTime=${tt2}&&content=${this.formInline.content}`}).then((data) => {
                    this.listData = data.data.data;
                    this.total1 = data.data.total;
                    this.transform(data);
                }).catch((err) => {
                    console.log(err);
                });
            },
            transform(data) {
                for (let i = 0, length = data.data.data.length; i < length; i++) {
                    if (this.listData[i]['addTime']) {
                        this.listData[i]['addTime'] = this.listData[i]['addTime'].split('T')[0] +
                            " " + this.listData[i]['addTime'].split('T')[1].split('+')[0];
                    }
                    if (this.listData[i]['msgType'] === 0) {
                        this.listData[i]['msgType'] = '单发';
                    } else if (this.listData[i]['msgType'] === 1) {
                        this.listData[i]['msgType'] = '群发';
                    }
                    if (this.listData[i]['state'] === 0) {
                        this.listData[i]['state'] = '短信发送中';
                    } else if (this.listData[i]['state'] === 1) {
                        this.listData[i]['state'] = '短信发送完成';
                    } else if (this.listData[i]['state'] === 2) {
                        this.listData[i]['state'] = '短信发送成功';
                    } else if (this.listData[i]['state'] === 3) {
                        this.listData[i]['state'] = '短信发送失败';
                    } else if (this.listData[i]['state'] === 4) {
                        this.listData[i]['state'] = '失败任务';
                    } else if (this.listData[i]['state'] === 10) {
                        this.listData[i]['state'] = '短信接收中';
                    } else if (this.listData[i]['state'] === 11) {
                        this.listData[i]['state'] = '短信状态返回';
                    } else if (this.listData[i]['state'] === 12) {
                        this.listData[i]['state'] = '短信接收成功';
                    } else if (this.listData[i]['state'] === 13) {
                        this.listData[i]['state'] = '短信接收失败';
                    } else if (this.listData[i]['state'] === 20) {
                        this.listData[i]['state'] = '短信状态正在返回';
                    } else if (this.listData[i]['state'] === 21) {
                        this.listData[i]['state'] = '短信状态正在返回';
                    } else if (this.listData[i]['state'] === 101) {
                        this.listData[i]['state'] = 'MD5错误';
                    } else if (this.listData[i]['state'] === 102) {
                        this.listData[i]['state'] = '版本不匹配';
                    }
                }
            },
            detailData(item) {
                this.dialogFormVisible = true;
                this.detailForm.msgType = item.msgType;
                this.detailForm.state = item.stat;
                this.detailForm.msgId = item.taskId;
                this.detailForm.sender = item.sender;
                this.detailForm.receive = item.receiver;
                this.detailForm.content = item.content;
                this.detailForm.remarks = item.remarks;
                /*this.peopleInfo.forEach(val => {
                    nameArr.push(val.name);
                    phoneArr.push(val.phone);
                });
                console.log(0 % 2);
                for (let i = 0; i < nameArr.length; i++) {
                    namePhone.push(nameArr[i] + "：" + phoneArr[i] + "\n")
                }
                this.detailForm['receive'] = namePhone.toString();
                this.detailForm['receive'] = this.detailForm['receive'].replace(/\,/g,"");*/
            },
            onReset() {
                this.formInline["addTime"] = '';
                this.formInline["content"] = '';
                this.onSelect();
            },
            clearDia() {
                for (let i in this.detailForm) {
                    this.detailForm[i] = '';
                }
            }
        },
        mounted() {
          this.tableList();
        },
    }
    export default smsRS
</script>

<style scoped>
    .content{
        padding: 0 20px;
    }
    .message{
        margin: 0 auto 10px;
        border: 1px solid #dddddd;
        padding: 10px;
    }
    .mes-left{
        text-align: left;
    }
    .mes-right{
        text-align: right;
    }
    .mes-bottom{
        padding-top: 15px;
        text-align: left;
        margin-left: 13px;
    }
    .mes-title{
        margin-left: 13px;
    }
    .mes-content{
        color: #999999;
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