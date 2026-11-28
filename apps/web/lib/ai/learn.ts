import 'server-only';
import { and, desc, eq, isNull } from 'drizzle-orm';
import { db } from '@/lib/db/index';
import { aiSignals } from '@/lib/db/schema';
import { learnFromSignals } from './learnRules';
import { lowerVoiceConfidence, upsertNote } from './notes';
import type { AiLocale } from './prompts';

// Memory v2 (phase 2B): when a member has new signals, run the fixed rules in
// learnRules.ts over their recent signals and keep what they show. Runs
// before an action builds its context, only when there is something new.
// No model call.

const WINDOW = 40;

export async function processSignals(userId: string, locale: AiLocale, now: Date = new Date()): Promise<number> {
  const fresh = await db.select({ id: aiSignals.id }).from(aiSignals).where(and(eq(aiSignals.userId, userId), isNull(aiSignals.processedAt))).limit(1);
  if (!fresh.length) return 0;
  const recent = await db.select({ kind: aiSignals.kind, action: aiSignals.action, payload: aiSignals.payload, createdAt: aiSignals.createdAt })
    .from(aiSignals).where(eq(aiSignals.userId, userId)).orderBy(desc(aiSignals.createdAt)).limit(WINDOW);
  const { proposals, lowerVoice } = learnFromSignals(recent, locale, now);
  let changed = 0;
  for (const p of proposals) if ((await upsertNote(userId, p.note, now)) !== 'skipped') changed++;
  if (lowerVoice) await lowerVoiceConfidence(userId);
  await db.update(aiSignals).set({ processedAt: now }).where(and(eq(aiSignals.userId, userId), isNull(aiSignals.processedAt)));
  return changed;
}
