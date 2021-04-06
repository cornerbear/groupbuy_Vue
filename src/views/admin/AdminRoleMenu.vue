<template>
    <div v-loading="globalLoading" element-loading-text="正在添加..." element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)">
        <div class="roleTool">
            <el-input size="small" placeholder="请输入角色英文名" v-model="role.name">
                <template #prepend>ROLE_</template>
            </el-input>
            <el-input size="small" placeholder="请输入角色中文名" v-model="role.nameZh" @keydown.enter.native="addRole">
            </el-input>
            <el-button type="primary" size="small" icon="el-icon-plus" @click="addRole">添加角色</el-button>
        </div>
        <div class="roleMain">
            <el-collapse v-model="activeName" v-loading="loading" element-loading-text="正在加载..."
                element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" accordion
                @change="change">
                <el-collapse-item :title="r.nameZh" :name="r.roleId" v-for="(r,index) in roles" :key="index">
                    <el-button type="primary" size="small" icon="el-icon-edit" @click="openUpdateRoleDialog(r.roleId)">
                        修改角色</el-button>
                    <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteRole">删除角色</el-button>
                </el-collapse-item>
            </el-collapse>
        </div>
        <div class="roleMenu">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>可访问的资源</span>
                </div>
                <div>
                    <el-tree show-checkbox node-key="id" ref="menuTree" :key="index" :default-expanded-keys="[2]"
                        :default-checked-keys="selectedMenus" :data="menuTreeData" :props="defaultProps"></el-tree>
                    <div style="display: flex;justify-content: flex-end">
                        <el-button @click="cancelUpdate">取消修改</el-button>
                        <el-button type="primary" @click="updateRoleMenu(index)">确认修改</el-button>
                    </div>
                </div>
            </el-card>
        </div>
    </div>
    <el-dialog title="修改角色" v-model="updateRoleDialog" width="30%" @close="closeUpdateRoleDialog()">
        <el-input size="small" placeholder="请输入角色英文名" v-model="role.name" class="updateInput">
            <template #prepend>英文名称</template>
        </el-input>
        <el-input size="small" placeholder="请输入角色中文名" v-model="role.nameZh" class="updateInput"
            @keydown.enter.native="updateRole">
            <template #prepend>中文名称</template>
        </el-input>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="closeUpdateRoleDialog()">取 消</el-button>
                <el-button type="primary" @click="updateRole()">确 定</el-button>
            </span>
        </template>
    </el-dialog>

</template>

<script>
    export default {
        name: "AdminRole",
        data() {
            return {
                role: {
                    roleId: '',
                    name: '',
                    nameZh: ''
                },
                menuTreeData: [],
                activeName: -1,
                selectedMenus: [],
                roles: [],
                loading: false,
                globalLoading: false,
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                index: null,
                roleId: null,
                updateRoleDialog: false,

            }
        },
        methods: {
            addRole() {
                if (this.role.name && this.role.nameZh) {
                    this.globalLoading = true;
                    this.postRequest("/system/role", this.role).then(resp => {
                        this.globalLoading = false;
                        if (resp) {
                            this.role.roleId = '';
                            this.role.name = '';
                            this.role.nameZh = '';
                            this.initRoles();
                        }
                    })
                } else {
                    this.$message.error('数据不可以为空');
                }
            },
            deleteRole(role) {
                this.$confirm('此操作将永久删除【' + role.nameZh + '】角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/system/basic/permiss/role/" + role.id).then(resp => {
                        if (resp) {
                            this.initRoles();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            openUpdateRoleDialog(roleId) {
                this.getRequest("/system/role/" + roleId).then(resp => {
                    if (resp.success) {
                        this.role = resp.data;
                        this.updateRoleDialog = true;
                    }
                })
            },
            updateRole(roleId) {
                this.putRequest("/system/role", this.role).then(resp => {
                    if (resp.success) {
                        this.updateRoleDialog = false;
                        this.role.roleId = '';
                        this.role.name = '';
                        this.role.nameZh = '';
                        this.initRoles();
                    }
                })
            },
            cancelUpdate() {
                this.activeName = -1;
                this.selectedMenus = [];
                this.$refs.menuTree.setCheckedKeys(this.selectedMenus);
            },
            updateRoleMenu() {
                let tree = this.$refs.menuTree;
                // 不只包括叶子节点，包括半选节点
                let selectedKeys = tree.getCheckedKeys(false, true);

                this.putKeyValueRequest("/system/role/roleMenu", {
                    roleId: this.roleId,
                    menuIds: selectedKeys,
                }).then(resp => {
                    if (resp) {
                        this.activeName = -1;
                    }
                })
            },
            change(rid) {
                if (rid) {
                    this.roleId = rid;
                    this.setSelectedMenus(rid);
                }
            },
            setSelectedMenus(rid) {
                this.getRequest("/system/menu/ids/" + rid).then(resp => {
                    if (resp) {
                        this.selectedMenus = resp;
                        this.$refs.menuTree.loading = false;
                        this.$nextTick(() => {
                            this.$refs.menuTree.setCheckedKeys(this.selectedMenus);
                            this.$refs.menuTree.loading = true;
                        })
                    }
                })
            },
            // 初始化右侧菜单树
            initMenuTree() {
                this.getRequest("/system/menu/IdAndName").then(resp => {
                    if (resp) {
                        this.menuTreeData = resp;
                    }
                })
            },
            initRoles() {
                this.loading = true;
                this.getRequest('/system/role/all').then(resp => {
                    this.loading = false;
                    if (resp) {
                        this.roles = resp.data;
                    }
                })
            },
            closeUpdateRoleDialog() {
                this.updateRoleDialog = false;
                this.role.name = '';
                this.role.nameZh = '';
                this.role.roleId = '';
            }
        },
        created() {
            this.initRoles();
            this.initMenuTree();
        },
    }
</script>

<style>
    .roleTool {
        display: flex;
        justify-content: flex-start;
    }

    .roleTool .el-input {
        width: 300px;
        margin-right: 6px;
    }

    .roleMain {
        margin-top: 10px;
        width: 350px;
        float: left;
    }

    .roleMenu {
        margin-top: 10px;
        margin-left: 30px;
        float: left;
    }

    .updateInput {
        width: 400px;
    }
</style>