// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';

const { validateRequest } = vi.hoisted(() => ({ validateRequest: vi.fn().mockResolvedValue({ user: null }) }));
vi.mock('@/lib/auth/session', () => ({ validateRequest }));

const { profilesFindFirst } = vi.hoisted(() => ({ profilesFindFirst: vi.fn() }));
vi.mock('@/lib/db/index', () => ({ db: { query: { profiles: { findFirst: profilesFindFirst } } } }));

const { isPaidFeaturesEnabled } = vi.hoisted(() => ({ isPaidFeaturesEnabled: vi.fn().mockReturnValue(true) }));
vi.mock('@/lib/flags', () => ({ isPaidFeaturesEnabled }));

const { sessionsCreate } = vi.hoisted(() => ({ sessionsCreate: vi.fn().mockResolvedValue({ url: 'https://checkout.stripe.com/fake' }) }));
vi.mock('@/lib/stripe', async () => {
  const actual = await vi.importActual<typeof import('@/lib/stripe')>('@/lib/stripe');
  return {
    ...actual,
    isStripeConfigured: () => true,
    getStripe: () => ({ checkout: { sessions: { create: sessionsCreate } } }),
  };
});

import { POST } from './route';

function makeRequest(body: unknown) {
  return new NextRequest('http://localhost/api/stripe/checkout', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json', origin: 'https://whounfollowed.co' },
  });
}

const BASE_ENV = { ...process.env };

describe('POST /api/stripe/checkout', () => {
  beforeEach(() => {
    process.env = { ...BASE_ENV, STRIPE_PRICE_UNLOCK_MONTHLY: 'price_monthly', STRIPE_PRICE_UNLOCK_YEARLY: 'price_yearly' };
    isPaidFeaturesEnabled.mockReturnValue(true);
    validateRequest.mockResolvedValue({ user: null });
    profilesFindFirst.mockResolvedValue(undefined);
    sessionsCreate.mockResolvedValue({ url: 'https://checkout.stripe.com/fake' });
  });
  afterEach(() => {
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
  });

  it('reuses an existing Stripe customer id for a logged-in buyer who already has one', async () => {
    validateRequest.mockResolvedValue({ user: { id: 'user_1', email: 'user@example.com' } });
    profilesFindFirst.mockResolvedValue({ stripeCustomerId: 'cus_existing' });
    await POST(makeRequest({ billing: 'monthly' }));
    expect(sessionsCreate).toHaveBeenCalledWith(expect.objectContaining({ customer: 'cus_existing' }));
    const args = sessionsCreate.mock.calls[0]![0];
    expect(args.metadata).toEqual(expect.objectContaining({ type: 'unlock', userId: 'user_1' }));
  });

  it('prefills the account email for a logged-in buyer with no Stripe customer yet', async () => {
    validateRequest.mockResolvedValue({ user: { id: 'user_2', email: 'user2@example.com' } });
    profilesFindFirst.mockResolvedValue({ stripeCustomerId: null });
    await POST(makeRequest({ billing: 'monthly' }));
    expect(sessionsCreate).toHaveBeenCalledWith(expect.objectContaining({ customer_email: 'user2@example.com' }));
  });

  it('tags the session metadata with the unlock duration and truncated acquisition source', async () => {
    const longSource = 'x'.repeat(200);
    await POST(makeRequest({ billing: 'yearly', acquisitionSource: longSource }));
    const args = sessionsCreate.mock.calls[0]![0];
    expect(args.metadata.unlockDuration).toBe('yearly');
    expect(args.metadata.acquisitionSource).toHaveLength(100);
  });
});
