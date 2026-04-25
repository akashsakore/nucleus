import { defineConfig } from 'vite';   // ✅ ADD THIS
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: ['cloudfarm.fun'],
    proxy: {
      '/api': {
        target: 'http://backend:5000', // ✅ correct for docker-compose
        changeOrigin: true,
      },
    },
  },
});
