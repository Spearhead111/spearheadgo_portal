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
  BAR_DES: '柱状图',
  SANKEY: 'sankey',
  SANKEY_DES: '桑基图'
}

export const CHART_TYPES_LIST = [
  CHART_TYPES.LINE,
  CHART_TYPES.BAR,
  CHART_TYPES.SCATTER,
  CHART_TYPES.SANKEY
]

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
  },
  Sankey: {
    name: CHART_TYPES.SANKEY,
    desc: CHART_TYPES.SANKEY_DES,
    icon: 'mdi-chart-sankey-variant'
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

export const showXAxis = (chartType: string) => {
  let isShow = false
  let dimWrapperName = ''
  if ([CHART_TYPES.LINE, CHART_TYPES.BAR, CHART_TYPES.SCATTER].includes(chartType)) {
    isShow = true
    dimWrapperName = 'X轴'
  } else if ([CHART_TYPES.SANKEY].includes(chartType)) {
    isShow = true
    dimWrapperName = '数据'
  }
  return { isShow, dimWrapperName }
}

export const showIndicator = (chartType: string) => {
  let isShow = false
  let dimWrapperName = ''
  if ([CHART_TYPES.LINE, CHART_TYPES.BAR, CHART_TYPES.SCATTER].includes(chartType)) {
    isShow = true
    dimWrapperName = '指标'
  } else if ([CHART_TYPES.SANKEY].includes(chartType)) {
    isShow = false
    dimWrapperName = ''
  }
  return { isShow, dimWrapperName }
}

/** 对应图表类型支持的配置项 */
export const CHART_SUPPORT_CONFIG = {
  [CHART_TYPES.LINE]: {
    dataConfig: {
      omitDefaultVals: true,
      isDataZoom: true,
      rangeAutoAdapt: true
    }
  },
  [CHART_TYPES.BAR]: {
    dataConfig: {
      omitDefaultVals: true,
      isDataZoom: true,
      rangeAutoAdapt: true
    }
  },
  [CHART_TYPES.SCATTER]: {
    dataConfig: {
      omitDefaultVals: true,
      isDataZoom: true,
      rangeAutoAdapt: true
    }
  },
  [CHART_TYPES.SANKEY]: {
    chartStyle:{}
  }
}
