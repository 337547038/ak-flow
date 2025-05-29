<template>
  <el-table
      :data="tableData"
      style="width: 100%"
  >
    <el-table-column
        type="selection"
        width="55"/>
    <el-table-column prop="title" label="标题">
      <template #default="{row}">
        {{ getTitle(row) }}
      </template>
    </el-table-column>
    <el-table-column prop="userName" label="发起人">
      <template #default="{row}">
        {{ dict[row.userId] }}
      </template>
    </el-table-column>
    <el-table-column prop="date" label="抄送时间" width="180">
      <template #default="{row}">
        {{ dateFormatting(row.dateTime) }}
      </template>
    </el-table-column>
    <!--    <el-table-column prop="checkName" label="当前审批人"></el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>-->
    <el-table-column label="节点名称" prop="nodeName">
    </el-table-column>
    <el-table-column prop="classify" label="流程类型">
      <template #default="{row}">
        {{ flowClassify[row.d_classify] }}
      </template>
    </el-table-column>
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
import {ref, nextTick, onMounted} from 'vue'
import flowForm from './components/flowDetail.vue'
import {dateFormatting, flowClassify} from "@/utils";
import getRequest from "@/api";

const flowFormEl = ref()

const getTitle = (row: { [key: string]: any }) => {
  return `${dict.value[row.userId]}发起的${row.d_name}`
}


const tableData = ref([])
const dict = ref({})

const visible = ref(false)
const detailClick = (row: { [key: string]: any }) => {
  visible.value = true
  nextTick(() => {
    flowFormEl.value.getFlowData(row.flowId)
  })
}

const getData = () => {
  getRequest("getCopyFlow", {})
      .then(res => {
        tableData.value = res.list
        dict.value = res.userDict
      })
}

onMounted(() => {
  getData()
})
</script>

<style scoped>

</style>