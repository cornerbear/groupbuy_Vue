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
                    <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                    <el-button type="text" size="small">编辑</el-button>
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
                    if(resp.success){
                        this.setRoleVisible = false;
                    }
                });
            },

        },
        created() {
            this.getTableData(this.pageNo, this.pageSize);
        },

    }
</script>