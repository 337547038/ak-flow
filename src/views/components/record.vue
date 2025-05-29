<template>
  <el-table :data="tableData">
    <el-table-column label="审批人" prop="userName"></el-table-column>
    <el-table-column label="节点名称" prop="nodeName"></el-table-column>
    <el-table-column label="处理时间" prop="dateTime">
      <template #default="{row}">
        {{ dateFormatting(row.dateTime) }}
      </template>
    </el-table-column>
    <el-table-column label="状态" prop="status">
      <template #default="{row}">
        <el-tag :type="getTagStatus(row.status)">
          {{ getStatus[row.status] }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="审批意见" prop="remark"></el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import {ref} from "vue";

const tableData = ref([])
import getRequest from "@/api"
import {dateFormatting} from "@/utils";

//1同意 2拒绝 3返回发起人 4撤回 5抄送同意 6系统通过
const getStatus = {1: '同意', 2: '拒绝', 3: '返回发起人', 4: '撤回', 5: '同意',6:'同意'};

const getData = (flowId: number) => {
  if (tableData.value?.length === 0) {
    getRequest("getFlowRecord", {flowId: flowId})
        .then(res => {
          tableData.value = res.list
        })
  }
}

const getTagStatus = (status: number) => {
  switch (status) {
    case 1:
    case 5:
      return "success";
    case 2:
      return "danger";
    case 3:
      return "warning";
    case 4:
      return "primary";
    case 6:
      return "info";
  }
}

defineExpose({getData})
</script>

<style scoped>

</style>