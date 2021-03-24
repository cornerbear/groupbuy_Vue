<template>

    <div class="header">
        <el-card>
            <el-button type="primary" plain @click="dialogFormVisible=true">
                添加菜单
            </el-button>
        </el-card>
    </div>

    <!-- 树形控件 -->
    <div class="menuTree">
        <el-card>
            <el-tree :props="treeProps" :data="treeData" show-checkbox node-key="id" :default-expand-all="false"
                :expand-on-click-node="false">
                <template #default="{ node, data }">
                    <span class="custom-tree-node">
                        <span>{{node.label}}</span>
                        <span>
                            <el-button type="text" size="mini" @click="() => remove(node, data)">
                                删除
                            </el-button>
                            <el-button type="text" size="mini" @click="() => edit(node, data)">
                                编辑
                            </el-button>
                        </span>
                    </span>
                </template>
            </el-tree>
        </el-card>
    </div>

    <!-- 表格控件  -->
    <div class="menuTable">
        <el-card>
            <el-table :data="tableData" border>
                <el-table-column prop="id" label="ID" width="50px" />
                <el-table-column prop="name" label="名称" width="120" />
                <el-table-column prop="component" label="component" width="230px" />
                <el-table-column prop="path" label="Path" width="230px" />
                <el-table-column prop="parentId" label="父ID" width="70px" />
                <el-table-column fixed="right" label="操作">
                    <template #default="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                        <el-button type="text" size="small">编辑</el-button>
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
    <el-dialog title="添加菜单" v-model="dialogFormVisible">
        <el-form :model="formModel" ref="form" :rules="rules">
            <el-form-item label="菜单名称" prop="name">
                <el-input v-model="formModel.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="父菜单" prop="parentId">
                <el-cascader v-model="formModel.parentId" :options="selectData" :props="selectProps" clearable
                    placeholder="若为根节点，则不选择"></el-cascader>
            </el-form-item>
            <el-form-item label="URL" prop="url">
                <el-input v-model="formModel.url" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="PATH" prop="path">
                <el-input v-model="formModel.path" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="序号" prop="sort">
                <el-input v-model="formModel.sort" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="是否启用" prop="enabled">
                <el-radio v-model="formModel.enabled" label="true">是</el-radio>
                <el-radio v-model="formModel.enabled" label="false">否</el-radio>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addMenu('form')">确 定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script>

    export default {
        name: "Category",
        data() {
            return {
                // 树形控件属性
                treeData: [],
                treeProps: {
                    label: 'name'
                },

                // 表格属性
                tableData: null,
                pageCount: null,
                currentPage: null,
                pageNo: 1,
                pageSize: 5,
                total: null,

                // 模态框属性
                dialogFormVisible: false,
                selectProps: {
                    checkStrictly: true,
                    value: 'id',
                    label: 'name',
                },
                selectData: null,
                formModel: {
                    name: '',
                    parentId: '',
                    url: '/admin/**',
                    path: '',
                    sort: 1,
                    enabled: 1,
                },
                rules: {
                    goodsName: [
                        { required: true, message: '请填写商品名称', trigger: 'blur' },
                        { min: 3, max: 5, message: '长度在3-5个字符之间', trigger: 'blur' }
                    ]
                },
            }
        },
        created() {
            this.initMenuTree();
            this.initMenuTable();
        },
        methods: {
            // 初始化树
            initMenuTree() {
                this.getRequest("/system/menu/tree").then((resp) => {
                    console.log(resp);
                    this.treeData = resp.data;
                    this.selectData = resp.data;
                })
            },
            // 初始化表格
            initMenuTable() {
                this.getTableData(this.pageNo, this.pageSize);
            },

            // 获取表格数据并设置
            getTableData(pageNo, pageSize) {
                this.getRequest("/system/menu/table", {
                    pageNo: pageNo,
                    pageSize: pageSize
                }).then((resp) => {
                    console.log(resp);
                    this.tableData = resp.data.records;
                    this.total = resp.data.total;
                    this.pageCount = resp.data.pages;
                })
            },

            handleNodeClick(data) {
                console.log(data);
            },
            append(node, data) {
                this.dialogFormVisible = true;

            },
            addMenu(form) {
                this.formModel.parentId = this.formModel.parentId[this.formModel.parentId.length - 1];
                this.postRequest("/system/menu", this.formModel).then((res) => {
                    console.log(res)
                })
            },

            remove(node, data) {

                var id = data.id;
                this.deleteRequest("/system/menu", {id : id}).then((res) => {
                    console.log(res)
                    if (res.success) {
                        ElMessage.success(res.msg);
                    } else {
                        ElMessage.error(res.msg);
                    }
                })
            },
            edit(node, data) {
                console.log("node")
                console.log(node)
                console.log("data")
                console.log(data)
            },
            handleSizeChange(pageSize) {
                this.pageSize = pageSize;
                this.getTableData(this.pageNo, this.pageSize)
            },
            handleCurrentChange(pageNo) {
                this.pageNo = pageNo;
                this.getTableData(this.pageNo, this.pageSize)
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