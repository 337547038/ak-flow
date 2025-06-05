<template>
  <el-table
      :data="tableData"
      style="width: 100%"
  >
    <el-table-column
        type="selection"
        width="55"/>
    <el-table-column prop="title" label="标题" width="220">
      <template #default="{row}">
        {{ getTitle(row) }}
      </template>
    </el-table-column>
<!--    <el-table-column prop="name" label="发起人">
      <template #default="{row}">{{ getUserInfo().userName }}</template>
    </el-table-column>-->
    <el-table-column prop="date" label="发起时间" width="180">
      <template #default="{row}">
        {{ dateFormatting(row.startTime) }}
      </template>
    </el-table-column>
    <el-table-column prop="currentUserId" label="当前审批人">
      <template #default="{row}">
        {{ getCurrentUserName(row.currentUserId) }}
      </template>
    </el-table-column>
    <el-table-column prop="status" label="状态">
      <template #default="{row}">
        <el-tag :type="getTagType(row.status)">{{ flowStatus[row.status] }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="classify" label="流程类型">
      <template #default="{row}">
        {{ flowClassify[row.classify] }}
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="{row}">
        <el-button link type="primary" @click="detailClick(row)">详情</el-button>
        <el-button link type="primary" v-if="row.status===0" @click="cancelClick(row.id)">撤回</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-drawer v-model="visible" direction="rtl" size="80%" title="流程详情" destroy-on-close>
    <flowForm ref="flowFormEl"/>
  </el-drawer>
</template>

<script setup lang="ts">
import {ref, nextTick, onMounted} from 'vue'
import flowForm from './components/flowDetail.vue'
import getRequest from '@/api'
import {dateFormatting, flowClassify, flowStatus, getUserInfo} from "@/utils";
import {ElMessage} from "element-plus";

const flowFormEl = ref()

const tableData = ref([])


const getTitle = (row: { [key: string]: any }) => {
  const userName = getUserInfo().userName;
  return `${userName}发起的${row.name}`
}
const getCurrentUserName = (userIds: string) => {
  if (userIds) {
    const temp = []
    const ids = userIds.split(',')
    for (const key in ids) {
      temp.push(userDict.value[ids[key]])
    }
    return temp.join(',')
  }
  return userIds
}
const getTagType = (status: number) => {
  /*0: "进行中",
      1: "完成",
      2: '拒绝',
      3: '已撤回',
      4: '退回',*/
  switch (status) {
    case 1:
      return 'success'
    case 2:
      return 'danger'
    case 3:
      return 'info'
    case 4:
      return 'warning'
    default:
      return 'primary'
  }
}
const visible = ref(false)
const detailClick = (row: { [key: string]: any }) => {
  visible.value = true
  nextTick(() => {
    flowFormEl.value.getFlowData(row.id)
  })
}
const userDict = ref({})
const getData = () => {
  getRequest('getMy', {})
      .then(res => {
        tableData.value = res.list || []
        userDict.value = res.userDict || {}
      })
}
const cancelClick = (id: number) => {
  getRequest('getCancel', {id: id})
      .then(res => {
        ElMessage({
          message: '撤回成功',
          type: 'success',
        })
        getData()
      })
}
onMounted(() => {
  getData()
})
</script>

<style scoped>

</style>