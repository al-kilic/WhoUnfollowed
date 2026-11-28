import { describe, it, expect, vi } from 'vitest';

vi.mock('server-only', () => ({}));
vi.mock('@/lib/db/index', () => ({ db: {} }));

import { defaultPlatform, platformOf, progressOf } from './goals';

const row = (over: Record<string, unknown> = {}) => ({
  id: 'g1', userId: 'u1', platform: 'instagram', type: 'followers', target: 2000, by: null, startFollowers: 1000,
  setAt: new Date('2026-10-01T12:00:00Z'), note: null, deadlineRemindedAt: null, createdAt: new Date(), updatedAt: new Date(), ...over,
});

describe('goals per platform (no database)', () => {
  it('picks the latest export platform, then a goal platform, then Instagram', () => {
    // Instagram first, even when Threads was uploaded more recently.
    expect(defaultPlatform(['threads', 'instagram'], [])).toBe('instagram');
    expect(defaultPlatform(['threads', 'tiktok'], [])).toBe('threads');
    expect(defaultPlatform([], [row({ platform: 'tiktok' })])).toBe('tiktok');
    expect(defaultPlatform([], [])).toBe('instagram');
  });

  it('accepts only known platforms', () => {
    expect(platformOf('threads')).toBe('threads');
    expect(platformOf('myspace')).toBeNull();
    expect(platformOf(null)).toBeNull();
  });

  it('measures a follower goal on the given exports and a habit goal on posts', () => {
    const now = new Date('2026-11-20T12:00:00Z');
    const f = progressOf(row(), [{ at: new Date('2026-11-15T12:00:00Z'), followers: 1500 }], [], now);
    expect(f.progress?.pct).toBe(50);
    expect(f.habit).toBeNull();
    const h = progressOf(row({ type: 'posts_week', target: 3 }), [], [{ at: new Date('2026-11-18T12:00:00Z'), newFollowers: null }], now);
    expect(h.progress).toBeNull();
    expect(h.habit?.current).toBe(1);
  });
});
