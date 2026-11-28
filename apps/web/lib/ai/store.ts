import 'server-only';
import { and, desc, eq, gte, inArray, sql } from 'drizzle-orm';
import { aiPlanCalendarSchema, aiPlanSchema, type AiOnboardingInput, type AiPlanCalendarItem, type ExportStats } from '@ig-tracker/core';
import { calendarFromPlan } from './planCalendar';
import { db } from '@/lib/db/index';
import { aiBlindspots, aiContentLog, aiContentStats, aiLearnedNotes, aiMemory, aiMemoryEvents, aiMoments, aiNoteTombstones, aiNotes, aiProfiles, aiSignals, aiStatsLedger, aiVoice, aiGoals } from '@/lib/db/schema';
import { appendCoachNotes, buildInitialMemory, enforceCap, type MemoryLang } from './memoryText';
import { MEMORY_MAX_CHARS } from './config';

const today = (now: Date = new Date()) => now.toISOString().slice(0, 10);

// ── Profile + onboarding ────────────────────────────────────────────────────

export async function getAiProfile(userId: string) {
  return db.query.aiProfiles.findFirst({ where: eq(aiProfiles.userId, userId) });
}

// Saves onboarding answers. Starts memory only the first time; later runs
// update the profile and leave memory alone (the user edits it directly).
export async function saveOnboarding(userId: string, input: AiOnboardingInput, lang: MemoryLang = 'en'): Promise<void> {
  const now = new Date();
  await db.transaction(async (tx) => {
    await tx.insert(aiProfiles)
      .values({ userId, accountType: input.accountType, niche: input.niche, goal: input.goal, onboardedAt: now, updatedAt: now })
      .onConflictDoUpdate({ target: aiProfiles.userId, set: { accountType: input.accountType, niche: input.niche, goal: input.goal, updatedAt: now } });
    const created = await tx.insert(aiMemory)
      .values({ userId, content: buildInitialMemory(input, today(now), lang), updatedAt: now })
      .onConflictDoNothing()
      .returning({ userId: aiMemory.userId });
    if (created.length) await tx.insert(aiMemoryEvents).values({ userId, kind: 'ai_add', summary: 'Memory started from onboarding' });
  });
}

// ── Memory ──────────────────────────────────────────────────────────────────

export async function getMemory(userId: string): Promise<{ content: string; version: number } | null> {
  const row = await db.query.aiMemory.findFirst({ where: eq(aiMemory.userId, userId) });
  return row ? { content: row.content, version: row.version } : null;
}

export type SaveMemoryResult = { ok: true; version: number } | { ok: false; reason: 'conflict' | 'too_long' };

// The user's own edit. expectedVersion stops an edit from silently overwriting
// a coach note added in the meantime: the page reloads and shows both.
export async function saveMemoryByUser(userId: string, content: string, expectedVersion: number): Promise<SaveMemoryResult> {
  if (content.length > MEMORY_MAX_CHARS) return { ok: false, reason: 'too_long' };
  const updated = await db.update(aiMemory)
    .set({ content, version: sql`${aiMemory.version} + 1`, updatedAt: new Date() })
    .where(and(eq(aiMemory.userId, userId), eq(aiMemory.version, expectedVersion)))
    .returning({ version: aiMemory.version });
  if (!updated.length) return { ok: false, reason: 'conflict' };
  await db.insert(aiMemoryEvents).values({ userId, kind: 'user_edit', summary: null });
  return { ok: true, version: updated[0]!.version };
}

// Coach notes from an AI answer. Returns the lines actually added, so the UI
// can show "Added to memory".
export async function addCoachNotes(userId: string, notes: readonly string[]): Promise<string[]> {
  if (!notes.length) return [];
  return db.transaction(async (tx) => {
    const row = await tx.query.aiMemory.findFirst({ where: eq(aiMemory.userId, userId) });
    if (!row) return [];
    const { content, added } = appendCoachNotes(row.content, notes, today());
    if (!added.length) return [];
    await tx.update(aiMemory).set({ content: enforceCap(content), version: row.version + 1, updatedAt: new Date() }).where(eq(aiMemory.userId, userId));
    await tx.insert(aiMemoryEvents).values(added.map((summary) => ({ userId, kind: 'ai_add', summary })));
    return added;
  });
}

// "Delete my memory": clears memory, numbers and history, keeps the plan and
// credits. Onboarding can be done again to start fresh.
export async function wipeAiData(userId: string): Promise<void> {
  await db.transaction(async (tx) => {
    await tx.delete(aiMemory).where(eq(aiMemory.userId, userId));
    await tx.delete(aiMemoryEvents).where(eq(aiMemoryEvents.userId, userId));
    await tx.delete(aiStatsLedger).where(eq(aiStatsLedger.userId, userId));
    await tx.delete(aiContentLog).where(eq(aiContentLog.userId, userId));
    await tx.delete(aiSignals).where(eq(aiSignals.userId, userId));
    await tx.delete(aiNotes).where(eq(aiNotes.userId, userId));
    await tx.delete(aiNoteTombstones).where(eq(aiNoteTombstones.userId, userId));
    await tx.delete(aiBlindspots).where(eq(aiBlindspots.userId, userId));
    await tx.delete(aiLearnedNotes).where(eq(aiLearnedNotes.userId, userId));
    await tx.delete(aiVoice).where(eq(aiVoice.userId, userId));
    await tx.delete(aiContentStats).where(eq(aiContentStats.userId, userId));
    await tx.delete(aiMoments).where(eq(aiMoments.userId, userId));
    await tx.delete(aiGoals).where(eq(aiGoals.userId, userId));
    await tx.delete(aiProfiles).where(eq(aiProfiles.userId, userId));
  });
}

// ── Stats ledger ────────────────────────────────────────────────────────────

// Returns true when this export is new (so the included AI read should run).
export async function saveExportStats(userId: string, stats: ExportStats): Promise<boolean> {
  const inserted = await db.insert(aiStatsLedger)
    .values({ userId, platform: stats.platform, exportedAt: new Date(stats.exportedAt * 1000), stats: JSON.stringify(stats) })
    .onConflictDoNothing()
    .returning({ id: aiStatsLedger.id });
  return inserted.length > 0;
}

export async function recentStats(userId: string, platform: string, limit = 3): Promise<ExportStats[]> {
  const rows = await db.select({ stats: aiStatsLedger.stats }).from(aiStatsLedger)
    .where(and(eq(aiStatsLedger.userId, userId), eq(aiStatsLedger.platform, platform)))
    .orderBy(desc(aiStatsLedger.exportedAt))
    .limit(limit);
  return rows.map((r) => JSON.parse(r.stats) as ExportStats);
}

// The 30-day plan setup answers, kept to prefill the next plan.
export async function savePlanPrefs(userId: string, prefs: object): Promise<void> {
  await db.insert(aiProfiles).values({ userId, planPrefs: JSON.stringify(prefs), updatedAt: new Date() })
    .onConflictDoUpdate({ target: aiProfiles.userId, set: { planPrefs: JSON.stringify(prefs), updatedAt: new Date() } });
}

// What the plan setup shows: the saved answers and what the plan will be built on.
export async function planSetupInfo(userId: string) {
  const [profile, stats, posts] = await Promise.all([
    getAiProfile(userId),
    db.select({ stats: aiStatsLedger.stats, exportedAt: aiStatsLedger.exportedAt }).from(aiStatsLedger).where(eq(aiStatsLedger.userId, userId)).orderBy(desc(aiStatsLedger.exportedAt)).limit(1),
    recentContentOf(userId, ['check', 'post'], 50),
  ]);
  let prefs: unknown = null;
  try { prefs = profile?.planPrefs ? JSON.parse(profile.planPrefs) : null; } catch { prefs = null; }
  const latest = stats[0] ? (JSON.parse(stats[0].stats) as ExportStats) : null;
  return {
    prefs,
    followers: latest?.followers ?? null,
    exportedAt: stats[0]?.exportedAt ?? null,
    postsWithResults: posts.filter((p) => p.results).length,
    niche: profile?.niche ?? null,
  };
}

// ── Content log ─────────────────────────────────────────────────────────────

export async function logContent(userId: string, entry: { kind: string; format?: string | null; topic?: string | null; score?: number | null; output: unknown }): Promise<string> {
  const [row] = await db.insert(aiContentLog)
    .values({ userId, kind: entry.kind, format: entry.format ?? null, topic: entry.topic ?? null, score: entry.score ?? null, output: JSON.stringify(entry.output) })
    .returning({ id: aiContentLog.id });
  return row!.id;
}

export async function recentContent(userId: string, kind: string, limit = 5) {
  return db.select().from(aiContentLog)
    .where(and(eq(aiContentLog.userId, userId), eq(aiContentLog.kind, kind)))
    .orderBy(desc(aiContentLog.createdAt))
    .limit(limit);
}

export async function recentContentOf(userId: string, kinds: string[], limit = 50) {
  return db.select().from(aiContentLog)
    .where(and(eq(aiContentLog.userId, userId), inArray(aiContentLog.kind, kinds)))
    .orderBy(desc(aiContentLog.createdAt))
    .limit(limit);
}

// Coach reads of this platform's exports since the start of the UTC day.
export async function readsToday(userId: string, platform: string, now: Date = new Date()): Promise<number> {
  const since = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const rows = await db.select({ id: aiContentLog.id }).from(aiContentLog)
    .where(and(eq(aiContentLog.userId, userId), eq(aiContentLog.kind, 'read'), eq(aiContentLog.topic, platform), gte(aiContentLog.createdAt, since)));
  return rows.length;
}

export async function latestContent(userId: string, kind: string) {
  const [row] = await recentContent(userId, kind, 1);
  return row ?? null;
}

// A post logged on Plan > Posted: by hand (two taps), or brought in from a
// Photo insights run with Instagram's own numbers. `key` (e.g. the post's
// timestamp in the export) makes an import idempotent: the same post is never
// logged twice.
export interface PostInput {
  format: string; title: string; platform?: string | null; postedAt?: Date | null;
  results?: Record<string, number> | null; source?: 'manual' | 'insights'; key?: string | null;
}
export async function logPost(userId: string, input: PostInput): Promise<string> {
  if (input.key) {
    const [dupe] = await db.select({ id: aiContentLog.id }).from(aiContentLog)
      .where(and(eq(aiContentLog.userId, userId), eq(aiContentLog.kind, 'post'), sql`${aiContentLog.output}::jsonb->>'key' = ${input.key}`))
      .limit(1);
    if (dupe) return dupe.id;
  }
  const [row] = await db.insert(aiContentLog)
    .values({
      userId, kind: 'post', format: input.format, topic: input.title, platform: input.platform ?? 'instagram',
      postedAt: input.postedAt ?? new Date(),
      results: input.results && Object.keys(input.results).length ? JSON.stringify(input.results) : null,
      output: JSON.stringify({ manual: input.source !== 'insights', source: input.source ?? 'manual', title: input.title, ...(input.key ? { key: input.key } : {}) }),
    })
    .returning({ id: aiContentLog.id });
  return row!.id;
}

// "I posted this" and, later, how it did. Only the user's own rows. Adding
// results later keeps the day it was first marked posted.
export async function markPosted(userId: string, id: string, results: Record<string, number> | null): Promise<boolean> {
  const updated = await db.update(aiContentLog)
    .set({ postedAt: sql`coalesce(${aiContentLog.postedAt}, now())`, ...(results ? { results: JSON.stringify(results) } : {}) })
    .where(and(eq(aiContentLog.id, id), eq(aiContentLog.userId, userId)))
    .returning({ id: aiContentLog.id });
  return updated.length > 0;
}

// Studio > Plan: the edited calendar of a 30-day plan, kept in that plan row's
// results column next to the number of feedback rounds. Only the user's own plan rows.
export async function savePlanCalendar(userId: string, id: string, items: AiPlanCalendarItem[]): Promise<boolean> {
  const row = await getPlanRow(userId, id);
  if (!row) return false;
  const before = planCalendarOf(row.results, row.output);
  const updated = await db.update(aiContentLog)
    .set({ results: JSON.stringify({ calendar: items, revisions: planRevisions(row.results) }) })
    .where(and(eq(aiContentLog.id, id), eq(aiContentLog.userId, userId), eq(aiContentLog.kind, 'plan')))
    .returning({ id: aiContentLog.id });
  if (!updated.length) return false;
  await syncPlanPosts(userId, id, before, items);
  return true;
}

// The calendar as the user left it, else straight from the plan.
export function planCalendarOf(results: string | null, output: string): AiPlanCalendarItem[] {
  try {
    const saved = aiPlanCalendarSchema.shape.items.safeParse((JSON.parse(results ?? '{}') as { calendar?: unknown }).calendar);
    if (saved.success) return saved.data;
    const plan = aiPlanSchema.safeParse(JSON.parse(output));
    return plan.success ? calendarFromPlan(plan.data) : [];
  } catch { return []; }
}

// A plan post marked as posted gets its own row (kind 'post'), so it shows in
// Plan > Posted, can get its results, and the coach learns from them like a
// checked post. Unmarking it removes that row.
async function syncPlanPosts(userId: string, planId: string, before: AiPlanCalendarItem[], after: AiPlanCalendarItem[]): Promise<void> {
  const was = new Set(before.filter((i) => i.posted).map((i) => i.day));
  const now = new Set(after.filter((i) => i.posted).map((i) => i.day));
  for (const it of after) {
    if (!it.posted || was.has(it.day)) continue;
    await db.insert(aiContentLog).values({ userId, kind: 'post', format: it.format, topic: it.idea.slice(0, 120), platform: 'instagram', postedAt: new Date(), output: JSON.stringify({ planId, day: it.day, idea: it.idea, hook: it.hook }) });
  }
  for (const day of was) {
    if (now.has(day)) continue;
    await db.delete(aiContentLog).where(and(
      eq(aiContentLog.userId, userId), eq(aiContentLog.kind, 'post'),
      sql`${aiContentLog.output}::jsonb->>'planId' = ${planId}`, sql`(${aiContentLog.output}::jsonb->>'day')::int = ${day}`,
    ));
  }
}

export async function getPlanRow(userId: string, id: string) {
  const [row] = await db.select().from(aiContentLog)
    .where(and(eq(aiContentLog.id, id), eq(aiContentLog.userId, userId), eq(aiContentLog.kind, 'plan')))
    .limit(1);
  return row ?? null;
}

export function planRevisions(results: string | null): number {
  if (!results) return 0;
  try { const n = (JSON.parse(results) as { revisions?: unknown }).revisions; return typeof n === 'number' && n >= 0 ? n : 0; } catch { return 0; }
}

// A plan changed after feedback: same row (same start day), new plan and calendar.
export async function saveRevisedPlan(userId: string, id: string, plan: unknown, calendar: unknown[], revisions: number): Promise<void> {
  await db.update(aiContentLog)
    .set({ output: JSON.stringify(plan), results: JSON.stringify({ calendar, revisions }) })
    .where(and(eq(aiContentLog.id, id), eq(aiContentLog.userId, userId), eq(aiContentLog.kind, 'plan')));
}
