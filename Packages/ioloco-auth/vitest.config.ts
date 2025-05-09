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
      Core: path.resolve(__dirname, './src/Core'),
      Handlers: path.resolve(__dirname, './src/Handlers'),
      Error: path.resolve(__dirname, './src/Error'),
      Server: path.resolve(__dirname, './src/Server'),
      Client: path.resolve(__dirname, './src/Client')
    }
  }
})
