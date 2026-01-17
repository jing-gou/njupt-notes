import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // 引入新插件

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 将 tailwind 添加到插件列表
  ],
})