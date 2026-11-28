import { describe, expect, it } from 'vitest';
import type { ExportStats } from '@ig-tracker/core';
import { describeStats } from './describeStats';

const base: ExportStats = {
  platform: 'instagram', exportedAt: Date.UTC(2026, 10, 1) / 1000,
  followers: 4120, following: 900, mutuals: 700, nonFollowers: 200, fans: 3420,
  newFollowersByMonth: { '2026-03': 212, '2026-10': 40, '2025-11': 15 },
  followBackRate12m: 0.18, followBackRatePrev12m: 0.41, pendingRequests: 12,
};

describe('describeStats', () => {
  it('says so when there are no numbers', () => {
    expect(describeStats([])).toBe('No export numbers yet.');
  });
  it('states counts, rates and the biggest months', () => {
    const out = describeStats([base]);
    expect(out).toContain('4120 followers');
    expect(out).toContain('18% (12 months before: 41%)');
    expect(out).toContain('2026-03 (+212)');
    expect(out).toContain('first export');
  });
  it('computes the change since the previous export', () => {
    const prev = { ...base, exportedAt: base.exportedAt - 30 * 86_400, followers: 4024, mutuals: 710 };
    const out = describeStats([base, prev]);
    expect(out).toContain('30 days earlier: followers +96, following 0, mutuals -10');
  });
});
