import { describe, it, expect } from 'vitest';
import { renewalDue, type RenewalProfile } from './renewalReminders';

const D = (s: string) => new Date(`${s}T12:00:00Z`);
const base: RenewalProfile = { subscriptionStatus: 'active', subscriptionInterval: 'year', currentPeriodEnd: D('2027-12-01'), subscriptionStartedAt: D('2026-12-01'), renewalReminderKey: null };

describe('renewalDue, yearly', () => {
  it('is due 15 to 30 days before renewal, once per period', () => {
    expect(renewalDue(base, D('2027-10-31'))).toBeNull(); // 31 days left
    const due = renewalDue(base, D('2027-11-01'));
    expect(due).toMatchObject({ kind: 'year', interval: 'year', key: 'year:2027-12-01' });
    expect(renewalDue(base, D('2027-11-16'))).not.toBeNull(); // 15 days left
    expect(renewalDue(base, D('2027-11-17'))).toBeNull(); // too late
    expect(renewalDue({ ...base, renewalReminderKey: 'year:2027-12-01' }, D('2027-11-05'))).toBeNull();
    // Next period gets its own reminder.
    expect(renewalDue({ ...base, currentPeriodEnd: D('2028-12-01'), renewalReminderKey: 'year:2027-12-01' }, D('2028-11-05'))).toMatchObject({ key: 'year:2028-12-01' });
  });

  it('skips members who are not active', () => {
    expect(renewalDue({ ...base, subscriptionStatus: 'grace' }, D('2027-11-05'))).toBeNull();
    expect(renewalDue({ ...base, currentPeriodEnd: null }, D('2027-11-05'))).toBeNull();
  });
});

describe('renewalDue, monthly (annual reminder)', () => {
  const m: RenewalProfile = { ...base, subscriptionInterval: 'month', subscriptionStartedAt: D('2026-12-01'), currentPeriodEnd: D('2027-11-20') };
  it('is due in the 30 days before each anniversary, once a year', () => {
    expect(renewalDue(m, D('2027-06-01'))).toBeNull();
    expect(renewalDue(m, D('2027-11-10'))).toMatchObject({ kind: 'annual', interval: 'month', key: 'anniv:1', renewsOn: D('2027-11-20') });
    expect(renewalDue({ ...m, renewalReminderKey: 'anniv:1' }, D('2027-11-20'))).toBeNull();
    expect(renewalDue({ ...m, renewalReminderKey: 'anniv:1', currentPeriodEnd: D('2028-11-20') }, D('2028-11-15'))).toMatchObject({ key: 'anniv:2' });
  });
  it('needs a start date', () => {
    expect(renewalDue({ ...m, subscriptionStartedAt: null }, D('2027-11-10'))).toBeNull();
  });
});
