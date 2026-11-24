// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';

const { usersFindFirst, insertCalls, createSession, enableReminders, joinCreatorWaitlist, sendVerification, emailConfigured } =
  vi.hoisted(() => ({
    usersFindFirst: vi.fn(),
    insertCalls: [] as unknown[],
    createSession: vi.fn().mockResolvedValue(undefined),
    enableReminders: vi.fn().mockResolvedValue(undefined),
    joinCreatorWaitlist: vi.fn().mockResolvedValue(undefined),
    sendVerification: vi.fn().mockResolvedValue(undefined),
    emailConfigured: vi.fn(() => true),
  }));

// A fresh IP per call keeps the in-memory signup rate limit out of the way.
vi.mock('next/headers', () => ({ headers: async () => new Headers({ 'x-forwarded-for': `10.2.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}` }) }));
vi.mock('@node-rs/argon2', () => ({ hash: vi.fn().mockResolvedValue('hashed') }));
vi.mock('@/lib/db/index', () => ({
  db: {
    query: { users: { findFirst: usersFindFirst } },
    insert: () => ({
      values: (v: unknown) => {
        insertCalls.push(v);
        const done = Promise.resolve(undefined);
        return Object.assign(done, { returning: async () => [{ id: 'u_new' }] });
      },
    }),
  },
}));
vi.mock('@/lib/auth/session', () => ({ createSession }));
vi.mock('@/lib/sync/salt', () => ({ ensureSyncSalt: vi.fn().mockResolvedValue('c2FsdA==') }));
vi.mock('@/lib/email/send', () => ({ isEmailConfigured: emailConfigured }));
vi.mock('@/lib/auth/verification', () => ({ generateAndSendVerification: sendVerification }));
vi.mock('@/lib/reminders/store', () => ({ enableReminders, joinCreatorWaitlist }));

import { signupAction } from './actions';

function form(overrides: Record<string, string | null> = {}) {
  const f = new FormData();
  const values: Record<string, string | null> = { email: 'New@Example.com ', password: 'hunter2hunter2', locale: 'es', ...overrides };
  for (const [k, v] of Object.entries(values)) if (v !== null) f.set(k, v);
  return f;
}

beforeEach(() => {
  vi.clearAllMocks();
  insertCalls.length = 0;
  usersFindFirst.mockResolvedValue(undefined);
  emailConfigured.mockReturnValue(true);
});

describe('signupAction', () => {
  it('creates a free, unverified account and sends the code in the visitor locale', async () => {
    const res = await signupAction(form());
    expect(res).toEqual({ ok: true, saltB64: 'c2FsdA==', needsVerification: true });
    expect(insertCalls[0]).toMatchObject({ email: 'new@example.com', passwordHash: 'hashed', emailVerifiedAt: null });
    expect(insertCalls[1]).toMatchObject({ userId: 'u_new', subscriptionStatus: 'none' });
    expect(createSession).toHaveBeenCalledWith('u_new');
    expect(sendVerification).toHaveBeenCalledWith('u_new', 'new@example.com', 'es');
  });

  it('does not join the waitlist from the normal signup form', async () => {
    await signupAction(form());
    expect(joinCreatorWaitlist).not.toHaveBeenCalled();
  });

  it('joins the waitlist, linked to the new account, when the form says waitlist=on', async () => {
    await signupAction(form({ waitlist: 'on' }));
    expect(joinCreatorWaitlist).toHaveBeenCalledWith({ email: 'new@example.com', locale: 'es', userId: 'u_new' });
  });

  it('still creates the account when the waitlist save fails', async () => {
    joinCreatorWaitlist.mockRejectedValueOnce(new Error('db down'));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const res = await signupAction(form({ waitlist: 'on' }));
    expect(res).toMatchObject({ ok: true });
    expect(createSession).toHaveBeenCalled();
  });

  it('turns reminders on only when the box is ticked', async () => {
    await signupAction(form({ reminders: 'on' }));
    expect(enableReminders).toHaveBeenCalledWith(expect.objectContaining({ email: 'new@example.com', source: 'signup', userId: 'u_new' }));
    enableReminders.mockClear();
    await signupAction(form());
    expect(enableReminders).not.toHaveBeenCalled();
  });

  it('marks the account verified when email sending is not configured', async () => {
    emailConfigured.mockReturnValue(false);
    const res = await signupAction(form());
    expect(res).toMatchObject({ ok: true, needsVerification: false });
    expect((insertCalls[0] as { emailVerifiedAt: unknown }).emailVerifiedAt).toBeInstanceOf(Date);
    expect(sendVerification).not.toHaveBeenCalled();
  });

  it('falls back to English for an unknown locale', async () => {
    await signupAction(form({ locale: 'xx', waitlist: 'on' }));
    expect(joinCreatorWaitlist).toHaveBeenCalledWith(expect.objectContaining({ locale: 'en' }));
  });

  it.each([
    [{ email: null }, 'missing_fields'],
    [{ password: null }, 'missing_fields'],
    [{ password: 'short' }, 'password_too_short'],
    [{ email: 'x@mailinator.com' }, 'disposable_email'],
  ])('rejects %o with %s and creates nothing', async (overrides, code) => {
    const res = await signupAction(form({ waitlist: 'on', ...overrides }));
    expect(res).toEqual({ error: code });
    expect(insertCalls).toHaveLength(0);
    expect(joinCreatorWaitlist).not.toHaveBeenCalled();
  });

  it('refuses an email that already has an account, and does not add it to the waitlist', async () => {
    usersFindFirst.mockResolvedValue({ id: 'u_old' });
    const res = await signupAction(form({ waitlist: 'on' }));
    expect(res).toEqual({ error: 'email_taken' });
    expect(insertCalls).toHaveLength(0);
    expect(joinCreatorWaitlist).not.toHaveBeenCalled();
  });
});
