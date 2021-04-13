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
                    <el-button @click="openScore(scope.row)" type="text" size="small">查看奖惩</el-button>
                    <el-button @click="deleteStaff(scope.row)" type="text" size="small">删除员工</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
            :page-sizes="[5, 10, 20]" :page-size="5" layout="total, sizes, prev, pager, next, jumper" :total="total"
            :page-count="pageCount">
        </el-pagination>

        <!-- 新增员工模态框 -->
        <el-dialog title="新增员工" v-model="addDialogVisible">

            <!-- 选择器 -->
            <el-select @change="changeAddMode" v-model="value" placeholder="请选择新增方式">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>

            <el-form :model="addStaffModel" ref="addForm" v-if="addStaffMode == 0">
                <el-form-item label="员工ID" prop="userId">
                    <el-input v-model="addStaffModel.userId"></el-input>
                </el-form-item>
            </el-form>

            <!-- 上传文件  -->
            <el-upload class="upload-demo" ref="upload" action="/manager/staff/batch" :on-preview="handlePreview"
                :on-change="handleChange" :on-remove="handleRemove" :file-list="fileList" :auto-upload="false"
                :http-request="uploadFile" v-if="addStaffMode == 1">
                <template #trigger>
                    <el-button size="small" type="primary">选取文件</el-button>
                </template>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload" v-show="false">发
                    布
                </el-button>
                <template #tip>
                    <div class="el-upload__tip">
                        只能上传 xls/xlsx 文件，且不超过 100MB
                    </div>
                </template>
            </el-upload>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="closeDialog('addForm')">取 消</el-button>
                    <el-button type="primary" @click="submitUpload">确认新增</el-button>
                </span>
            </template>
        </el-dialog>

        <el-drawer title="积分详情" v-model="scoreVisible" direction="rtl" size="50%">
            <div>
                <div style="margin: 3px;">
                    <el-card>
                        当前用户ID<el-tag type="success">{{currentUserId}}</el-tag>
                        用户名<el-tag type="success">{{currentUsername}}</el-tag>总评分<el-tag type="success">
                            {{currentUserScore}}
                        </el-tag>
                    </el-card>

                    <el-button type="primary" plain @click="innerScoreVisible=true">
                        添加奖惩记录
                    </el-button>
                </div>

                <el-table :data="scoreData">
                    <el-table-column prop="changeScore" label="分数变化"></el-table-column>
                    <el-table-column prop="reason" label="原因"></el-table-column>
                    <el-table-column prop="logTime" label="日期"></el-table-column>
                    <el-table-column prop="actionUserId" label="操作人ID"></el-table-column>
                </el-table>

                <el-drawer title="添加奖惩记录" :before-close="handleClose" v-model="innerScoreVisible" :append-to-body="true"
                    ref="drawer">
                    <div>
                        <el-form :rules="rules" :model="addStaffScoreLogModel" ref="addScoreLogFormRef">
                            <el-form-item label="是否启用" prop="action">
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
                        <div class="demo-drawer__footer">
                            <el-button @click="cancelForm">取 消</el-button>
                            <el-button type="primary" @click="$refs.drawer.handleClose()" :loading="loading">{{ loading
                                ? '提交中 ...' : '确 定' }}</el-button>
                        </div>
                    </div>
                </el-drawer>
            </div>
        </el-drawer>
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

                // 新增员工
                options: [{
                    value: '0',
                    label: '单独新增'
                }, {
                    value: '1',
                    label: '批量新增'
                }],
                value: '',
                addDialogVisible: false,
                addStaffMode: 0,
                addStaffModel: {
                    userId: null,
                },
                // 文件上传
                fileData: '', // 文件上传数据（多文件合一）
                fileList: [],  // upload多文件数组

                // 员工评分详情
                scoreVisible: false,
                scoreData: null,
                currentUserId: '',
                currentUsername: '',
                currentUserScore: '',
                innerScoreVisible: false,
                addStaffScoreLogModel: {
                    action: true,
                    changeScore: '',
                    reason: '',
                    userId: null,
                },
                loading: false,
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
            }
        },
        methods: {
            changeAddMode(val) {
                console.log(val);
                this.addStaffMode = val;
            },
            uploadFile(file) {
                this.fileData.append('files', file.file); // append增加数据
            },
            submitUpload() {
                if (this.addStaffMode == 0) {
                    // 单独新增
                    this.postRequest("/manager/staff/singleAdd/" + this.addStaffModel.userId).then((resp) => {
                        if (resp.success) {
                            console.log(resp);
                            this.addDialogVisible = false;
                            //清空表单
                            this.$refs['addForm'].resetFields();
                            this.getTableData(this.pageNo, this.pageSize);
                        }
                    });
                } else if (this.addStaffMode == 1) {
                    const isLt100M = this.fileList.every(file => file.size / 1024 / 1024 < 100);
                    if (!isLt100M) {
                        this.$message.error('请检查，上传文件大小不能超过100MB!');
                    } else {
                        this.fileData = new FormData(); // new formData对象
                        this.$refs.upload.submit(); // 提交调用uploadFile函数

                        this.postRequest("/manager/staff/batchAdd", this.fileData).then((resp) => {
                            if (resp.success) {
                                this.message.warning("其中" + resp.data + "已存在");
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

            deleteStaff(row) {
                this.$confirm('此操作只会删除该培训员工的员工身份, 是否继续?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/manager/staff/" + row.userId).then((resp) => {
                        this.getTableData(this.pageNo, this.pageSize);
                    });
                }).catch(() => {
                    this.message.info("已取消删除");
                });

            },

            openScore(row) {
                this.currentUsername = row.username;
                this.currentUserId = row.userId;
                this.setStaffScore(row.userId);
            },
            setStaffScore(id) {
                Promise.all([
                    //查询积分
                    new Promise((resolve, reject) => {
                        this.getRequest("/manager/staffScore/" + id).then((resp) => {
                            this.currentUserScore = resp.data.score;
                            resolve(resp)
                        });
                    }),
                    //查询积分记录
                    new Promise((resolve, reject) => {
                        this.getRequest("/manager/staffScoreLog/" + id).then((resp) => {
                            for(var i = 0; i < resp.data.length; i++){
                                if(resp.data[i].action){
                                    resp.data[i].changeScore = "增加"+resp.data[i].changeScore;
                                } else {
                                    resp.data[i].changeScore = "减少"+resp.data[i].changeScore;
                                }
                            }
                            this.scoreData = resp.data;
                            resolve(resp)
                        });
                    }),
                ]).then(resp => {
                    //是一个数组，里边的res[index]值就是两个不同的请求返回的结果
                    if (resp[0].success && resp[1].success) {
                        this.scoreVisible = true;
                    }
                })
            },

            handleClose(done) {
                if (this.loading) {
                    return;
                }
                console.log(1);
                this.$confirm('确认保存?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    console.log(2);
                    this.$refs.addScoreLogFormRef.validate((valid) => {
                        if (valid) {
                            console.log(3);
                            this.loading = true;
                            this.addStaffScoreLogModel.userId = this.currentUserId;
                            this.timer = setTimeout(() => {
                                this.postRequest("/manager/staffScoreLog", this.addStaffScoreLogModel).then((resp) => {
                                    console.log(resp);
                                    this.setStaffScore(this.currentUserId);
                                    done();
                                    this.loading = false;
                                    //清空表单
                                    this.$refs.addScoreLogFormRef.resetFields();
                                });
                            }, 2000);
                        } else {
                            return false;
                        }
                    });
                }).catch(() => {
                    this.message.info("已取消添加，若不保存请点击取消");
                });
            },
            saveStaffScoreLog() {

            },
            cancelForm() {
                this.loading = false;
                this.dialog = false;
                clearTimeout(this.timer);
            },
            isNumber(val) {
                var regPos = /^\d+(\.\d{1,2})?$/
                // var regPos = /^\d+(\.\d+)?$/
                // var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/
                // || regNeg.test(val)
                if (regPos.test(val)) {
                    return true
                } else {
                    return false
                }
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