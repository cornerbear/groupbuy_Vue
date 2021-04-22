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
                <el-button type="primary" plain @click="openCreateOrder" style="float:right;">
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


        <!-- 生成订单模态框 -->
        <el-dialog title="生成订单" v-model="visible.add">
            <el-form :model="model.addModel" ref="form" :rules="rules">
                <el-form-item label="收货人" prop="consignee">
                    <el-input v-model="model.addModel.consignee"></el-input>
                </el-form-item>
                <el-form-item label="地址" prop="address">
                    <el-input v-model="model.addModel.address"></el-input>
                </el-form-item>
                <el-form-item label="商品价格" prop="goodsPrice">
                    <el-input v-model="model.addModel.goodsPrice" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="需支付价格" prop="payPrice">
                    <el-input v-model="model.addModel.payPrice" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="userNote">
                    <el-input type="textarea" v-model="model.addModel.userNote"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="visible.add = false">取 消</el-button>
                    <el-button type="primary" @click="createOrder()">确认生成订单</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                cart: {
                    totalPrice: 0,
                    goodsNum: 0,
                },
                total: null,
                tableData: null,
                pageCount: null,
                currentPage: null,
                pageNo: 1,
                pageSize: 5,

                fit: 'fill',

                visible: {
                    add: false,
                },
                model: {
                    addModel: {
                        consignee: '',
                        address: '',
                        goodsPrice: '',
                        payPrice: '',
                        userNote: '',
                    },
                },
            }
        },
        methods: {
            openCreateOrder() {
                this.getRequest("/user/cart/checkHaveGoods").then((resp) => {
                    if (resp.success) {
                        this.getRequest("/user/order/createOrderDetail").then((resp) => {
                            if (resp.success) {
                                this.model.addModel = resp.data;
                                // this.model.addModel
                                // this.model.addModel.goodsPrice = resp.data.goodsPrice;
                                // this.model.addModel.payPrice = resp.data.payPrice;
                                this.visible.add = true;
                            }
                        });
                    }
                });

            },
            createOrder() {
                this.$confirm('确认生成订单?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(() => {
                    this.postRequest("/user/order", this.model.addModel).then((resp) => {
                        if (resp.success) {
                            this.getTableData(this.pageNo, this.pageSize);
                        }
                    });
                }).catch(() => {
                    this.message.info("已取消生成");
                });
            },
            removeGoodsFromCart(row) {
                this.$confirm('确认从购物车删除该商品?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/user/cart/" + row.id).then((resp) => {
                        if (resp.success) {
                            this.getTableData(this.pageNo, this.pageSize);
                            this.visible.add = false;
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
                    this.cart = resp.data.cart;
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