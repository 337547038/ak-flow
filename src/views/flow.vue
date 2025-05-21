<template>
  <div>
    <div class="design-list">
      <el-button type="primary" @click="$router.push({ path: '/design' })">新增设计</el-button>
      <el-table
          :data="tableData"
          style="width: 100%"
      >
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column
            prop="name"
            label="流程名称">
        </el-table-column>
        <el-table-column
            prop="code"
            label="标识">
        </el-table-column>
        <el-table-column
            prop="classify"
            label="分类">
          <template #default="{row}">
            <el-tag>{{ flowClassify[row.classify] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            prop="status"
            label="状态">
        </el-table-column>
        <el-table-column
            prop="date"
            label="更新时间"
            width="180"
        >
        </el-table-column>
        <el-table-column
            label="操作"
            width="200">
          <template #default="scope">
            <el-button link type="primary"
                       @click="$router.push({ path: '/design',query:{id:scope.row.id,type:'detail'} })">查看
            </el-button>
            <el-button link type="primary" @click="$router.push({ path: '/design',query:{id:scope.row.id} })">编辑
            </el-button>
            <el-button link type="primary" @click="setClick(scope.row)">设置</el-button>
            <el-button link type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-drawer v-model="visible" direction="rtl" size="500" title="流程设置">
      <el-form label-width="100" :model="formData">
        <el-form-item label="流程名称">
          <el-input placeholder="请输入流程名称" v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="流程标识">
          <el-input placeholder="请输入流程标识" v-model="formData.code"></el-input>
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="formData.classify">
            <el-option v-for="(item,key) in flowClassify" :value="key" :label="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
              v-model="formData.status"
              :active-value="1"
              :inactive-value="0"
              active-text="启用"
              inactive-text="禁用">
          </el-switch>
        </el-form-item>
        <el-form-item label="图标">
          <el-input placeholder="选择icon图标"></el-input>
        </el-form-item>
        <el-form-item label="表单类型">
          <el-select v-model="formData.formType" @change="formTypeChange">
            <el-option value="0" label="在线创建"></el-option>
            <el-option value="1" label="本地表单"></el-option>
          </el-select>
        </el-form-item>
        <div style="display: flex;justify-content: flex-end;margin-bottom: 18px">
          <el-button type="primary" link @click="addForm">新建表单</el-button>
        </div>
        <el-form-item label="选择表单">
          <el-select v-model="formData.form">
            <el-option
                v-for="item in formOptions"
                :key="item.value"
                :value="item.value"
                :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="visible=false">保存</el-button>
          <el-button @click="visible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'
import getRequest from '../api/index'
import {flowClassify} from '@/utils'

const tableData = ref([])

// 设置弹窗
const visible = ref(false)
const formData = ref({
  name: '',
  status: 1,
  formType: '0',
  classify: 0
})
const formOptions = ref([])
const formTypeChange = (val: string) => {
  formData.value.form = ''
  if (val === '0') {
    getFormList()
  } else {
    // 扫描本地创建的表单
    getVueFrom()
  }
}

const getFormList = () => {
  // 从接口获取已创建的表单
  getRequest('getForm', '')
      .then((data) => {
        formOptions.value = data
      })
}
const getVueFrom = () => {
  const modules = import.meta.glob('../components/form/*.vue', {eager: true})
  formOptions.value = []
  console.log(modules)
  for (const path in modules) {
    const module = modules[path].default
    formOptions.value.push({
      label: module.name,
      value: module.__name
    })
  }
}
const setClick = (row) => {
  visible.value = true
  formData.value = row
  if (row.formType === '0') {
    getFormList()
  } else {
    getVueFrom()
  }
}
const addForm = () => {
  window.location.href = 'https://337547038.github.io/vue-form-design/#/design/form'
}

const getFlowList = () => {
  getRequest('getFlow', '')
      .then((data) => {
        tableData.value = data
      })
}

onMounted(() => {
  getFlowList()
})
</script>

<style scoped>

</style>