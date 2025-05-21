<template>
  <el-table
      :data="tableData"
      style="width: 100%"
  >
    <el-table-column
        type="selection"
        width="55"/>
    <el-table-column prop="title" label="标题"></el-table-column>
    <el-table-column prop="name" label="发起人"></el-table-column>
    <el-table-column prop="date" label="发起时间" width="180"></el-table-column>
    <el-table-column prop="checkName" label="当前审批人"></el-table-column>
    <el-table-column prop="status" label="状态"></el-table-column>
    <el-table-column prop="flow" label="流程类型"></el-table-column>
    <el-table-column label="操作">
      <template #default="{row}">
        <el-button link type="primary" @click="detailClick(row)">详情</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-drawer v-model="visible" direction="rtl" size="80%" title="流程详情">
    <flowForm ref="flowFormEl"/>
  </el-drawer>
</template>

<script setup lang="ts">
import {ref, nextTick} from 'vue'
import flowForm from './components/flowDetail.vue'

const flowFormEl = ref()

const tableData = ref([
  {
    title: '张三发起的请假流程',
    name: '张三',
    date: '1991-01-01 00:00:00',
    status: '进行中',
    flow: '调休假审批',
    checkName: '王总',
    id: 1
  },
  {
    title: '张三发起的报销申请',
    name: '张三',
    date: '1991-01-01 00:00:00',
    status: '已完成',
    flow: '报销申请',
    checkName: '',
    id: 2
  },
  {
    title: '张三发起的补卡审批',
    name: '张三',
    date: '1991-01-01 00:00:00',
    status: '已撤回',
    flow: '补卡审批',
    checkName: '',
    id: 3
  },
  {
    title: '张三发起的加班申请',
    name: '张三',
    date: '1991-01-01 00:00:00',
    status: '已拒绝',
    flow: '加班申请',
    checkName: '',
    id: 4
  }
])

const visible = ref(false)
const detailClick = (row: { [key: string]: any }) => {
  visible.value = true
  nextTick(() => {
    flowFormEl.value.getFlowData(row.id)
    flowFormEl.value.setFormValue(row.id)
  })
}
</script>

<style scoped>

</style>