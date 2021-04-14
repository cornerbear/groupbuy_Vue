<!--
    @Author  :   zhangxiaojian
    @Time    :   2021/03/28 10:15:00
 -->
<template>
    <div>
        <el-table :data="tableData" border style="width: 100%" :fit="true">
            <el-table-column prop="userId" label="用户ID">
            </el-table-column>
            <el-table-column prop="username" label="用户名">
            </el-table-column>
            <el-table-column prop="score" label="总评分">
            </el-table-column>
            <el-table-column fixed="right" label="操作">
                <template #default="scope">
                    <el-button @click="openScoreDetail(scope.row)" type="text" size="small">查看评分记录</el-button>
                    <el-button @click="openAddScoreLog(scope.row)" type="text" size="small">评分</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
            :page-sizes="[5, 10, 20]" :page-size="5" layout="total, sizes, prev, pager, next, jumper" :total="total"
            :page-count="pageCount">
        </el-pagination>

        <!-- 评分模态框 -->
        <el-dialog title="评分" v-model="addDialogVisible">
            <el-form :rules="rules" ref="addScoreLogFormRef">
                <el-form-item label="" prop="action">
                    <el-radio v-model="addStaffScoreLogModel.action" :label="true">增加</el-radio>
                    <el-radio v-model="addStaffScoreLogModel.action" :label="false">减少</el-radio>
                </el-form-item>
                <el-form-item label="变更分数" prop="changeScore">
                    <el-input v-model="addStaffScoreLogModel.changeScore"></el-input>
                </el-form-item>
                <el-form-item label="变更原因" prop="reason">
                    <el-input v-model="addStaffScoreLogModel.reason"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="closeDialog('addForm')">取 消</el-button>
                    <el-button type="primary" @click="addScoreLog">确 认</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 查看培训模态框 -->
        <el-dialog title="培训详情" v-model="detailDialogVisible">
            <el-form :model="dataModel" ref="detailForm" :disable="true">
                <el-form-item label="培训名称" prop="trainName">
                    <el-input v-model="dataModel.trainName"></el-input>
                </el-form-item>
                <el-form-item label="培训内容" prop="trainContent">
                    <el-input type="textarea" v-model="dataModel.trainContent"></el-input>
                </el-form-item>
                <el-form-item label="发布时间" prop="createTime">
                    <el-input v-model="dataModel.createTime"></el-input>
                </el-form-item>
                <el-form-item label="上传人ID" prop="createUserId">
                    <el-input v-model="dataModel.createUserId"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="closeDialog('detailForm')">取 消</el-button>
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

                // 发布培训
                addDialogVisible: false,
                addStaffScoreLogModel: {
                    action: true,
                    changeScore: '',
                    reason: '',
                    userId: null,
                },
                rules: {
                    changeScore: [{
                        validator: (rule, value, callback) => {
                            if (!value) {
                                callback(new Error('分数变更不能为空'))
                            } else {
                                if (parseFloat(value) == 0) {
                                    callback(new Error('分数不能为0'))
                                } else if (!this.isNumber(value)) {
                                    callback(new Error('请输入2位以内的小数'))
                                } else {
                                    callback()
                                }
                            }
                        },
                        trigger: 'blur'
                    }]
                },

                // 培训详情
                detailDialogVisible: false,
                dataModel: null,

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
                this.getRequest("/manager/staffTrain/all/" + pageNo + "/" + pageSize).then((resp) => {
                    this.tableData = resp.records;
                    this.total = resp.total;
                    this.pageCount = resp.pages;
                });
            },
            openScoreDetail(row) {
                this.getRequest("/manager/staffTrain/" + row.id).then((resp) => {
                    this.dataModel = resp.data;
                    this.detailDialogVisible = true;
                });
            },
            openAddScoreLog(row) {
                console.log(1);
                this.addDialogVisible = true;
            },
            addScoreLog() {
                this.postRequest("/manager/staffScoreLog", this.addStaffScoreLogModel).then((resp) => {
                    console.log(resp);
                    this.setStaffScore(this.currentUserId);
                    this.$refs.addScoreLogFormRef.resetFields();
                });
            },
            closeDialog(form) {
                this.addDialogVisible = false;
                this.detailDialogVisible = false;
                //清空表单
                this.$refs[form].resetFields();
                this.fileList = [];
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