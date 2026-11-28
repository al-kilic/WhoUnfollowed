import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/index';
import { profiles, users } from '@/lib/db/schema';
import { and, eq, isNotNull, isNull, lte } from 'drizzle-orm';
import { hasLocale } from 'next-intl';
import { routing, type AppLocale } from '@/i18n/routing';
import { sendEmail, isEmailConfigured, takeEmailTally } from '@/lib/email/send';
import { unlockExpiringSoonEmail, unlockExpiredEmail } from '@/lib/email/templates';
import { isAuthorizedBySecretHeader } from '@/lib/auth/secretHeader';
import { sendDueReminders, reminderDailyCap } from '@/lib/reminders/send';
import { sendDuePlannerEmails, plannerDailyCap } from '@/lib/planner/send';
import { sendDueWraps, wrapDailyCap } from '@/lib/wrap/send';
import { sendDueCheckins, countDueCheckins, checkinDailyCap } from '@/lib/ai/checkins';
import { sendDueBriefs, countDueBriefs, briefDailyCap } from '@/lib/ai/briefEmail';
import { sendDuePostingReminders, countDuePostingReminders, postingReminderDailyCap } from '@/lib/ai/postingReminder';
import { countDueReminders, countDueWraps } from '@/lib/reminders/store';
import { countDuePlans } from '@/lib/planner/store';
import { buildCronEmailReport } from '@/lib/email/cronReport';
import { runAiHealthPass } from '@/lib/ai/aiHealthLoad';
import { sendTelegramMessage } from '@/lib/telegram';
import { sendDueRenewalReminders, type RenewalPassResult } from '@/lib/email/renewalSend';

// Called daily by a server cron (e.g. `curl -X POST -H "x-cron-secret: $CRON_SECRET"
// https://yourdomain.com/api/cron/unlock-expiry`). POST-only, unlike a plain
// curl's default GET. Two things, in one pass
// over every profile with an active, dated unlock:
//
//   1. 3 days before subscriptionExpiresAt: send a renewal reminder once
//      (expiryReminderSentAt marks it sent).
//   2. The day subscriptionExpiresAt passes: send an "access ended" email once
//      (expiredEmailSentAt marks it sent).
//   2b. Pro AI renewal reminders (lib/email/renewalSend.ts): yearly plans
//      15 to 30 days before renewal, monthly plans once a year.
//   3. "Time to check again" reminder emails that are due (lib/reminders).
//   4. Unfollow planner nudges (lib/planner), with whatever is left of the
//      day's email budget after the passes above.
//      They ride on this existing daily cron so no new crontab line is needed.
//   5. 3-month wrap emails (lib/wrap), same budget rule.
//   6. Pro AI goal check-ins (lib/ai/checkins), same budget rule.
//   7. Weekly brief emails for members who turned them on (lib/ai/briefEmail), same budget rule.
//   8. A Telegram email report: sent, failed, and what the caps held back.
//      Skipped on a day with nothing sent and nothing wrong; problems go to alerts.
//   9. The AI health check (lib/ai/aiHealth.ts): spend, caching and coach
//      memory in the report, and alerts (low cache reads, spend near the cap,
//      members at their limit, cost per member, tidy-up runs, signal backlog,
//      calls without token counts). Runs first and never fails the run.
//
// subscriptionStatus itself is never flipped here — getSubscriptionStatus()
// already treats a past subscriptionExpiresAt as expired at read time, and a
// real recurring Stripe subscription (subscriptionExpiresAt null) is entirely
// out of scope for this cron.
const REMINDER_WINDOW_DAYS = 3;

// Emails this cron may send in one run across all passes (Resend free: 100/day).
const DAILY_EMAIL_BUDGET = 90;

export async function POST(request: NextRequest) {
  if (!isAuthorizedBySecretHeader(request, 'x-cron-secret', process.env.CRON_SECRET)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Without this, a misconfigured/missing RESEND_API_KEY would still mark
  // every due profile as "emailed" below (see the mark-anyway note further
  // down), silently burning the one-shot idempotency markers with nothing
  // actually sent.
  // AI health first, so it runs even when email is not set up.
  const ai = await runAiHealthPass(new Date());

  if (!isEmailConfigured()) {
    await sendTelegramMessage('🚨 <b>Email report: nothing sent today</b>\nRESEND_API_KEY is not set on the server, so the daily emails were skipped.')
      .catch(() => undefined);
    if (ai && !ai.quiet) await sendTelegramMessage(['🤖 <b>AI report</b>', ...ai.lines].join('\n'), 'reports').catch(() => undefined);
    return NextResponse.json({ expiredSent: 0, reminderSent: 0, skipped: 'email_not_configured' });
  }

  const now = new Date();
  // Emails sent outside this cron since the last run (signup codes, receipts).
  const other = takeEmailTally();
  const reminderCutoff = new Date(now.getTime() + REMINDER_WINDOW_DAYS * 24 * 60 * 60 * 1000);

  let expiredSent = 0;
  let reminderSent = 0;

  // Pass 1: unlocks that already ran out and haven't been emailed about it.
  const justExpired = await db.query.profiles.findMany({
    where: and(
      eq(profiles.subscriptionStatus, 'active'),
      isNotNull(profiles.subscriptionExpiresAt),
      lte(profiles.subscriptionExpiresAt, now),
      isNull(profiles.expiredEmailSentAt),
    ),
    columns: { userId: true, locale: true },
  });

  for (const profile of justExpired) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, profile.userId),
      columns: { email: true },
    });
    if (user) {
      const locale: AppLocale = hasLocale(routing.locales, profile.locale) ? profile.locale : routing.defaultLocale;
      const { subject, html, text } = unlockExpiredEmail({ locale });
      const sent = await sendEmail({ to: user.email, subject, html, text });
      if (!sent.ok) console.error('[cron/unlock-expiry] expired email failed:', sent.error);
    }
    // Marked sent even on a failed/missing send: this is a one-shot notice,
    // not a reliable-delivery queue, so a transient Resend error doesn't
    // retry it forever. isEmailConfigured() above rules out the "never even
    // tried" case.
    await db.update(profiles).set({ expiredEmailSentAt: now }).where(eq(profiles.userId, profile.userId));
    expiredSent++;
  }

  // Pass 2: unlocks expiring within the reminder window that haven't been
  // reminded yet (and haven't already expired, handled above).
  const expiringSoon = await db.query.profiles.findMany({
    where: and(
      eq(profiles.subscriptionStatus, 'active'),
      isNotNull(profiles.subscriptionExpiresAt),
      lte(profiles.subscriptionExpiresAt, reminderCutoff),
      isNull(profiles.expiryReminderSentAt),
      isNull(profiles.expiredEmailSentAt),
    ),
    columns: { userId: true, locale: true, subscriptionExpiresAt: true },
  });

  for (const profile of expiringSoon) {
    const expiresAt = profile.subscriptionExpiresAt;
    if (!expiresAt || expiresAt.getTime() <= now.getTime()) continue; // caught by pass 1 instead

    const user = await db.query.users.findFirst({
      where: eq(users.id, profile.userId),
      columns: { email: true },
    });
    if (user) {
      const locale: AppLocale = hasLocale(routing.locales, profile.locale) ? profile.locale : routing.defaultLocale;
      const daysLeft = Math.max(1, Math.ceil((expiresAt.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)));
      const { subject, html, text } = unlockExpiringSoonEmail({ daysLeft, expiresAt, locale });
      const sent = await sendEmail({ to: user.email, subject, html, text });
      if (!sent.ok) console.error('[cron/unlock-expiry] reminder email failed:', sent.error);
    }
    await db.update(profiles).set({ expiryReminderSentAt: now }).where(eq(profiles.userId, profile.userId));
    reminderSent++;
  }

  // Pass 2b: Pro AI renewal reminders (legal: yearly before each renewal,
  // monthly once a year). Before every nudge pass so they always get budget.
  let renewals: RenewalPassResult | { error: string };
  try {
    renewals = await sendDueRenewalReminders(now, Math.max(0, DAILY_EMAIL_BUDGET - expiredSent - reminderSent));
  } catch (err) {
    console.error('[cron/unlock-expiry] renewal reminders failed:', err);
    renewals = { error: 'renewals_failed' };
  }

  // Pass 3: reminder emails. A failure here must not hide the passes above.
  let reminders: { sent: number; failed: number } | { error: string };
  try {
    reminders = await sendDueReminders(now);
  } catch (err) {
    console.error('[cron/unlock-expiry] reminders failed:', err);
    reminders = { error: 'reminders_failed' };
  }

  // Pass 4: planner nudges. Resend's free plan is 100 a day for everything,
  // so this only uses what the passes above left (keeping a small margin for
  // signup and purchase emails later in the day).
  const usedToday = expiredSent + reminderSent + ('sent' in renewals ? renewals.sent : 0) + ('sent' in reminders ? reminders.sent : 0);
  const plannerBudget = Math.max(0, Math.min(plannerDailyCap(), DAILY_EMAIL_BUDGET - usedToday));
  let planner: { sent: number; failed: number; stopped: number } | { error: string };
  try {
    planner = await sendDuePlannerEmails(now, plannerBudget);
  } catch (err) {
    console.error('[cron/unlock-expiry] planner failed:', err);
    planner = { error: 'planner_failed' };
  }

  // Pass 5: "your 3-month wrap is ready" emails, per address. Capped, and
  // only from what is still left today; the rest stay due for tomorrow.
  const usedAfterPlanner = usedToday + ('sent' in planner ? planner.sent : 0);
  const wrapBudget = Math.max(0, Math.min(wrapDailyCap(), DAILY_EMAIL_BUDGET - usedAfterPlanner));
  let wraps: { sent: number; failed: number } | { error: string };
  try {
    wraps = await sendDueWraps(now, wrapBudget);
  } catch (err) {
    console.error('[cron/unlock-expiry] wraps failed:', err);
    wraps = { error: 'wraps_failed' };
  }

  // Pass 6: Pro AI goal check-ins (only for people who turned them on), from
  // whatever budget is left.
  const usedAfterWraps = usedAfterPlanner + ('sent' in wraps ? wraps.sent : 0);
  const checkinBudget = Math.max(0, Math.min(checkinDailyCap(), DAILY_EMAIL_BUDGET - usedAfterWraps));
  let checkins: { sent: number; failed: number } | { error: string };
  try {
    checkins = await sendDueCheckins(now, checkinBudget);
  } catch (err) {
    console.error('[cron/unlock-expiry] checkins failed:', err);
    checkins = { error: 'checkins_failed' };
  }

  // Pass 7: weekly brief emails, from whatever budget is left.
  const usedAfterCheckins = usedAfterWraps + ('sent' in checkins ? checkins.sent : 0);
  const briefBudget = Math.max(0, Math.min(briefDailyCap(), DAILY_EMAIL_BUDGET - usedAfterCheckins));
  let briefs: { sent: number; failed: number } | { error: string };
  try {
    briefs = await sendDueBriefs(now, briefBudget);
  } catch (err) {
    console.error('[cron/unlock-expiry] briefs failed:', err);
    briefs = { error: 'briefs_failed' };
  }

  // Pass 8: posting-day reminders (opt-in), from whatever budget is left.
  const usedAfterBriefs = usedAfterCheckins + ('sent' in briefs ? briefs.sent : 0);
  const postingBudget = Math.max(0, Math.min(postingReminderDailyCap(), DAILY_EMAIL_BUDGET - usedAfterBriefs));
  let posting: { sent: number; failed: number } | { error: string };
  try {
    posting = await sendDuePostingReminders(now, postingBudget);
  } catch (err) {
    console.error('[cron/unlock-expiry] posting reminders failed:', err);
    posting = { error: 'posting_failed' };
  }

  // Pass 9: the Telegram email report. Never fails the run.
  const ownTally = takeEmailTally();
  const stillDue = async (fn: (d: Date) => Promise<number>) => { try { return await fn(now); } catch { return null; } };
  const [remindersDue, plannerDue, wrapsDue, checkinsDue, briefsDue, postingDue] = await Promise.all([
    stillDue(countDueReminders), stillDue(countDuePlans), stillDue(countDueWraps), stillDue(countDueCheckins), stillDue(countDueBriefs), stillDue(countDuePostingReminders),
  ]);
  const report = buildCronEmailReport({
    date: now,
    budget: DAILY_EMAIL_BUDGET,
    expiry: { expired: expiredSent, expiringSoon: reminderSent },
    passes: {
      reminders: { result: reminders, cap: reminderDailyCap(), stillDue: remindersDue },
      planner: { result: planner, cap: plannerBudget, stillDue: plannerDue },
      wraps: { result: wraps, cap: wrapBudget, stillDue: wrapsDue },
      checkins: { result: checkins, cap: checkinBudget, stillDue: checkinsDue },
      briefs: { result: briefs, cap: briefBudget, stillDue: briefsDue },
      posting: { result: posting, cap: postingBudget, stillDue: postingDue },
    },
    other: { sent: other.sent, failed: other.failed, limited: other.limited, since: new Date(other.since) },
    limitedInRun: ownTally.limited,
    ai,
  });
  // Nothing sent and nothing wrong: stay silent. Problems go to the alerts chat.
  if (!report.quiet) {
    const notify = await sendTelegramMessage(report.text, report.alert ? 'alerts' : 'reports').catch(() => ({ ok: false as const, error: 'threw' }));
    if (!notify.ok) console.error('[cron/unlock-expiry] email report not delivered:', notify.error);
  }

  return NextResponse.json({ expiredSent, reminderSent, renewals, reminders, planner, wraps, checkins, briefs, posting, alert: report.alert });
}
