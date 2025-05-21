<template>
  <div class="flow-html-content">
    <div class="label">{{ state.nodeName }}</div>
    <div class="content">
      <p class="gray">参与人：</p>
      <p>{{ state.userName }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {reactive,computed} from 'vue'
import {getNodeStroke} from '../tools'

const state = reactive({
  nodeName: '',
  userName: '',
  status: '',
})

const getThemeColor=computed(() => getNodeStroke(state.status))


const updateProps = ({nodeName, userName, status}) => {
  state.nodeName = nodeName
  state.userName = userName
  state.status = status
}
defineExpose({updateProps})
</script>

<style scoped lang="scss">
.flow-html-content {
  border: 1px solid v-bind(getThemeColor);
  height: 80px;
  box-sizing: border-box;
  border-radius: 5px;
}

.label {
  background: v-bind(getThemeColor);
  // background: #1b7fff;
  color: #fff;
  padding: 0 10px;
  height: 32px;
  line-height: 32px;
}

.content {
  padding: 2px 10px;

  p {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    margin: 0;
    padding: 0;
  }

  .gray {
    color: #666
  }
}
</style>