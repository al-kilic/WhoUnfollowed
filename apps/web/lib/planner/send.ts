import 'server-only';
import { and, eq } from 'drizzle-orm';
import { hasLocale } from 'next-intl';
import { platforms, type Platform } from '@ig-tracker/core';
import { db } from '@/lib/db/index';
import { unfollowPlans } from '@/lib/db/schema';
import { routing, type AppLocale } from '@/i18n/routing';
import { sendEmail } from '@/lib/email/send';
import { plannerEmail, plannerHeaders } from '@/lib/email/plannerTemplates';
import { PLATFORM_NAME } from '@/lib/platform';
import { duePlans } from './store';
import { isStale, plannerNextAt, type PlannerCadence } from './schedule';

// Resend's free plan allows 100 emails a day, shared with everything else.
// Reminders go first in the daily cron; the planner takes what's left, up to
// this many.
const DEFAULT_DAILY_CAP = 15;

export function plannerDailyCap(): number {
  const n = Number(process.env.PLANNER_DAILY_CAP);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : DEFAULT_DAILY_CAP;
}

const asPlatform = (p: string): Platform => ((platforms as readonly string[]).includes(p) ? (p as Platform) : 'instagram');

export async function sendDuePlannerEmails(now: Date = new Date(), cap: number = plannerDailyCap()): Promise<{ sent: number; failed: number; stopped: number }> {
  if (cap <= 0) return { sent: 0, failed: 0, stopped: 0 };
  const due = await duePlans(now, cap);
  let sent = 0;
  let failed = 0;
  let stopped = 0;

  for (const { plan, email } of due) {
    const where = and(eq(unfollowPlans.userId, plan.userId), eq(unfollowPlans.platform, plan.platform));
    const cadence = plan.cadence as PlannerCadence;

    // Finished, switched off, or abandoned: stop without emailing.
    if (cadence === 'off' || plan.done >= plan.total || isStale(plan.updatedAt, now)) {
      await db.update(unfollowPlans).set({ nextAt: null }).where(where);
      stopped++;
      continue;
    }

    const locale: AppLocale = plan.locale && hasLocale(routing.locales, plan.locale) ? plan.locale : routing.defaultLocale;
    const { subject, html, text } = plannerEmail({
      app: PLATFORM_NAME[asPlatform(plan.platform)],
      total: plan.total,
      done: plan.done,
      perDay: plan.perDay,
      cadence,
      token: plan.token,
      locale,
    });
    const res = await sendEmail({ to: email, subject, html, text, headers: plannerHeaders(plan.token, locale) });
    if (!res.ok) {
      console.error('[planner] send failed:', res.error);
      failed++;
      continue; // stays due, retried tomorrow
    }
    await db.update(unfollowPlans)
      .set({ lastSentAt: now, nextAt: plannerNextAt({ cadence, total: plan.total, done: plan.done, from: now }) })
      .where(where);
    sent++;
  }
  return { sent, failed, stopped };
}
