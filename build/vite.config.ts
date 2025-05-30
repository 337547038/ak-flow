/*当前打包使用tsup打包，也可使用此配置打包*/
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path, {resolve} from 'path'

export default defineConfig({
    plugins: [
        vue()
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, '../src')
        },
        // 使用路径别名时想要省略的后缀名，官方不建议将.vue文件省略后缀
        extensions: ['.js', '.ts']
    },
    build: {
        //outDir: 'publish/dist',
        lib: {
            entry: path.resolve(__dirname, '../src/components/flow/index.ts'),
            name: 'ak-flow',
            //fileName: format => `index.${format}.js`
            fileName: 'flow'
        },
        rollupOptions: {
            // 确保外部化处理那些你不想打包进库的依赖
            external: ['vue'],
            output: {
                // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
                globals: {
                    vue: 'Vue'
                }
            }
        }
    }
})
