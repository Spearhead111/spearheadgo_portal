import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: fileURLToPath(new URL('./src', import.meta.url))
      }
    ],
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "./src/style/common.scss";' // 加载全局样式，使用scss特性
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        // 配置需要代理的路径 --> 这里的意思是代理http://localhost:80/api/后的所有路由
        target: 'http://xxxxx.org', // 目标地址 --> 服务器地址
        changeOrigin: true // 允许跨域
      }
    }
  },
  define: {
    __VUE_PROD_DEVTOOLS__: true // 开启vue-devtools调试工具
  }
})
