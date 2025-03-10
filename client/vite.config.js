import { defineConfig } from 'vite';


// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: process.env.BACKEND_URL || 'http://localhost:3001', //Backend URL for local development
        changeOrigin: true,
        secure: false,
      },
    },
  },
  
});


// build: {
  //   // outDir: 'dist', // Outputs compiled files here
  //   // emptyOutDir: true,
  //   rollupOptions: {
  //     input: 'index.html', //Vite entry HTML
  //   },
  // },