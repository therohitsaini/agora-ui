import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  css: {
    transformer: 'postcss', // ✅ disable lightningcss
  },
  build: {
    chunkSizeWarningLimit: 1600,
  },
})
