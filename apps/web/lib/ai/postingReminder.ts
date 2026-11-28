import 'server-only';
import { and, eq, isNull, ne, or } from 'drizzle-orm';
import { hasLocale } from 'next-intl';
import { aiPlanCalendarSchema, aiPlanSchema } from '@ig-tracker/core';
import { db } from '@/lib/db/index';
import { aiProfiles, profiles, users } from '@/lib/db/schema';
import { routing, type AppLocale } from '@/i18n/routing';
import { sendEmail } from '@/lib/email/send';
import { postingEmail } from '@/lib/email/proAiTemplates';
import { planFor } from './access';
import { calendarFromPlan } from './planCalendar';
import { prefsFromRow } from './prefs';
import { postingDue, utcDay, type PostingDue } from './postingDue';
import { recentContent } from './store';

// The posting-day reminder email, run from the daily cron: at most one a day,
// only for Pro AI members who turned it on in You > Settings, and only on a
// day their newest plan has a post (or one of their posting days).

const DEFAULT_DAILY_CAP = 50;
export function postingReminderDailyCap(): number {
  const n = Number(process.env.POSTING_REMINDER_DAILY_CAP);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : DEFAULT_DAILY_CAP;
}

// The newest plan's calendar: the member's edits if saved, else the plan as made.
export async function newestPlan(userId: string) {
  const [row] = await recentContent(userId, 'plan', 1);
  if (!row) return null;
  const parsed = aiPlanSchema.safeParse(JSON.parse(row.output));
  if (!parsed.success) return null;
  const saved = row.results ? aiPlanCalendarSchema.shape.items.safeParse((JSON.parse(row.results) as { calendar?: unknown }).calendar) : null;
  return { id: row.id, createdAt: row.createdAt, calendar: saved?.success ? saved.data : calendarFromPlan(parsed.data) };
}

export async function duePostingReminders(now: Date) {
  const today = utcDay(now);
  const rows = await db
    .select({ userId: aiProfiles.userId, email: users.email, profile: profiles, ai: aiProfiles })
    .from(aiProfiles)
    .innerJoin(users, eq(users.id, aiProfiles.userId))
    .leftJoin(profiles, eq(profiles.userId, aiProfiles.userId))
    .where(and(eq(aiProfiles.postingReminder, true), or(isNull(aiProfiles.postingRemindedFor), ne(aiProfiles.postingRemindedFor, today))));
  const out: { userId: string; email: string; locale: AppLocale; due: PostingDue; tomorrow: boolean }[] = [];
  for (const r of rows) {
    if (!planFor(r.profile ?? undefined, now)) continue;
    const prefs = prefsFromRow(r.ai);
    const tomorrow = prefs.reminderWhen === 'day_before';
    const due = postingDue({ now, days: prefs.days, plan: await newestPlan(r.userId).catch(() => null), ahead: tomorrow ? 1 : 0 });
    if (!due) continue;
    out.push({ userId: r.userId, email: r.email, locale: hasLocale(routing.locales, r.profile?.locale) ? r.profile.locale : routing.defaultLocale, due, tomorrow });
  }
  return { today, rows: out };
}

export async function countDuePostingReminders(now: Date = new Date()): Promise<number> {
  return (await duePostingReminders(now)).rows.length;
}

export async function sendDuePostingReminders(now: Date = new Date(), cap: number): Promise<{ sent: number; failed: number }> {
  if (cap <= 0) return { sent: 0, failed: 0 };
  const { today, rows } = await duePostingReminders(now);
  let sent = 0;
  let failed = 0;
  for (const row of rows.slice(0, cap)) {
    const res = await sendEmail({ to: row.email, ...postingEmail({ locale: row.locale, post: row.due.post, tomorrow: row.tomorrow }) });
    if (!res.ok) { console.error('[posting-reminder] send failed:', res.error); failed++; continue; }
    await db.update(aiProfiles).set({ postingRemindedFor: today }).where(eq(aiProfiles.userId, row.userId));
    sent++;
  }
  return { sent, failed };
}
