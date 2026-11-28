import 'server-only';
import { and, eq, isNull, ne, or } from 'drizzle-orm';
import { hasLocale } from 'next-intl';
import { db } from '@/lib/db/index';
import { aiProfiles, profiles, users } from '@/lib/db/schema';
import { routing, type AppLocale } from '@/i18n/routing';
import { sendEmail } from '@/lib/email/send';
import { briefEmail } from '@/lib/email/proAiTemplates';
import { listBriefDates } from '@/lib/briefs';
import { planFor } from './access';

// The weekly brief email, run from the daily cron: one email per new brief,
// only for Pro AI members who turned it on in You > Settings.

const DEFAULT_DAILY_CAP = 30;
export function briefDailyCap(): number {
  const n = Number(process.env.BRIEF_EMAIL_DAILY_CAP);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : DEFAULT_DAILY_CAP;
}

// Briefs older than this are not emailed (a member who turns it on late gets the next one).
const FRESH_DAYS = 6;

async function dueRows(now: Date) {
  const latest = (await listBriefDates())[0];
  if (!latest || now.getTime() - new Date(`${latest}T00:00:00Z`).getTime() > FRESH_DAYS * 86_400_000) return { latest: null, rows: [] };
  const rows = await db
    .select({ userId: aiProfiles.userId, email: users.email, profile: profiles })
    .from(aiProfiles)
    .innerJoin(users, eq(users.id, aiProfiles.userId))
    .leftJoin(profiles, eq(profiles.userId, aiProfiles.userId))
    .where(and(eq(aiProfiles.briefEmail, true), or(isNull(aiProfiles.briefSentFor), ne(aiProfiles.briefSentFor, latest))));
  return { latest, rows: rows.filter((r) => planFor(r.profile ?? undefined, now)) };
}

export async function countDueBriefs(now: Date = new Date()): Promise<number> {
  return (await dueRows(now)).rows.length;
}

export async function sendDueBriefs(now: Date = new Date(), cap: number): Promise<{ sent: number; failed: number }> {
  if (cap <= 0) return { sent: 0, failed: 0 };
  const { latest, rows } = await dueRows(now);
  if (!latest) return { sent: 0, failed: 0 };
  let sent = 0;
  let failed = 0;
  for (const row of rows.slice(0, cap)) {
    const locale: AppLocale = hasLocale(routing.locales, row.profile?.locale) ? row.profile.locale : routing.defaultLocale;
    const res = await sendEmail({ to: row.email, ...briefEmail({ date: latest, locale }) });
    if (!res.ok) { console.error('[briefs] send failed:', res.error); failed++; continue; }
    await db.update(aiProfiles).set({ briefSentFor: latest }).where(eq(aiProfiles.userId, row.userId));
    sent++;
  }
  return { sent, failed };
}
