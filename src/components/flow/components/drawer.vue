<template>
  <el-drawer v-model="visible" direction="rtl" title="设置节点属性" size="500px" modal-class="flow-modal-class"
             :append-to-body="true">
    <div class="flow-drawer">
      <el-form :disabled="disabled">
        <el-form-item label="节点id">
          <el-input v-model="flowNodeId" disabled></el-input>
        </el-form-item>
        <el-form-item label="显示名称">
          <el-input placeholder="请输入显示名称" v-model="nodeText"></el-input>
        </el-form-item>
        <template v-if="nodeType==='task'">

          <el-form-item label="节点审批人">
            <el-radio-group v-model="flowData.userType">
              <el-radio v-for="(item, key) in userTypeList" :key="key" :value="key">
                {{ item }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="['1','2'].includes(flowData.userType)">
            <el-button type="primary" @click="selectClick">
              选择/修改{{ userTypeList[flowData.userType] }}
            </el-button>
          </el-form-item>
          <!--          <el-form-item>
                      <el-tag style="margin-right: 5px" closable
                              v-for="(item, index) in userTagList" :key="item" @close="tagClose(index)">
                        {{ item }}
                      </el-tag>
                    </el-form-item>-->
          <el-form-item label="审批方式">
            <el-radio-group v-model="flowData.flowType">
              <el-radio value="1">所有人审批</el-radio>
              <el-radio value="2">只需一人审批</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="tip">
            <div>提示：</div>
            <div>· 审批人为空时，自动跳过</div>
            <div>· 若审批人离职，会自动转交给审批人的上级代为处理</div>
          </div>
        </template>
        <template v-else-if="nodeType === 'polyline'">
          <el-form-item>
            <div>条件规则</div>
            <el-input type="textarea" :rows="5" v-model="flowData.expr"/>
          </el-form-item>
          <div class="tip">
            可使用运算符+-*/()&lt;&gt;=&&||符号编写条件规则，$代表当前流程表单所有值，如$.name即为流程表单输入字段名称为name的值。<br/>
            如请假流程表单day为请假天数，当条件规则设置为 $.day>2
            即表示请假天假大于2天时，该条件成立
          </div>
        </template>
        <el-form-item></el-form-item>
        <el-form-item>
          <el-button @click="visible = false">取消</el-button>
          <el-button type="primary" @click="confirmClick">确认</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-drawer>
</template>
<script setup lang="ts">
import {ref, computed, reactive} from 'vue'

const props = withDefaults(
    defineProps<{
      disabled?: boolean
    }>(),
    {
      disabled: false
    }
)

const userTypeList = {
  1: '指定成员',
  2: '指定角色',
  3: '直接领导',
  4: '发起人自选',
  5: '连续多级主管'
}
const visible = ref(false)
const nodeType = ref()
const callbackFn = ref()
const flowData = ref({
  userType: '',
  flowType: '',
  expr: ''
})
const flowNodeId = ref()
const nodeText = ref('')
const checkedName = ref('') // 节点审批人
const open = (data: any, callback: Function) => {
  flowData.value = data.properties || {}
  flowNodeId.value = data.id
  nodeText.value = data.text?.value
  visible.value = true
  nodeType.value = data.type
  callbackFn.value = callback
  checkedName.value = data.properties.joinName
}
const confirmClick = () => {
  visible.value = false
  //节点审批人选择了指定成员和指定角色时，显示具体选择的，否则参与人处显示领导名
  if (['1', '2'].includes(flowData.value.userType)) {
    // todo 暂无成员可选择
    flowData.value.joinName = ''
  } else {
    flowData.value.joinName = userTypeList[flowData.value.userType]
  }
  callbackFn.value && callbackFn.value(flowData.value, nodeText.value)
}

// 这里是选择用户弹出
const selectClick = () => {

}
defineExpose({open})
</script>
