import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// 引入node中path模块，获取文件的绝对路径
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
//   src文件夹配置别名
  resolve:{
    alias:{
      "@":path.resolve(__dirname,'src')
    }
  },
//   配置代理跨域
  server:{
    proxy:{
      '/api': {
        target: 'http://syt.atguigu.cn',
        changeOrigin: true,
      },
    }
  }
})
