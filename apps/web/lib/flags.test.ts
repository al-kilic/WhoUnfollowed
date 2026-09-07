// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const { validateRequest } = vi.hoisted(() => ({ validateRequest: vi.fn() }));
const { findFirst } = vi.hoisted(() => ({ findFirst: vi.fn() }));

vi.mock('@/lib/auth/session', () => ({ validateRequest }));
vi.mock('@/lib/db/index', () => ({
  db: { query: { profiles: { findFirst } } },
}));

import { getSubscriptionStatus, isProUser, isPaidSubscriber } from './flags';

const USER = { id: 'user_1', email: 'a@b.com' };
const FUTURE = new Date(Date.now() + 1000 * 60 * 60 * 24 * 10); // 10 days out
const PAST = new Date(Date.now() - 1000 * 60 * 60 * 24 * 10); // 10 days ago

describe('getSubscriptionStatus', () => {
  const ORIGINAL_ENV = process.env;
  beforeEach(() => { process.env = { ...ORIGINAL_ENV, NEXT_PUBLIC_PAYMENTS_ENABLED: 'true' }; });
  afterEach(() => { process.env = ORIGINAL_ENV; vi.resetAllMocks(); });

  it('is "none" when logged out', async () => {
    validateRequest.mockResolvedValue({ user: null });
    expect(await getSubscriptionStatus()).toBe('none');
    expect(findFirst).not.toHaveBeenCalled();
  });

  it('is "none" when logged in but no profile row exists', async () => {
    validateRequest.mockResolvedValue({ user: USER });
    findFirst.mockResolvedValue(undefined);
    expect(await getSubscriptionStatus()).toBe('none');
  });

  it('is "active" for a real subscriber (no expiry set)', async () => {
    validateRequest.mockResolvedValue({ user: USER });
    findFirst.mockResolvedValue({ subscriptionStatus: 'active', subscriptionExpiresAt: null });
    expect(await getSubscriptionStatus()).toBe('active');
  });

  it('is "active" for an unlock that has not expired yet', async () => {
    validateRequest.mockResolvedValue({ user: USER });
    findFirst.mockResolvedValue({ subscriptionStatus: 'active', subscriptionExpiresAt: FUTURE });
    expect(await getSubscriptionStatus()).toBe('active');
  });

  it('is "none" for an unlock that already expired, even though the row still says active', async () => {
    validateRequest.mockResolvedValue({ user: USER });
    findFirst.mockResolvedValue({ subscriptionStatus: 'active', subscriptionExpiresAt: PAST });
    expect(await getSubscriptionStatus()).toBe('none');
  });

  it('passes through "grace" and "cancelled" untouched', async () => {
    validateRequest.mockResolvedValue({ user: USER });
    findFirst.mockResolvedValue({ subscriptionStatus: 'grace', subscriptionExpiresAt: null });
    expect(await getSubscriptionStatus()).toBe('grace');

    findFirst.mockResolvedValue({ subscriptionStatus: 'cancelled', subscriptionExpiresAt: null });
    expect(await getSubscriptionStatus()).toBe('cancelled');
  });
});

describe('isProUser', () => {
  const ORIGINAL_ENV = process.env;
  afterEach(() => { process.env = ORIGINAL_ENV; vi.resetAllMocks(); });

  it('during beta (payments disabled), true for anyone logged in regardless of status', async () => {
    process.env = { ...ORIGINAL_ENV, NEXT_PUBLIC_PAYMENTS_ENABLED: 'false' };
    validateRequest.mockResolvedValue({ user: USER });
    expect(await isProUser()).toBe(true);
  });

  it('during beta, false when logged out', async () => {
    process.env = { ...ORIGINAL_ENV, NEXT_PUBLIC_PAYMENTS_ENABLED: 'false' };
    validateRequest.mockResolvedValue({ user: null });
    expect(await isProUser()).toBe(false);
  });

  it('in live payments mode, true only when status resolves to active', async () => {
    process.env = { ...ORIGINAL_ENV, NEXT_PUBLIC_PAYMENTS_ENABLED: 'true' };
    validateRequest.mockResolvedValue({ user: USER });
    findFirst.mockResolvedValue({ subscriptionStatus: 'active', subscriptionExpiresAt: FUTURE });
    expect(await isProUser()).toBe(true);
  });

  it('in live payments mode, false once the unlock has expired', async () => {
    process.env = { ...ORIGINAL_ENV, NEXT_PUBLIC_PAYMENTS_ENABLED: 'true' };
    validateRequest.mockResolvedValue({ user: USER });
    findFirst.mockResolvedValue({ subscriptionStatus: 'active', subscriptionExpiresAt: PAST });
    expect(await isProUser()).toBe(false);
  });
});

describe('isPaidSubscriber', () => {
  afterEach(() => { vi.resetAllMocks(); });

  it('false when logged out', async () => {
    validateRequest.mockResolvedValue({ user: null });
    expect(await isPaidSubscriber()).toBe(false);
  });

  it('false when the profile is active but seeded with no real payment (beta default)', async () => {
    validateRequest.mockResolvedValue({ user: USER });
    findFirst.mockResolvedValue({ subscriptionStatus: 'active', stripeSubscriptionId: null, subscriptionExpiresAt: null });
    expect(await isPaidSubscriber()).toBe(false);
  });

  it('true for a real recurring subscriber', async () => {
    validateRequest.mockResolvedValue({ user: USER });
    findFirst.mockResolvedValue({ subscriptionStatus: 'active', stripeSubscriptionId: 'sub_123', subscriptionExpiresAt: null });
    expect(await isPaidSubscriber()).toBe(true);
  });

  it('true for a still-valid one-time unlock', async () => {
    validateRequest.mockResolvedValue({ user: USER });
    findFirst.mockResolvedValue({ subscriptionStatus: 'active', stripeSubscriptionId: null, subscriptionExpiresAt: FUTURE });
    expect(await isPaidSubscriber()).toBe(true);
  });

  it('false once the one-time unlock has expired', async () => {
    validateRequest.mockResolvedValue({ user: USER });
    findFirst.mockResolvedValue({ subscriptionStatus: 'active', stripeSubscriptionId: null, subscriptionExpiresAt: PAST });
    expect(await isPaidSubscriber()).toBe(false);
  });

  it('false when status is not active even if a subscription id is present (e.g. grace)', async () => {
    validateRequest.mockResolvedValue({ user: USER });
    findFirst.mockResolvedValue({ subscriptionStatus: 'grace', stripeSubscriptionId: 'sub_123', subscriptionExpiresAt: null });
    expect(await isPaidSubscriber()).toBe(false);
  });
});
