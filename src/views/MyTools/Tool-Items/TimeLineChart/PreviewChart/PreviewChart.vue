<template>
  <div ref="chartContainereRef" style="height: 100%; width: 100%"></div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
import { onMounted, onBeforeUnmount, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    isPreview: boolean
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
    const options: echarts.EChartsOption = {
      title: {
        text: 'ECharts Demo'
      },
      xAxis: {
        type: 'category',
        data: ['A', 'B', 'C', 'D', 'E']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Example Series',
          type: 'bar',
          data: [10, 20, 15, 25, 30]
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
</script>

<style lang="scss" scoped></style>
