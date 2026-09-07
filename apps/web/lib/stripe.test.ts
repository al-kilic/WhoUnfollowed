// @vitest-environment node
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { extendUnlockExpiry, priceIdForUnlock, isStripeConfigured, UNLOCK_DURATION_DAYS } from './stripe';

describe('extendUnlockExpiry', () => {
  const now = new Date('2026-01-01T00:00:00.000Z');

  it('extends 30 days from now when there is no current expiry', () => {
    const result = extendUnlockExpiry(null, 'monthly', now);
    expect(result.toISOString()).toBe('2026-01-31T00:00:00.000Z');
  });

  it('extends 365 days from now for the yearly duration', () => {
    const result = extendUnlockExpiry(null, 'yearly', now);
    expect(result.toISOString()).toBe('2027-01-01T00:00:00.000Z');
  });

  it('extends from now, not from the past, when the current unlock already expired', () => {
    const expired = new Date('2025-06-01T00:00:00.000Z');
    const result = extendUnlockExpiry(expired, 'monthly', now);
    expect(result.toISOString()).toBe('2026-01-31T00:00:00.000Z');
  });

  it('stacks on top of an unexpired unlock instead of resetting the clock', () => {
    const stillValid = new Date('2026-01-15T00:00:00.000Z');
    const result = extendUnlockExpiry(stillValid, 'monthly', now);
    // 30 days after the existing expiry, not 30 days after "now"
    expect(result.toISOString()).toBe('2026-02-14T00:00:00.000Z');
  });

  it('treats an expiry equal to now as already expired (extends from now)', () => {
    const result = extendUnlockExpiry(now, 'monthly', now);
    expect(result.toISOString()).toBe('2026-01-31T00:00:00.000Z');
  });
});

describe('priceIdForUnlock', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  it('returns the monthly price id for the monthly duration', () => {
    process.env.STRIPE_PRICE_UNLOCK_MONTHLY = 'price_monthly_123';
    process.env.STRIPE_PRICE_UNLOCK_YEARLY = 'price_yearly_456';
    expect(priceIdForUnlock('monthly')).toBe('price_monthly_123');
  });

  it('returns the yearly price id for the yearly duration', () => {
    process.env.STRIPE_PRICE_UNLOCK_MONTHLY = 'price_monthly_123';
    process.env.STRIPE_PRICE_UNLOCK_YEARLY = 'price_yearly_456';
    expect(priceIdForUnlock('yearly')).toBe('price_yearly_456');
  });

  it('returns null when the corresponding env var is not configured', () => {
    delete process.env.STRIPE_PRICE_UNLOCK_MONTHLY;
    expect(priceIdForUnlock('monthly')).toBeNull();
  });
});

describe('isStripeConfigured', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  it('is true when STRIPE_SECRET_KEY is set', () => {
    process.env.STRIPE_SECRET_KEY = 'sk_test_123';
    expect(isStripeConfigured()).toBe(true);
  });

  it('is false when STRIPE_SECRET_KEY is missing', () => {
    delete process.env.STRIPE_SECRET_KEY;
    expect(isStripeConfigured()).toBe(false);
  });
});

describe('UNLOCK_DURATION_DAYS', () => {
  it('matches the advertised 30-day and 365-day unlock periods', () => {
    expect(UNLOCK_DURATION_DAYS.monthly).toBe(30);
    expect(UNLOCK_DURATION_DAYS.yearly).toBe(365);
  });
});
