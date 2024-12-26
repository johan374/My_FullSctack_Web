import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://my-fullsctack-web.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  // Add this object for SPA routing
  preview: {
    port: 5173,
    strictPort: true,
    host: true,
    headers: {
      "Cache-Control": "no-store"
    }
  }
})