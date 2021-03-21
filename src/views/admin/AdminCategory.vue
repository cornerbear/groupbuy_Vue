<template>
    <!--tree-->
    <!-- <el-card> -->
    <el-tree :props="treeProps" :data="treeData" show-checkbox node-key="id" :default-expand-all="false"
        :expand-on-click-node="false">
        <template #default="{ node, data }">
            <span class="custom-tree-node">
                <span>{{node.label}}</span>
                <span>
                    <el-button type="text" size="mini" @click="() => append(node,data)">
                        增加
                    </el-button>
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
    <!-- </el-card> -->

    <el-dialog title="添加类别" v-model="dialogFormVisible">
        <el-form :model="formModel" ref="form" :rules="rules">
            <el-form-item label="类别名称" prop="catName" :label-width="formLabelWidth">
                <el-input v-model="formModel.catName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="父类别" prop="parentCatId" :label-width="formLabelWidth">
                <el-cascader v-model="formModel.parentCatId" :options="selectData" :props="selectProps" clearable placeholder="若为根节点，则不选择"></el-cascader>
            </el-form-item>
            <el-form-item label="序号" prop="sort" :label-width="formLabelWidth">
                <el-input v-model="formModel.sort" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCategory('form')">确 定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script>

    const axios = require('axios').default;

    export default {
        name: "Category",
        data() {
            return {
                treeData: [],
                selectData: null,
                dialogFormVisible: false,
                formModel: {
                    catId: null,
                    catName: null,
                    parentCatId: null,
                    sort: null,
                },
                treeProps: {
                    label: 'catName'
                },
                selectProps: {
                    checkStrictly: true,
                    value: 'catId',
                    label: 'catName',
                },
                formLabelWidth: '120px',
            }
        },
        created() {
            this.getlist();
        },
        methods: {
            getlist() {
                axios.post("/admin/categoryTree").then((res) => {
                    this.treeData = res.data;
                    this.selectData = this.treeData;
                })
            },
            handleNodeClick(data) {
                console.log(data);
            },
            //数组转化为树
            arraytotree(arr) {
                var top = [], sub = [], tempObj = {};

                arr.forEach(function (item) {
                    if (item.parentCatId == 0) { // 顶级分类
                        top.push(item)
                    } else {
                        sub.push(item) // 其他分类
                    }
                    item.children = []; // 默然添加children属性
                    tempObj[item.catId] = item // 用当前分类的id做key，存储在tempObj中
                })

                sub.forEach(function (item) {
                    // 取父级
                    var parent = tempObj[item.parentCatId] || { 'children': [] }
                    // 把当前分类加入到父级的children中
                    parent.children.push(item)
                })

                return top
            },

            append(node, data) {
                this.dialogFormVisible = true;
                
            },
            addCategory(form){
                this.formModel.parentCatId = this.formModel.parentCatId[this.formModel.parentCatId.length - 1];
                axios.post("/admin/category",this.formModel).then((res) => {
                    console.log(res)
                })
            },

            remove(node, data) {
                console.log("node")
                console.log(node)
                console.log("data")
                console.log(data)
            },
            edit(node, data) {
                console.log("node")
                console.log(node)
                console.log("data")
                console.log(data)
            }
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
</style>