import './assets/css/main.css'

import { createApp } from 'vue'

import App from './App.vue'
import pinia from '@/stores'
import router from './router'
import vuetify from '@/plugins/vuetify'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import '@icon-park/vue-next/styles/index.css'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import { animateDirective, authDirective } from '@/directive'
import VueGtag from 'vue-gtag'
import hljs from 'highlight.js'
// 使用样式，有多种样式可选
import 'highlight.js/styles/mac.css'
import 'highlight.js/styles/atom-one-dark.css'
import useUserStore from './stores/modules/user'
import zhCn from 'element-plus/es/locale/lang/zh-cn' // 注意这里使用了 'es' 目录

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(vuetify)
app.use(ElementPlus, { locale: zhCn })
app.use(mavonEditor)
// 使用 vue-gtag 插件
app.use(VueGtag, {
  config: { id: 'G-2ZWR4RLSG6' } // 替换为你的 Google Analytics Measurement ID
})

// auth权限指令的判断依赖用户角色，先初始化
useUserStore()

// 自定义指令
// 给元素添加动画，元素出现的时候(滑动到)执行动画，必须配合animate.css使用
app.directive('animate', animateDirective)
// 权限判断指令
app.directive('auth', authDirective)
// 代码高亮指令
app.directive('highlight', (el: { querySelectorAll: (arg0: string) => any }) => {
  let blocks = el.querySelectorAll('pre code')
  blocks.forEach((block: HTMLElement) => {
    hljs.highlightBlock(block)
  })
})

app.mount('#app')
