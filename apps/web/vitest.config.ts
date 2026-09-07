import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
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
