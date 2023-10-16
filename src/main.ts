import './assets/css/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import vuetify from '@/config/vuetify'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(ElementPlus)

app.mount('#app')
