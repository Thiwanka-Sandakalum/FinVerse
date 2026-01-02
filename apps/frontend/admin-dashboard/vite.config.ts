import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 5173,
      host: '0.0.0.0',
      proxy: {
        '/banking-service-api': {
          target: 'https://apimng-bankguru.azure-api.net',
          changeOrigin: true,
          secure: false,
        },
        '/product-srv': {
          target: 'https://apimng-bankguru.azure-api.net/banking-service-api/products',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/product-srv/, ''),
        },
        '/usermng': {
          target: 'https://apimng-bankguru.azure-api.net/banking-service-api/users',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/usermng/, ''),
        },
      },
    },
    plugins: [react(), tailwindcss(),],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
