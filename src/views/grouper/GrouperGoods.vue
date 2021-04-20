<!--
    @Author  :   zhangxiaojian
    @Time    :   2021/04/20 15:40:00
 -->
<template>
    <div>
        <el-tabs v-model="activeTab" type="border-card" @tab-click="changeTab">

            <!-- 已选入社区的商品 -->
            <el-tab-pane label="社区商品" name="selectedGoods">
                <el-table :data="selected.tableData" border style="width: 100%" :fit="true">
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

                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="selected.currentPage" :page-sizes="[5, 10, 20]" :page-size="5"
                    layout="total, sizes, prev, pager, next, jumper" :total="selected.total"
                    :page-count="selected.pageCount">
                </el-pagination>
            </el-tab-pane>


            <!-- 未选入社区的商品 -->
            <el-tab-pane name="unselectedGoods">
                <template #label>
                    <span><i class="el-icon-date"></i>选择商城</span>
                </template>

                <el-table :data="unselected.tableData" border style="width: 100%" :fit="true">
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
                            <el-button @click="addGoodsToCommunity(scope.row)" type="text" size="small">加入社区</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="unselected.currentPage" :page-sizes="[5, 10, 20]" :page-size="5"
                    layout="total, sizes, prev, pager, next, jumper" :total="unselected.total"
                    :page-count="unselected.pageCount">
                </el-pagination>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                unselected: {
                    total: null,
                    tableData: null,
                    pageCount: null,
                    currentPage: null,
                },
                selected: {
                    total: null,
                    tableData: null,
                    pageCount: null,
                    currentPage: null,
                },
                pageNo: 1,
                pageSize: 5,
                
                activeTab: 'selectedGoods',
                // 用于区分两个标签页
                select: true,
                fit: 'fill',
            }
        },
        methods: {
            addGoodsToCommunity(row) {
                this.postRequest("/grouper/goods/addCommunityGoods/" + row.id).then((resp) => {
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

                this.getRequest("/grouper/goods/all/" + pageNo + "/" + pageSize + "/" + this.select).then((resp) => {
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

    .el-form-item {
        height: 100%;
        width: 100%;
    }
</style>