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
    <el-table-column prop="nodeName" label="节点名称"></el-table-column>
    <el-table-column prop="flow" label="流程类型"></el-table-column>
    <el-table-column label="操作">
      <template #default="{row}">
        <el-button link type="primary" @click="detailClick(row)">办理</el-button>
        <el-button link type="primary">委托</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-drawer v-model="visible" direction="rtl" size="80%" title="流程详情">
    <flowForm ref="flowFormEl">
      <h3>流程处理</h3>
      <el-form>
        <el-form-item label="审批意见">
          <el-input placeholder="请输入审批意见"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">同意</el-button>
          <el-button type="danger">拒绝</el-button>
          <el-button type="warning">退回发起人</el-button>
          <el-button type="info">委托</el-button>
          <el-button>指定审批人</el-button>
        </el-form-item>
      </el-form>
    </flowForm>
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
    flow: '调休假审批',
    nodeName: '领导审批',
    id: 1
  },
  {
    title: '张三发起的报销申请',
    name: '张三',
    date: '1991-01-01 00:00:00',
    flow: '报销申请',
    nodeName: '领导审批',
    id: 2
  },
  {
    title: '张三发起的补卡审批',
    name: '张三',
    date: '1991-01-01 00:00:00',
    flow: '补卡审批',
    nodeName: '领导审批',
    id: 3
  },
  {
    title: '张三发起的加班申请',
    name: '张三',
    date: '1991-01-01 00:00:00',
    flow: '加班申请',
    nodeName: '领导审批',
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