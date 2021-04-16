<template>
    <div class="header">
        <el-card>
            <el-cascader size="medium" :options="regionOptions.provinceData" v-model="region.province"
                @change="changeProvince" placeholder="请选择省">
            </el-cascader>
            <el-cascader size="medium" :options="regionOptions.cityData" v-model="region.city" @change="changeCity"
                placeholder="请选择市">
            </el-cascader>
            <el-cascader size="medium" :options="regionOptions.areaData" v-model="region.area" @change="changeArea"
                placeholder="请选择区">
            </el-cascader>
            <el-cascader size="medium" :options="regionOptions.streetData" v-model="region.street"
                @change="changeStreet" placeholder="请选择街道">
            </el-cascader>
            <el-button type="primary" plain @click="openAddMenuDialog">
                添加社区
            </el-button>
        </el-card>
    </div>

    <!-- 表格控件  -->
    <div class="menuTable">
        <el-card>
            <el-table :data="tableData" border :fit="true">
                <el-table-column prop="id" label="ID" />
                <el-table-column prop="name" label="名称" />
                <el-table-column prop="component" label="component" />
                <el-table-column prop="path" label="Path" />
                <el-table-column prop="parentId" label="父ID" />
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button @click="tableDetail(scope.row)" type="text" size="small">查看</el-button>
                        <el-button @click="openTableUpdate(scope.row)" type="text" size="small">编辑</el-button>
                        <el-button @click="tableDelete(scope.row)" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="currentPage" :page-sizes="[5, 10, 20]" :page-size="5"
                layout="total, sizes, prev, pager, next, jumper" :total="total" :page-count="pageCount">
            </el-pagination>
        </el-card>
    </div>

    <!-- 添加菜单模态框 -->
    <el-dialog title="添加菜单" v-model="addDialogVisible">
        <el-form :model="addFormModel" ref="addForm" :rules="rules">
            <el-form-item label="父菜单" prop="parentId">
                <el-cascader size="large" :options="options" v-model="selectedOptions" @change="handleChange">
                </el-cascader>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCommunity('addForm')">确 定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script>

    import { regionData } from 'element-china-area-data'

    export default {
        name: "ManagerCommunity",
        data() {
            return {
                // 表格属性
                tableData: null,
                pageCount: null,
                currentPage: null,
                pageNo: 1,
                pageSize: 5,
                total: null,

                // 模态框属性
                addDialogVisible: false,
                dataModel: null,

                options: regionData,
                selectedOptions: [],
                region: {
                    province: null,
                    city: null,
                    area: null,
                    street: null,
                },
                regionOptions: {
                    provinceData: null,
                    cityData: null,
                    areaData: null,
                    streetData: null,
                },
            }
        },
        created() {
            this.initProvinceSelect();
            this.initTable();
        },
        methods: {

            // 获取表格数据并设置
            setTableData(parentId, pageNo, pageSize) {
                this.getRequest("/system/menu/table", {
                    pageNo: pageNo,
                    pageSize: pageSize,
                    parentId: parentId
                }).then((resp) => {
                    this.tableData = resp.data.records;
                    this.total = resp.data.total;
                    this.pageCount = resp.data.pages;
                })
            },

            // 打开添加菜单窗口
            openAddMenuDialog() {
                this.addDialogVisible = true;
                console.log(regionData);
            },

            handleSizeChange(pageSize) {
                this.pageSize = pageSize;
                this.setTableData(null, this.pageNo, this.pageSize)
            },
            handleCurrentChange(pageNo) {
                this.pageNo = pageNo;
                this.setTableData(null, this.pageNo, this.pageSize)
            },


            // 初始化表格
            initTable() {
                this.setTableData(null, this.pageNo, this.pageSize);
            },
            // 初始化省选择框
            initProvinceSelect() {
                this.getRequest("/system/region/province").then((resp) => {
                    this.regionOptions.provinceData = resp.data;
                })
            },
            changeProvince() {
                this.getRequest("/system/region/city/"+this.region.province).then((resp) => {
                    this.regionOptions.cityData = resp.data;
                })
            },
            changeCity() {
                this.getRequest("/system/region/area/"+this.region.city).then((resp) => {
                    this.regionOptions.areaData = resp.data;
                })

            },
            changeArea() {
                this.getRequest("/system/region/street/"+this.region.area).then((resp) => {
                    this.regionOptions.streetData = resp.data;
                })

            },
            changeStreet() {
                console.log(this.region.street);
            },
        }
    }
</script>
<style>
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }

    .header {
        margin-bottom: 5px;
    }

    .menuTree {
        width: 30%;
        float: left;
    }

    .menuTable {
        width: 69%;
        float: left;
        margin-left: 1%;
    }
</style>