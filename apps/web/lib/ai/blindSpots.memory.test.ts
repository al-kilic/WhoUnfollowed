import { describe, expect, it } from 'vitest';
import type { ContentStats, ExportStats, VoiceStats } from '@ig-tracker/core';
import { detectBlindSpots, type Detector } from './blindSpots';
import { rowsToState, stateToRows, emptyState } from './blindSpotState';
import { getSampleContentStats, getSampleLedger, getSampleVoice } from '@/lib/sample/learned';
import { getSampleSnapshots } from '@/lib/sample/sampleSnapshot';
import { exportStats } from '@ig-tracker/core';

// Memory v2 (phase 2E): detectors 3, 5, 9, 14 and 15, and the database form
// of the blind-spot cadence state.

const base = (over: Partial<ExportStats> = {}): ExportStats => ({
  platform: 'instagram', exportedAt: Math.floor(Date.parse('2026-11-20T10:00:00Z') / 1000), followers: 1000, following: 900, mutuals: 700, fans: 300, notFollowingBack: 200,
  newFollowersByMonth: {}, followBackRate12m: null, followBackRatePrev12m: null, ...over,
} as unknown as ExportStats);
const fact = (id: string, params: Record<string, number | string>) => ({ id, params });
const content = (over: Partial<ContentStats> = {}): ContentStats => ({
  total: 100, first: '2024-01-01', last: '2026-11-01', byMonth: [], weekday: [0, 0, 0, 0, 0, 0, 0], hour: Array(24).fill(0) as number[], posts30: 4, posts90: 12, posts365: 50,
  medianGapDays: 4, currentGapDays: 3, longestGapDays: 20, longestGapFrom: '2026-07-01', mix90: { photo: 0.8, carousel: 0.1, reel: 0.1, video: 0 }, mix365: { photo: 0.7, carousel: 0.2, reel: 0.1, video: 0 },
  avgSlides: 6, medianCaptionChars: 120, medianHashtags: 8, ctaShare: 0.2, questionShare: 0.2, ...over,
});
const voice = (over: Partial<VoiceStats> = {}): VoiceStats => ({
  captions: 12, medianChars: 90, medianWords: 16, shortShare: 0.4, longShare: 0, emojiPerCaption: 0.2, emojiShare: 0.1, hashtagMedian: 8, hashtagShare: 1,
  questionShare: 0.25, ctaShare: 0.1, lineBreakShare: 0.1, firstPersonShare: 0.6, lowercaseStartShare: 0, ...over,
});
const found = (i: Parameters<typeof detectBlindSpots>[0]) => detectBlindSpots(i).map((b) => b.detector);
const has = (i: Parameters<typeof detectBlindSpots>[0], d: Detector) => found(i).includes(d);

describe('new detectors', () => {
  it('3 current_gap: far longer than usual since the last post', () => {
    expect(has({ stats: [base()], content: content({ currentGapDays: 21, medianGapDays: 4 }) }, 'current_gap')).toBe(true);
    expect(has({ stats: [base()], content: content({ currentGapDays: 9, medianGapDays: 2 }) }, 'current_gap')).toBe(false); // under 10 days
    expect(has({ stats: [base()], content: content({ currentGapDays: 12, medianGapDays: 7 }) }, 'current_gap')).toBe(false); // under 2x usual
  });

  it('5 winner_underused: a format that wins but is rarely posted', () => {
    const ledger = [{ key: 'format:carousel', posts: 3, avgNew: 40, vsAll: 2.1, estimated: false }];
    const spot = detectBlindSpots({ stats: [base()], content: content(), ledger }).find((b) => b.detector === 'winner_underused');
    expect(spot).toMatchObject({ key: 'winner_underused:carousel', params: { format: 2, times: 2.1, share: 10, avg: 40 } });
    expect(has({ stats: [base()], content: content({ mix90: { photo: 0.5, carousel: 0.4, reel: 0.1, video: 0 } }), ledger }, 'winner_underused')).toBe(false);
    expect(has({ stats: [base()], content: content(), ledger: [{ ...ledger[0]!, posts: 2 }] }, 'winner_underused')).toBe(false);
  });

  it('9 mutuals_lost_twice: in two exports running', () => {
    const s0 = base({ facts: [fact('fix.mutuals_lost', { count: 4 })] } as Partial<ExportStats>);
    const s1 = base({ facts: [fact('fix.mutuals_lost', { count: 3 })] } as Partial<ExportStats>);
    expect(detectBlindSpots({ stats: [s0, s1] }).find((b) => b.detector === 'mutuals_lost_twice')?.params).toEqual({ count: 4, before: 3 });
    expect(has({ stats: [s0, base()] }, 'mutuals_lost_twice')).toBe(false);
  });

  it('14 no_cta: captions almost never ask anything', () => {
    expect(has({ stats: [base()], voice: voice({ questionShare: 0.05, ctaShare: 0 }) }, 'no_cta')).toBe(true);
    expect(has({ stats: [base()], voice: voice({ questionShare: 0.05, ctaShare: 0, captions: 5 }) }, 'no_cta')).toBe(false);
    expect(has({ stats: [base()], voice: voice() }, 'no_cta')).toBe(false);
  });

  it('15 weekday_mismatch: followers arrive on a day the member never posts', () => {
    const s = base({ facts: [fact('fact.arrival_weekday', { weekday: 3, pct: 40 })] } as Partial<ExportStats>);
    expect(detectBlindSpots({ stats: [s], postingDays: [1, 5] }).find((b) => b.detector === 'weekday_mismatch')).toMatchObject({ key: 'weekday_mismatch:3', params: { weekday: 3, pct: 40 } });
    expect(has({ stats: [s], postingDays: [1, 3] }, 'weekday_mismatch')).toBe(false);
    expect(has({ stats: [s] }, 'weekday_mismatch')).toBe(false);
  });

  it('params stay numbers and dates only', () => {
    const spots = detectBlindSpots({ stats: [base()], content: content({ currentGapDays: 30 }), voice: voice({ questionShare: 0, ctaShare: 0 }) });
    for (const s of spots) for (const v of Object.values(s.params)) expect(typeof v === 'number' || /^\d{4}-\d{2}(-\d{2})?$/.test(v)).toBe(true);
  });

  it('Inês: her captions rarely ask a question, which the sample shows', () => {
    const snaps = getSampleSnapshots();
    const stats = [exportStats(snaps[2]!, snaps[1]), exportStats(snaps[1]!)];
    const d = found({ stats, postingDays: [1, 3, 5], content: getSampleContentStats(), voice: getSampleVoice(), ledger: getSampleLedger().formats, now: new Date('2026-11-23T10:00:00Z') });
    expect(d).toContain('no_cta');
    expect(d).not.toContain('weekday_mismatch'); // she posts on Thursday, the day most followers arrive
  });
});

describe('blind-spot state in the database', () => {
  it('round-trips through rows', () => {
    const s = { ...emptyState(), history: { stale_pending: { shown: 2 }, 'quiet_season:8': { shown: 1, known: true }, no_cta: { shown: 1, snoozeUntil: 5_000 } }, current: 'stale_pending', newAt: [1_000, 2_000], perData: { '123': 2 } };
    const rows = stateToRows(s, [], '123', 2_000);
    expect(rows.find((r) => r.key === 'quiet_season:8')).toMatchObject({ status: 'dismissed', detector: 'quiet_season' });
    const back = rowsToState(rows);
    expect(back.current).toBe('stale_pending');
    expect(back.history).toEqual(s.history);
    expect(back.perData).toEqual({ '123': 3 });
  });

  it('keeps when a key was first seen and for which export', () => {
    const first = stateToRows({ ...emptyState(), history: { no_cta: { shown: 1 } }, current: 'no_cta' }, [], '100', 10);
    const later = stateToRows({ ...emptyState(), history: { no_cta: { shown: 2 } } }, first, '200', 99);
    expect(later[0]).toMatchObject({ firstSeenAt: 10, dataKey: '100', shownCount: 2, isCurrent: false });
  });
});
