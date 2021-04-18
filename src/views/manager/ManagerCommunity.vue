<template>
    <div class="header">
        <el-card>
            <el-button size="small" icon="el-icon-close" circle @click="cancelSelect"></el-button>
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
            <el-button type="primary" plain @click="openAddCommunityDialog">
                添加社区
            </el-button>
        </el-card>
    </div>

    <!-- 表格控件  -->
    <el-table :data="tableData" border :fit="true">
        <el-table-column prop="provinceName" label="省" v-if="region.province==null" />
        <el-table-column prop="cityName" label="市" v-if="region.city==null" />
        <el-table-column prop="areaName" label="区" v-if="region.area==null" />
        <el-table-column prop="streetName" label="街" v-if="region.street==null" />
        <el-table-column prop="communityName" label="社区名称" />
        <el-table-column prop="detailLocation" label="详细地址" />
        <el-table-column label="操作">
            <template #default="scope">
                <el-button @click="openUpdate(scope.row)" type="text" size="small">编辑</el-button>
                <el-button @click="deleteCommunity(scope.row)" type="text" size="small">删除</el-button>
            </template>
        </el-table-column>
    </el-table>

    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
        :page-sizes="[5, 10, 20]" :page-size="5" layout="total, sizes, prev, pager, next, jumper" :total="total"
        :page-count="pageCount">
    </el-pagination>

    <!-- 添加社区模态框 -->
    <el-dialog title="添加社区" v-model="addDialogVisible">
        <el-form :model="addFormModel" ref="addForm" :rules="rules">
            <el-form-item label="社区名称" prop="name">
                <el-input v-model="addFormModel.name"></el-input>
            </el-form-item>
            <el-form-item label="详细地址" prop="detailLocation">
                <el-input v-model="addFormModel.detailLocation"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCommunity()">确 定</el-button>
            </span>
        </template>
    </el-dialog>

    <!-- 修改社区模态框 -->
    <el-dialog title="修改社区" v-model="updateDialogVisible">
        <el-form :model="addFormModel" ref="updateForm" :rules="rules">
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

            <el-form-item label="社区名称" prop="name">
                <el-input v-model="addFormModel.name"></el-input>
            </el-form-item>
            <el-form-item label="详细地址" prop="detailLocation">
                <el-input v-model="addFormModel.detailLocation"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateCommunity">确 定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script>

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
                updateDialogVisible: false,
                addFormModel: {
                    name: '',
                    detailLocation: '',
                    streeCode: '',
                },

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
                searchModel: {
                    level: null,
                    parentCode: null,
                },
                rules: {
                    name: [{ required: true, message: '社区名不能为空', trigger: 'blur' }],
                    detailLocation: [{ required: true, message: '详细地址不能为空', trigger: 'blur' }]
                }
            }
        },
        created() {
            this.initProvinceSelect();
            this.initTable();
        },
        methods: {

            // 打开添加菜单窗口
            openAddCommunityDialog() {
                if (this.region.street == null) {
                    this.message.warning("请先选择完整的省市区街");
                } else {
                    this.addDialogVisible = true;
                }
            },
            addCommunity() {

                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.postRequest("/manager/community", this.addFormModel).then((resp) => {
                            this.addDialogVisible = false;
                            this.setTableData(this.pageNo, this.pageSize);
                        })
                    } else {
                        return false;
                    }
                });

            },
            openUpdate(row) {
                this.getRequest("/manager/community/" + row.id).then((resp) => {
                    this.addFormModel = resp.data;
                })
                this.getRequest("/system/region/allLevel/" + row.id).then((resp) => {
                    this.regionOptions.provinceData = resp.data.provinceOptions;
                    this.regionOptions.cityData = resp.data.cityOptions;
                    this.regionOptions.areaData = resp.data.areaOptions;
                    this.regionOptions.streetData = resp.data.streetOptions;
                    this.region.province = resp.data.checkPath.provinceCode;
                    this.region.city = resp.data.checkPath.cityCode;
                    this.region.area = resp.data.checkPath.areaCode;
                    this.region.street = resp.data.checkPath.streetCode;
                    this.searchModel.level = 'street';
                    this.searchModel.parentCode = resp.data.checkPath.streetCode;
                    this.updateDialogVisible = true;
                })
            },
            updateCommunity() {
                this.$refs.updateForm.validate((valid) => {
                    if (valid) {
                        this.putRequest("/manager/community", this.addFormModel).then((resp) => {
                            if (resp.success) {
                                this.addFormModel = this.$options.data().addFormModel;
                                this.setTableData(this.pageNo, this.pageSize)
                                this.updateDialogVisible = false;
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            deleteCommunity(row) {
                this.$confirm('确认删除?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/manager/community/" + row.id).then((resp) => {
                        if (resp.success) {
                            this.setTableData(this.pageNo, this.pageSize)
                        }
                    })
                }).catch(() => {
                    this.message.info("已取消添加，若不保存请点击取消");
                });

            },
            // 获取表格数据并设置
            setTableData(pageNo, pageSize) {
                this.getRequest("/manager/community/table", {
                    pageNo: pageNo,
                    pageSize: pageSize,
                    level: this.searchModel.level,
                    parentCode: this.searchModel.parentCode,
                }).then((resp) => {
                    this.tableData = resp.data.records;
                    this.total = resp.data.total;
                    this.pageCount = resp.data.pages;
                })
            },
            handleSizeChange(pageSize) {
                this.pageSize = pageSize;
                this.setTableData(this.pageNo, this.pageSize)
            },
            handleCurrentChange(pageNo) {
                this.pageNo = pageNo;
                this.setTableData(this.pageNo, this.pageSize)
            },

            // 初始化表格
            initTable() {
                this.setTableData(this.pageNo, this.pageSize);
            },


            // 初始化省选择框
            initProvinceSelect() {
                this.getRequest("/system/region/province").then((resp) => {
                    this.regionOptions.provinceData = resp.data;
                })
            },
            changeProvince(value) {
                this.getRequest("/system/region/city/" + this.region.province).then((resp) => {
                    this.regionOptions.cityData = resp.data;
                    this.searchModel.level = 'province';
                    this.searchModel.parentCode = value[0];
                    this.regionOptions.areaData = null;
                    this.regionOptions.streetData = null;
                    this.region.city = null;
                    this.region.area = null;
                    this.region.street = null;
                    this.addFormModel.streeCode = '';
                    this.setTableData(this.pageNo, this.pageSize);
                })
            },
            changeCity(value) {
                this.getRequest("/system/region/area/" + this.region.city).then((resp) => {
                    this.regionOptions.areaData = resp.data;
                    this.searchModel.level = 'city';
                    this.searchModel.parentCode = value[0];
                    this.regionOptions.streetData = null;
                    this.region.area = null;
                    this.region.street = null;
                    this.addFormModel.streeCode = '';
                    this.setTableData(this.pageNo, this.pageSize);
                })

            },
            changeArea(value) {
                this.getRequest("/system/region/street/" + this.region.area).then((resp) => {
                    this.regionOptions.streetData = resp.data;
                    this.searchModel.level = 'area';
                    this.searchModel.parentCode = value[0];
                    this.region.street = null;
                    this.addFormModel.streeCode = '';
                    this.setTableData(this.pageNo, this.pageSize);
                })

            },
            changeStreet(value) {
                this.searchModel.level = 'street';
                this.searchModel.parentCode = value[0];
                this.addFormModel.streetCode = value[0];
                this.setTableData(this.pageNo, this.pageSize);
                console.log(this.region.street);
            },
            cancelSelect() {
                this.region = this.$options.data().region;
                this.searchModel = this.$options.data().searchModel;
                this.setTableData(this.pageNo, this.pageSize);
            }
        }
    }
</script>
<style>
    .header {
        margin-bottom: 5px;
    }
</style>