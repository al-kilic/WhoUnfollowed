import { describe, expect, it } from 'vitest';
import { contentStats, exportMoments, pickVoiceExemplars, voiceStats } from '@ig-tracker/core';
import { getSampleContent } from './sampleContent';
import { getSampleSnapshots, SAMPLE_EXPORTED_AT, SAMPLE_SPREE } from './sampleSnapshot';
import { getSampleCoach } from './coach';

const day = (ts: number) => new Date(ts * 1000).toISOString().slice(0, 10);

describe("Inês's posting history", () => {
  const items = getSampleContent();
  const s = contentStats(items, { now: SAMPLE_EXPORTED_AT });

  it('is the same every time', () => {
    expect(getSampleContent()).toBe(items);
    expect(items.length).toBeGreaterThan(200);
  });

  it('posts only on Tuesday, Thursday and Saturday, at 18:30', () => {
    expect(s.weekday[0]).toBe(0);
    expect(s.weekday[2]).toBe(0);
    expect(s.weekday[4]).toBe(0);
    expect(s.weekday[6]).toBe(0);
    expect(s.hour[18]).toBe(s.posts365);
  });

  it('posted once in July and August 2026: the Aug 20 Reel', () => {
    const jul = s.byMonth.find((m) => m.month === '2026-07')!;
    const aug = s.byMonth.find((m) => m.month === '2026-08')!;
    expect(jul.photo + jul.carousel + jul.reel + jul.video).toBe(0);
    expect(aug).toMatchObject({ reel: 1, photo: 0, carousel: 0 });
  });

  it('includes every post the sample coach has logged, on its date and in its format', () => {
    const coach = getSampleCoach('en');
    for (const p of coach.posted) {
      const at = Math.floor(Date.parse(p.postedAt) / 1000);
      expect(items.find((i) => i.date === at)?.format, p.title).toBe(p.format);
    }
  });

  it('has the caption habits Check points out: few questions, no calls to action, broad hashtags', () => {
    const v = voiceStats(items.map((i) => i.caption));
    expect(v.questionShare).toBeLessThan(0.1);
    expect(v.ctaShare).toBe(0);
    expect(v.hashtagMedian).toBeGreaterThanOrEqual(6);
    expect(v.emojiShare).toBe(0);
    expect(v.firstPersonShare).toBeGreaterThan(0.3);
  });

  it('gives voice examples without hashtags or handles', () => {
    const ex = pickVoiceExemplars(items);
    expect(ex.length).toBe(12);
    for (const e of ex) {
      expect(e).not.toMatch(/#|@/);
      expect(e).not.toMatch(/—/);
    }
  });

  it('has no em dashes in any caption', () => {
    expect(items.some((i) => i.caption.includes('—'))).toBe(false);
  });
});

describe("Inês's moments", () => {
  const ms = exportMoments(getSampleSnapshots());

  it('agree with the coach: October 2026 best month, quiet July and August, the March 2022 spree', () => {
    expect(ms.find((m) => m.kind === 'best_month')).toEqual({ kind: 'best_month', at: '2026-10', params: { followers: 72 } });
    expect(ms.filter((m) => m.kind === 'quiet_month').map((m) => m.at).sort()).toEqual(['2026-07', '2026-08']);
    expect(ms.find((m) => m.kind === 'follow_spree')).toEqual({ kind: 'follow_spree', at: day(SAMPLE_SPREE), params: { count: 41, followedBack: 0 } });
  });

  it('show no drop: followers grew at every export', () => {
    expect(ms.some((m) => m.kind === 'drop')).toBe(false);
  });
});
