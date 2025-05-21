<template>
  <div>
    <el-dialog
        title="数据"
        v-model="visible"
        width="50%">
      <div class="content">
        <vue-json-pretty :data="jsonData" :showLength="true" showIcon/>
      </div>
      <div class="btn">
        <el-button type="primary" @click="copyData">复制数据</el-button>
        <el-button @click="visible=false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'
import Clipboard from 'clipboard'
import {ref,nextTick} from 'vue'
import {ElMessage} from "element-plus";

/*const props = withDefaults(
    defineProps<{
      data: object
    }>(),
    {}
)*/
const jsonData = ref()
const visible = ref(false)

const open = (data) => {
  visible.value = true
  jsonData.value = data
}

const copyData = (e: any) => {
  nextTick(() => {
    const clipboard: any = new Clipboard(e.target, {
      text: () => {
        return JSON.stringify(jsonData.value)
      }
    })
    clipboard.on('success', function () {
      ElMessage({
        message: '复制成功！',
        type: 'success'
      })
      clipboard.destroy()
    })
    clipboard.on('error', function () {
      ElMessage.error('复制失败')
      clipboard.destroy()
    })
    clipboard.onClick(e)
  })
}

defineExpose({open})
</script>

<style scoped lang="scss">
.content{height: 500px;overflow-y: auto}
.btn{padding-top: 30px;display: flex;justify-content: flex-end}
</style>