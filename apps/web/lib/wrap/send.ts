import 'server-only';
import { eq } from 'drizzle-orm';
import { hasLocale } from 'next-intl';
import { db } from '@/lib/db/index';
import { emailSubscribers } from '@/lib/db/schema';
import { routing, type AppLocale } from '@/i18n/routing';
import { sendEmail } from '@/lib/email/send';
import { reminderHeaders } from '@/lib/email/reminderTemplates';
import { wrapEmail } from '@/lib/email/wrapTemplates';
import { dueWraps, newToken } from '@/lib/reminders/store';
import { nextWrapAfterSend, reminderAfterWrap } from './schedule';

// Sends the "3-month wrap is ready" emails that are due, oldest first, using
// only what is left of the day's email budget. Anything over the cap stays
// due and goes out on the next run with room.
export async function sendDueWraps(now: Date = new Date(), cap: number): Promise<{ sent: number; failed: number }> {
  if (cap <= 0) return { sent: 0, failed: 0 };
  const due = await dueWraps(now, cap);
  let sent = 0;
  let failed = 0;

  for (const row of due) {
    const locale: AppLocale = hasLocale(routing.locales, row.locale) ? row.locale : routing.defaultLocale;
    const token = row.token ?? newToken();
    const { subject, html, text } = wrapEmail({ token, locale });
    const res = await sendEmail({ to: row.email, subject, html, text, headers: reminderHeaders(token, locale) });
    if (!res.ok) {
      console.error('[wrap] send failed:', res.error);
      failed++;
      continue;
    }
    const sentCount = row.wrapSentCount + 1;
    await db.update(emailSubscribers).set({
      token,
      wrapSentCount: sentCount,
      wrapLastSentAt: now,
      wrapNextAt: nextWrapAfterSend({ anchor: row.consentedAt, now, sentCount, engagedAt: row.reminderEngagedAt, previousSentAt: row.wrapLastSentAt }),
      reminderNextAt: reminderAfterWrap(row.reminderNextAt, now),
    }).where(eq(emailSubscribers.id, row.id));
    sent++;
  }
  return { sent, failed };
}
