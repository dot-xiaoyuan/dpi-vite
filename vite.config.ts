import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        outDir: 'build', // 打包输出目录
        assetsDir: 'assets', // 静态资源目录
    },
})
