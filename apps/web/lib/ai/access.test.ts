import { describe, expect, it } from 'vitest';
import { isSubscriberPlan, LIFETIME_AI_FROM, planFor } from './access';

const now = new Date('2026-11-15T00:00:00Z');
const later = new Date('2026-12-15T00:00:00Z');
const earlier = new Date('2026-11-01T00:00:00Z');
const base = { subscriptionStatus: 'active' as const, stripeSubscriptionId: null, subscriptionInterval: null, currentPeriodEnd: null, subscriptionExpiresAt: null, lifetimePurchasedAt: null };

describe('planFor', () => {
  it('gives nothing to a free account', () => {
    expect(planFor({ ...base, subscriptionStatus: 'none' }, now)).toBeNull();
    expect(planFor(base, now)).toBeNull();
  });
  it('gives Lifetime bought before launch day (early or $499) no AI access', () => {
    expect(planFor({ ...base, lifetimePurchasedAt: new Date('2026-11-11T00:00:00Z') }, now)).toBeNull();
    expect(planFor({ ...base, lifetimePurchasedAt: new Date('2026-11-10T23:59:59Z') }, now)).toBeNull();
    expect(planFor({ ...base, lifetimePurchasedAt: new Date('2026-11-27T23:59:59Z') }, new Date('2026-12-05T00:00:00Z'))).toBeNull();
  });
  it('gives a $499 Lifetime bought from launch day the lifetime plan', () => {
    const at = new Date('2026-12-05T00:00:00Z');
    expect(LIFETIME_AI_FROM.toISOString()).toBe('2026-11-28T00:00:00.000Z');
    expect(planFor({ ...base, lifetimePurchasedAt: LIFETIME_AI_FROM }, at)).toEqual({ plan: 'lifetime', periodEnd: null });
    expect(isSubscriberPlan(planFor({ ...base, lifetimePurchasedAt: new Date('2026-12-01T00:00:00Z') }, at))).toBe(true);
  });
  it('gives a refunded or closed Lifetime nothing', () => {
    const at = new Date('2026-12-05T00:00:00Z');
    expect(planFor({ ...base, subscriptionStatus: 'cancelled', lifetimePurchasedAt: new Date('2026-12-01T00:00:00Z') }, at)).toBeNull();
    expect(planFor({ ...base, subscriptionStatus: 'none', lifetimePurchasedAt: new Date('2026-12-01T00:00:00Z') }, at)).toBeNull();
  });
  it('lets an early Lifetime member who subscribes count as a subscriber', () => {
    expect(planFor({ ...base, lifetimePurchasedAt: new Date('2026-10-01T00:00:00Z'), stripeSubscriptionId: 'sub_1', subscriptionInterval: 'month', currentPeriodEnd: later }, now)?.plan).toBe('monthly');
  });
  it('reads monthly and yearly subscriptions while the period runs', () => {
    expect(planFor({ ...base, stripeSubscriptionId: 'sub_1', subscriptionInterval: 'month', currentPeriodEnd: later }, now)?.plan).toBe('monthly');
    expect(planFor({ ...base, stripeSubscriptionId: 'sub_1', subscriptionInterval: 'year', currentPeriodEnd: later }, now)?.plan).toBe('yearly');
    expect(planFor({ ...base, stripeSubscriptionId: 'sub_1', subscriptionInterval: 'month', currentPeriodEnd: earlier }, now)).toBeNull();
  });
  it('treats a cancelled subscription as no access', () => {
    expect(planFor({ ...base, subscriptionStatus: 'cancelled', stripeSubscriptionId: 'sub_1', subscriptionInterval: 'month', currentPeriodEnd: later }, now)).toBeNull();
  });
  it('gives a running one-time unlock (old Pro) no AI access', () => {
    expect(planFor({ ...base, subscriptionExpiresAt: later }, now)).toBeNull();
  });
  it('needs a subscription id, an active status and a period that has not ended', () => {
    expect(planFor({ ...base, subscriptionInterval: 'month', currentPeriodEnd: later }, now)).toBeNull();
    expect(planFor({ ...base, subscriptionStatus: 'grace', stripeSubscriptionId: 'sub_1', subscriptionInterval: 'month', currentPeriodEnd: later }, now)).toBeNull();
    expect(planFor({ ...base, stripeSubscriptionId: 'sub_1', subscriptionInterval: 'month', currentPeriodEnd: null }, now)).toBeNull();
  });
});
