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
                <el-button type="primary" plain @click="openAddNotice" style="float:right;">
                    发布公告
                </el-button>
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
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button @click="deleteNotice(scope.row)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
            :page-sizes="[5, 10, 20]" :page-size="5" layout="total, sizes, prev, pager, next, jumper" :total="total"
            :page-count="pageCount">
        </el-pagination>


        <!-- 添加公告模态框 -->
        <el-dialog title="添加公告" v-model="visible.add">
            <el-form :model="model.addModel" ref="form">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="model.addModel.title"></el-input>
                </el-form-item>
                <el-form-item label="原因" prop="reason">
                    <el-input v-model="model.addModel.reason"></el-input>
                </el-form-item>
                <el-form-item label="内容" prop="content">
                    <el-input v-model="model.addModel.content"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="mode">
                    <el-select @change="changeMode" v-model="model.addModel.mode" placeholder="请选择类型">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="visible.add = false">取 消</el-button>
                    <el-button type="primary" @click="addNotice">确认添加</el-button>
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
            openAddNotice() {
                this.visible.add = true;
            },
            addNotice() {
                this.postRequest("/manager/notice/", this.model.addModel).then((resp) => {
                    if (resp.success) {
                        this.getTableData(this.pageNo, this.pageSize);
                        this.visible.add = false;
                    }
                });
            },
            deleteNotice(row) {
                this.$confirm('确认从删除该公告?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/manager/notice/" + row.id).then((resp) => {
                        if (resp.success) {
                            this.getTableData(this.pageNo, this.pageSize);
                            this.visible.add = false;
                        }
                    });
                }).catch(() => {
                    this.message.info("已取消删除");
                });

            },
            changeMode(value) {
                this.getRequest("/manager/notice/all/" + this.pageNo + "/" + this.pageSize + "?mode=" + value).then((resp) => {
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
                this.getRequest("/manager/notice/all/" + pageNo + "/" + pageSize + "?mode=" + this.search.mode).then((resp) => {
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