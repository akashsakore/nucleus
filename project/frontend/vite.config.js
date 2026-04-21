import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    allowedHosts: ['cloudfarm.fun', 'cloudfarm.fun'],
    proxy: {
      '/api': {
        target: 'http://backend_container:5000',
        changeOrigin: true,
      },
    },
  },
});
