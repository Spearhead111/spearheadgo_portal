import dayjs from 'dayjs' // 引入dayjs插件
import relativeTime from 'dayjs/plugin/relativeTime' // 引入相对时间插件
import 'dayjs/locale/zh-cn' // 引入中文语言包   默认英文语言包
// 相当于dayjs的扩展   相对时间的方法   这个方法写完之后  dayjs就有了from方法,to方法
dayjs.extend(relativeTime)

/**
 * 此函数用来将  日期转化成相对时间
 * @params date  传入的日期
 */
export function relTime(date: string | number | Date | dayjs.Dayjs | null | undefined) {
  // from 中的值是 日期 或者dayjs得到的日期  dayjs()当前时间 dayjs().from（date）当前时间距离传入时间多远
  // 对dayjs  进行本地语言包转化locale
  return dayjs().locale('zh-cn').to(date)
}

/**
 * 此函数用来将日期转换为想要的格式
 * @params date  传入的日期
 * @params dateFormat  传入的日期格式
 */
export function formatTime(
  date: string | number | Date | dayjs.Dayjs | null | undefined,
  dateFormat: string | undefined
) {
  // from 中的值是 日期 或者dayjs得到的日期  dayjs()当前时间 dayjs().from（date）当前时间距离传入时间多远
  // 对dayjs  进行本地语言包转化locale
  return dayjs(date).format(dateFormat)
}

/**
 * 此函数用来将日期 计算为距离现在多久的精确时间
 * @params date  传入的日期
 * @return 三天两小时
 */
export function precisionTime(date: string | number | Date | dayjs.Dayjs | null | undefined) {
  const now = dayjs()
  let diffTime = dayjs(date).diff(now)
  let days = Math.floor(diffTime / (24 * 60 * 60 * 1000))
  let hours = Math.floor((diffTime % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
  let mins = Math.floor((diffTime % (60 * 60 * 1000)) / (60 * 1000))

  if (days) {
    return `${days}天${hours}小时${mins}分钟`
  } else if (hours) {
    return `${hours}小时${mins}分钟`
  } else {
    return `${mins}分钟`
  }
}

/**
 * 此函数用来获取N小时/天/月/年后等时间
 * @params date  传入日期  2022-08-01 12:00:00
 * @params days  传入未来N 7
 * @params type  年/月/天/小时/分钟/秒  year/month/day/hour/minute/second  day
 * @params dateFormat  日期格式 'YYYY-MM-dd'
 * @return 未来的7天 2022-08-08
 */
export function futureTime(
  date: string | number | Date | dayjs.Dayjs | null | undefined,
  days: number,
  type: any | undefined,
  dateFormat: string | undefined
) {
  return dayjs(date).add(days, type).format(dateFormat)
}

/**
 * 此函数用来获取N小时/天/月/年前等时间
 * @params date  传入日期  2022-08-01 12:00:00
 * @params days  传入过去N 7
 * @params type  年/月/天/小时/分钟/秒  year/month/day/hour/minute/second  day
 * @params dateFormat  日期格式 'YYYY-MM-dd'
 * @return 未来的7天 2022-08-08
 */
export function pastTime(
  date: string | number | Date | dayjs.Dayjs | null | undefined,
  days: number,
  type: any | undefined,
  dateFormat: string | undefined
) {
  return dayjs(date).subtract(days, type).format(dateFormat)
}

/**
 * 此函数用来获取一年/一月/一周/一天等的开始时间
 * @params date  传入日期  2022-08-01 12:00:00
 * @params type  年/月/天/小时  year/month/week/day/hour  week
 * @params dateFormat  日期格式 'YYYY-MM-dd'
 * @return 一周的开始时间 2022-07-31  周天为一周的第一天
 */
export function startTime(
  date: string | number | Date | dayjs.Dayjs | null | undefined,
  type: any,
  dateFormat: string | undefined
) {
  return dayjs(date).startOf(type).format(dateFormat)
}

/**
 * 此函数用来获取一年/一月/一周/一天等的结束时间
 * @params date  传入日期  2022-08-01 12:00:00
 * @params type  年/月/天/小时  year/month/week/day/hour  week
 * @params dateFormat  日期格式 'YYYY-MM-dd'
 * @return 一周的结束时间 2022-07-31  周天为一周的第一天
 */
export function endTime(
  date: string | number | Date | dayjs.Dayjs | null | undefined,
  type: any,
  dateFormat: string | undefined
) {
  return dayjs(date).endOf(type).format(dateFormat)
}
