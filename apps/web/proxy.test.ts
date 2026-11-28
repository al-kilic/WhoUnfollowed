// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';

// The intl middleware stands in as a marker, so the tests can see exactly
// which requests reach it.
vi.mock('next-intl/middleware', () => ({
  default: () => () => {
    const r = NextResponse.next();
    r.headers.set('x-test-intl', '1');
    return r;
  },
}));

import { matchesLegacy, proxy as middleware } from './proxy';
import { BETA_COOKIE, betaToken, safeNext } from './lib/betaGate';

const req = (path: string, cookies: Record<string, string> = {}) => {
  const r = new NextRequest(new URL(path, 'https://staging.example.test'));
  for (const [k, v] of Object.entries(cookies)) r.cookies.set(k, v);
  return r;
};

// Every path the literal matcher matched before the gate (and some it didn't).
const LEGACY = ['/', '/app', '/app/today', '/pricing', '/instagram-coach', '/instagram-updates/2026-11-23', '/es', '/es/pricing', '/pt/app/you', '/results', '/login', '/history/x', '/compare/foo', '/unsubscribe'];
const NOT_LEGACY = ['/blog', '/blog/a-post', '/author/alan-kilic', '/api/ai/state', '/api/health', '/robots.txt', '/sitemap.xml', '/logo.png', '/pricingx', '/fr', '/beta-access', '/llms.txt'];

describe('middleware with the staging gate off (production)', () => {
  beforeEach(() => { delete process.env.STAGING_ACCESS_CODE; });

  it('sends the old matcher routes to the intl middleware, as before', async () => {
    for (const p of LEGACY) {
      expect(matchesLegacy(p), p).toBe(true);
      const res = await middleware(req(p));
      // /history needs a session: unchanged auth redirect; others reach intl.
      if (p.startsWith('/history')) expect(res.headers.get('location')).toContain('/login');
      else expect(res.headers.get('x-test-intl'), p).toBe('1');
    }
  });

  it('passes every other path straight through, untouched', async () => {
    for (const p of NOT_LEGACY) {
      expect(matchesLegacy(p), p).toBe(false);
      const res = await middleware(req(p));
      expect(res.headers.get('x-test-intl'), p).toBeNull();
      expect(res.headers.get('location'), p).toBeNull();
      expect(res.headers.get('x-robots-tag'), p).toBeNull();
      expect(res.status, p).toBe(200);
    }
  });

  it('keeps the existing auth gate (no session on /coach goes to login)', async () => {
    const res = await middleware(req('/es/coach'));
    expect(res.headers.get('location')).toBe('https://staging.example.test/es/login');
  });
});

describe('middleware with the staging gate on', () => {
  beforeEach(() => { process.env.STAGING_ACCESS_CODE = 'test-beta'; });
  afterEach(() => { delete process.env.STAGING_ACCESS_CODE; });

  it('redirects pages to the gate with a safe next and marks them noindex', async () => {
    const res = await middleware(req('/app/today?x=1'));
    const loc = new URL(res.headers.get('location')!);
    expect(loc.pathname).toBe('/beta-access');
    expect(loc.searchParams.get('next')).toBe('/app/today?x=1');
    expect(res.headers.get('x-robots-tag')).toBe('noindex, nofollow');
  });

  it('answers 401 JSON for API calls without the cookie', async () => {
    const res = await middleware(req('/api/ai/state'));
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: 'beta_access_required' });
  });

  it('lets the gate, webhooks, health, cron, internal and static files through', async () => {
    for (const p of ['/beta-access', '/api/beta-access', '/api/webhooks/stripe', '/api/health', '/api/cron/unlock-expiry', '/api/internal/migrate', '/_next/static/x.js', '/logo.png', '/favicon.ico']) {
      const res = await middleware(req(p));
      expect(res.headers.get('location'), p).toBeNull();
      expect(res.status, p).toBe(200);
    }
  });

  it('serves a disallow-all robots.txt', async () => {
    const res = await middleware(req('/robots.txt'));
    expect(await res.text()).toBe('User-agent: *\nDisallow: /\n');
  });

  it('accepts a valid cookie and rejects a wrong or stale one', async () => {
    const ok = await middleware(req('/app/today', { [BETA_COOKIE]: await betaToken('test-beta') }));
    expect(ok.headers.get('location')).toBeNull();
    expect(ok.headers.get('x-test-intl')).toBe('1');
    const api = await middleware(req('/api/ai/state', { [BETA_COOKIE]: await betaToken('test-beta') }));
    expect(api.status).toBe(200);
    for (const bad of ['nope', await betaToken('old-code')]) {
      const res = await middleware(req('/app/today', { [BETA_COOKIE]: bad }));
      expect(new URL(res.headers.get('location')!).pathname).toBe('/beta-access');
    }
  });

  it('sets the readable staging marker for the Beta badge', async () => {
    const res = await middleware(req('/beta-access'));
    expect(res.cookies.get('wu_staging')?.value).toBe('1');
  });
});

describe('safeNext', () => {
  it('keeps same-site paths only', () => {
    expect(safeNext('/app?x=1')).toBe('/app?x=1');
    for (const bad of ['https://evil.test', '//evil.test', '/\\evil.test', 'app', '', null, '/beta-access?next=/x']) expect(safeNext(bad)).toBe('/');
  });
});
