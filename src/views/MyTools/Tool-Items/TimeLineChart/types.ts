import { isNumber } from 'lodash'
import { CHART_TYPES } from '../../constants/chartConfig'

export class ChartData {
  /** 包含的所有文件名 */
  fileNames: string[]
  /** 变量 */
  variables: { [key: string]: string[] }
  /** 各文件的数据 */
  data: { [key: string]: FileData }

  constructor() {
    this.fileNames = []
    this.variables = {}
    this.data = {}
  }
  /** 添加数据 */
  addData(fileName: string, variables: string[], newData: any[]) {
    this.fileNames.push(fileName)
    this.variables[fileName] = [...variables]
    this.data[fileName] = new FileData(fileName, variables, newData)
  }
  /** 删除数据 */
  deleteData(fileName: string) {
    this.fileNames = this.fileNames.filter((name) => name !== fileName)
    delete this.variables[fileName]
    delete this.data[fileName]
  }
  /** 清除数据 */
  clear() {
    this.fileNames = []
    this.variables = {}
    this.data = {}
  }
}

export class FileData {
  /** 源自于的文件的文件名 */
  fileName: string
  /** 包含的变量 */
  variables: string[]
  /** 行数据，一条行数据包含对应所有变量的数值 */
  rowData: { [key: string]: any }[]
  /** 列数据，一列数据为该变量的数值数组 */
  colData: { [key: string]: any[] }
  constructor(fileName: string, variables: string[], newData: any[]) {
    this.fileName = fileName
    this.variables = [...variables]
    this.rowData = [...newData]
    this.colData = {}
    variables.forEach((varable) => {
      this.colData[varable] = newData.map((row) => row[varable])
    })
  }
}

export class ChartInfo {
  /** 图表名 */
  chartName: string
  /** 图表类型 */
  chartType: string
  /** 是否忽略缺省值 */
  omitDefaultVals: boolean
  /** 缺省值 */
  defaultVal: number
  /** 下载质量 */
  pixelRatio: number
  yAxisSetting: YAxisSetting
  /** X轴 */
  XAxis: AxisDimType | undefined
  /** 字段 */
  indicatorList: AxisDim[]
  constructor(chartInfo?: ChartInfoType) {
    this.chartName = chartInfo?.chartName ?? ''
    this.chartType = chartInfo?.chartType ?? CHART_TYPES.LINE
    this.omitDefaultVals = chartInfo?.omitDefaultVals ?? false
    this.defaultVal = this.omitDefaultVals ? chartInfo?.defaultVal ?? -9999 : -9999
    this.XAxis = chartInfo?.XAxis
    this.indicatorList = chartInfo?.indicatorList ?? []
    this.pixelRatio = chartInfo?.pixelRatio ?? 2
    this.yAxisSetting = chartInfo?.yAxisSetting ?? {
      autoAdapt: true,
      max: '',
      min: ''
    }
  }
  isValid() {
    let valid = true
    let message = ''
    switch (this.chartType) {
      case CHART_TYPES.LINE:
        if (!this.XAxis || !this.XAxis.dimCode) {
          valid = false
          message = 'X轴必须选择一个维度'
        } else if (this.indicatorList.length === 0) {
          valid = false
          message = '至少选择一个指标'
        }
        break
      case CHART_TYPES.SCATTER:
      default:
        break
    }
    return { valid, message }
  }
}

export interface YAxisSetting {
  /** 自适应 */
  autoAdapt: boolean
  /** Y轴最大值 */
  max: number | string
  /** Y轴最小值 */
  min: number | string
}

export interface ChartInfoType {
  /** 图表名 */
  chartName: string
  /** 图表类型 */
  chartType: string
  /** 是否忽略默认值 */
  omitDefaultVals: boolean
  /** 缺省值 */
  defaultVal: number
  /** 下载质量 */
  pixelRatio: number
  /** X轴 */
  XAxis?: AxisDimType
  /** 字段 */
  indicatorList: AxisDim[]
  /** Y轴设置 */
  yAxisSetting: YAxisSetting
}

export class AxisDim {
  /** 所属的文件名 */
  fileName: string
  /** 所属文件的index，chip的icon标识所属的不同文件 */
  fileIndex: number
  /** 变量名 */
  variableName: string
  /** 字段展示名 */
  desc: string
  /** 字段code，唯一标识 */
  dimCode: string
  /** 字段数据类型 */
  dimType: 'Date' | 'Number' | 'String'
  /** 字段数据单位 */
  unit: string
  /** 小数位数 */
  decimalDigits: number
  /** 图表类型 */
  chartType: string
  constructor(axisDim?: AxisDimType) {
    this.fileName = axisDim?.fileName ?? ''
    this.fileIndex = axisDim?.fileIndex ?? -99
    this.variableName = axisDim?.variableName ?? ''
    this.desc = axisDim?.desc ?? ''
    this.dimCode = axisDim?.dimCode ?? ''
    if (axisDim?.fileName && axisDim.variableName && !axisDim?.dimCode) {
      this.dimCode = `${this.fileName}_${this.variableName}_${new Date().getTime()}`
    }
    this.dimType = axisDim?.dimType ?? 'Number'
    this.unit = axisDim?.unit ?? ''
    this.decimalDigits = isNumber(axisDim?.decimalDigits) ? axisDim.decimalDigits : 2
    this.chartType = axisDim?.chartType ?? CHART_TYPES.LINE
  }
}

export interface AxisDimType {
  /** 所属的文件名 */
  fileName?: string
  /** 所属文件的index，chip的icon标识所属的不同文件 */
  fileIndex?: number
  /** 变量名 */
  variableName?: string
  /** 字段展示名 */
  desc?: string
  /** 字段code，唯一标识 */
  dimCode?: string
  /** 字段数据类型 */
  dimType: 'Date' | 'Number' | 'String'
  /** 字段数据单位 */
  unit: string
  /** 小数位数 */
  decimalDigits: number
  /** 图表类型 */
  chartType: string
}
