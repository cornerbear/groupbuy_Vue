<!--
    @Author  :   zhangxiaojian
    @Time    :   2021/04/20 15:40:00
 -->
<template>
    <div>
        <el-table :data="tableData" border style="width: 100%" :fit="true">
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
                    <el-button @click="deleteGoodsFromCommunity(scope.row)" type="text" size="small">从社区删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
            :page-sizes="[5, 10, 20]" :page-size="5" layout="total, sizes, prev, pager, next, jumper" :total="total"
            :page-count="pageCount">
        </el-pagination>


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

                fit: 'fill',
            }
        },
        methods: {
            addGoodsToCart(row) {
                this.postRequest("/user/cart/" + row.id).then((resp) => {
                    if (resp.success) {
                        this.getTableData(this.pageNo, this.pageSize);
                    }
                });
            },
            deleteGoodsFromCommunity(row) {
                this.$confirm('确认从社区删除该商品?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/grouper/goods/deleteCommunityGoods/" + row.id).then((resp) => {
                        if (resp.success) {
                            this.getTableData(this.pageNo, this.pageSize);
                        }
                    });
                }).catch(() => {
                    this.message.info("已取消删除");
                });

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

                this.getRequest("/user/goods/all/" + pageNo + "/" + pageSize + "/" + this.select).then((resp) => {
                    if (this.select) {
                        this.selected.tableData = resp.records;
                        this.selected.tableData.forEach(element => {
                            element.goodsImg = '/file/image?filePath=' + encodeURI(element.goodsImg);
                        })
                        this.selected.total = resp.total;
                        this.selected.pageCount = resp.pages;
                    } else {

                        this.unselected.tableData = resp.records;
                        this.unselected.tableData.forEach(element => {
                            element.goodsImg = '/file/image?filePath=' + encodeURI(element.goodsImg);
                        })
                        this.unselected.total = resp.total;
                        this.unselected.pageCount = resp.pages;
                    }
                });
            },
            changeTab(tab, event) {
                console.log(tab.props.name);
                if (tab.props.name == 'selectedGoods') {
                    this.select = true;
                } else {
                    this.select = false;
                }
                this.getTableData(this.pageNo, this.pageSize);
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        },
        created() {
            this.select = true;
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