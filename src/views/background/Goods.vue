<!--
    @Author  :   zhangxiaojian
    @Time    :   2021/03/08 10:15:00
 -->
<template>
    <div>
        <el-table :data="tableData" border style="width: 100%">
            <!-- <el-table-column fixed prop="date" label="日期" width="150">
            </el-table-column> -->
            <el-table-column prop="goodsImg" label="图片" width="120">
            </el-table-column>
            <el-table-column prop="goodsName" label="名称" width="120">
            </el-table-column>
            <el-table-column prop="goodsPrice" label="价格" width="120">
            </el-table-column>
            <el-table-column prop="goodsStock" label="库存" width="120">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
                <template #default="scope">
                    <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                    <el-button type="text" size="small">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
            :page-sizes="[5, 10, 20]" :page-size="5" layout="total, sizes, prev, pager, next, jumper" :total="total"
            :page-count="pageCount">
        </el-pagination>

        <!-- 添加商品模态框 -->
        <el-button type="text" @click="dialogFormVisible = true">添加商品</el-button>
        <el-dialog title="商品信息" v-model="dialogFormVisible">
            <el-form :model="formModel" ref="form" :rules="rules">
                <el-form-item label="商品名称" prop="goodsName" :label-width="formLabelWidth">
                    <el-input v-model="formModel.goodsName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="商品价格" prop="goodsPrice" :label-width="formLabelWidth">
                    <el-input v-model="formModel.goodsPrice" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="商品库存" prop="goodsStock" :label-width="formLabelWidth">
                    <el-input v-model="formModel.goodsStock" autocomplete="off"></el-input>
                </el-form-item>
                <!-- <el-form-item label="商品库存" :label-width="formLabelWidth">
                    <el-select v-model="form.goodsStock" placeholder="请选择活动区域">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item> -->
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submitForm('form')">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>

    const axios = require('axios').default;

    export default {
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
                axios.get("/admin/goods/all/" + pageNo + "/" + pageSize).then((resp) => {
                    console.log(resp);
                    this.tableData = resp.data.records;
                    this.total = resp.data.total;
                    this.pageCount = resp.data.pages;
                })
                    .catch((error) => {
                        console.log(error);
                    });
            },


            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        console.log(this.formModel);
                        axios.post("/admin/goods", this.formModel).then((resp) => {
                            console.log(resp.data);
                            if (resp.data.success) {
                                this.dialogFormVisible = false;
                                this.$message(resp.data.msg);
                            } else {
                                this.$message(resp.data.msg);
                            }
                        })
                            .catch((error) => {
                                console.log(error);
                            });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        },
        created() {
            this.getTableData(this.pageNo, this.pageSize);
        },
        data() {
            return {
                total: null,
                tableData: null,
                pageCount: null,
                currentPage: null,
                pageNo: 1,
                pageSize: 5,
                dialogFormVisible: false,
                formModel: {
                    goodsName: '',
                    goodsPrice: '',
                    goodsStock: '',
                },
                rules: {
                    goodsName: [
                        { required: true, message: '请填写商品名称', trigger: 'blur' },
                        { min: 3, max: 5, message: '长度在3-5个字符之间', trigger: 'blur' }
                    ]
                },
                formLabelWidth: '120px'
            }
        }
    }
</script>