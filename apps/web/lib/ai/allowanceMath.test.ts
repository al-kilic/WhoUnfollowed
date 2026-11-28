import { describe, it, expect } from 'vitest';
import {
  MONTHLY_ALLOWANCE_USD, REFILL_USD, PACE_USD, MAX_REFILLS_HELD,
  allowanceView, availableUsd, canBuyRefill, checkAllowance, isEarlyLifetime, launchDate, launchOfferEndsAt,
  marginAtFullUse, netAfterStripe, refillExpiry, refillsHeld, splitCharge, usable, type Grant,
} from './allowanceMath';

const now = new Date('2026-12-10T12:00:00Z');
const g = (id: string, kind: Grant['kind'], usd: number, usedUsd = 0, expiresAt: Date | null = null, createdAt = new Date('2026-12-01T00:00:00Z')): Grant =>
  ({ id, kind, usd, usedUsd, expiresAt, createdAt });
const month = (used = 0) => g('m', 'month', MONTHLY_ALLOWANCE_USD, used, new Date('2027-01-01T00:00:00Z'));
const paid = { refillsUsable: true };

describe('use order', () => {
  it('uses the month first, then gift or trial, then refills oldest expiry first', () => {
    const grants = [
      g('r2', 'refill', REFILL_USD, 0, new Date('2027-10-01T00:00:00Z')),
      g('gift', 'gift', 7.5),
      g('r1', 'refill', REFILL_USD, 0, new Date('2027-06-01T00:00:00Z')),
      month(),
    ];
    expect(usable(grants, now, paid).map((x) => x.id)).toEqual(['m', 'gift', 'r1', 'r2']);
  });
  it('skips used-up and expired grants', () => {
    const grants = [month(MONTHLY_ALLOWANCE_USD), g('old', 'refill', REFILL_USD, 0, new Date('2026-12-01T00:00:00Z')), g('t', 'trial', 1)];
    expect(usable(grants, now, paid).map((x) => x.id)).toEqual(['t']);
  });
  it('refills only work on a paid plan; the gift and trial work without one', () => {
    const grants = [g('r', 'refill', REFILL_USD, 0, new Date('2027-06-01T00:00:00Z')), g('gift', 'gift', 7.5)];
    expect(usable(grants, now, { refillsUsable: false }).map((x) => x.id)).toEqual(['gift']);
  });
});

describe('charging', () => {
  it('splits a charge across grants in order', () => {
    const grants = [month(2.4), g('gift', 'gift', 7.5)];
    const parts = splitCharge(grants, 0.3, now, paid);
    expect(parts.map((p) => p.id)).toEqual(['m', 'gift']);
    expect(parts[0]!.add).toBeCloseTo(0.1);
    expect(parts[1]!.add).toBeCloseTo(0.2);
  });
  it('lets the last call overshoot and clamps at zero', () => {
    const parts = splitCharge([month(2.45)], 0.21, now, paid);
    expect(parts).toHaveLength(1);
    expect(parts[0]!.add).toBeCloseTo(0.05);
  });
  it('charges nothing for a free or unknown cost', () => {
    expect(splitCharge([month()], 0, now, paid)).toEqual([]);
    expect(splitCharge([month()], Number.NaN, now, paid)).toEqual([]);
  });
});

describe('check before a call', () => {
  it('lets a member with allowance and pace left through', () => {
    expect(checkAllowance(0.01, 0)).toBe('ok');
    expect(checkAllowance(MONTHLY_ALLOWANCE_USD, PACE_USD - 0.01)).toBe('ok');
  });
  it('stops when nothing is left', () => {
    expect(checkAllowance(0, 0)).toBe('empty');
  });
  it('stops for the day at a third of the month', () => {
    expect(PACE_USD).toBeCloseTo(MONTHLY_ALLOWANCE_USD / 3);
    expect(checkAllowance(2, PACE_USD)).toBe('pace');
  });
});

describe('refills', () => {
  const r = (id: string, used: number, exp = new Date('2027-06-01T00:00:00Z')) => g(id, 'refill', REFILL_USD, used, exp);
  it('expire 12 months after purchase', () => {
    expect(refillExpiry(new Date('2026-11-16T10:00:00Z')).toISOString()).toBe('2027-11-16T10:00:00.000Z');
  });
  it('allow at most 2 held, partly used ones included', () => {
    expect(MAX_REFILLS_HELD).toBe(2);
    expect(canBuyRefill([r('a', 0)], now, true)).toBe(true);
    expect(canBuyRefill([r('a', 0), r('b', 1.2)], now, true)).toBe(false);
    expect(refillsHeld([r('a', 0), r('b', 1.2)], now)).toBe(2);
  });
  it('free a slot when one is used up or expired', () => {
    expect(canBuyRefill([r('a', REFILL_USD), r('b', 0)], now, true)).toBe(true);
    expect(canBuyRefill([r('a', 0, new Date('2026-12-01T00:00:00Z')), r('b', 0)], now, true)).toBe(true);
  });
  it('need a paid plan', () => {
    expect(canBuyRefill([], now, false)).toBe(false);
  });
});

describe('gift and trial', () => {
  it('never expire', () => {
    const later = new Date('2035-01-01T00:00:00Z');
    expect(availableUsd([g('gift', 'gift', 7.5, 1)], later, { refillsUsable: false })).toBeCloseTo(6.5);
    expect(availableUsd([g('t', 'trial', 1)], later, { refillsUsable: false })).toBeCloseTo(1);
  });
});

describe('early Lifetime and launch', () => {
  it('is Lifetime bought before 2026-11-11', () => {
    expect(isEarlyLifetime(new Date('2026-10-01T00:00:00Z'))).toBe(true);
    expect(isEarlyLifetime(new Date('2026-11-11T00:00:00Z'))).toBe(false);
    expect(isEarlyLifetime(null)).toBe(false);
  });
  it('launch offers run 90 days from the launch date setting', () => {
    expect(launchDate('2026-12-01').toISOString()).toBe('2026-12-01T00:00:00.000Z');
    expect(launchOfferEndsAt(launchDate('2026-12-01')).toISOString()).toBe('2027-03-01T00:00:00.000Z');
    expect(launchDate('nonsense').toISOString()).toBe('2026-12-01T00:00:00.000Z');
  });
});

describe('what the screens get', () => {
  it('a share for the bar and flags, no dollar amounts', () => {
    const v = allowanceView([month(2.3)], now, { ...paid, hasPaidPlan: true, resetsAt: new Date('2027-01-01T00:00:00Z') });
    expect(v.usedShare).toBeCloseTo(0.92);
    expect(v.nearLimit).toBe(true);
    expect(v.empty).toBe(false);
    expect(v.resetsAt).toBe('2027-01-01T00:00:00.000Z');
    expect(JSON.stringify(v)).not.toMatch(/2\.5|2\.3|usd/i);
  });
  it('shows empty when the month and extras are used up', () => {
    const v = allowanceView([month(MONTHLY_ALLOWANCE_USD)], now, { ...paid, hasPaidPlan: true, resetsAt: null });
    expect(v.empty).toBe(true);
    expect(v.nearLimit).toBe(false);
    expect(v.usedShare).toBe(1);
  });
});

describe('margin at full use (spec: at least 50% on plans)', () => {
  it('monthly $9.99 keeps 73% or more', () => {
    expect(marginAtFullUse(netAfterStripe(9.99), MONTHLY_ALLOWANCE_USD)).toBeGreaterThanOrEqual(0.73);
  });
  it('yearly $69 at launch keeps 50% or more', () => {
    expect(marginAtFullUse(netAfterStripe(69) / 12, MONTHLY_ALLOWANCE_USD)).toBeGreaterThanOrEqual(0.5);
  });
  it('a $4.99 refill keeps about 44% alone and about 50% with yearly', () => {
    expect(marginAtFullUse(netAfterStripe(4.99), REFILL_USD)).toBeGreaterThanOrEqual(0.43);
    expect(marginAtFullUse(netAfterStripe(69) / 12 + netAfterStripe(4.99), MONTHLY_ALLOWANCE_USD + REFILL_USD)).toBeGreaterThanOrEqual(0.49);
  });
});
