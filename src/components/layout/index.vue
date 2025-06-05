<template>
  <el-container class="container">
    <el-header class="header">
      <div>ak-design工作流引擎</div>
      <div>用户：{{ userName }}
        <el-dropdown @command="changeUser">
          <el-button size="small" type="primary">切换用户</el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="item in userList" :key="item.id" :command="item">{{
                  item.userName
                }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>
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
import {ref, onMounted} from 'vue'
import getRequest from '@/api'

const userName = ref()
const userList = ref([])
const getUserList = () => {
  getRequest("getUserList", {}).then(res => {
    userList.value = res.list || []
    const userInfo = window.localStorage.getItem('userInfo')
    if (!userInfo) {
      window.localStorage.setItem("userInfo", JSON.stringify(res.list[0]))
      userName.value = userList.value[0]?.userName
    }else {
      const obj = JSON.parse(userInfo)
      userName.value = obj.userName
    }
  })
}
const changeUser = (obj: any) => {
  window.localStorage.setItem("userInfo", JSON.stringify(obj))
  userName.value = obj.userName
}

onMounted(() => {
  getUserList()
})

</script>
<style lang="scss" scoped>
.container {
  height: 100vh
}

.header {
  display: flex;
  align-items: center;
  font-size: 18px;
  justify-content: space-between
}

.aside {
  background: #001529
}

.el-menu {
  border-color: #001529
}

.header {
  box-shadow: 0 0 4px #edebeb
}
</style>