import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'tests/',
        'style.css',
        '*.config.js'
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 65,
        statements: 70
      }
    },
    setupFiles: ['./tests/setup.js'],
    include: ['tests/**/*.test.js'],
    testTimeout: 10000
  }
});
