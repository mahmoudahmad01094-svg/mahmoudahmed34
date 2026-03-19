import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(), 
      tailwindcss(),
      viteSingleFile(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'تطبيق المسلم',
          short_name: 'المسلم',
          description: 'تطبيق إسلامي شامل',
          theme_color: '#020617',
          background_color: '#020617',
          display: 'standalone',
          dir: 'rtl',
          lang: 'ar',
          icons: [
            {
              src: 'https://raw.githubusercontent.com/vitejs/vite/main/docs/public/logo.svg',
              sizes: '192x192',
              type: 'image/svg+xml'
            },
            {
              src: 'https://raw.githubusercontent.com/vitejs/vite/main/docs/public/logo.svg',
              sizes: '512x512',
              type: 'image/svg+xml'
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,mp3,json}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/api\.aladhan\.com\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'aladhan-api-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 7 // 1 week
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /^https:\/\/api\.quran\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'quran-api-cache',
                expiration: {
                  maxEntries: 150,
                  maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            }
          ]
        }
      })
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
