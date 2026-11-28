import { describe, it, expect, vi } from 'vitest';
import { boughtYearlyUnlock, checkoutDiscount, isEarlyLifetime, launchDate, launchOfferEndsAt, launchOfferOpen, EARLY_LIFETIME_BEFORE } from './launchOffers';

const ENV = { PRO_AI_LAUNCH_DATE: '2026-12-01', STRIPE_COUPON_INSIDER_MONTHLY: 'co_insider', STRIPE_COUPON_YEARLY_LOYALTY: 'co_loyal', STRIPE_PRICE_UNLOCK_YEARLY: 'price_unlock_y' } as unknown as NodeJS.ProcessEnv;
const IN_WINDOW = new Date('2026-12-15T00:00:00Z');

function stripeWith(sessions: unknown[] | Error) {
  const list = vi.fn(async () => { if (sessions instanceof Error) throw sessions; return { data: sessions }; });
  return { stripe: { checkout: { sessions: { list } } } as never, list };
}
const yearlySession = { payment_status: 'paid', metadata: { type: 'unlock', unlockDuration: 'yearly' } };
const monthlySession = { payment_status: 'paid', metadata: { type: 'unlock', unlockDuration: 'monthly' } };

describe('launch window', () => {
  it('reads the launch date and runs 90 days, end exclusive', () => {
    expect(launchDate(ENV).toISOString()).toBe('2026-12-01T00:00:00.000Z');
    expect(launchOfferEndsAt(ENV).toISOString()).toBe('2027-03-01T00:00:00.000Z');
    expect(launchOfferOpen(new Date('2026-11-30T23:59:59Z'), ENV)).toBe(false);
    expect(launchOfferOpen(new Date('2026-12-01T00:00:00Z'), ENV)).toBe(true);
    expect(launchOfferOpen(new Date('2027-02-28T23:59:59Z'), ENV)).toBe(true);
    expect(launchOfferOpen(new Date('2027-03-01T00:00:00Z'), ENV)).toBe(false);
  });
  it('falls back to the default date when the setting is missing or broken', () => {
    expect(launchDate({} as NodeJS.ProcessEnv).toISOString()).toBe('2026-12-01T00:00:00.000Z');
    expect(launchDate({ PRO_AI_LAUNCH_DATE: 'soon' } as unknown as NodeJS.ProcessEnv).toISOString()).toBe('2026-12-01T00:00:00.000Z');
  });
});

describe('isEarlyLifetime', () => {
  it('is true only for Lifetime bought before Nov 11', () => {
    expect(isEarlyLifetime({ lifetimePurchasedAt: new Date('2026-10-01T00:00:00Z') })).toBe(true);
    expect(isEarlyLifetime({ lifetimePurchasedAt: EARLY_LIFETIME_BEFORE })).toBe(false);
    expect(isEarlyLifetime({ lifetimePurchasedAt: null })).toBe(false);
    expect(isEarlyLifetime(null)).toBe(false);
  });
});

describe('boughtYearlyUnlock', () => {
  it('finds a paid yearly unlock by metadata or by the yearly unlock price', async () => {
    expect(await boughtYearlyUnlock(stripeWith([monthlySession, yearlySession]).stripe, { customerId: 'cus_1', email: null }, ENV)).toBe(true);
    const byPrice = { payment_status: 'paid', metadata: {}, line_items: { data: [{ price: { id: 'price_unlock_y' } }] } };
    expect(await boughtYearlyUnlock(stripeWith([byPrice]).stripe, { customerId: 'cus_1', email: null }, ENV)).toBe(true);
  });
  it('ignores monthly unlocks and unpaid sessions', async () => {
    expect(await boughtYearlyUnlock(stripeWith([monthlySession, { ...yearlySession, payment_status: 'unpaid' }]).stripe, { customerId: 'cus_1', email: 'a@b.co' }, ENV)).toBe(false);
  });
  it('also looks up by email, and a Stripe error means not eligible', async () => {
    const s = stripeWith([]);
    await boughtYearlyUnlock(s.stripe, { customerId: null, email: 'a@b.co' }, ENV);
    expect(s.list).toHaveBeenCalledWith(expect.objectContaining({ customer_details: { email: 'a@b.co' }, status: 'complete' }));
    expect(await boughtYearlyUnlock(stripeWith(new Error('down')).stripe, { customerId: 'cus_1', email: null }, ENV)).toBe(false);
  });
});

describe('checkoutDiscount', () => {
  const early = { lifetimePurchasedAt: new Date('2026-10-01T00:00:00Z'), subscriptionExpiresAt: null, stripeCustomerId: 'cus_1' };
  const newLifetime = { ...early, lifetimePurchasedAt: new Date('2026-11-20T00:00:00Z') };
  const oldPro = { lifetimePurchasedAt: null, subscriptionExpiresAt: new Date('2027-05-01T00:00:00Z'), stripeCustomerId: 'cus_2' };

  it('gives early Lifetime 60% off monthly, at any time, never yearly', async () => {
    const { stripe } = stripeWith([]);
    expect(await checkoutDiscount(stripe, early, null, 'monthly', new Date('2028-01-01T00:00:00Z'), ENV)).toEqual({ coupon: 'co_insider', offer: 'insider60' });
    expect(await checkoutDiscount(stripe, early, null, 'yearly', IN_WINDOW, ENV)).toBeNull();
    expect(await checkoutDiscount(stripe, newLifetime, null, 'monthly', IN_WINDOW, ENV)).toBeNull();
  });
  it('gives old yearly Pro $9.99 off yearly, only inside the 90 days', async () => {
    const { stripe } = stripeWith([yearlySession]);
    expect(await checkoutDiscount(stripe, oldPro, 'a@b.co', 'yearly', IN_WINDOW, ENV)).toEqual({ coupon: 'co_loyal', offer: 'yearly_loyalty' });
    expect(await checkoutDiscount(stripe, oldPro, 'a@b.co', 'yearly', new Date('2027-03-01T00:00:00Z'), ENV)).toBeNull();
    expect(await checkoutDiscount(stripe, oldPro, 'a@b.co', 'yearly', new Date('2026-11-20T00:00:00Z'), ENV)).toBeNull();
    expect(await checkoutDiscount(stripe, oldPro, 'a@b.co', 'monthly', IN_WINDOW, ENV)).toBeNull();
  });
  it('does not give the yearly offer to old monthly-only Pro buyers or people with no unlock', async () => {
    const monthlyOnly = stripeWith([monthlySession]);
    expect(await checkoutDiscount(monthlyOnly.stripe, oldPro, 'a@b.co', 'yearly', IN_WINDOW, ENV)).toBeNull();
    const none = stripeWith([yearlySession]);
    expect(await checkoutDiscount(none.stripe, { ...oldPro, subscriptionExpiresAt: null }, 'a@b.co', 'yearly', IN_WINDOW, ENV)).toBeNull();
    expect(none.list).not.toHaveBeenCalled();
  });
  it('charges full price when the coupon is not configured, or there is no profile', async () => {
    const { stripe } = stripeWith([yearlySession]);
    const bare = { PRO_AI_LAUNCH_DATE: '2026-12-01' } as unknown as NodeJS.ProcessEnv;
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(await checkoutDiscount(stripe, early, null, 'monthly', IN_WINDOW, bare)).toBeNull();
    expect(await checkoutDiscount(stripe, oldPro, 'a@b.co', 'yearly', IN_WINDOW, bare)).toBeNull();
    expect(await checkoutDiscount(stripe, null, null, 'monthly', IN_WINDOW, ENV)).toBeNull();
    warn.mockRestore();
  });
});
