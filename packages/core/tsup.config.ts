import { defineConfig } from 'tsup';

// ESM is emitted one file per module (no bundling) so the web app can drop
// what a page doesn't use: Studio pages import small helpers from this
// package, and a single bundled index.js made every one of them download the
// ZIP reader (jszip) and the parser too. CJS and the type declarations stay
// bundled from the index, as before. The build script empties dist first
// (the two configs run side by side, so neither may clean).
export default defineConfig([
  {
    entry: ['src/**/*.ts', '!src/**/*.test.ts', '!src/**/*.fixtures.ts'],
    format: ['esm'],
    bundle: false,
    dts: { entry: { index: 'src/index.ts' } },
  },
  {
    entry: ['src/index.ts'],
    format: ['cjs'],
    dts: true,
  },
]);
