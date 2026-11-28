import { describe, expect, it } from 'vitest';
import { contentStats } from './contentStats.js';
import type { ContentFormat, ExportContentItem } from '../exportContent.js';

const T = (iso: string) => Math.floor(Date.parse(iso) / 1000);
const item = (iso: string, format: ContentFormat, caption = '', slides = format === 'carousel' ? 5 : 1): ExportContentItem =>
  ({ date: T(iso), caption, format, slides, uris: [iso] });

describe('contentStats', () => {
  const now = T('2026-11-20T12:00:00Z');
  const items = [
    item('2026-11-19T18:30:00Z', 'carousel', 'Why film looks cold, and the fix. Which roll would you keep? #film #35mm', 6), // Thu
    item('2026-11-17T18:30:00Z', 'reel', 'Loading a Leica in 20 seconds #film'), // Tue
    item('2026-11-14T18:30:00Z', 'photo', 'Tram 28 at blue hour'), // Sat
    item('2026-10-01T18:30:00Z', 'reel', 'Save this for your next roll'), // Thu
    item('2026-06-10T09:00:00Z', 'carousel', 'Spring rolls', 4), // Wed
    item('2025-01-01T09:00:00Z', 'photo', 'Old one'), // more than a year ago
    item('2027-01-01T09:00:00Z', 'photo', 'future, ignored'),
  ];
  const s = contentStats(items, { now });

  it('counts by window and ignores future items', () => {
    expect(s.total).toBe(6);
    expect([s.posts30, s.posts90, s.posts365]).toEqual([3, 4, 5]);
    expect(s.first).toBe('2025-01-01');
    expect(s.last).toBe('2026-11-19');
  });
  it('builds 24 continuous months with formats', () => {
    expect(s.byMonth).toHaveLength(24);
    expect(s.byMonth[23]!.month).toBe('2026-11');
    expect(s.byMonth[23]).toMatchObject({ carousel: 1, reel: 1, photo: 1, video: 0 });
    expect(s.byMonth.find((m) => m.month === '2025-01')?.photo).toBe(1);
  });
  it('reads weekday (Monday first) and hour in the member time zone', () => {
    expect(s.weekday).toEqual([0, 1, 1, 2, 0, 1, 0]); // Tue, Wed, Thu x2, Sat
    expect(s.hour[18]).toBe(4);
    const lisbonSummer = contentStats(items, { now, utcOffsetMinutes: 60 });
    expect(lisbonSummer.hour[19]).toBe(4);
  });
  it('measures gaps, mix, slides and caption habits', () => {
    expect(s.currentGapDays).toBe(0);
    expect(s.longestGapDays).toBe(113);
    expect(s.longestGapFrom).toBe('2026-06-10');
    expect(s.mix90).toEqual({ photo: 0.25, carousel: 0.25, reel: 0.5, video: 0 });
    expect(s.avgSlides).toBe(5);
    expect(s.medianHashtags).toBe(0);
    expect(s.questionShare).toBe(0.2);
    expect(s.ctaShare).toBe(0.2);
  });
  it('handles an empty history', () => {
    const e = contentStats([], { now });
    expect(e.total).toBe(0);
    expect(e.medianGapDays).toBeNull();
    expect(e.currentGapDays).toBeNull();
    expect(e.mix365).toEqual({ photo: 0, carousel: 0, reel: 0, video: 0 });
  });
  it('holds numbers and dates only', () => {
    const flat = JSON.stringify(s);
    expect(flat).not.toMatch(/film|Leica|Tram/);
  });
});
