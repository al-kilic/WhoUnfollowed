import 'server-only';
import { and, eq, gt, inArray, isNull, ne, or, sql } from 'drizzle-orm';
import { aiDigestSchema, type AiDigest } from '@ig-tracker/core';
import { db } from '@/lib/db/index';
import { aiMemoryEvents, aiNotes, aiProfiles, aiSignals } from '@/lib/db/schema';
import { runAiAction } from './run';
import { baseRules, type AiLocale } from './prompts';
import { loadNotes, tombstonesOf } from './notes';
import { renderNote } from './retrieve';
import type { Note } from './noteMath';
import { DIGEST_MIN_CHANGES, planDigest, shouldDigest } from './digestMath';

// Memory v2 (phase 2E): the coach's tidy-up pass over the member's notes.
// At most once per new export (ai_profiles.digest_for_export), only when at
// least DIGEST_MIN_CHANGES notes or signals changed since the last pass, on
// the fast model with no credits (the `memory` action), inside the spend caps
// and the usage log like every other call. Never touches pinned or member notes.

const SHAPE = '{"merge":[{"ids":["a1b2c3","d4e5f6"],"text":"one line"}],"archive":["a1b2c3"],"importance":[{"id":"a1b2c3","importance":4}],"add":[{"type":"like","text":"one line","tags":["format:reel"]}],"rollup":[{"ids":["a1b2c3","d4e5f6","f7a8b9"],"text":"one line"}]}';
const TASK = [
  'Tidy up what you know about this member. Their notes are below, one per line: [id] type · tags · note.',
  '- merge: notes that say the same thing, as one clearer line (at most 5 merges).',
  '- archive: notes that are no longer true or useful.',
  '- importance: 1 to 5, how much a note should shape your next answers.',
  '- add: at most 3 new notes only if two or more notes together clearly show something new.',
  '- rollup: from the older notes only (faded or archived), groups of 3 or more about the same thing, as one line that keeps what is still useful (at most 3).',
  'Notes marked (pinned) or (theirs) are the member\'s: leave them out of every list.',
  'Return empty lists when nothing needs to change. Never use people\'s names or @handles.',
].join('\n');

export const MOCK_DIGEST: AiDigest = { merge: [], archive: [], importance: [], add: [], rollup: [] };

// Archived coach notes not yet rolled up, oldest first (at most 40), for 3C.
async function olderNotes(userId: string): Promise<Note[]> {
  const rows = await db.select().from(aiNotes)
    .where(and(eq(aiNotes.userId, userId), eq(aiNotes.status, 'archived'), isNull(aiNotes.supersededBy), ne(aiNotes.origin, 'user'), ne(aiNotes.type, 'rollup'), eq(aiNotes.pinned, false)))
    .orderBy(aiNotes.createdAt).limit(40);
  return rows as Note[];
}

// Notes added or confirmed, plus signals, since the last pass.
async function changesSince(userId: string, since: Date | null): Promise<number> {
  const after = since ?? new Date(0);
  const [notes, signals] = await Promise.all([
    db.select({ n: sql<number>`count(*)::int` }).from(aiNotes).where(and(eq(aiNotes.userId, userId), or(gt(aiNotes.createdAt, after), gt(aiNotes.lastConfirmedAt, after)))),
    db.select({ n: sql<number>`count(*)::int` }).from(aiSignals).where(and(eq(aiSignals.userId, userId), gt(aiSignals.createdAt, after))),
  ]);
  return (notes[0]?.n ?? 0) + (signals[0]?.n ?? 0);
}

export type DigestOutcome = 'skipped' | 'done' | 'failed';

export async function runDigest(userId: string, exportKey: string, locale: AiLocale = 'en'): Promise<DigestOutcome> {
  const profile = await db.query.aiProfiles.findFirst({ where: eq(aiProfiles.userId, userId) });
  if (!profile) return 'skipped';
  const changes = await changesSince(userId, profile.digestAt ?? null);
  if (!shouldDigest({ lastExport: profile.digestForExport ?? null, exportKey, changes })) return 'skipped';
  // Claim this export first, so two uploads at once can't both run the pass.
  const claimed = await db.update(aiProfiles).set({ digestForExport: exportKey })
    .where(and(eq(aiProfiles.userId, userId), or(isNull(aiProfiles.digestForExport), ne(aiProfiles.digestForExport, exportKey))))
    .returning({ userId: aiProfiles.userId });
  if (!claimed.length) return 'skipped';

  const [notes, tombstones, older] = await Promise.all([loadNotes(userId), tombstonesOf(userId), olderNotes(userId)]);
  const lines = notes.map((n) => `${renderNote(n)}${n.pinned ? ' (pinned)' : n.origin === 'user' ? ' (theirs)' : n.status === 'faded' ? ' (faded)' : ''}`);
  if (lines.length < DIGEST_MIN_CHANGES) return 'skipped';
  const oldLines = older.length ? `\n\n# Older notes (archived)\n${older.map(renderNote).join('\n')}` : '';
  const res = await runAiAction({ userId, action: 'memory', system: baseRules(locale), user: `# Notes\n${lines.join('\n')}${oldLines}\n\n# Task\n${TASK}\n\n# JSON shape\n${SHAPE}`, schema: aiDigestSchema, mock: MOCK_DIGEST });
  if (!res.ok) return 'failed';
  const plan = planDigest(res.data, notes, tombstones, older);
  const now = new Date();
  await db.transaction(async (tx) => {
    for (const ins of plan.insert) {
      const { mergeOf, ...n } = ins;
      const [row] = await tx.insert(aiNotes).values({
        userId, type: n.type, body: n.body, examples: '[]', tags: n.tags ?? [], source: n.source, origin: n.origin, confidence: n.confidence, importance: n.importance ?? 3,
      }).returning({ id: aiNotes.id });
      if (mergeOf.length && row) {
        await tx.update(aiNotes).set({ status: 'archived', supersededBy: row.id, updatedAt: now })
          .where(and(eq(aiNotes.userId, userId), inArray(aiNotes.id, mergeOf), eq(aiNotes.pinned, false), ne(aiNotes.origin, 'user')));
      }
    }
    if (plan.archive.length) {
      await tx.update(aiNotes).set({ status: 'archived', updatedAt: now })
        .where(and(eq(aiNotes.userId, userId), inArray(aiNotes.id, plan.archive), eq(aiNotes.pinned, false), ne(aiNotes.origin, 'user')));
    }
    for (const r of plan.importance) {
      await tx.update(aiNotes).set({ importance: r.importance, updatedAt: now })
        .where(and(eq(aiNotes.userId, userId), eq(aiNotes.id, r.id), eq(aiNotes.pinned, false), ne(aiNotes.origin, 'user')));
    }
    await tx.update(aiProfiles).set({ digestAt: now }).where(eq(aiProfiles.userId, userId));
    await tx.insert(aiMemoryEvents).values({ userId, kind: 'digest', summary: `${plan.insert.length} added, ${plan.archive.length} archived` });
  });
  return 'done';
}
