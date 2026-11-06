// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isStale, plannerNextAt } from './schedule';

const { duePlans, sendEmail, updateSet } = vi.hoisted(() => ({
  duePlans: vi.fn(),
  sendEmail: vi.fn(),
  updateSet: vi.fn(),
}));
vi.mock('./store', () => ({ duePlans }));
vi.mock('@/lib/email/send', () => ({ sendEmail }));
vi.mock('@/lib/db/index', () => ({
  db: { update: () => ({ set: (v: unknown) => { updateSet(v); return { where: () => Promise.resolve() }; } }) },
}));

import { sendDuePlannerEmails } from './send';

const now = new Date('2026-11-09T09:00:00Z');
const DAY = 86_400_000;
const due = (over: Record<string, unknown> = {}) => ({
  email: 'a@example.com',
  plan: { userId: 'u1', platform: 'tiktok', total: 200, done: 60, perDay: 40, cadence: 'weekly', locale: 'en', token: 'ptok', updatedAt: new Date(now.getTime() - 2 * DAY), ...over },
});

describe('planner schedule', () => {
  it('weekly and daily intervals, none when off or finished', () => {
    expect(plannerNextAt({ cadence: 'weekly', total: 10, done: 0, from: now })!.getTime() - now.getTime()).toBe(7 * DAY);
    expect(plannerNextAt({ cadence: 'daily', total: 10, done: 0, from: now })!.getTime() - now.getTime()).toBe(DAY);
    expect(plannerNextAt({ cadence: 'off', total: 10, done: 0, from: now })).toBeNull();
    expect(plannerNextAt({ cadence: 'weekly', total: 10, done: 10, from: now })).toBeNull();
  });
  it('treats 3+ weeks without progress as stale', () => {
    expect(isStale(new Date(now.getTime() - 22 * DAY), now)).toBe(true);
    expect(isStale(new Date(now.getTime() - 5 * DAY), now)).toBe(false);
  });
});

describe('sendDuePlannerEmails', () => {
  beforeEach(() => { vi.clearAllMocks(); sendEmail.mockResolvedValue({ ok: true }); });

  it('sends counts only, with one-click unsubscribe, and schedules the next', async () => {
    duePlans.mockResolvedValue([due()]);
    expect(await sendDuePlannerEmails(now, 10)).toEqual({ sent: 1, failed: 0, stopped: 0 });
    const mail = sendEmail.mock.calls[0]![0];
    expect(mail.subject).toBe('140 left in your TikTok cleanup');
    expect(mail.text).toContain("Today's batch is ready: 40 accounts.");
    expect(mail.headers['List-Unsubscribe']).toContain('/api/reminders/unsubscribe?t=ptok');
    expect(mail.text).toContain('k=planner');
    expect((updateSet.mock.calls[0]![0].nextAt as Date).getTime() - now.getTime()).toBe(7 * DAY);
  });

  it('stops abandoned or finished plans without emailing', async () => {
    duePlans.mockResolvedValue([due({ updatedAt: new Date(now.getTime() - 30 * DAY) }), due({ done: 200 })]);
    expect(await sendDuePlannerEmails(now, 10)).toEqual({ sent: 0, failed: 0, stopped: 2 });
    expect(sendEmail).not.toHaveBeenCalled();
    expect(updateSet).toHaveBeenCalledWith({ nextAt: null });
  });

  it('leaves a failed send due for tomorrow', async () => {
    duePlans.mockResolvedValue([due()]);
    sendEmail.mockResolvedValue({ ok: false, error: 'x' });
    expect(await sendDuePlannerEmails(now, 10)).toEqual({ sent: 0, failed: 1, stopped: 0 });
    expect(updateSet).not.toHaveBeenCalled();
  });

  it('does nothing with no budget left', async () => {
    expect(await sendDuePlannerEmails(now, 0)).toEqual({ sent: 0, failed: 0, stopped: 0 });
    expect(duePlans).not.toHaveBeenCalled();
  });
});
