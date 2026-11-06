import { describe, expect, it } from 'vitest';
import type { Account, ParsedSnapshot } from '../schemas.js';
import { monthsBefore, quarterWrap, shouldAutoPlayWrap, WRAP_REPLAY_DAYS } from './quarterWrap.js';

const NOW = Date.UTC(2026, 10, 1, 12) / 1000; // 2026-11-01 12:00 UTC
const DAY = 86400;
const acc = (username: string, daysAgo: number | null): Account => ({ username, href: `https://www.tiktok.com/@${username}`, followedAt: daysAgo === null ? null : NOW - daysAgo * DAY });
const snap = (followers: Account[], following: Account[], exportedAt = NOW): ParsedSnapshot => ({ exportedAt, followers, following, format: 'json', platform: 'tiktok' });

describe('monthsBefore', () => {
  it('goes back calendar months and clamps to month end', () => {
    expect(new Date(monthsBefore(NOW, 3) * 1000).toISOString()).toBe('2026-08-01T12:00:00.000Z');
    expect(new Date(monthsBefore(Date.UTC(2026, 4, 31) / 1000, 3) * 1000).toISOString()).toBe('2026-02-28T00:00:00.000Z');
  });
});

describe('quarterWrap', () => {
  it('returns null when nothing happened and there is no previous export', () => {
    expect(quarterWrap({ current: snap([acc('a', 400)], [acc('b', null)]) })).toBeNull();
  });

  it('counts arrivals inside the 3 months and the 3 before', () => {
    const w = quarterWrap({ current: snap([acc('a', 5), acc('b', 40), acc('c', 100), acc('d', 120), acc('e', 300)], [acc('a', 10)]) })!;
    expect(w.arrived).toBe(2);
    expect(w.arrivedBefore).toBe(2);
    expect(w.arrivedMutual).toBe(1);
    expect(w.weeks.reduce((s, n) => s + n, 0)).toBe(2);
    expect(w.weeks).toHaveLength(14);
  });

  it('counts follows made and how many follow back', () => {
    const w = quarterWrap({ current: snap([acc('x', 500)], [acc('x', 20), acc('y', 21), acc('z', 200)]) })!;
    expect(w.followsMade).toBe(2);
    expect(w.followsBack).toBe(1);
  });

  it('finds a follow spree of 5+ in one day', () => {
    const made = Array.from({ length: 6 }, (_, i) => ({ ...acc(`s${i}`, 30), followedAt: NOW - 30 * DAY + i * 60 }));
    expect(quarterWrap({ current: snap([], made) })!.spree).toEqual({ date: '2026-10-02', count: 6 });
    expect(quarterWrap({ current: snap([], made.slice(0, 4)) })!.spree).toBeNull();
  });

  it('compares with a previous export and labels its date', () => {
    const prev = snap([acc('a', 500), acc('gone', 500)], [], NOW - 60 * DAY);
    const w = quarterWrap({ current: snap([acc('a', 500), acc('new', 500)], []), previous: prev })!;
    expect(w.sincePrevious).toEqual({ date: '2026-09-02', gained: 1, lost: 1 });
    expect(w.arrived).toBe(0);
  });

  it('never includes usernames', () => {
    const w = quarterWrap({ current: snap([acc('secretname', 3)], [acc('hiddenname', 3)]) });
    expect(JSON.stringify(w)).not.toMatch(/secretname|hiddenname/);
  });
});

describe('shouldAutoPlayWrap', () => {
  it('plays with no record, or once the export is far enough newer', () => {
    expect(shouldAutoPlayWrap(null, NOW)).toBe(true);
    expect(shouldAutoPlayWrap(NOW, NOW)).toBe(false);
    expect(shouldAutoPlayWrap(NOW - (WRAP_REPLAY_DAYS - 1) * DAY, NOW)).toBe(false);
    expect(shouldAutoPlayWrap(NOW - WRAP_REPLAY_DAYS * DAY, NOW)).toBe(true);
  });
});
