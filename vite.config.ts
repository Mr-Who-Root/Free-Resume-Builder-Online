import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Required for GitHub Pages: assets must be relative to the repo subdirectory
  base: '/Free-Resume-Builder-Online/',
})
