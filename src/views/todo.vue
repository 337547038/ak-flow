<template>
  <el-table
      :data="tableData"
      style="width: 100%"
  >
    <el-table-column
        type="selection"
        width="55"/>
    <el-table-column prop="title" label="标题" width="200">
      <template #default="{row}">
        {{ getTitle(row) }}
      </template>
    </el-table-column>
    <el-table-column prop="name" label="发起人">
      <template #default="{row}">{{ dict[row.userId] }}</template>
    </el-table-column>
    <el-table-column prop="date" label="发起时间" width="180">
      <template #default="{row}">
        {{ dateFormatting(row.startTime) }}
      </template>
    </el-table-column>
    <el-table-column label="节点名称">
      <template #default="{row}">
        {{ getCurrentNodeName(row.currentNode) }}
      </template>
    </el-table-column>
    <el-table-column prop="classify" label="流程类型">
      <template #default="{row}">
        {{ flowClassify[row.classify] }}
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="{row}">
        <el-button link type="primary" @click="detailClick(row)">审批</el-button>
        <el-button link type="primary">委托</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-drawer v-model="visible" direction="rtl" size="80%" title="流程详情" destroy-on-close>
    <flowForm ref="flowFormEl">
      <h3>审批意见</h3>
      <el-form>
        <el-form-item label="审批意见">
          <el-input placeholder="请输入审批意见" v-model="remark"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitClick(1)">同意</el-button>
          <el-button type="danger" @click="submitClick(2)">拒绝</el-button>
          <el-button type="warning" @click="submitClick(3)">退回发起人</el-button>
          <el-button type="info">委托</el-button>
          <el-button>指定审批人</el-button>
        </el-form-item>
      </el-form>
    </flowForm>
  </el-drawer>
</template>

<script setup lang="ts">
import {ref, nextTick, onMounted} from 'vue'
import flowForm from './components/flowDetail.vue'
import getRequest from '@/api'
import {dateFormatting, flowClassify, getUserInfo} from "@/utils";
import {ElMessage} from "element-plus";

const flowFormEl = ref()

const tableData = ref([])
const dict = ref({})

const getTitle = (row: { [key: string]: any }) => {
  return `${dict.value[row.userId]}发起的${row.name}`
}
const getCurrentNodeName = (currentNode: string) => {
  if (currentNode) {
    const nodes = JSON.parse(currentNode)
    for (const key in nodes) {
      if (nodes[key].userId?.split(',').includes(getUserInfo().id + "")) {
        return nodes[key].nodeName
      }
    }
  }
  return ""
}
const visible = ref(false)
const flowId = ref()
const detailClick = (row: { [key: string]: any }) => {
  visible.value = true
  nextTick(() => {
    flowId.value = row.id
    flowFormEl.value.getFlowData(row.id)
  })
}

const getData = () => {
  getRequest("getTodoFlow", {})
      .then(res => {
        tableData.value = res.list
        dict.value = res.userDict
      })
}

const remark = ref()
const submitClick = (type: number) => {
  getRequest("submitApproval", {status: type, id: flowId.value, remark: remark.value})
      .then(res => {
        ElMessage({
          message: '审批成功',
          type: 'success',
        })
        visible.value = false
        getData()
      })
}
onMounted(() => {
  getData()
})
</script>

<style scoped>

</style>