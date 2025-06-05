<template>
  <el-button @click="click">submit</el-button>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'
import getRequest from '@/api'
import {getUserInfo} from "@/utils";
import {ElMessage} from "element-plus";
import task from "@/components/flow/node/start";

const click = () => {
  const data = {
    "userId": 4,
    "formContent": "{\"type\":\"2\",\"startDate\":\"2025-04-30T16:00:00.000Z\",\"endDate\":\"2025-05-01T16:00:00.000Z\",\"day\":\"15\",\"remark\":\"15\"}",
    "flowId": "4",
    "approver": ""
  }
  getRequest('flow/save', data)
      .then(() => {
        ElMessage({
          message: '保存成功',
          type: 'success',
        })
      })
}
onMounted(() => {
})
</script>

<style scoped>

</style>