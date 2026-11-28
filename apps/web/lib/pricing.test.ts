import { describe, it, expect } from 'vitest';
import { lifetimeOfferForSold, unlockPricesAt, isLaunchPricing, perMonth, LIFETIME_TOTAL_SEATS, PRICE_INCREASE_AT, isLifetimeClosedByDate } from './pricing';

describe('launch pricing', () => {
  it('keeps launch prices through the end of Dec 31', () => {
    expect(isLaunchPricing(new Date('2026-12-31T23:59:59Z'))).toBe(true);
    expect(unlockPricesAt(new Date('2026-12-31T23:59:59Z'))).toEqual({ monthly: 1.99, yearly: 9.99 });
  });

  it('switches to standard prices on Jan 1', () => {
    expect(isLaunchPricing(PRICE_INCREASE_AT)).toBe(false);
    expect(unlockPricesAt(new Date('2027-01-01T00:00:00Z'))).toEqual({ monthly: 2.99, yearly: 14.99 });
  });

  it('rounds the per-month figure down', () => {
    expect(perMonth(9.99)).toBe('0.83');
    expect(perMonth(14.99)).toBe('1.24');
  });
});

describe('lifetimeOfferForSold', () => {
  it('sells every seat at $499, with no next step', () => {
    expect(lifetimeOfferForSold(0)).toEqual({ tierIndex: 0, price: 499, seatsInTier: 40, seatsLeftInTier: 40, pctLeft: 100, nextPrice: null });
  });

  it('counts seats sold at the old prices', () => {
    expect(lifetimeOfferForSold(2)).toMatchObject({ price: 499, seatsLeftInTier: 38, pctLeft: 95 });
    expect(lifetimeOfferForSold(39)).toMatchObject({ price: 499, seatsLeftInTier: 1, pctLeft: 3 });
  });

  it('closes by date at the end of 2026', () => {
    expect(isLifetimeClosedByDate(new Date('2026-12-31T23:59:59Z'))).toBe(false);
    expect(isLifetimeClosedByDate(new Date('2027-01-01T00:00:00Z'))).toBe(true);
  });

  it('closes after the last seat', () => {
    expect(LIFETIME_TOTAL_SEATS).toBe(40);
    expect(lifetimeOfferForSold(40)).toBeNull();
    expect(lifetimeOfferForSold(55)).toBeNull();
  });
});
