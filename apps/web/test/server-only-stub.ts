// Next.js resolves the bare `server-only` import specifier internally (it's
// not a real installed package, see apps/web/package.json), so it has no
// meaning outside Next's own bundler. Vitest needs something real to resolve
// to; this file is that something; it does nothing on purpose.
export {};
