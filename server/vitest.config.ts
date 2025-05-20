import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['**/__tests__/**/*.test.ts', '**/tests/**/*.test.ts'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    globals: true,
    setupFiles: ['./src/setup.ts'],
    coverage: {
      provider: 'c8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: '../coverage-server'
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
  },
});
