import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import type Stripe from 'stripe';
import { priceIdForProAi, shouldReplace, subscriptionFields } from './proAiBilling';

const sub = (status: Stripe.Subscription.Status, interval: 'month' | 'year', end = 1_800_000_000) =>
  ({ status, items: { data: [{ current_period_end: end, price: { recurring: { interval } } }] } }) as unknown as Pick<Stripe.Subscription, 'status' | 'items'>;

describe('subscriptionFields', () => {
  it('maps live subscriptions to active with their interval and period end', () => {
    expect(subscriptionFields(sub('active', 'year'))).toEqual({ subscriptionStatus: 'active', subscriptionInterval: 'year', currentPeriodEnd: new Date(1_800_000_000_000), cancelAt: null });
    expect(subscriptionFields(sub('trialing', 'month')).subscriptionStatus).toBe('active');
  });
  it('keeps past-due as grace and ends everything else', () => {
    expect(subscriptionFields(sub('past_due', 'month')).subscriptionStatus).toBe('grace');
    expect(subscriptionFields(sub('canceled', 'month')).subscriptionStatus).toBe('cancelled');
    expect(subscriptionFields(sub('unpaid', 'month')).subscriptionStatus).toBe('cancelled');
  });
});

describe('subscriptionFields: cancel state', () => {
  const base = sub('active', 'month');
  it('stores Stripe cancel_at when set', () => {
    expect(subscriptionFields({ ...base, cancel_at: 1_790_000_000 }).cancelAt).toEqual(new Date(1_790_000_000_000));
  });
  it('uses the period end when cancelled at period end without cancel_at', () => {
    expect(subscriptionFields({ ...base, cancel_at_period_end: true, cancel_at: null }).cancelAt).toEqual(new Date(1_800_000_000_000));
  });
  it('clears it when the member resumes', () => {
    expect(subscriptionFields({ ...base, cancel_at_period_end: false, cancel_at: null }).cancelAt).toBeNull();
  });
  it('is null once the subscription has ended', () => {
    expect(subscriptionFields({ ...sub('canceled', 'month'), cancel_at: 1_790_000_000 }).cancelAt).toBeNull();
  });
});

describe('shouldReplace', () => {
  const stored = { stripeSubscriptionId: 'sub_old', subscriptionStatus: 'active', subscriptionStartedAt: new Date(1_700_000_000_000) };
  const incoming = (id: string, status: Stripe.Subscription.Status, start: number) => ({ ...sub(status, 'month'), id, start_date: start });
  it('always takes the same subscription or an empty profile', () => {
    expect(shouldReplace(stored, incoming('sub_old', 'canceled', 1))).toBe(true);
    expect(shouldReplace({ ...stored, stripeSubscriptionId: null }, incoming('sub_new', 'active', 1))).toBe(true);
  });
  it('never lets another ended subscription overwrite a live one', () => {
    expect(shouldReplace(stored, incoming('sub_other', 'canceled', 1_800_000_000))).toBe(false);
  });
  it('keeps the newer of two live subscriptions', () => {
    expect(shouldReplace(stored, incoming('sub_newer', 'active', 1_800_000_000))).toBe(true);
    expect(shouldReplace(stored, incoming('sub_older', 'active', 1_600_000_000))).toBe(false);
  });
  it('replaces a stored subscription that already ended', () => {
    expect(shouldReplace({ ...stored, subscriptionStatus: 'cancelled' }, incoming('sub_new', 'active', 1))).toBe(true);
  });
});

describe('priceIdForProAi', () => {
  const ENV = process.env;
  beforeEach(() => { process.env = { ...ENV, STRIPE_PRICE_PRO_AI_MONTHLY: 'p_m', STRIPE_PRICE_PRO_AI_YEARLY: 'p_y', STRIPE_PRICE_PRO_AI_MONTHLY_STANDARD: 'p_m_std', STRIPE_PRICE_PRO_AI_YEARLY_STANDARD: 'p_y_std' }; });
  afterEach(() => { process.env = ENV; });
  it('uses launch prices until Jan 1 2027, then standard', () => {
    expect(priceIdForProAi('yearly', new Date('2026-12-31T12:00:00Z'))).toBe('p_y');
    expect(priceIdForProAi('monthly', new Date('2027-01-01T00:00:00Z'))).toBe('p_m_std');
  });
});
