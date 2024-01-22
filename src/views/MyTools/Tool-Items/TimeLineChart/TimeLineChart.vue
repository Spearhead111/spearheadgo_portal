<template>
  <div class="chart-tool-wrapper">
    <div class="chart-data-wrapper">
      <el-upload
        v-model:file-list="fileList"
        class="upload-content"
        :auto-upload="false"
        multiple
        :show-file-list="false"
        :on-change="handleChange"
      >
        <div class="add-data-btn">
          <span class="mr-1">添加数据</span>
          <v-icon icon="mdi-plus-circle" color="#009688"></v-icon>
        </div>
        <template #tip>
          <div class="el-upload__tip flex justify-content-between">
            <span>支持识别txt和excel文件</span>
            <el-link
              href="https://file.spearheadgo.com/file/tools/图表数据模板.xlsx"
              :underline="false"
              type="primary"
            >
              下载模板
            </el-link>
          </div>
          <div class="flex flex-column">
            <span class="font-bold">文件列表</span>
            <ul class="file-list-ul">
              <li v-for="fileName in chartData.fileNames">
                <v-icon
                  size="small"
                  style="position: relative; top: 1px; margin-right: 4px"
                  icon="mdi-file-document-outline"
                />
                <span :title="fileName" class="file-name">{{ fileName }}</span>
                <v-icon
                  class="delete-icon"
                  size="small"
                  @click="removeFile(fileName)"
                  icon="mdi-close"
                />
              </li>
            </ul>
          </div>
        </template>
      </el-upload>
      <div class="variable-list-wrapper pt-3 flex flex-column height-100">
        <v-text-field
          class="flex-0-0"
          v-model="searchVariable"
          density="compact"
          prepend-inner-icon="mdi-magnify"
          clearable
          hide-details
          variant="outlined"
        ></v-text-field>
        <ul class="variable-list">
          <template v-for="(fileNameVars, fileName, index) in chartData.variables">
            <template v-for="(variableName, idx) in fileNameVars">
              <li
                v-show="
                  variableName &&
                  variableName.toLowerCase().includes((searchVariable || '').toLowerCase())
                "
              >
                <v-chip
                  class="variable-chip"
                  label
                  color="#00B8D4"
                  size="small"
                  draggable
                  @dragstart="
                    initDragVariable($event, {
                      fileName: fileName as string,
                      variableName,
                      fileIndex: index,
                      type: VariableFromType.Origin
                    })
                  "
                  @dragend="clearLocationIcon"
                >
                  <v-icon
                    class="mr-1 pre-icon"
                    size="14"
                    color="#0097A7"
                    :icon="`mdi-roman-numeral-${index + 1}`"
                  ></v-icon>
                  <span class="variable-name" :title="variableName">{{ variableName }}</span>
                </v-chip>
              </li>
            </template>
          </template>
        </ul>
      </div>
    </div>
    <div class="chart-setting-wrapper">
      <v-tabs v-model="currTab" class="flex-0-0" bg-color="transparent" color="basil" grow>
        <v-tab v-for="tabItem in CHART_CONFIG_ITEMS" :key="tabItem.name" :value="tabItem.name">
          <span>{{ tabItem.desc }}</span>
        </v-tab>
      </v-tabs>
      <v-window v-model="currTab" class="flex height-100">
        <!-- 基础配置 -->
        <v-window-item :value="CHART_CONFIG_ITEMS.Basic.name" class="tab-item-wrapper">
          <!-- 图表类型 -->
          <p class="font-bold">图表类型</p>
          <ul class="chart-types-ul">
            <li
              v-for="chartType in CHART_TYPES"
              :class="[{ 'chart-type__selected': currChartInfo.chartType === chartType.name }]"
              @click="selectChartType(chartType.name)"
            >
              <v-icon size="26" :icon="chartType.icon"></v-icon>
              <span class="font-12">{{ chartType.desc }}</span>
            </li>
          </ul>
          <!-- 基础配置项 -->
          <p class="font-bold mt-2">基础配置</p>
          <v-expansion-panels multiple variant="accordion" class="basic-config-content">
            <v-expansion-panel
              class="config-item-wrapper"
              :elevation="0"
              v-for="i in 7"
              :key="i"
              expand-icon="mdi-menu-down"
              collapse-icon="mdi-menu-up"
              title="Item"
              text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            ></v-expansion-panel>
          </v-expansion-panels>
        </v-window-item>
        <!-- 分析 -->
        <v-window-item :value="CHART_CONFIG_ITEMS.Analysis.name" class="tab-item-wrapper"
          >2
        </v-window-item>
      </v-window>
    </div>
    <div class="chart-show-wrapper">
      <!-- 维度配置 -->
      <div class="chart-dim-config-wrapper">
        <div class="dim-item-content">
          <span class="dim-name">X轴</span>
          <div
            :class="['dim-content', { 'show-location-icon': isAtXDim }]"
            @dragover.prevent="isAtXDim = true"
            @dragleave.prevent="isAtXDim = false"
            @drop="addXAxis"
          >
            <DimChip
              v-if="currChartInfo.XAxis?.variableName"
              :dim="currChartInfo.XAxis"
              :index="0"
              type="XAxis"
              @delete-dim="deleteAxis"
              @add-dim="addXAxis"
              @init-drag-dim-info="initDragVariable"
            />
          </div>
        </div>
        <div class="dim-item-content">
          <span class="dim-name">指标</span>
          <div
            :class="['dim-content', { 'show-location-icon': isAtYDim }]"
            @dragover.prevent="isAtYDim = true"
            @dragleave.prevent="isAtYDim = false"
            @drop="addIndicator($event)"
          >
            <DimChip
              v-for="(indicator, index) in currChartInfo.indicatorList"
              :dim="indicator"
              type="Indicator"
              :index="index"
              @delete-dim="deleteIndicator"
              @add-dim="addIndicator"
              @init-drag-dim-info="initDragVariable"
            />
          </div>
        </div>
      </div>
      <!-- 图表展示 -->
      <div class="chart-preview-wrapper">
        <div>
          <v-button>预览</v-button>
        </div>
        <div class="chart-preview-content"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import './style.scss'
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as XLSX from 'xlsx'
import { isNumber } from 'lodash'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { UploadProps, UploadUserFile, UploadFile } from 'element-plus'
import { ChartData, ChartInfo, type AxisDimType, AxisDim } from './types'
import {
  CHART_CONFIG_ITEMS,
  CHART_TYPES,
  INDICATOR_MAX_NUM,
  VariableFromType
} from '../../constants/chartConfig'
import DimChip from './DimChip/DimChip.vue'

const fileList = ref<UploadUserFile[]>([])
/** 上传的文件数据 */
const chartData = ref<ChartData>(new ChartData())
/** 变量搜索关键词 */
const searchVariable = ref('')
/** 当前选中的tab页面 */
const currTab = ref(CHART_CONFIG_ITEMS.Basic.name)
/** 要渲染的图表信息 */
const currChartInfo = ref<ChartInfo>(new ChartInfo())
const isAtXDim = ref(false)
const isAtYDim = ref(false)

onBeforeUnmount(() => {
  chartData.value.clear()
})

/** 删除文件数据 */
const removeFile = (fileName: string) => {
  ElMessageBox.confirm(`确定要删除该 ${fileName} 文件的数据吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      chartData.value.deleteData(fileName)
    })
    .catch(() => {
      // catch error
    })
}

/** 上传文件，读取文件信息 */
const handleChange: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
  if (chartData.value.fileNames.length >= 10) {
    ElMessage.error('最多只支持上传10个文件')
    return
  } else if (chartData.value.fileNames.some((fileName) => fileName === uploadFile.name)) {
    ElMessage.warning('请勿上传相同文件名文件')
    return
  }
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = e.target?.result
      if (chartData.value.fileNames.length >= 10) {
        ElMessage.error('最多只支持上传10个文件')
        return
      }
      // 从数据中解析工作簿
      const workbook = XLSX.read(data, { type: 'binary' })
      // 获取第一个工作表
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]
      //变量表头
      const variables = (XLSX.utils.sheet_to_json(sheet, { header: 1 })[0] as string[]).map(
        (variable) => variable.trim()
      )
      // 将工作表转换为JSON对象
      let jsonData = XLSX.utils.sheet_to_json(sheet, { header: variables, blankrows: true })
      // 删除变量表头
      jsonData = jsonData.slice(1)
      // 存储数据
      chartData.value.addData(uploadFile.name, variables, jsonData)
    } catch (error) {
      ElMessage.error(`${uploadFile.name}文件读取失败`)
      console.log(error)
      return
    }
  }
  reader.readAsBinaryString(uploadFile.raw as Blob)
}

/** 选择图表类型 */
const selectChartType = (chartType: string) => {
  currChartInfo.value.chartType = chartType
}

/** 拖拽开始 */
const initDragVariable = (event: DragEvent, varInfo: any) => {
  document.querySelectorAll('.dim-content')?.forEach((ele) => {
    ele.setAttribute('style', 'background-color: #607D8B30')
  })
  event.dataTransfer!.setData('varInfo', JSON.stringify(varInfo))
}

/** 清除光标和区域指示遮罩 */
const clearLocationIcon = () => {
  isAtXDim.value = false
  isAtYDim.value = false
  document.querySelectorAll('.dim-content')?.forEach((ele) => {
    ele.setAttribute('style', 'background-color: transparent;')
  })
}

/** 拖拽放置 */
const addXAxis = (event: DragEvent) => {
  clearLocationIcon()
  // 阻止浏览器默认的拖放行为
  event.preventDefault()
  // 获取拖动的数据
  const data = JSON.parse(event.dataTransfer!.getData('varInfo'))
  if (
    currChartInfo.value.XAxis &&
    data.fileName === (currChartInfo.value.XAxis as AxisDimType).fileName &&
    data.variableName === (currChartInfo.value.XAxis as AxisDimType).variableName
  ) {
    // 如果是同一个字段，则不进行处理
    return
  } else if (currChartInfo.value.XAxis) {
    // 如果已经有x轴字段，则不允许添加
    return ElMessage.warning('X轴只能添加一个维度')
  }
  currChartInfo.value.XAxis = new AxisDim(data)
}

/**
 * 添加指标
 * @param event 拖拽事件
 * @param targetIndex 目标索引位置, 可选参数, 如果存在，则表示将指标放置到指定位置，否则放置到最后
 */
const addIndicator = (event: DragEvent, targetIndex?: number) => {
  clearLocationIcon()
  // 阻止浏览器默认的拖放行为
  event.preventDefault()
  // 获取拖动的数据
  const data = JSON.parse(event.dataTransfer!.getData('varInfo'))
  const newIndicator = new AxisDim(data)
  // 判断拖动的字段来源是指标还是其他
  if (data.type !== 'Indicator') {
    if (currChartInfo.value.indicatorList.length >= INDICATOR_MAX_NUM) {
      return ElMessage.warning(`最多添加${INDICATOR_MAX_NUM}个指标`)
    } else {
      isNumber(targetIndex)
        ? currChartInfo.value.indicatorList.splice(targetIndex, 0, newIndicator)
        : currChartInfo.value.indicatorList.push(newIndicator)
    }
  } else {
    if (isNumber(targetIndex)) {
      if (data.dimCode === currChartInfo.value.indicatorList[targetIndex!].dimCode) {
        return
      } else {
        currChartInfo.value.indicatorList.splice(targetIndex!, 0, newIndicator)
        currChartInfo.value.indicatorList.splice(
          data.index > targetIndex! ? data.index + 1 : data.index,
          1
        )
      }
    } else {
      currChartInfo.value.indicatorList.splice(data.index, 1)
      currChartInfo.value.indicatorList.push(newIndicator)
    }
  }
}

/** 删除x轴字段 */
const deleteAxis = () => {
  currChartInfo.value.XAxis = undefined
}

/** 删除指标 */
const deleteIndicator = (index: number) => {
  currChartInfo.value.indicatorList.splice(index, 1)
}
</script>
