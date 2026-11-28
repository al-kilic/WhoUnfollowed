// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const limit = vi.hoisted(() => ({ allowed: true }));
vi.mock('@/lib/auth/rate-limit', () => ({
  clientIpFromXff: () => '1.2.3.4',
  checkRateLimit: () => ({ allowed: limit.allowed, remaining: 1 }),
}));

import { POST } from './route';
import { betaToken } from '@/lib/betaGate';

const post = (body: unknown) => new NextRequest('https://staging.example.test/api/beta-access', {
  method: 'POST', body: JSON.stringify(body), headers: { 'content-type': 'application/json' },
});

describe('POST /api/beta-access', () => {
  beforeEach(() => { process.env.STAGING_ACCESS_CODE = 'test-beta'; limit.allowed = true; });
  afterEach(() => { delete process.env.STAGING_ACCESS_CODE; vi.unstubAllEnvs(); });

  it('does not exist without a staging code', async () => {
    delete process.env.STAGING_ACCESS_CODE;
    expect((await POST(post({ code: 'test-beta' }))).status).toBe(404);
  });

  it('rejects a wrong or missing code without setting a cookie', async () => {
    for (const body of [{ code: 'nope' }, {}, { code: 42 }]) {
      const res = await POST(post(body));
      expect(res.status).toBe(401);
      expect(res.cookies.get('wu_beta')).toBeUndefined();
    }
  });

  it('sets an HttpOnly, Lax, 30-day cookie holding the HMAC on the right code', async () => {
    const res = await POST(post({ code: ' test-beta ' }));
    expect(res.status).toBe(200);
    const c = res.cookies.get('wu_beta')!;
    expect(c.value).toBe(await betaToken('test-beta'));
    expect(c.value).not.toContain('test-beta');
    expect(c.httpOnly).toBe(true);
    expect(c.sameSite).toBe('lax');
    expect(c.maxAge).toBe(60 * 60 * 24 * 30);
    expect(c.path).toBe('/');
  });

  it('marks the cookie Secure in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const res = await POST(post({ code: 'test-beta' }));
    expect(res.cookies.get('wu_beta')?.secure).toBe(true);
  });

  it('rate-limits per IP', async () => {
    limit.allowed = false;
    expect((await POST(post({ code: 'test-beta' }))).status).toBe(429);
  });
});
