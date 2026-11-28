import { beforeEach, describe, expect, it, vi } from 'vitest';

const m = vi.hoisted(() => ({
  user: null as { id: string } | null,
  saved: [] as unknown[],
  allowed: true,
}));

vi.mock('@/lib/auth/session', () => ({ validateRequest: async () => ({ user: m.user }) }));
vi.mock('@/lib/auth/rate-limit', () => ({ checkRateLimit: () => ({ allowed: m.allowed, remaining: 1 }) }));
vi.mock('@/lib/db/schema', () => ({ profiles: { userId: 'user_id' } }));
vi.mock('@/lib/db/index', () => ({
  db: {
    insert: () => ({
      values: (v: unknown) => ({ onConflictDoUpdate: async (o: unknown) => { m.saved.push({ v, o }); } }),
    }),
  },
}));

import { POST } from './route';

const post = (body: unknown) => POST(new Request('http://x/api/account/name', { method: 'POST', body: JSON.stringify(body) }));

describe('POST /api/account/name', () => {
  beforeEach(() => { m.user = { id: 'u1' }; m.saved = []; m.allowed = true; });

  it('needs a signed-in member', async () => {
    m.user = null;
    expect((await post({ name: 'Alan' })).status).toBe(401);
  });

  it('saves a trimmed name and clears with an empty one', async () => {
    const r = await post({ name: '  Alan  ' });
    expect(await r.json()).toEqual({ name: 'Alan' });
    const r2 = await post({ name: '' });
    expect(await r2.json()).toEqual({ name: null });
    expect(m.saved).toHaveLength(2);
  });

  it('rejects names over 40 characters and rate limits', async () => {
    expect((await post({ name: 'x'.repeat(41) })).status).toBe(400);
    m.allowed = false;
    expect((await post({ name: 'Alan' })).status).toBe(429);
  });
});
