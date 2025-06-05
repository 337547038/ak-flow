<template>
  <div class="flow-control-btn">
    <el-button-group>
      <el-button @click="controlClick('zoomIn')">放大</el-button>
      <el-button @click="controlClick('zoomOut')">缩小</el-button>
      <el-button @click="controlClick('resetZoom')">自适应</el-button>
      <el-button @click="controlClick('resetTranslate')">还原</el-button>
      <el-button @click="controlClick('undo')" :disabled="undoAble">上一步</el-button>
      <el-button @click="controlClick('redo')" :disabled="redoAble">下一步</el-button>
      <el-button @click="controlClick('download')">下载图片</el-button>
      <el-button @click="controlClick('clear')">清空</el-button>
      <el-button @click="controlClick('data')">查看数据</el-button>
      <el-button @click="controlClick('map')">查看缩略图</el-button>
      <el-button @click="controlClick('import')">导入</el-button>
      <el-button @click="controlClick('save')" v-if="!isSilentMode">保存</el-button>
    </el-button-group>
  </div>
</template>

<script setup lang="ts">

withDefaults(
    defineProps<{
      undoAble: boolean
      redoAble: boolean
      isSilentMode?: boolean
    }>(),
    {
      isSilentMode:false
    }
)

const emits = defineEmits<{
  (e: 'click', type: string): void
}>()

const controlClick = (type: string) => {
  emits('click', type)
}
</script>

<style scoped>

</style>