import { configDefaults, defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    // Playwright end-to-end specs run with `pnpm e2e`, not Vitest.
    exclude: [...configDefaults.exclude, 'e2e/**', '.next-e2e/**'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
      // Next.js resolves this marker package internally; it isn't a real
      // dependency (see test/server-only-stub.ts), so Vitest needs its own
      // resolution for any module that imports it.
      'server-only': path.resolve(__dirname, 'test/server-only-stub.ts'),
    },
  },
});
