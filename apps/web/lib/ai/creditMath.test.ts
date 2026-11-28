import { describe, expect, it } from 'vitest';
import { calendarPeriodKey, creditBalance, nextExpiry, startOfNextMonthUtc, type CreditRow } from './creditMath';

const d = (s: string) => new Date(s);
const row = (delta: number, createdAt: string, expiresAt: string | null = null): CreditRow =>
  ({ delta, createdAt: d(createdAt), expiresAt: expiresAt ? d(expiresAt) : null });

describe('creditBalance', () => {
  it('sums a grant minus spends', () => {
    const rows = [row(100, '2026-11-01', '2026-12-01'), row(-2, '2026-11-02'), row(-15, '2026-11-03')];
    expect(creditBalance(rows, d('2026-11-10'))).toBe(83);
  });

  it('drops a grant once it expires, with no rollover', () => {
    const rows = [row(100, '2026-11-01', '2026-12-01'), row(-20, '2026-11-02')];
    expect(creditBalance(rows, d('2026-12-01'))).toBe(0);
  });

  it('spends the monthly allowance before a top-up', () => {
    const rows = [
      row(100, '2026-11-01', '2026-12-01'),
      row(300, '2026-11-02', '2027-11-02'),
      row(-50, '2026-11-03'),
    ];
    // After the allowance expires, the whole top-up is still there.
    expect(creditBalance(rows, d('2026-12-02'))).toBe(300);
    expect(creditBalance(rows, d('2026-11-10'))).toBe(350);
  });

  it('never lets an expired grant eat into a top-up', () => {
    const rows = [
      row(100, '2026-11-01', '2026-12-01'),
      row(-60, '2026-11-05'),
      row(300, '2026-12-05', '2027-12-05'),
      row(-10, '2026-12-06'),
    ];
    expect(creditBalance(rows, d('2026-12-10'))).toBe(290);
  });

  it('counts a refund as spendable again', () => {
    const rows = [row(100, '2026-11-01', '2026-12-01'), row(-15, '2026-11-02'), row(15, '2026-11-02T00:00:01Z', '2026-12-01')];
    expect(creditBalance(rows, d('2026-11-03'))).toBe(100);
  });
});

describe('nextExpiry', () => {
  it('returns when the soonest credits with something left expire', () => {
    const rows = [row(100, '2026-11-01', '2026-12-01'), row(300, '2026-11-02', '2027-11-02')];
    expect(nextExpiry(rows, d('2026-11-10'))).toEqual(d('2026-12-01'));
  });
  it('skips an allowance that is fully spent', () => {
    const rows = [row(10, '2026-11-01', '2026-12-01'), row(300, '2026-11-02', '2027-11-02'), row(-10, '2026-11-03')];
    expect(nextExpiry(rows, d('2026-11-10'))).toEqual(d('2027-11-02'));
  });
});

describe('calendar periods', () => {
  it('keys and ends a month in UTC', () => {
    expect(calendarPeriodKey('lifetime', d('2026-11-30T23:00:00Z'))).toBe('lifetime:2026-11');
    expect(startOfNextMonthUtc(d('2026-12-15T10:00:00Z'))).toEqual(d('2027-01-01T00:00:00Z'));
  });
});
