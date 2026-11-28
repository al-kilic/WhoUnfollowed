// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type Stripe from 'stripe';

const m = vi.hoisted(() => {
  const profileUpsert = vi.fn().mockResolvedValue(undefined);
  const userReturning = vi.fn().mockResolvedValue([{ id: 'new_user' }]);
  const insertValues = vi.fn((values: Record<string, unknown>) => {
    // users insert -> .returning(); profiles insert -> .onConflictDoUpdate()
    if ('passwordHash' in values) return { returning: userReturning };
    return { onConflictDoUpdate: profileUpsert };
  });
  return {
    usersFindFirst: vi.fn(),
    insertValues,
    insert: vi.fn(() => ({ values: insertValues })),
    profileUpsert,
    userReturning,
    retrieve: vi.fn().mockResolvedValue({ id: 'sub_1', status: 'active', start_date: 1796000000, items: { data: [{ current_period_end: 1827536000, price: { unit_amount: 6900, currency: 'usd', recurring: { interval: 'year' } } }] } }),
    applySubscription: vi.fn().mockResolvedValue(true),
    sendTelegramMessage: vi.fn().mockResolvedValue({ ok: true }),
    trackServerEvent: vi.fn().mockResolvedValue(undefined),
    sendEmail: vi.fn().mockResolvedValue({ ok: true }),
  };
});

vi.mock('server-only', () => ({}));
vi.mock('@/lib/db/index', () => ({ db: { query: { users: { findFirst: m.usersFindFirst } }, insert: m.insert } }));
vi.mock('@/lib/stripe', () => ({ getStripe: () => ({ subscriptions: { retrieve: m.retrieve } }) }));
vi.mock('@/lib/proAiBilling', async (orig) => ({ ...(await orig<typeof import('@/lib/proAiBilling')>()), applySubscription: m.applySubscription }));
vi.mock('@/lib/telegram', async () => {
  const actual = await vi.importActual<typeof import('@/lib/telegram')>('@/lib/telegram');
  return { ...actual, sendTelegramMessage: m.sendTelegramMessage };
});
vi.mock('@/lib/umamiServer', () => ({ trackServerEvent: m.trackServerEvent }));
vi.mock('@/lib/email/send', () => ({ sendEmail: m.sendEmail }));

import { handleProAiCheckout, handleSubscriptionEvent, subscriptionChange } from './proAi';

const session = (over: Partial<Stripe.Checkout.Session>): Stripe.Checkout.Session => ({
  id: 'cs_1', subscription: 'sub_1', customer: 'cus_1', customer_email: 'Buyer@Example.com',
  amount_total: 6900, currency: 'usd', metadata: { type: 'pro_ai', interval: 'yearly', locale: 'es' },
  ...over,
} as unknown as Stripe.Checkout.Session);

describe('handleProAiCheckout', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('does nothing without a subscription id', async () => {
    await handleProAiCheckout(session({ subscription: null }));
    expect(m.insert).not.toHaveBeenCalled();
    expect(m.applySubscription).not.toHaveBeenCalled();
  });

  it('activates the signed-in buyer from metadata and copies the subscription state', async () => {
    await handleProAiCheckout(session({ metadata: { type: 'pro_ai', interval: 'yearly', locale: 'es', userId: 'u_signed_in' } }));
    expect(m.usersFindFirst).not.toHaveBeenCalled();
    expect(m.insertValues).toHaveBeenCalledWith(expect.objectContaining({
      userId: 'u_signed_in', subscriptionStatus: 'active', stripeCustomerId: 'cus_1', stripeSubscriptionId: 'sub_1', locale: 'es',
    }));
    expect(m.profileUpsert).toHaveBeenCalledTimes(1);
    expect(m.retrieve).toHaveBeenCalledWith('sub_1');
    expect(m.applySubscription).toHaveBeenCalledWith(expect.objectContaining({ id: 'sub_1' }));
    expect(m.sendTelegramMessage.mock.calls[0]?.[0]).toContain('Plan: Pro AI Yearly');
    expect(m.trackServerEvent).toHaveBeenCalledWith(expect.any(String), '/welcome', expect.objectContaining({ plan: 'pro_ai_yearly' }));
    // Confirmation email in the buyer's language, with the yearly allowance.
    const mail = m.sendEmail.mock.calls[0]?.[0] as { to: string; subject: string; text: string };
    expect(mail.to).toBe('buyer@example.com');
    expect(mail.subject).toBe('Tu Pro AI está activo');
    expect(mail.text).toContain('uso mensual generoso');
    // Legal content: price charged, renewal, cancel, start-now, cancel rights, links.
    expect(mail.text).toContain('Pro AI anual');
    expect(mail.text).toMatch(/69/);
    expect(mail.text).toContain('hasta que lo canceles');
    expect(mail.text).toContain('empezar de inmediato');
    expect(mail.text).toContain('14 días');
    expect(mail.text).toContain('/es/terms');
    expect(mail.text).toContain('/es/refund');
    expect(mail.text).toContain('/es/app/today');
  });

  it('does not email when the session has no email', async () => {
    await handleProAiCheckout(session({ customer_email: null, customer_details: null, metadata: { type: 'pro_ai', userId: 'u1' } }));
    expect(m.sendEmail).not.toHaveBeenCalled();
  });

  it('attaches to an existing account with the same email, lower-cased', async () => {
    m.usersFindFirst.mockResolvedValueOnce({ id: 'u_existing' });
    await handleProAiCheckout(session({}));
    expect(m.userReturning).not.toHaveBeenCalled();
    expect(m.insertValues).toHaveBeenCalledWith(expect.objectContaining({ userId: 'u_existing' }));
    expect(m.sendTelegramMessage.mock.calls[0]?.[0]).toContain('buyer@example.com');
  });

  it('creates an account for a buy-first customer, to be claimed on /welcome', async () => {
    m.usersFindFirst.mockResolvedValueOnce(undefined);
    await handleProAiCheckout(session({ metadata: { type: 'pro_ai', interval: 'monthly' } }));
    expect(m.insertValues).toHaveBeenCalledWith(expect.objectContaining({ email: 'buyer@example.com', passwordHash: '' }));
    expect(m.insertValues).toHaveBeenCalledWith(expect.objectContaining({ userId: 'new_user', locale: 'en' }));
    expect(m.sendTelegramMessage.mock.calls[0]?.[0]).toContain('new account');
  });

  it('gives up without an account or an email', async () => {
    await handleProAiCheckout(session({ customer_email: null, customer_details: null, metadata: {} }));
    expect(m.insert).not.toHaveBeenCalled();
  });
});

describe('handleSubscriptionEvent', () => {
  beforeEach(() => { vi.clearAllMocks(); });
  const sub = { id: 'sub_9' } as Stripe.Subscription;

  it('re-copies state on updates without a message', async () => {
    await handleSubscriptionEvent(sub, 'customer.subscription.updated');
    expect(m.applySubscription).toHaveBeenCalledWith(sub);
    expect(m.sendTelegramMessage).not.toHaveBeenCalled();
  });

  it('reports a cancellation once the profile is found', async () => {
    await handleSubscriptionEvent(sub, 'customer.subscription.deleted');
    expect(m.sendTelegramMessage.mock.calls[0]?.[0]).toContain('sub_9');
  });

  it('does not report a cancellation for an unknown subscription', async () => {
    m.applySubscription.mockResolvedValueOnce(false);
    const err = vi.spyOn(console, 'error').mockImplementation(() => {});
    await handleSubscriptionEvent(sub, 'customer.subscription.deleted');
    expect(m.sendTelegramMessage).not.toHaveBeenCalled();
    expect(err).toHaveBeenCalled();
    err.mockRestore();
  });
});

describe('subscriptionChange', () => {
  const sub = (o: Record<string, unknown>) => ({ status: 'active', cancel_at_period_end: false, cancel_at: null, ...o }) as unknown as Stripe.Subscription;
  it('spots a scheduled and an undone cancellation', () => {
    expect(subscriptionChange(sub({ cancel_at_period_end: true }), { cancel_at_period_end: false })).toBe('cancel_scheduled');
    expect(subscriptionChange(sub({ cancel_at: 1830000000 }), { cancel_at: null })).toBe('cancel_scheduled');
    expect(subscriptionChange(sub({}), { cancel_at_period_end: true })).toBe('cancel_undone');
  });
  it('spots a failed and a recovered payment', () => {
    expect(subscriptionChange(sub({ status: 'past_due' }), { status: 'active' })).toBe('payment_failed');
    expect(subscriptionChange(sub({ status: 'active' }), { status: 'past_due' })).toBe('payment_recovered');
  });
  it('ignores renewals and changes it does not report', () => {
    expect(subscriptionChange(sub({}), null)).toBeNull();
    expect(subscriptionChange(sub({}), { items: {} } as never)).toBeNull();
    expect(subscriptionChange(sub({ status: 'past_due' }), { status: 'unpaid' })).toBeNull();
  });
});
