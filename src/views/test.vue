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
    "userId": 1,
    "formContent": "{\"remark\":\"78\"}",
    "flowId": "11",
    "approver": "{\"f55a538b-0b5d-46e0-adf4-51fdc0b3b81f\":\"3\"}"
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