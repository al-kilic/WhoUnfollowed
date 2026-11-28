import type { AiInsightsStats, ContentStats, ExportStats, VoiceStats } from '@ig-tracker/core';
import type { LedgerRow } from './ledger';
import type { GoalProgress } from './goalMath';

// Blind spots: things in the member's own data they have not asked about.
// Pure code, no model call and no username: every param is a number or a
// 'YYYY-MM(-DD)' date, so the card (and later the coach) can only ever see
// counts. Runs in the browser. See .claude/reference/memory-v2-spec.md §4.

export type Detector =
  | 'stale_pending' | 'posting_below_plan' | 'goal_pace_drift' | 'follow_back_drop'
  | 'spree_didnt_work' | 'quiet_season' | 'best_month_unexplained' | 'results_never_logged' | 'stale_numbers'
  | 'current_gap' | 'winner_underused' | 'mutuals_lost_twice' | 'no_cta' | 'weekday_mismatch'
  | 'format_never_tried' | 'story_reach_drop' | 'reach_stays_home' | 'near_following_cap' | 'drifted_from_winner';

// Free accounts (spec 3E): one card, worked out in the browser from the
// export alone. Detectors 1, 7, 8, 10 and 11; no requests, no model calls.
export const FREE_DETECTORS: ReadonlySet<Detector> = new Set<Detector>(['stale_pending', 'follow_back_drop', 'spree_didnt_work', 'near_following_cap', 'quiet_season']);

export interface BlindSpot {
  detector: Detector;
  key: string;
  impact: number;          // 0..100
  confidence: number;      // 0..1
  actionability: number;   // 1 with one concrete step, else 0.6
  params: Record<string, number | string>;
  href: string;
}

export interface PostedLite { postedAt: string | null; results: Record<string, number> | null }

export interface BlindSpotInput {
  stats: readonly ExportStats[];     // newest first, same platform
  postingDays?: readonly number[];   // 0 = Monday
  hasPlan?: boolean;
  posted?: readonly PostedLite[];
  goal?: { target: number; progress: GoalProgress | null } | null;
  notesText?: string;                // what the member already talked about
  // Memory v2 (phase 2E): the member's own posting history, caption habits
  // and the what-worked ledger, when the browser or server has them.
  content?: ContentStats | null;
  voice?: VoiceStats | null;
  ledger?: readonly LedgerRow[] | null;   // format rows ('format:carousel')
  // Instagram's own numbers from the full export (stories, reach, audience).
  insights?: AiInsightsStats | null;
  now?: Date;
}

const DAY = 86_400_000;
const VALUE = /^\d{4}-\d{2}(-\d{2})?$/;
export const THRESHOLD = 40;
export const LOW_THRESHOLD = 20; // stale_numbers only shows when nothing else does

type Fact = { id: string; params: Record<string, number | string> };
const fact = (s: ExportStats | undefined, id: string): Fact | undefined =>
  (s?.facts as Fact[] | undefined)?.find((f) => f.id === id);
const num = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) ? v : null);
const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

function clean(p: Record<string, unknown>): Record<string, number | string> {
  const out: Record<string, number | string> = {};
  for (const [k, v] of Object.entries(p)) {
    if (typeof v === 'number' && Number.isFinite(v)) out[k] = v;
    else if (typeof v === 'string' && VALUE.test(v)) out[k] = v;
  }
  return out;
}

function spot(detector: Detector, key: string, impact: number, confidence: number, params: Record<string, unknown>, href: string, actionability = 1): BlindSpot {
  return { detector, key, impact: clamp(impact), confidence, actionability, params: clean(params), href };
}

function stalePending(s: readonly ExportStats[]): BlindSpot | null {
  const now = fact(s[0], 'fix.stale_pending');
  const count = num(now?.params.count);
  if (!now || !count) return null;
  const before = num(fact(s[1], 'fix.stale_pending')?.params.count);
  if (before !== null && count < before) return null; // already clearing them
  return spot('stale_pending', 'stale_pending', 50 + count, before !== null ? 0.95 : 0.6, { count, months: now.params.months }, '/app/radar/fixes');
}

function postingBelowPlan(i: BlindSpotInput, now: Date): BlindSpot | null {
  const days = i.postingDays ?? [];
  const posted = i.posted ?? [];
  if (!days.length || (!i.hasPlan && !posted.length)) return null;
  const since = now.getTime() - 28 * DAY;
  const n = posted.filter((p) => p.postedAt && new Date(p.postedAt).getTime() >= since).length;
  const planned = days.length * 4;
  const ratio = n / planned;
  if (ratio >= 0.6) return null;
  return spot('posting_below_plan', 'posting_below_plan', 40 + (1 - ratio) * 40, 0.8, { posted: n, planned }, '/app/plan');
}

function goalPaceDrift(i: BlindSpotInput): BlindSpot | null {
  const p = i.goal?.progress;
  if (!p || p.status !== 'behind' || !p.perWeekNeeded || p.perWeekSoFar === null) return null;
  const ratio = p.perWeekSoFar / p.perWeekNeeded;
  if (ratio >= 0.7) return null;
  return spot('goal_pace_drift', 'goal_pace_drift', 70, 0.8, { needed: Math.round(p.perWeekNeeded), soFar: Math.max(0, Math.round(p.perWeekSoFar)), target: i.goal?.target }, '/app/plan/goals');
}

function followBackDrop(s: readonly ExportStats[]): BlindSpot | null {
  const a = s[0]?.followBackRate12m, b = s[0]?.followBackRatePrev12m;
  if (a == null || b == null || a > b - 0.1) return null;
  return spot('follow_back_drop', 'follow_back_drop', 55, 0.85, { now: Math.round(a * 100), before: Math.round(b * 100) }, '/app/radar/people');
}

function spreeDidntWork(s: readonly ExportStats[]): BlindSpot | null {
  const f = fact(s[0], 'fix.follow_burst');
  const count = num(f?.params.count), back = num(f?.params.followedBack);
  if (!f || !count || count < 10 || back === null || back / count >= 0.15) return null;
  return spot('spree_didnt_work', `spree_didnt_work:${String(f.params.date ?? '')}`, 45, 0.85, { date: f.params.date, count, followedBack: back }, '/app/radar/fixes');
}

// The same calendar month was the quietest in each of the last two years.
function quietSeason(s: readonly ExportStats[], now: Date): BlindSpot | null {
  const st = s[0];
  if (!st) return null;
  const end = new Date(st.exportedAt * 1000);
  const lowest = (from: number, to: number): number | null => {
    let best: [number, number] | null = null;
    for (let k = from; k < to; k++) {
      const d = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth() - k, 1));
      const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
      const v = st.newFollowersByMonth[key] ?? 0;
      if (!best || v < best[1]) best = [d.getUTCMonth() + 1, v];
    }
    return best ? best[0] : null;
  };
  const a = lowest(1, 13), b = lowest(13, 25);
  if (!a || a !== b || Object.keys(st.newFollowersByMonth).length < 18) return null;
  const next = ((now.getMonth() + 1) % 12) + 1, cur = now.getMonth() + 1;
  const impact = a === next ? 60 : a === cur ? 42 : 20;
  return spot('quiet_season', `quiet_season:${a}`, impact, 0.7, { month: a }, '/app/plan');
}

function bestMonthUnexplained(s: readonly ExportStats[], notes: string): BlindSpot | null {
  const f = fact(s[0], 'fact.best_month');
  const month = f?.params.month;
  if (typeof month !== 'string' || !VALUE.test(month)) return null;
  if ((num(f?.params.count) ?? 0) < 10 || notes.includes(month)) return null; // a best month of +3 is noise
  return spot('best_month_unexplained', `best_month_unexplained:${month}`, 50, 0.75, { month, count: f?.params.count }, '/app/ask');
}

function resultsNeverLogged(i: BlindSpotInput): BlindSpot | null {
  const posted = (i.posted ?? []).filter((p) => p.postedAt);
  if (posted.length < 4 || posted.some((p) => p.results && Object.keys(p.results).length)) return null;
  return spot('results_never_logged', 'results_never_logged', 55, 0.9, { posted: posted.length }, '/app/plan/posted');
}

function staleNumbers(s: readonly ExportStats[], now: Date): BlindSpot | null {
  const st = s[0];
  if (!st) return null;
  const days = Math.floor((now.getTime() - st.exportedAt * 1000) / DAY);
  if (days <= 45) return null;
  return spot('stale_numbers', 'stale_numbers', 30, 1, { days }, '/app/you/guides');
}

// 3. Much longer since the last post than usual.
function currentGap(c: ContentStats | null | undefined): BlindSpot | null {
  const gap = c?.currentGapDays, usual = c?.medianGapDays;
  if (gap == null || usual == null || usual <= 0 || gap <= 10 || gap <= 2 * usual) return null;
  return spot('current_gap', 'current_gap', 45 + Math.min(30, gap / 2), 0.85, { days: Math.round(gap), usual: Math.round(usual) }, '/app/plan');
}

// 5. A format that brings far more followers than the rest, but is rarely used.
function winnerUnderused(rows: readonly LedgerRow[] | null | undefined, c: ContentStats | null | undefined): BlindSpot | null {
  if (!rows?.length || !c) return null;
  const mix = c.mix90 as Record<string, number>;
  const win = rows
    .filter((r) => r.key.startsWith('format:') && r.posts >= 3 && r.vsAll >= 1.8)
    .map((r) => ({ r, fmt: r.key.slice(7), share: mix[r.key.slice(7)] }))
    .filter((x) => typeof x.share === 'number' && x.share < 0.25)
    .sort((a, b) => b.r.vsAll - a.r.vsAll)[0];
  if (!win) return null;
  const formatCode = { photo: 1, carousel: 2, reel: 3, video: 4 }[win.fmt] ?? 0;
  return spot('winner_underused', `winner_underused:${win.fmt}`, 65, 0.8, { format: formatCode, times: Math.round(win.r.vsAll * 10) / 10, share: Math.round((win.share ?? 0) * 100), avg: Math.round(win.r.avgNew) }, '/app/plan');
}

// 9. Lost mutuals in two exports running.
function mutualsLostTwice(s: readonly ExportStats[]): BlindSpot | null {
  const now = num(fact(s[0], 'fix.mutuals_lost')?.params.count), before = num(fact(s[1], 'fix.mutuals_lost')?.params.count);
  if (!now || !before) return null;
  return spot('mutuals_lost_twice', 'mutuals_lost_twice', 50, 0.8, { count: now, before }, '/app/radar/people');
}

// 14. Captions almost never ask a question or for anything.
function noCta(v: VoiceStats | null | undefined): BlindSpot | null {
  if (!v || v.captions < 8 || v.questionShare + v.ctaShare >= 0.08) return null;
  return spot('no_cta', 'no_cta', 45, 0.75, { captions: v.captions, pct: Math.round((v.questionShare + v.ctaShare) * 100) }, '/app/create/check');
}

// 15. Most new followers arrive on a day the member never posts.
function weekdayMismatch(s: readonly ExportStats[], days: readonly number[] | undefined): BlindSpot | null {
  const f = fact(s[0], 'fact.arrival_weekday');
  const weekday = num(f?.params.weekday), pct = num(f?.params.pct);
  if (!days?.length || weekday === null || pct === null || pct < 35 || days.includes(weekday)) return null;
  return spot('weekday_mismatch', `weekday_mismatch:${weekday}`, 50, 0.7, { weekday, pct }, '/app/plan');
}

// 4. A whole format missing for a year of regular posting (Reels first, then carousels).
function formatNeverTried(c: ContentStats | null | undefined): BlindSpot | null {
  if (!c || c.posts365 < 10) return null;
  const missing = c.mix365.reel === 0 ? { fmt: 'reel', code: 3 } : c.mix365.carousel === 0 ? { fmt: 'carousel', code: 2 } : null;
  if (!missing) return null;
  return spot('format_never_tried', `format_never_tried:${missing.fmt}`, missing.fmt === 'reel' ? 50 : 40, 0.7, { format: missing.code, posts: c.posts365 }, '/app/plan');
}

// 10. Close to Instagram's following limit.
function nearFollowingCap(s: readonly ExportStats[]): BlindSpot | null {
  const p = fact(s[0], 'fix.following_limit')?.params;
  const left = num(p?.left), cap = num(p?.cap);
  if (left === null || cap === null || left >= 300) return null;
  return spot('near_following_cap', 'near_following_cap', 60 + Math.min(20, (300 - left) / 15), 0.95, { left, cap, oneWay: num(p?.oneWay) ?? 0 }, '/app/radar/people');
}

// 16. The last five captions are far from the ones on the best-reached posts:
// twice as long or half as long (and 60+ characters apart), or 5+ hashtags apart.
function driftedFromWinner(i: AiInsightsStats | null | undefined): BlindSpot | null {
  const d = i?.captionDrift;
  if (!d || d.winners < 2) return null;
  const longer = d.recentChars >= 2 * d.winnerChars && d.recentChars - d.winnerChars >= 60;
  const shorter = d.recentChars * 2 <= d.winnerChars && d.winnerChars - d.recentChars >= 60;
  const tags = Math.abs(d.recentTags - d.winnerTags) >= 5;
  if (!longer && !shorter && !tags) return null;
  const kind = longer || shorter ? 1 : 2; // 1 caption length, 2 hashtags
  return spot('drifted_from_winner', `drifted_from_winner:${kind}`, 50, 0.65, { kind, winnerChars: d.winnerChars, recentChars: d.recentChars, winnerTags: d.winnerTags, recentTags: d.recentTags }, '/app/create/check');
}

// 20. Stories reach far fewer people than earlier in the year.
function storyReachDrop(i: AiInsightsStats | null | undefined): BlindSpot | null {
  const s = i?.stories;
  const now = s?.medianReach90, before = s?.medianReachBefore;
  if (!s || now == null || before == null || before < 20 || s.last90 < 8) return null;
  const drop = Math.round((1 - now / before) * 100);
  if (drop < 25) return null;
  return spot('story_reach_drop', 'story_reach_drop', 45 + Math.min(25, drop / 2), 0.8, { now: Math.round(now), before: Math.round(before), pct: drop }, '/app/create');
}

// 21. Almost everyone reached already follows: posts aren't finding new people.
function reachStaysHome(i: AiInsightsStats | null | undefined): BlindSpot | null {
  const a = i?.account;
  const pct = a?.nonFollowerReachPct;
  if (!a || pct == null || (a.reached ?? 0) < 500 || pct >= 15) return null;
  return spot('reach_stays_home', 'reach_stays_home', 55, 0.85, { pct: Math.round(pct), reached: Math.round(a.reached!) }, '/app/create/ideas');
}

export function detectBlindSpots(i: BlindSpotInput): BlindSpot[] {
  const now = i.now ?? new Date();
  const s = i.stats;
  return [
    stalePending(s), postingBelowPlan(i, now), goalPaceDrift(i), followBackDrop(s), spreeDidntWork(s),
    quietSeason(s, now), bestMonthUnexplained(s, i.notesText ?? ''), resultsNeverLogged(i), staleNumbers(s, now),
    currentGap(i.content), winnerUnderused(i.ledger, i.content), mutualsLostTwice(s), noCta(i.voice), weekdayMismatch(s, i.postingDays),
    formatNeverTried(i.content), storyReachDrop(i.insights), reachStaysHome(i.insights), nearFollowingCap(s), driftedFromWinner(i.insights),
  ].filter((x): x is BlindSpot => x !== null);
}

export interface SpotHistory { shown: number; known?: boolean; snoozeUntil?: number }

// impact × confidence × novelty × actionability, halved for each time shown.
export function scoreSpot(b: BlindSpot, h: SpotHistory | undefined, now: number): number {
  if (h?.known) return 0;
  if (h?.snoozeUntil && h.snoozeUntil > now) return 0;
  return b.impact * b.confidence * b.actionability * 0.5 ** (h?.shown ?? 0);
}

export function rankBlindSpots(spots: readonly BlindSpot[], history: Record<string, SpotHistory>, now: number): BlindSpot[] {
  const scored = spots.map((b) => ({ b, s: scoreSpot(b, history[b.key], now) }));
  const main = scored.filter((x) => x.b.detector !== 'stale_numbers' && x.s >= THRESHOLD);
  const pool = main.length ? main : scored.filter((x) => x.s >= LOW_THRESHOLD);
  return pool.sort((a, b) => b.s - a.s).map((x) => x.b);
}
