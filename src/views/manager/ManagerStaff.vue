<!--
    @Author  :   zhangxiaojian
    @Time    :   2021/03/28 10:15:00
 -->
 <template>
    <div>

        <div class="header">
            <el-card>
                <el-button type="primary" plain @click="addDialogVisible=true">
                    新增员工
                </el-button>
            </el-card>
        </div>

        <el-table :data="tableData" border style="width: 100%" :fit="true">
            <el-table-column prop="userId" label="用户ID">
            </el-table-column>
            <el-table-column prop="username" label="用户名">
            </el-table-column>
            <el-table-column prop="name" label="姓名">
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

        <!-- 新增员工模态框 -->
        <el-dialog title="新增员工" v-model="addDialogVisible">
            <el-form :model="addDataModel" ref="addForm">
                <el-form-item label="培训名称" prop="trainName">
                    <el-input v-model="addDataModel.trainName"></el-input>
                </el-form-item>
                <el-form-item label="培训内容" prop="trainContent">
                    <el-input type="textarea" v-model="addDataModel.trainContent"></el-input>
                </el-form-item>

                <!-- 上传文件  -->
                <el-upload class="upload-demo" ref="upload" action="/manager/staffTrain/upload"
                    :on-preview="handlePreview" :on-change="handleChange" :on-remove="handleRemove"
                    :file-list="fileList" :auto-upload="false" :data="addDataModel" :on-success="handleSuccess"
                    :http-request="uploadFile">
                    <template #trigger>
                        <el-button size="small" type="primary">选取文件</el-button>
                    </template>
                    <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload"
                        v-show="false">发 布
                    </el-button>
                    <template #tip>
                        <div class="el-upload__tip">
                            只能上传 jpg/png 文件，且不超过 500kb
                        </div>
                    </template>
                </el-upload>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="closeDialog('addForm')">取 消</el-button>
                    <el-button type="primary" @click="submitUpload">发 布</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 查看员工模态框 -->
        <el-dialog title="员工详情" v-model="detailDialogVisible">
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
        name: "ManagerTrain",
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
                addDataModel: {
                    trainName: '',
                    trainContent: '',
                },
                // 文件上传
                fileData: '', // 文件上传数据（多文件合一）
                fileList: [],  // upload多文件数组


                // 培训详情
                detailDialogVisible: false,
                dataModel: null,
            }
        },
        methods: {
            uploadFile(file) {
                this.fileData.append('files', file.file); // append增加数据
            },
            submitUpload() {
                if (this.addDataModel.trainName === '') {
                    this.message({
                        message: '请输入培训名称',
                        type: 'warning'
                    })
                } else {
                    const isLt100M = this.fileList.every(file => file.size / 1024 / 1024 < 100);
                    if (!isLt100M) {
                        this.$message.error('请检查，上传文件大小不能超过100MB!');
                    } else {
                        this.fileData = new FormData(); // new formData对象
                        this.$refs.upload.submit(); // 提交调用uploadFile函数
                        this.fileData.append('trainName', this.addDataModel.trainName); // 添加培训名称
                        this.fileData.append('trainContent', this.addDataModel.trainContent); // 添加培训内容

                        this.postRequest("/manager/staffTrain/upload", this.fileData).then((resp) => {
                            if (resp.success) {
                                this.fileList = [];
                                this.addDialogVisible = false;
                                //清空表单
                                this.$refs['addForm'].resetFields();
                                this.getTableData(this.pageNo, this.pageSize);
                            }
                        });
                    }
                }
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
            },
            //监控上传文件列表
            handleChange(file, fileList) {
                let existFile = fileList.slice(0, fileList.length - 1).find(f => f.name === file.name);
                if (existFile) {
                    this.message.error('当前文件已经存在!');
                    fileList.pop();
                }
                this.fileList = fileList;
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
                this.getRequest("/manager/staff/all/" + pageNo + "/" + pageSize).then((resp) => {
                    this.tableData = resp.records;
                    this.total = resp.total;
                    this.pageCount = resp.pages;
                });
            },
            openDetail(row) {
                this.getRequest("/manager/staff/" + row.id).then((resp) => {
                    this.dataModel = resp.data;
                    this.detailDialogVisible = true;
                });
            },
            deleteTrain(row) {
                console.log(1);
                this.$confirm('此操作只会删除该培训员工的员工身份, 是否继续?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/manager/staff/" + row.id).then((resp) => {
                        this.getTableData(this.pageNo, this.pageSize);
                    });
                }).catch(() => {
                    this.message.info("已取消删除");
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