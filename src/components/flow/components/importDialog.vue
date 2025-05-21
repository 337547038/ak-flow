<template>
  <el-dialog
      title="导出数据"
      v-model="visible"
      width="50%">
    <div class="content">
      <el-input type="textarea" :rows="15" v-model="importData" placeholder="请输入需要导入的json数据"></el-input>
    </div>
    <div class="btn">
      <el-button type="primary" @click="importClick">确定</el-button>
      <el-button @click="visible=false">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import {ref} from 'vue'

const visible = ref(false)
const importData = ref()
const callbackFn = ref()
const open = (callback: Function): void => {

  visible.value = true
  callbackFn.value = callback
}
const importClick = () => {
  if (importData.value && callbackFn.value) {
    callbackFn.value(importData.value)
  }
  importData.value = ''
  visible.value = false
}
defineExpose({open})
</script>

<style scoped>
.content {
  margin-bottom: 20px;
}
.btn{display: flex;justify-content: flex-end}
</style>