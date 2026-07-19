import { defineConfig } from 'vitest/config'

// The unit tests cover pure helpers (calendar / ICS / time), so a plain Node
// environment is enough — no jsdom, no React plugin. Kept separate from
// vite.config.ts so the PWA/build plugins don't load during tests.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
