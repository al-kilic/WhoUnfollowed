import 'server-only';
import { and, eq, inArray, ne, or } from 'drizzle-orm';
import { hasLocale } from 'next-intl';
import { db } from '@/lib/db/index';
import { aiGoals, aiProfiles, profiles, users } from '@/lib/db/schema';
import { routing, type AppLocale } from '@/i18n/routing';
import { sendEmail } from '@/lib/email/send';
import { checkinEmail, type CheckinGoalOpts } from '@/lib/email/proAiTemplates';
import { planFor } from './access';
import { cadenceOf, followerPoints, goalTypeOf, platformOf, postPoints, postsOn, progressOf } from './goals';
import { checkinDue } from './checkinMath';

// Goal check-in emails, run from the daily cron. Only for people who turned
// check-ins or the deadline reminder on, still have Pro AI, and have at least
// one goal. Goals are per platform; one email covers all of them, once per
// period, plus a one-time reminder a week before each goal's deadline.

const DEFAULT_DAILY_CAP = 15;
export function checkinDailyCap(): number {
  const n = Number(process.env.CHECKIN_DAILY_CAP);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : DEFAULT_DAILY_CAP;
}

type GoalRow = typeof aiGoals.$inferSelect;

async function dueRows(now: Date) {
  const rows = await db
    .select({ ai: aiProfiles, email: users.email, profile: profiles })
    .from(aiProfiles)
    .innerJoin(users, eq(users.id, aiProfiles.userId))
    .leftJoin(profiles, eq(profiles.userId, aiProfiles.userId))
    .where(or(ne(aiProfiles.checkinCadence, 'off'), eq(aiProfiles.checkinDeadlineReminder, true)));
  const live = rows.filter((r) => planFor(r.profile ?? undefined, now));
  if (!live.length) return [];
  const goals = await db.select().from(aiGoals).where(inArray(aiGoals.userId, live.map((r) => r.ai.userId)));
  const byUser = new Map<string, GoalRow[]>();
  for (const g of goals) byUser.set(g.userId, [...(byUser.get(g.userId) ?? []), g]);
  return live.flatMap((r) => {
    const mine = byUser.get(r.ai.userId) ?? [];
    const due = checkinDue({ cadence: cadenceOf(r.ai.checkinCadence), weekday: r.ai.checkinWeekday, lastSentAt: r.ai.checkinLastSentAt, deadlineReminder: r.ai.checkinDeadlineReminder }, mine, now);
    return due.send ? [{ ...r, goals: mine, due }] : [];
  });
}

export async function countDueCheckins(now: Date = new Date()): Promise<number> {
  return (await dueRows(now)).length;
}

export async function sendDueCheckins(now: Date = new Date(), cap: number): Promise<{ sent: number; failed: number }> {
  if (cap <= 0) return { sent: 0, failed: 0 };
  const due = (await dueRows(now)).slice(0, cap);
  let sent = 0;
  let failed = 0;
  for (const row of due) {
    const locale: AppLocale = hasLocale(routing.locales, row.profile?.locale) ? row.profile.locale : routing.defaultLocale;
    const posts = await postPoints(row.ai.userId);
    const items: CheckinGoalOpts[] = [];
    for (const g of row.goals) {
      const platform = platformOf(g.platform);
      if (!platform) continue;
      const { progress, habit } = progressOf(g, await followerPoints(row.ai.userId, platform), postsOn(posts, platform), now);
      const type = goalTypeOf(g.type);
      const deadlineDays = row.due.deadlines.get(g.id) ?? null;
      items.push(type === 'followers' ? { platform, kind: 'followers', target: g.target, progress: progress!, deadlineDays } : { platform, kind: type, target: g.target, current: habit!.current, deadlineDays });
    }
    if (!items.length) continue;
    const { subject, html, text } = checkinEmail({ locale, goals: items });
    const res = await sendEmail({ to: row.email, subject, html, text });
    if (!res.ok) { console.error('[checkins] send failed:', res.error); failed++; continue; }
    if (row.due.periodic) await db.update(aiProfiles).set({ checkinLastSentAt: now }).where(eq(aiProfiles.userId, row.ai.userId));
    const reminded = [...row.due.deadlines.keys()];
    if (reminded.length) await db.update(aiGoals).set({ deadlineRemindedAt: now }).where(and(eq(aiGoals.userId, row.ai.userId), inArray(aiGoals.id, reminded)));
    sent++;
  }
  return { sent, failed };
}
