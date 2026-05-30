// Cấu hình Vite build tool
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      // @ = src/ — import '@/components/...' thay vì '../../../components/...'
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    // Frontend chạy port 3000 — khác backend 8080
    port: 3000,
    // Tự mở trình duyệt khi chạy npm run dev
    open: true,
  },

  define: {

    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  },
});