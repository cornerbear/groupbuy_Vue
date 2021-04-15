<!--
    @Author  :   zhangxiaojian
    @Time    :   2021/03/28 10:15:00
 -->
<template>
    <div>

        <div class="header">
            <el-card>
                <el-button type="primary" plain @click="addDialogVisible=true">
                    发放奖励
                </el-button>
                <el-input placeholder="请输入用户ID" prefix-icon="el-icon-search" v-model="searchModel.userId"
                    style="width: 200px;margin-left: 5px;margin-right: 5px;"></el-input>
                <el-button type="primary" plain @click="search">
                    搜索
                </el-button>
            </el-card>
        </div>
        <el-table :data="tableData" border style="width: 100%" :fit="true">
            <el-table-column prop="userId" label="用户ID">
            </el-table-column>
            <el-table-column prop="rewardName" label="奖励名称">
            </el-table-column>
            <el-table-column prop="rewardDesc" label="详细描述">
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间">
            </el-table-column>
            <el-table-column prop="actionUserId" label="操作人ID">
            </el-table-column>
            <el-table-column fixed="right" label="操作">
                <template #default="scope">
                    <el-button @click="openUpdateReward(scope.row)" type="text" size="small">修改</el-button>
                    <el-button @click="deleteReward(scope.row)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
            :page-sizes="[5, 10, 20]" :page-size="5" layout="total, sizes, prev, pager, next, jumper" :total="total"
            :page-count="pageCount">
        </el-pagination>

        <!-- 发放奖励模态框 -->
        <el-dialog title="发放奖" v-model="addDialogVisible">
            <el-form :model="addFormModel" ref="addForm" :rules="rules">
                <el-form-item label="用户ID" prop="userId">
                    <el-input v-model="addFormModel.userId" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="奖励名称" prop="rewardName">
                    <el-input v-model="addFormModel.rewardName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="奖励描述" prop="rewardDesc">
                    <el-input v-model="addFormModel.rewardDesc" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addReward('addForm')">确 定</el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 更新奖励模态框 -->
        <el-dialog title="更新奖励" v-model="updateDialogVisible">
            <el-form :model="addFormModel" ref="addForm" :rules="rules">
                <el-form-item label="奖励名称" prop="rewardName">
                    <el-input v-model="addFormModel.rewardName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="奖励描述" prop="rewardDesc">
                    <el-input v-model="addFormModel.rewardDesc" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="updateDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="updateReward('addForm')">修 改</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>

    export default {
        name: "ManagerReward",
        data() {
            return {
                total: null,
                tableData: null,
                pageCount: null,
                currentPage: null,
                pageNo: 1,
                pageSize: 5,

                // 发放奖励
                addDialogVisible: false,
                addFormModel: {
                    userId: '',
                    rewardName: '',
                    rewardDesc: '',
                },
                rules: {
                    userId: [{ required: true, message: '用户ID不能为空', trigger: 'blur' }],
                    rewardName: [{ required: true, message: '奖励名称不能为空', trigger: 'blur' }],
                    rewardDesc: [{ required: true, message: '详细描述不能为空', trigger: 'blur' }]
                },

                updateDialogVisible: false,
                dataModel: null,

                searchModel: {
                    userId: '',
                }

            }
        },
        methods: {
            handleSizeChange(pageSize) {
                this.pageSize = pageSize;
                this.getTableData(this.pageNo, this.pageSize)
            },
            handleCurrentChange(pageNo) {
                this.pageNo = pageNo;
                this.getTableData(this.pageNo, this.pageSize)
            },
            getTableData(pageNo, pageSize) {
                this.getRequest("/manager/staffReward/all/" + pageNo + "/" + pageSize).then((resp) => {
                    this.tableData = resp.records;
                    this.total = resp.total;
                    this.pageCount = resp.pages;
                });
            },
            openAddReward(row) {
                this.addDialogVisible = true;
            },
            addReward() {
                this.postRequest("/manager/staffReward", this.addFormModel).then((resp) => {
                    console.log(resp);
                    this.addDialogVisible = false;
                    this.$refs.addForm.resetFields();
                    this.getTableData(this.pageNo, this.pageSize);
                });
            },
            openUpdateReward(row) {
                this.getRequest("/manager/staffReward/" + row.id).then((resp) => {
                    console.log(resp);
                    this.addFormModel = resp.data;
                    this.updateDialogVisible = true;
                });
            },
            updateReward() {
                this.putRequest("/manager/staffReward", this.addFormModel).then((resp) => {
                    console.log(resp);
                    this.updateDialogVisible = false;
                    this.$refs.addForm.resetFields();
                    this.getTableData(this.pageNo, this.pageSize);
                });
            },
            deleteReward(row) {
                this.$confirm('此操作将删除该奖励, 是否继续?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/manager/staffReward/" + row.id).then((res) => {
                        this.getTableData(this.pageNo, this.pageSize);
                    })
                }).catch(() => {
                    this.message.info("已取消删除");
                });
            },
            search() {
                this.getRequest("/manager/staffReward/all/" + this.pageNo + "/" + this.pageSize + "?userId=" + this.searchModel.userId).then((resp) => {
                    this.tableData = resp.records;
                    this.total = resp.total;
                    this.pageCount = resp.pages;
                });
            }
        },
        created() {
            this.getTableData(this.pageNo, this.pageSize);
        },
    }
</script>
<style>
    .header {
        margin-bottom: 5px;
    }
</style>