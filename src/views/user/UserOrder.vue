<!--
    @Author  :   zhangxiaojian
    @Time    :   2021/04/23 15:40:00
 -->
<template>
    <div>
        <div class="header">
            <el-card>
                <!-- 购物车总价<el-tag type="success">{{cart.totalPrice}}</el-tag>
                商品数量<el-tag type="success">{{cart.goodsNum}}</el-tag>
                <el-button type="primary" plain @click="createOrder" style="float:right;">
                    生成订单
                </el-button> -->
            </el-card>
        </div>
        <el-table :data="table.records" border style="width: 100%" :fit="true">
            <el-table-column prop="id" label="订单号">
            </el-table-column>
            <el-table-column prop="storeName" label="商家名称">
            </el-table-column>
            <el-table-column prop="goodsPrice" label="商品价格">
            </el-table-column>
            <el-table-column prop="payPrice" label="支付金额">
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间">
            </el-table-column>
            <el-table-column prop="orderStatus" label="订单状态">
            </el-table-column>
            <el-table-column fixed="right" label="操作">
                <template #default="scope">
                    <el-button v-if="scope.row.orderStatus==='等待到款'" @click="payForOrder(scope.row)" type="text" size="small">去支付</el-button>
                    <el-button v-if="scope.row.orderStatus==='等待到款'" @click="cancelOrder(scope.row)" type="text" size="small">取消订单</el-button>
                    <el-button v-if="scope.row.orderStatus==='已发货'" @click="viewLogistics(scope.row)" type="text" size="small">查看物流</el-button>
                    <el-button v-if="scope.row.orderStatus==='已送达'" @click="confirmReceive(scope.row)" type="text" size="small">确认收货</el-button>
                    <el-button v-if="scope.row.orderStatus==='交易成功'" @click="evaluate(scope.row)" type="text" size="small">评价</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="table.currentPage" :page-sizes="[5, 10, 20]" :page-size="5"
            layout="total, sizes, prev, pager, next, jumper" :total="table.total" :page-count="table.pageCount">
        </el-pagination>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                table: {
                    records:null,
                    currentPage:null,
                    total:null,
                    pageCount:null,
                },
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

                this.getRequest("/user/order/all/" + pageNo + "/" + pageSize).then((resp) => {
                    this.table = resp;
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