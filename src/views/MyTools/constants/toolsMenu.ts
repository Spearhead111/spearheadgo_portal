import { CDN_URL } from '@/constants'
import test from '../Tool-Items/test1/test1.vue'
import TimeLineChartVue from '../Tool-Items/TimeLineChart/TimeLineChart.vue'

const imgUrl = CDN_URL + 'img/icon/'

export const TOOL_MENU_CONFIG = {
  research: {
    titleName: '数据分析',
    toolItems: [
      {
        name: '图分析',
        icon: imgUrl + 'line-graph.png',
        component: TimeLineChartVue
      }
    ]
  }
  // test1: {
  //   titleName: '科研工具',
  //   toolItems: [
  //     {
  //       name: 'test1',
  //       icon: '',
  //       component: test
  //     },
  //     {
  //       name: 'test2',
  //       icon: '',
  //       component: test
  //     }
  //   ]
  // }
}
