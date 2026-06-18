import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    preview: {
      allowedHosts: [
        'tiresias-oficial-170482660072.us-east4.run.app',
        'tiresias-oficial--gen-lang-client-0879858478.us-east4.hosted.app'
      ],
      host: '0.0.0.0',
      port: 8080
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});