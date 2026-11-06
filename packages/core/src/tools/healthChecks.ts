// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { compareSnapshots } from '../diff.js';
import { snapshotPlatform, type Account, type ParsedSnapshot, type Platform } from '../schemas.js';

// Account health check: a rule engine over the follower export. Each rule
// looks for one specific, fixable pattern and returns the real numbers behind
// it; the app turns `id` + `params` into a sentence with one concrete action.
// Findings are ranked by `impact` (0-100), highest first. No generic tips: a
// rule that finds nothing returns null and is not shown.

export type HealthCheckId =
  | 'stale_pending'
  | 'follow_back_gap_year'
  | 'old_one_way'
  | 'sudden_drop'
  | 'mutuals_lost'
  | 'follow_burst'
  | 'fans_unanswered'
  | 'ratio_imbalance'
  | 'following_limit'
  | 'second_export';

export interface HealthFinding {
  id: HealthCheckId;
  impact: number;
  params: Record<string, number | string>;
  // Accounts the action applies to (stays in the browser; never sent anywhere).
  accounts: Account[];
}

export interface HealthInput {
  current: ParsedSnapshot;
  // The previous export of the same platform, if any.
  previous?: ParsedSnapshot | undefined;
  now?: number; // epoch seconds
}

const DAY = 86400;

// Platform hard caps on how many accounts you can follow.
const FOLLOWING_CAP: Partial<Record<Platform, number>> = { instagram: 7500, tiktok: 10000 };

type Rule = (ctx: Ctx) => HealthFinding | null;

interface Ctx {
  current: ParsedSnapshot;
  previous: ParsedSnapshot | undefined;
  now: number;
  platform: Platform;
  followerSet: Set<string>;
  followingSet: Set<string>;
  oneWay: Account[]; // you follow, they don't follow back
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
const ageDays = (ts: number, now: number) => Math.floor((now - ts) / DAY);

const stalePending: Rule = ({ current, now }) => {
  const old = (current.pendingRequests ?? []).filter(a => a.followedAt !== null && ageDays(a.followedAt, now) >= 180);
  if (old.length === 0) return null;
  const oldest = Math.max(...old.map(a => ageDays(a.followedAt!, now)));
  return { id: 'stale_pending', impact: clamp(40 + old.length * 2), params: { count: old.length, months: Math.floor(oldest / 30) }, accounts: old };
};

// The follow year with the worst follow-back rate (at least 10 follows).
const followBackGapYear: Rule = ({ current, followerSet }) => {
  const byYear = new Map<number, { total: number; oneWay: Account[] }>();
  for (const a of current.following) {
    if (a.followedAt === null) continue;
    const y = new Date(a.followedAt * 1000).getUTCFullYear();
    const b = byYear.get(y) ?? { total: 0, oneWay: [] };
    b.total++;
    if (!followerSet.has(a.username)) b.oneWay.push(a);
    byYear.set(y, b);
  }
  let worst: { year: number; total: number; oneWay: Account[] } | null = null;
  for (const [year, b] of byYear) {
    if (b.total < 10) continue;
    const rate = b.oneWay.length / b.total;
    if (rate < 0.6) continue;
    if (!worst || rate > worst.oneWay.length / worst.total) worst = { year, ...b };
  }
  if (!worst) return null;
  const pct = Math.round((worst.oneWay.length / worst.total) * 100);
  return { id: 'follow_back_gap_year', impact: clamp(30 + pct / 2), params: { year: worst.year, total: worst.total, count: worst.oneWay.length, pct }, accounts: worst.oneWay };
};

const oldOneWay: Rule = ({ oneWay, now }) => {
  const old = oneWay.filter(a => a.followedAt !== null && ageDays(a.followedAt, now) >= 730);
  if (old.length < 5) return null;
  return { id: 'old_one_way', impact: clamp(35 + old.length / 4), params: { count: old.length }, accounts: old };
};

const suddenDrop: Rule = ({ current, previous }) => {
  if (!previous) return null;
  const cmp = compareSnapshots(previous, current);
  const lost = cmp.lostFollowers.length;
  const base = previous.followers.length || 1;
  if (lost < 10 || lost / base < 0.03) return null;
  const pct = Math.round((lost / base) * 1000) / 10;
  return { id: 'sudden_drop', impact: clamp(60 + pct * 3), params: { count: lost, pct, days: Math.max(1, Math.round(cmp.periodDays)) }, accounts: cmp.lostFollowers };
};

const mutualsLost: Rule = ({ current, previous }) => {
  if (!previous) return null;
  const prevFollowing = new Set(previous.following.map(a => a.username));
  const nowFollowers = new Set(current.followers.map(a => a.username));
  const nowFollowing = new Set(current.following.map(a => a.username));
  // Were mutual last time, still followed by you, no longer following you.
  const lost = previous.followers.filter(a => prevFollowing.has(a.username) && nowFollowing.has(a.username) && !nowFollowers.has(a.username));
  if (lost.length === 0) return null;
  return { id: 'mutuals_lost', impact: clamp(55 + lost.length * 3), params: { count: lost.length }, accounts: lost };
};

// A single day in the last 2 years where you followed 30+ accounts. Bursts
// like that are what spam filters look for, and they rarely follow back.
const followBurst: Rule = ({ current, now, followerSet }) => {
  const byDay = new Map<string, Account[]>();
  for (const a of current.following) {
    if (a.followedAt === null || ageDays(a.followedAt, now) > 730) continue;
    const d = new Date(a.followedAt * 1000).toISOString().slice(0, 10);
    const list = byDay.get(d) ?? [];
    list.push(a);
    byDay.set(d, list);
  }
  let best: [string, Account[]] | null = null;
  for (const e of byDay) if (!best || e[1].length > best[1].length) best = e;
  if (!best || best[1].length < 30) return null;
  const back = best[1].filter(a => followerSet.has(a.username)).length;
  return { id: 'follow_burst', impact: clamp(25 + best[1].length / 3), params: { date: best[0], count: best[1].length, followedBack: back }, accounts: best[1].filter(a => !followerSet.has(a.username)) };
};

// People who followed you in the last 30 days and you never followed back.
const fansUnanswered: Rule = ({ current, followingSet, now }) => {
  const recent = current.followers.filter(a => !followingSet.has(a.username) && a.followedAt !== null && ageDays(a.followedAt, now) <= 30);
  if (recent.length < 3) return null;
  return { id: 'fans_unanswered', impact: clamp(20 + recent.length), params: { count: recent.length }, accounts: recent };
};

const ratioImbalance: Rule = ({ current, oneWay }) => {
  const followers = current.followers.length;
  const following = current.following.length;
  if (following < 300 || following < followers * 1.5) return null;
  return { id: 'ratio_imbalance', impact: clamp(30 + (following / Math.max(1, followers)) * 8), params: { followers, following, oneWay: oneWay.length }, accounts: [] };
};

const followingLimit: Rule = ({ current, platform, oneWay }) => {
  const cap = FOLLOWING_CAP[platform];
  if (!cap || current.following.length < cap * 0.9) return null;
  return { id: 'following_limit', impact: 80, params: { following: current.following.length, cap, left: Math.max(0, cap - current.following.length), oneWay: oneWay.length }, accounts: [] };
};

const secondExport: Rule = ({ previous }) =>
  previous ? null : { id: 'second_export', impact: 15, params: {}, accounts: [] };

const RULES: Rule[] = [
  stalePending, followBackGapYear, oldOneWay, suddenDrop, mutualsLost,
  followBurst, fansUnanswered, ratioImbalance, followingLimit, secondExport,
];

export function runHealthChecks({ current, previous, now = Math.floor(Date.now() / 1000) }: HealthInput): HealthFinding[] {
  const followerSet = new Set(current.followers.map(a => a.username));
  const followingSet = new Set(current.following.map(a => a.username));
  const ctx: Ctx = {
    current,
    previous: previous && snapshotPlatform(previous) === snapshotPlatform(current) ? previous : undefined,
    now,
    platform: snapshotPlatform(current),
    followerSet,
    followingSet,
    oneWay: current.following.filter(a => !followerSet.has(a.username)),
  };
  const ranked = RULES.map(r => r(ctx))
    .filter((f): f is HealthFinding => f !== null)
    .sort((a, b) => b.impact - a.impact);
  return dropOverlapping(ranked);
}

// The two cleanup-list checks ("the 2023 follows" and "follows older than 2
// years") can point at nearly the same accounts. Keep the higher-ranked one
// and drop the other when 80%+ of its accounts are already covered. Other
// checks say something different about the same people (a burst, lost
// mutuals) and are always kept.
const CLEANUP_LISTS: ReadonlySet<HealthCheckId> = new Set(['follow_back_gap_year', 'old_one_way']);

function dropOverlapping(ranked: HealthFinding[]): HealthFinding[] {
  const kept: HealthFinding[] = [];
  const covered = new Set<string>();
  for (const f of ranked) {
    if (!CLEANUP_LISTS.has(f.id)) { kept.push(f); continue; }
    if (f.accounts.length > 0) {
      const overlap = f.accounts.filter(a => covered.has(a.username)).length;
      if (overlap / f.accounts.length >= 0.8) continue;
    }
    kept.push(f);
    for (const a of f.accounts) covered.add(a.username);
  }
  return kept;
}
