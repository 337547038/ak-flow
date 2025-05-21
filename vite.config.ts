import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import { resolve } from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),
    Pages({
    dirs: [
      { dir: 'src/views', baseRoute: '' }
    ],
    extensions: ['md', 'vue'],
    exclude: ['**/components']
  })],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    },
    // 使用路径别名时想要省略的后缀名，官方不建议将.vue文件省略后缀
    extensions: ['.js', '.ts']
  },
  base: './',
  build: {
    outDir: 'docs'
  },
  server: {
    //https: true, // 是否开启 https
   /* port: 3000,
    host: '0.0.0.0',
    open: false,
    proxy: {
      '/api': {
        target: 'http://localhost:8089',
        //target: 'http://localhost:3001',
        changeOrigin: true
      }
    }*/
  }
})
