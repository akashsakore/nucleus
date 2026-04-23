export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    allowedHosts: ['cloudfarm.fun', '184.73.33.236'],
    proxy: {
      '/api': {
        target: 'http://backend:5000', // ✅ FIXED
        changeOrigin: true,
      },
    },
  },
});
