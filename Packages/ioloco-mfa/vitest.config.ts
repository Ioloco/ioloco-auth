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
      Class: path.resolve(__dirname, './src/Class'),
      Error: path.resolve(__dirname, './src/Error')
    }
  }
})
