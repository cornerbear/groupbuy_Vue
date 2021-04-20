<!--
    @Author  :   zhangxiaojian
    @Time    :   2021/04/02 10:15:00
 -->
<template>
    <div>
        <el-table :data="tableData" border style="width: 100%" :fit="true">
            <!-- <el-table-column fixed prop="date" label="日期" width="150">
            </el-table-column> -->
            <el-table-column prop="userId" label="用户ID">
            </el-table-column>
            <el-table-column prop="username" label="用户名">
            </el-table-column>
            <el-table-column prop="name" label="姓名">
            </el-table-column>
            <el-table-column prop="roles" label="已有身份">
            </el-table-column>
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button @click="openDetail(scope.row)" type="text" size="small">查看</el-button>
                    <el-button @click="openUpdate(scope.row)" type="text" size="small">编辑</el-button>
                    <el-button @click="openSetRole(scope.row)" type="text" size="small">设置身份</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
            :page-sizes="[5, 10, 20]" :page-size="5" layout="total, sizes, prev, pager, next, jumper" :total="total"
            :page-count="pageCount">
        </el-pagination>

        <!-- 设置身份模态框 -->
        <el-dialog title="设置身份" v-model="setRoleVisible">
            <el-transfer v-model="transferOwn" :data="transferData" :titles="['未拥有', '已拥有']" :props="transferProps" />
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="setRoleVisible = false">取 消</el-button>
                    <el-button type="primary" @click="setUserRole()">保 存</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 查看用户详情模态框 -->
        <el-dialog title="查看用户" v-model="detailDialogVisible">
            <el-form :model="dataModel" ref="detailForm" :rules="rules" :disabled="formDisabled">
                <el-form-item label="用户ID" prop="userId">
                    <el-input v-model="dataModel.userId"></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="dataModel.username"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="dataModel.name"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="dataModel.phone"></el-input>
                </el-form-item>
                <el-form-item label="地址" prop="detailAddress">
                    <el-input v-model="dataModel.detailAddress"></el-input>
                </el-form-item>
                <el-form-item label="用户性别" prop="sex">
                    <el-radio v-model="dataModel.sex" :label="true">男</el-radio>
                    <el-radio v-model="dataModel.sex" :label="false">女</el-radio>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="detailDialogVisible = false">取 消</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 编辑用户模态框 -->
        <el-dialog title="修改用户信息" v-model="updateDialogVisible">
            <el-form :model="dataModel" ref="updateForm" :rules="rules">
                <el-form-item label="用户ID" prop="userId" v-show="false">
                    <el-input v-model="dataModel.userId"></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="dataModel.username"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="dataModel.name"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="dataModel.phone"></el-input>
                </el-form-item>
                <el-form-item label="地址" prop="detailAddress">
                    <el-input v-model="dataModel.detailAddress"></el-input>
                </el-form-item>
                <el-form-item label="用户性别" prop="sex">
                    <el-radio v-model="dataModel.sex" :label="true">男</el-radio>
                    <el-radio v-model="dataModel.sex" :label="false">女</el-radio>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="updateDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="update()">修 改</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                total: null,
                tableData: null,
                pageCount: null,
                currentPage: null,
                pageNo: 1,
                pageSize: 5,

                setRoleVisible: false,
                transferData: [],
                transferOwn: [],
                transferProps: {
                    key: 'roleId',
                    label: 'nameZh'
                },
                transferUserId: null,

                detailDialogVisible: false,
                formDisabled: true,
                dataModel: null,
                updateDialogVisible: false,
            }
        },
        methods: {
            handleClick(row) {
                console.log(row);
            },
            handleSizeChange(pageSize) {
                this.pageSize = pageSize;
                this.getTableData(this.pageNo, this.pageSize)
            },
            handleCurrentChange(pageNo) {
                this.pageNo = pageNo;
                this.getTableData(this.pageNo, this.pageSize)
            },
            getTableData(pageNo, pageSize) {
                this.getRequest("/admin/userRole/all/" + pageNo + "/" + pageSize).then((resp) => {
                    for (let i = 0; i < resp.records.length; i++) {
                        var roleString = "";
                        for (let j = 0; j < resp.records[i].roles.length; j++) {
                            roleString = roleString + resp.records[i].roles[j].nameZh + ',';
                        }
                        if (roleString.length != 0) {
                            roleString = roleString.substring(0, roleString.length - 1);
                        }
                        resp.records[i].roles = roleString;
                    }
                    this.tableData = resp.records;
                    this.total = resp.total;
                    this.pageCount = resp.pages;
                }).catch((error) => {
                    console.log(error);
                });
            },

            openDetail(row) {
                this.getRequest("/admin/user/" + row.userId).then(resp => {
                    if (resp.success) {
                        this.dataModel = resp.data;
                        this.detailDialogVisible = true;
                    }
                })
            },

            openUpdate(row) {
                this.getRequest("/admin/user/" + row.userId).then(resp => {
                    if (resp.success) {
                        this.dataModel = resp.data;
                        this.updateDialogVisible = true;
                    }
                })
            },
            update() {
                this.putRequest("/admin/user", this.dataModel).then(resp => {
                    if (resp.success) {
                        this.updateDialogVisible = false;
                        this.init();
                    }
                })
            },

            openSetRole(row) {
                // 请求出所有的角色
                this.getRequest("/system/role/all").then((resp) => {
                    this.transferData = resp.data;
                });
                // 请求出该用户拥有的角色
                this.transferUserId = row.userId;
                this.getRequest("/admin/userRole/" + row.userId).then((resp) => {
                    this.transferOwn = resp.data;
                });
                this.setRoleVisible = true;
            },
            setUserRole() {
                console.log(this.transferOwn);
                this.putKeyValueRequest("/admin/userRole", {
                    userId: this.transferUserId,
                    roleIds: this.transferOwn,
                }).then((resp) => {
                    if (resp.success) {
                        this.setRoleVisible = false;
                        this.init();
                    }
                });
            },


            init() {
                this.getTableData(this.pageNo, this.pageSize);
            },
        },
        created() {
            this.init();
        },


    }
</script>