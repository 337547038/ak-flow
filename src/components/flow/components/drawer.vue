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
        <template v-if="['userTask','sysTask'].includes(nodeType)">
          <el-form-item label="节点审批人">
            <el-radio-group v-model="flowData.userType" @change="userTypeChange">
              <el-radio
                  v-for="(item, key) in userTypeList"
                  :key="key"
                  :value="key"
                  :disabled="['2','5'].includes(key.toString())">
                {{ item }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="['1','2'].includes(flowData.userType)">
            <el-button type="primary" @click="selectClick">
              选择/修改{{ userTypeList[flowData.userType] }}
            </el-button>
          </el-form-item>
          <el-form-item v-show="['1','2'].includes(flowData.userType)">
            <el-tag style="margin-right: 5px" closable
                    v-for="(item,index) in userTagList"
                    :key="item.id"
                    @close="tagClose(index)">
              {{ item.userName }}
            </el-tag>
          </el-form-item>
          <el-form-item label="审批方式">
            <el-radio-group v-model="flowData.flowType" disabled>
              <el-radio :value="1">所有人审批</el-radio>
              <el-radio :value="2">只需一人审批</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="tip">
            <div>提示：</div>
            <div>· 审批人为空时，自动跳过</div>
            <div>· 若审批人离职，会自动转交给审批人的上级代为处理</div>
          </div>
        </template>
        <template v-else-if="nodeType === 'connection'">
          <el-form-item>
            <div>条件规则</div>
            <el-input type="textarea" :rows="5" v-model="flowData.expr"/>
          </el-form-item>
          <div class="tip">
            可使用运算符+-*/()&lt;&gt;=&&||符号编写条件规则，如name即为流程表单输入字段名称为name的值。<br/>
            如请假流程表单day为请假天数，当条件规则设置为 day>2
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
  <UserSelect ref="userSelectEl" @confirm="confirmSelectUser"/>
</template>
<script setup lang="ts">
import {ref} from 'vue'
import UserSelect from './userSelect.vue'
import {ElMessage} from "element-plus";

withDefaults(
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
  flowType: 2
})
const flowNodeId = ref()
const nodeText = ref('')

const open = (data: any, callback: Function) => {
  flowData.value = Object.assign({}, {flowType: 2}, data.properties || {})
  flowNodeId.value = data.id
  nodeText.value = data.text?.value
  visible.value = true
  nodeType.value = data.type
  callbackFn.value = callback
  const joinName = data.properties.joinName
  userTagList.value = []
  if (joinName) {
    const joinUserId = data.properties.joinUserId || ''
    const userIdSplit = joinUserId.split(',')
    joinName.split(',').forEach((item, index) => {
      userTagList.value.push({userName: item, id: userIdSplit[index]})
    })
  }

}
const confirmClick = () => {
  //节点审批人选择了指定成员和指定角色时，显示具体选择的，否则参与人处显示领导名
  if (['1', '2'].includes(flowData.value.userType)) {
    if (userTagList.value?.length) {
      const name = []
      const ids = []
      userTagList.value.forEach(item => {
        name.push(item.userName)
        ids.push(item.id)
      })
      flowData.value.joinName = name.join(',')
      flowData.value.joinUserId = ids.join(',')
    } else {
      ElMessage({
        message: '请选择用户',
        type: 'warning',
      })
      return false
    }

  } else {
    flowData.value.joinName = userTypeList[flowData.value.userType]
  }
  callbackFn.value && callbackFn.value(flowData.value, nodeText.value)
  visible.value = false
}

// 这里是选择用户弹出
const userSelectEl = ref<HTMLSelectElement | null>(null)
const selectClick = () => {
  userSelectEl.value.open()
}
const userTagList = ref([])
const confirmSelectUser = (rows: { [key: string]: number | string }) => {
  userTagList.value = rows
}
const tagClose = (index: number) => {
  userTagList.value.splice(index, 1)
}

const userTypeChange = () => {
  userTagList.value = []
}
defineExpose({open})
</script>
