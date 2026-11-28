import { beforeEach, describe, expect, it, vi } from 'vitest';

const m = vi.hoisted(() => ({ feed: vi.fn() }));
vi.mock('@/lib/ai/calendarFeed', () => ({ calendarFeed: m.feed }));

import { GET } from './route';

const get = (file: string, ip = '1.2.3.4') => GET(new Request(`http://x/api/calendar/${file}`, { headers: { 'x-forwarded-for': ip } }), { params: Promise.resolve({ file }) });

describe('/api/calendar/[token].ics', () => {
  beforeEach(() => vi.clearAllMocks());

  it('serves the calendar for a known token', async () => {
    m.feed.mockResolvedValue('BEGIN:VCALENDAR\r\nEND:VCALENDAR\r\n');
    const r = await get(`${'c'.repeat(64)}.ics`, '10.0.0.1');
    expect(r.status).toBe(200);
    expect(r.headers.get('content-type')).toContain('text/calendar');
    expect(r.headers.get('cache-control')).toContain('private');
    expect(m.feed).toHaveBeenCalledWith('c'.repeat(64));
  });

  it('404s for an unknown or revoked token', async () => {
    m.feed.mockResolvedValue(null);
    expect((await get('nope.ics', '10.0.0.2')).status).toBe(404);
  });

  it('rate-limits guessing from one address', async () => {
    m.feed.mockResolvedValue(null);
    const codes: number[] = [];
    for (let i = 0; i < 12; i++) codes.push((await get(`${String(i).padStart(64, '0')}.ics`, '10.0.0.3')).status);
    expect(codes).toContain(429);
  });
});
