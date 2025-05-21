<template>
  <el-container class="container">
    <el-header class="header">ak-design工作流引擎</el-header>
    <el-container>
      <el-aside width="160px" class="aside">
        <el-menu router
            background-color="#001529"
            text-color="#fff"
            active-text-color="#ffd04b">
          <el-menu-item index="flow">流程设计</el-menu-item>
          <el-menu-item index="applyList">发起申请</el-menu-item>
          <el-menu-item index="my">我发起的</el-menu-item>
          <el-menu-item index="todo">我的待办</el-menu-item>
          <el-menu-item index="done">我的已办</el-menu-item>
          <el-menu-item index="copy">我的抄送</el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>

        <router-view v-slot="{ Component }">
          <component :is="Component"/>
        </router-view>

      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">

</script>
<style lang="scss" scoped>
.container{height: 100vh}
.header{display: flex;align-items: center;font-size: 18px;}
.aside{background: #001529}
.el-menu{border-color: #001529}
.header{box-shadow: 0 0 4px #edebeb
}
</style>