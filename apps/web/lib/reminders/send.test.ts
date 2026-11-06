// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';

const { dueReminders, sendEmail, updateSet } = vi.hoisted(() => ({
  dueReminders: vi.fn(),
  sendEmail: vi.fn(),
  updateSet: vi.fn(),
}));
vi.mock('./store', () => ({ dueReminders, newToken: () => 'fresh-token' }));
vi.mock('@/lib/email/send', () => ({ sendEmail }));
vi.mock('@/lib/db/index', () => ({
  db: { update: () => ({ set: (v: unknown) => { updateSet(v); return { where: () => Promise.resolve() }; } }) },
}));

import { sendDueReminders } from './send';

const now = new Date('2026-11-09T09:00:00Z');
const row = (over: Record<string, unknown> = {}) => ({
  id: 'r1', email: 'a@example.com', locale: 'en', token: 'tok', reminderSentCount: 0, reminderEngagedAt: null, ...over,
});

describe('sendDueReminders', () => {
  beforeEach(() => { vi.clearAllMocks(); sendEmail.mockResolvedValue({ ok: true }); });

  it('sends due reminders with one-click unsubscribe headers and schedules the next', async () => {
    dueReminders.mockResolvedValue([row()]);
    expect(await sendDueReminders(now, 10)).toEqual({ sent: 1, failed: 0 });
    const mail = sendEmail.mock.calls[0]![0];
    expect(mail.subject).toContain('2 weeks');
    expect(mail.headers['List-Unsubscribe-Post']).toBe('List-Unsubscribe=One-Click');
    expect(mail.headers['List-Unsubscribe']).toContain('/api/reminders/unsubscribe?t=tok');
    const set = updateSet.mock.calls[0]![0];
    expect(set.reminderSentCount).toBe(1);
    expect((set.reminderNextAt as Date).getTime() - now.getTime()).toBe(16 * 86_400_000);
  });

  it('stops the series after the second reminder when nobody clicked', async () => {
    dueReminders.mockResolvedValue([row({ reminderSentCount: 1 })]);
    await sendDueReminders(now, 10);
    // sentCount becomes 2 here, so the next one depends on engagement: none, so it stops.
    expect(updateSet.mock.calls[0]![0].reminderNextAt).toBeNull();
  });

  it('leaves a failed send due for tomorrow', async () => {
    dueReminders.mockResolvedValue([row()]);
    sendEmail.mockResolvedValue({ ok: false, error: 'boom' });
    expect(await sendDueReminders(now, 10)).toEqual({ sent: 0, failed: 1 });
    expect(updateSet).not.toHaveBeenCalled();
  });

  it('respects the daily cap', async () => {
    dueReminders.mockResolvedValue([]);
    await sendDueReminders(now, 7);
    expect(dueReminders).toHaveBeenCalledWith(now, 7);
  });
});
