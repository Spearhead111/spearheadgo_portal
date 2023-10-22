import './assets/css/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import vuetify from '@/plugins/vuetify'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import '@icon-park/vue-next/styles/index.css'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

import hljs from 'highlight.js'
// hljs.highlightCode = () => {
//   //自定义highlightCode方法，将只执行一次的逻辑去掉
//   let blocks = document.querySelectorAll('pre code')
//   ;[].forEach.call(blocks, hljs.highlightBlock)
// }
// 使用样式，有多种样式可选
import 'highlight.js/styles/mac.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(ElementPlus)
app.use(mavonEditor)

app.directive('highlight', (el: { querySelectorAll: (arg0: string) => any }) => {
  let blocks = el.querySelectorAll('pre code')
  blocks.forEach((block: HTMLElement) => {
    hljs.highlightBlock(block)
  })
})

app.mount('#app')
