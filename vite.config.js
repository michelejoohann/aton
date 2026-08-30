import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Configuração oficial do Vite para GitHub Pages no repositório michelejoohann/aton
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/aton/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
})
