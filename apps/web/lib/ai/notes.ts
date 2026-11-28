import 'server-only';
import { and, eq, inArray, isNull, ne, sql } from 'drizzle-orm';
import type { AiMemoryOps } from '@ig-tracker/core';
import { db } from '@/lib/db/index';
import { aiMemory, aiMemoryEvents, aiNoteTombstones, aiNotes, aiProfiles } from '@/lib/db/schema';
import { backfillNotes, nextStatus, noteHash, planOps, type NewNote, type Note } from './noteMath';

// Memory v2 (phase 2A): coach notes in the database. The rules live in
// noteMath.ts (pure); this file only reads and writes. Spec sections 2 and 3.

const toRow = (userId: string, n: NewNote) => ({
  userId,
  type: n.type,
  body: n.body,
  examples: JSON.stringify(n.examples ?? []),
  tags: n.tags ?? [],
  source: n.source,
  origin: n.origin,
  confidence: n.confidence,
  importance: n.importance ?? 3,
  pinned: n.pinned ?? false,
  status: n.status ?? 'active',
  contradictsId: n.contradictsId ?? null,
  ...(n.createdAt ? { createdAt: n.createdAt, lastConfirmedAt: n.createdAt } : {}),
});

// The first time a member's notes are read: copy the coach lines of memory.md
// into notes. Runs once per member (the flag is set in the same transaction).
export async function ensureBackfill(userId: string): Promise<number> {
  return db.transaction(async (tx) => {
    const claimed = await tx.update(aiProfiles).set({ memoryV2At: new Date() })
      .where(and(eq(aiProfiles.userId, userId), isNull(aiProfiles.memoryV2At)))
      .returning({ userId: aiProfiles.userId });
    if (!claimed.length) return 0;
    const mem = await tx.query.aiMemory.findFirst({ where: eq(aiMemory.userId, userId) });
    const fresh = backfillNotes(mem?.content ?? '');
    if (fresh.length) {
      await tx.insert(aiNotes).values(fresh.map((n) => toRow(userId, n)));
      await tx.insert(aiMemoryEvents).values({ userId, kind: 'migrate', summary: `${fresh.length} notes from memory.md` });
    }
    return fresh.length;
  });
}

// Every note the coach may use (archived ones stay in the table, unused).
// Fading is applied here, lazily, so no background job is needed.
export async function loadNotes(userId: string, now: Date = new Date()): Promise<Note[]> {
  await ensureBackfill(userId);
  const rows = await db.select().from(aiNotes).where(and(eq(aiNotes.userId, userId), ne(aiNotes.status, 'archived')));
  const changes = rows.map((r) => ({ r, next: nextStatus(r, now) })).filter((x) => x.next !== x.r.status);
  for (const { r, next } of changes) {
    await db.update(aiNotes).set({ status: next, updatedAt: now }).where(and(eq(aiNotes.userId, userId), eq(aiNotes.id, r.id)));
    r.status = next;
  }
  return rows.filter((r) => r.status !== 'archived');
}

export async function tombstonesOf(userId: string): Promise<Set<string>> {
  const rows = await db.select({ hash: aiNoteTombstones.hash }).from(aiNoteTombstones).where(eq(aiNoteTombstones.userId, userId));
  return new Set(rows.map((r) => r.hash));
}

// Applies what the coach returned with an answer. Returns the texts of the
// notes actually added, for "Added to memory".
export async function applyMemoryOps(userId: string, input: { ops: AiMemoryOps; legacy: string[]; source: string; sourceRef?: string | null; notes?: Note[] }, now: Date = new Date()): Promise<string[]> {
  if (!input.ops.add.length && !input.ops.confirm.length && !input.ops.contradict.length && !input.ops.corrected && !input.legacy.length) return [];
  const [notes, tombstones] = await Promise.all([input.notes ?? loadNotes(userId, now), tombstonesOf(userId)]);
  const plan = planOps({ ops: input.ops, legacy: input.legacy, notes, tombstones, source: input.source });
  return db.transaction(async (tx) => {
    const inserted = plan.insert.length
      ? await tx.insert(aiNotes).values(plan.insert.map((n) => ({ ...toRow(userId, n), sourceRef: input.sourceRef ?? null }))).returning({ id: aiNotes.id, body: aiNotes.body })
      : [];
    if (plan.confirm.length) {
      await tx.update(aiNotes).set({ evidenceCount: sql`${aiNotes.evidenceCount} + 1`, lastConfirmedAt: now, status: sql`case when ${aiNotes.status} = 'faded' then 'active' else ${aiNotes.status} end`, updatedAt: now })
        .where(and(eq(aiNotes.userId, userId), inArray(aiNotes.id, plan.confirm)));
    }
    if (plan.dispute.length) {
      await tx.update(aiNotes).set({ status: 'disputed', updatedAt: now }).where(and(eq(aiNotes.userId, userId), inArray(aiNotes.id, plan.dispute), eq(aiNotes.pinned, false), ne(aiNotes.origin, 'user')));
    }
    for (const s of plan.supersede) {
      const by = inserted[s.by];
      if (by) await tx.update(aiNotes).set({ status: 'archived', supersededBy: by.id, updatedAt: now }).where(and(eq(aiNotes.userId, userId), eq(aiNotes.id, s.id), eq(aiNotes.pinned, false)));
    }
    if (inserted.length) await tx.insert(aiMemoryEvents).values(inserted.map((n) => ({ userId, kind: 'ai_add', summary: n.body })));
    return inserted.map((n) => n.body);
  });
}

// Adds a note or, if the same idea is already there, confirms it. Used by the
// signal rules. Tombstoned ideas are skipped.
export async function upsertNote(userId: string, n: NewNote, now: Date = new Date()): Promise<'added' | 'confirmed' | 'skipped'> {
  const h = noteHash(n.body);
  if ((await tombstonesOf(userId)).has(h)) return 'skipped';
  const all = await db.select({ id: aiNotes.id, body: aiNotes.body }).from(aiNotes).where(eq(aiNotes.userId, userId));
  const dup = all.find((r) => noteHash(r.body) === h);
  if (dup) {
    await db.update(aiNotes).set({ evidenceCount: sql`${aiNotes.evidenceCount} + 1`, lastConfirmedAt: now, examples: JSON.stringify(n.examples ?? []), updatedAt: now })
      .where(and(eq(aiNotes.userId, userId), eq(aiNotes.id, dup.id)));
    return 'confirmed';
  }
  await db.insert(aiNotes).values(toRow(userId, n));
  return 'added';
}

// "Forget": deletes the note and keeps a hash so it is never learned again.
export async function forgetNote(userId: string, id: string): Promise<boolean> {
  return db.transaction(async (tx) => {
    const gone = await tx.delete(aiNotes).where(and(eq(aiNotes.userId, userId), eq(aiNotes.id, id))).returning({ body: aiNotes.body });
    if (!gone.length) return false;
    await tx.insert(aiNoteTombstones).values({ userId, hash: noteHash(gone[0]!.body) }).onConflictDoNothing();
    await tx.insert(aiMemoryEvents).values({ userId, kind: 'forget', summary: null });
    return true;
  });
}

export async function setPinned(userId: string, id: string, pinned: boolean): Promise<boolean> {
  const r = await db.update(aiNotes).set({ pinned, status: 'active', lastConfirmedAt: new Date(), updatedAt: new Date() }).where(and(eq(aiNotes.userId, userId), eq(aiNotes.id, id))).returning({ id: aiNotes.id });
  return r.length > 0;
}

// The member rewrote a note: it becomes theirs, and the coach can't change it.
export async function editNote(userId: string, id: string, body: string): Promise<boolean> {
  const r = await db.update(aiNotes).set({ body: body.slice(0, 240), origin: 'user', confidence: 1, status: 'active', lastConfirmedAt: new Date(), updatedAt: new Date() })
    .where(and(eq(aiNotes.userId, userId), eq(aiNotes.id, id))).returning({ id: aiNotes.id });
  return r.length > 0;
}

export async function markUsed(userId: string, ids: string[]): Promise<void> {
  if (!ids.length) return;
  await db.update(aiNotes).set({ lastUsedAt: new Date() }).where(and(eq(aiNotes.userId, userId), inArray(aiNotes.id, ids)));
}

// Two "not my voice" thumbs in a week: trust the voice notes a little less.
export async function lowerVoiceConfidence(userId: string): Promise<void> {
  await db.update(aiNotes).set({ confidence: sql`greatest(0.2, ${aiNotes.confidence} - 0.2)`, updatedAt: new Date() })
    .where(and(eq(aiNotes.userId, userId), eq(aiNotes.type, 'voice'), eq(aiNotes.pinned, false), ne(aiNotes.origin, 'user')));
}
