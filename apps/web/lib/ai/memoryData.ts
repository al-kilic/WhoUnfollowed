import 'server-only';
import { and, desc, eq, inArray, isNotNull, isNull } from 'drizzle-orm';
import type { AiContentUpload, AiInsightsStats, AiPhotoStyle, AiVoiceUpload, ContentStats, ExportStats, VoiceStats } from '@ig-tracker/core';
import { db } from '@/lib/db/index';
import { aiContentLog, aiContentStats, aiMemoryEvents, aiMoments, aiStatsLedger, aiVoice } from '@/lib/db/schema';
import { buildLedger, ledgerNotes, type Ledger } from './ledger';
import { upsertNote } from './notes';
import { scrubHandles } from './coachContext';
import { resultsFromInsights } from './insightsResults';

// Memory v2 (phase 2E): the member's voice profile, content history, export
// moments and the what-worked ledger, in the database. All of it was worked
// out in the browser (numbers, dates, and voice examples the member chose to
// share); this file only stores and reads it.

const json = <T>(s: string | null | undefined, fallback: T): T => { try { return s ? (JSON.parse(s) as T) : fallback; } catch { return fallback; } };

export async function saveVoice(userId: string, v: AiVoiceUpload): Promise<void> {
  const values = { stats: JSON.stringify(v.stats), exemplars: JSON.stringify(v.exemplars.map((e) => scrubHandles(e))), source: 'export', captionCount: v.stats.captions, updatedAt: new Date() };
  await db.insert(aiVoice).values({ userId, ...values }).onConflictDoUpdate({ target: aiVoice.userId, set: values });
  await db.insert(aiMemoryEvents).values({ userId, kind: 'voice', summary: `${v.exemplars.length} examples` });
}

export async function getVoice(userId: string): Promise<{ stats: VoiceStats; exemplars: string[] } | null> {
  const row = await db.query.aiVoice.findFirst({ where: eq(aiVoice.userId, userId) });
  return row ? { stats: json<VoiceStats | null>(row.stats, null)!, exemplars: json<string[]>(row.exemplars, []) } : null;
}

export async function saveContent(userId: string, c: AiContentUpload): Promise<{ moments: number; filled: number }> {
  const now = new Date();
  // A re-upload without insights keeps the ones already saved.
  const set = { stats: JSON.stringify(c.stats), computedAt: now, ...(c.insights ? { insights: JSON.stringify(c.insights) } : {}) };
  await db.insert(aiContentStats).values({ userId, platform: c.platform, ...set })
    .onConflictDoUpdate({ target: [aiContentStats.userId, aiContentStats.platform], set });
  // Best post, best story month, busiest month and longest break are "the one
  // so far": a newer export replaces them instead of adding a second one.
  const single = ['best_post', 'story_best_month', 'busiest_month', 'long_break'];
  if (c.moments.some((m) => single.includes(m.kind))) {
    await db.delete(aiMoments).where(and(eq(aiMoments.userId, userId), eq(aiMoments.platform, c.platform), inArray(aiMoments.kind, single)));
  }
  for (const m of c.moments) {
    await db.insert(aiMoments).values({ userId, platform: c.platform, kind: m.kind, at: m.at, params: JSON.stringify(m.params) })
      .onConflictDoUpdate({ target: [aiMoments.userId, aiMoments.platform, aiMoments.kind, aiMoments.at], set: { params: JSON.stringify(m.params) } });
  }
  const filled = c.insights?.posts.length ? await fillResultsFromInsights(userId, c.insights).catch(() => 0) : 0;
  return { moments: c.moments.length, filled };
}

// Posts marked as posted with no results yet get Instagram's numbers, when
// one export post clearly matches (insightsResults.ts).
async function fillResultsFromInsights(userId: string, ins: AiInsightsStats): Promise<number> {
  const posted = await db.select({ id: aiContentLog.id, format: aiContentLog.format, postedAt: aiContentLog.postedAt, results: aiContentLog.results }).from(aiContentLog)
    .where(and(eq(aiContentLog.userId, userId), isNotNull(aiContentLog.postedAt), isNull(aiContentLog.results)))
    .orderBy(desc(aiContentLog.postedAt)).limit(200);
  const fills = resultsFromInsights(posted, ins.posts);
  for (const f of fills) {
    await db.update(aiContentLog).set({ results: JSON.stringify(f.results) })
      .where(and(eq(aiContentLog.id, f.id), eq(aiContentLog.userId, userId), isNull(aiContentLog.results)));
  }
  if (fills.length) await db.insert(aiMemoryEvents).values({ userId, kind: 'results', summary: `${fills.length} from the export` });
  return fills.length;
}

export async function getInsights(userId: string, platform: string): Promise<AiInsightsStats | null> {
  const row = await db.query.aiContentStats.findFirst({ where: and(eq(aiContentStats.userId, userId), eq(aiContentStats.platform, platform)) });
  return row?.insights ? json<AiInsightsStats | null>(row.insights, null) : null;
}

export async function getContentStats(userId: string, platform: string): Promise<ContentStats | null> {
  const row = await db.query.aiContentStats.findFirst({ where: and(eq(aiContentStats.userId, userId), eq(aiContentStats.platform, platform)) });
  return row ? json<ContentStats | null>(row.stats, null) : null;
}

export interface MomentRow { platform: string; kind: string; at: string; params: Record<string, number | string> }
export async function getMoments(userId: string, platform?: string): Promise<MomentRow[]> {
  const rows = await db.select().from(aiMoments)
    .where(platform ? and(eq(aiMoments.userId, userId), eq(aiMoments.platform, platform)) : eq(aiMoments.userId, userId))
    .orderBy(desc(aiMoments.at));
  return rows.map((r) => ({ platform: r.platform, kind: r.kind, at: r.at, params: json(r.params, {}) }));
}

// Posts marked as posted, and the follower count of each export, for the ledger.
export async function loadLedger(userId: string, platform: string): Promise<Ledger> {
  const [posts, exports] = await Promise.all([
    db.select({ format: aiContentLog.format, topic: aiContentLog.topic, postedAt: aiContentLog.postedAt, results: aiContentLog.results }).from(aiContentLog)
      .where(and(eq(aiContentLog.userId, userId), inArray(aiContentLog.kind, ['check', 'post', 'draft']), isNotNull(aiContentLog.postedAt)))
      .orderBy(desc(aiContentLog.postedAt)).limit(200),
    db.select({ stats: aiStatsLedger.stats }).from(aiStatsLedger)
      .where(and(eq(aiStatsLedger.userId, userId), eq(aiStatsLedger.platform, platform)))
      .orderBy(desc(aiStatsLedger.exportedAt)).limit(24),
  ]);
  const ex = exports.map((r) => json<ExportStats | null>(r.stats, null)).filter((s): s is ExportStats => !!s).map((s) => ({ exportedAt: s.exportedAt, followers: s.followers }));
  return buildLedger(posts, ex);
}

// After a new export: what worked and what didn't, as notes written by code.
export async function refreshLedgerNotes(userId: string, platform: string, locale: 'en' | 'es' | 'pt' = 'en'): Promise<number> {
  const notes = ledgerNotes(await loadLedger(userId, platform), locale);
  let n = 0;
  for (const note of notes) if ((await upsertNote(userId, note)) !== 'skipped') n++;
  return n;
}

// "Learn my photo style": the summary and findings become Photo notes, written
// by the coach and marked as a guess until something confirms them. Handles
// are scrubbed; a repeat run confirms the same notes instead of adding twice.
export async function savePhotoFindings(userId: string, p: AiPhotoStyle): Promise<number> {
  const items = [{ text: p.summary, tags: [] as string[], importance: 4 }, ...p.findings.map((f) => ({ ...f, importance: 3 }))];
  let n = 0;
  for (const it of items) {
    const body = scrubHandles(it.text).trim().slice(0, 240);
    if (body.length < 8) continue;
    const r = await upsertNote(userId, { type: 'photo', body, tags: ['photo', ...it.tags].slice(0, 6), source: 'insights', origin: 'coach', confidence: 0.6, importance: it.importance });
    if (r !== 'skipped') n++;
  }
  if (n) await db.insert(aiMemoryEvents).values({ userId, kind: 'photo', summary: `${n} photo notes` });
  return n;
}
