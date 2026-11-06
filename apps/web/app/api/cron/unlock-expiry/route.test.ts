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
vi.mock('@/lib/email/send', () => ({ sendEmail, isEmailConfigured, takeEmailTally: () => ({ sent: 0, failed: 0, limited: 0, since: Date.now() }) }));
const { sendTelegramMessage, countDueReminders, countDueWraps, countDuePlans } = vi.hoisted(() => ({
  sendTelegramMessage: vi.fn().mockResolvedValue({ ok: true }),
  countDueReminders: vi.fn().mockResolvedValue(0),
  countDueWraps: vi.fn().mockResolvedValue(0),
  countDuePlans: vi.fn().mockResolvedValue(0),
}));
vi.mock('@/lib/telegram', () => ({ sendTelegramMessage, escapeTelegramHtml: (s: string) => s }));
vi.mock('@/lib/reminders/store', () => ({ countDueReminders, countDueWraps }));
vi.mock('@/lib/planner/store', () => ({ countDuePlans }));
const { sendDueReminders } = vi.hoisted(() => ({ sendDueReminders: vi.fn() }));
vi.mock('@/lib/reminders/send', () => ({ sendDueReminders, reminderDailyCap: () => 80 }));
const { sendDuePlannerEmails } = vi.hoisted(() => ({ sendDuePlannerEmails: vi.fn() }));
vi.mock('@/lib/planner/send', () => ({ sendDuePlannerEmails, plannerDailyCap: () => 15 }));
const { sendDueWraps } = vi.hoisted(() => ({ sendDueWraps: vi.fn().mockResolvedValue({ sent: 0, failed: 0 }) }));
vi.mock('@/lib/wrap/send', () => ({ sendDueWraps, wrapDailyCap: () => 15 }));

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
    sendDueReminders.mockResolvedValue({ sent: 0, failed: 0 });
    sendDuePlannerEmails.mockResolvedValue({ sent: 0, failed: 0, stopped: 0 });
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
    expect(await res.json()).toMatchObject({ expiredSent: 1, reminderSent: 0, reminders: { sent: 0, failed: 0 }, planner: { sent: 0, failed: 0, stopped: 0 }, wraps: { sent: 0, failed: 0 } });
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
    expect(await res.json()).toMatchObject({ expiredSent: 0, reminderSent: 1, reminders: { sent: 0, failed: 0 }, planner: { sent: 0, failed: 0, stopped: 0 }, wraps: { sent: 0, failed: 0 } });
    expect(sendEmail).toHaveBeenCalledWith(expect.objectContaining({ to: 'soon@example.com' }));
    expect(updateSet).toHaveBeenCalledWith(expect.objectContaining({ expiryReminderSentAt: expect.any(Date) }));
  });

  it('is a no-op when nothing is due', async () => {
    profilesFindMany.mockResolvedValue([]);
    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ expiredSent: 0, reminderSent: 0, reminders: { sent: 0, failed: 0 }, planner: { sent: 0, failed: 0, stopped: 0 }, wraps: { sent: 0, failed: 0 } });
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
    expect(await res.json()).toMatchObject({ expiredSent: 0, reminderSent: 0, skipped: 'email_not_configured' });
    expect(profilesFindMany).not.toHaveBeenCalled();
    expect(update).not.toHaveBeenCalled();
  });
});

describe('POST /api/cron/unlock-expiry reminder pass', () => {
  const ENV = { ...process.env };
  beforeEach(() => {
    process.env = { ...ENV, CRON_SECRET: 'cron_secret_test' };
    isEmailConfigured.mockReturnValue(true);
    profilesFindMany.mockResolvedValue([]);
  });
  afterEach(() => { process.env = ENV; vi.clearAllMocks(); });

  it('reports reminder results alongside the unlock emails', async () => {
    sendDueReminders.mockResolvedValue({ sent: 3, failed: 1 });
    const res = await POST(makeRequest());
    expect(await res.json()).toMatchObject({ expiredSent: 0, reminderSent: 0, reminders: { sent: 3, failed: 1 }, planner: { sent: 0, failed: 0, stopped: 0 }, wraps: { sent: 0, failed: 0 } });
  });

  it('still answers when the reminder pass throws', async () => {
    sendDueReminders.mockRejectedValue(new Error('db down'));
    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ expiredSent: 0, reminderSent: 0, reminders: { error: 'reminders_failed' }, planner: { sent: 0, failed: 0, stopped: 0 }, wraps: { sent: 0, failed: 0 } });
  });
});

describe('POST /api/cron/unlock-expiry planner pass', () => {
  const ENV = { ...process.env };
  beforeEach(() => {
    process.env = { ...ENV, CRON_SECRET: 'cron_secret_test' };
    isEmailConfigured.mockReturnValue(true);
    profilesFindMany.mockResolvedValue([]);
  });

  it('gives the planner only what the earlier passes left of the daily budget', async () => {
    sendDueReminders.mockResolvedValue({ sent: 80, failed: 0 });
    sendDuePlannerEmails.mockResolvedValue({ sent: 2, failed: 0, stopped: 0 });
    const res = await POST(makeRequest());
    expect(sendDuePlannerEmails.mock.calls[0]![1]).toBe(10); // 90 budget - 80 reminders
    expect((await res.json()).planner).toEqual({ sent: 2, failed: 0, stopped: 0 });
  });

  it('gives wrap emails whatever is left after the planner', async () => {
    sendDueReminders.mockResolvedValue({ sent: 70, failed: 0 });
    sendDuePlannerEmails.mockResolvedValue({ sent: 10, failed: 0, stopped: 0 });
    sendDueWraps.mockResolvedValue({ sent: 10, failed: 0 });
    const res = await POST(makeRequest());
    expect(sendDueWraps.mock.calls.at(-1)![1]).toBe(10); // 90 - 70 - 10
    expect((await res.json()).wraps).toEqual({ sent: 10, failed: 0 });
  });

  it('caps wraps even on a quiet day', async () => {
    sendDueReminders.mockResolvedValue({ sent: 0, failed: 0 });
    sendDuePlannerEmails.mockResolvedValue({ sent: 0, failed: 0, stopped: 0 });
    sendDueWraps.mockResolvedValue({ sent: 15, failed: 0 });
    const res = await POST(makeRequest());
    expect(sendDueWraps.mock.calls.at(-1)![1]).toBe(15);
    expect((await res.json()).wraps).toEqual({ sent: 15, failed: 0 });
  });

  it('sends no wraps when the budget is used up', async () => {
    sendDueReminders.mockResolvedValue({ sent: 80, failed: 0 });
    sendDuePlannerEmails.mockResolvedValue({ sent: 10, failed: 0, stopped: 0 });
    await POST(makeRequest());
    expect(sendDueWraps.mock.calls.at(-1)![1]).toBe(0);
  });

  it('posts an email report to Telegram and flags what the caps held back', async () => {
    sendDueReminders.mockResolvedValue({ sent: 80, failed: 0 });
    sendDuePlannerEmails.mockResolvedValue({ sent: 10, failed: 0, stopped: 0 });
    sendDueWraps.mockResolvedValue({ sent: 0, failed: 0 });
    countDueWraps.mockResolvedValueOnce(4);
    const res = await POST(makeRequest());
    expect((await res.json()).alert).toBe(true);
    const text = sendTelegramMessage.mock.calls.at(-1)![0] as string;
    expect(text).toContain('some emails did not go out');
    expect(text).toContain('4 3-month wraps held back by the daily limit');
  });

  it('sends a calm report when everything went out', async () => {
    sendDueReminders.mockResolvedValue({ sent: 2, failed: 0 });
    sendDuePlannerEmails.mockResolvedValue({ sent: 0, failed: 0, stopped: 0 });
    sendDueWraps.mockResolvedValue({ sent: 0, failed: 0 });
    const res = await POST(makeRequest());
    expect((await res.json()).alert).toBe(false);
    expect(sendTelegramMessage.mock.calls.at(-1)![0]).toContain('📧 <b>Email report</b>');
  });

  it('alerts on Telegram when email is not configured', async () => {
    isEmailConfigured.mockReturnValue(false);
    await POST(makeRequest());
    expect(sendTelegramMessage.mock.calls.at(-1)![0]).toContain('nothing sent today');
  });
});
