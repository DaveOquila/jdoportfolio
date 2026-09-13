import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    proxy: {
      '/portfolio-api': {
        target: 'https://script.google.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) =>
          path.replace(
            /^\/portfolio-api/,
            '/macros/s/AKfycbyipFgAjiMuZr2Oy3RjTBpcjDe7dz9NhlSRo0kS1CW_rbD0AI1v4cKz8v6g5Q2b4tcsgg/exec'
          ),
      },
    },
  },
})