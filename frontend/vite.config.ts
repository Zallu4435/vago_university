import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {host: true},
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'TS2307' || warning.code === 'TS2339' || warning.code === 'TS2322') {
          return;
        }
        warn(warning);
      }
    }
  }
})
