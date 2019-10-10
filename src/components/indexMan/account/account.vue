<template>
    <div id="account">
        <div class="lar-title">
            <span class="lar-span">账户设置</span>
        </div>
        <div class="pad">
            <p>账户设置</p>
            <div class="content">
                <el-row>
                    <el-col :span="24">
                        <div class="grid-content">
                            <el-form ref="form" :model="form" label-width="80px">
                                <el-upload
                                    class="avatar-uploader"
                                    action="https://jsonplaceholder.typicode.com/posts/"
                                    :show-file-list="false"
                                    :on-success="handleAvatarSuccess"
                                    :before-upload="beforeAvatarUpload">
                                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    <div style="border-top: 1px dashed #dddddd">上传头像</div>
                                </el-upload>
                                <el-form-item label="用户名" prop="name">
                                    <el-input v-model="form.name"></el-input>
                                </el-form-item>
                                <el-form-item label="Email" prop="email">
                                    <el-input v-model="form.email"></el-input>
                                </el-form-item>
                                <el-form-item label="旧密码" prop="oldPassword">
                                    <el-input v-model="form.oldPassword"></el-input>
                                </el-form-item>
                                <el-form-item label="新密码" prop="newPassword">
                                    <el-input v-model="form.newPassword"></el-input>
                                </el-form-item>
                                <el-form-item label="确认密码" prop="password">
                                    <el-input v-model="form.password"></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="onSubmit">提交</el-button>
                                </el-form-item>
                            </el-form>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "account",
        data() {
            return {
                form: {
                    name: '',
                    email: '',
                    oldPassword: '',
                    newPassword: '',
                    password: '',
                },
                imageUrl: ''
            }
        },
        methods: {
            onSubmit() {
                console.log('submit!');
            },
            handleAvatarSuccess(res, file) {
                this.imageUrl = URL.createObjectURL(file.raw);
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            }
        }
    }
</script>

<style scoped>
    .account {
        border: 1px solid #dddddd;
        border-top: none;
        background: #FFFFFF;
    }
    .grid-content{
        width: 400px;
        margin: 40px auto;
    }
    .avatar-uploader {
        width: 170px;
        margin-left: 145px;
        margin-bottom: 20px;
        border: 1px dashed #dddddd;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 170px;
        height: 170px;
        line-height: 170px;
        text-align: center;
    }
    .avatar {
        width: 170px;
        height: 170px;
        display: block;
    }
</style>