<template>
  <FlowFormDetail :detail="false" ref="flowFormDetailEl"/>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {useRoute} from "vue-router";
import FlowFormDetail from './components/flowDetail.vue'

const route = useRoute()

const flowFormDetailEl=ref()

onMounted(() => {
  if (route.query.id) {
    flowFormDetailEl.value.getFlowData(route.query.id)
  }
})

</script>

<style scoped>

</style>