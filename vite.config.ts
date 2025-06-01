import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  preview: {
    host: true, // allow access from network
    port: process.env.PORT ? Number(process.env.PORT) : 4173,
    allowedHosts: ['makemyleague.onrender.com'], // add your Render hostname here
  },
});

