<template>
  <div class="apply">
    <div class="group" v-for="(item,key) in dataList" :key="key">
      <h3>{{ flowClassify[key] }}</h3>
      <ul>
        <li v-for="(li,index) in item" :key="index" @click="click(li)">{{ li.name }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import getRequest from '../api'
import {ref, onMounted} from 'vue'
import {flowClassify} from '@/utils'
import {useRouter} from "vue-router";

const router = useRouter()
const click = (row) => {
  router.push({path: '/apply', query: {id: row.id}})
}
const dataList = ref([])
const getDataList = () => {
  getRequest('getDesignFlow',{status:1})
      .then(({list}) => {
        dataList.value = list.reduce((acc, item) => {
          const classify = item.classify;
          if (!acc[classify]) {
            acc[classify] = [];
          }
          acc[classify].push({name: item.name, id: item.id});

          return acc;
        }, {});
      })
}
onMounted(() => {
  getDataList()
})
</script>

<style scoped>
.group {
  margin-bottom: 40px
}

.group h3 {
  border-bottom: 1px solid #ddd;
  padding-bottom: 5px;
  font-size: 16px;
}

.group ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.group li {
  margin: 0;
  padding: 0;
  margin-right: 20px;
  cursor: pointer
}

.group li:hover {
  opacity: .6
}
</style>