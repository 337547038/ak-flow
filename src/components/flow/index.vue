<template>
  <div class="flow-container">
    <div id="container" ref="containerEl" class="flow-main"></div>
    <ControlMenu @click="controlClick" :undoAble="undoDisable" :redoAble="redoDisable" :isSilentMode="isSilentMode"/>
    <DataDialog ref="dataDialogEl"/>
    <Drawer ref="drawerEl" :disabled="isSilentMode" :sourceApply="sourceApply"/>
    <importDialog ref="importDataEl"/>
    <Legend v-if="isSilentMode"/>

  </div>
</template>
<script setup lang="ts">
import {nextTick, onMounted, ref} from 'vue'
import LogicFlow from "@logicflow/core"
import "@logicflow/core/dist/index.css"
import '@logicflow/extension/lib/style/index.css'
import {DndPanel, DynamicGroup, Menu, MiniMap, SelectionSelect, Snapshot} from "@logicflow/extension"
import dragMenu from './components/menu.ts'
import ControlMenu from './components/control.vue'
import DataDialog from "./components/dataDialog.vue"
import importDialog from "./components/importDialog.vue"
import Drawer from './components/drawer.vue'
import registerNode from './node/index'
import Legend from './components/legend.vue'
import {anyType} from './types'

const props = withDefaults(
    defineProps<{
      isSilentMode?: boolean // 不能编辑
      sourceApply?: boolean // 是否来自于发起申请页
    }>(),
    {
      isSilentMode: false //只读模式
    }
)

const emits = defineEmits<{
  (e: 'submitClick', value: string): void
}>()

const containerEl = ref()
const akFlow = ref()
const dataDialogEl = ref()
const importDataEl = ref()
const drawerEl = ref()
LogicFlow.use(DndPanel)
LogicFlow.use(SelectionSelect)
//LogicFlow.use(Control)
LogicFlow.use(Snapshot)
LogicFlow.use(MiniMap)

const initFlow = () => {
  const lf = new LogicFlow({
    container: containerEl.value,
    plugins: [Menu, DynamicGroup],
    grid: {
      size: 20,
      visible: true,
      type: "dot",
      config: {
        color: "#ababab",
        thickness: 1,
      },
    },
    /*style: { // 设置主题
      polyline: {
        stroke: "#1b7fff",
        strokeWidth: 2,
      }
    }*/
    isSilentMode: props.isSilentMode
  });
  // 为右键菜单追加选项（必须在 lf.render() 之前设置）
  /*   lf.extension.menu.addMenuConfig({
       nodeMenu: [
         {
           text: "分享",
           callback() {
             alert("分享成功！");
           },
         },
         {
           text: "属性",
           callback(node: any) {

           },
         },
       ]
     });*/

  // 注册自定义节点
  registerNode(lf)
  // lf.render()
  lf.render({
    "nodes": [{
      "id": "start",
      "type": "start",
      "x": 264,
      "y": 164,
      "properties": {"width": 40, "height": 40},
      "text": {"x": 264, "y": 164, "value": "开始"}
    }], "edges": []
  })
  // 添加左则拖拽面板菜单

  if (!props.isSilentMode) {
    lf.extension.dndPanel.setPatternItems(dragMenu(() => {
      lf.extension.selectionSelect.openSelectionSelect();
      lf.once('selection:selected', () => {
        lf.extension.selectionSelect.closeSelectionSelect();
      });
    }))
  }
  // 右上控制面板
  akFlow.value = lf
}

const controlClick = (type: string) => {
  switch (type) {
    case "zoomIn":
      akFlow.value.zoom(true)
      break
    case "zoomOut":
      akFlow.value.zoom(false)
      break
    case 'resetZoom':
      akFlow.value.resetZoom()
      break
    case 'resetTranslate':
      akFlow.value.resetZoom()
      akFlow.value.resetTranslate()
      break
    case 'undo':
      akFlow.value.undo()
      break
    case 'redo':
      akFlow.value.redo()
      break
    case 'download':
      akFlow.value.getSnapshot()
      break
    case 'map':
      akFlow.value.extension.miniMap.show(akFlow.value.graphModel.width - 205, 60)
      break
    case 'data':
      dataDialogEl.value.open(akFlow.value.getGraphData())
      break
    case 'clear':
      akFlow.value.clearData();
      break
    case 'import':
      importDataEl.value.open((data: string) => {
        // 重新渲染
        if (data) {
          try {
            akFlow.value.render(JSON.parse(data))
          } catch (err) {
          }
        }
      })
      break
    case 'save':
      emits('submitClick', JSON.stringify(akFlow.value.getGraphData()))
      break
    default:
      break
  }
}

const undoDisable = ref(true)
const redoDisable = ref(true)
const flowEvent = () => {
  akFlow.value.on('history:change', ({data}: anyType) => {
        undoDisable.value = !data.undoAble
        redoDisable.value = !data.redoAble
      }
  )
  akFlow.value.on('node:click', ({data}: anyType) => {
    // console.log(data)
    // 用户任务和条件判断才弹出
    if (['start', 'userTask', 'sysTask', 'end'].includes(data.type)) {
      setPropertiesText(data)
    }
  })
  akFlow.value.on('edge:click', ({data}: anyType) => {
    setPropertiesText(data)
  })
}

const setPropertiesText = (data: anyType) => {

  drawerEl.value.open(data, (properties: { [key: string]: number | string | boolean }, text: string) => {
    let updateVal = properties
    // 自定义的task时，显示名称同时更新到properties,
    if (['userTask', 'sysTask'].includes(data.type) && text) {
      updateVal = {...properties, nodeName: text}
    }
    // 编辑模式不修改保存
    if (props.sourceApply || !props.isSilentMode) {
      akFlow.value.setProperties(data.id, updateVal)
      // 更新显示的名称
      akFlow.value.updateText(data.id, text)
    }
  })
}
/**
 * 设置节点状态
 * @param data
 * data:{history:[],active:[]}
 */
const setStatus = (data: anyType) => {
  //console.log(data.includes)
  for (let key in data) {
    if (data[key]?.length) {
      for (let id in data[key]) {
        //console.log("key")
        //console.log(data[key][id])
        akFlow.value.setProperties(data[key][id], {status: key});
      }
    }
  }
}
//渲染流程图
const render = (data: anyType, approver:anyType) => {
  akFlow.value.render(data)
}

const getDesignFlowData = () => {
  return akFlow.value.getGraphData()
}

defineExpose({render, setStatus, getDesignFlowData})

onMounted(() => {
  nextTick(() => {
    initFlow()
    flowEvent()
  })
})

</script>
