import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {host: true},
  plugins: [react(), tailwindcss()],
  build: {
    // Continue building even with TypeScript errors
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress TypeScript warnings during build
        if (warning.code === 'TS2307' || warning.code === 'TS2339' || warning.code === 'TS2322') {
          return;
        }
        warn(warning);
      }
    }
  }
})
