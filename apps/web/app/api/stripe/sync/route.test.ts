// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';

const m = vi.hoisted(() => ({
  validateRequest: vi.fn(),
  findFirst: vi.fn(),
  syncSubscriptionFromStripe: vi.fn().mockResolvedValue(true),
  syncRefills: vi.fn().mockResolvedValue(0),
}));
vi.mock('@/lib/auth/session', () => ({ validateRequest: m.validateRequest }));
vi.mock('@/lib/db/index', () => ({ db: { query: { profiles: { findFirst: m.findFirst } } } }));
vi.mock('@/lib/stripe', () => ({ isStripeConfigured: () => true, getStripe: () => ({}) }));
vi.mock('@/lib/proAiBilling', () => ({ syncSubscriptionFromStripe: m.syncSubscriptionFromStripe }));
vi.mock('@/lib/aiTopup', () => ({ syncRefills: m.syncRefills }));

import { POST } from './route';

let n = 0;
const user = () => ({ user: { id: `u${++n}` } });

describe('POST /api/stripe/sync', () => {
  beforeEach(() => { vi.clearAllMocks(); m.syncSubscriptionFromStripe.mockResolvedValue(true); m.syncRefills.mockResolvedValue(0); });

  it('needs an account', async () => {
    m.validateRequest.mockResolvedValue({ user: null });
    expect((await POST()).status).toBe(401);
  });

  it('re-reads the subscription and the paid refills', async () => {
    m.validateRequest.mockResolvedValue(user());
    m.findFirst.mockResolvedValue({ stripeSubscriptionId: 'sub_1', stripeCustomerId: 'cus_1' });
    m.syncRefills.mockResolvedValue(2);
    const res = await POST();
    expect(await res.json()).toEqual({ synced: true, refills: 2 });
    expect(m.syncSubscriptionFromStripe).toHaveBeenCalledWith({}, { stripeSubscriptionId: 'sub_1', stripeCustomerId: 'cus_1' });
    expect(m.syncRefills.mock.calls[0]![2]).toBe('cus_1');
  });

  it('still syncs refills for a member with no Stripe ids stored', async () => {
    m.validateRequest.mockResolvedValue(user());
    m.findFirst.mockResolvedValue({ stripeSubscriptionId: null, stripeCustomerId: null });
    m.syncRefills.mockResolvedValue(1);
    expect(await (await POST()).json()).toEqual({ synced: false, refills: 1 });
    expect(m.syncSubscriptionFromStripe).not.toHaveBeenCalled();
  });

  it('reports a Stripe error as not synced instead of failing', async () => {
    m.validateRequest.mockResolvedValue(user());
    m.findFirst.mockResolvedValue({ stripeSubscriptionId: 'sub_1', stripeCustomerId: 'cus_1' });
    m.syncSubscriptionFromStripe.mockRejectedValue(new Error('boom'));
    m.syncRefills.mockRejectedValue(new Error('boom'));
    const res = await POST();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ synced: false, refills: 0 });
  });
});
