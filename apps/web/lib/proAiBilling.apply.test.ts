import { describe, expect, it, vi, beforeEach } from 'vitest';
import type Stripe from 'stripe';

const { findFirst, updateSet, sendTelegramMessage } = vi.hoisted(() => ({
  findFirst: vi.fn(),
  updateSet: vi.fn(),
  sendTelegramMessage: vi.fn().mockResolvedValue({ ok: true }),
}));
vi.mock('server-only', () => ({}));
vi.mock('@/lib/db/index', () => ({
  db: {
    query: { profiles: { findFirst } },
    // update(profiles).set(...).where(...)[.returning()]: the first update (by
    // subscription id) finds nothing, so the owner lookup runs.
    update: () => ({ set: (v: unknown) => { updateSet(v); return { where: () => Object.assign(Promise.resolve(), { returning: () => Promise.resolve([]) }) }; } }),
  },
}));
vi.mock('@/lib/telegram', () => ({ sendTelegramMessage, escapeTelegramHtml: (s: string) => s }));

import { applySubscription, isProAiSubscription } from './proAiBilling';

process.env.STRIPE_PRICE_PRO_AI_MONTHLY = 'price_ai_m';

const live = (id: string, start: number) => ({
  id, status: 'active', customer: 'cus_1', start_date: start, metadata: {},
  items: { data: [{ current_period_end: 1_800_000_000, price: { id: 'price_ai_m', recurring: { interval: 'month' } } }] },
}) as unknown as Stripe.Subscription;

describe('applySubscription: a second live subscription', () => {
  beforeEach(() => { vi.clearAllMocks(); });
  it('alerts and keeps the stored one when the other is older', async () => {
    findFirst.mockResolvedValueOnce({ userId: 'u1', stripeSubscriptionId: 'sub_kept', subscriptionStatus: 'active', subscriptionStartedAt: new Date(1_750_000_000_000) });
    expect(await applySubscription(live('sub_dup', 1_700_000_000))).toBe(true);
    expect(sendTelegramMessage).toHaveBeenCalledTimes(1);
    // Only the by-subscription-id update ran; the profile was not overwritten.
    expect(updateSet).toHaveBeenCalledTimes(1);
  });
  it('alerts and switches to the newer live one', async () => {
    findFirst.mockResolvedValueOnce({ userId: 'u1', stripeSubscriptionId: 'sub_old', subscriptionStatus: 'active', subscriptionStartedAt: new Date(1_700_000_000_000) });
    expect(await applySubscription(live('sub_new', 1_750_000_000))).toBe(true);
    expect(sendTelegramMessage).toHaveBeenCalledTimes(1);
    expect(updateSet).toHaveBeenCalledTimes(2);
    expect(updateSet.mock.calls[1]![0]).toMatchObject({ stripeSubscriptionId: 'sub_new' });
  });
});

describe('applySubscription: only Pro AI prices', () => {
  beforeEach(() => { vi.clearAllMocks(); });
  it('ignores a subscription on any other price (shared Stripe account)', async () => {
    const other = { ...live('sub_x', 1_750_000_000), items: { data: [{ current_period_end: 1_800_000_000, price: { id: 'price_photo_site', recurring: { interval: 'month' } } }] } } as unknown as Stripe.Subscription;
    expect(isProAiSubscription(other)).toBe(false);
    expect(await applySubscription(other)).toBe(false);
    expect(updateSet).not.toHaveBeenCalled();
  });
  it('accepts only when every item is a Pro AI price', () => {
    expect(isProAiSubscription(live('sub_ok', 1))).toBe(true);
    expect(isProAiSubscription({ items: { data: [] } } as unknown as Stripe.Subscription)).toBe(false);
  });
});
