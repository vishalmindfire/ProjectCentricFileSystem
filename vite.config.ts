import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path/win32';
import mkcert from 'vite-plugin-mkcert';

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
  plugins: [react(), mkcert()],
  resolve: {
    alias: {
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@': path.resolve(__dirname, 'src'),
    },
    tsconfigPaths: true,
  },
  css: {
    modules: {
      localsConvention: 'camelCase', // or 'camelCaseOnly', 'dashes'
      scopeBehaviour: 'local',
      generateScopedName: '[local]_[hash:base64:2]',
    },
  },
});
