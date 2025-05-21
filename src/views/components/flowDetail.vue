<template>
  <div>
    <el-tabs @tab-change="tabChange" model-value="form">
      <el-tab-pane label="表单" name="form">
        <component
            :is="component"
            v-if="formType==='1'"
            ref="flowFormEl"
            :disabled="detail"/>
        <!--        在线设计的表单
        <ak-design-form v-if="formType==='0'"></ak-design-form>
        -->
        <slot></slot>
      </el-tab-pane>
      <el-tab-pane label="流程图" name="flow">
        <flow-design :isSilentMode="true" ref="flowDesignEl"/>
      </el-tab-pane>
      <el-tab-pane label="审批记录" v-if="detail" name="recoder">审批记录</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, markRaw, nextTick} from 'vue'
import getRequest from '@/api/index'
import FlowDesign from "@/components/flow/index";

const props = withDefaults(
    defineProps<{
      detail?: boolean // 除了发起流程页为表单信息录入状态，其他均为展示状态true
    }>(),
    {
      detail: true
    }
)
const flowDesignEl = ref();
const flowFormEl = ref();
const formType = ref()
const component = ref()
const isLoading = ref(false)

// 获取流程图数据
const getFlowData = (id: string) => {
  getRequest('getFlow')
      .then(data => {
        const result = data[parseInt(id) - 1]
        formType.value = result.formType
        flowDesignEl.value.render(result.flow)
        getFormComponent(result)
      })
}

// 根据表单类型，回显展示表单
const getFormComponent = async (data) => {
  if (data.formType === '1') {
    // 本地表单组件
    const module = await import(`@/components/form/${data.form}.vue`)
    component.value = markRaw(module.default)
  } else {
    // todo 在线设计的表单时，从接口获取设计的表单数据回显表单
  }
}
// 这里根据条件回显表单的值
const setFormValue = () => {
  nextTick(() => {
    setTimeout(() => {
      flowFormEl.value.setValue({
        type: '1',
        startDate: "1991-01-01",
        endDate: "1991-01-02",
        day: 2,
        remark: '想请就请，不需要理由'
      })
    }, 500)
  })
}

/**
 * 切换到流程图时，加载并显示节点状态信息
 * @param name
 */
const tabChange = (name: string) => {
  nextTick(() => {
    if (name === 'flow' && props.detail && !isLoading.value) {
      isLoading.value = true
      const statusData = {
        history: [
          '216a1b8b-a172-481d-a034-27c2e84232b1',
          'bf576207-d6f2-4f1d-858a-cc87741eea82',
          '876a4605-bc46-4bae-ae1b-0aa518831845',
          'c216ba26-523e-4029-9bcf-c0219fca8b29',
          '75e161ba-2fda-4d61-b9a4-35096eeca9ef'
        ],
        active: ['8cdc509c-4d6b-4d84-b070-ead0728ebbca', 'eefc675c-15d4-487d-99d5-15047c6f9106'],
        info: ['ab41bdb7-c590-43e9-8013-ab0dc3b0b386'],
        danger: []
      }
      flowDesignEl.value.setStatus(statusData)
    }
  })
}

defineExpose({getFlowData, setFormValue})
onMounted(() => {

})

</script>

<style scoped>

</style>