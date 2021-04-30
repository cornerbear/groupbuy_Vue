<template>
  <div id="app">
    <el-container id="container" style="border: 1px solid #eee">
      <el-header>
        <div style="height: 100%; width: 400px; float: left;">
          <p style="height: 100%; font-size: 40px;margin: 0; vertical-align:middle;">社区团购管理系统</p>
        </div>
        <div style="height: 100%; width: 200px; float: right;padding: 20px;">
          <el-dropdown>
            <i class="el-icon-setting"></i>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <span>{{user.name!=null?user.name:user.username}}</span>
        </div>
      </el-header>
      <el-container id="down-container">
        <!-- 菜单栏 -->
        <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
          <el-menu router :default-active="this.$route.name">
            <!-- v-if="item.enabled" -->
            <el-submenu v-for="(item,index) in routes" :key="index" :index="String(index)">
              <template #title><i :class="item.iconCls"></i>{{item.name}}</template>
              <el-menu-item v-for="(item2,index2) in item.children" :index="item2.path">
                <i :class="item2.iconCls"></i>
                {{item2.name}}
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-container id="container">
          <!-- 主内容 -->
          <el-main>
            <router-view :key="Math.random()"></router-view>
          </el-main>
          <el-footer>
            <div>
              Copyright © 2021 zhangxiaojian
            </div>
            <div>
              Powered by Java 1.8 And vue-cli v4.5.11
            </div>
          </el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        user: null,
      }
    },
    methods: {
      logout() {
        this.$confirm('此操作将注销登录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.getRequest("/logout").then((resp) => {
            window.sessionStorage.removeItem("user")
            this.$store.commit('initRoutes', []);
            this.$router.replace("/");
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
      },
    },
    created() {
      this.user = this.$store.state.currentUser;
      console.log(this.user);
    },
    computed: {
      routes() {
        return this.$store.state.routes;
      },
    }
  };
</script>

<style>
  body {
    height: 100vh;
    margin: 0;
    padding: 8px;
    box-sizing: border-box;
  }

  #down-container {
    height: 90%;
  }

  #container {
    height: 100%;
  }

  .el-container {
    height: 100%;
  }

  #app {
    height: 100%;
  }

  .el-header {
    background-color: #B3C0D1;
    color: #333;
    height: 10% !important;
  }

  .el-aside {
    color: #333;
    height: 100%;
  }

  .el-main {
    height: 90%;
  }

  .el-footer {
    height: 10% !important;
    background-color: #00b7ff57;
    text-align: center;
    padding: 10px;
  }
</style>