<template>
  <div ref="chartContainereRef" style="height: 100%; width: 100%"></div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
import { onMounted, onBeforeUnmount, ref } from 'vue'
import type { ChartData, ChartInfo } from '../types'

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
      xAxis: {
        type: 'category',
        data: chartData.data[chartInfo.XAxis?.fileName!].colData[chartInfo.XAxis?.variableName!]
      },
      yAxis: {
        // type: 'value'
      },
      series: [
        {
          name: 'Example Series',
          type: 'line',
          data: chartData.data[chartInfo.indicatorList[0]?.fileName!].colData[
            chartInfo.indicatorList[0]?.variableName!
          ]
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
    console.log(props)
    nextTick(() => {
      initChart()
    })
  }
})
</script>

<style lang="scss" scoped></style>
