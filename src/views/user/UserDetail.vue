<!--
    @Author  :   zhangxiaojian
    @Time    :   2021/03/28 10:15:00
 -->
<template>
    <div>

        <div class="header">
            <el-card>
                <el-button size="small" icon="el-icon-close" circle @click="cancelSelect"></el-button>
                <el-button type="primary" plain @click="applyGrouper">申请团长</el-button>
                <el-button type="primary" plain @click="updatePasswordDialog = true">修改密码</el-button>
            </el-card>
        </div>
        <div>
            <el-form :model="detailModel" ref="detailForm" label-width="100px">
                <el-form-item label="用户ID" prop="userId">
                    <el-input v-model="detailModel.userId" autocomplete="off" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="detailModel.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="detailModel.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="用户性别" prop="sex">
                    <el-radio v-model="detailModel.sex" :label="true">男</el-radio>
                    <el-radio v-model="detailModel.sex" :label="false">女</el-radio>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="detailModel.phone" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="地址" prop="detailAddress">
                    <el-cascader size="medium" :options="regionOptions.provinceData" v-model="region.province"
                        @change="changeProvince" placeholder="请选择省">
                    </el-cascader>
                    <el-cascader size="medium" :options="regionOptions.cityData" v-model="region.city"
                        @change="changeCity" placeholder="请选择市">
                    </el-cascader>
                    <el-cascader size="medium" :options="regionOptions.areaData" v-model="region.area"
                        @change="changeArea" placeholder="请选择区">
                    </el-cascader>
                    <el-cascader size="medium" :options="regionOptions.streetData" v-model="region.street"
                        @change="changeStreet" placeholder="请选择街道">
                    </el-cascader>
                    <el-cascader size="medium" :options="regionOptions.communityData" v-model="region.community"
                        @change="changeCommunity" ref="communityRef" placeholder="请选择社区">
                    </el-cascader>
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

    export default {
        name: "UserDetail",
        data() {
            return {
                updatePasswordDialog: false,
                detailModel: {
                    userId: null,
                    communityId: null,
                    username: null,
                    name: null,
                    sex: null,
                    phone: null,
                    detailAddress: null,
                },
                updatePasswordModel: {
                    oldPassword: null,
                    newPassword: null,
                    newPassword1: null,
                },
                region: {
                    province: null,
                    city: null,
                    area: null,
                    street: null,
                    community: null,
                },
                regionOptions: {
                    provinceData: null,
                    cityData: null,
                    areaData: null,
                    streetData: null,
                    communityData: null,
                },
                labelWidth: '100px',
            }
        },
        created() {
            this.setUserDetail();
        },
        methods: {
            applyGrouper(){
                var userRegion = this.$refs.communityRef.getCheckedNodes()[0].data;
                this.$confirm('确认申请'+userRegion.label+userRegion.detailLocation+'的团长？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(() => {
                    this.postRequest("/user/apply/grouper").then((resp) => {
                        if (resp.success) {
                            console.log(resp);
                        }
                    })
                }).catch(() => {
                    this.message.info("已取消删除");
                });
            },
            setUserDetail() {
                this.getRequest("/user").then((resp) => {
                    this.detailModel = resp.data;
                    this.region.community = resp.data.communityId;

                    this.getRequest("/system/region/allLevel/" + resp.data.communityId).then((resp) => {
                        this.regionOptions.provinceData = resp.data.provinceOptions;
                        this.regionOptions.cityData = resp.data.cityOptions;
                        this.regionOptions.areaData = resp.data.areaOptions;
                        this.regionOptions.streetData = resp.data.streetOptions;
                        this.regionOptions.communityData = resp.data.communityOptions;

                        if (resp.data.checkPath != undefined) {
                            this.region.province = resp.data.checkPath.provinceCode;
                            this.region.city = resp.data.checkPath.cityCode;
                            this.region.area = resp.data.checkPath.areaCode;
                            this.region.street = resp.data.checkPath.streetCode;

                            this.getRequest("/user/community/" + this.region.street).then((resp) => {
                                this.regionOptions.communityData = resp.data;
                            })
                        }
                    });
                });


            },
            resetUserDetail() {
                this.setUserDetail();
            },
            updateDetail() {
                this.putRequest("/user", this.detailModel).then(resp => {
                    console.log(resp);
                    this.detailModel = resp.data;
                    if (resp.success) {
                        this.message.success(res.msg);
                    } else {
                        this.message.error(res.msg);
                    }

                })
            },
            updatePassword() {
                this.putRequest("/user/updatePassword", this.updatePasswordModel).then(resp => {
                    console.log(resp);
                    if (resp.success) {
                        this.updatePasswordDialog = false;
                        this.message.success(res.msg);
                    } else {
                        this.message.error(res.msg);
                    }

                })
            },
            changeProvince(value) {
                this.getRequest("/system/region/city/" + this.region.province).then((resp) => {
                    this.regionOptions.cityData = resp.data;
                    this.region.city = null;
                    this.regionOptions.areaData = null;
                    this.region.area = null;
                    this.regionOptions.streetData = null;
                    this.region.street = null;
                    this.regionOptions.communityData = null;
                    this.region.community = null;
                })
            },
            changeCity(value) {
                this.getRequest("/system/region/area/" + this.region.city).then((resp) => {
                    this.regionOptions.areaData = resp.data;
                    this.region.area = null;
                    this.regionOptions.streetData = null;
                    this.region.street = null;
                    this.regionOptions.communityData = null;
                    this.region.community = null;
                })

            },
            changeArea(value) {
                this.getRequest("/system/region/street/" + this.region.area).then((resp) => {
                    this.regionOptions.streetData = resp.data;
                    this.region.street = null;
                    this.regionOptions.communityData = null;
                    this.region.community = null;
                })

            },
            changeStreet(value) {
                this.getRequest("/user/community/" + this.region.street).then((resp) => {
                    this.regionOptions.communityData = resp.data;
                    this.region.community = null;
                    console.log(this.regionOptions.communityData);
                })
            },
            changeCommunity(value) {
                this.detailModel.communityId = value[0];
            },
        },
    }
</script>
<style>
    .header {
        margin-bottom: 5px;
    }

    .el-input {
        width: 220px;
    }
</style>