// When each address gets its "your 3-month wrap is ready" email. Quarters are
// per address, counted from the day it opted in (not calendar quarters):
//
//   opted in on Aug 10 -> Nov 10, Feb 10, May 10, ...
//
// The series stops on its own when nobody opens it: after two wraps in a row
// with no click on any reminder or wrap link since the previous one.
export const WRAP_EVERY_MONTHS = 3;
// A monthly reminder due within this many days of a wrap is pushed back, so
// nobody gets two of our emails in the same fortnight.
export const REMINDER_GAP_DAYS = 14;
const DAY_MS = 24 * 60 * 60 * 1000;

export function addMonths(d: Date, months: number): Date {
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth() + months;
  const last = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  return new Date(Date.UTC(y, m, Math.min(d.getUTCDate(), last), d.getUTCHours(), d.getUTCMinutes()));
}

// The first quarter anniversary of `anchor` strictly after `now`.
export function nextWrapAt(anchor: Date, now: Date): Date {
  let k = Math.max(1, Math.floor(((now.getUTCFullYear() - anchor.getUTCFullYear()) * 12 + now.getUTCMonth() - anchor.getUTCMonth()) / WRAP_EVERY_MONTHS));
  let at = addMonths(anchor, k * WRAP_EVERY_MONTHS);
  while (at.getTime() <= now.getTime()) at = addMonths(anchor, ++k * WRAP_EVERY_MONTHS);
  return at;
}

export function nextWrapAfterSend(opts: {
  anchor: Date; now: Date; sentCount: number; engagedAt: Date | null; previousSentAt: Date | null;
}): Date | null {
  const { anchor, now, sentCount, engagedAt, previousSentAt } = opts;
  const engagedSincePrevious = engagedAt !== null && (previousSentAt === null || engagedAt.getTime() > previousSentAt.getTime());
  if (sentCount >= 2 && !engagedSincePrevious) return null;
  return nextWrapAt(anchor, now);
}

// Where to move a reminder that would land too close to a wrap just sent.
export function reminderAfterWrap(reminderNextAt: Date | null, now: Date): Date | null {
  if (!reminderNextAt) return null;
  const min = new Date(now.getTime() + REMINDER_GAP_DAYS * DAY_MS);
  return reminderNextAt.getTime() < min.getTime() ? min : reminderNextAt;
}
