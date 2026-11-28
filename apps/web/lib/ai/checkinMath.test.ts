import { describe, it, expect } from 'vitest';
import { checkinDue, deadlineDays, type CheckinGoalRow } from './checkinMath';

const D = (s: string) => new Date(`${s}T12:00:00Z`);
const goal = (id: string, platform: string, over: Partial<CheckinGoalRow> = {}): CheckinGoalRow => ({ id, platform, by: null, setAt: D('2026-11-01'), deadlineRemindedAt: null, ...over });
const opts = { cadence: 'weekly' as const, weekday: null, lastSentAt: null, deadlineReminder: true };

describe('checkin selection with goals per platform', () => {
  it('sends nothing without goals', () => {
    expect(checkinDue(opts, [], D('2026-12-01')).send).toBe(false);
  });

  it('one weekly email covers both goals, from the earliest one', () => {
    const goals = [goal('a', 'instagram'), goal('b', 'threads', { setAt: D('2026-11-20') })];
    expect(checkinDue(opts, goals, D('2026-11-07')).periodic).toBe(false);
    const due = checkinDue(opts, goals, D('2026-11-08'));
    expect(due).toMatchObject({ send: true, periodic: true });
    expect(due.deadlines.size).toBe(0);
  });

  it('deadline reminders are per goal, even with check-ins off', () => {
    const goals = [goal('a', 'instagram', { by: D('2026-12-05') }), goal('b', 'threads', { by: D('2027-06-01') })];
    const due = checkinDue({ ...opts, cadence: 'off' }, goals, D('2026-12-01'));
    expect(due).toMatchObject({ send: true, periodic: false });
    expect([...due.deadlines]).toEqual([['a', 4]]);
  });

  it('a reminded goal or reminders turned off send no deadline line', () => {
    expect(deadlineDays(goal('a', 'instagram', { by: D('2026-12-05'), deadlineRemindedAt: D('2026-11-29') }), true, D('2026-12-01'))).toBeNull();
    expect(deadlineDays(goal('a', 'instagram', { by: D('2026-12-05') }), false, D('2026-12-01'))).toBeNull();
  });
});
