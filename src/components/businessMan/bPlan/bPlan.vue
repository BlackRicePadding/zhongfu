<template>
    <div id="systemIndex">
        <div class="lar-title">
            <span class="lar-span">业务管理</span>
        </div>
        <div v-if="!showAddArea&&!showSend" class="pad">
            <div class="pad-title">短信业务</div>
            <div class="statistics-info content">
                <div style="width: 100%;height: 20px;"></div>
                <el-row :gutter="60">
                    <el-col :lg="24" :md="24" :xs="24" :sm="24">
                        <div class="grid-content bg-purple">
                            <div class="row state-overview">
                                <el-col :xl="6" :lg="6" :md="6" :sm="12" :xs="24">
                                    <div class="panel green">
                                        <div class="state-value">
                                            <div class="value">{{countData.planInfoCount}}</div>
                                            <div class="title">业务总数</div>
                                            <div class="bord"></div>
                                        </div>
                                        <div class="symbol">
                                            <i class="iconfont icon-tongxunlu"></i>
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :xl="6" :lg="6" :md="6" :sm="12" :xs="24">
                                    <div class="panel blue">
                                        <div class="state-value">
                                            <div class="value">{{countData.planInfoTodayCount}}</div>
                                            <div class="title">今日业务总数</div>
                                            <div class="bord"></div>
                                        </div>
                                        <div class="symbol">
                                            <i class="iconfont icon-tongxunlu"></i>
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :xl="6" :lg="6" :md="6" :sm="12" :xs="24">
                                    <div class="panel purple">
                                        <div class="state-value">
                                            <div class="value">{{countData.planInfoTodayWeeked}}</div>
                                            <div class="title">本周业务总数</div>
                                            <div class="bord"></div>
                                        </div>
                                        <div class="symbol">
                                            <i class="iconfont icon-tongxunlu"></i>
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :xl="6" :lg="6" :md="6" :sm="12" :xs="24">
                                    <div class="panel red">
                                        <div class="state-value">
                                            <div class="value">{{countData.planInfoTodayMouth}}</div>
                                            <div class="title">本月业务总数</div>
                                            <div class="bord"></div>
                                        </div>
                                        <div class="symbol">
                                            <i class="iconfont icon-tongxunlu"></i>
                                        </div>
                                    </div>
                                </el-col>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <div class="head" style="overflow: hidden">
                    <div class="head-left">
                        <el-radio-group v-model="tabPosition" @change="formList1" style="margin-top: 20px;">
                            <el-radio-button label="1">全部</el-radio-button>
                            <el-radio-button label="2">今天</el-radio-button>
                            <el-radio-button label="3">最近一周</el-radio-button>
                            <el-radio-button label="4">最近一月</el-radio-button>
                        </el-radio-group>
                    </div>
                    <div class="head-right" style="margin-top: 10px;">
                        <el-button type="warning" @click="openAddFree">添加通用业务</el-button>
                        <el-button type="success" @click="openAdd">添加模板业务</el-button>
                        <el-button type="danger" @click="openDelete">删除业务</el-button>
                    </div>
                </div>
                <el-row :gutter="20">
                    <el-col :xs="24" :sm="24" :md="14" :lg="14" :xl="14">
                        <div class="message" v-for="item in listData" @click="planDetail(item)">
                            <el-row>
                                <el-col :xs="24" :sm="24" :md="18" :lg="18" :xl="18">
                                    <div class="mes-left">
                                        <div class="mes-left-top">
                                            <span v-if="(JSON.parse(item.plancontent)).hasOwnProperty('port')">
                                                <el-checkbox disabled></el-checkbox>
                                            </span>
                                            <span v-else>
                                               <el-checkbox :key="item.planid"
                                                            name="plan"
                                                            @change="checkedOne(item.planid)"></el-checkbox>
                                            </span>
                                            <span class="mes-name">{{item.planname}}</span>
                                            <span v-if="(JSON.parse(item.plancontent)).hasOwnProperty('port')">
                                                <el-tag style="margin-left: 10px;" type="info">交换平台业务</el-tag>
                                            </span>
                                            <span v-else>
                                                <el-tag v-if="item.plandescription === 'freePlan-sending'" type="success" style="margin-left: 10px;">通用业务</el-tag>
                                                <el-tag v-if="item.plandescription != 'freePlan-sending'">模板业务</el-tag>
                                            </span>
                                        </div>
                                        <div class="mes-left-bottom">
                                            <span class="mes-title">创建时间：</span>
                                            <span class="mes-content">{{item.addtime}}</span>
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
                                    <div class="mes-right">
                                        <span v-if="(JSON.parse(item.plancontent)).hasOwnProperty('port')">
                                                 <el-button type="info" round size="small" style="cursor: no-drop">请前往交换平台操作</el-button>
                                            </span>
                                        <span v-else>
                                            <el-button type="warning" round size="small" @click.stop="editPlan(item)">编辑</el-button>
                                            <el-button v-if="item.plandescription === 'freePlan-sending'" round type="success"  size="small" @click.stop="sendSMS(item)">发送短信</el-button>
                                            <el-button v-if="item.plandescription != 'freePlan-sending'"  round type="primary" size="small"  @click.stop="sendSMS(item)">发送短信</el-button>
                                        </span>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                        <div style="height: 0;border-top: 1px solid #dddddd;margin: 0 10px;"></div>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="10" :lg="10" :xl="10">
                        <div class="detailPlan">
                            <div class="detailTitle">业务详情</div>
                            <el-form :model="detailForm" label-width="100px" class="demo-ruleForm">
                                <el-form-item label="业务名称" prop="planname">
                                    <el-input v-model="detailForm.planname" style="border: none" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="APIKey" prop="apikey">
                                    <el-input v-model="detailForm.apikey" readonly>
                                        <template slot="append">
                                            <el-button v-clipboard:copy="detailForm.apikey"
                                               v-clipboard:success="onCopy"
                                               v-clipboard:error="onError">复制到剪切板</el-button>
                                        </template>
                                    </el-input>
                                    <!--<template slot="append">.com</template>-->

                                </el-form-item>
                                <el-form-item label="模板名称" prop="template">
                                    <el-input type="textarea" disabled v-model="detailForm.template" style="border: none"></el-input>
                                </el-form-item>
                                <el-form-item label="业务策略" prop="strategy" disabled>
                                    <el-input type="textarea" v-model="detailForm.strategy" disabled style="border: none"></el-input>
                                </el-form-item>
                                <el-form-item label="业务描述" prop="plandescription">
                                    <el-input type="textarea" v-if="detailForm.plandescription != 'freePlan-sending'" v-model="detailForm.plandescription" disabled style="border: none"></el-input>
                                    <el-input type="textarea" v-if="detailForm.plandescription === 'freePlan-sending'" disabled style="border: none"></el-input>
                                </el-form-item>
                                <!--<el-form-item style="margin-top: 50px;">-->
                                    <!--<el-button type="primary">保存</el-button>-->
                                <!--</el-form-item>-->
                            </el-form>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div class="block block1" v-if="!showAddArea&&!showSend">
            <el-pagination
                @size-change="handleSizeChange1"
                @current-change="handleCurrentChange1"
                :current-page="currentPage1"
                :page-sizes="[5, 8, 10]"
                :page-size="pageSize1"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total1">
            </el-pagination>
        </div>
        <!--发短信-->
        <el-row v-if="showSend" style="padding-top: 30px;">
            <el-form :model="addForm" ref="addForm" :rules="rules2" style="margin: 0 auto;width: 900px;">
                <div class="left-form">
                    <el-form-item label="发送对象(部门)" :label-width="formLabelWidth3" prop="popArr">
                        <ul id="depTree" class="ztree">
                        </ul>
                    </el-form-item>
                    <el-form-item label="发送对象(临时组)" :label-width="formLabelWidth3" prop="tempArr">
                        <ul id="tempTree" class="ztree">
                        </ul>
                    </el-form-item>
                    <el-form-item prop="tagsList[i]" v-if="showInput"
                                  :label="tags.showName+':'+tags.showSignage"
                                  :label-width="formLabelWidth"
                                  v-for="(tags,i) in planInfoTemplateTags">
                        <el-input v-model="addForm.tagsList[i].oldValue"
                                  v-if="tags.smsKeywordType.id !== 3"
                                  @input="setModalValue"></el-input>
                        <el-date-picker v-if="tags.smsKeywordType.id === 3"
                                        type="datetime"
                                        v-model="addForm.tagsList[i].oldValue"
                                        value-format="yyyy/MM/dd HH:mm:ss"
                                        style="width: 275px;"
                                        @input="setModalValue"></el-date-picker>
                    </el-form-item>
                </div>
                <div class="right-form">
                    <el-form-item label="模板标题" :label-width="formLabelWidth2" prop="templateId">
                        <el-select v-model="addForm.templateId" placeholder="请选择模板" @change="getTemplateId">
                            <el-option
                                v-for="item in planInfoTemplate"
                                :key="item.templateID"
                                :label="item.templateTitle"
                                :value="item.templateID">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否加密" prop="checkMdf" :label-width="formLabelWidth2" style="text-align: left">
                        <el-radio-group v-model="addForm.checkMdf">
                            <el-radio label="1">是</el-radio>
                            <el-radio label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="模板内容" :label-width="formLabelWidth2" prop="sendContent">
                        <el-input type="textarea" v-model="addForm.sendContent"  disabled></el-input>
                    </el-form-item>
                    <el-form-item label="发送内容" :label-width="formLabelWidth2" prop="showModalValue">
                        <el-input type="textarea" v-model="showModalValue" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="回复内容" :label-width="formLabelWidth2" prop="replyContent">
                        <el-input type="textarea" v-model="addForm.replyContent"></el-input>
                    </el-form-item>
                    <el-form-item
                        label="回复标签"
                        prop="reply"
                        :label-width="formLabelWidth2">
                        <el-input v-model="addForm.reply" style="text-align: left;" placeholder="多个回复请以|隔开"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button plain size="medium" @click="clearDia1('addForm')">取 消</el-button>
                        <el-button type="success" size="medium" @click="sendMessage('addForm')">确 定</el-button>
                    </el-form-item>
                </div>
                <div style="clear: both"></div>
            </el-form>
        </el-row>
        <!--添加业务/编辑业务-->
        <el-row v-if="showAddArea" style="padding-top: 30px;">
            <div class="closeBPlanA" @click="clearDia">×</div>
            <el-steps :active="active" align-center>
                <el-step title="填写基本信息"></el-step>
                <el-step title="选择策略模板"></el-step>
                <el-step title="选择关联用户"></el-step>
                <el-step title="确认信息"></el-step>
            </el-steps>
            <div class="first-step" v-if="active===0">
                <el-form ref="submitObj" :rules="rules1" :model="submitObj" label-width="80px">
                    <el-form-item label="业务标识" prop="addAForm.planid" class="is-required">
                        <el-input v-model="submitObj.addAForm.planid" v-if="!showBtn" disabled></el-input>
                        <el-input v-model="submitObj.addAForm.planid" v-if="showBtn"></el-input>
                    </el-form-item>
                    <el-form-item label="业务名称" prop="addAForm.planname" class="is-required">
                        <el-input v-model="submitObj.addAForm.planname" v-if="!showBtn" disabled></el-input>
                        <el-input v-model="submitObj.addAForm.planname" v-if="showBtn"></el-input>
                    </el-form-item>
                    <el-form-item label="APIKey" v-if="!showBtn">
                        <el-input v-model="sendApiKey" disabled>
                            <template slot="append">
                                <el-button v-clipboard:copy="sendApiKey"
                                           v-clipboard:success="onCopy"
                                           v-clipboard:error="onError">复制到剪切板</el-button>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="业务描述" prop="addAForm.plandescription">
                        <el-input type="textarea" v-model="submitObj.addAForm.plandescription"></el-input>
                    </el-form-item>
                    <el-form-item style="margin-top: 100px;">
                        <el-button type="success" @click="submitFirst('submitObj')">下一步，选择策略模板</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="second-step" v-if="active===1">
                <div class="smsTemplate">
                    <div class="pad-title">
                        短信消息模板
                        <el-popover
                            placement="bottom"
                            style="position: absolute;top: 3px;right: 15px;"
                            width="350"
                            trigger="click">
                            <el-form :inline="true" :model="formInline2" class="demo-form-inline" style="text-align: left;margin-top: 25px;">
                                <el-form-item label="模板名称" style="margin-left: 25px">
                                    <el-input v-model="formInline2.name" @keyup.native="validateX(2)" @keydown.native="validateX(2)" style="width: 220px;" placeholder="请输入模板名称"></el-input>
                                </el-form-item>
                                <el-form-item style="margin-left: 94px;">
                                    <el-button type="primary" size="medium" @click="selectSMSTableList">搜索</el-button>
                                    <el-button size="medium" @click="onResetSMST">重置</el-button>
                                </el-form-item>
                            </el-form>
                            <el-button slot="reference">筛选</el-button>
                        </el-popover>
                    </div>
                    <el-table
                        ref="multipleTable1"
                        :data="tableData1"
                        tooltip-effect="dark"
                        style="width: 100%"
                        @selection-change="handleSelectionChange1">
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
                            align="left"
                            header-align="center"
                            prop="description"
                            label="模板备注"
                            min-width="200">
                        </el-table-column>
                    </el-table>
                    <div class="block">
                        <el-pagination
                            @size-change="handleSizeChange2"
                            @current-change="handleCurrentChange2"
                            :current-page="currentPage2"
                            :page-sizes="[10, 15, 20]"
                            :page-size="pageSize2"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total2">
                        </el-pagination>
                    </div>
                </div>
                <div class="tacticsTemplate">
                    <div class="pad-title">
                        策略模板
                        <el-popover
                            placement="bottom"
                            style="position: absolute;top: 3px;right: 15px;"
                            width="350"
                            trigger="click">
                            <el-form :inline="true" :model="formInline3" class="demo-form-inline" style="text-align: left;margin-top: 25px;">
                                <el-form-item label="策略名称" style="margin-left: 25px">
                                    <el-input v-model="formInline3.name" @keyup.native="validateX(3)" @keydown.native="validateX(3)" style="width: 220px;" placeholder="请输入策略名称"></el-input>
                                </el-form-item>
                                <el-form-item style="margin-left: 94px;">
                                    <el-button type="primary" size="medium" @click="selectPoliciesTableList">搜索</el-button>
                                    <el-button size="medium" @click="onResetTacT">重置</el-button>
                                </el-form-item>
                            </el-form>
                            <el-button slot="reference">筛选</el-button>
                        </el-popover>
                    </div>
                    <el-table
                        ref="multipleTable2"
                        :data="tableData2"
                        tooltip-effect="dark"
                        style="width: 100%"
                        @selection-change="handleSelectionChange2">
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
                            min-width="120">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            header-align="center"
                            prop="blackRange"
                            label="黑名单范围"
                            min-width="180">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            header-align="center"
                            prop="content"
                            label="策略类型"
                            min-width="150">
                        </el-table-column>
                    </el-table>
                    <div class="block">
                        <el-pagination
                            @size-change="handleSizeChange3"
                            @current-change="handleCurrentChange3"
                            :current-page="currentPage3"
                            :page-sizes="[10, 15, 20]"
                            :page-size="pageSize3"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total3">
                        </el-pagination>
                    </div>
                </div>
                <div>
                    <el-button type="primary" @click="firstStep">上一步</el-button>
                    <el-button type="success" @click="submitSecond">下一步，选择关联用户</el-button>
                </div>
            </div>
            <div class="third-step" v-if="active===2">
                <div class="pad-title">选择关联用户
                    <el-popover
                        placement="bottom"
                        style="position: absolute;top: 3px;right: 15px;"
                        width="350"
                        trigger="click">
                        <el-form :inline="true" :model="formInline4" class="demo-form-inline" style="text-align: left;margin-top: 25px;">
                            <el-form-item label="用户姓名" style="margin-left: 25px">
                                <el-input v-model="formInline4.name" @keyup.native="validateX(4)" @keydown.native="validateX(4)" style="width: 220px;" placeholder="请输入用户姓名"></el-input>
                            </el-form-item>
                            <el-form-item label="电话号码" style="margin-left: 25px;">
                                <el-input type="textarea" v-model="formInline4.phone" @keyup.native="validateX(4)" @keydown.native="validateX(4)" style="width: 220px;" placeholder="请输入电话号码，多个之间以逗号隔开"></el-input>
                            </el-form-item>
                            <el-form-item style="margin-left: 94px;">
                                <el-button type="primary" size="medium" @click="selectAddressList">搜索</el-button>
                                <el-button size="medium" @click="onResetAdd">重置</el-button>
                            </el-form-item>
                        </el-form>
                        <el-button slot="reference">筛选</el-button>
                    </el-popover>
                </div>
                <div class="user">
                    <el-row :gutter="10">
                        <el-col :span="6">
                            <div class="grid-content bg-purple">
                                <div class="userTitle">用户组</div>
                                <ul class="ztree" id="bmTree" style="max-height: 250px;overflow: auto">

                                </ul>
                                <ul class="ztree" id="lszTree" style="max-height: 250px;overflow: auto">

                                </ul>
                            </div>
                        </el-col>
                        <el-col :span="18">
                            <el-table
                                ref="multipleTable3"
                                :data="tableData3"
                                tooltip-effect="dark"
                                style="width: 100%"
                                @selection-change="handleSelectionChange3">
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
                                    label="姓名"
                                    min-width="100">
                                </el-table-column>
                                <el-table-column
                                    align="center"
                                    header-align="center"
                                    prop="email"
                                    label="邮箱"
                                    min-width="130">
                                </el-table-column>
                                <el-table-column
                                    align="center"
                                    header-align="center"
                                    prop="phone"
                                    label="电话"
                                    min-width="130">
                                </el-table-column>
                                <el-table-column
                                    align="center"
                                    header-align="center"
                                    prop="departmentName"
                                    label="部门名称"
                                    min-width="130">
                                </el-table-column>
                            </el-table>
                        </el-col>
                    </el-row>
                    <div class="block">
                        <el-pagination
                            @size-change="handleSizeChange4"
                            @current-change="handleCurrentChange4"
                            :current-page="currentPage4"
                            :page-sizes="[5, 10, 15]"
                            :page-size="pageSize4"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total4">
                        </el-pagination>
                    </div>
                </div>
                <div>
                    <el-button type="primary" @click="secondStep">上一步</el-button>
                    <el-button type="success" @click="submitThird">下一步，信息确认</el-button>
                </div>
            </div>
            <div class="firth-step" v-if="active===3">
                <div class="pad-title">基本信息</div>
                <div class="firth-step-data">
                    <div style="width: 430px;margin: 10px auto 0;">
                        <el-form :model="submitObj" label-width="80px" disabled>
                            <el-form-item label="业务标识" prop="addAForm.planid">
                                <el-input v-model="submitObj.addAForm.planid"></el-input>
                            </el-form-item>
                            <el-form-item label="业务名称" prop="addAForm.planname">
                                <el-input v-model="submitObj.addAForm.planname"></el-input>
                            </el-form-item>
                            <el-form-item label="APIKey" v-if="!showBtn">
                                <el-input v-model="sendApiKey" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="业务描述" prop="addAForm.plandescription">
                                <el-input type="textarea" v-model="submitObj.addAForm.plandescription"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <div class="pad-title">短信消息模板</div>
                <div class="firth-step-data">
                    <el-table
                        ref="multipleTable"
                        :data="tableData11"
                        tooltip-effect="dark"
                        height="328"
                        style="width: 100%">
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
                            align="left"
                            header-align="center"
                            prop="description"
                            label="模板备注"
                            min-width="200">
                        </el-table-column>
                    </el-table>
                </div>
                <div class="pad-title">策略模板</div>
                <div class="firth-step-data">
                    <el-table
                        ref="multipleTable"
                        :data="tableData22"
                        tooltip-effect="dark"
                        height="328"
                        style="width: 100%">
                        <el-table-column
                            align="center"
                            header-align="center"
                            prop="name"
                            label="策略名称"
                            min-width="120">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            header-align="center"
                            prop="blackRange"
                            label="黑名单范围"
                            min-width="180">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            header-align="center"
                            prop="content"
                            label="策略类型"
                            min-width="150">
                        </el-table-column>
                    </el-table>
                </div>
                <div class="pad-title">关联用户</div>
                <div class="firth-step-data">
                    <el-table
                        ref="multipleTable"
                        :data="tableData33"
                        tooltip-effect="dark"
                        height="328"
                        style="width: 100%">
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
                            prop="email"
                            label="邮箱"
                            min-width="130">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            header-align="center"
                            prop="phone"
                            label="电话"
                            min-width="130">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            header-align="center"
                            prop="departmentName"
                            label="部门名称"
                            min-width="130">
                        </el-table-column>
                    </el-table>
                </div>
                <div>
                    <el-button type="primary" @click="thirdStep">上一步</el-button>
                    <el-button type="success" @click="onSubmit" v-if="showBtn">提交业务</el-button>
                    <el-button type="success" @click="onUpdate" v-if="!showBtn">修改业务</el-button>
                </div>
            </div>
        </el-row>
        <!--打开删除窗口-->
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible2"
            width="400px">
            <span>你确定要删除这些数据吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible2 = false">取 消</el-button>
                <el-button type="primary" @click="confirmDelete()">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="通用业务添加"
                   :visible.sync="showFreeArea"
                   @closed="clearDia3('addFreeForm')"
                   width="550px"
                   center>
            <el-form :model="addFreeForm" ref="addFreeForm" :rules="rules3" class="demo-dynamic">
                <el-form-item label="业务标识" :label-width="formLabelWidth" prop="planFreeID" class="is-required">
                    <el-input v-model="addFreeForm.planFreeID" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="业务名称" :label-width="formLabelWidth" prop="planFreeName" class="is-required">
                    <el-input v-model="addFreeForm.planFreeName" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showFreeArea=false">取 消</el-button>
                <el-button type="primary" @click="submitUp('addFreeForm')">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="通用业务编辑"
                   :visible.sync="showFreeUpdataArea"
                   @closed="clearDia3('addFreeForm')"
                   width="550px"
                   center>
            <el-form :model="addFreeForm" ref="addFreeForm" :rules="rules3" class="demo-dynamic">
                <el-form-item label="业务标识" :label-width="formLabelWidth" prop="planFreeID" class="is-required">
                    <el-input v-model="addFreeForm.planFreeID" autocomplete="off" disabled></el-input>
                </el-form-item>
                <el-form-item label="业务名称" :label-width="formLabelWidth" prop="planFreeName" class="is-required">
                    <el-input v-model="addFreeForm.planFreeName" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showFreeUpdataArea=false">取 消</el-button>
                <el-button type="primary" @click="submitUpdate('addFreeForm')">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="发送短信"
                   :visible.sync="freeInputArea"
                   @closed="clearDia3('sendFreeFrom')"
                   width="550px"
                   center>
            <el-form :model="sendFreeFrom" ref="sendFreeFrom" :rules="rules4" class="demo-dynamic">
                <el-form-item label="是否加密" prop="freeEncryption" :label-width="formLabelWidth"  class="is-required">
                    <el-radio-group v-model="sendFreeFrom.freeEncryption">
                        <el-radio label="1">是</el-radio>
                        <el-radio label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="接收号码" :label-width="formLabelWidth" prop="freePhones" class="is-required">
                    <el-input type="textarea" v-model="sendFreeFrom.freePhones" placeholder="多个接收人，请用 | 隔开"></el-input>
                </el-form-item>
                <el-form-item label="短信内容" :label-width="formLabelWidth" prop="freeContent" class="is-required">
                    <el-input type="textarea" v-model="sendFreeFrom.freeContent" placeholder="短信内容"></el-input>
                </el-form-item>
                <el-form-item label="回复内容" :label-width="formLabelWidth">
                    <el-input type="textarea" v-model="sendFreeFrom.freeReplyContent" placeholder="回复内容"></el-input>
                </el-form-item>
                <el-form-item label="回复标签" :label-width="formLabelWidth">
                    <el-input v-model="sendFreeFrom.freeReplyKeyword" autocomplete="off" placeholder="多个回复标签，请用 | 隔开"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="freeInputArea=false">取 消</el-button>
                <el-button type="primary" @click="submitFree('sendFreeFrom')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import 'ztree/css/metroStyle/metroStyle.css'
    import 'ztree'
    export default {
        name: "bPlan",
        data() {
            var checkID = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('业务标识为必填项！'));
                } else {
                    if (!(/^[_a-zA-Z0-9]{1,30}$/.test(value))) {
                        callback(new Error('业务标识仅限英文，数字，下划线，长度不能超过30！'));
                    } else {
                        callback();
                    }
                }
            };
            var checkName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('业务名称为必填项！'));
                } else {
                    if (!(/^[\u4e00-\u9fa5_a-zA-Z0-9]{1,30}$/.test(value))) {
                        callback(new Error('业务名称仅限中英文，数字，下划线，长度不能超过30！'));
                    } else {
                        callback();
                    }
                }
            };
            var checkPhone = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('接收号码必填项！'));
                } else {
                    let valusArr = value.split('|');
                    let cbFalg = false;
                    valusArr.forEach((value1) => {
                        if (!(/^[1][1,2,3,4,5,6,7,8,9][0-9]{9}$/.test(value1)) || value1.length !== 11) {
                            cbFalg = true;
                        }
                    });
                    if (cbFalg) {
                        callback(new Error('接收号码存在错误'));
                    } else {
                        callback();
                    }
                }
            };
            var checkFreeContent = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('发送内容为必输入项！'));
                } else {
                    callback();
                }
            };
            var checkDescription = (rule, value, callback) => {
                if (value) {
                    if (value.length > 255) {
                        return callback(new Error('业务描述字符长度不得超过255！'));
                    } else if (value === 'freePlan-sending') {
                        return callback(new Error('业务描述不允许出现内置关键词！'));
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            };
            var checkPopArr = (rule, value, callback) => {
                if (this.postIds.length === 0 && this.postIds2.length === 0) {
                    return callback(new Error('发送对象必选！'));
                } else {
                    callback();
                }
            };
            var checkTempArr = (rule, value, callback) => {
                if (this.postIds.length === 0 && this.postIds2.length === 0) {
                    return callback(new Error('发送对象必选！'));
                } else {
                    callback();
                }
            };
            var checkTempId = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('模板必选！'));
                } else {
                    callback();
                }
            };
            var checkPlanFreeID = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('业务标识为必填项！'));
                } else {
                    if (!(/^[_a-zA-Z0-9]{1,30}$/.test(value))) {
                        callback(new Error('业务标识仅限英文，数字，下划线，长度不能超过30！'));
                    } else {
                        callback();
                    }
                }
            };
            var checkPlanFreeName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('业务名称为必填项！'));
                } else {
                    if (!(/^[\u4e00-\u9fa5_a-zA-Z0-9]{1,30}$/.test(value))) {
                        callback(new Error('业务名称仅限中英文，数字，下划线，长度不能超过30！'));
                    } else {
                        callback();
                    }
                }
            };
            return {
                sysAppIds: '',
                showAddArea: false,
                showBtn: false,
                showInput: false,
                showSend: false,
                showFreeArea: false,
                showFreeUpdataArea: false,
                freeInputArea: false,
                data: [],
                data2: [],
                data1: [],
                addressData: [],// 通讯录树
                groupData: [],// 临时群组树
                countData: {},
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                tabPosition: 1,
                active: 0,
                planIdArr: {
                    id: []
                },
                sendPlanId: '',
                listData: [],
                tableData1: [],
                tableData2: [],
                tableData3: [],
                tableData11: [],
                tableData22: [],
                tableData33: [],
                detailForm: {
                    template: '',
                    apikey: '',
                    planname: '',
                    plantype: null,
                    plandescription: '',
                    strategy: '',
                },
                submitObj: {
                    addAForm: {
                        planid: '',
                        planname: '',
                        plandescription: ''
                    },
                    id1: [],
                    id2: [],
                    id3: [],
                },
                addFreeForm: {
                  planFreeID: '',
                  planFreeName: ''
                },
                addForm: {
                    tempArr: [],
                    popArr: [],
                    templateData: [{
                        templateName: '',
                        templateId: '',
                    }],
                    templateId: '',
                    planid: '',
                    checkMdf: '1',
                    tagsList: [],
                    templateContent: '',
                    sendContent: '',
                    replyContent: '',
                    reply: '',
                },
                sendFreeFrom: {
                    lincenesCode: '',
                    freeEncryption: '1',
                    freePhones: '',
                    freeContent: '',
                    freeReplyContent: '',
                    freeReplyKeyword: ''
                },
                planInfoTemplate: [],
                planInfoTemplateTags: [],
                // 多选框
                checked1: false,
                checked2: false,
                // 分页数据
                total1: 0,
                currentPage1: 1,
                pageSize1: 5,
                // 分页数据
                total2: 0,
                currentPage2: 1,
                pageSize2: 10,
                formInline2: {
                    name: '',
                },
                // 短信模板
                multipleSelection: [],
                multipleSelectionAll: [],
                // 分页数据
                total3: 0,
                currentPage3: 1,
                pageSize3: 10,
                formInline3: {
                    name: '',
                },
                // 策略模板
                multipleSelection2: [],
                multipleSelectionAll2: [],
                // 分页数据
                total4: 0,
                currentPage4: 1,
                pageSize4: 10,
                formInline4: {
                    name: '',
                    phone: ''
                },
                // 通讯录
                multipleSelection3: [],
                multipleSelectionAll3: [],
                departmentID: 0,
                groupID: '',
                // 控制弹出窗
                dialogVisible: false,
                dialogVisible2: false,
                formLabelWidth: '125px',
                formLabelWidth2: '70px',
                formLabelWidth3: '125px',
                // 用于控制发短信
                pupArr: [],
                id: 'id',
                rules1: {
                    'addAForm.planid': [
                        { validator: checkID, trigger: 'blur' },
                    ],
                    'addAForm.planname': [
                        { validator: checkName, trigger: 'blur' },
                    ],
                    'addAForm.plandescription': [
                        { validator: checkDescription, trigger: 'blur' }
                    ]
                },
                rules2: {
                    popArr: [
                        { validator: checkPopArr, trigger: 'blur' },
                    ],
                    tempArr: [
                        { validator: checkTempArr, trigger: 'blur' },
                    ],
                    templateId: [
                        { validator: checkTempId, trigger: 'change' },
                    ],
                },
                rules3: {
                    planFreeID: [
                        { validator: checkPlanFreeID, trigger: 'blur' },
                    ],
                    planFreeName: [
                        { validator: checkPlanFreeName, trigger: 'blur' },
                    ]
                },
                rules4: {
                    freePhones: [
                        { validator: checkPhone, trigger: 'blur' },
                    ],
                    freeContent: [
                        { validator: checkFreeContent, trigger: 'blur' },
                    ]
                },
                //不需要的ids
                delArr: [],
                allArr: [],
                postIds: [],
                //不需要的ids2
                delArr2: [],
                allArr2: [],
                postIds2: [],
                showModalValue: '',
                sendApiKey: '',
                xxx: 1
            }
        },
        methods: {
            // 获取模板内容
            setModalValue() {
                this.showModalValue = '';
                let tagsArr = [];
                let sendContent = this.addForm.sendContent;
                this.planInfoTemplateTags.forEach((value) => {
                    tagsArr.push(value.showSignage);
                });
                console.log(tagsArr,1111);
                let test = sendContent;
                for (let i = tagsArr.length - 1; i >= 0; i--) {
                    test = test.replace(tagsArr[i], '%@@@%');
                }
                console.log(test,2222);
                let x = test.split('%').filter(obj => obj !== "");
                let y = 0;
                x.forEach((val,i) => {
                    if ( val === '@@@' ) {
                        x.splice(i,1,this.addForm.tagsList[y].oldValue);
                        y++;
                    }
                });
                for (let i = 0; i < x.length; i++) {
                    this.showModalValue += x[i];
                }
            },
            // 加载树
            loadTree() {
                let $this = this;
                let setting = {
                    data: {
                        key: {
                            name: 'label'
                        }
                    },
                    check: {
                        enable: true,
                        chkboxType: { "Y": "s", "N": "sp" }
                    },
                    callback: {
                        onCheck: $this.onCheck
                    }
                };
                let zTreeObj;
                console.log(zTreeObj);
                $(document).ready(function () {
                    zTreeObj = $.fn.zTree.init($("#depTree"), setting, $this.data);
                });
            },
            pushDelId(nodesArr) {
                nodesArr.forEach((value) => {
                    if (typeof value.children !== 'undefined') {
                        value.children.forEach((val) => {
                            this.delArr.push(val.id);
                            if (typeof val.children !== 'undefined') {
                                this.pushDelId(val.children);
                            }
                        })
                    }
                })
            },
            getAllId(nodesArr) {
                nodesArr.forEach((value) => {
                    this.allArr.push(value.id);
                    if (typeof value.children !== 'undefined') {
                        value.children.forEach((val) => {
                            this.allArr.push(val.id);
                            if (typeof val.children !== 'undefined') {
                                this.getAllId(val.children);
                            }
                        })
                    }
                })
            },
            onCheck(event, treeId, treeNode) {
                console.log(event, treeId, treeNode);
                var treeObj = $.fn.zTree.getZTreeObj("depTree");
                var nodes = treeObj.getCheckedNodes(true);
                // console.log(nodes, '++++++++++++');
                this.delArr = [];
                this.allArr = [];
                this.postIds = [];
                console.log(nodes, '++++++++++++++++0');
                this.pushDelId(nodes);
                console.log(this.allArr, '............1');
                this.getAllId(nodes);
                console.log(this.allArr, '............2');
                // console.log(this.delArr, 'ssssss22222', Array.from(new Set(this.allArr)), '===============');
            //    获取传递的id数组
                this.allArr.forEach((value) => {
                    if (this.delArr.indexOf(value) === -1) {
                        this.postIds.push(value);
                    }
                });
                console.log(this.postIds, '===================');
            },
            loadTree2() {
                let $this = this;
                let setting = {
                    data: {
                        key: {
                            name: 'label'
                        }
                    },
                    check: {
                        enable: true,
                        chkboxType: { "Y": "s", "N": "sp" }
                    },
                    callback: {
                        onCheck: $this.onCheck2
                    }
                };
                let zTreeObj;
                console.log(zTreeObj);
                $(document).ready(function () {
                    zTreeObj = $.fn.zTree.init($("#tempTree"), setting, $this.data2);
                });
            },
            pushDelId2(nodesArr) {
                nodesArr.forEach((value) => {
                    if (typeof value.children !== 'undefined') {
                        value.children.forEach((val) => {
                            this.delArr2.push(val.id);
                            if (typeof val.children !== 'undefined') {
                                this.pushDelId2(val.children);
                            }
                        })
                    }
                })
            },
            getAllId2(nodesArr) {
                nodesArr.forEach((value) => {
                    this.allArr2.push(value.id);
                    if (typeof value.children !== 'undefined') {
                        value.children.forEach((val) => {
                            this.allArr2.push(val.id);
                            if (typeof val.children !== 'undefined') {
                                this.getAllId2(val.children);
                            }
                        })
                    }
                })
            },
            onCheck2(event, treeId, treeNode) {
                console.log(event, treeId, treeNode);
                var treeObj = $.fn.zTree.getZTreeObj("tempTree");
                var nodes = treeObj.getCheckedNodes(true);
                // console.log(nodes, '++++++++++++');
                this.delArr2 = [];
                this.allArr2 = [];
                this.postIds2 = [];
                console.log(nodes, '++++++++++++++++0');
                this.pushDelId2(nodes);
                console.log(this.allArr2, '-/-/-/-/-/-/-/1');
                this.getAllId2(nodes);
                // console.log(this.delArr, 'ssssss22222', Array.from(new Set(this.allArr)), '===============');
                console.log(this.allArr2, '-/-/-/-/-/-/-/2');
                //    获取传递的id数组
                this.allArr2.forEach((value) => {
                    if (this.delArr2.indexOf(value) === -1) {
                        this.postIds2.push(value);
                    }
                });
                console.log(this.postIds2, '===================');
            },
            // 分页
            handleSizeChange1(pageSize) { // 每页条数切换
                this.pageSize1 = pageSize;
                this.handleCurrentChange1(this.currentPage1);
            },
            handleCurrentChange1(currentPage) {//页码切换
                this.currentPage1 = currentPage;
                this.formList(this.xxx);
            },
            checkedOne(planId) {
                let idIndex = this.planIdArr.id.indexOf(planId);
                if (idIndex >= 0) {//如果已经包含就去除
                    this.planIdArr.id.splice(idIndex, 1);
                } else {//如果没有包含就添加
                    this.planIdArr.id.push(planId);
                }
            },
            planDetail(item) {
                console.log(item,66666666);
                this.$api.decision.bPlanDetail.request({},{restUrl: `id=${item.planid}`}).then((data) => {
                    for (let i in this.detailForm) {
                        this.detailForm[i] = data.data[i];
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            // 发送短信
            sendMessage(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let replyArr = this.addForm.reply.split('|');
                        console.log(replyArr, 22222222);
                        replyArr.forEach((val,index) => {
                            if (val === '') {
                                replyArr.splice(index, 1);
                            }
                        });
                        var templateName = '';
                        console.log(this.addForm.templateId, 'idididididididid', this.planInfoTemplate);
                        this.planInfoTemplate.forEach((value) => {
                            if (value.templateID === this.addForm.templateId) {
                                templateName = value.templateTitle;
                            }
                        });
                        this.$api.decision.sendSMS.request(
                            {
                                popArr: this.postIds,
                                temArr: this.postIds2,
                                templateId: this.addForm.templateId,
                                templateName: templateName,
                                tagsList: this.addForm.tagsList,
                                templateContent: this.addForm.sendContent,
                                replyContent: this.addForm.replyContent,
                                reply: replyArr,
                                planId: this.addForm.planid,
                                apikey: this.sendApiKey,
                                checkMdf: this.addForm.checkMdf
                            }).then((res) => {
                            if (res.data.error) {
                                this.$message.error(res.data.error);
                            } else {
                                this.$message({
                                    message: '发送成功',
                                    type: 'success'
                                });
                                this.showSend = false;
                                this.$refs[formName].resetFields();
                                this.showModalValue = '';
                                this.planInfoTemplate = [];
                                this.planInfoTemplateTags = [];
                                this.postIds = [];
                                this.postIds2 = [];
                                this.showSend = false
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            countsList() {
                this.$api.decision.countList.request().then((data) => {
                    this.countData = data.data;
                }).catch((err) => {
                    console.log(err);
                });
            },
            submitFirst(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.active = 1;
                        this.$nextTick(function () {
                            this.SMSTableList();
                        });
                        this.$nextTick(function () {
                            this.policiesTableList();
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            submitSecond() {
                this.changePageCoreRecordData();
                this.changePageCoreRecordData1();
                //if (this.multipleSelectionAll.length === 0 || this.multipleSelectionAll2.length === 0) {
                if (this.multipleSelectionAll.length === 0) {
                    this.$message({
                        showClose: true,
                        message: '短信模板是必选项！',
                        type: 'warning'
                    });
                } else {
                    this.$nextTick(function () {
                        this.addressTree();
                    });
                    this.$nextTick(function () {
                        this.temporaryGroupTree();
                    });
                    this.$nextTick(function () {
                        this.addressList();
                    });
                    this.active = 2;
                }
            },
            submitThird() {
                this.changePageCoreRecordData2();
                if (this.multipleSelectionAll3.length === 0) {
                    this.$message({
                        showClose: true,
                        message: '关联用户是必选项！',
                        type: 'warning'
                    });
                } else {
                    this.tableData11 = this.multipleSelectionAll;
                    this.tableData22 = this.multipleSelectionAll2;
                    this.tableData33 = this.multipleSelectionAll3;
                    this.active = 3;
                }
            },
            firstStep() {
                this.active = 0;
            },
            secondStep() {
                this.active = 1;
                this.$nextTick(function () {
                    this.SMSTableList();
                });
                this.$nextTick(function () {
                    this.policiesTableList();
                });
            },
            thirdStep() {
                this.active = 2;
                this.addressTree();
                this.temporaryGroupTree();
                this.$nextTick(function () {
                    this.addressList();
                });
            },
            onSubmit() {
                let idsArr1 = [];
                let idsArr2 = [];
                let idsArr3 = [];
                if (this.multipleSelectionAll.length) {
                    this.multipleSelectionAll.forEach(value => {
                        idsArr1.push(value.id);
                    })
                } else {
                    this.multipleSelection.forEach(value => {
                        idsArr1.push(value.id);
                    })
                }
                if (this.multipleSelectionAll2.length) {
                    this.multipleSelectionAll2.forEach(value => {
                        idsArr2.push(value.id);
                    })
                } else {
                    this.multipleSelection2.forEach(value => {
                        idsArr2.push(value.id);
                    })
                }
                if (this.multipleSelectionAll3.length) {
                    this.multipleSelectionAll3.forEach(value => {
                        idsArr3.push(value.id);
                    })
                } else {
                    this.multipleSelection3.forEach(value => {
                        idsArr3.push(value.id);
                    })
                }
                this.$api.decision.addBPlan.request({
                    addAForm: {
                        planid: this.submitObj.addAForm.planid,
                        planname: this.submitObj.addAForm.planname,
                        plandescription: this.submitObj.addAForm.plandescription
                    },
                    id1: idsArr1,
                    id2: idsArr2,
                    id3: idsArr3,
                }).then((data) => {
                    if (data.data === 2) {
                        this.$message({
                            showClose: true,
                            message: '添加业务失败，业务重名！',
                            type: 'success'
                        });
                    } else {
                        this.$message({
                            showClose: true,
                            message: '添加业务成功！',
                            type: 'success'
                        });
                        this.clearDia();
                        this.formList();
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            onUpdate() {
                let idsArr1 = [];
                let idsArr2 = [];
                let idsArr3 = [];
                if (this.multipleSelectionAll.length) {
                    this.multipleSelectionAll.forEach(value => {
                        idsArr1.push(value.id);
                    })
                } else {
                    this.multipleSelection.forEach(value => {
                        idsArr1.push(value.id);
                    })
                }
                if (this.multipleSelectionAll2.length) {
                    this.multipleSelectionAll2.forEach(value => {
                        idsArr2.push(value.id);
                    })
                } else {
                    this.multipleSelection2.forEach(value => {
                        idsArr2.push(value.id);
                    })
                }
                if (this.multipleSelectionAll3.length) {
                    this.multipleSelectionAll3.forEach(value => {
                        idsArr3.push(value.id);
                    })
                } else {
                    this.multipleSelection3.forEach(value => {
                        idsArr3.push(value.id);
                    })
                }
                this.$api.decision.updateBPlan.request({
                    addAForm: {
                        planid: this.submitObj.addAForm.planid,
                        planname: this.submitObj.addAForm.planname,
                        plandescription: this.submitObj.addAForm.plandescription
                    },
                    id1: idsArr1,
                    id2: idsArr2,
                    id3: idsArr3,
                }).then((data) => {
                    if (data.data === 2) {
                        this.$message({
                            showClose: true,
                            message: '修改业务失败，业务重名！',
                            type: 'success'
                        });
                    } else {
                        this.clearDia();
                        this.$message({
                            showClose: true,
                            message: '修改业务成功！',
                            type: 'success'
                        });
                        this.formList();
                    }
                }).catch((err) => {
                    console.log(err);
                });
            },
            // 复制成功s
            onCopy(e) {
                console.log(e);
                this.$message({
                    showClose: true,
                    message: '复制成功！',
                    type: 'success'
                });
            },
            // 复制失败
            onError() {
                this.$message({
                    showClose: true,
                    message: '复制失败，请手动复制！',
                    type: 'error'
                });
            },
            editPlan(item) {
                console.log(item.plandescription);
                if (item.plandescription === 'freePlan-sending') {
                    this.addFreeForm.planFreeID = item.planid;
                    this.addFreeForm.planFreeName = item.planname;
                    this.showFreeUpdataArea = true;
                } else {
                    this.showAddArea = true;
                    this.showBtn = false;
                    this.sendApiKey = item.apikey;
                    this.$api.decision.getBPlanList.request({}, {restUrl: `planID=${item.planid}`}).then((data) => {
                        console.log(data.data, 11111);
                        let planInfo = data.data.planInfo;
                        this.submitObj.addAForm.planid = planInfo.planID;
                        this.submitObj.addAForm.planname = planInfo.planName;
                        this.submitObj.addAForm.plandescription = planInfo.planDecription;
                        planInfo.template.forEach((value) => {
                            this.submitObj.id1.push(value.id);
                            this.multipleSelectionAll.push(value);
                        });
                        planInfo.policy.forEach((value) => {
                            this.submitObj.id2.push(value.id);
                            this.multipleSelectionAll2.push(value);
                        });
                        planInfo.employ.forEach((value) => {
                            this.submitObj.id3.push(value.id);
                            this.multipleSelectionAll3.push(value);
                        });
                        console.log(222222);
                    }).catch((err) => {
                        console.log(err);
                    });
                    console.log(item, '*/**/*/*/*/*/*/');
                }
            },
            confirmDelete() {
                this.dialogVisible2 = false;
                this.deleteXBPlan();
            },
            openDelete() {
                if (this.planIdArr.id.length === 0) {
                    this.$message({
                        showClose: true,
                        message: '请先选择需要删除的数据！',
                        type: 'warning'
                    });
                } else {
                    this.dialogVisible2 = true;
                }
            },
            openAdd() {
                this.showAddArea = true;
                this.showBtn = true;
            },
            openAddFree() {
                this.showFreeArea = true;
            },
            submitUp(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$api.decision.addFreePlan.request({
                            addAForm: {
                                planid: this.addFreeForm.planFreeID,
                                planname: this.addFreeForm.planFreeName
                            }
                        }).then((data) => {
                            if (data.data === 2) {
                                this.$message({
                                    showClose: true,
                                    message: '添加业务失败，业务重名！',
                                    type: 'success'
                                });
                            } else {
                                this.$message({
                                    showClose: true,
                                    message: '添加业务成功！',
                                    type: 'success'
                                });
                                this.addFreeForm.planFreeName = '';
                                this.addFreeForm.planFreeID = '';
                                this.showFreeArea = false;
                                this.clearDia();
                                this.formList();
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            submitFree(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$api.decision.sendFreeSMS.request({
                            lincenesCode: this.sendFreeFrom.lincenesCode,
                            encryption: this.sendFreeFrom.freeEncryption,
                            phones: this.sendFreeFrom.freePhones,
                            content: this.sendFreeFrom.freeContent,
                            replyContent: this.sendFreeFrom.freeReplyContent,
                            replyKeyword: this.sendFreeFrom.freeReplyKeyword
                        }).then((res) => {
                            if (res.data.result === "error") {
                                this.$message.error(res.data.msg);
                            } else {
                                this.$message({
                                    message: '发送成功',
                                    type: 'success'
                                });
                                this.freeInputArea = false;
                                this.sendFreeFrom.lincenesCode = '';
                                this.sendFreeFrom.freeEncryption = '';
                                this.sendFreeFrom.freePhones = '';
                                this.sendFreeFrom.freeContent = '';
                                this.sendFreeFrom.freeReplyContent = '';
                                this.sendFreeFrom.freeReplyKeyword = '';
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            submitUpdate(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$api.decision.updateFreePlan.request({
                            addAForm: {
                                planid: this.addFreeForm.planFreeID,
                                planname: this.addFreeForm.planFreeName
                            }
                        }).then((data) => {
                            if (data.data === 2) {
                                this.$message({
                                    showClose: true,
                                    message: '修改业务失败，业务重名！',
                                    type: 'success'
                                });
                            } else {
                                this.clearDia();
                                this.$message({
                                    showClose: true,
                                    message: '修改业务成功！',
                                    type: 'success'
                                });
                                this.formList();
                                this.showFreeUpdataArea = false;
                                this.addFreeForm.planFreeID = '';
                                this.addFreeForm.planFreeName = '';
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            clearDia3(formName) {
                this.$refs[formName].resetFields();
            },
            deleteXBPlan() {
                this.$api.decision.deleteBPlan.request(this.planIdArr).then(() => {
                    this.$message({
                        showClose: true,
                        message: '删除业务成功！',
                        type: 'success'
                    });
                    this.currentPage1 = 1;
                    this.$api.decision.bPlanList.request({},
                        {restUrl: `type=${this.xxx}&&page=${0}&&size=${this.pageSize1}`}).then((data) => {
                        this.listData = data.data.data;
                        this.total1 = data.data.total;
                        this.transform(data);
                        this.planDetail(data.data.data[0]);
                    }).catch((err) => {
                        console.log(err);
                    });
                }).catch((err) => {
                    console.log(err);
                });
            },
            // 根据群组和人进行发短信
            getId(x,y) {
                console.log(x,y, '========');
                this.addForm.groupArr = [];
                this.addForm.popArr = [];
                this.pupArr = [];
                if (y.checkedKeys.length !== 0) {
                    for (let i = 0, length = y.checkedKeys.length; i < length; i++) {
                        if (typeof y.checkedKeys[i] !== 'undefined' ) {
                            this.addForm.groupArr.push(y.checkedKeys[i]);
                        }
                    }
                }
                if (y.checkedNodes.length !== 0) {
                    for (let i = 0,length = y.checkedNodes.length; i < length; i++) {
                        if (y.checkedNodes[i]['id2']) {
                            this.addForm.popArr.push(y.checkedNodes[i]['id2']);
                        }
                        if (y.checkedNodes[i]['children']) {
                            if (y.checkedNodes[i]['children'].length !== 0) {
                                for (let j = 0,len = y.checkedNodes[i]['children'].length; j < len; j++) {
                                    this.pupArr.push(y.checkedNodes[i]['children'][j]['id2']);
                                }
                            }
                        }
                    }
                    for (let m = 0; m < this.pupArr.length; m++ ) {
                        for (let n = 0; n < this.addForm.popArr.length; n++) {
                            if (this.pupArr[m] === this.addForm.popArr[n] ) {
                                this.addForm.popArr.splice(this.addForm.popArr.indexOf(this.addForm.popArr[n]));
                            }
                        }
                    }
                }
            },
            formList() {
                this.xxx = this.tabPosition;
                this.$api.decision.bPlanList.request({},
                    {restUrl: `type=${this.xxx}&&page=${this.currentPage1 - 1}&&size=${this.pageSize1}`}).then((data) => {
                    this.listData = data.data.data;
                    this.total1 = data.data.total;
                    this.transform(data);
                }).catch((err) => {
                    console.log(err);
                });
            },
            formList1() {
                this.xxx = this.tabPosition;
                this.currentPage1 = 1;
                this.$api.decision.bPlanList.request({},
                    {restUrl: `type=${this.xxx}&&page=${0}&&size=${this.pageSize1}`}).then((data) => {
                    this.listData = data.data.data;
                    this.total1 = data.data.total;
                    this.transform(data);
                }).catch((err) => {
                    console.log(err);
                });
            },
            transform(data) {
                for (let i = 0, length = data.data.data.length; i < length; i++) {
                    if (this.listData[i]['addtime']) {
                        this.listData[i]['addtime'] = this.listData[i]['addtime'].split('T')[0] +
                            " " + this.listData[i]['addtime'].split('T')[1].split('+')[0];
                    }
                }
            },
            sendSMS(item) {
               if (item.plandescription !== 'freePlan-sending') {
                   this.showInput = false;
                   this.sendApiKey = item.apikey;
                   this.showSend = true;
                   this.$api.decision.planTemplateList.request({apikey: item.apikey}).then((data) => {
                       console.log(data.data, 1212);
                       this.planInfoTemplate = data.data.planInfo.template;
                       this.addForm.planid = data.data.planInfo.planID;
                       this.TreeList();
                   }).catch((err) => {
                       console.log(err);
                   });
               } else {
                   this.freeInputArea = true;
                   this.sendFreeFrom.lincenesCode = item.apikey;
               }
            },
            getTemplateId(id) {
                this.showInput = true;
                this.$api.decision.TemplateIDList.request({},{restUrl: `templateID=${id}`}).then((data) => {
                    console.log(data.data, 123123123);
                    this.planInfoTemplateTags = data.data[0].templatKeyword;
                    console.log(this.planInfoTemplateTags, '3333333333333333');
                    this.planInfoTemplateTags.forEach((value) => {
                        value.showName = value.name;
                        value.showSignage = value.signage;
                        if ( value.smsKeywordType.id === 3) {
                            let y = new Date().getFullYear(),
                                m = new Date().getMonth() + 1,
                                d = new Date().getDate(),
                                hou = new Date().getHours(),
                                min = new Date().getMinutes(),
                                sec = new Date().getSeconds();
                            m = m < 10 ? '0' + m : m;
                            d = d < 10 ? '0' + d : d;
                            hou = hou < 10 ? '0' + hou : hou;
                            min = min < 10 ? '0' + min : min;
                            sec = sec < 10 ? '0' + sec : sec;
                            let time = y + '/' + m + '/' + d + ' ' + hou + ':' + min + ':' + sec;
                            value.oldValue = time;
                        } else {
                            value.oldValue = value.signage;
                        }
                    });
                    this.addForm.tagsList = data.data[0].templatKeyword;
                    this.addForm.templateContent = data.data[0].templateCount;
                    this.addForm.sendContent = data.data[0].templateCount;
                    this.setModalValue();
                    console.log(222);
                }).catch((err) => {
                    console.log(err);
                });
            },
            // 弹窗树回显接口
            TreeList() {
                this.$api.decision.SMSTree.request({},{restUrl: `planId=${this.addForm.planid}`}).then((data) => {
                    this.data = data.data;
                    this.loadTree();
                }).catch((err) => {
                    console.log(err);
                });
                this.$api.decision.SMSTempTree.request({},{restUrl: `planId=${this.addForm.planid}`}).then((data) => {
                    this.data2 = data.data;
                    this.loadTree2();
                }).catch((err) => {
                    console.log(err);
                });
            },
            // 短信消息模版数据
            SMSTableList() {
                this.$api.decision.bPlanSMSTemp.request({},
                    {restUrl: `page=${this.currentPage2 - 1}&&size=${this.pageSize2}&&name=${this.formInline2['name']}`}).then((data) => {
                    this.tableData1 = data.data.data;
                    this.total2 = data.data.total;
                    setTimeout(() => {
                        this.setSelectRow();
                    }, 20);
                }).catch((err) => {
                    console.log(err);
                });
            },
            // 策略模板数据
            policiesTableList() {
                this.$api.decision.bPlanPolicy.request({},
                    {restUrl: `page=${this.currentPage3 - 1}&&size=${this.pageSize3}&&name=${this.formInline3['name']}`}).then((data) => {
                    this.tableData2 = data.data.data;
                    this.total3 = data.data.total;
                    this.transformPolicy(data);
                    setTimeout(() => {
                        this.setSelectRow1();
                    }, 20);
                }).catch((err) => {
                    console.log(err);
                });
            },
            // 选择关联用户
            addressList() {
                this.$api.decision.bPlanAddress.request({},
                    {restUrl: `page=${this.currentPage4 - 1}&&size=${this.pageSize4}&&name=${this.formInline4['name']}&&phone=${this.formInline4['phone']}&&departmentId=${this.departmentID}&&groupId=${this.groupID}`}).then((data) => {
                    this.tableData3 = data.data.data;
                    this.total4 = data.data.total;
                    setTimeout(() => {
                        this.setSelectRow2();
                    }, 20);
                }).catch((err) => {
                    console.log(err);
                });
            },
            clearDia1(formName) {
                this.showSend = false;
                this.$refs[formName].resetFields();
                this.showModalValue = '';
                this.planInfoTemplate = [];
                this.planInfoTemplateTags = [];
                this.postIds = [];
                this.postIds2 = [];
            },
            // 关闭弹窗时清空表单数据
            clearDia() {
                this.active = 0;
                this.submitObj.addAForm.planid = '';
                this.submitObj.addAForm.planname = '';
                this.submitObj.addAForm.plandescription = '';
                this.tableData11 = [];
                this.tableData22 = [];
                this.tableData33 = [];
                this.submitObj.id1 = [];
                this.submitObj.id2 = [];
                this.submitObj.id3 = [];
                this.multipleSelection = [];
                this.multipleSelection2 = [];
                this.multipleSelection3 = [];
                this.multipleSelectionAll = [];
                this.multipleSelectionAll2 = [];
                this.multipleSelectionAll3 = [];
                this.showAddArea = false;
                this.currentPage2 = 1;
                this.currentPage3 = 1;
                this.currentPage4 = 1;
                this.pageSize2 = 10;
                this.pageSize3 = 10;
                this.pageSize4 = 10;
            },
            validateX(x) {
                if (x === 2) {
                    this.formInline2.name = this.valid.ValidateValue(this.formInline2.name);
                } else if (x === 3) {
                    this.formInline3.name = this.valid.ValidateValue(this.formInline3.name);
                } else {
                    this.formInline4.name = this.valid.ValidateValue(this.formInline4.name);
                }
            },
            selectSMSTableList() {
                this.changePageCoreRecordData();
                this.currentPage2 = 1;
                this.$api.decision.bPlanSMSTemp.request({},
                    {restUrl: `page=${0}&&size=${this.pageSize2}&&name=${this.formInline2['name']}`}).then((data) => {
                    this.tableData1 = data.data.data;
                    this.total2 = data.data.total;
                    setTimeout(() => {
                        this.setSelectRow();
                    }, 20);
                }).catch((err) => {
                    console.log(err);
                });
            },
            selectPoliciesTableList() {
                this.changePageCoreRecordData1();
                this.currentPage3 = 1;
                this.$api.decision.bPlanPolicy.request({},
                    {restUrl: `page=${0}&&size=${this.pageSize3}&&name=${this.formInline3['name']}`}).then((data) => {
                    this.tableData2 = data.data.data;
                    this.total3 = data.data.total;
                    this.transformPolicy(data);
                    setTimeout(() => {
                        this.setSelectRow1();
                    }, 20);
                }).catch((err) => {
                    console.log(err);
                });
            },
            transformPolicy(data) {
                for (let i = 0, length = data.data.data.length; i < length; i++) {
                    if (this.tableData2[i]['content'] === '0') {
                        this.tableData2[i]['content'] = '黑名单过滤'
                    } else {
                        this.tableData2[i]['content'] = '杀毒'
                    }
                }
            },
            selectAddressList() {
                this.changePageCoreRecordData2();
                this.currentPage4 = 1;
                this.$api.decision.bPlanAddress.request({},
                    {restUrl: `page=${0}&&size=${this.pageSize4}&&name=${this.formInline4['name']}&&phone=${this.formInline4['phone']}&&departmentId=${this.departmentID}&&groupId=${this.groupID}`}).then((data) => {
                    this.tableData3 = data.data.data;
                    this.total4 = data.data.total;
                    setTimeout(() => {
                        this.setSelectRow2();
                    }, 20);
                }).catch((err) => {
                    console.log(err);
                });
            },
            onResetSMST() {
                this.formInline2.name = '';
                this.selectSMSTableList();
            },
            onResetTacT() {
                this.formInline3.name = '';
                this.selectPoliciesTableList();
            },
            onResetAdd() {
                this.formInline4.name = '';
                this.formInline4.addTime = '';
                this.selectAddressList();
            },
            // 通讯录的树
            addressTree() {
                this.$api.decision.departmentTree.request().then((data) => {
                    this.addressData = data.data;
                    this.loadAddTree();
                }).catch((err) => {
                    console.log(err);
                });
            },
            loadAddTree() {
                var $this = this;
                var setting = {
                    data: {
                        key: {
                            name: 'label'
                        }
                    },
                    callback: {
                        onClick: $this.addTreeOnClick,
                    }
                };
                var zTreeObj;
                $(document).ready(function () {
                    zTreeObj = $.fn.zTree.init($("#bmTree"), setting, $this.addressData);
                    var nodeList = zTreeObj.getNodes();
                    //展开第一个根节点
                    zTreeObj.expandNode(nodeList[0], true);
                });
            },
            addTreeOnClick(event, treeId, treeNode) {
                this.changePageCoreRecordData2();
                this.departmentID = treeNode.id;
                this.groupID = '';
                this.$api.decision.bPlanAddress.request({},
                    {restUrl: `page=${0}&&size=${this.pageSize4}&&name=${this.formInline4['name']}&&phone=${this.formInline4['phone']}&&departmentId=${this.departmentID}&&groupId=${this.groupID}`}).then((data) => {
                    this.tableData3 = data.data.data;
                    this.total4 = data.data.total;
                    setTimeout(() => {
                        this.setSelectRow2();
                    }, 20);
                }).catch((err) => {
                    console.log(err);
                });
            },
            // 临时组的树
            temporaryGroupTree() {
                this.$api.decision.bPlanGroupTree.request().then((data) => {
                    this.groupData = data.data;
                    this.loadGroTree();
                }).catch((err) => {
                    console.log(err);
                });
            },
            loadGroTree() {
                var $this = this;
                var setting = {
                    data: {
                        key: {
                            name: 'label'
                        }
                    },
                    callback: {
                        onClick: $this.groTreeOnClick
                    }
                };
                var zTreeObj;
                $(document).ready(function () {
                    zTreeObj = $.fn.zTree.init($("#lszTree"), setting, $this.groupData);
                    var nodeList = zTreeObj.getNodes();
                    //展开第一个根节点
                    zTreeObj.expandNode(nodeList[0], true);
                });
            },
            groTreeOnClick(event, treeId, treeNode) {
                this.groupID = treeNode.id;
                this.departmentID = 0;
                this.changePageCoreRecordData2();
                this.$api.decision.bPlanAddress.request({},
                    {restUrl: `page=${0}&&size=${this.pageSize4}&&name=${this.formInline4['name']}&&phone=${this.formInline4['phone']}&&departmentId=${this.departmentID}&&groupId=${this.groupID}`}).then((data) => {
                    this.tableData3 = data.data.data;
                    this.total4 = data.data.total;
                    setTimeout(() => {
                        this.setSelectRow2();
                    }, 20);
                }).catch((err) => {
                    console.log(err);
                });
            },
            // 记忆分页 （短信模板）
            handleSizeChange2(pageSize) { // 每页条数切换
                this.pageSize2 = pageSize;
                this.handleCurrentChange2(this.currentPage2);
            },
            handleCurrentChange2(currentPage) {//页码切换
                this.currentPage2 = currentPage;
                this.changePageCoreRecordData();
                this.SMSTableList();
            },
            // 复选框被勾选时的回调
            handleSelectionChange1(val) {
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
                this.$refs.multipleTable1.clearSelection();
                for (var i = 0; i < this.tableData1.length; i++) {
                    if (selectAllIds.indexOf(this.tableData1[i][id]) >= 0) {
                        this.$refs.multipleTable1.toggleRowSelection(this.tableData1[i]);
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
                this.tableData1.forEach(row => {
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
            // 记忆分页 （策略模板）
            handleSizeChange3(pageSize) { // 每页条数切换
                this.pageSize3 = pageSize;
                this.handleCurrentChange3(this.currentPage3);
            },
            handleCurrentChange3(currentPage) {//页码切换
                this.currentPage3 = currentPage;
                this.changePageCoreRecordData1();
                this.policiesTableList();
            },
            // 复选框被勾选时的回调
            handleSelectionChange2(val) {
                this.multipleSelection2 = val;
            },
            // 设置选中的方法
            setSelectRow1() {
                if (!this.multipleSelectionAll2 || this.multipleSelectionAll2.length <= 0) {
                    return;
                }
                // 标识当前行的唯一键的名称
                let id = this.id;
                let selectAllIds = [];
                this.multipleSelectionAll2.forEach(row => {
                    selectAllIds.push(row[id]);
                });
                this.$refs.multipleTable2.clearSelection();
                for (var i = 0; i < this.tableData2.length; i++) {
                    if (selectAllIds.indexOf(this.tableData2[i][id]) >= 0) {
                        this.$refs.multipleTable2.toggleRowSelection(this.tableData2[i]);
                    }
                }
            },
            // 记忆选择核心方法
            changePageCoreRecordData1() {
                // 标识当前行的唯一键的名称
                let id = this.id;
                let that = this;
                // 如果总记忆中还没有选择的数据，那么就直接取当前页选中的数据，不需要后面一系列计算
                if (this.multipleSelectionAll2.length <= 0) {
                    this.multipleSelectionAll2 = this.multipleSelection2;
                    return;
                }
                // 总选择里面的key集合
                let selectAllIds = [];
                this.multipleSelectionAll2.forEach(row => {
                    selectAllIds.push(row[id]);
                });
                let selectIds = [];
                // 获取当前页选中的id
                this.multipleSelection2.forEach(row => {
                    selectIds.push(row[id]);
                    // 如果总选择里面不包含当前页选中的数据，那么就加入到总选择集合里
                    if (selectAllIds.indexOf(row[id]) < 0) {
                        that.multipleSelectionAll2.push(row);
                    }
                });
                let noSelectIds = [];
                // 得到当前页没有选中的id
                this.tableData2.forEach(row => {
                    if (selectIds.indexOf(row[id]) < 0) {
                        noSelectIds.push(row[id]);
                    }
                });
                noSelectIds.forEach(idVal => {
                    if (selectAllIds.indexOf(idVal) >= 0) {
                        for (let i = 0; i < that.multipleSelectionAll2.length; i++) {
                            if (that.multipleSelectionAll2[i][id] === idVal) {
                                // 如果总选择中有未被选中的，那么就删除这条
                                that.multipleSelectionAll2.splice(i, 1);
                                break;
                            }
                        }
                    }
                });
            },
            // 记忆分页 （通讯录模板）
            handleSizeChange4(pageSize) { // 每页条数切换
                this.pageSize4 = pageSize;
                this.handleCurrentChange4(this.currentPage4);
            },
            handleCurrentChange4(currentPage) { // 页码切换
                this.currentPage4 = currentPage;
                this.changePageCoreRecordData2();
                this.addressList();
            },
            // 复选框被勾选时的回调
            handleSelectionChange3(val) {
                this.multipleSelection3 = val;
            },
            // 设置选中的方法
            setSelectRow2() {
                if (!this.multipleSelectionAll3 || this.multipleSelectionAll3.length <= 0) {
                    return;
                }
                // 标识当前行的唯一键的名称
                let id = this.id;
                let selectAllIds = [];
                this.multipleSelectionAll3.forEach(row => {
                    selectAllIds.push(row[id]);
                });
                this.$refs.multipleTable3.clearSelection();
                for (var i = 0; i < this.tableData3.length; i++) {
                    if (selectAllIds.indexOf(this.tableData3[i][id]) >= 0) {
                        this.$refs.multipleTable3.toggleRowSelection(this.tableData3[i]);
                    }
                }
            },
            // 记忆选择核心方法
            changePageCoreRecordData2() {
                // 标识当前行的唯一键的名称
                let id = this.id;
                let that = this;
                // 如果总记忆中还没有选择的数据，那么就直接取当前页选中的数据，不需要后面一系列计算
                if (this.multipleSelectionAll3.length <= 0) {
                    this.multipleSelectionAll3 = this.multipleSelection3;
                    return;
                }
                // 总选择里面的key集合
                let selectAllIds = [];
                this.multipleSelectionAll3.forEach(row => {
                    selectAllIds.push(row[id]);
                });
                let selectIds = [];
                // 获取当前页选中的id
                this.multipleSelection3.forEach(row => {
                    selectIds.push(row[id]);
                    // 如果总选择里面不包含当前页选中的数据，那么就加入到总选择集合里
                    if (selectAllIds.indexOf(row[id]) < 0) {
                        that.multipleSelectionAll3.push(row);
                    }
                });
                let noSelectIds = [];
                // 得到当前页没有选中的id
                this.tableData3.forEach(row => {
                    if (selectIds.indexOf(row[id]) < 0) {
                        noSelectIds.push(row[id]);
                    }
                });
                noSelectIds.forEach(idVal => {
                    if (selectAllIds.indexOf(idVal) >= 0) {
                        for (let i = 0; i < that.multipleSelectionAll3.length; i++) {
                            if (that.multipleSelectionAll3[i][id] === idVal) {
                                // 如果总选择中有未被选中的，那么就删除这条
                                that.multipleSelectionAll3.splice(i, 1);
                                break;
                            }
                        }
                    }
                });
            },
        },
        mounted() {
            this.formList(1);
            this.countsList();
            this.$api.decision.bPlanList.request({},
                {restUrl: `type=${1}&&page=${this.currentPage1 - 1}&&size=${this.pageSize1}`}).then((data) => {
                this.planDetail(data.data.data[0]);
            }).catch((err) => {
                console.log(err);
            });
        }
    }
</script>

<style scoped>
    .green {
        background: #56CDA7;
    }
    .blue {
        background: #62B2E5;
    }
    .purple {
        background: #8183D8;
    }
    .red {
        background: #F76857;
    }
    .panel {
        position: relative;
        padding: 20px 15px;
        margin-bottom: 20px;
        text-align: left;
        color: #FFFFFF;
    }
    .state-value .value {
        font-size: 18px;
        margin-bottom: 5px;
    }
    .state-value .title {
        font-size: 14px;
        margin-bottom: 10px;
    }
    .state-value .bord {
        height: 0;
        border-bottom: 2px solid #FFFFFF;
    }
    .symbol{
        position: absolute;
        top: 25px;
        right: 15px;
    }
    .symbol i{
        font-size: 30px;
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
    .message{
        border: 1px solid #dddddd;
        padding: 10px;
        margin:0 10px;
        border-bottom: none;
        cursor: pointer;
    }
    .message:hover{
        background: #F2F2F2;
    }
    .message:last-child{
        border-bottom: 1px solid #dddddd !important;
        margin-bottom: 10px;
    }
    .mes-left-top {
        margin-bottom: 10px;
    }
    .mes-name {
        margin-left: 3px;
        font-size: 15px;
        color: #666666;
    }
    .mes-left{
        text-align: left;
    }
    .mes-right{
        margin-top: 5px;
        text-align: left;
    }
    .mes-title{
        margin-left: 22px;
        color: #999999;
    }
    .mes-content{
        color: #999999;
    }
    .detailPlan{
        padding: 10px 15px;
        border: 1px solid #dddddd;
        margin: 0 10px ;
    }
    .detailPlan .detailTitle{
        width: 70px;
        height: 25px;
        line-height: 25px;
        padding: 5px 10px;
        margin: 10px auto;
        background: #F2F2F2;
        color: #666666;
        border-radius: 15px;
    }
    .block{
        float: none;
        margin-bottom: 30px;
    }
    .block1 {
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
    .first-step{
        width: 430px;
        margin: 50px auto;
        padding: 30px 200px 50px;
        border: 1px solid #dddddd;
    }
    .second-step{
        width: 1000px;
        margin: 50px auto;
        padding: 30px 100px;
        border: 1px solid #dddddd;
    }
    .third-step{
        width: 1000px;
        margin: 50px auto;
        padding: 30px 50px;
        border: 1px solid #dddddd;
    }
    .third-step  .el-pagination{
        text-align: right;
    }
    .firth-step{
        width: 1000px;
        margin: 50px auto;
        padding: 50px;
        border: 1px solid #dddddd;
    }
    .firth-step-data {
        margin-bottom: 40px;
    }
    .userTitle {
        width: 100%;
        height: 40px;
        line-height: 40px;
        text-align: center;
        color: #FFFFFF;
        background: #474747;
    }
    .closeBPlanA {
        position: fixed;
        right: 100px;
        top: 120px;
        width: 30px;
        height: 30px;
        font-size: 25px;
        text-align: center;
        line-height: 30px;
        background: rgba(98,98,98,0.2);
        border-radius: 5px;
        color: #FFFFFF;
        z-index: 999999;
        cursor: pointer;
    }
    .closeBPlanA:hover{
        background: rgba(98,98,98,0.5);
    }
    .left-form{
        float: left;
        margin-right: 50px;
        width: 400px;
    }
    .right-form{
        float: left;
        margin-left: 50px;
        width: 400px;
    }
</style>