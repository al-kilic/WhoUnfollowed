// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';

const { profilesFindFirst, usersFindFirst, updateWhere, updateSet, update, insertReturning, insert } = vi.hoisted(() => {
  const updateWhere = vi.fn().mockResolvedValue(undefined);
  const updateSet = vi.fn((_values: { subscriptionExpiresAt?: Date | null; [key: string]: unknown }) => ({ where: updateWhere }));
  const update = vi.fn(() => ({ set: updateSet }));
  const insertReturning = vi.fn().mockResolvedValue([{ id: 'new_user_id' }]);
  const insert = vi.fn(() => ({
    values: vi.fn(() => {
      const p: Promise<undefined> & { returning?: typeof insertReturning } = Promise.resolve(undefined);
      p.returning = insertReturning;
      return p;
    }),
  }));
  return {
    profilesFindFirst: vi.fn(),
    usersFindFirst: vi.fn(),
    updateWhere, updateSet, update, insertReturning, insert,
  };
});

vi.mock('@/lib/db/index', () => ({
  db: {
    query: { profiles: { findFirst: profilesFindFirst }, users: { findFirst: usersFindFirst } },
    update,
    insert,
  },
}));

const { constructEvent, sendTelegramMessage, trackServerEvent } = vi.hoisted(() => ({
  constructEvent: vi.fn(),
  sendTelegramMessage: vi.fn().mockResolvedValue({ ok: true }),
  trackServerEvent: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/lib/stripe', async () => {
  const actual = await vi.importActual<typeof import('@/lib/stripe')>('@/lib/stripe');
  return {
    ...actual,
    isStripeConfigured: () => true,
    getStripe: () => ({ webhooks: { constructEvent } }),
  };
});
vi.mock('@/lib/telegram', async () => {
  const actual = await vi.importActual<typeof import('@/lib/telegram')>('@/lib/telegram');
  return { ...actual, sendTelegramMessage };
});
vi.mock('@/lib/umamiServer', () => ({ trackServerEvent }));

import { POST } from './route';

function makeRequest(body: string, signature: string | null = 'sig_valid') {
  const headers = new Headers({ 'content-type': 'application/json' });
  if (signature) headers.set('stripe-signature', signature);
  return new NextRequest('http://localhost/api/webhooks/stripe', { method: 'POST', body, headers });
}

const BASE_ENV = { ...process.env };

describe('POST /api/webhooks/stripe', () => {
  beforeEach(() => {
    process.env = { ...BASE_ENV, STRIPE_WEBHOOK_SECRET: 'whsec_test', NEXT_PUBLIC_PAYMENTS_ENABLED: 'true' };
  });
  afterEach(() => {
    process.env = BASE_ENV;
    vi.clearAllMocks();
  });

  it('no-ops when STRIPE_WEBHOOK_SECRET is not set', async () => {
    process.env.STRIPE_WEBHOOK_SECRET = '';
    const res = await POST(makeRequest('{}'));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ received: true });
    expect(constructEvent).not.toHaveBeenCalled();
  });

  it('no-ops when payments are disabled', async () => {
    process.env.NEXT_PUBLIC_PAYMENTS_ENABLED = 'false';
    const res = await POST(makeRequest('{}'));
    expect(res.status).toBe(200);
    expect(constructEvent).not.toHaveBeenCalled();
  });

  it('rejects a request with no stripe-signature header', async () => {
    const res = await POST(makeRequest('{}', null));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: 'Missing signature' });
  });

  it('rejects a request with an invalid signature', async () => {
    constructEvent.mockImplementation(() => { throw new Error('bad signature'); });
    const res = await POST(makeRequest('{}'));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: 'Invalid signature' });
  });

  it('ignores event types other than checkout.session.completed', async () => {
    constructEvent.mockReturnValue({ type: 'payment_intent.succeeded', data: { object: {} } });
    const res = await POST(makeRequest('{}'));
    expect(res.status).toBe(200);
    expect(profilesFindFirst).not.toHaveBeenCalled();
    expect(update).not.toHaveBeenCalled();
  });

  it('ignores a donation checkout (no account/profile side effects)', async () => {
    constructEvent.mockReturnValue({
      type: 'checkout.session.completed',
      data: { object: { mode: 'payment', metadata: { type: 'donation' }, customer: 'cus_1' } },
    });
    const res = await POST(makeRequest('{}'));
    expect(res.status).toBe(200);
    expect(update).not.toHaveBeenCalled();
    expect(insert).not.toHaveBeenCalled();
    expect(sendTelegramMessage).not.toHaveBeenCalled();
  });

  it('extends an existing logged-in user\'s unlock and notifies as a renewal', async () => {
    const currentExpiry = new Date(Date.now() + 1000 * 60 * 60 * 24 * 5); // 5 days left
    profilesFindFirst.mockResolvedValue({ subscriptionExpiresAt: currentExpiry });
    constructEvent.mockReturnValue({
      type: 'checkout.session.completed',
      data: {
        object: {
          mode: 'payment',
          metadata: { type: 'unlock', unlockDuration: 'monthly', userId: 'user_42' },
          customer: 'cus_42',
          customer_email: 'existing@example.com',
          amount_total: 199,
          currency: 'usd',
        },
      },
    });

    const res = await POST(makeRequest('{}'));

    expect(res.status).toBe(200);
    expect(update).toHaveBeenCalledTimes(1);
    expect(updateSet).toHaveBeenCalledWith(expect.objectContaining({
      subscriptionStatus: 'active',
      stripeCustomerId: 'cus_42',
    }));
    // Stacked on top of the existing expiry, not reset to "today + 30"
    const setArg = updateSet.mock.calls[0]![0];
    expect(setArg.subscriptionExpiresAt!.getTime()).toBeGreaterThan(currentExpiry.getTime());
    expect(insert).not.toHaveBeenCalled();
    expect(sendTelegramMessage).toHaveBeenCalledWith(expect.stringContaining('renewed'));
    expect(trackServerEvent).toHaveBeenCalled();
  });

  it('creates a brand new account for a first-time unlock buyer with no prior user', async () => {
    usersFindFirst.mockResolvedValue(undefined);
    constructEvent.mockReturnValue({
      type: 'checkout.session.completed',
      data: {
        object: {
          mode: 'payment',
          metadata: { type: 'unlock', unlockDuration: 'yearly' },
          customer: 'cus_new',
          customer_email: 'brandnew@example.com',
          amount_total: 999,
          currency: 'usd',
        },
      },
    });

    const res = await POST(makeRequest('{}'));

    expect(res.status).toBe(200);
    expect(insert).toHaveBeenCalledTimes(2); // users, then profiles
    expect(insertReturning).toHaveBeenCalled();
    expect(update).not.toHaveBeenCalled();
    expect(sendTelegramMessage).toHaveBeenCalledWith(expect.stringContaining('New Pro customer'));
  });

  it('updates the matching existing (logged-out) account when the email is already registered', async () => {
    usersFindFirst.mockResolvedValue({ id: 'existing_user_id' });
    profilesFindFirst.mockResolvedValue({ subscriptionExpiresAt: null });
    constructEvent.mockReturnValue({
      type: 'checkout.session.completed',
      data: {
        object: {
          mode: 'payment',
          metadata: { type: 'unlock', unlockDuration: 'monthly' },
          customer: 'cus_existing',
          customer_email: 'already-has-account@example.com',
        },
      },
    });

    const res = await POST(makeRequest('{}'));

    expect(res.status).toBe(200);
    expect(insert).not.toHaveBeenCalled();
    expect(update).toHaveBeenCalledTimes(1);
    expect(sendTelegramMessage).toHaveBeenCalledWith(expect.stringContaining('renewed'));
  });
});
