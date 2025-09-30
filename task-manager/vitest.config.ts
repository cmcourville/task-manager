import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./__tests__/setup.ts'],
    coverage: {
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/coverage/**',
        '**/.next/**',
        '**/next.config.js',
        '**/next.config.mjs',
        '**/next.config.ts',
        '**/layout.tsx',
        '**/*.tsx',
        '**/__tests__/**',
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/*.spec.ts',
        '**/*.spec.tsx',
        '**/vitest.config.ts',
        '**/tailwind.config.js',
        '**/postcss.config.js',
        '**/tsconfig.json',
        '**/package.json',
        '**/package-lock.json',
        '**/yarn.lock',
        '**/pnpm-lock.yaml',
        '**/README.md',
        '**/.gitignore',
        '**/.env*',
        '**/public/**',
        '**/src/app/globals.css',
        '**/src/app/layout.tsx',
      ],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
