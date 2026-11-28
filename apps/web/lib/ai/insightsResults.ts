import type { InsightsPostRow } from '@ig-tracker/core';

// Fills in "how it did" for posts the member marked as posted, from
// Instagram's own numbers in their export. Pure. Candidates are export posts
// of the same kind (Reel or not) dated from two days before it was marked
// posted to one day after; the same exact format wins, then the closest day.
// A tie is skipped rather than guessed, and each export post is used once. Results the member typed are never touched. Stories are skipped:
// there are many a day, so a match would be a guess.

export interface PostedRow { id: string; format: string | null; postedAt: Date | null; results: string | null }
export interface FilledResult { id: string; results: Record<string, number> }

const DAY = 86_400_000;
const isReel = (f: string | null | undefined) => f === 'reel';
const toDay = (d: string) => Date.parse(`${d}T12:00:00Z`);

export function resultsFromInsights(posted: readonly PostedRow[], rows: readonly InsightsPostRow[]): FilledResult[] {
  const used = new Set<number>();
  const out: FilledResult[] = [];
  const open = posted.filter((p) => p.postedAt && !p.results && p.format && p.format !== 'story')
    .sort((a, b) => a.postedAt!.getTime() - b.postedAt!.getTime());
  for (const p of open) {
    const at = p.postedAt!.getTime();
    const hits = rows.map((r, i) => ({ r, i })).filter(({ r, i }) => !used.has(i) && isReel(r.format) === isReel(p.format)
      && toDay(r.date) >= at - 2.5 * DAY && toDay(r.date) <= at + 1.5 * DAY);
    const exact = hits.filter((h) => h.r.format === p.format);
    const pool = (exact.length ? exact : hits).map((h) => ({ ...h, gap: Math.abs(toDay(h.r.date) - at) }));
    const best = Math.min(...pool.map((h) => h.gap));
    const top = pool.filter((h) => Math.abs(h.gap - best) < DAY / 2);
    if (top.length !== 1) continue;
    const { r, i } = top[0]!;
    const results: Record<string, number> = {};
    const put = (k: string, v: number | null) => { if (v !== null && Number.isFinite(v) && v >= 0 && v < 10_000_000) results[k] = Math.round(v); };
    put('likes', r.likes); put('saves', r.saves); put('shares', r.shares); put('comments', r.comments); put('newFollowers', r.follows);
    if (!Object.keys(results).length) continue;
    used.add(i);
    out.push({ id: p.id, results });
  }
  return out;
}
