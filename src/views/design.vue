<template>
  <div class="design">
    <flow-design :isSilentMode="isSilentMode" ref="flowDesignEl"/>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, onMounted} from 'vue'
import {useRoute} from "vue-router";
import FlowDesign from '../components/flow/index'
import getRequest from '../api/index'

const route = useRoute();

const isSilentMode = computed(() => {
  return route.query.type === 'detail'
})

const flowDesignEl = ref()
// 获取流程图数据
const getFlowData = () => {
  const flowId = route.query.id
  if (flowId) {
    getRequest('getFlow')
        .then(data => {
          const id = parseInt(flowId)
          flowDesignEl.value.render(data[id - 1].flow)
        })
  }
}

onMounted(() => {
  getFlowData()
})
</script>

<style scoped>

</style>