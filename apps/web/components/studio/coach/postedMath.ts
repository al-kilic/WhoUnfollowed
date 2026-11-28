export type Format = 'reel' | 'carousel' | 'photo' | 'story';
export const FORMATS: Format[] = ['reel', 'carousel', 'photo', 'story'];

export interface PostedItem {
  id: string; format: string | null; hook: string | null; score: number | null;
  createdAt: string; postedAt: string | null; results: Record<string, number> | null;
  // Where it came from: a post check, a plan day, added by hand, or brought in
  // from a Photo insights run.
  source?: 'check' | 'plan' | 'manual' | 'insights';
  planDay?: number | null;
  platform?: string;
}

export const isFormat = (f: string | null): f is Format => !!f && (FORMATS as readonly string[]).includes(f);

// A hook cut at a word, with an ellipsis, for a button label.
export const short = (s: string, max = 34) => (s.length <= max ? s : `${s.slice(0, s.lastIndexOf(' ', max) > 10 ? s.lastIndexOf(' ', max) : max).trimEnd()}…`);

// Average new followers per format, best first, from posts that have results.
export function formatAverages(items: PostedItem[]): { format: Format; avg: number; n: number }[] {
  const by = new Map<Format, number[]>();
  for (const it of items) {
    const g = it.results?.newFollowers;
    if (!isFormat(it.format) || typeof g !== 'number') continue;
    by.set(it.format, [...(by.get(it.format) ?? []), g]);
  }
  return [...by].map(([format, a]) => ({ format, avg: a.reduce((x, y) => x + y, 0) / a.length, n: a.length })).sort((a, b) => b.avg - a.avg);
}


const DAY = 86_400_000;
const at = (it: PostedItem) => new Date(it.postedAt ?? it.createdAt).getTime();
// A comparable number for a post's result: new followers when given, else
// saves and shares (they grow accounts), then likes.
export function resultScore(it: PostedItem): number | null {
  const r = it.results;
  if (!r) return null;
  if (typeof r.newFollowers === 'number') return r.newFollowers * 10;
  const parts = [r.likes, r.saves, r.shares, r.comments];
  if (parts.every((x) => typeof x !== 'number')) return typeof r.reach === 'number' ? r.reach / 20 : null;
  return (r.likes ?? 0) + 2 * (r.saves ?? 0) + 2 * (r.shares ?? 0) + (r.comments ?? 0);
}

// Posted 2 to 21 days ago and still without numbers, oldest first: the posts
// worth asking about now (their numbers have settled).
export function resultsDue(items: readonly PostedItem[], now: Date = new Date()): PostedItem[] {
  return items.filter((it) => it.postedAt && !it.results)
    .filter((it) => { const d = (now.getTime() - at(it)) / DAY; return d >= 2 && d <= 21; })
    .sort((a, b) => at(a) - at(b));
}

export const daysAgo = (it: PostedItem, now: Date = new Date()) => Math.max(0, Math.floor((now.getTime() - at(it)) / DAY));

// Average result per weekday (0 = Monday), from posts with results.
export function weekdayAverages(items: readonly PostedItem[]): { day: number; avg: number; n: number }[] {
  const by: number[][] = Array.from({ length: 7 }, () => []);
  for (const it of items) {
    const s = resultScore(it);
    if (s === null || !it.postedAt) continue;
    by[(new Date(it.postedAt).getUTCDay() + 6) % 7]!.push(s);
  }
  return by.map((a, day) => ({ day, n: a.length, avg: a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0 }));
}

// Weeks in a row (ending this week or last week) with at least one post.
export function streakWeeks(items: readonly PostedItem[], now: Date = new Date()): number {
  const week = (t: number) => Math.floor((t - 4 * DAY) / (7 * DAY)); // Monday-based weeks
  const weeks = new Set(items.filter((it) => it.postedAt).map((it) => week(at(it))));
  let w = week(now.getTime());
  if (!weeks.has(w)) w -= 1;
  let n = 0;
  while (weeks.has(w)) { n++; w--; }
  return n;
}

// The post with the best result.
export function bestPost(items: readonly PostedItem[]): PostedItem | null {
  let best: PostedItem | null = null;
  for (const it of items) { const s = resultScore(it); if (s !== null && (!best || s > resultScore(best)!)) best = it; }
  return best;
}
