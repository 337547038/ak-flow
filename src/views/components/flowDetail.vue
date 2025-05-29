<template>
  <div>
    <el-tabs @tab-change="tabChange" model-value="form">
      <el-tab-pane label="表单" name="form">
        <component
            :is="component"
            v-if="formType===1"
            ref="flowFormEl"
            :disabled="detail"
            @submit="formSubmit"/>
        <!-- 在线设计的表单
        <ak-design-form v-if="formType==='0'"></ak-design-form>
        -->
        <slot></slot>
      </el-tab-pane>
      <el-tab-pane label="流程图" name="flow">
        <flow-design :isSilentMode="true" ref="flowDesignEl"/>
      </el-tab-pane>
      <el-tab-pane label="审批记录" v-if="detail" name="recoder">
        <RecordList ref="recoderListEl"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, markRaw, nextTick} from 'vue'
import getRequest from '@/api/index'
import FlowDesign from "@/components/flow/index";
import RecordList from './record.vue'

const props = withDefaults(
    defineProps<{
      detail?: boolean // 除了发起流程页为表单信息录入状态，其他均为展示状态true
    }>(),
    {
      detail: true
    }
)
const emits = defineEmits<{
  (e: 'submit', value: string): void
}>()
const flowDesignEl = ref();
const flowFormEl = ref();
const formType = ref()
const component = ref()
const isLoading = ref(false)
const flowId = ref()
const nodeStatus = ref({})

// 获取流程图数据
const getFlowData = (id: string) => {
  flowId.value = id
  getRequest('getFlowById', {id: id})
      .then(async data => {
        nodeStatus.value = data.nodeStatus
        await getFlowDesignDetail(data.flowId)
        // 恢复表单填写的值
        flowFormEl.value.setValue(JSON.parse(data.formContent))
      })
}
const getFlowDesignDetail = (id: number) => {
  return new Promise((resolve, reject) => {
    getRequest('getDesignFlowById', {id: id})
        .then(async data => {
          formType.value = data.formType
          flowDesignEl.value.render(JSON.parse(data.content))
          await getFormComponent(data)
          resolve()
        })
  })
}

// 根据表单类型，回显展示表单
const getFormComponent = (data) => {
  return new Promise(async (resolve, reject) => {
    if (data.formType === 1) {
      // 本地表单组件
      const module = await import(`@/components/flowForm/${data.formId}.vue`)
      component.value = markRaw(module.default)
      resolve()
    } else {
      // todo 在线设计的表单时，从接口获取设计的表单数据回显表单
    }
  })
}

const formSubmit = (val: { [key: string]: any }) => {
  emits("submit", JSON.stringify(val))
}
const recoderListEl = ref()
/**
 * 切换到流程图时，加载并显示节点状态信息
 * @param name
 */
const tabChange = (name: string) => {
  nextTick(() => {
    if (name === 'flow' && props.detail) {
      /*const statusData = {
        history: [
          '216a1b8b-a172-481d-a034-27c2e84232b1',
          'bf576207-d6f2-4f1d-858a-cc87741eea82',
          '876a4605-bc46-4bae-ae1b-0aa518831845',
          'c216ba26-523e-4029-9bcf-c0219fca8b29',
          '75e161ba-2fda-4d61-b9a4-35096eeca9ef'
        ],
        active: ['5ae3399c-f162-4166-a9d3-f08ca6a71e4e', '176067c0-1f72-43c5-a5b5-62a0940d628f'],
        includes: ['ab41bdb7-c590-43e9-8013-ab0dc3b0b386'],
        danger: []
      }*/
      flowDesignEl.value.setStatus(nodeStatus.value)
    } else if (name === "recoder") {
      // 加载记录详情
      recoderListEl.value.getData(flowId.value)
    }
  })
}

defineExpose({getFlowData, getFlowDesignDetail})
onMounted(() => {

})

</script>

<style scoped>

</style>