import { defineConfig } from 'vitest/config'
import path from 'path'

// =====================================================================================================================

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['__Tests__/**/*.test.ts'],
    coverage: {
      reporter: ['text', 'html']
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@Queries': path.resolve(__dirname, './src/@Queries'),
      '@Types': path.resolve(__dirname, './src/@Types'),
      OAuth: path.resolve(__dirname, './src/OAuth'),
      Error: path.resolve(__dirname, './src/Error')
    }
  }
})
