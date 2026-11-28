// Photo insights, the fast path: posts come straight from the member's full
// export, each matched to Instagram's own numbers (past_instagram_insights),
// and a contrasting set is picked automatically (the best and the weakest
// recent posts), so the coach can say what separates them. Pure functions,
// all in the browser.

export interface PostNums { likes: number | null; comments: number | null; saves: number | null; shares: number | null; reach: number | null }
export const NO_NUMS: PostNums = { likes: null, comments: null, saves: null, shares: null, reach: null };

export interface InsightsNumbersRow { at: number; reach: number | null; likes: number | null; comments: number | null; saves: number | null; shares: number | null }

// The insights row for a post: same moment, give or take an hour (the two
// files stamp the same post a few seconds apart).
export function numbersFor(date: number, rows: readonly InsightsNumbersRow[]): PostNums {
  let best: InsightsNumbersRow | null = null;
  for (const r of rows) {
    const d = Math.abs(r.at - date);
    if (d <= 3600 && (!best || d < Math.abs(best.at - date))) best = r;
  }
  return best ? { likes: best.likes, comments: best.comments, saves: best.saves, shares: best.shares, reach: best.reach } : NO_NUMS;
}

// One comparable number per post: reach when Instagram gave it, otherwise an
// engagement score that weighs saves and shares (they grow accounts) higher.
export function scoreOf(n: PostNums): number | null {
  if (n.reach !== null) return n.reach;
  const parts = [n.likes, n.comments, n.saves, n.shares];
  if (parts.every((x) => x === null)) return null;
  return (n.likes ?? 0) + (n.comments ?? 0) + 2 * (n.saves ?? 0) + 2 * (n.shares ?? 0);
}

export interface Candidate { idx: number; date: number; nums: PostNums }

// Up to `max` posts from the newest `pool`: half the strongest and half the
// weakest when there are numbers to compare, newest first; otherwise simply
// the newest posts.
export function autoPick(cands: readonly Candidate[], max = 8, pool = 40): number[] {
  const recent = [...cands].sort((a, b) => b.date - a.date).slice(0, pool);
  const scored = recent.filter((c) => scoreOf(c.nums) !== null).sort((a, b) => scoreOf(b.nums)! - scoreOf(a.nums)!);
  if (scored.length < 3) return recent.slice(0, max).map((c) => c.idx);
  const top = scored.slice(0, Math.ceil(max / 2));
  const bottom = scored.slice(-Math.floor(max / 2)).filter((c) => !top.includes(c));
  return [...top, ...bottom].sort((a, b) => b.date - a.date).slice(0, max).map((c) => c.idx);
}

function median(xs: number[]): number {
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m]! : (s[m - 1]! + s[m]!) / 2;
}

export interface Ranked { post: string; rank: number | null; times: number | null }

// Rank of each post (P1, P2...) by its score, and how it compares with the
// set's median ("2.1x your usual"). Posts without numbers get no rank.
export function rankPosts(nums: readonly PostNums[]): Ranked[] {
  const scores = nums.map(scoreOf);
  const known = scores.filter((x): x is number => x !== null);
  const mid = known.length ? median(known) : 0;
  const order = scores.map((s, i) => ({ s, i })).filter((x) => x.s !== null).sort((a, b) => b.s! - a.s!);
  return scores.map((s, i) => ({
    post: `P${i + 1}`,
    rank: s === null ? null : order.findIndex((x) => x.i === i) + 1,
    times: s === null || mid <= 0 ? null : Math.round((s / mid) * 10) / 10,
  }));
}
