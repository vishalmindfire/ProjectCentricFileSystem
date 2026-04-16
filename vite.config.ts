import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@styles': path.resolve(__dirname, 'src/styles'),
    },
    tsconfigPaths: true,
  },
  build: {
    outDir: 'dist',
  },
  css: {
    modules: {
      localsConvention: 'camelCase', // or 'camelCaseOnly', 'dashes'
      scopeBehaviour: 'local',
      generateScopedName: '[local]_[hash:base64:2]',
    },
  },
});
