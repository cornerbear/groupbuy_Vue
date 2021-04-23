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
            <el-table-column prop="id" label="订单号"></el-table-column>
            <el-table-column prop="consignee" label="收货人"></el-table-column>
            <el-table-column prop="address" label="地址"></el-table-column>
            <el-table-column prop="phone" label="电话"></el-table-column>
            <el-table-column prop="userNote" label="用户备注"></el-table-column>
            <el-table-column prop="goodsPrice" label="商品价格"></el-table-column>
            <el-table-column prop="payPrice" label="支付金额"></el-table-column>
            <el-table-column prop="createTime" label="创建时间"></el-table-column>
            <el-table-column prop="orderStatus" label="订单状态"></el-table-column>
            <el-table-column fixed="right" label="操作">
                <template #default="scope">
                    <el-button v-if="scope.row.orderStatus==='正在配货'" @click="openDeliver(scope.row)" type="text"
                        size="small">发货</el-button>
                    <el-button @click="orderDetail(scope.row)" type="text" size="small">订单详情</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="table.currentPage" :page-sizes="[5, 10, 20]" :page-size="5"
            layout="total, sizes, prev, pager, next, jumper" :total="table.total" :page-count="table.pageCount">
        </el-pagination>


        <!-- 发货模态框 -->
        <el-dialog title="发货" v-model="visible.shipping">
            <el-form :model="model.shipping" ref="form">
                <el-form-item label="快递名称" prop="shippingName">
                    <el-input v-model="model.shipping.shippingName"></el-input>
                </el-form-item>
                <el-form-item label="快递单号" prop="shippingCode">
                    <el-input v-model="model.shipping.shippingCode"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="visible.shipping = false">取 消</el-button>
                    <el-button type="primary" @click="deliver">确认发货</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                table: {
                    records: null,
                    currentPage: null,
                    total: null,
                    pageCount: null,
                },
                pageNo: 1,
                pageSize: 5,
                model: {
                    shipping: {
                        orderId: '',
                        shippingName: '',
                        shippingCode: '',
                    }
                },
                visible: {
                    shipping: false,
                },

                fit: 'fill',
            }
        },
        methods: {
            openDeliver(row) {
                this.model.shipping.orderId = row.id;
                this.visible.shipping = true;
            },
            deliver() {
                this.putRequest("/store/order/deliver" , this.model.shipping).then((resp) => {
                    if (resp.success) {
                        this.getTableData(this.pageNo, this.pageSize);
                        this.visible.shipping = false;
                    }
                });
            },
            cancelOrder() {
                this.$confirm('确认取消订单?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(() => {
                    this.putRequest("/user/order/cancelOrder/" + row.id).then((resp) => {
                        if (resp.success) {
                            this.getTableData(this.pageNo, this.pageSize);
                        }
                    });
                }).catch(() => {
                    this.message.info("关闭");
                });
            },
            viewLogistics() {

            },
            confirmReceive() {

            },
            evaluate() {

            },
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

            handleSizeChange(pageSize) {
                this.pageSize = pageSize;
                this.getTableData(this.pageNo, this.pageSize)
            },
            handleCurrentChange(pageNo) {
                this.pageNo = pageNo;
                this.getTableData(this.pageNo, this.pageSize)
            },
            getTableData(pageNo, pageSize) {
                this.getRequest("/store/order/all/" + pageNo + "/" + pageSize).then((resp) => {
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