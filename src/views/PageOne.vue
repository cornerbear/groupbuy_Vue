<template>
    <div>
        <el-table :data="tableData" border style="width: 100%">
            <!-- <el-table-column fixed prop="date" label="日期" width="150">
            </el-table-column> -->
            <el-table-column prop="id" label="ID" width="120">
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="120">
            </el-table-column>
            <el-table-column prop="age" label="年龄" width="120">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
                <template #default="scope">
                    <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                    <el-button type="text" size="small">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="currentPage4" :page-sizes="[5, 10, 20]" :page-size="5"
            layout="total, sizes, prev, pager, next, jumper" :total="total" :page-count="pageCount">
        </el-pagination>
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
                this.getTableData(this.pageNo,this.pageSize)
            },
            handleCurrentChange(pageNo) {
                this.pageNo = pageNo;
                this.getTableData(this.pageNo,this.pageSize)
            },
            getTableData(pageNo,pageSize){
                axios.get("http://localhost:8888/tests/"+pageNo+"/"+pageSize).then((resp) => {
                    console.log(resp);
                    this.tableData = resp.data.records;
                    this.total = resp.data.total;
                    this.pageCount = resp.data.pages;
                })
                .catch((error) => {
                    console.log(error);
                });
            }
        },
        created() {
            this.getTableData(this.pageNo,this.pageSize);
        },
        data() {
            return {
                total: null,
                tableData: null,
                pageCount : null,
                pageNo : 1,
                pageSize : 5
            }
        }
    }
</script>