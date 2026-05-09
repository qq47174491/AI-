import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/AI-',
  server: {
    proxy: {
      '/api/ai': {
        target: 'https://ai-gateway.greatld.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ai/, '/hedy/v1/all/v1'),
        secure: false,
      },
    },
  },
})
