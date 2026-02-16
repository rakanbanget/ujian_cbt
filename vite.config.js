import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'https://mflss.sgp.dom.my.id',
        changeOrigin: true,
        secure: false,
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Referer': 'https://mflss.sgp.dom.my.id'
        },
        logLevel: 'debug',
      },
      '/sanctum/csrf-cookie': {
        target: 'https://mflss.sgp.dom.my.id',
        changeOrigin: true,
        secure: false,
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Referer': 'https://mflss.sgp.dom.my.id'
        },
        logLevel: 'debug',
      }
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react'],
        },
      },
    },
  },
})
