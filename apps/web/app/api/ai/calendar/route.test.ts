import { beforeEach, describe, expect, it, vi } from 'vitest';

const m = vi.hoisted(() => ({
  guard: vi.fn(),
  get: vi.fn(),
  set: vi.fn(),
  revoke: vi.fn(),
}));
vi.mock('@/lib/ai/guard', () => ({ guardProAi: m.guard, readJson: (r: Request) => r.json() }));
vi.mock('@/lib/ai/calendarFeed', () => ({
  getCalendarToken: m.get, setCalendarToken: m.set, revokeCalendarToken: m.revoke,
  feedUrl: (t: string) => `https://whounfollowed.co/api/calendar/${t}.ics`,
  feedLabels: () => ({ name: 'Plan' }),
}));

import { GET, POST } from './route';

const post = (body: unknown) => POST(new Request('http://x/api/ai/calendar', { method: 'POST', body: JSON.stringify(body) }));

describe('/api/ai/calendar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    m.guard.mockResolvedValue({ ok: true, userId: 'u1' });
  });

  it('needs Pro AI', async () => {
    m.guard.mockResolvedValue({ ok: false, response: new Response(null, { status: 403 }) });
    expect((await GET(new Request('http://x/api/ai/calendar'))).status).toBe(403);
  });

  it('returns no feed until the member turns it on', async () => {
    m.get.mockResolvedValue(null);
    expect(await (await GET(new Request('http://x/api/ai/calendar'))).json()).toEqual({ feed: null });
  });

  it('create keeps an existing link; rotate replaces it; revoke clears it', async () => {
    m.get.mockResolvedValue('a'.repeat(64));
    const created = await (await post({ action: 'create' })).json();
    expect(created.feed.url).toContain('a'.repeat(64));
    expect(m.set).not.toHaveBeenCalled();
    m.set.mockResolvedValue('b'.repeat(64));
    const rotated = await (await post({ action: 'rotate' })).json();
    expect(rotated.feed.url).toContain('b'.repeat(64));
    expect(rotated.feed.webcal.startsWith('webcal://')).toBe(true);
    expect(await (await post({ action: 'revoke' })).json()).toEqual({ feed: null });
    expect(m.revoke).toHaveBeenCalledWith('u1');
  });

  it('rejects unknown actions', async () => {
    expect((await post({ action: 'delete-everything' })).status).toBe(400);
  });
});
