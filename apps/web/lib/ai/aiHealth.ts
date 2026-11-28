import { escapeTelegramHtml } from '@/lib/telegram';

// The daily AI health check: what model calls cost us, whether prompt caching
// is working, and how the coach memory is doing. Pure, so every number and
// alert is unit tested; the database side is lib/ai/aiHealthLoad.ts.
// Counts and money only. A member shows up as a short hash, never an email.

export interface UsageRow {
  userId: string;
  action: string;
  model: string;
  costUsd: number;
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  cacheWriteTokens: number;
  createdAt: Date;
}

// Coach memory activity in the last 24 hours, counted in the database.
export interface MemoryCounts {
  exportsProcessed: number;
  notesCreated: number;
  notesConfirmed: number;
  notesForgotten: number;
  signalsReceived: number;
  signalsProcessed: number;
  signalBacklogOld: number; // unprocessed and older than the backlog threshold
  learnedNotesBuilt: number;
  blindSpotsShown: number;
  blindSpotsResolved: number;
}

export interface Thresholds {
  cacheMinShare: number;
  cacheMinCalls: number;
  spendCapShare: number;
  memberMonthlyUsd: number;
  signalBacklogHours: number;
}

export const DEFAULT_THRESHOLDS: Thresholds = { cacheMinShare: 0.2, cacheMinCalls: 30, spendCapShare: 0.7, memberMonthlyUsd: 2, signalBacklogHours: 48 };

const num = (v: string | undefined, fallback: number) => {
  const n = Number(v);
  return v !== undefined && v.trim() !== '' && Number.isFinite(n) && n >= 0 ? n : fallback;
};

export function thresholdsFromEnv(env: Record<string, string | undefined> = process.env): Thresholds {
  const d = DEFAULT_THRESHOLDS;
  return {
    cacheMinShare: num(env.AI_ALERT_CACHE_MIN_SHARE, d.cacheMinShare),
    cacheMinCalls: num(env.AI_ALERT_CACHE_MIN_CALLS, d.cacheMinCalls),
    spendCapShare: num(env.AI_ALERT_SPEND_CAP_SHARE, d.spendCapShare),
    memberMonthlyUsd: num(env.AI_ALERT_MEMBER_MONTHLY_USD, d.memberMonthlyUsd),
    signalBacklogHours: num(env.AI_ALERT_SIGNAL_BACKLOG_HOURS, d.signalBacklogHours),
  };
}

export interface ModelHealth { model: string; calls: number; spend: number; cacheShare: number | null }

export interface AiHealth {
  calls: number;
  spend: number;
  members: number;
  perMember: number;
  monthlyPerMember: number; // 30-day projection from the last 7 days
  todaySpend: number; // since midnight UTC
  dailyCap: number | null;
  capShare: number | null; // todaySpend / dailyCap
  membersAtCap: number;
  topMember: { id: string; spend: number } | null;
  byModel: ModelHealth[];
  byAction: { action: string; calls: number; spend: number }[];
  digestRuns: number; // calls of the memory tidy-up action in 24 hours
  zeroTokenRows: number;
  memory: MemoryCounts;
}

const DAY = 86_400_000;

// A short, stable label for a member, never reversible to the id or email.
export async function memberHash(userId: string): Promise<string> {
  const data = new TextEncoder().encode(`wu-ai-health:${userId}`);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf).slice(0, 4), (b) => b.toString(16).padStart(2, '0')).join('');
}

// Share of input tokens read from the cache. null when the model sent no input.
export function cacheShare(rows: readonly UsageRow[]): number | null {
  let read = 0, all = 0;
  for (const r of rows) { read += r.cacheReadTokens; all += r.inputTokens + r.cacheReadTokens + r.cacheWriteTokens; }
  return all > 0 ? read / all : null;
}

const groupBy = <K extends string>(rows: readonly UsageRow[], key: (r: UsageRow) => K) => {
  const m = new Map<K, UsageRow[]>();
  for (const r of rows) { const k = key(r); const list = m.get(k); if (list) list.push(r); else m.set(k, [r]); }
  return m;
};
const total = (rows: readonly UsageRow[]) => rows.reduce((s, r) => s + r.costUsd, 0);

export async function summarize(input: {
  now: Date; rows24h: readonly UsageRow[]; rows7d: readonly UsageRow[]; memory: MemoryCounts;
  dailyCap: number | null; userCap: number | null;
}): Promise<AiHealth> {
  const { now, rows24h, rows7d, dailyCap, userCap } = input;
  const spend = total(rows24h);
  const members = new Set(rows24h.map((r) => r.userId)).size;
  const members7 = new Set(rows7d.map((r) => r.userId)).size;
  const monthlyPerMember = members7 > 0 ? (total(rows7d) / members7) * (30 / 7) : 0;

  const dayStart = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const today = rows7d.filter((r) => r.createdAt.getTime() >= dayStart && r.createdAt.getTime() <= now.getTime());
  const todaySpend = total(today);
  const todayByUser = [...groupBy(today, (r) => r.userId).entries()].map(([id, rs]) => ({ id, spend: total(rs) }));
  const membersAtCap = userCap === null ? 0 : todayByUser.filter((u) => u.spend >= userCap).length;

  const byUser24 = [...groupBy(rows24h, (r) => r.userId).entries()].map(([id, rs]) => ({ id, spend: total(rs) }));
  const top = byUser24.sort((a, b) => b.spend - a.spend)[0];

  const byModel = [...groupBy(rows24h, (r) => r.model).entries()]
    .map(([model, rs]) => ({ model, calls: rs.length, spend: total(rs), cacheShare: cacheShare(rs) }))
    .sort((a, b) => b.spend - a.spend);
  const byAction = [...groupBy(rows24h, (r) => r.action).entries()]
    .map(([action, rs]) => ({ action, calls: rs.length, spend: total(rs) }))
    .sort((a, b) => b.spend - a.spend);

  return {
    calls: rows24h.length, spend, members,
    perMember: members > 0 ? spend / members : 0,
    monthlyPerMember, todaySpend, dailyCap,
    capShare: dailyCap ? todaySpend / dailyCap : null,
    membersAtCap,
    topMember: top ? { id: await memberHash(top.id), spend: top.spend } : null,
    byModel, byAction,
    digestRuns: rows24h.filter((r) => r.action === 'memory').length,
    zeroTokenRows: rows24h.filter((r) => r.costUsd > 0 && r.inputTokens + r.outputTokens + r.cacheReadTokens + r.cacheWriteTokens === 0).length,
    memory: input.memory,
  };
}

export type AlertType = 'cache' | 'spend' | 'member_cap' | 'member_cost' | 'digest' | 'signals' | 'tokens';
export interface AiAlert { type: AlertType; text: string }

const usd = (n: number) => `$${n < 1 ? n.toFixed(3) : n.toFixed(2)}`;
const pct = (n: number) => `${Math.round(n * 100)}%`;

export function aiAlerts(h: AiHealth, t: Thresholds): AiAlert[] {
  const out: AiAlert[] = [];
  const lowCache = h.byModel.filter((m) => m.calls >= t.cacheMinCalls && m.cacheShare !== null && m.cacheShare < t.cacheMinShare);
  if (lowCache.length) out.push({ type: 'cache', text: `Caching may be broken: ${lowCache.map((m) => `${escapeTelegramHtml(m.model)} reads ${pct(m.cacheShare ?? 0)} from cache over ${m.calls} calls`).join('; ')}.` });
  if (h.capShare !== null && h.capShare >= t.spendCapShare) out.push({ type: 'spend', text: `AI spend today is ${usd(h.todaySpend)}, ${pct(h.capShare)} of the ${usd(h.dailyCap ?? 0)} daily cap.` });
  if (h.membersAtCap > 0) out.push({ type: 'member_cap', text: `${h.membersAtCap} ${h.membersAtCap === 1 ? 'member' : 'members'} hit the daily per-member AI limit.` });
  if (h.monthlyPerMember > t.memberMonthlyUsd) out.push({ type: 'member_cost', text: `Average AI cost per active member is on track for ${usd(h.monthlyPerMember)} a month (limit ${usd(t.memberMonthlyUsd)}).` });
  if (h.digestRuns > h.memory.exportsProcessed) out.push({ type: 'digest', text: `The memory tidy-up ran ${h.digestRuns} times for ${h.memory.exportsProcessed} new exports. It should run at most once per export.` });
  if (h.memory.signalBacklogOld > 0) out.push({ type: 'signals', text: `${h.memory.signalBacklogOld} learning signals have waited more than ${t.signalBacklogHours} hours to be processed.` });
  if (h.zeroTokenRows > 0) out.push({ type: 'tokens', text: `${h.zeroTokenRows} paid calls logged no token counts. Usage logging may be broken.` });
  return out;
}

// At most one message per alert type per UTC day. The store is in memory by
// default; the cron runs once a day, so this mainly guards against reruns.
export function createAlertGate(store: Map<string, string> = new Map()) {
  return (alerts: readonly AiAlert[], now: Date): AiAlert[] => {
    const day = now.toISOString().slice(0, 10);
    return alerts.filter((a) => {
      if (store.get(a.type) === day) return false;
      store.set(a.type, day);
      return true;
    });
  };
}

// The "AI" section of the daily report. quiet when nothing happened at all.
export function aiReportLines(h: AiHealth): { lines: string[]; quiet: boolean } {
  const m = h.memory;
  const memoryActive = m.notesCreated + m.notesConfirmed + m.notesForgotten + m.signalsReceived + m.learnedNotesBuilt + m.blindSpotsShown > 0;
  const quiet = h.calls === 0 && !memoryActive;
  const lines = [`AI in the last 24h: <b>${usd(h.spend)}</b> over ${h.calls} calls, ${h.members} ${h.members === 1 ? 'member' : 'members'}`];
  if (h.members > 0) lines.push(`• Per member: ${usd(h.perMember)} today, about ${usd(h.monthlyPerMember)} a month`);
  if (h.capShare !== null) lines.push(`• Daily cap used: ${pct(h.capShare)} of ${usd(h.dailyCap ?? 0)}`);
  for (const x of h.byModel) lines.push(`• ${escapeTelegramHtml(x.model)}: ${x.calls} calls, ${usd(x.spend)}, cache ${x.cacheShare === null ? 'n/a' : pct(x.cacheShare)}`);
  if (h.topMember) lines.push(`• Top member #${h.topMember.id}: ${usd(h.topMember.spend)}`);
  lines.push(`• Memory: ${m.notesCreated} notes added, ${m.notesConfirmed} confirmed, ${m.notesForgotten} forgotten, ${h.digestRuns} tidy-ups for ${m.exportsProcessed} exports`);
  lines.push(`• Learning: ${m.signalsReceived} signals in, ${m.signalsProcessed} processed, ${m.learnedNotesBuilt} weekly notes, ${m.blindSpotsShown} blind spots shown, ${m.blindSpotsResolved} resolved`);
  return { lines, quiet };
}

export const AI_HEALTH_WINDOW_MS = DAY;
