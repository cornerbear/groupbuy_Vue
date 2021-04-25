<!--
    @Author  :   zhangxiaojian
    @Time    :   2021/04/10 10:15:00
 -->
 <template>
    <div>

        <el-table :data="tableData" border style="width: 100%" :fit="true">
            <!-- <el-table-column fixed prop="date" label="日期" width="150">
            </el-table-column> -->
            <el-table-column prop="trainName" label="培训名称">
            </el-table-column>
            <el-table-column prop="trainName" label="培训名称">
            </el-table-column>
            <el-table-column prop="trainContent" label="培训内容">
            </el-table-column>
            <el-table-column prop="createTime" label="发布时间">
            </el-table-column>
            <el-table-column fixed="right" label="操作">
                <template #default="scope">
                    <el-button @click="openDetail(scope.row)" type="text" size="small">查看</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
            :page-sizes="[5, 10, 20]" :page-size="5" layout="total, sizes, prev, pager, next, jumper" :total="total"
            :page-count="pageCount">
        </el-pagination>

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
                <el-form-item label="文件列表" prop="createUserId">
                    <ul id="example-1">
                        <li v-for="item in dataModel.files" :key="item.id">
                            <a :href="['/manager/staffTrain/download?trainFileId='+item.id]">{{ item.filePath }}</a>
                        </li>
                    </ul>
                    <!-- <el-input v-for="item in dataModel.files" :key="item.id" ></el-input> -->
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
        name: "MyTrain",
        data() {
            return {
                total: null,
                tableData: null,
                pageCount: null,
                currentPage: null,
                pageNo: 1,
                pageSize: 5,

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
            openDetail(row) {
                this.getRequest("/manager/staffTrain/" + row.id).then((resp) => {
                    this.dataModel = resp.data;
                    this.detailDialogVisible = true;
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