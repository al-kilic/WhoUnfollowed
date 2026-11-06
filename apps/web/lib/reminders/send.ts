import 'server-only';
import { eq } from 'drizzle-orm';
import { hasLocale } from 'next-intl';
import { db } from '@/lib/db/index';
import { emailSubscribers } from '@/lib/db/schema';
import { routing, type AppLocale } from '@/i18n/routing';
import { sendEmail } from '@/lib/email/send';
import { reminderEmail, reminderHeaders } from '@/lib/email/reminderTemplates';
import { dueReminders, newToken } from './store';
import { nextReminderAfterSend } from './schedule';

// Resend's free plan allows 100 emails a day, shared with every other email the
// site sends, so reminders take at most this many per daily run by default.
// Whatever is left over simply goes out the next day, oldest first.
const DEFAULT_DAILY_CAP = 80;

export function reminderDailyCap(): number {
  const n = Number(process.env.REMINDER_DAILY_CAP);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : DEFAULT_DAILY_CAP;
}

// Sends every reminder that's due, then schedules the next one (or stops the
// series, see schedule.ts). Runs from the daily cron.
export async function sendDueReminders(now: Date = new Date(), cap: number = reminderDailyCap()): Promise<{ sent: number; failed: number }> {
  const due = await dueReminders(now, cap);
  let sent = 0;
  let failed = 0;

  for (const row of due) {
    const locale: AppLocale = hasLocale(routing.locales, row.locale) ? row.locale : routing.defaultLocale;
    const token = row.token ?? newToken();
    const { subject, html, text } = reminderEmail({ sentCount: row.reminderSentCount, token, locale });
    const res = await sendEmail({ to: row.email, subject, html, text, headers: reminderHeaders(token, locale) });

    if (!res.ok) {
      // Leave it due; it's retried on the next run.
      console.error('[reminders] send failed:', res.error);
      failed++;
      continue;
    }

    const sentCount = row.reminderSentCount + 1;
    await db
      .update(emailSubscribers)
      .set({
        token,
        reminderSentCount: sentCount,
        reminderLastSentAt: now,
        reminderNextAt: nextReminderAfterSend({ sentCount, now, engagedAt: row.reminderEngagedAt }),
      })
      .where(eq(emailSubscribers.id, row.id));
    sent++;
  }

  return { sent, failed };
}
