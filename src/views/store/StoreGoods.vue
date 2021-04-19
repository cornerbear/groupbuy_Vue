<!--
    @Author  :   zhangxiaojian
    @Time    :   2021/04/18 15:40:00
 -->
<template>
    <div>
        <div class="header">
            <el-card>
                <el-button type="primary" plain @click="visible.add=true">
                    添加商品
                </el-button>
            </el-card>
        </div>
        <el-table :data="tableData" border style="width: 100%" :fit="true">
            <!-- <el-table-column fixed prop="date" label="日期" width="150">
            </el-table-column> -->
            <el-table-column prop="goodsImg" label="图片">
                <template #default="scope">
                    <el-image :fit="fit" style="width:80px;height:80px" :src="scope.row.goodsImg"></el-image>
                </template>
            </el-table-column>
            <el-table-column prop="goodsName" label="名称">
            </el-table-column>
            <el-table-column prop="goodsPrice" label="价格">
            </el-table-column>
            <el-table-column prop="goodsStock" label="库存">
            </el-table-column>
            <el-table-column fixed="right" label="操作">
                <template #default="scope">
                    <el-button @click="openUpdate(scope.row)" type="text" size="small">设置详细信息</el-button>
                    <el-button @click="deleteGoods(scope.row)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
            :page-sizes="[5, 10, 20]" :page-size="5" layout="total, sizes, prev, pager, next, jumper" :total="total"
            :page-count="pageCount">
        </el-pagination>

        <!-- 添加商品模态框 -->
        <el-dialog title="商品信息" v-model="visible.add">
            <el-form :model="model.addModel" ref="form" :rules="rules">
                <el-form-item label="商品名称" prop="goodsName">
                    <el-input v-model="model.addModel.goodsName"></el-input>
                </el-form-item>
                <el-form-item label="商品价格" prop="goodsPrice">
                    <el-input v-model="model.addModel.goodsPrice"></el-input>
                </el-form-item>
                <el-form-item label="商品库存" prop="goodsStock">
                    <el-input v-model="model.addModel.goodsStock"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="visible.add = false">取 消</el-button>
                    <el-button type="primary" @click="addGoods('form')">确认添加</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 修改商品模态框 -->
        <el-dialog title="商品信息" v-model="visible.update">
            <el-form :model="model.updateModel" ref="updateRef" :rules="rules" label-width="100px">
                <el-row>
                    <el-col :span="12">
                        <div>
                            <!-- 旧图 -->
                            <el-image style="width: 100px; height: 100px;float: left;" :src="imgUrl" :fit="fit">
                            </el-image>
                            <!-- 新图 -->
                            <el-upload ref="uploadPic" action="/api/upload" list-type="picture-card"
                                :class="{ disabled: uploadDisabled }" :limit="1" :on-change="handleChange"
                                :on-remove="handleRemove" :show-file-list="true" :auto-upload="false"
                                :file-list="fileList" :data="model.updateModel" :http-request="uploadFile"
                                :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                                <el-image style="width: 100px; height: 100px;" :fit="fit" v-if="imageUrl"
                                    :src="imageUrl" class="avatar"></el-image>
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <el-row>
                            <el-col>
                                <el-form-item label="商品名称" prop="goodsName">
                                    <el-input v-model="model.updateModel.goodsName"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col>
                                <el-form-item label="简单描述" prop="goodsEasyDesc">
                                    <el-input v-model="model.updateModel.goodsEasyDesc"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="商品价格" prop="goodsPrice">
                            <el-input v-model="model.updateModel.goodsPrice"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="库存" prop="goodsStock">
                            <el-input v-model="model.updateModel.goodsStock"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="重量" prop="goodsWeight">
                            <el-input v-model="model.updateModel.goodsWeight"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="单位" prop="goodsUnit">
                            <el-input v-model="model.updateModel.goodsUnit"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="是否上架" prop="isOnSale">
                            <el-radio v-model="model.updateModel.isOnSale" :label="true">是</el-radio>
                            <el-radio v-model="model.updateModel.isOnSale" :label="false">否</el-radio>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="是否包邮" prop="isFreeShipping">
                            <el-radio v-model="model.updateModel.isFreeShipping" :label="true">是</el-radio>
                            <el-radio v-model="model.updateModel.isFreeShipping" :label="false">否</el-radio>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="是否推荐" prop="isRecommend">
                            <el-radio v-model="model.updateModel.isRecommend" :label="true">是</el-radio>
                            <el-radio v-model="model.updateModel.isRecommend" :label="false">否</el-radio>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="是否新品" prop="isNew">
                            <el-radio v-model="model.updateModel.isNew" :label="true">是</el-radio>
                            <el-radio v-model="model.updateModel.isNew" :label="false">否</el-radio>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="奖励积分" prop="integral">
                            <el-input v-model="model.updateModel.integral"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12"></el-col>
                </el-row>
                <el-row>

                    <el-form-item label="详细描述" prop="goodsDesc">
                        <el-input v-model="model.updateModel.goodsDesc"></el-input>
                    </el-form-item>
                </el-row>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="visible.update = false">取 消</el-button>
                    <el-button type="primary" @click="updateGoods()">确认修改</el-button>
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
                visible: {
                    add: false,
                    update: false,
                    upload: true,
                },
                model: {
                    addModel: {
                        goodsName: '',
                        goodsPrice: '',
                        goodsStock: '',
                    },
                    updateModel: null,
                    imgUrl: '',
                },

                isUploadPic: false,
                uploadDisabled: false,
                fileData: '', // 文件上传数据（多文件合一）
                fileList: [],  // upload多文件数组
                imageUrl: null,
                fit: 'fill',
                rules: {
                    goodsName: [
                        { required: true, message: '请填写商品名称', trigger: 'blur' },
                        { min: 3, max: 5, message: '长度在3-5个字符之间', trigger: 'blur' }
                    ]
                },
            }
        },
        methods: {
            addGoods(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.postRequest("/store/goods", this.model.addModel).then((resp) => {
                            if (resp.success) {
                                this.visible.add = false;
                                this.model.addModel = this.$options.data().model.addModel;
                                this.getTableData(this.pageNo, this.pageSize);
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            deleteGoods(row) {
                this.$confirm('确认删除?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/store/goods/" + row.id).then((resp) => {
                        if (resp.success) {
                            this.getTableData(this.pageNo, this.pageSize);
                        }
                    });
                }).catch(() => {
                    this.message.info("已取消删除");
                });

            },
            openUpdate(row) {
                this.getRequest("/store/goods/" + row.id).then((resp) => {
                    if (resp.success) {
                        this.visible.update = true;
                        this.imgUrl = '/file/image?filePath=' + encodeURI(resp.data.goodsImg);
                        this.model.updateModel = resp.data;
                    }
                });
            },
            // 覆盖上传事件，选择文件之后触发的事件
            uploadFile(file) {
                this.fileData.append('files', file.file); // append增加数据
            },
            updateGoods() {
                this.fileData = new FormData(); // new formData对象
                this.$refs.uploadPic.submit(); // 提交调用uploadFile函数
                var godsJson = JSON.stringify(this.model.updateModel)
                this.fileData.append('goods', godsJson);

                this.postRequest("/store/goods/update", this.fileData).then((resp) => {
                    if (resp.success) {
                        this.fileList = [];
                        this.$refs.uploadPic.clearFiles();
                        this.visible.update = false;
                        this.getTableData(this.pageNo, this.pageSize);
                    }
                });
            },

            handleChange(file, fileList) {
                this.file = file.raw;
                this.fileName = file.name;
                if (fileList.length >= 1) {
                    this.uploadDisabled = true;
                }
            },
            handleRemove(file) {
                //imgDelete.post({pic_name : file.response.pic_name}).then();
                this.uploadDisabled = false;
            },
            handleAvatarSuccess(res, file) {
                console.log(1);
                this.imageUrl = res.data;
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === "image/jpeg";
                const isPNG = file.type === "image/png";
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG && !isPNG) {
                    this.$message.error("File type only support JPG, PNG!");
                }
                if (!isLt2M) {
                    this.$message.error("File size must lower than 2MB!");
                }
                return (isJPG || isPNG) && isLt2M;
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
                this.getRequest("/store/goods/all/" + pageNo + "/" + pageSize).then((resp) => {
                    this.tableData = resp.records;
                    this.tableData.forEach(element => {
                        element.goodsImg = '/file/image?filePath=' + encodeURI(element.goodsImg);
                    })
                    this.total = resp.total;
                    this.pageCount = resp.pages;
                });
            },

            resetForm(formName) {
                this.$refs[formName].resetFields();
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

    /* 用于上传框的隐藏 */
    .disabled .el-upload--picture-card {
        display: none !important;
    }

    .el-form-item {
        height: 100%;
        width: 100%;
    }

    .el-upload {
        width: 100px;
        height: 100px;
    }

    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 100px;
        height: 100px;
        line-height: 100px;
        text-align: center;
    }

    .avatar {
        width: 100px;
        height: 100px;
        display: block;
    }
</style>