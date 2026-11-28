import 'server-only';
import { and, desc, eq, gte, inArray, ne } from 'drizzle-orm';
import type { AiNoteOp } from '@ig-tracker/core';
import { db } from '@/lib/db/index';
import { aiContentLog, aiLearnedNotes, aiMemoryEvents, aiNotes } from '@/lib/db/schema';
import { editNote, forgetNote, loadNotes, setPinned, tombstonesOf } from './notes';
import { buildLearnedNote, weekKey, weekStart, type LearnedLine } from './learnedNote';
import { noteHash } from './noteMath';
import { scrubHandles } from './coachContext';

// Memory v2 (phase 2E): what You > Memory shows and changes, and the weekly
// learned note. Members only ever see and change their own notes.

export interface NoteView {
  id: string; type: string; body: string; examples: { text?: string; before?: string; after?: string }[]; tags: string[];
  source: string; sourceAt: string; origin: string; confidence: number; importance: number; pinned: boolean; status: string;
  createdAt: string; lastConfirmedAt: string;
}

export async function listNotes(userId: string): Promise<{ notes: NoteView[]; disputed: [string, string][] }> {
  const notes = await loadNotes(userId);
  const refs = notes.map((n) => (n as { sourceRef?: string | null }).sourceRef).filter((x): x is string => !!x);
  const logs = refs.length ? await db.select({ id: aiContentLog.id, at: aiContentLog.createdAt }).from(aiContentLog).where(and(eq(aiContentLog.userId, userId), inArray(aiContentLog.id, refs))) : [];
  const at = new Map(logs.map((l) => [l.id, l.at]));
  const examples = (s: string) => { try { const v = JSON.parse(s) as unknown; return Array.isArray(v) ? v.slice(0, 3) as NoteView['examples'] : []; } catch { return []; } };
  const view = notes.map((n) => {
    const ref = (n as { sourceRef?: string | null }).sourceRef;
    return {
      id: n.id, type: n.type, body: n.body, examples: examples(n.examples), tags: n.tags, source: n.source,
      sourceAt: (ref && at.get(ref) ? at.get(ref)! : n.createdAt).toISOString(), origin: n.origin, confidence: Math.round(n.confidence * 100) / 100,
      importance: n.importance, pinned: n.pinned, status: n.status, createdAt: n.createdAt.toISOString(), lastConfirmedAt: n.lastConfirmedAt.toISOString(),
    };
  }).sort((a, b) => Number(b.pinned) - Number(a.pinned) || a.type.localeCompare(b.type) || b.lastConfirmedAt.localeCompare(a.lastConfirmedAt));
  const ids = new Set(notes.map((n) => n.id));
  const disputed = notes.filter((n) => n.status === 'disputed' && n.contradictsId && ids.has(n.contradictsId)).map((n) => [n.contradictsId!, n.id] as [string, string]);
  return { notes: view, disputed };
}

export type NoteOpResult = { ok: true; id?: string } | { ok: false; reason: 'not_found' | 'forgotten' };

export async function applyNoteOp(userId: string, op: AiNoteOp): Promise<NoteOpResult> {
  const now = new Date();
  switch (op.op) {
    case 'pin': case 'unpin':
      return (await setPinned(userId, op.id, op.op === 'pin')) ? { ok: true } : { ok: false, reason: 'not_found' };
    case 'edit':
      return (await editNote(userId, op.id, scrubHandles(op.body))) ? { ok: true } : { ok: false, reason: 'not_found' };
    case 'forget':
      return (await forgetNote(userId, op.id)) ? { ok: true } : { ok: false, reason: 'not_found' };
    case 'keep': {
      const r = await db.update(aiNotes).set({ status: 'active', lastConfirmedAt: now, updatedAt: now })
        .where(and(eq(aiNotes.userId, userId), eq(aiNotes.id, op.id), ne(aiNotes.status, 'archived'))).returning({ id: aiNotes.id });
      return r.length ? { ok: true } : { ok: false, reason: 'not_found' };
    }
    case 'add': {
      const body = scrubHandles(op.body);
      if ((await tombstonesOf(userId)).has(noteHash(body))) return { ok: false, reason: 'forgotten' };
      const [row] = await db.insert(aiNotes).values({ userId, type: op.type, body, source: 'user', origin: 'user', confidence: 1, importance: 4, pinned: true }).returning({ id: aiNotes.id });
      await db.insert(aiMemoryEvents).values({ userId, kind: 'user_edit', summary: body });
      return { ok: true, id: row!.id };
    }
    case 'resolve': {
      if (op.id === op.keepId) return { ok: false, reason: 'not_found' };
      return db.transaction(async (tx) => {
        const both = await tx.select({ id: aiNotes.id }).from(aiNotes).where(and(eq(aiNotes.userId, userId), inArray(aiNotes.id, [op.id, op.keepId])));
        if (both.length !== 2) return { ok: false as const, reason: 'not_found' as const };
        await tx.update(aiNotes).set({ status: 'active', origin: 'user', confidence: 1, lastConfirmedAt: now, updatedAt: now }).where(and(eq(aiNotes.userId, userId), eq(aiNotes.id, op.keepId)));
        await tx.update(aiNotes).set({ status: 'archived', supersededBy: op.keepId, updatedAt: now }).where(and(eq(aiNotes.userId, userId), eq(aiNotes.id, op.id)));
        return { ok: true as const };
      });
    }
  }
}

// ── Weekly learned note ─────────────────────────────────────────────────────

export interface LearnedWeek { weekKey: string; lines: LearnedLine[]; seenAt: string | null }

// Built lazily: the first call of the week writes this week's note (when there
// is anything to say). No model call.
export async function ensureLearnedNote(userId: string, locale: 'en' | 'es' | 'pt', now: Date = new Date()): Promise<void> {
  const key = weekKey(now);
  const have = await db.query.aiLearnedNotes.findFirst({ where: and(eq(aiLearnedNotes.userId, userId), eq(aiLearnedNotes.weekKey, key)) });
  if (have) return;
  const [notes, events] = await Promise.all([
    loadNotes(userId, now),
    db.select({ kind: aiMemoryEvents.kind, createdAt: aiMemoryEvents.createdAt }).from(aiMemoryEvents).where(and(eq(aiMemoryEvents.userId, userId), gte(aiMemoryEvents.createdAt, weekStart(now)))),
  ]);
  const built = buildLearnedNote({ notes, events, now, locale });
  if (!built.lines.length) return;
  await db.insert(aiLearnedNotes).values({ userId, weekKey: key, lines: JSON.stringify(built.lines) }).onConflictDoNothing();
}

export async function listLearned(userId: string, limit = 8): Promise<LearnedWeek[]> {
  const rows = await db.select().from(aiLearnedNotes).where(eq(aiLearnedNotes.userId, userId)).orderBy(desc(aiLearnedNotes.weekKey)).limit(limit);
  return rows.map((r) => ({ weekKey: r.weekKey, lines: (() => { try { return JSON.parse(r.lines) as LearnedLine[]; } catch { return []; } })(), seenAt: r.seenAt?.toISOString() ?? null }));
}

export async function markLearnedSeen(userId: string, key: string): Promise<boolean> {
  const r = await db.update(aiLearnedNotes).set({ seenAt: new Date() }).where(and(eq(aiLearnedNotes.userId, userId), eq(aiLearnedNotes.weekKey, key))).returning({ id: aiLearnedNotes.id });
  return r.length > 0;
}
