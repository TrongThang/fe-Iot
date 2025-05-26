import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    cssInjectedByJsPlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx'], // để Vite tự nhận được các file
  },
})
