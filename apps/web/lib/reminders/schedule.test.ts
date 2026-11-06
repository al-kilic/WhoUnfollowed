import { describe, it, expect } from 'vitest';
import { firstReminderAt, nextReminderAfterSend } from './schedule';

const DAY = 86_400_000;
const now = new Date('2026-11-01T09:00:00Z');

describe('reminder schedule', () => {
  it('sends the first reminder 14 days after sign-up', () => {
    expect(firstReminderAt(now).getTime() - now.getTime()).toBe(14 * DAY);
  });

  it('sends the second one 16 days after the first (day 30)', () => {
    const next = nextReminderAfterSend({ sentCount: 1, now, engagedAt: null });
    expect(next!.getTime() - now.getTime()).toBe(16 * DAY);
  });

  it('goes monthly after that while the person clicks', () => {
    const engagedAt = new Date(now.getTime() - 20 * DAY);
    const next = nextReminderAfterSend({ sentCount: 2, now, engagedAt });
    expect(next!.getTime() - now.getTime()).toBe(30 * DAY);
  });

  it('stops when nobody clicked in the last 60 days', () => {
    expect(nextReminderAfterSend({ sentCount: 2, now, engagedAt: null })).toBeNull();
    expect(nextReminderAfterSend({ sentCount: 5, now, engagedAt: new Date(now.getTime() - 61 * DAY) })).toBeNull();
  });
});
