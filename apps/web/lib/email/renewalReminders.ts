// Which Pro AI members are due a renewal reminder today (pure, tested).
//
// - Yearly plans: one reminder per period, 15 to 30 days before it renews
//   (California asks for 15 to 45 days; 30 gives the cron room to catch up).
// - Monthly plans: one note a year, in the 30 days before each anniversary of
//   the start date (California's annual reminder).
// The key stored on the profile (renewalReminderKey) makes each one go out once.

const DAY = 86_400_000;
export const YEAR_REMIND_MAX_DAYS = 30;
export const YEAR_REMIND_MIN_DAYS = 15;
export const ANNIV_REMIND_DAYS = 30;

export interface RenewalProfile {
  subscriptionStatus: string | null;
  subscriptionInterval: string | null;
  currentPeriodEnd: Date | null;
  subscriptionStartedAt: Date | null;
  renewalReminderKey: string | null;
}

export type RenewalDue = { kind: 'year' | 'annual'; interval: 'month' | 'year'; key: string; renewsOn: Date };

function addYears(d: Date, n: number): Date {
  const x = new Date(d);
  x.setUTCFullYear(x.getUTCFullYear() + n);
  return x;
}

export function renewalDue(p: RenewalProfile, now: Date): RenewalDue | null {
  if (p.subscriptionStatus !== 'active' || !p.currentPeriodEnd) return null;
  if (p.subscriptionInterval === 'year') {
    const daysLeft = (p.currentPeriodEnd.getTime() - now.getTime()) / DAY;
    if (daysLeft < YEAR_REMIND_MIN_DAYS || daysLeft > YEAR_REMIND_MAX_DAYS) return null;
    const key = `year:${p.currentPeriodEnd.toISOString().slice(0, 10)}`;
    return p.renewalReminderKey === key ? null : { kind: 'year', interval: 'year', key, renewsOn: p.currentPeriodEnd };
  }
  if (p.subscriptionInterval === 'month' && p.subscriptionStartedAt) {
    // The next anniversary on or after today (first one is one year in).
    let n = 1;
    while (addYears(p.subscriptionStartedAt, n).getTime() < now.getTime()) n++;
    const anniv = addYears(p.subscriptionStartedAt, n);
    if (anniv.getTime() - now.getTime() > ANNIV_REMIND_DAYS * DAY) return null;
    const key = `anniv:${n}`;
    return p.renewalReminderKey === key ? null : { kind: 'annual', interval: 'month', key, renewsOn: p.currentPeriodEnd };
  }
  return null;
}
