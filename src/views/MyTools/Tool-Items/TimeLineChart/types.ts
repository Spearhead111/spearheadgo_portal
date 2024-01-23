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
  /** 图表类型 */
  chartType: string
  /** X轴 */
  XAxis: AxisDimType | undefined
  /** 字段 */
  indicatorList: AxisDim[]
  constructor(chartInfo?: ChartInfoType) {
    this.chartType = chartInfo?.chartType ?? CHART_TYPES.LINE
    this.XAxis = chartInfo?.XAxis
    this.indicatorList = chartInfo?.indicatorList ?? []
  }
}

export interface ChartInfoType {
  /** 图表类型 */
  chartType: string
  /** X轴 */
  XAxis?: AxisDimType
  /** 字段 */
  indicatorList: AxisDim[]
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
}
