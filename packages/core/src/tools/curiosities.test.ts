import { describe, expect, it } from 'vitest';
import type { Account, ParsedSnapshot } from '../schemas.js';
import { curiosities } from './curiosities.js';

const NOW = Date.UTC(2026, 10, 1, 12) / 1000; // Sun 2026-11-01 12:00 UTC
const DAY = 86400;
const acc = (username: string, ts: number | null): Account => ({ username, href: `https://www.instagram.com/${username}`, followedAt: ts });
const snap = (followers: Account[], following: Account[]): ParsedSnapshot => ({ exportedAt: NOW, followers, following, format: 'json', platform: 'instagram' });
const byId = (list: ReturnType<typeof curiosities>, id: string) => list.find(c => c.id === id);

describe('curiosities', () => {
  it('returns nothing for an empty export', () => {
    expect(curiosities({ current: snap([], []) })).toEqual([]);
  });

  it('never includes usernames', () => {
    const f = Array.from({ length: 30 }, (_, i) => acc(`secret${i}`, NOW - i * 20 * DAY));
    const json = JSON.stringify(curiosities({ current: snap(f, [acc('waiting', NOW - 900 * DAY)]) }));
    expect(json).not.toMatch(/secret|waiting/);
  });

  it('compares with the previous export', () => {
    const c = curiosities({ current: snap([acc('a', null), acc('b', null)], []), previous: snap([acc('a', null), acc('x', null), acc('y', null)], []) });
    expect(byId(c, 'since_last')!.params).toEqual({ gained: 1, lost: 2, net: -1 });
  });

  it('finds the weekday most followers arrived on', () => {
    // 15 on Mondays (NOW - 6 days is Monday), 5 on Wednesdays.
    const mon = Array.from({ length: 15 }, (_, i) => acc(`m${i}`, NOW - (6 + 7 * i) * DAY));
    const wed = Array.from({ length: 5 }, (_, i) => acc(`w${i}`, NOW - (4 + 7 * i) * DAY));
    const w = byId(curiosities({ current: snap([...mon, ...wed], []) }), 'arrival_weekday')!;
    expect(w.params).toEqual({ weekday: 0, pct: 75 });
    expect(w.series).toEqual([15, 0, 5, 0, 0, 0, 0]);
  });

  it('skips the weekday fact below 20 dated followers', () => {
    const f = Array.from({ length: 19 }, (_, i) => acc(`f${i}`, NOW - i * DAY));
    expect(byId(curiosities({ current: snap(f, []) }), 'arrival_weekday')).toBeUndefined();
  });

  it('dates the first follower and the longest wait', () => {
    const c = curiosities({ current: snap([acc('old', NOW - 800 * DAY), acc('new', NOW - 3 * DAY)], [acc('ghost', NOW - 400 * DAY), acc('old', NOW - 10 * DAY)]) });
    expect(byId(c, 'first_follower')!.params).toEqual({ date: '2024-08-23', years: 2 });
    expect(byId(c, 'longest_wait')!.params).toEqual({ days: 400, count: 1 });
  });

  it('finds a follow spree of 10+ in one day', () => {
    const spree = Array.from({ length: 12 }, (_, i) => acc(`s${i}`, NOW - 30 * DAY + i * 60));
    const s = byId(curiosities({ current: snap([], spree) }), 'follow_spree')!;
    expect(s.params).toEqual({ date: '2026-10-02', count: 12 });
    expect(byId(curiosities({ current: snap([], spree.slice(0, 9)) }), 'follow_spree')).toBeUndefined();
  });

  it('counts fans and the recent share', () => {
    const f = Array.from({ length: 10 }, (_, i) => acc(`f${i}`, NOW - (i < 4 ? 30 : 500) * DAY));
    const c = curiosities({ current: snap(f, [acc('f0', NOW)]) });
    expect(byId(c, 'fans')!.params).toEqual({ count: 9, pct: 90 });
    expect(byId(c, 'recent_share')!.params).toEqual({ pct: 40, count: 4 });
  });

  it('falls back to UTC for a bad time zone', () => {
    expect(() => curiosities({ current: snap([acc('a', NOW)], []), timeZone: 'Not/AZone' })).not.toThrow();
  });
});
