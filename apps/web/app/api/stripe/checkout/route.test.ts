// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';

const { validateRequest } = vi.hoisted(() => ({ validateRequest: vi.fn().mockResolvedValue({ user: null }) }));
vi.mock('@/lib/auth/session', () => ({ validateRequest }));

const { profilesFindFirst, seatsSold } = vi.hoisted(() => ({ profilesFindFirst: vi.fn(), seatsSold: { n: 0 } }));
vi.mock('@/lib/db/index', () => ({
  db: {
    query: { profiles: { findFirst: profilesFindFirst } },
    // Lifetime seat count: select({ n: count() }).from(profiles).where(...)
    select: () => ({ from: () => ({ where: () => Promise.resolve([{ n: seatsSold.n }]) }) }),
  },
}));

const { isPaidFeaturesEnabled } = vi.hoisted(() => ({ isPaidFeaturesEnabled: vi.fn().mockReturnValue(true) }));
vi.mock('@/lib/flags', () => ({ isPaidFeaturesEnabled }));

const { sessionsCreate, sessionsList, customersList, subscriptionsList } = vi.hoisted(() => ({
  sessionsCreate: vi.fn().mockResolvedValue({ url: 'https://checkout.stripe.com/fake' }),
  sessionsList: vi.fn().mockResolvedValue({ data: [] }),
  customersList: vi.fn().mockResolvedValue({ data: [] }),
  subscriptionsList: vi.fn().mockResolvedValue({ data: [] }),
}));
vi.mock('@/lib/stripe', async () => {
  const actual = await vi.importActual<typeof import('@/lib/stripe')>('@/lib/stripe');
  return {
    ...actual,
    isStripeConfigured: () => true,
    getStripe: () => ({ checkout: { sessions: { create: sessionsCreate, list: sessionsList } }, customers: { list: customersList }, subscriptions: { list: subscriptionsList } }),
  };
});

const { getProAiAccess } = vi.hoisted(() => ({ getProAiAccess: vi.fn().mockResolvedValue(null) }));
vi.mock('@/lib/ai/access', () => ({ getProAiAccess }));
const { canBuyRefill, hasPaidPlan } = vi.hoisted(() => ({ canBuyRefill: vi.fn(), hasPaidPlan: vi.fn() }));
vi.mock('@/lib/ai/allowance', () => ({ canBuyRefill, hasPaidPlan }));

import { POST } from './route';

// Unique IP per request so tests never share the route's per-IP rate-limit bucket.
let ipCounter = 0;
function makeRequest(body: unknown) {
  return new NextRequest('http://localhost/api/stripe/checkout', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json', origin: 'https://whounfollowed.co', 'x-forwarded-for': `10.0.0.${++ipCounter}` },
  });
}

const BASE_ENV = { ...process.env };

describe('POST /api/stripe/checkout', () => {
  beforeEach(() => {
    // Inside the launch-price window, so the price IDs below stay the ones used.
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-11-01T00:00:00Z'));
    process.env = { ...BASE_ENV, STRIPE_PRICE_UNLOCK_MONTHLY: 'price_monthly', STRIPE_PRICE_UNLOCK_YEARLY: 'price_yearly' };
    isPaidFeaturesEnabled.mockReturnValue(true);
    validateRequest.mockResolvedValue({ user: null });
    profilesFindFirst.mockResolvedValue(undefined);
    sessionsCreate.mockResolvedValue({ url: 'https://checkout.stripe.com/fake' });
  });
  afterEach(() => {
    vi.useRealTimers();
    process.env = BASE_ENV;
    vi.resetAllMocks();
  });

  it('rejects when payments are disabled', async () => {
    isPaidFeaturesEnabled.mockReturnValue(false);
    const res = await POST(makeRequest({ billing: 'monthly' }));
    expect(res.status).toBe(404);
    expect(sessionsCreate).not.toHaveBeenCalled();
  });

  it('rejects when the price for the requested duration is not configured', async () => {
    delete process.env.STRIPE_PRICE_UNLOCK_MONTHLY;
    const res = await POST(makeRequest({ billing: 'monthly' }));
    expect(res.status).toBe(500);
    expect(sessionsCreate).not.toHaveBeenCalled();
  });

  it('leaves the old one-time unlock (no longer sold) without the consent checkbox', async () => {
    await POST(makeRequest({ billing: 'monthly' }));
    const args = sessionsCreate.mock.calls[0]![0];
    expect(args.consent_collection).toBeUndefined();
    expect(args.custom_text).toBeUndefined();
  });

  it('defaults to the monthly (30-day) price when billing is omitted or unrecognized', async () => {
    await POST(makeRequest({}));
    expect(sessionsCreate).toHaveBeenCalledWith(expect.objectContaining({
      line_items: [{ price: 'price_monthly', quantity: 1 }],
    }));
  });

  it('uses the yearly price when billing is "yearly"', async () => {
    await POST(makeRequest({ billing: 'yearly' }));
    expect(sessionsCreate).toHaveBeenCalledWith(expect.objectContaining({
      line_items: [{ price: 'price_yearly', quantity: 1 }],
    }));
  });

  it('always creates a one-time payment session, never a subscription', async () => {
    await POST(makeRequest({ billing: 'monthly' }));
    expect(sessionsCreate).toHaveBeenCalledWith(expect.objectContaining({ mode: 'payment' }));
  });

  it('collects the email inline for an anonymous buyer who supplied one', async () => {
    await POST(makeRequest({ billing: 'monthly', email: 'guest@example.com' }));
    expect(sessionsCreate).toHaveBeenCalledWith(expect.objectContaining({
      customer_email: 'guest@example.com',
    }));
  });

  it('leaves email collection to Stripe when an anonymous buyer supplied none', async () => {
    await POST(makeRequest({ billing: 'monthly' }));
    const args = sessionsCreate.mock.calls[0]![0];
    expect(args.customer_email).toBeUndefined();
    expect(args.customer).toBeUndefined();
    expect(args.customer_creation).toBe('always');
  });

  it('reuses an existing Stripe customer id for a logged-in buyer who already has one', async () => {
    validateRequest.mockResolvedValue({ user: { id: 'user_1', email: 'user@example.com' } });
    profilesFindFirst.mockResolvedValue({ stripeCustomerId: 'cus_existing' });
    await POST(makeRequest({ billing: 'monthly' }));
    expect(sessionsCreate).toHaveBeenCalledWith(expect.objectContaining({ customer: 'cus_existing' }));
    const args = sessionsCreate.mock.calls[0]![0];
    // Stripe rejects customer_creation alongside an existing customer.
    expect(args.customer_creation).toBeUndefined();
    expect(args.metadata).toEqual(expect.objectContaining({ type: 'unlock', userId: 'user_1' }));
  });

  it('prefills the account email for a logged-in buyer with no Stripe customer yet', async () => {
    validateRequest.mockResolvedValue({ user: { id: 'user_2', email: 'user2@example.com' } });
    profilesFindFirst.mockResolvedValue({ stripeCustomerId: null });
    await POST(makeRequest({ billing: 'monthly' }));
    expect(sessionsCreate).toHaveBeenCalledWith(expect.objectContaining({ customer_email: 'user2@example.com', customer_creation: 'always' }));
  });

  it('tags the session metadata with the unlock duration and truncated acquisition source', async () => {
    const longSource = 'x'.repeat(200);
    await POST(makeRequest({ billing: 'yearly', acquisitionSource: longSource }));
    const args = sessionsCreate.mock.calls[0]![0];
    expect(args.metadata.unlockDuration).toBe('yearly');
    expect(args.metadata.acquisitionSource).toHaveLength(100);
  });

  describe('lifetime plan', () => {
    beforeEach(() => {
      seatsSold.n = 0;
      process.env.STRIPE_PRICE_LIFETIME_499 = 'price_lifetime_499';
    });

    afterEach(() => { vi.useRealTimers(); });

    it('sells every seat at $499, counting seats sold at the old prices', async () => {
      seatsSold.n = 2;
      await POST(makeRequest({ plan: 'lifetime' }));
      expect(sessionsCreate.mock.calls[0]![0].line_items).toEqual([{ price: 'price_lifetime_499', quantity: 1 }]);
      expect(sessionsCreate.mock.calls[0]![0].metadata.lifetimePrice).toBe('499');
    });

    it('closes Lifetime once every seat is sold', async () => {
      seatsSold.n = 40;
      const res = await POST(makeRequest({ plan: 'lifetime' }));
      expect(res.status).toBe(410);
      expect(sessionsCreate).not.toHaveBeenCalled();
    });

    it('closes Lifetime after December 31, 2026, even with seats left', async () => {
      vi.useFakeTimers({ toFake: ['Date'] });
      vi.setSystemTime(new Date('2027-01-01T00:00:01Z'));
      const res = await POST(makeRequest({ plan: 'lifetime' }));
      expect(res.status).toBe(410);
      expect(sessionsCreate).not.toHaveBeenCalled();
    });

    it('uses the lifetime price in payment mode with lifetime metadata and success URL', async () => {
      await POST(makeRequest({ plan: 'lifetime', billing: 'yearly' }));
      const args = sessionsCreate.mock.calls[0]![0];
      expect(args.line_items).toEqual([{ price: 'price_lifetime_499', quantity: 1 }]);
      expect(args.mode).toBe('payment');
      expect(args.metadata.type).toBe('lifetime');
      expect(args.metadata.unlockDuration).toBeUndefined();
      expect(args.success_url).toContain('plan=lifetime');
    });

    it('requires the Terms and immediate-start checkbox, with localized links', async () => {
      await POST(makeRequest({ plan: 'lifetime', locale: 'pt' }));
      const args = sessionsCreate.mock.calls[0]![0];
      expect(args.consent_collection).toEqual({ terms_of_service: 'required' });
      const msg: string = args.custom_text.terms_of_service_acceptance.message;
      expect(msg).toContain('Lifetime');
      expect(msg).toContain('/pt/terms)');
      expect(msg).toContain('/pt/refund)');
      expect(msg).not.toContain('\u2014');
    });

    it('returns 500 when STRIPE_PRICE_LIFETIME_499 is unset', async () => {
      delete process.env.STRIPE_PRICE_LIFETIME_499;
      const res = await POST(makeRequest({ plan: 'lifetime' }));
      expect(res.status).toBe(500);
      expect(sessionsCreate).not.toHaveBeenCalled();
    });

    it('records marketing opt-in only for a strict boolean true', async () => {
      await POST(makeRequest({ plan: 'lifetime', marketingOptIn: true }));
      expect(sessionsCreate.mock.calls[0]![0].metadata.marketingOptIn).toBe('true');
      sessionsCreate.mockClear();
      await POST(makeRequest({ plan: 'lifetime', marketingOptIn: 'true' }));
      expect(sessionsCreate.mock.calls[0]![0].metadata.marketingOptIn).toBeUndefined();
      sessionsCreate.mockClear();
      await POST(makeRequest({ plan: 'lifetime' }));
      expect(sessionsCreate.mock.calls[0]![0].metadata.marketingOptIn).toBeUndefined();
    });
  });
});

describe('POST /api/stripe/checkout (refill)', () => {
  beforeEach(() => {
    process.env = { ...BASE_ENV, STRIPE_PRICE_TOPUP_300: 'price_topup' };
    isPaidFeaturesEnabled.mockReturnValue(true);
    validateRequest.mockResolvedValue({ user: null });
    profilesFindFirst.mockResolvedValue(undefined);
    getProAiAccess.mockResolvedValue(null);
    hasPaidPlan.mockImplementation((a: { plan: string } | null) => !!a && ['monthly', 'yearly', 'lifetime'].includes(a.plan));
    canBuyRefill.mockResolvedValue(true);
    sessionsCreate.mockResolvedValue({ url: 'https://checkout.stripe.com/fake' });
  });
  afterEach(() => {
    process.env = BASE_ENV;
    vi.resetAllMocks();
  });

  it('needs an account', async () => {
    const res = await POST(makeRequest({ plan: 'topup', locale: 'en' }));
    expect(res.status).toBe(401);
    expect(sessionsCreate).not.toHaveBeenCalled();
  });

  it('is only for Pro AI users', async () => {
    validateRequest.mockResolvedValue({ user: { id: 'u1', email: 'a@b.co' } });
    const res = await POST(makeRequest({ plan: 'topup', locale: 'en' }));
    expect(res.status).toBe(403);
    expect(sessionsCreate).not.toHaveBeenCalled();
  });

  it('is not offered to a gift-only account without a paid plan', async () => {
    validateRequest.mockResolvedValue({ user: { id: 'u1', email: 'a@b.co' } });
    getProAiAccess.mockResolvedValue({ plan: 'earlyLifetime', periodEnd: null });
    const res = await POST(makeRequest({ plan: 'topup', locale: 'en' }));
    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({ error: 'not_pro_ai' });
    expect(sessionsCreate).not.toHaveBeenCalled();
  });

  it('refuses a third refill while 2 are held', async () => {
    validateRequest.mockResolvedValue({ user: { id: 'u1', email: 'a@b.co' } });
    getProAiAccess.mockResolvedValue({ plan: 'monthly', periodEnd: null });
    canBuyRefill.mockResolvedValue(false);
    const res = await POST(makeRequest({ plan: 'topup', locale: 'en' }));
    expect(res.status).toBe(409);
    expect(await res.json()).toEqual({ error: 'refill_limit' });
    expect(canBuyRefill).toHaveBeenCalledWith('u1', { plan: 'monthly', periodEnd: null });
    expect(sessionsCreate).not.toHaveBeenCalled();
  });

  it('creates a one-time payment tied to the user and returns to Studio > You', async () => {
    validateRequest.mockResolvedValue({ user: { id: 'u1', email: 'a@b.co' } });
    getProAiAccess.mockResolvedValue({ plan: 'monthly', periodEnd: null });
    profilesFindFirst.mockResolvedValue({ stripeCustomerId: 'cus_1' });
    const res = await POST(makeRequest({ plan: 'topup', locale: 'es' }));
    expect(res.status).toBe(200);
    const params = sessionsCreate.mock.calls[0]![0] as { mode: string; customer: string; metadata: Record<string, string>; success_url: string; line_items: { price: string }[] };
    expect(params.mode).toBe('payment');
    expect(params.customer).toBe('cus_1');
    expect(params.line_items[0]!.price).toBe('price_topup');
    expect(params.metadata).toEqual({ type: 'topup', userId: 'u1', locale: 'es' });
    expect(params.success_url).toContain('/es/app/you?topup=1');
    const consent = sessionsCreate.mock.calls[0]![0] as { consent_collection: unknown; custom_text: { terms_of_service_acceptance: { message: string } } };
    expect(consent.consent_collection).toEqual({ terms_of_service: 'required' });
    expect(consent.custom_text.terms_of_service_acceptance.message).toContain('recarga');
    expect(consent.custom_text.terms_of_service_acceptance.message).toContain('/es/refund)');
  });

  it('fails clearly when the top-up price is not set', async () => {
    process.env = { ...BASE_ENV };
    delete process.env.STRIPE_PRICE_TOPUP_300;
    validateRequest.mockResolvedValue({ user: { id: 'u1', email: 'a@b.co' } });
    const res = await POST(makeRequest({ plan: 'topup', locale: 'en' }));
    expect(res.status).toBe(500);
  });
});

describe('POST /api/stripe/checkout (Pro AI subscription)', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-11-24T00:00:00Z'));
    process.env = { ...BASE_ENV, STRIPE_PRICE_PRO_AI_MONTHLY: 'price_pro_ai_m' };
    isPaidFeaturesEnabled.mockReturnValue(true);
    validateRequest.mockResolvedValue({ user: null });
    profilesFindFirst.mockResolvedValue(undefined);
    sessionsCreate.mockResolvedValue({ url: 'https://checkout.stripe.com/fake' });
  });
  afterEach(() => {
    vi.useRealTimers();
    process.env = BASE_ENV;
    vi.resetAllMocks();
  });

  it('requires the Terms and immediate-start checkbox before paying', async () => {
    const res = await POST(makeRequest({ plan: 'pro_ai', billing: 'monthly', locale: 'en' }));
    expect(res.status).toBe(200);
    const args = sessionsCreate.mock.calls[0]![0];
    expect(args.mode).toBe('subscription');
    expect(args.consent_collection).toEqual({ terms_of_service: 'required' });
    const msg: string = args.custom_text.terms_of_service_acceptance.message;
    expect(msg).toContain('Pro AI to start right away');
    expect(msg).toContain('renews automatically');
    expect(msg).toContain('14 days in the EU and UK');
    expect(msg).toMatch(/\]\(https?:\/\/[^)]+\/terms\)/);
    expect(msg).toMatch(/\]\(https?:\/\/[^)]+\/refund\)/);
  });

  describe('one subscription per member', () => {
    it('refuses a second subscription for a signed-in subscriber', async () => {
      validateRequest.mockResolvedValue({ user: { id: 'u1', email: 'a@b.co' } });
      profilesFindFirst.mockResolvedValue({ stripeCustomerId: 'cus_1', stripeSubscriptionId: 'sub_1', subscriptionStatus: 'active' });
      const res = await POST(makeRequest({ plan: 'pro_ai', billing: 'monthly', locale: 'en' }));
      expect(res.status).toBe(409);
      expect(await res.json()).toEqual({ error: 'already_subscribed' });
      expect(sessionsCreate).not.toHaveBeenCalled();
    });

    it('lets a member whose subscription ended subscribe again', async () => {
      validateRequest.mockResolvedValue({ user: { id: 'u1', email: 'a@b.co' } });
      profilesFindFirst.mockResolvedValue({ stripeCustomerId: 'cus_1', stripeSubscriptionId: 'sub_1', subscriptionStatus: 'cancelled' });
      const res = await POST(makeRequest({ plan: 'pro_ai', billing: 'monthly', locale: 'en' }));
      expect(res.status).toBe(200);
      expect(sessionsCreate.mock.calls[0]![0].customer).toBe('cus_1');
    });

    it('refuses a buy-first checkout for an email that already has a live plan', async () => {
      customersList.mockResolvedValue({ data: [{ id: 'cus_9' }] });
      subscriptionsList.mockResolvedValue({ data: [{ status: 'active' }] });
      const res = await POST(makeRequest({ plan: 'pro_ai', billing: 'monthly', locale: 'en', email: 'a@b.co' }));
      expect(res.status).toBe(409);
      expect(sessionsCreate).not.toHaveBeenCalled();
    });

    it('reuses the existing Stripe customer for a buy-first email without a live plan', async () => {
      customersList.mockResolvedValue({ data: [{ id: 'cus_9' }] });
      subscriptionsList.mockResolvedValue({ data: [{ status: 'canceled' }] });
      const res = await POST(makeRequest({ plan: 'pro_ai', billing: 'monthly', locale: 'en', email: 'a@b.co' }));
      expect(res.status).toBe(200);
      const args = sessionsCreate.mock.calls[0]![0];
      expect(args.customer).toBe('cus_9');
      expect(args.customer_email).toBeUndefined();
    });
  });

  describe('launch offers', () => {
    const offerEnv = { STRIPE_PRICE_PRO_AI_MONTHLY: 'price_pro_ai_m', STRIPE_PRICE_PRO_AI_YEARLY: 'price_pro_ai_y', PRO_AI_LAUNCH_DATE: '2026-11-20', STRIPE_COUPON_INSIDER_MONTHLY: 'co_insider', STRIPE_COUPON_YEARLY_LOYALTY: 'co_loyal' };
    beforeEach(() => {
      process.env = { ...BASE_ENV, ...offerEnv };
      validateRequest.mockResolvedValue({ user: { id: 'u1', email: 'a@b.co' } });
      sessionsList.mockResolvedValue({ data: [] });
    });

    it('applies 60% off monthly for an early Lifetime member and drops the promo-code box', async () => {
      profilesFindFirst.mockResolvedValue({ stripeCustomerId: 'cus_1', lifetimePurchasedAt: new Date('2026-10-01T00:00:00Z'), subscriptionExpiresAt: null });
      await POST(makeRequest({ plan: 'pro_ai', billing: 'monthly', locale: 'en' }));
      const args = sessionsCreate.mock.calls[0]![0];
      expect(args.discounts).toEqual([{ coupon: 'co_insider' }]);
      expect(args.allow_promotion_codes).toBeUndefined();
      expect(args.metadata.offer).toBe('insider60');
      expect(args.subscription_data.metadata.offer).toBe('insider60');
    });

    it('applies $9.99 off yearly for an old yearly Pro buyer inside the launch window', async () => {
      profilesFindFirst.mockResolvedValue({ stripeCustomerId: 'cus_2', lifetimePurchasedAt: null, subscriptionExpiresAt: new Date('2027-05-01T00:00:00Z') });
      sessionsList.mockResolvedValue({ data: [{ payment_status: 'paid', metadata: { type: 'unlock', unlockDuration: 'yearly' } }] });
      await POST(makeRequest({ plan: 'pro_ai', billing: 'yearly', locale: 'en' }));
      const args = sessionsCreate.mock.calls[0]![0];
      expect(args.discounts).toEqual([{ coupon: 'co_loyal' }]);
      expect(args.allow_promotion_codes).toBeUndefined();
    });

    it('gives no discount and no promo-code box to everyone else', async () => {
      profilesFindFirst.mockResolvedValue({ stripeCustomerId: 'cus_3', lifetimePurchasedAt: null, subscriptionExpiresAt: null });
      await POST(makeRequest({ plan: 'pro_ai', billing: 'monthly', locale: 'en' }));
      const args = sessionsCreate.mock.calls[0]![0];
      expect(args.discounts).toBeUndefined();
      expect(args.allow_promotion_codes).toBeUndefined();
    });

    it('gives signed-out buyers no automatic discount', async () => {
      validateRequest.mockResolvedValue({ user: null });
      await POST(makeRequest({ plan: 'pro_ai', billing: 'monthly', locale: 'en' }));
      expect(sessionsCreate.mock.calls[0]![0].discounts).toBeUndefined();
      expect(sessionsList).not.toHaveBeenCalled();
    });
  });
});
