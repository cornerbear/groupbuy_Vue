<!--
    @Author  :   zhangxiaojian
    @Time    :   2021/03/28 10:15:00
 -->
<template>
    <div>
        <el-button type="text" @click="updatePasswordDialog = true">修改密码</el-button>
        <div style="width: 400px;">
            <el-form :model="detailModel" ref="detailForm">
                <el-form-item label="用户ID" prop="userId">
                    <el-input v-model="detailModel.userId" autocomplete="off" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="detailModel.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="detailModel.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="用户性别" prop="userSex">
                    <el-radio v-model="detailModel.userSex" :label="1">男</el-radio>
                    <el-radio v-model="detailModel.userSex" :label="0">女</el-radio>
                </el-form-item>
                <el-form-item label="手机号" prop="userPhone">
                    <el-input v-model="detailModel.userPhone" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="地址" prop="userAddress">
                    <el-input v-model="detailModel.userAddress" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div>
                <span>
                    <el-button @click="resetUserDetail()">重 置</el-button>
                    <el-button type="primary" @click="updateDetail()">修改信息</el-button>
                </span>
            </div>
        </div>
        <el-dialog title="修改密码" v-model="updatePasswordDialog">
            <el-form :model="updatePasswordModel" ref="updatePasswordForm" :rules="rules">
                <el-form-item label="旧密码" prop="oldPassword">
                    <el-input v-model="updatePasswordModel.oldPassword" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                    <el-input v-model="updatePasswordModel.newPassword" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="再次输入" prop="newPassword1">
                    <el-input v-model="updatePasswordModel.newPassword1" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="updatePasswordDialog = false">取 消</el-button>
                    <el-button type="primary" @click="updatePassword()">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>

    import { ElMessage } from 'element-plus'

    export default {
        name: "UserDetail",
        data() {
            return {
                updatePasswordDialog: false,
                detailModel: {
                    userId: null,
                    username: null,
                    name: null,
                    userSex: null,
                    userPhone: null,
                    userAddress: null,
                },
                updatePasswordModel: {
                    oldPassword: null,
                    newPassword: null,
                    newPassword1: null,
                }
            }
        },
        created() {
            this.setUserDetail();
        },
        methods: {
            setUserDetail() {
                this.getRequest("/user").then(resp => {
                    console.log(resp);
                    this.detailModel = resp.data;

                })
            },
            resetUserDetail() {

            },
            updateDetail() {
                this.putRequest("/user", this.detailModel).then(resp => {
                    console.log(resp);
                    this.detailModel = resp.data;
                    if (resp.success) {
                        ElMessage.success(res.msg);
                    } else {
                        ElMessage.error(res.msg);
                    }

                })
            },
            updatePassword() {
                this.putRequest("/user/updatePassword", this.updatePasswordModel).then(resp => {
                    console.log(resp);
                    if (resp.success) {
                        this.updatePasswordDialog = false;
                        ElMessage.success(res.msg);
                    } else {
                        ElMessage.error(res.msg);
                    }

                })
            }
        },
    }
</script>