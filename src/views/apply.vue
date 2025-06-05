<template>
  <FlowFormDetail :detail="false" ref="flowFormDetailEl" @submit="submit"/>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {useRoute, useRouter} from "vue-router";
import FlowFormDetail from './components/flowDetail.vue'
import getRequest from "@/api";
import {ElMessage} from "element-plus";
import {getUserInfo} from "@/utils";

const router = useRouter();

const route = useRoute()

const flowFormDetailEl = ref()

const submit = (val: string) => {
  const data = {
    userId: getUserInfo().id, // 申请人id 这里没会员登录暂固定为1
    formContent: val,
    flowId: route.query.id,
    approver: '' // 如果有用户自定的选择人
  }
  getRequest('saveFlow', data)
      .then(() => {
        ElMessage({
          message: '保存成功',
          type: 'success',
        })
        router.push({path: '/my'})
      })
}

onMounted(() => {
  if (route.query.id) {
    flowFormDetailEl.value.getFlowDesignDetail(route.query.id)
  }
})

</script>

<style scoped>

</style>