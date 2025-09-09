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
        <div v-if="formType===0">可自行集成ak-design的拖拽表单<br>
          https://337547038.github.io/vue-form-design/#/design/form
        </div>
        <slot></slot>
      </el-tab-pane>
      <el-tab-pane label="流程图" name="flow">
        <flow-design :isSilentMode="true" ref="flowDesignEl" :sourceApply="!detail"/>
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
import {ElMessage} from "element-plus";

const props = withDefaults(
    defineProps<{
      detail?: boolean // 除了发起流程页为表单信息录入状态，其他均为展示状态true
    }>(),
    {
      detail: true
    }
)
const emits = defineEmits<{
  (e: 'submit', value: string, approver: string): void
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
        await getFlowDesignDetail(data.flowId, data.approver)
        // 恢复表单填写的值
        flowFormEl.value.setValue(JSON.parse(data.formContent))
      })
}
const getFlowDesignDetail = (flowId:number, approver?: string) => {
  return new Promise((resolve, reject) => {
    getRequest('getDesignFlowById', {id: flowId})
        .then(async data => {
          formType.value = data.formType
          // 如果有自选审批人的，则将自选的合并进去,以恢复显示
          const designFlowData = JSON.parse(data.content)
          if (approver) {
            const jsonApprover = JSON.parse(approver)
            designFlowData.nodes.forEach(item => {
              const key = jsonApprover[item.id]
              if (key && item.properties.userType === '4') {
                item.properties.joinName = key.name
                item.properties.joinUserId = key.id
              }
            })
          }
          flowDesignEl.value.render(designFlowData)
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
  // 检查流程图是否存在自选人的情况
  const flowData = flowDesignEl.value.getDesignFlowData()
  const temp = []
  const approver = {} // 审批信息
  flowData.nodes?.forEach(item => {
    if (['userTask', 'sysTask'].includes(item.type)) {
      const {userType, joinUserId, nodeName, joinName} = item.properties || {}
      if (userType === '4' && !joinUserId) {
        // 发起人自选,没有选择用户时
        temp.push(`审批节点：${nodeName}需要选择审批人`)
      }
      if (userType === '4' && joinUserId) {
        approver[item.id] = {id: joinUserId, name: joinName}
      }
    }
  })
  if (temp.length > 0) {
    ElMessage({
      message: temp[0],
      type: 'error',
    })
  } else {
    emits("submit", JSON.stringify(val), JSON.stringify(approver))
  }
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
  let pageType = ''
  if (props.detail) {
    pageType = 'detail'
  }
  window.sessionStorage.setItem("pageType", pageType)
})

</script>

<style scoped>

</style>