// A small per-member brake for the memory routes (no model calls behind them):
// at most `max` requests a minute per route and member, per process.
const hits = new Map<string, number[]>();

export function underLimit(key: string, max = 60, now: number = Date.now()): boolean {
  const list = (hits.get(key) ?? []).filter((t) => now - t < 60_000);
  if (list.length >= max) { hits.set(key, list); return false; }
  list.push(now);
  hits.set(key, list);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < 60_000)) hits.delete(k);
  return true;
}
