<template>
  <div ref="chartContainereRef" style="height: 100%; width: 100%"></div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { isNumber } from 'lodash'
import type { ChartData, ChartInfo } from '../types'
import { CHART_TYPES } from '../../../constants/chartConfig'

const props = withDefaults(
  defineProps<{
    isPreview: boolean
    chartInfo: ChartInfo
    chartData: ChartData
  }>(),
  { isPreview: false }
)

const chartContainereRef = ref<HTMLElement | null>(null)
// 创建 echarts 实例
const echartsInstance = shallowRef<echarts.ECharts | null>(null)

onMounted(() => {
  window.addEventListener('resize', resizeChart)
})

onBeforeUnmount(() => {
  // 在组件销毁前移除事件监听
  window.removeEventListener('resize', resizeChart)
  // 销毁 ECharts 实例
  if (echartsInstance.value) {
    echartsInstance.value.dispose()
  }
})

/** 初始化图表 */
const initChart = () => {
  if (chartContainereRef.value) {
    echartsInstance.value = echarts.init(chartContainereRef.value)
    // 图表配置
    const { chartData, chartInfo } = props
    const options: echarts.EChartsOption = {
      title: {
        text: chartInfo.chartName,
        left: 'center'
      },
      //@ts-ignore
      xAxis: {
        // type: 'value',
        name: chartInfo.XAxis?.desc,
        data:
          chartInfo.chartType === CHART_TYPES.SCATTER
            ? null
            : chartData.data[chartInfo.XAxis?.fileName!].colData[chartInfo.XAxis?.variableName!]
      },
      //@ts-ignore
      yAxis: {
        // type: 'value',
        max:
          !chartInfo.yAxisSetting.autoAdapt && chartInfo.yAxisSetting.max !== ''
            ? Number(chartInfo.yAxisSetting.max)
            : null,
        min:
          !chartInfo.yAxisSetting.autoAdapt && chartInfo.yAxisSetting.min !== ''
            ? Number(chartInfo.yAxisSetting.min)
            : null
      },
      series: getSeriesData(chartData, chartInfo),
      // 配置图例
      legend: {
        data: chartInfo.indicatorList.map((indicator) => indicator.desc),
        // 设置图例位置为底部
        bottom: 45
      },
      tooltip: {
        // 触发条件，鼠标悬停时显示
        trigger: chartInfo.chartType === CHART_TYPES.SCATTER ? 'item' : 'axis',
        // 样式配置
        backgroundColor: 'rgba(0,0,0,0.7)',
        textStyle: {
          color: '#fff',
          fontSize: 12
        },
        axisPointer: {
          type: 'line',
          animation: false,
          label: {
            backgroundColor: '#00c0a6',
            borderColor: '#00c0a6',
            borderWidth: 1,
            shadowBlur: 0,
            shadowOffsetX: 0,
            shadowOffsetY: 0
            // color: '#222'
          }
        },
        // 格式化显示内容
        formatter: tooltipFormatter
      },
      grid: {
        left: '3%',
        right: '10%',
        bottom: '10%',
        containLabel: true
      },
      dataZoom: [
        {
          type: 'inside'
        },
        {
          type: 'slider',
          handleStyle: {
            color: '#00c0a6' // 设置缩放滑块的颜色
          }
        }
      ]
    }

    // 使用配置项初始化图表
    echartsInstance.value.setOption(options)
  }
}

/** resize图表 */
const resizeChart = () => {
  if (echartsInstance.value) {
    echartsInstance.value.resize()
  }
}

watchEffect(() => {
  if (props.isPreview) {
    nextTick(() => {
      initChart()
    })
  }
})

/** 处理图表数据 */
const getSeriesData = (chartData: ChartData, chartInfo: ChartInfo) => {
  let seriesData: echarts.SeriesOption[] = []
  chartInfo.indicatorList.forEach((indicator) => {
    let seriesDataItem: echarts.SeriesOption = {
      name: indicator.desc,
      //@ts-ignore
      type: indicator.chartType,
      itemStyle: {
        color: indicator.color // 设置系列2的颜色
      },
      data: chartData.data[indicator.fileName].colData[indicator.variableName]
    }
    if (chartInfo.omitDefaultVals) {
      const defaultVal = Number(chartInfo.defaultVal)
      seriesDataItem.data = (seriesDataItem.data as any[]).map((item: any) => {
        return Number(item) === Number(chartInfo.defaultVal) ? '-' : Number(item)
      })
    }
    if (seriesDataItem.type === CHART_TYPES.SCATTER) {
      const defaultVal = Number(chartInfo.defaultVal)
      seriesDataItem.data = (seriesDataItem.data as any[]).map((item: any, idx: number) => {
        const scatterX =
          chartData.data[chartInfo.XAxis?.fileName!].colData[chartInfo.XAxis?.variableName!][idx]
        const scatterY = item
        return chartInfo.omitDefaultVals
          ? scatterX === defaultVal || scatterY === defaultVal
            ? null
            : [scatterX, scatterY]
          : [scatterX, scatterY]
      })
    }

    seriesData.push(seriesDataItem)
  })

  return seriesData
}

/** 获取值的内容 */
const getValueContent = (
  value: string | number,
  dimDesc: string,
  chartInfo: ChartInfo,
  isAxis = false
) => {
  const unit = isAxis
    ? chartInfo.XAxis?.unit ?? ''
    : chartInfo.indicatorList.find((indicator) => indicator.desc === dimDesc)?.unit || ''
  const decimalDigits = isAxis
    ? chartInfo.XAxis?.decimalDigits
    : chartInfo.indicatorList.find((indicator) => indicator.desc === dimDesc)?.decimalDigits
  return value === '-'
    ? value
    : `${isNumber(value) ? Number(value).toFixed(decimalDigits) : value} ${unit}`
}

/** 下载图表 */
const downloadChart = () => {
  const img = new Image()
  img.src = echartsInstance.value!.getDataURL({
    type: 'png',
    pixelRatio: props.chartInfo.pixelRatio,
    backgroundColor: '#fff'
  })
  img.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')
    ctx!.drawImage(img, 0, 0)
    const dataURL = canvas.toDataURL('image/png')

    const a = document.createElement('a')
    const event = new MouseEvent('click')
    a.download = props.chartInfo.chartName ? `${props.chartInfo.chartName}.png` : 'chart.png'
    // 将生成的URL设置为a.href属性
    a.href = dataURL
    // 触发a的单击事件
    a.dispatchEvent(event)
    a.remove()
  }
}

const tooltipFormatter = (params: any) => {
  if (props.chartInfo.chartType === CHART_TYPES.SCATTER) {
    return `<b>${props.chartInfo.XAxis?.desc}:</b> ${getValueContent(
      params.value[0],
      props.chartInfo.XAxis?.desc as string,
      props.chartInfo,
      true
    )} <br/>
    <b>${params.seriesName}:</b> ${getValueContent(
      params.value[1],
      params.seriesName,
      props.chartInfo
    )} `
  }
  //@ts-ignore
  let tooltipContent = `<b>${props.chartInfo.XAxis?.desc}:</b> ${getValueContent(
    params[0].axisValueLabel,
    props.chartInfo.XAxis?.desc as string,
    props.chartInfo,
    true
  )}</b><br/>`
  //@ts-ignore
  params.forEach((item: any) => {
    tooltipContent += `<b>${item.marker} ${item.seriesName}</b>: ${getValueContent(
      item.value,
      item.seriesName,
      props.chartInfo
    )}<br/>`
  })

  return tooltipContent
}

defineExpose({
  downloadChart
})
</script>

<style lang="scss" scoped></style>
