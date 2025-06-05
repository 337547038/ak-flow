<template>
  <div class="container">
    <h1>欢迎使用ak-design流程图编辑设计器</h1>
    <div style="font-size: 16px;line-height: 30px">
      拖拽式编辑：支持节点、连线拖拽生成，提升开发效率<br>
      可视化模型：通过 LogicFlow 提供的直观可视化界面，用户可以轻松创建、编辑和管理复杂的逻辑流程图<br>
      高可定制性：用户可以根据自己的需要定制节点、连接器和样式，创建符合特定用例的定制逻辑流程图<br>
      灵活易拓展: 内置提供丰富的插件，用户也可根据自身需求定制复杂插件实现业务需求<br>
      节点样式动态化：支持各审批节点和连线根据流程状态显示不同展示效果，如颜色等<br>
      适合二次开发及用于学习
    </div>
    <div style="padding-top: 20px">
      <el-button type="primary" size="large" @click="$router.push({ path: '/design' })">流程设计</el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
/*保存用户登录信息*/
</script>
<style scoped>
.container {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center
}
</style>