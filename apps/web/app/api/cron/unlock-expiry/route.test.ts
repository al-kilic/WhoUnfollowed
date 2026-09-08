// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';

const { profilesFindMany, usersFindFirst, updateWhere, updateSet, update, sendEmail, isEmailConfigured } = vi.hoisted(() => {
  const updateWhere = vi.fn().mockResolvedValue(undefined);
  const updateSet = vi.fn((_values: { expiredEmailSentAt?: Date; expiryReminderSentAt?: Date; [key: string]: unknown }) => ({ where: updateWhere }));
  const update = vi.fn(() => ({ set: updateSet }));
  return {
    profilesFindMany: vi.fn().mockResolvedValue([]),
    usersFindFirst: vi.fn(),
    updateWhere, updateSet, update,
    sendEmail: vi.fn().mockResolvedValue({ ok: true }),
    isEmailConfigured: vi.fn().mockReturnValue(true),
  };
});

vi.mock('@/lib/db/index', () => ({
  db: {
    query: { profiles: { findMany: profilesFindMany }, users: { findFirst: usersFindFirst } },
    update,
  },
}));
vi.mock('@/lib/email/send', () => ({ sendEmail, isEmailConfigured }));

import { POST } from './route';

function makeRequest(secret: string | null = 'cron_secret_test') {
  const headers = new Headers();
  if (secret) headers.set('x-cron-secret', secret);
  return new NextRequest('http://localhost/api/cron/unlock-expiry', { method: 'POST', headers });
}

const BASE_ENV = { ...process.env };

describe('POST /api/cron/unlock-expiry', () => {
  beforeEach(() => {
    process.env = { ...BASE_ENV, CRON_SECRET: 'cron_secret_test' };
  });
  afterEach(() => {
    process.env = BASE_ENV;
    vi.clearAllMocks();
  });

  it('rejects a request with the wrong secret', async () => {
    const res = await POST(makeRequest('wrong'));
    expect(res.status).toBe(401);
    expect(profilesFindMany).not.toHaveBeenCalled();
  });

  it('sends the expired email once and marks it sent, without touching subscriptionStatus', async () => {
    profilesFindMany
      .mockResolvedValueOnce([{ userId: 'u1', locale: 'pt' }]) // pass 1: just expired
      .mockResolvedValueOnce([]); // pass 2: expiring soon
    usersFindFirst.mockResolvedValue({ email: 'lapsed@example.com' });

    const res = await POST(makeRequest());

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ expiredSent: 1, reminderSent: 0 });
    expect(sendEmail).toHaveBeenCalledWith(expect.objectContaining({ to: 'lapsed@example.com' }));
    expect(updateSet).toHaveBeenCalledWith(expect.objectContaining({ expiredEmailSentAt: expect.any(Date) }));
    expect(updateSet.mock.calls[0]![0]).not.toHaveProperty('subscriptionStatus');
  });

  it('sends the reminder email once for an unlock expiring within the window', async () => {
    const expiresAt = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // 2 days out
    profilesFindMany
      .mockResolvedValueOnce([]) // pass 1: just expired
      .mockResolvedValueOnce([{ userId: 'u2', locale: 'en', subscriptionExpiresAt: expiresAt }]); // pass 2
    usersFindFirst.mockResolvedValue({ email: 'soon@example.com' });

    const res = await POST(makeRequest());

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ expiredSent: 0, reminderSent: 1 });
    expect(sendEmail).toHaveBeenCalledWith(expect.objectContaining({ to: 'soon@example.com' }));
    expect(updateSet).toHaveBeenCalledWith(expect.objectContaining({ expiryReminderSentAt: expect.any(Date) }));
  });

  it('is a no-op when nothing is due', async () => {
    profilesFindMany.mockResolvedValue([]);
    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ expiredSent: 0, reminderSent: 0 });
    expect(sendEmail).not.toHaveBeenCalled();
    expect(update).not.toHaveBeenCalled();
  });
});

describe('POST /api/cron/unlock-expiry when email is not configured', () => {
  beforeEach(() => {
    process.env = { ...BASE_ENV, CRON_SECRET: 'cron_secret_test' };
  });
  afterEach(() => {
    process.env = BASE_ENV;
    vi.clearAllMocks();
  });

  it('skips entirely rather than burning idempotency markers with nothing sent', async () => {
    isEmailConfigured.mockReturnValueOnce(false);

    const res = await POST(makeRequest());

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ expiredSent: 0, reminderSent: 0, skipped: 'email_not_configured' });
    expect(profilesFindMany).not.toHaveBeenCalled();
    expect(update).not.toHaveBeenCalled();
  });
});
