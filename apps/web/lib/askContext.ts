import { analyzeSnapshot, compareSnapshots, AI_CHAT_LIMITS, type AiInsights, type ParsedSnapshot } from '@ig-tracker/core';
import { snapshotPlatform, PLATFORM_NAME } from '@/lib/platform';

// Short text summaries of the member's own Studio data that Ask coach can
// attach to one question. Built in the browser. Privacy rule: numbers and the
// member's own words only, never a follower's or followed account's username.

export interface AskContextItem { kind: 'report' | 'plan' | 'goal' | 'insights' | 'check' | 'radar'; label: string; text: string }

const day = (sec: number) => new Date(sec * 1000).toISOString().slice(0, 10);
const cap = (s: string, n = 1200) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

// One export: counts and the change since the previous export of the same platform.
export function reportSummary(snap: ParsedSnapshot, previous?: ParsedSnapshot | null): string {
  const a = analyzeSnapshot(snap);
  const lines = [
    `Platform: ${PLATFORM_NAME[snapshotPlatform(snap)]}`,
    `Export date: ${day(snap.exportedAt)}`,
    `Followers: ${snap.followers.length}`,
    `Following: ${snap.following.length}`,
    `Don't follow back: ${a.nonFollowers.length}`,
    `Fans (follow you, you don't follow): ${a.fans.length}`,
    `Mutuals: ${a.mutuals.length}`,
  ];
  if (snap.pendingRequests) lines.push(`Follow requests you sent, still pending: ${snap.pendingRequests.length}`);
  if (previous) {
    const c = compareSnapshots(previous, snap);
    lines.push(`Since the previous export (${day(previous.exportedAt)}): ${c.newFollowers.length} new followers, ${c.lostFollowers.length} left, net ${snap.followers.length - previous.followers.length >= 0 ? '+' : ''}${snap.followers.length - previous.followers.length}`);
  } else {
    lines.push('No earlier export of this platform to compare with.');
  }
  return lines.join('\n');
}

// Radar-style view of one export: follow ages and ratios, counts only.
export function radarSummary(snap: ParsedSnapshot, nowSec: number = Math.floor(Date.now() / 1000)): string {
  const a = analyzeSnapshot(snap);
  const years = (s: number | null) => (s === null ? null : (nowSec - s) / 31_557_600);
  const old = a.nonFollowers.filter((x) => { const y = years(x.followedAt); return y !== null && y >= 1; }).length;
  const ratio = snap.followers.length ? (snap.following.length / snap.followers.length).toFixed(2) : 'n/a';
  return [
    `Platform: ${PLATFORM_NAME[snapshotPlatform(snap)]}, export ${day(snap.exportedAt)}`,
    `Following per follower: ${ratio}`,
    `Follow-back rate (share of people you follow who follow back): ${snap.following.length ? Math.round((a.mutuals.length / snap.following.length) * 100) : 0}%`,
    `Don't follow back, followed for over a year: ${old} of ${a.nonFollowers.length}`,
    snap.recentlyUnfollowed ? `Accounts you recently unfollowed: ${snap.recentlyUnfollowed.length}` : '',
  ].filter(Boolean).join('\n');
}

interface PlanLike { summary?: string; principles?: string[] }
interface CalItem { day: number; format: string; idea: string; posted?: boolean }
export function planSummary(plan: PlanLike | null, calendar: CalItem[] = []): string {
  if (!plan) return '';
  const upcoming = calendar.filter((c) => !c.posted).slice(0, 8).map((c) => `Day ${c.day + 1}: ${c.format}, ${c.idea}`);
  return cap([plan.summary ? `Plan: ${plan.summary}` : '', ...(plan.principles ?? []).slice(0, 3).map((p) => `Principle: ${p}`), ...upcoming].filter(Boolean).join('\n'));
}

interface GoalLike { platform: string; goal: { type: string; target: number; by: string | null; startFollowers: number } | null; current: number | null; progress: { pct?: number; status?: string } | null; habit: { current: number; pct: number } | null }
export function goalSummary(v: GoalLike | null): string {
  if (!v?.goal) return '';
  const g = v.goal;
  const what = g.type === 'followers' ? `${g.target} followers` : g.type === 'posts_week' ? `${g.target} posts a week` : `${g.target} new followers per post`;
  const now = g.type === 'followers' ? `Now: ${v.current ?? 'unknown'} followers (started at ${g.startFollowers})` : `Now: ${v.habit?.current ?? 0}`;
  const pct = v.progress?.pct ?? v.habit?.pct;
  return [`Goal on ${v.platform}: ${what}${g.by ? ` by ${g.by}` : ''}`, now, pct !== undefined ? `Progress: ${Math.round(pct)}%` : '', v.progress?.status ? `Status: ${v.progress.status}` : ''].filter(Boolean).join('\n');
}

export function insightsSummary(d: AiInsights | null): string {
  if (!d) return '';
  return cap([
    ...d.winners.map((w) => `Worked (${w.post}): ${w.why}`),
    ...d.losers.map((l) => `Did not work (${l.post}): ${l.why}`),
    ...d.patterns.slice(0, 3).map((p) => `Pattern: ${p}`),
    ...d.shootNext.slice(0, 2).map((s) => `Shoot next: ${s.what}`),
  ].join('\n'));
}

interface CheckItem { format: string | null; hook: string | null; score: number | null; postedAt: string | null; results: Record<string, number> | null }
export function checkSummary(items: CheckItem[]): string {
  return cap(items.slice(0, 5).map((c) => {
    const r = c.results ? Object.entries(c.results).map(([k, v]) => `${k} ${v}`).join(', ') : '';
    return `${c.format ?? 'post'}: "${c.hook ?? ''}"${c.score !== null ? `, check score ${c.score}` : ''}${c.postedAt ? ', posted' : ''}${r ? `, results: ${r}` : ''}`;
  }).join('\n'));
}

// Total text the coach would receive, kept inside the server's limit.
export function fitsContext(items: AskContextItem[]): boolean {
  return items.length <= AI_CHAT_LIMITS.contextItems && items.reduce((n, c) => n + c.text.length, 0) <= AI_CHAT_LIMITS.contextChars;
}
