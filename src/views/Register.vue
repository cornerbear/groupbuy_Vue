<template>
    <div>
        <el-form :rules="rules" ref="registerForm" v-loading="loading" element-loading-text="正在登录..."
            element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" :model="registerModel"
            class="registerContainer">
            <h3 class="registerTitle">用户注册</h3>
            <el-form-item prop="username">
                <el-input size="medium" type="text" v-model="registerModel.username" auto-complete="off"
                    placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input size="medium" type="password" v-model="registerModel.password" auto-complete="off"
                    placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item prop="code">
                <el-input size="medium" type="text" v-model="registerModel.code" auto-complete="off" placeholder="点击图片更换验证码"
                    @keydown.enter.native="submitRegister" style="width: 250px"></el-input>
                <img :src="vcUrl" @click="updateVerifyCode" alt="" style="cursor: pointer">
            </el-form-item>
            <el-button size="medium" type="primary" style="width: 100%;" @click="submitRegister">注册</el-button>
        </el-form>
    </div>
</template>

<script>

    export default {
        name: "Register",
        data() {
            return {
                loading: false,
                vcUrl: '/verifyCode?time=' + new Date(),
                registerModel: {
                    username: 'admin',
                    password: '123456',
                    code: '1',
                    rememberMe : null,
                },
                rules: {
                    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
                    code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
                }
            }
        },
        methods: {
            updateVerifyCode() {
                this.vcUrl = '/verifyCode?time=' + new Date();
            },
            submitRegister() {
                this.$refs.registerForm.validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        this.postRequest('/register', this.registerModel).then(resp => {
                            this.loading = false;
                            if (resp.success) {
                                this.$router.push('/');
                            } else {
                                this.vcUrl = '/verifyCode?time=' + new Date();
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            updateVerifyCode() {
                this.vcUrl = '/verifyCode?time=' + new Date();
            },
        }
    }
</script>

<style>
    .registerContainer {
        border-radius: 15px;
        background-clip: padding-box;
        margin: 180px auto;
        width: 350px;
        padding: 15px 35px 15px 35px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
    }

    .registerTitle {
        margin: 15px auto 20px auto;
        text-align: center;
        color: #505458;
    }

    .registerRemember {
        text-align: left;
        margin: 0px 0px 15px 0px;
    }

    .el-form-item__content {
        display: flex;
        align-items: center;
    }
</style>