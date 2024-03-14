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
  LINE: 'line',
  LINE_DES: '折线图',
  SCATTER: 'scatter',
  SCATTER_DES: '散点图',
  BAR: 'bar',
  BAR_DES: '柱状图'
}

export const CHART_TYPES_LIST = [CHART_TYPES.LINE, CHART_TYPES.BAR, CHART_TYPES.SCATTER]

/** 图表类型的icon */
export const CHART_TYPES_ICON = {
  Line: {
    name: CHART_TYPES.LINE,
    desc: CHART_TYPES.LINE_DES,
    icon: 'mdi-chart-line'
  },
  Bar: {
    name: CHART_TYPES.BAR,
    desc: CHART_TYPES.BAR_DES,
    icon: 'mdi-chart-bar'
  },
  Scatter: {
    name: CHART_TYPES.SCATTER,
    desc: CHART_TYPES.SCATTER_DES,
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
