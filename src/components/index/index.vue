<template>
    <div id="index" @click="OperatingWebsite">
        <el-container>
            <el-header background-color="#D8DDEC" style="height: 61px;padding: 0;box-sizing: border-box;position: relative;min-width: 1040px">
                <div class="top-border"></div>
                <div class="logo">中智云福</div>
                <el-menu
                    style="position:absolute;left: 202px;width: calc(100% - 210px);"
                    :default-active="activeIndex"
                    class="el-menu-demo"
                    mode="horizontal"
                    @select="handleSelect"
                    background-color="#fff"
                    :router="true"
                    text-color="#999">
                    <el-menu-item index="SystemProject"><i class="iconfont icon-fangzi"></i><span>首页</span></el-menu-item>
                    <el-submenu index="2">
                        <template slot="title"><i class="iconfont icon-fangzi"></i><span>数据库设计</span></template>
                        <el-menu-item  index="SystemCase">
                            <span slot="title">表单设置</span>
                        </el-menu-item>
                        <el-menu-item index="SystemProjectSF">
                            <span slot="title">访问规则</span>
                        </el-menu-item>
                        <el-menu-item>
                            <span slot="title">数据规则库</span>
                        </el-menu-item>
                        <el-menu-item>
                            <span slot="title">数据通用设置</span>
                        </el-menu-item>
                    </el-submenu>
                    <el-submenu index="3">
                        <template slot="title"><i class="iconfont icon-fangzi"></i><span>数据库应用</span></template>
                        <el-menu-item>
                            <span slot="title">统计分析</span>
                        </el-menu-item>
                        <el-menu-item index="SystemSearch">
                            <span slot="title">数据查询/导出</span>
                        </el-menu-item>
                    </el-submenu>
                    <el-submenu index="4">
                        <template slot="title"><i class="iconfont icon-fangzi"></i><span>系统管理</span></template>
                        <el-menu-item>
                            <span slot="title">用户管理</span>
                        </el-menu-item>
                        <el-menu-item >
                            <span slot="title">权限管理</span>
                        </el-menu-item>
                        <el-menu-item>
                            <span slot="title">数据策略</span>
                        </el-menu-item>
                        <el-menu-item>
                            <span slot="title">操作日志</span>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
                <div class="logOut" @click="centerDialogVisible=true">
                    <i class="iconfont icon-tubiaozhizuomobanyihuifu-"></i>
                </div>
                <div style="clear: both"></div>
            </el-header>
            <el-container>
                <el-main>
                    <router-view @fromChild="listenChild"></router-view>
                </el-main>
            </el-container>
        </el-container>
        <el-dialog
            title="登出"
            :visible.sync="centerDialogVisible"
            width="400px"
            center>
            <span>你确定要退出到登录页吗？</span>
            <span slot="footer" class="dialog-footer">
            <el-button @click="centerDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="loginOut">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
    import Vue from 'vue';
    import ElementUI from 'element-ui';
    import axios from 'axios'
    import "element-ui/lib/theme-chalk/index.css";
    Vue.use(ElementUI);
    export default {
        inject: ['reload'],
        name: "index",
        data() {
            return {
                showNewsLog: false,
                centerDialogVisible: false,
                showText: true,
                zz: false,
                bol: 1,
                isHid: false,
                activeIndex: '',
                isCollapse: false,
                asideWidth: 'on',
                asideWidth2: 'off',
                currentTime: new Date().getTime() - 100,
                newsLog: {}
            }
        },
        methods: {
            // 点击左侧导航跳转
            setIndex(indexName) {
                this.activeIndex = indexName;
                this.reload();
                this.getUrl();
            },
            // 监听子页面路由点击变化
            listenChild(name) {
                this.activeIndex = name;
                if (name === '/SystemProject') {
                    this.bol = 1;
                } else if (name === '/AddressList') {
                    this.bol = 2;
                } else if (name === '/SMSRS') {
                    this.bol = 3;
                } else if (name === '/BPlan') {
                    this.bol = 4;
                } else if (name === '/PlanLog') {
                    this.bol = 5;
                }
                this.reload();
            },
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
            },
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            },
            loginOut() {
                sessionStorage.clear();
                this.$router.push({ path: '/Login'});
            },
            changeWidth() {
                window.addEventListener('resize', ()=> {
                    if (window.innerWidth < 750) {
                        this.isCollapse = true;
                    } else {
                        this.isCollapse = false;
                    }
                });
            },
            getUrl() {
                if (this.$route.path === '/SystemProject' || this.$route.path === '/SystemCase') {
                    this.activeIndex = '/SystemIndex';
                    // this.bol = 1;
                }else if ( this.$route.path === '/SystemInput') {
                  this.activeIndex = '/SystemInput?id=1';
                  // this.bol = 2;
                } else if ( this.$route.path === '/SystemSearch') {
                  this.activeIndex = '/SystemSearch';
                  // this.bol = 3;
                } else if ( this.$route.path === '/SystemUsers' || this.$route.path === '/SystemRole'|| this.$route.path === '/SystemStrategy'|| this.$route.path === '/SystemLocation'|| this.$route.path === '/SystemHospital'|| this.$route.path === '/SystemTitle' || this.$route.path === '/SystemDepartment' || this.$route.path === '/SystemLogs' ) {
                    this.activeIndex = '/SystemParameter';
                    // this.bol = 6;
                }
            },
            OperatingWebsite() {
                let currentTime = this.currentTime;
                let lastTime = new Date().getTime();
                let timeOut = sessionStorage.outTime; //设置时间 10分钟
                if ((lastTime - currentTime) > timeOut) {
                    // 未操作页面，跳转登录页面
                    this.currentTime = new Date().getTime();
                    this.loginOut();
                } else {
                    this.currentTime = new Date().getTime();
                }
                this.closeMsg(event);
            },
            closeMsg(event) {
                let btn = document.querySelector(".newsLog");
                if (btn) {
                    if (!btn.contains(event.target)) {
                        this.showNewsLog = false;
                    }
                }
            }
        },
        mounted() {
            this.changeWidth();
            this.getUrl();
            // this.getLeftList()
            // this.stateList();
        }
    }
</script>

<style scoped>
    @import "common.less";
    @import "App.less";
    .title {
        width: 200px;
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        color: #999999;
        text-align: center;
        border: 1px solid #dddddd;
        border-right: none;
    }
    h3 {
        text-align: center;
        color: #6EC5A4;
    }
    .logo{
        float: left;
        width: 202px;
        height: 61px;
        line-height: 61px;
        text-align: center;
        font-size: 18px;
        color: #58BA85;
        /*background-color: #D8DDEC;*/
        border-bottom: 1px solid #D8DDEC;
        background: url("../../assets/logo_126x50.svg") no-repeat;
        background-size: 170px 63px;
    }
    .el-menu--horizontal > .el-submenu__title{
        height: 45px;
        line-height: 45px;
    }
    .expansion{
        float: left;
        width: 50px;
        height: 54px;
        line-height: 58px;
        text-align: center;
        cursor: pointer;
    }
    .expansion:hover{
        color: #333333;
    }
    .menu .el-menu-item:hover {
        color: #ffffff !important;
        background: #53B983 !important;
    }
    .on{
        width: 202px !important;
        transition-duration: .5s;
    }
    .off{
        width: 65px !important;
        transition-duration: .5s;
    }
    span {
        margin-left: 5px;
    }
    .bigI {
        font-size: 22px;
    }
    .right-pic {
        float: right!important;
    }
    .changeArrow i{
        font-size: 25px;
    }
    .changeArrow i:hover{
        color: #999999;
    }
    .logOut{
        position:absolute;
        right: 50px;
        cursor: pointer;
    }
    .readLog {
        position:absolute;
        right: 100px;
        cursor: pointer;
    }
    .logOut i,.readLog i{
        font-size: 20px;
    }
    .logOut:hover{
        color: #333333;
    }
    .readLog:hover{
        color: #333333;
    }
    .el-dialog__header{
        padding: 5px 20px;
    }
    .newsLog{
        position: absolute;
        top: 60px;
        right: 10px;
        width: 350px;
        padding:0 10px;
        font-size: 14px;
        border: 2px solid #dddddd;
        background: #FFFFFF;
        z-index: 9999;
    }
    .newsLogTitle {
        padding:0 10px;
        height: 35px;
        line-height: 35px;
        color: #999999;
        border-bottom: 1px solid #f1f1f1;
    }
    .newsLogContent {
        overflow: hidden;
        padding:0 10px;
        height: 35px;
        line-height: 35px;
        color: #666666;
        border-bottom: 1px solid #f1f1f1;
        cursor: pointer;
    }
    .newsLogContent:hover {
        color: #35C8CA;
    }
    .cLeft{
        float: left;
    }
    .cRight{
        float: right;
    }
    .el-menu-item, .el-submenu__title {
        /*height: 45px;*/
        /*line-height: 45px;*/
    }
</style>