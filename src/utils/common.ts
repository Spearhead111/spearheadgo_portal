/** 时间戳转换 */
export const formatDate = (timeStap: number) => {
  const date = new Date(timeStap)
  const year = date.getFullYear() // 获取当前年
  const mon = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1 // 获取当前月
  const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate() // 获取当前日
  const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours() // 获取当前小时
  const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes() // 获取当前分钟
  const seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds() // 获取当前秒
  const format = year + '-' + mon + '-' + day + '  ' + hours + ':' + minutes + ':' + seconds
  return format
}

/** 高亮关键字 */
export const highLightWord = (str: string, keyword: string) => {
  if (str && keyword) {
    const reg = new RegExp(keyword, 'g')
    return str.replace(reg, '<span style="background-color: #ffa500;">' + keyword + '</span>')
  }
  return str
}

/** 文件流转url */
export const fileToURL = (file: File) => {
  return window.URL.createObjectURL(file)
}
