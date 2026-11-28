import { describe, expect, it } from 'vitest';
import { exportMoments } from './moments.js';
import { RADAR_FACT_VALUE } from '../tools/radarFacts.js';
import type { Account, ParsedSnapshot } from '../schemas.js';

const T = (iso: string) => Math.floor(Date.parse(`${iso}T12:00:00Z`) / 1000);
const DAY = 86_400;
let n = 0;
const acc = (at: number | null): Account => ({ username: `u${n++}`, href: '', followedAt: at });
const snap = (exportedAt: number, followers: Account[], following: Account[] = []): Pick<ParsedSnapshot, 'followers' | 'following' | 'exportedAt'> => ({ exportedAt, followers, following });

// Followers arriving month by month: 8 a month for two years, with
// 40 in March 2026, 1 in July and 0 in August 2026.
function history(): Account[] {
  const out: Account[] = [];
  for (let y = 2024; y <= 2026; y++) {
    for (let mo = 1; mo <= 12; mo++) {
      if (y === 2026 && mo > 10) break;
      const key = `${y}-${String(mo).padStart(2, '0')}`;
      const count = key === '2026-03' ? 40 : key === '2026-07' ? 1 : key === '2026-08' ? 0 : 8;
      for (let i = 0; i < count; i++) out.push(acc(T(`${key}-10`)));
    }
  }
  return out;
}

describe('exportMoments', () => {
  it('finds the best month, a spike against the usual month, and quiet months', () => {
    const followers = [...history(), ...Array.from({ length: 60 }, () => acc(T('2026-10-15')))];
    const ms = exportMoments([snap(T('2026-11-20'), followers)]);
    const best = ms.find((m) => m.kind === 'best_month');
    expect(best).toEqual({ kind: 'best_month', at: '2026-10', params: { followers: 68 } });
    expect(ms.find((m) => m.kind === 'spike')).toEqual({ kind: 'spike', at: '2026-03', params: { followers: 40, typical: 8 } });
    expect(ms.filter((m) => m.kind === 'quiet_month').map((m) => m.at)).toEqual(['2026-08', '2026-07']);
  });

  it('finds a week of mass following and how many followed back', () => {
    const start = T('2022-03-03');
    const spree = Array.from({ length: 30 }, (_, i) => acc(start + (i % 7) * DAY));
    const followers = [spree[0]!, spree[1]!].map((a) => ({ ...a }));
    const ms = exportMoments([snap(T('2026-11-20'), followers, [...spree, acc(T('2024-01-01'))])]);
    expect(ms.find((m) => m.kind === 'follow_spree')).toEqual({ kind: 'follow_spree', at: '2022-03-03', params: { count: 30, followedBack: 2 } });
  });

  it('flags a drop between two exports, whatever the input order', () => {
    const a = snap(T('2026-02-01'), Array.from({ length: 500 }, () => acc(null)));
    const b = snap(T('2026-06-01'), a.followers.slice(0, 470));
    const ms = exportMoments([b, a]);
    expect(ms.find((m) => m.kind === 'drop')).toEqual({ kind: 'drop', at: '2026-06-01', params: { from: 500, to: 470, net: -30, since: '2026-02-01' } });
    expect(exportMoments([a, snap(T('2026-06-01'), a.followers.slice(0, 495))]).some((m) => m.kind === 'drop')).toBe(false);
  });

  it('returns nothing for small or undated accounts, and newest first otherwise', () => {
    expect(exportMoments([])).toEqual([]);
    expect(exportMoments([snap(T('2026-01-01'), [acc(null), acc(T('2025-05-01'))])])).toEqual([]);
    const ms = exportMoments([snap(T('2026-11-20'), history())]);
    const ats = ms.map((m) => m.at);
    expect([...ats].sort().reverse()).toEqual(ats);
  });

  it('only holds numbers and dates, like Radar facts', () => {
    const ms = exportMoments([snap(T('2026-11-20'), history(), Array.from({ length: 30 }, () => acc(T('2023-05-02'))))]);
    for (const m of ms) {
      expect(RADAR_FACT_VALUE.test(m.at)).toBe(true);
      for (const v of Object.values(m.params)) expect(typeof v === 'number' || RADAR_FACT_VALUE.test(v)).toBe(true);
    }
  });
});

describe('exportContentMoments', () => {
  it('best post, best story month, busiest month and a long break, numbers only', async () => {
    const { exportContentMoments } = await import('./moments.js');
    const { aiMomentSchema } = await import('../memorySchemas.js');
    const row = (date: string, reach: number, format: 'photo' | 'reel' = 'photo') => ({ date, format, reach, plays: null, likes: 1, comments: 0, saves: 0, shares: 0, follows: 2 });
    const insights = {
      posts: [row('2026-03-01', 400), row('2026-04-02', 900, 'reel'), row('2026-05-03', 300)], formats: [], lives: 0, account: null,
      stories: { total: 20, last90: 5, last365: 20, medianReach90: 100, medianReachBefore: 120, exitPct90: 20, repliesPer100: 1, visitsPer100: 1, weekdayReach: [null, null, null, null, null, null, null],
        byMonth: [{ month: '2026-01', stories: 5, medianReach: 150 }, { month: '2026-02', stories: 6, medianReach: 240 }, { month: '2026-03', stories: 4, medianReach: 130 }, { month: '2026-04', stories: 1, medianReach: 999 }] },
    };
    const content = { byMonth: [{ month: '2026-02', photo: 2, carousel: 3, reel: 1, video: 0 }, { month: '2026-03', photo: 1, carousel: 0, reel: 0, video: 0 }], longestGapFrom: '2026-06-10', longestGapDays: 34 };
    const out = exportContentMoments(content as never, insights as never);
    expect(out).toEqual([
      { kind: 'long_break', at: '2026-06-10', params: { days: 34 } },
      { kind: 'best_post', at: '2026-04-02', params: { reach: 900, format: 3, follows: 2 } },
      { kind: 'story_best_month', at: '2026-02', params: { reach: 240, stories: 6 } },
      { kind: 'busiest_month', at: '2026-02', params: { posts: 6 } },
    ]);
    for (const m of out) expect(aiMomentSchema.safeParse(m).success).toBe(true);
    expect(exportContentMoments(null, null)).toEqual([]);
  });
});
