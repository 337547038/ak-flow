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
    <el-table-column prop="date" label="审批时间" width="180">
      <template #default="{row}">
        {{ dateFormatting(row.dateTime) }}
      </template>
    </el-table-column>
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
    <flowForm ref="flowFormEl">
      <h3>审批意见</h3>
      <el-form :disabled="true">
        <el-form-item label="审批状态">
          {{getStatus[formData.status]}}
        </el-form-item>
        <el-form-item label="审批意见">
          <el-input placeholder="请输入审批意见" v-model="formData.remark"></el-input>
        </el-form-item>
<!--        <el-form-item>
          <el-button type="primary">同意</el-button>
          <el-button type="danger">拒绝</el-button>
          <el-button type="warning">退回发起人</el-button>
          <el-button type="info">委托</el-button>
        </el-form-item>-->
      </el-form>
    </flowForm>
  </el-drawer>
</template>

<script setup lang="ts">
import {ref, nextTick, onMounted} from 'vue'
import flowForm from './components/flowDetail.vue'
import {dateFormatting, flowClassify, getUserInfo} from "@/utils";
import getRequest from "@/api";

const flowFormEl = ref()

const tableData = ref([])
const dict = ref({})

const getStatus = {1: '同意', 2: '拒绝', 3: '返回发起人'};


const getTitle = (row: { [key: string]: any }) => {
  return `${dict.value[row.userId]}发起的${row.d_name}`
}

const visible = ref(false)
const formData = ref({})
const detailClick = (row: { [key: string]: any }) => {
  visible.value = true
  nextTick(() => {
    flowFormEl.value.getFlowData(row.flowId)
    // 获取审批意见
    getRequest("getRecordById", {id: row.id})
        .then(res => {
          formData.value = res
        })
  })
}

const getData = () => {
  getRequest("getDoneFlow", {})
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