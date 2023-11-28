import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router'], // 自动引入的包
      // dirs: ['./src/service'], // 自己自动引入的文件目录
      dts: './src/auto-import.d.ts' // 生成的ts类型定义文件
    })
  ],
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
    // proxy: {
    //   '/api': {
    //     // 配置需要代理的路径 --> 这里的意思是代理http://127.0.0.1:3000/api/后的所有路由
    //     target: 'http://127.0.0.1:3000', // 目标地址 --> 服务器地址
    //     changeOrigin: true // 允许跨域
    //   }
    // }
  },
  define: {
    __VUE_PROD_DEVTOOLS__: true // 开启vue-devtools调试工具
  }
})
