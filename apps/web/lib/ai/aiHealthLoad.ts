import 'server-only';
import { and, gte, isNull, lt, lte, sql } from 'drizzle-orm';
import { db } from '@/lib/db/index';
import { aiBlindspots, aiLearnedNotes, aiNoteTombstones, aiNotes, aiSignals, aiStatsLedger, aiUsageLog } from '@/lib/db/schema';
import { sendTelegramMessage } from '@/lib/telegram';
import { capFromEnv, DEFAULT_DAILY_CAP_USD, DEFAULT_USER_DAILY_CAP_USD } from './spendCap';
import { aiAlerts, aiReportLines, createAlertGate, summarize, thresholdsFromEnv, type MemoryCounts, type UsageRow } from './aiHealth';

// The database side of the daily AI health check (lib/ai/aiHealth.ts): load the
// last 7 days of usage and the last 24 hours of memory activity, send any
// alerts to the alerts chat, and hand back the report section.

const DAY = 86_400_000;
const gate = createAlertGate();

async function count(q: Promise<{ n: number }[]>): Promise<number> {
  const [row] = await q;
  return Number(row?.n ?? 0);
}
const n = sql<number>`count(*)::int`;

export async function loadMemoryCounts(now: Date, backlogHours: number): Promise<MemoryCounts> {
  const since = new Date(now.getTime() - DAY);
  const backlogBefore = new Date(now.getTime() - backlogHours * 3_600_000);
  const [exportsProcessed, notesCreated, notesConfirmed, notesForgotten, signalsReceived, signalsProcessed, signalBacklogOld, learnedNotesBuilt, blindSpotsShown, blindSpotsResolved] = await Promise.all([
    count(db.select({ n }).from(aiStatsLedger).where(gte(aiStatsLedger.createdAt, since))),
    count(db.select({ n }).from(aiNotes).where(gte(aiNotes.createdAt, since))),
    count(db.select({ n }).from(aiNotes).where(and(gte(aiNotes.lastConfirmedAt, since), lt(aiNotes.createdAt, since)))),
    count(db.select({ n }).from(aiNoteTombstones).where(gte(aiNoteTombstones.createdAt, since))),
    count(db.select({ n }).from(aiSignals).where(gte(aiSignals.createdAt, since))),
    count(db.select({ n }).from(aiSignals).where(gte(aiSignals.processedAt, since))),
    count(db.select({ n }).from(aiSignals).where(and(isNull(aiSignals.processedAt), lte(aiSignals.createdAt, backlogBefore)))),
    count(db.select({ n }).from(aiLearnedNotes).where(gte(aiLearnedNotes.createdAt, since))),
    count(db.select({ n }).from(aiBlindspots).where(gte(aiBlindspots.lastShownAt, since))),
    count(db.select({ n }).from(aiBlindspots).where(gte(aiBlindspots.resolvedAt, since))),
  ]);
  return { exportsProcessed, notesCreated, notesConfirmed, notesForgotten, signalsReceived, signalsProcessed, signalBacklogOld, learnedNotesBuilt, blindSpotsShown, blindSpotsResolved };
}

export async function loadUsageRows(since: Date): Promise<UsageRow[]> {
  const rows = await db.select({
    userId: aiUsageLog.userId, action: aiUsageLog.action, model: aiUsageLog.model, costUsd: aiUsageLog.costUsd,
    inputTokens: aiUsageLog.inputTokens, outputTokens: aiUsageLog.outputTokens,
    cacheReadTokens: aiUsageLog.cacheReadTokens, cacheWriteTokens: aiUsageLog.cacheWriteTokens, createdAt: aiUsageLog.createdAt,
  }).from(aiUsageLog).where(gte(aiUsageLog.createdAt, since));
  return rows.map((r) => ({ ...r, costUsd: Number(r.costUsd) }));
}

// The cron pass. Never throws: on any failure it returns null and logs.
export async function runAiHealthPass(now: Date = new Date()): Promise<{ lines: string[]; quiet: boolean; alerts: number } | null> {
  try {
    const t = thresholdsFromEnv();
    const rows7d = await loadUsageRows(new Date(now.getTime() - 7 * DAY));
    const rows24h = rows7d.filter((r) => r.createdAt.getTime() >= now.getTime() - DAY);
    const memory = await loadMemoryCounts(now, t.signalBacklogHours);
    const health = await summarize({
      now, rows24h, rows7d, memory,
      dailyCap: capFromEnv(process.env.AI_DAILY_SPEND_CAP_USD, DEFAULT_DAILY_CAP_USD),
      userCap: capFromEnv(process.env.AI_USER_DAILY_SPEND_CAP_USD, DEFAULT_USER_DAILY_CAP_USD),
    });
    const alerts = gate(aiAlerts(health, t), now);
    if (alerts.length) {
      const text = ['🤖 <b>AI alert</b>', ...alerts.map((a) => `🚨 ${a.text}`)].join('\n');
      const sent = await sendTelegramMessage(text, 'alerts').catch(() => ({ ok: false as const, error: 'threw' }));
      if (!sent.ok) console.error('[ai-health] alert not delivered:', sent.error);
    }
    return { ...aiReportLines(health), alerts: alerts.length };
  } catch (err) {
    console.error('[ai-health] check failed:', err);
    return null;
  }
}
