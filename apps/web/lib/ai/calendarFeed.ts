import 'server-only';
import { eq } from 'drizzle-orm';
import { hasLocale } from 'next-intl';
import { db } from '@/lib/db/index';
import { aiProfiles, profiles } from '@/lib/db/schema';
import { routing, type AppLocale } from '@/i18n/routing';
import { localizedPathname } from '@/i18n/localizedPathname';
import { getPostingEmailContent } from '@/lib/email/proAiContent';
import { planFor } from './access';
import { CALENDAR_TOKEN_RE, feedEvents, feedIcs, newCalendarToken, type FeedLabels } from './calendarFeedMath';
import { newestPlan } from './postingReminder';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://whounfollowed.co';

export const feedUrl = (token: string) => `${APP_URL}/api/calendar/${token}.ics`;

const NAMES: Record<AppLocale, { name: string; postA: (f: string) => string; open: string }> = {
  en: { name: 'WhoUnfollowed posting plan', postA: (f) => `Post a ${f}`, open: 'Open your plan in Studio:' },
  es: { name: 'Plan de publicaciones de WhoUnfollowed', postA: (f) => `Publica un ${f}`, open: 'Abre tu plan en Studio:' },
  pt: { name: 'Plano de posts do WhoUnfollowed', postA: (f) => `Poste um ${f}`, open: 'Abra seu plano no Studio:' },
};

export function feedLabels(locale: AppLocale): FeedLabels {
  return { ...NAMES[locale], formats: getPostingEmailContent(locale).formats };
}

// The member's feed URL, or null when they haven't turned it on.
export async function getCalendarToken(userId: string): Promise<string | null> {
  const row = await db.query.aiProfiles.findFirst({ where: eq(aiProfiles.userId, userId), columns: { calendarToken: true } });
  return row?.calendarToken ?? null;
}

// Creates the token, or replaces it (rotate): old links stop working at once.
export async function setCalendarToken(userId: string, now: Date = new Date()): Promise<string> {
  const token = newCalendarToken();
  await db.insert(aiProfiles).values({ userId, calendarToken: token, calendarTokenAt: now })
    .onConflictDoUpdate({ target: aiProfiles.userId, set: { calendarToken: token, calendarTokenAt: now, updatedAt: now } });
  return token;
}

export async function revokeCalendarToken(userId: string): Promise<void> {
  await db.update(aiProfiles).set({ calendarToken: null, calendarTokenAt: null, updatedAt: new Date() }).where(eq(aiProfiles.userId, userId));
}

// The calendar file for a token, or null (unknown token, or no Pro AI access).
export async function calendarFeed(token: string, now: Date = new Date()): Promise<string | null> {
  if (!CALENDAR_TOKEN_RE.test(token)) return null;
  const [row] = await db.select({ ai: aiProfiles, profile: profiles }).from(aiProfiles)
    .leftJoin(profiles, eq(profiles.userId, aiProfiles.userId))
    .where(eq(aiProfiles.calendarToken, token)).limit(1);
  if (!row) return null;
  const locale: AppLocale = hasLocale(routing.locales, row.profile?.locale) ? row.profile.locale : routing.defaultLocale;
  const labels = feedLabels(locale);
  // Plan access ended: the feed stays valid but empty, so calendars don't error.
  const plan = planFor(row.profile ?? undefined, now) ? await newestPlan(row.ai.userId).catch(() => null) : null;
  const url = `${APP_URL}${localizedPathname('/app/plan', locale)}`;
  const events = plan ? feedEvents({ planId: plan.id, createdAt: plan.createdAt, calendar: plan.calendar, bestTime: row.ai.bestTime, url, labels, now }) : [];
  return feedIcs(events, labels, now);
}
