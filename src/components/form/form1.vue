<template>
  <div>
    <el-form label-width="100" :disabled="disabled">
      <el-form-item label="请假类型">
        <el-select placeholder="请选择请假类型" v-model="formData.type">
          <el-option value="1" label="事假"></el-option>
          <el-option value="2" label="年假"></el-option>
          <el-option value="3" label="病假"></el-option>
          <el-option value="4" label="婚假"></el-option>
          <el-option value="5" label="产假"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开始时间">
        <el-date-picker v-model="formData.startDate" placeholder="请选择开始时间"></el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker v-model="formData.endDate" placeholder="请选择结束时间"></el-date-picker>
      </el-form-item>
      <el-form-item label="请假天数">
        <el-input placeholder="请输入请假天数" v-model="formData.day"></el-input>
      </el-form-item>
      <el-form-item label="请假原因">
        <el-input type="textarea" :rows="5" v-model="formData.remark" placeholder="请输入请假原因"></el-input>
      </el-form-item>
      <el-form-item label="上传附件">
        <el-upload v-model="formData.files">
          <el-button type="primary">选择附件</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">确定</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
defineOptions({name: '请假表单1'})
import {ref} from 'vue'

  const props = withDefaults(
      defineProps<{
        disabled?: boolean
      }>(),
      {
       disabled:false
      }
    )

const formData = ref({})
const setValue = (data) => {
  formData.value = data
}
defineExpose({setValue})
</script>

<style scoped>

</style>