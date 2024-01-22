export const CHART_CONFIG_ITEMS = {
  Basic: {
    name: 'Basic',
    desc: '基础配置'
  },
  Analysis: {
    name: 'Analysis',
    desc: '分析'
  }
}

export const CHART_TYPES = {
  Line: {
    name: 'Line',
    desc: '折线图',
    icon: 'mdi-chart-line'
  },
  Scatter: {
    name: 'Scatter',
    desc: '散点图',
    icon: 'mdi-chart-scatter-plot'
  }
}

export type DimType = 'Origin' | 'XAxis' | 'YAxis' | 'Indicator'
export const VariableFromType = {
  Origin: 'Origin',
  XAxis: 'XAxis',
  YAxis: 'YAxis',
  Indicator: 'Indicator'
}

export const INDICATOR_MAX_NUM = 5
