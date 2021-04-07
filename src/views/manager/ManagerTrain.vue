<!--
    @Author  :   zhangxiaojian
    @Time    :   2021/03/28 10:15:00
 -->
<template>
    <div>

        <div class="header">
            <el-card>
                <el-button type="primary" plain @click="addDialogVisible=true">
                    新增培训
                </el-button>
            </el-card>
        </div>

        <!-- 新增培训模态框 -->
        <el-dialog title="发布培训" v-model="addDialogVisible">
            <el-form :model="dataModel" ref="addForm" :rules="rules">
                <el-form-item label="培训名称" prop="trainName">
                    <el-input v-model="dataModel.trainName"></el-input>
                </el-form-item>
                <el-form-item label="培训内容" prop="trainContent">
                    <el-input type="textarea" v-model="dataModel.trainContent"></el-input>
                </el-form-item>

                <!-- 上传文件  -->
                <el-upload class="upload-demo" ref="upload" action="/manager/staffTrain/upload"
                    :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList" :auto-upload="false"
                    :data="dataModel">
                    <template #trigger>
                        <el-button size="small" type="primary">选取文件</el-button>
                    </template>
                    <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload" v-show="false">发 布
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
                    <el-button @click="addDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submitUpload()">发 布</el-button>
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
                addDialogVisible: false,
                dataModel: {
                    trainName: '',
                    trainContent: '',
                },
            }
        },
        created() {
        },
        methods: {
            submitUpload() {
                this.$refs.upload.submit();
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
            }
        },
    }
</script>
<style>
    .header {
        margin-bottom: 5px;
    }
</style>