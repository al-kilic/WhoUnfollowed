// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import type { Account } from '../schemas.js';

// Unfollow planner: splits a cleanup list into small daily batches the user
// works through by hand in the app. Nothing here unfollows anyone; there is no
// API call. Pacing keeps the account from looking automated: Instagram and
// TikTok both rate-limit or temporarily block accounts that unfollow in big
// bursts, and newer accounts get flagged sooner.

export type Pace = 'gentle' | 'steady' | 'quick';

export const PACE_PER_DAY: Record<Pace, number> = { gentle: 20, steady: 40, quick: 80 };

// Within a day, a short pause between batches of this size helps too.
export const SUB_BATCH = 10;

export interface PlanOptions {
  accounts: Account[];
  pace: Pace;
  // Usernames the user starred: never put in a plan.
  starred?: ReadonlySet<string> | undefined;
  // Oldest follows first (the least likely to ever follow back), or A-Z.
  order?: 'oldest' | 'az' | undefined;
}

export interface UnfollowPlan {
  pace: Pace;
  perDay: number;
  batches: string[][]; // batch n = day n + 1
  total: number;
  skippedStarred: number;
}

export function buildPlan({ accounts, pace, starred, order = 'oldest' }: PlanOptions): UnfollowPlan {
  const perDay = PACE_PER_DAY[pace];
  const seen = new Set<string>();
  let skippedStarred = 0;
  const list: Account[] = [];
  for (const a of accounts) {
    if (seen.has(a.username)) continue;
    seen.add(a.username);
    if (starred?.has(a.username)) { skippedStarred++; continue; }
    list.push(a);
  }
  list.sort(order === 'az'
    ? (a, b) => a.username.localeCompare(b.username)
    // Undated accounts go last; ties broken by name so the plan is stable.
    : (a, b) => (a.followedAt ?? Infinity) - (b.followedAt ?? Infinity) || a.username.localeCompare(b.username));

  const batches: string[][] = [];
  for (let i = 0; i < list.length; i += perDay) batches.push(list.slice(i, i + perDay).map(a => a.username));
  return { pace, perDay, batches, total: list.length, skippedStarred };
}

export interface PlanProgress {
  done: number;
  left: number;
  daysLeft: number;
  // First batch with anything still to do (0-based), or -1 when finished.
  currentBatch: number;
  currentBatchLeft: number;
  pct: number; // 0-100
}

export function planProgress(plan: Pick<UnfollowPlan, 'batches' | 'perDay' | 'total'>, done: ReadonlySet<string>): PlanProgress {
  let doneCount = 0;
  let currentBatch = -1;
  let currentBatchLeft = 0;
  plan.batches.forEach((batch, i) => {
    const left = batch.filter(u => !done.has(u)).length;
    doneCount += batch.length - left;
    if (currentBatch === -1 && left > 0) { currentBatch = i; currentBatchLeft = left; }
  });
  const left = plan.total - doneCount;
  return {
    done: doneCount,
    left,
    daysLeft: Math.ceil(left / plan.perDay),
    currentBatch,
    currentBatchLeft,
    pct: plan.total === 0 ? 100 : Math.round((doneCount / plan.total) * 100),
  };
}

// Days needed at each pace, for the picker ("1,040 → 26 days at 40 a day").
export function daysAtEachPace(total: number): Record<Pace, number> {
  return {
    gentle: Math.ceil(total / PACE_PER_DAY.gentle),
    steady: Math.ceil(total / PACE_PER_DAY.steady),
    quick: Math.ceil(total / PACE_PER_DAY.quick),
  };
}
