import { describe, expect, it } from 'vitest';
import { usageBreakdown } from './usageBreakdown';
import { MONTHLY_ALLOWANCE_USD } from './allowanceMath';

const at = (s: string) => new Date(`${s}T12:00:00Z`);

describe('usageBreakdown', () => {
  const rows = [
    { action: 'chat', costUsd: 0.3, at: at('2026-11-20') },
    { action: 'chatDeep', costUsd: 0.3, at: at('2026-11-21') },
    { action: 'check', costUsd: 0.2, at: at('2026-11-22') },
    { action: 'insights', costUsd: 0.2, at: at('2026-11-23') },
    { action: 'chat', costUsd: 1, at: at('2026-10-10') },
    { action: 'unknown', costUsd: 0, at: at('2026-11-23') },
  ];
  const out = usageBreakdown(rows, at('2026-11-19'), at('2026-11-25'));

  it('shares this period by feature, biggest first, adding up to 1', () => {
    expect(out.byFeature).toEqual([{ feature: 'ask', share: 0.6 }, { feature: 'create', share: 0.2 }, { feature: 'photos', share: 0.2 }]);
  });

  it('never exposes money: only shares and fills between 0 and 1', () => {
    const json = JSON.stringify(out);
    expect(json).not.toMatch(/usd|cost|\$/i);
    for (const m of out.months) expect(m.fill).toBeGreaterThanOrEqual(0);
    for (const m of out.months) expect(m.fill).toBeLessThanOrEqual(1);
  });

  it('lists the last 6 months, oldest first, with each month filled against the allowance', () => {
    expect(out.months.map((m) => m.month)).toEqual(['2026-06', '2026-07', '2026-08', '2026-09', '2026-10', '2026-11']);
    expect(out.months[4]!.fill).toBe(Math.round((1 / MONTHLY_ALLOWANCE_USD) * 100) / 100);
  });

  it('is empty when nothing was used this period', () => {
    expect(usageBreakdown([], at('2026-11-01'), at('2026-11-25')).byFeature).toEqual([]);
  });
});
