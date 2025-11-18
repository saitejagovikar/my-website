import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Ensure this is set to your deployment base path
  server: {
    host: '0.0.0.0', // Allow external connections
    port: 5173,      // Default Vite port
    strictPort: true,  // Don't try other ports if 5173 is taken
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
  preview: {
    port: 4173,
    strictPort: true,
  },
})
