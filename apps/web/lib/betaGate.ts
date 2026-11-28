// Staging access gate (beta testers). Off unless STAGING_ACCESS_CODE is set,
// which production never does. Edge-safe: Web Crypto only, no Node imports,
// because the middleware runs on the Edge runtime.
//
// STAGING_ACCESS_CODE is a plain (not NEXT_PUBLIC_) variable: Next.js only
// inlines NEXT_PUBLIC_* at build time, so the middleware and the route
// handler read it from the server's environment at runtime (docker compose
// env_file). The same image can run with or without the gate.

export const BETA_COOKIE = 'wu_beta';
export const BETA_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
// A readable (not HttpOnly) marker so client code can show the Beta badge on
// pages that were rendered at build time.
export const STAGING_MARK_COOKIE = 'wu_staging';
const LABEL = 'wu-beta-gate-v1';

export function betaCode(env: Record<string, string | undefined> = process.env): string | null {
  const v = env.STAGING_ACCESS_CODE?.trim();
  return v ? v : null;
}

async function hmacHex(key: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const k = await crypto.subtle.importKey('raw', enc.encode(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', k, enc.encode(message)));
  return [...sig].map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Constant-time for equal lengths; different lengths are unequal anyway.
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// The cookie value: an HMAC of a fixed label keyed with the access code, so
// changing the code signs everyone out of the gate.
export function betaToken(code: string): Promise<string> {
  return hmacHex(code, LABEL);
}

export async function isValidBetaCookie(value: string | undefined, code: string): Promise<boolean> {
  if (!value) return false;
  return safeEqual(value, await betaToken(code));
}

// Compares a submitted code with the real one without leaking timing: both
// go through the same HMAC first, so the comparison is on fixed-length hex.
export async function codeMatches(submitted: string, code: string): Promise<boolean> {
  const [a, b] = await Promise.all([hmacHex(LABEL, submitted.trim()), hmacHex(LABEL, code)]);
  return safeEqual(a, b);
}

// Paths that stay open while the gate is on.
const STATIC_FILE = /\.(?:ico|png|jpe?g|gif|svg|webp|avif|txt|xml|webmanifest|json|mp4|webm|woff2?|ttf|css|js|map)$/i;
export function isBetaOpenPath(path: string): boolean {
  return (
    path === '/beta-access' ||
    path === '/api/beta-access' ||
    path.startsWith('/api/webhooks/') ||
    // Calendar apps fetch the private plan feed without the beta cookie.
    path.startsWith('/api/calendar/') ||
    path === '/api/health' ||
    path.startsWith('/api/cron/') ||
    path.startsWith('/api/internal/') ||
    path.startsWith('/_next/') ||
    (STATIC_FILE.test(path) && path !== '/robots.txt' && path !== '/sitemap.xml')
  );
}

// Only same-site relative paths survive as ?next=, so the gate can't be used
// to send someone to another site.
export function safeNext(raw: string | null | undefined): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//') || raw.startsWith('/\\')) return '/';
  if (raw.startsWith('/beta-access')) return '/';
  return raw;
}

export const ROBOTS_DISALLOW_ALL = 'User-agent: *\nDisallow: /\n';
