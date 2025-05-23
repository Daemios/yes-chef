import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import path from 'path';
import fs from 'fs';

// Function to get the server port
const getServerPort = (): number => {
  try {
    const portFilePath = path.join(__dirname, '../server-port.json');
    if (fs.existsSync(portFilePath)) {
      const portData = JSON.parse(fs.readFileSync(portFilePath, 'utf-8'));
      return portData.port || 3002;
    }
  } catch (error) {
    console.warn('Could not read server port file, using default port 3002');
  }
  return 3002; // fallback to default
};

const serverPort = getServerPort();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@shared': fileURLToPath(new URL('../shared', import.meta.url))
    }
  },  server: {
    port: 5173,
    // Add host: true to expose to network
    host: true,
    // Print URLs for easier debugging
    open: false,
    hmr: {
      overlay: true
    },    // Proxy API requests to the backend server
    proxy: {
      '/api': {
        target: `http://localhost:${serverPort}`,
        changeOrigin: true,
        secure: false
      },
      '/auth': {
        target: `http://localhost:${serverPort}`,
        changeOrigin: true,
        secure: false
      },
      '/recipes': {
        target: `http://localhost:${serverPort}`,
        changeOrigin: true,
        secure: false
      },
      '/health': {
        target: `http://localhost:${serverPort}`,
        changeOrigin: true,
        secure: false
      }
    }
  }
});
