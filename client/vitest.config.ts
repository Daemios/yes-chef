/// <reference types="vitest" />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  // Vitest configuration
  test: {
    // Enable jest-like global test APIs
    globals: true,
    // Simulate DOM with happy-dom
    // (faster and more lightweight than jsdom)
    environment: 'happy-dom',
    // Use the same transforms as our Vite config
    deps: {
      inline: ['vuetify']
    },
    // Coverage reporting
    coverage: {
      reporter: ['text', 'json', 'html'],
    }
  }
});
