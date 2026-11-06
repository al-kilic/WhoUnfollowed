import { describe, it, expect } from 'vitest';
import { lifetimeOfferForSold, unlockPricesAt, isLaunchPricing, perMonth, LIFETIME_TOTAL_SEATS, PRICE_INCREASE_AT } from './pricing';

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
  it('opens at $19.99 with all 5 seats', () => {
    expect(lifetimeOfferForSold(0)).toEqual({ tierIndex: 0, price: 19.99, seatsInTier: 5, seatsLeftInTier: 5, pctLeft: 100, nextPrice: 39 });
  });

  it('shows the share of the current step left', () => {
    expect(lifetimeOfferForSold(1)).toMatchObject({ price: 19.99, seatsLeftInTier: 4, pctLeft: 80 });
    expect(lifetimeOfferForSold(4)).toMatchObject({ price: 19.99, seatsLeftInTier: 1, pctLeft: 20 });
  });

  it('moves to $39 for 10 seats, then $99 for 25', () => {
    expect(lifetimeOfferForSold(5)).toMatchObject({ price: 39, seatsLeftInTier: 10, pctLeft: 100, nextPrice: 99 });
    expect(lifetimeOfferForSold(14)).toMatchObject({ price: 39, seatsLeftInTier: 1 });
    expect(lifetimeOfferForSold(15)).toMatchObject({ price: 99, seatsLeftInTier: 25, nextPrice: null });
    expect(lifetimeOfferForSold(39)).toMatchObject({ price: 99, seatsLeftInTier: 1, pctLeft: 4 });
  });

  it('closes after the last seat', () => {
    expect(LIFETIME_TOTAL_SEATS).toBe(40);
    expect(lifetimeOfferForSold(40)).toBeNull();
    expect(lifetimeOfferForSold(55)).toBeNull();
  });
});
