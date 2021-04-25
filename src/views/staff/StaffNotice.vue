<!--
    @Author  :   zhangxiaojian
    @Time    :   2021/04/25 15:40:00
 -->
<template>
    <div>
        <div class="header">
            <el-card>
                <el-button size="small" icon="el-icon-close" circle @click="cancelSelect"></el-button>
                <el-select @change="changeMode" v-model="search.mode" placeholder="请选择类型">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-card>
        </div>
        <el-table :data="tableData" border style="width: 100%" :fit="true">
            <el-table-column fixed="left" label="类型" width="70px">
                <template #default="scope">
                    <i v-if="scope.row.mode==1" class="el-icon-s-opportunity"></i>
                    <i v-if="scope.row.mode==2" class="el-icon-check"></i>
                    <i v-if="scope.row.mode==3" class="el-icon-close"></i>
                </template>
            </el-table-column>
            <el-table-column prop="title" label="标题">
            </el-table-column>
            <el-table-column prop="reason" label="原因">
            </el-table-column>
            <el-table-column prop="content" label="内容">
            </el-table-column>
            <el-table-column prop="createTime" label="时间">
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

                visible: {
                    add: false,
                },
                model: {
                    addModel: {
                        title: '',
                        reason: '',
                        content: '',
                        mode: '',
                    },
                },
                options: [{
                    value: '1',
                    label: '重要事件'
                }, {
                    value: '2',
                    label: '奖励'
                }, {
                    value: '3',
                    label: '惩罚'
                }],
                search: {
                    mode: '',
                },
            }
        },
        methods: {
            changeMode(value) {
                this.getRequest("/staff/notice/all/" + this.pageNo + "/" + this.pageSize + "?mode=" + value).then((resp) => {
                    this.tableData = resp.records;
                    this.total = resp.total;
                    this.pageCount = resp.pages;
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
                this.getRequest("/staff/notice/all/" + pageNo + "/" + pageSize + "?mode=" + this.search.mode).then((resp) => {
                    this.tableData = resp.records;
                    this.total = resp.total;
                    this.pageCount = resp.pages;
                });
            },
            cancelSelect() {
                this.options = this.$options.data().options;
                this.search.mode = '';
                this.getTableData(this.pageNo, this.pageSize);
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