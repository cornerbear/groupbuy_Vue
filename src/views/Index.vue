<template>
  <div id="app">
    <el-container id="container" style="border: 1px solid #eee">
      <el-header style="text-align: right; font-size: 12px">
        <el-dropdown>
          <i class="el-icon-setting" style="margin-right: 15px"></i>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>查看</el-dropdown-item>
              <el-dropdown-item>新增</el-dropdown-item>
              <el-dropdown-item>删除</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <span>王小虎</span>
      </el-header>
      <el-container id="down-container">
        <!-- 菜单栏 -->
        <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
          <el-menu router :default-active="this.$route.name">
            <!-- v-if="item.enabled" -->
            <el-submenu v-for="(item,index) in routes" :key="index" :index="String(index)">
              <template #title><i class="el-icon-setting"></i>{{item.name}}</template>
              <el-menu-item v-for="(item2,index2) in item.children" :index="item2.path">{{item2.name}}</el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-container id="container">
          <!-- 主内容 -->
          <el-main>
            <router-view></router-view>
          </el-main>
          <el-footer style="height: 20%;">Footer</el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  export default {
    data() {
      const item = {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      };
      return {
        tableData: Array(5).fill(item)
      }
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
    height: 90%;
  }

  .el-main {
    height: 90%;
  }

  .el-footer {
    height: 10% !important;
    background-color: #00b7ff;
  }

</style>