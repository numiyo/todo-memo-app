import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['note.svg'],
      manifest: {
        name: '轻笔记',
        short_name: '轻笔记',
        description: '轻量级笔记应用 — 支持标签、搜索、JSON/Markdown 导出',
        theme_color: '#ffffff',
        background_color: '#f5f7fa',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
