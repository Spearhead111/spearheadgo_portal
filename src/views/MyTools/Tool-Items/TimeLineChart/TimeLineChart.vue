<template>
  <div class="chart-tool-wrapper">
    <div class="chart-data-wrapper">
      <el-upload
        :disabled="onReadingFile"
        v-model:file-list="fileList"
        class="upload-content"
        :auto-upload="false"
        multiple
        :show-file-list="false"
        :on-change="handleChange"
      >
        <div class="add-data-btn">
          <span class="mr-1">{{ onReadingFile ? '正在读取数据，请稍等' : '添加数据' }}</span>
          <v-icon icon="mdi-plus-circle" color="#009688"></v-icon>
        </div>
        <template #tip>
          <div class="el-upload__tip flex align-center justify-content-between">
            <div>
              <span>支持识别excel/csv文件</span>
              <v-tooltip
                width="360"
                location="top"
                text="支持识别excel/csv文件以及类csv的文本文件(txt)，类cxv指分隔符为制表位或逗号分隔符号的文本文件"
              >
                <template v-slot:activator="{ props }">
                  <v-icon
                    v-bind="props"
                    class="cursor-pointer ml-1"
                    icon="mdi-help-circle-outline"
                  />
                </template>
              </v-tooltip>
            </div>
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

        <v-form ref="chartInfoFormRef">
          <v-window-item :value="CHART_CONFIG_ITEMS.Basic.name" class="tab-item-wrapper">
            <!-- 图表类型 -->
            <p class="font-bold">图表类型</p>
            <ul class="chart-types-ul">
              <li
                v-for="chartType in CHART_TYPES_ICON"
                :class="[{ 'chart-type__selected': currChartInfo.chartType === chartType.name }]"
                @click="selectChartType(chartType.name)"
              >
                <v-icon size="26" :icon="chartType.icon"></v-icon>
                <span class="font-12">{{ chartType.desc }}</span>
              </li>
            </ul>
            <!-- 基础配置项 -->
            <p class="font-bold mt-2">基础配置</p>
            <v-expansion-panels
              v-model="panels"
              multiple
              variant="accordion"
              class="basic-config-content"
            >
              <v-expansion-panel
                class="config-item-wrapper"
                :elevation="0"
                expand-icon="mdi-menu-down"
                collapse-icon="mdi-menu-up"
                title="基础配置"
              >
                <v-expansion-panel-text>
                  <span>图表名称</span>
                  <v-text-field
                    v-model="currChartInfo.chartName"
                    :rules="rules.chartName"
                    variant="outlined"
                    density="compact"
                    counter="20"
                    placeholder=""
                    clearable
                    single-line
                    hide-details="auto"
                  ></v-text-field>
                </v-expansion-panel-text>
              </v-expansion-panel>
              <v-expansion-panel
                class="config-item-wrapper"
                :elevation="0"
                expand-icon="mdi-menu-down"
                collapse-icon="mdi-menu-up"
                title="数据配置"
              >
                <v-expansion-panel-text>
                  <v-switch
                    v-model="currChartInfo.omitDefaultVals"
                    class="config-switch"
                    hide-details
                    label="省略缺省值"
                    color="var(--primary-selected-color)"
                  ></v-switch>
                  <!-- 缺省值设置 -->
                  <div class="config-label-num-input" v-if="currChartInfo.omitDefaultVals">
                    <span>缺省值设置</span>
                    <v-text-field
                      v-model="currChartInfo.defaultVal"
                      type="number"
                      variant="outlined"
                      density="compact"
                      placeholder=""
                      single-line
                      hide-details
                    ></v-text-field>
                  </div>
                  <v-switch
                    v-model="currChartInfo.yAxisSetting.autoAdapt"
                    class="config-switch"
                    hide-details
                    label="数据轴自适应"
                    color="var(--primary-selected-color)"
                  ></v-switch>
                  <template v-if="!currChartInfo.yAxisSetting.autoAdapt">
                    <div class="config-label-num-input has-detail">
                      <span>最大值</span>
                      <v-text-field
                        v-model="currChartInfo.yAxisSetting.max"
                        type="number"
                        variant="outlined"
                        density="compact"
                        placeholder=""
                        single-line
                      ></v-text-field>
                    </div>
                    <div class="config-label-num-input has-detail">
                      <span>最小值</span>
                      <v-text-field
                        v-model="currChartInfo.yAxisSetting.min"
                        :rules="rules.yAxisSettingMin"
                        type="number"
                        variant="outlined"
                        density="compact"
                        placeholder=""
                        single-line
                      ></v-text-field>
                    </div>
                  </template>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-window-item>
        </v-form>
        <!-- 分析 -->
        <v-window-item :value="CHART_CONFIG_ITEMS.Analysis.name" class="tab-item-wrapper"
          >敬请期待！
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
              :dimDescList="getOtherDimDescList(currChartInfo.XAxis)"
              type="XAxis"
              @delete-dim="deleteAxis"
              @add-dim="addXAxis"
              @init-drag-dim-info="initDragVariable"
            />
            <span class="dim-tips" v-else>拖拽左侧字段</span>
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
            <span class="dim-tips" v-if="!currChartInfo.indicatorList.length">拖拽左侧字段</span>
            <DimChip
              v-for="(indicator, index) in currChartInfo.indicatorList"
              :dim="indicator"
              type="Indicator"
              :index="index"
              :dimDescList="getOtherDimDescList(indicator)"
              @delete-dim="deleteIndicator"
              @add-dim="addIndicator"
              @init-drag-dim-info="initDragVariable"
            />
          </div>
        </div>
      </div>
      <!-- 图表展示 -->
      <div ref="chartPreviewRef" class="chart-preview-wrapper">
        <div class="flex align-center">
          <template v-if="!isFullscreen">
            <v-btn text="预览" elevation="0" color="#4DB6AC" @click="preview"></v-btn>
            <span v-show="previewTipVisiable" class="ml-5" style="color: #747474"
              >配置信息修改后需重新预览</span
            ></template
          >

          <div class="more-actions ml-auto pr-4">
            <v-slider
              class="chart-download-quality-slider"
              v-model="currChartInfo.pixelRatio"
              density="compact"
              hide-details
              thumb-label
              thumb-size="13"
              max="10"
              min="1"
              color="var(--primary-selected-color)"
              label="下载质量"
            ></v-slider>
            <v-icon @click="downloadChart" color="#4DB6AC" icon="mdi-download"></v-icon>
            <v-icon
              @click="toggle"
              color="#4DB6AC"
              :icon="isFullscreen ? 'mdi-arrow-collapse-all' : 'mdi-arrow-expand-all'"
            ></v-icon>
          </div>
        </div>
        <PreviewChart
          ref="previewChartRef"
          class="chart-preview-content"
          v-if="isPreview"
          :is-preview="isPreview"
          :chart-info="currChartInfo"
          :chart-data="chartData"
        ></PreviewChart>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import './style.scss'
import { useFullscreen } from '@vueuse/core'
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as XLSX from 'xlsx'
import { isNumber } from 'lodash'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { UploadProps, UploadUserFile, UploadFile } from 'element-plus'
import { ChartData, ChartInfo, type AxisDimType, AxisDim } from './types'
import {
  CHART_CONFIG_ITEMS,
  CHART_TYPES,
  CHART_TYPES_LIST,
  CHART_TYPES_ICON,
  INDICATOR_MAX_NUM,
  VariableFromType
} from '../../constants/chartConfig'
import DimChip from './DimChip/DimChip.vue'
import PreviewChart from './PreviewChart/PreviewChart.vue'

const fileList = ref<UploadUserFile[]>([])
/** 上传的文件数据 */
const chartData = ref<ChartData>(new ChartData())
/** 变量搜索关键词 */
const searchVariable = ref('')
/** 当前选中的tab页面 */
const currTab = ref(CHART_CONFIG_ITEMS.Basic.name)
/** 要渲染的图表信息 */
const currChartInfo = ref<ChartInfo>(new ChartInfo())
const chartInfoFormRef = ref()
const isAtXDim = ref(false)
const isAtYDim = ref(false)
/** 配置信息修改提示是否展示 */
const previewTipVisiable = ref(false)
/** 控制预览渲染 */
const isPreview = ref(false)
/** 默认打开第一个配置panel */
const panels = ref<number[]>([0])
/** 预览元素 */
const chartPreviewRef = ref(null)
/** useFullScreen的hook */
const { toggle, isFullscreen } = useFullscreen(chartPreviewRef)
/** 是否正在读取文件 */
const onReadingFile = ref(false)
/** 预览组件实例 */
const previewChartRef = ref()

const rules = ref<any>({
  chartName: [(v: string) => !v || v.length <= 20 || '图表名称长度不能超过20个字符'],
  yAxisSettingMin: [
    (v: string) =>
      v !== '' || currChartInfo.value.yAxisSetting.max !== '' || '最小值和最大值至少配置一个',

    (v: string) =>
      (v === '' && currChartInfo.value.yAxisSetting.max !== '') ||
      (v !== '' && currChartInfo.value.yAxisSetting.max === '') ||
      (v !== '' &&
        currChartInfo.value.yAxisSetting.max !== '' &&
        Number(v) < Number(currChartInfo.value.yAxisSetting.max)) ||
      '最小值大于最大值'
  ]
})

/** 图表所有维度的desc */
const dimDescList = computed(() =>
  currChartInfo.value.indicatorList
    .map((indicator) => indicator.desc)
    .concat(currChartInfo.value.XAxis?.desc!)
)

onBeforeUnmount(() => {
  chartData.value.clear()
})

watch(
  () => currChartInfo.value,
  (newValue, oldValue) => {
    previewTipVisiable.value = true
  },
  { deep: true }
)

/** 获取其他维度的描述列表 */
const getOtherDimDescList = (dim: AxisDimType) => {
  return dimDescList.value.filter((desc) => desc !== dim.desc)
}

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
      const workbook = XLSX.read(data, { type: 'binary', raw: true })
      // 获取第一个工作表
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]
      // 获取图表的类型
      const chartType = (XLSX.utils.sheet_to_json(sheet, { header: 1 })[0] as string[])[0]
      // 判断图表类型是否合法
      if (!CHART_TYPES_LIST.includes(chartType)) {
        onReadingFile.value = false
        return ElMessage.error(
          `您输入数据的图表类型“${chartType}”不在支持的图表类型中，请结合模板检查！`
        )
      }
      console.log('🚀 ~ chartType:', chartType)
      if ([CHART_TYPES.LINE, CHART_TYPES.BAR, CHART_TYPES.SCATTER].includes(chartType)) {
        // 变量表头
        const variables = (
          Object.values(XLSX.utils.sheet_to_json(sheet, { header: 2 })[0] as any) as string[]
        ).map((variable) => variable.trim())
        // 将工作表转换为JSON对象
        let jsonData = XLSX.utils.sheet_to_json(sheet, { header: variables, blankrows: true })
        // 删除变量表头
        jsonData = jsonData.slice(2)
        // 存储数据
        chartData.value.addData(uploadFile.name, variables, jsonData)
      }
    } catch (error) {
      ElMessage.error(`“${uploadFile.name}”文件读取失败`)
      console.log(error)
      onReadingFile.value = false
      return
    }
    onReadingFile.value = false
  }
  onReadingFile.value = true
  reader.readAsBinaryString(uploadFile.raw as Blob)
}

/** 选择图表类型 */
const selectChartType = (chartType: string) => {
  currChartInfo.value.chartType = chartType
  currChartInfo.value.indicatorList.forEach((indicator) => {
    indicator.chartType = chartType
  })
  switchChartType(chartType)
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

/** 获取唯一的描述 */
const getUniqueDesc = (variableName: string) => {
  let desc = variableName
  let i = 1
  while (dimDescList.value.includes(desc)) {
    desc = `${variableName}_${i}`
    i++
  }
  return desc
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
  currChartInfo.value.XAxis.desc =
    currChartInfo.value.XAxis.desc || getUniqueDesc(data.variableName)
  switch (data.type) {
    case VariableFromType.Indicator:
      currChartInfo.value.indicatorList.splice(data.index, 1)
      break

    default:
      break
  }
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
  newIndicator.desc = newIndicator.desc || getUniqueDesc(newIndicator.variableName)
  newIndicator.chartType = currChartInfo.value.chartType
  targetIndex = isNumber(targetIndex) ? targetIndex : currChartInfo.value.indicatorList.length
  // 判断拖动的字段来源是指标还是其他
  if (data.type !== 'Indicator') {
    // 判断数量限制
    if (currChartInfo.value.indicatorList.length >= INDICATOR_MAX_NUM) {
      return ElMessage.warning(`最多添加${INDICATOR_MAX_NUM}个指标`)
    }
    currChartInfo.value.indicatorList.splice(targetIndex, 0, newIndicator)
    switch (data.type) {
      case VariableFromType.XAxis:
        currChartInfo.value.XAxis = undefined
        break
      default:
        break
    }
  } else {
    if (data.dimCode === (currChartInfo.value.indicatorList[targetIndex]?.dimCode ?? '')) {
      return
    } else {
      currChartInfo.value.indicatorList.splice(targetIndex, 0, newIndicator)
      currChartInfo.value.indicatorList.splice(
        data.index > targetIndex ? data.index + 1 : data.index,
        1
      )
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

/** 切换图表类型，配置有相应的变化 */
const switchChartType = (chartType: string) => {
  switch (chartType) {
    case CHART_TYPES.LINE:
      currChartInfo.value.indicatorList = currChartInfo.value.indicatorList.slice(
        0,
        INDICATOR_MAX_NUM
      )
      break
    case CHART_TYPES.SCATTER:
      currChartInfo.value.indicatorList = currChartInfo.value.indicatorList.slice(0, 1)
      break
    default:
      break
  }
}

/** 判断当前配置是否有效 */
const judgeValid = () => {
  let { valid, message } = currChartInfo.value.isValid()
  !valid && ElMessage.error(message)
  return valid
}

/** 预览 */
const preview = async () => {
  // 验证图表配置
  let { valid } = await chartInfoFormRef.value.validate()
  if (!valid) {
    return ElMessage.error('图表配置项有误，请完善！')
  }
  valid = judgeValid()
  if (!valid) {
    return
  }

  previewTipVisiable.value = false
  isPreview.value = false
  nextTick(() => {
    isPreview.value = true
  })
}

const downloadChart = () => {
  if (!previewChartRef.value) {
    return ElMessage.warning('当前无图表')
  }
  previewChartRef.value.downloadChart()
}
</script>
