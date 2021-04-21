<!--
    @Author  :   zhangxiaojian
    @Time    :   2021/04/20 15:40:00
 -->
<template>
    <div>
        <div class="header">
            <el-card>
                购物车总价<el-tag type="success">{{cart.totalPrice}}</el-tag>
                商品数量<el-tag type="success">{{cart.goodsNum}}</el-tag>
                <el-button type="primary" plain @click="createOrder" style="float:right;">
                    生成订单
                </el-button>
            </el-card>
        </div>
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
            <el-table-column prop="goodsNum" label="数量">
            </el-table-column>
            <el-table-column prop="goodsUnit" label="单位">
            </el-table-column>
            <el-table-column fixed="right" label="操作">
                <template #default="scope">
                    <el-button @click="removeGoodsFromCart(scope.row)" type="text" size="small">从购物车删除
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
                cart: {
                    totalPrice: 0,
                    goodsNul: 0,
                },
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
            createOrder() {
                this.$confirm('确认生成订单?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(() => {
                    this.postRequest("/user/order").then((resp) => {
                        if (resp.success) {
                            this.getTableData(this.pageNo, this.pageSize);
                        }
                    });
                }).catch(() => {
                    this.message.info("已取消生成");
                });
            },
            removeGoodsFromCart(row) {
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

                this.getRequest("/user/cart/all/" + pageNo + "/" + pageSize).then((resp) => {
                    this.cart = resp.data;
                    this.tableData = resp.data.cartItems.records;
                    this.tableData.forEach(element => {
                        element.goodsImg = '/file/image?filePath=' + encodeURI(element.goodsImg);
                    })
                    this.total = resp.data.cartItems.total;
                    this.pageCount = resp.data.cartItems.pages;
                });
            },
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
</style>