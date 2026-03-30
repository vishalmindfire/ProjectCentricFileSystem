import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path/win32'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@styles': path.resolve(__dirname, 'src/styles'),
      "@": path.resolve(__dirname, "src"),
    },
    tsconfigPaths: true,
  },
  css: {
    modules: {
      localsConvention: 'camelCase', // or 'camelCaseOnly', 'dashes'
      scopeBehaviour: 'local',
      generateScopedName: '[local]_[hash:base64:2]'
    },
  },
})
