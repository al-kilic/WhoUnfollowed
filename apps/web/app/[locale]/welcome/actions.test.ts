// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';

const { usersFindFirst, profilesFindFirst, updateReturning, update, sessionsRetrieve, createSession, validateRequest, redirect } =
  vi.hoisted(() => {
    const updateReturning = vi.fn();
    const update = vi.fn(() => ({ set: () => ({ where: () => ({ returning: updateReturning }) }) }));
    return {
      usersFindFirst: vi.fn(),
      profilesFindFirst: vi.fn(),
      updateReturning,
      update,
      sessionsRetrieve: vi.fn(),
      createSession: vi.fn().mockResolvedValue(undefined),
      validateRequest: vi.fn().mockResolvedValue({ user: null }),
      redirect: vi.fn(),
    };
  });

vi.mock('next/headers', () => ({ headers: async () => new Headers({ 'x-forwarded-for': `10.1.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}` }) }));
vi.mock('@node-rs/argon2', () => ({ hash: vi.fn().mockResolvedValue('hashed') }));
vi.mock('@/lib/db/index', () => ({
  db: { query: { users: { findFirst: usersFindFirst }, profiles: { findFirst: profilesFindFirst } }, update },
}));
vi.mock('@/lib/auth/session', () => ({ createSession, validateRequest }));
vi.mock('@/lib/stripe', () => ({
  isStripeConfigured: () => true,
  getStripe: () => ({ checkout: { sessions: { retrieve: sessionsRetrieve } } }),
}));
vi.mock('@/i18n/navigation', () => ({ redirect }));

import { setPasswordAction } from './actions';

const NOW_S = Math.floor(Date.now() / 1000);

function form(overrides: Record<string, string> = {}) {
  const f = new FormData();
  const values = { sessionId: 'cs_test_abc', password: 'hunter2hunter2', confirmPassword: 'hunter2hunter2', locale: 'en', ...overrides };
  for (const [k, v] of Object.entries(values)) f.set(k, v);
  return f;
}

function paidSession(overrides: Record<string, unknown> = {}) {
  return {
    status: 'complete',
    payment_status: 'paid',
    metadata: { type: 'unlock' },
    created: NOW_S - 120,
    customer: 'cus_buyer',
    customer_email: 'buyer@example.com',
    customer_details: null,
    ...overrides,
  };
}

const passwordlessUser = { id: 'u_new', passwordHash: '', emailVerifiedAt: null, createdAt: new Date((NOW_S - 60) * 1000) };

beforeEach(() => {
  vi.clearAllMocks();
  validateRequest.mockResolvedValue({ user: null });
  profilesFindFirst.mockResolvedValue({ stripeCustomerId: 'cus_buyer' });
  updateReturning.mockResolvedValue([{ id: 'u_new' }]);
});

describe('setPasswordAction', () => {
  it('rejects a checkout that was never paid (the takeover path)', async () => {
    sessionsRetrieve.mockResolvedValue(paidSession({ status: 'open', payment_status: 'unpaid' }));
    usersFindFirst.mockResolvedValue({ ...passwordlessUser, passwordHash: 'victim-hash' });

    expect(await setPasswordAction(form())).toEqual({ error: 'payment_not_complete' });
    expect(createSession).not.toHaveBeenCalled();
  });

  it('never logs a visitor into an account that already has a password', async () => {
    sessionsRetrieve.mockResolvedValue(paidSession());
    usersFindFirst.mockResolvedValue({ ...passwordlessUser, id: 'u_victim', passwordHash: 'victim-hash' });

    expect(await setPasswordAction(form())).toEqual({ error: 'already_has_password' });
    expect(createSession).not.toHaveBeenCalled();
    expect(update).not.toHaveBeenCalled();
  });

  it('sends an already signed-in buyer to history without creating a session', async () => {
    sessionsRetrieve.mockResolvedValue(paidSession());
    usersFindFirst.mockResolvedValue({ ...passwordlessUser, id: 'u_me', passwordHash: 'my-hash' });
    validateRequest.mockResolvedValue({ user: { id: 'u_me' } });

    await setPasswordAction(form());
    expect(redirect).toHaveBeenCalledWith({ href: '/history', locale: 'en' });
    expect(createSession).not.toHaveBeenCalled();
  });

  it('sets the first password on the account this checkout created', async () => {
    sessionsRetrieve.mockResolvedValue(paidSession());
    usersFindFirst.mockResolvedValue(passwordlessUser);

    await setPasswordAction(form());
    expect(update).toHaveBeenCalled();
    expect(createSession).toHaveBeenCalledWith('u_new');
    expect(redirect).toHaveBeenCalledWith({ href: '/history', locale: 'en' });
  });

  it('accepts a checkout fully covered by a promo code', async () => {
    sessionsRetrieve.mockResolvedValue(paidSession({ payment_status: 'no_payment_required' }));
    usersFindFirst.mockResolvedValue(passwordlessUser);

    await setPasswordAction(form());
    expect(createSession).toHaveBeenCalledWith('u_new');
  });

  it('refuses when the account belongs to a different Stripe customer', async () => {
    sessionsRetrieve.mockResolvedValue(paidSession());
    usersFindFirst.mockResolvedValue(passwordlessUser);
    profilesFindFirst.mockResolvedValue({ stripeCustomerId: 'cus_someone_else' });

    expect(await setPasswordAction(form())).toEqual({ error: 'claim_not_allowed' });
    expect(createSession).not.toHaveBeenCalled();
  });

  it('refuses an older passwordless account not created by this checkout', async () => {
    sessionsRetrieve.mockResolvedValue(paidSession());
    usersFindFirst.mockResolvedValue({ ...passwordlessUser, createdAt: new Date((NOW_S - 30 * 86400) * 1000) });

    expect(await setPasswordAction(form())).toEqual({ error: 'claim_not_allowed' });
    expect(createSession).not.toHaveBeenCalled();
  });

  it('expires links older than a week', async () => {
    sessionsRetrieve.mockResolvedValue(paidSession({ created: NOW_S - 8 * 86400 }));
    usersFindFirst.mockResolvedValue(passwordlessUser);

    expect(await setPasswordAction(form())).toEqual({ error: 'invalid_or_expired_session' });
  });

  it('is single use: a lost race does not log anyone in', async () => {
    sessionsRetrieve.mockResolvedValue(paidSession());
    usersFindFirst.mockResolvedValue(passwordlessUser);
    updateReturning.mockResolvedValue([]);

    expect(await setPasswordAction(form())).toEqual({ error: 'already_has_password' });
    expect(createSession).not.toHaveBeenCalled();
  });

  it('rejects a session id that is not a checkout id', async () => {
    expect(await setPasswordAction(form({ sessionId: 'not-a-session' }))).toEqual({ error: 'invalid_link' });
    expect(sessionsRetrieve).not.toHaveBeenCalled();
  });
});
