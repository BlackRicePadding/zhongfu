<template>
  <el-row class="login-info">
    <h2 class="title" style="text-align: center; margin-top: 151px; font-size: 51px; color: #fff;" >慢性病临床信息系统</h2>
    <el-form :model="loginForm"  @keyup.enter.native="login" :rules="fieldRules" ref="loginForm" label-position="left" label-width="0px" class="demo-ruleForm login-container">
        <h2 class="title" style="padding-left:22px;" >用户登录</h2>
        <h3 class="title" style="padding-left:22px;" >USER LOGIN</h3>
      <hr class="login-hr">
      <el-form-item prop="account">
        <el-input type="text" v-model="loginForm.account" auto-complete="off" placeholder="账号"><el-button icon="el-icon-user-solid" slot="prepend"></el-button></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="密码"><el-button icon="el-icon-key" slot="prepend"></el-button></el-input>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%;border-radius:20px;" @click.native.prevent="login" :loading="loading" plain>登 录</el-button>
      </el-form-item>
    </el-form>
  </el-row>
</template>

<script>
import Cookies from "js-cookie"
export default {
  name: 'Login',
  components:{
  },
  data() {
    return {
      loading: false,
      loginForm: {
        account: 'admin',
        password: 'admin',
        captcha:'',
        src: ''
      },
      fieldRules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      checked: true
    }
  },
  methods: {
    login() {
      this.loading = true
      let userInfo = {account:this.loginForm.account, password:this.loginForm.password, captcha:this.loginForm.captcha}
      this.$api.login.login(userInfo).then((res) => {
          if(res.msg != null) {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          } else {
            Cookies.set('token', res.data.token) // 放置token到Cookie
            sessionStorage.setItem('user', userInfo.account) // 保存用户到本地会话
            sessionStorage.setItem('token', res.data.token) // 保存用户到本地会话
            this.$router.push('/SystemProject');
          }
          this.loading = false
        }).catch((res) => {
          this.$message({
          message: res.message,
          type: 'error'
          })
        });
    },
    refreshCaptcha: function(){
      this.loginForm.src = this.global.baseUrl + "/captcha.jpg?t=" + new Date().getTime();
    }
  },
  mounted() {
    this.refreshCaptcha()
  },
  computed:{
  }
}
</script>

<style scoped>
    .login-info{
        height: 100%;
        background:url("../../assets/login.jpg");
    }
    .login-hr{
        border: 0;
        height: 1px;
        background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0));
    }
    .login-container {
        background-clip: padding-box;
        margin: 140px auto;
        width: 500px;
        padding: 35px 35px 15px 35px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
    }
    .login-container .title {
        margin: 0px auto 10px auto;
        text-align: center;
        color: #505458;
    }
    .login-container .remember {
        margin: 0px 0px 35px 0px;
    }
</style>
