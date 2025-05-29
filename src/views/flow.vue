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
            <el-tag v-if="row.classify">{{ flowClassify[row.classify] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            prop="status"
            label="状态">
          <template #default="{row}">
            <el-tag type="primary" v-if="row.status===1">启用</el-tag>
            <el-tag type="danger" v-if="row.status===0">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            prop="updateTime"
            label="更新时间"
            width="180"
        >
          <template #default="{row}">
            {{ dateFormatting(row.updateTime) }}
          </template>
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
            <el-popconfirm
                class="box-item"
                title="确定删除该流程记录吗"
                placement="top-start"
                @confirm="delClick(scope.row.id)"
            >
              <template #reference>
                <el-button link type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex;justify-content: flex-end;padding: 20px 0">
        <el-pagination
            layout="prev, pager, next"
            :total="total"
            :page-size="20"
            :current-change="currentChange"
            hide-on-single-page/>
      </div>
    </div>
    <el-drawer v-model="visible" direction="rtl" size="500" title="流程设置">
      <el-form label-width="100" :model="formData" :rules="rules" ref="formEl">
        <el-form-item label="流程名称" prop="name">
          <el-input placeholder="请输入流程名称" v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="流程标识">
          <el-input placeholder="请输入流程标识" v-model="formData.code"></el-input>
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="formData.classify">
            <el-option v-for="(item,key) in flowClassify" :value="parseInt(key.toString())" :label="item">
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
        <el-form-item label="表单类型" prop="formType">
          <el-select v-model="formData.formType" @change="formTypeChange">
            <el-option :value="0" label="在线创建"></el-option>
            <el-option :value="1" label="本地表单"></el-option>
          </el-select>
        </el-form-item>
        <div style="display: flex;justify-content: flex-end;margin-bottom: 18px">
          <el-button type="primary" link @click="addForm">新建表单</el-button>
        </div>
        <el-form-item label="选择表单" prop="form">
          <el-select v-model="formData.formId">
            <el-option
                v-for="item in formOptions"
                :key="item.value"
                :value="item.value"
                :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitClick">保存</el-button>
          <el-button @click="visible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, reactive} from 'vue'
import getRequest from '../api/index'
import {flowClassify, dateFormatting} from '@/utils'
import {ElMessage} from "element-plus";

const total = ref(0)
const tableData = ref([])
const currentChange = (val: number) => {
  getFlowList(val)
}

const rules = reactive({
  name: [{required: true, message: '请输入流程名称', trigger: 'blur'}],
  formType: [{required: true, message: '请选择表单类型', trigger: 'change'}],
  formId: [{required: true, message: '请选择表单', trigger: 'change'}]
})

// 设置弹窗
const visible = ref(false)
const formData = ref({
  name: '',
  status: 0,
  formType: 0,
  classify: 0
})
const formOptions = ref([])
const formTypeChange = (val: string) => {
  formData.value.formId = ''
  if (!val) {
    getFormList()
  } else {
    // 扫描本地创建的表单
    getVueFrom()
  }
}

const getFormList = () => {
  // 从接口获取已创建的表单
  /*  getRequest('getForm', {})
        .then((data) => {
          formOptions.value = data
        })*/
  // 这里请求已设计好的在线表单
  setTimeout(() => {
    formOptions.value = [
      {
        "label": "请假",
        "value": "1"
      },
      {
        "label": "加班",
        "value": "2"
      },
      {
        "label": "通用审批",
        "value": "3"
      },
      {
        "label": "出差申请",
        "value": "4"
      }
    ]
  })
}
const getVueFrom = () => {
  const modules = import.meta.glob('../components/flowForm/*.vue', {eager: true})
  formOptions.value = []
  // console.log(modules)
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
  formData.value = JSON.parse(JSON.stringify(row))
  if (row.formType === 0) {
    getFormList()
  } else {
    getVueFrom()
  }
}

const delClick = (id: number) => {
  getRequest('editDesignFlowDel', {id: id.toString()})
      .then(() => {
        ElMessage({
          message: '删除成功',
          type: 'success',
        })
        visible.value = false
        getFlowList()
      })
}

const addForm = () => {
  window.location.href = 'https://337547038.github.io/vue-form-design/#/design/form'
}

const getFlowList = (currentPage = 1) => {
  getRequest('getDesignFlow', {extend: {pageNum: currentPage}})
      .then((res: any) => {
        tableData.value = res.list
      })
}
const formEl = ref()
const submitClick = async () => {
  await formEl.value.validate((valid, fields) => {
    if (valid) {
      formData.value.updateTime = new Date().getTime()
      getRequest('editDesignFlow', formData.value)
          .then(() => {
            ElMessage({
              message: '保存成功',
              type: 'success',
            })
            visible.value = false
            getFlowList()
          })
    }
  })

}
onMounted(() => {
  getFlowList()
})
</script>

<style scoped>

</style>