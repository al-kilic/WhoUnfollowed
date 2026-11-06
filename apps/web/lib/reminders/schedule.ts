// When the next "time to check again" reminder goes out. Pure, so it's easy
// to test and reason about:
//
//   sign up             -> first reminder 14 days later
//   after reminder 1    -> second one 16 days later (day 30)
//   after reminder 2+   -> monthly, but only while the person clicked a
//                          reminder in the last 60 days; otherwise stop
//
// A reminder that nobody opens stops on its own, so the list never turns into
// mail people ignore.
const DAY_MS = 24 * 60 * 60 * 1000;

export const FIRST_REMINDER_DAYS = 14;
export const SECOND_REMINDER_DAYS = 16;
export const MONTHLY_REMINDER_DAYS = 30;
export const ENGAGED_WINDOW_DAYS = 60;

export function firstReminderAt(now: Date): Date {
  return new Date(now.getTime() + FIRST_REMINDER_DAYS * DAY_MS);
}

export function nextReminderAfterSend(opts: {
  sentCount: number;
  now: Date;
  engagedAt: Date | null;
}): Date | null {
  const { sentCount, now, engagedAt } = opts;
  if (sentCount <= 1) return new Date(now.getTime() + SECOND_REMINDER_DAYS * DAY_MS);
  const engagedRecently = engagedAt !== null && now.getTime() - engagedAt.getTime() <= ENGAGED_WINDOW_DAYS * DAY_MS;
  return engagedRecently ? new Date(now.getTime() + MONTHLY_REMINDER_DAYS * DAY_MS) : null;
}
