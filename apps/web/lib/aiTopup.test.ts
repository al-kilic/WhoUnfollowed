// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type Stripe from 'stripe';

const m = vi.hoisted(() => ({
  grantRefill: vi.fn().mockResolvedValue(true),
  refillsHeld: vi.fn().mockResolvedValue(1),
  sendTelegramMessage: vi.fn().mockResolvedValue({ ok: true }),
  sendEmail: vi.fn().mockResolvedValue({ ok: true }),
}));
vi.mock('@/lib/email/send', () => ({ sendEmail: m.sendEmail }));
vi.mock('server-only', () => ({}));
vi.mock('@/lib/ai/allowance', () => ({ grantRefill: m.grantRefill, refillsHeld: m.refillsHeld }));
vi.mock('@/lib/telegram', async () => {
  const actual = await vi.importActual<typeof import('@/lib/telegram')>('@/lib/telegram');
  return { ...actual, sendTelegramMessage: m.sendTelegramMessage };
});

import { handleTopupCheckout, syncRefills, topupExpiry } from './aiTopup';

const session = (over: Partial<Stripe.Checkout.Session> = {}) =>
  ({ id: 'cs_top_1', payment_status: 'paid', metadata: { type: 'topup', userId: 'u1' }, customer_details: { email: 'a@b.co' }, ...over } as unknown as Stripe.Checkout.Session);

describe('topupExpiry', () => {
  it('is twelve months after purchase', () => {
    expect(topupExpiry(new Date('2026-11-16T10:00:00Z')).toISOString()).toBe('2027-11-16T10:00:00.000Z');
  });
});

describe('handleTopupCheckout', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('grants one refill per checkout session', async () => {
    const now = new Date('2026-11-16T10:00:00Z');
    await handleTopupCheckout(session(), now);
    expect(m.grantRefill).toHaveBeenCalledWith('u1', 'refill:cs_top_1', now);
    expect(m.sendTelegramMessage).toHaveBeenCalledTimes(1);
  });

  it('emails one receipt with the amount, validity and the legal lines', async () => {
    await handleTopupCheckout(session({ amount_total: 499, currency: 'usd', metadata: { type: 'topup', userId: 'u1', locale: 'pt' } }), new Date('2026-11-16T10:00:00Z'));
    expect(m.sendEmail).toHaveBeenCalledTimes(1);
    const mail = m.sendEmail.mock.calls[0]?.[0] as { to: string; subject: string; text: string };
    expect(mail.to).toBe('a@b.co');
    expect(mail.subject).toBe('Sua Recarga chegou');
    expect(mail.text).toMatch(/4,99/);
    expect(mail.text).toContain('2027');
    expect(mail.text).toContain('7 dias');
    expect(mail.text).toContain('/pt/refund');
  });

  it('stays quiet when a retried webhook grants nothing new', async () => {
    m.grantRefill.mockResolvedValueOnce(false);
    await handleTopupCheckout(session());
    expect(m.sendTelegramMessage).not.toHaveBeenCalled();
    expect(m.sendEmail).not.toHaveBeenCalled();
  });

  it('grants nothing for an unpaid session or one without a user', async () => {
    const err = vi.spyOn(console, 'error').mockImplementation(() => {});
    await handleTopupCheckout(session({ payment_status: 'unpaid' }));
    await handleTopupCheckout(session({ metadata: { type: 'topup' } }));
    expect(m.grantRefill).not.toHaveBeenCalled();
    err.mockRestore();
  });
});

describe('handleTopupCheckout: past the cap', () => {
  beforeEach(() => { vi.clearAllMocks(); m.grantRefill.mockResolvedValue(true); });
  it('still grants a paid third refill and alerts the founder', async () => {
    m.refillsHeld.mockResolvedValueOnce(3);
    expect(await handleTopupCheckout(session(), new Date('2026-11-16T10:00:00Z'))).toBe(true);
    expect(m.grantRefill).toHaveBeenCalledTimes(1);
    expect(m.sendTelegramMessage.mock.calls.some((c) => String(c[0]).includes('holds 3 refills'))).toBe(true);
  });
});

describe('syncRefills', () => {
  beforeEach(() => { vi.clearAllMocks(); m.refillsHeld.mockResolvedValue(1); });
  const now = new Date('2026-11-25T12:00:00Z');
  const s = (id: string, over: Record<string, unknown> = {}) => session({ id, created: 1_795_000_000, ...over } as Partial<Stripe.Checkout.Session>);
  const stripeWith = (byCustomer: Stripe.Checkout.Session[], recent: Stripe.Checkout.Session[]) => ({
    checkout: { sessions: { list: vi.fn((p: { customer?: string }) => ({ autoPagingToArray: () => Promise.resolve(p.customer ? byCustomer : recent) })) } },
  }) as unknown as Stripe;

  it('grants only this member\'s paid refill checkouts, each once', async () => {
    const mine = s('cs_mine');
    const stripe = stripeWith([mine], [
      mine, // same session from both lists: counted once
      s('cs_other_user', { metadata: { type: 'topup', userId: 'u2' } }),
      s('cs_unpaid', { payment_status: 'unpaid' }),
      s('cs_plan', { metadata: { type: 'pro_ai', userId: 'u1' } }),
      s('cs_mine_2'),
    ]);
    expect(await syncRefills(stripe, 'u1', 'cus_1', now)).toBe(2);
    expect(m.grantRefill.mock.calls.map((c) => c[1]).sort()).toEqual(['refill:cs_mine', 'refill:cs_mine_2']);
    // Dated by when the refill was paid, so its 12 months start then.
    expect(m.grantRefill.mock.calls[0]![2]).toEqual(new Date(1_795_000_000_000));
  });

  it('grants nothing again when the refill is already in the account', async () => {
    m.grantRefill.mockResolvedValue(false);
    expect(await syncRefills(stripeWith([], [s('cs_mine')]), 'u1', null, now)).toBe(0);
    expect(m.sendEmail).not.toHaveBeenCalled();
  });
});
