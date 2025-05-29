<template>
  <div class="design">
    <flow-design
        :isSilentMode="isSilentMode"
        ref="flowDesignEl"
        @submit-click="submitFlow"/>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, onMounted} from 'vue'
import {useRoute, useRouter} from "vue-router";
import FlowDesign from '../components/flow/index'
import getRequest from '../api/index'
import {ElMessage} from "element-plus";

const route = useRoute();
const router = useRouter();

const isSilentMode = computed(() => {
  return route.query.type === 'detail'
})

const flowDesignEl = ref()

const flowId = computed(() => {
  return route.query.id
})
// 获取流程图数据
const getFlowData = () => {
  if (flowId.value) {
    getRequest('getDesignFlowById', {id: flowId.value})
        .then((res: { [key: string]: any }) => {
          flowDesignEl.value.render(JSON.parse(res.content))
        })
  }
}

const submitFlow = (data: string) => {
  let params: any = {content: data, updateTime: new Date().getTime()};
  let apiKey = 'saveDesignFlow'
  if (flowId.value) {
    apiKey = "editDesignFlow"
    params.id = flowId.value
  } else {
    params.name = '未命名流程'
    params.status = 0
  }
  getRequest(apiKey, params)
      .then(() => {
        ElMessage({
          message: '保存成功',
          type: 'success',
        })
        router.push({path: '/flow'})
      })
}

onMounted(() => {
  getFlowData()
})
</script>

<style scoped>

</style>