import 'server-only';
import { eq } from 'drizzle-orm';
import { aiPrefsSchema, type AiPrefs } from '@ig-tracker/core';
import { db } from '@/lib/db/index';
import { aiProfiles } from '@/lib/db/schema';

// You > Settings > Coach: the member's defaults, kept on ai_profiles.

type Row = { defaultTone: string | null; defaultLength: string | null; postingDays: string | null; bestTime: string | null; briefEmail: boolean; postingReminder?: boolean; reminderWhen?: string | null };

export function prefsFromRow(row: Row | null | undefined): AiPrefs {
  const parsed = aiPrefsSchema.safeParse({
    tone: row?.defaultTone ?? undefined,
    length: row?.defaultLength ?? undefined,
    days: row?.postingDays ? row.postingDays.split(',').map(Number) : undefined,
    bestTime: row?.bestTime ?? null,
    briefEmail: row?.briefEmail ?? true,
    postingReminder: row?.postingReminder ?? false,
    reminderWhen: row?.reminderWhen === 'day_before' ? 'day_before' : 'day_of',
  });
  return parsed.success ? parsed.data : aiPrefsSchema.parse({});
}

export async function getPrefs(userId: string): Promise<AiPrefs> {
  const row = await db.query.aiProfiles.findFirst({ where: eq(aiProfiles.userId, userId) });
  return prefsFromRow(row);
}

export async function savePrefs(userId: string, p: AiPrefs): Promise<void> {
  const set = { defaultTone: p.tone, defaultLength: p.length, postingDays: p.days.join(','), bestTime: p.bestTime, briefEmail: p.briefEmail, postingReminder: p.postingReminder, reminderWhen: p.reminderWhen, updatedAt: new Date() };
  await db.insert(aiProfiles).values({ userId, ...set }).onConflictDoUpdate({ target: aiProfiles.userId, set });
}

const DAY = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// The line the coach sees about when the member posts. Empty when nothing is set.
export function postingLine(p: AiPrefs): string {
  const parts: string[] = [];
  if (p.days.length) parts.push(`Posts on ${p.days.map((d) => DAY[d]).join(', ')}; plans should put posts on these days`);
  if (p.bestTime) parts.push(`usual posting time ${p.bestTime}`);
  return parts.length ? `${parts.join('; ')}.` : '';
}
