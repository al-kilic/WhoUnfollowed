import type { NewNote } from './noteMath';

// Memory v2 (phase 2E): the what-worked ledger. Pure, so it is easy to test.
// Each post the member marked as posted gets a number of new followers: the
// one they logged, or, when they logged nothing, an even share of the net gain
// between the two exports around it (marked as an estimate). Rows are then
// grouped by format and by topic word, compared with the member's average.
// Numbers only: topics are typed by the member, so only short topic words are
// kept as tags, never whole titles. Spec section 2 (ledger) and 4 (detector 5).

export interface LedgerPost { format: string | null; topic: string | null; postedAt: Date | null; results: string | null }
export interface LedgerExport { exportedAt: number; followers: number }

export interface PostGain { format: string; tags: string[]; at: number; newFollowers: number; estimated: boolean }

export interface LedgerRow {
  key: string;          // 'format:carousel' or 'topic:film'
  posts: number;
  avgNew: number;       // new followers per post, rounded to 1 decimal
  vsAll: number;        // avgNew / the member's average per post, 2 decimals
  estimated: boolean;   // true if any post in the row had no logged result
}

export interface Ledger { posts: PostGain[]; avgAll: number; formats: LedgerRow[]; topics: LedgerRow[] }

const STOP = new Set(['this', 'that', 'with', 'from', 'your', 'what', 'when', 'where', 'into', 'about', 'there', 'their', 'have', 'just', 'more', 'than', 'then', 'they', 'were', 'will', 'como', 'para', 'esta', 'este', 'mais', 'muito', 'sobre']);
const round1 = (n: number) => Math.round(n * 10) / 10;

export function topicTags(topic: string | null): string[] {
  const words = (topic ?? '').toLowerCase().match(/\p{L}{4,}/gu) ?? [];
  return [...new Set(words.filter((w) => !STOP.has(w)))].slice(0, 6).map((w) => `topic:${w}`);
}

function logged(results: string | null): number | null {
  if (!results) return null;
  try {
    const v = (JSON.parse(results) as { newFollowers?: unknown }).newFollowers;
    return typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : null;
  } catch { return null; }
}

// New followers per posted post: logged, or estimated from the exports.
export function postGains(posts: readonly LedgerPost[], exports: readonly LedgerExport[]): PostGain[] {
  const sorted = [...exports].sort((a, b) => a.exportedAt - b.exportedAt);
  const done = posts.filter((p) => p.postedAt && p.format);
  const windowOf = (at: number) => {
    for (let i = 1; i < sorted.length; i++) if (at > sorted[i - 1]!.exportedAt && at <= sorted[i]!.exportedAt) return i;
    return -1;
  };
  const perWindow = new Map<number, number>();
  for (const p of done) {
    if (logged(p.results) !== null) continue;
    const w = windowOf(p.postedAt!.getTime() / 1000);
    if (w > 0) perWindow.set(w, (perWindow.get(w) ?? 0) + 1);
  }
  const out: PostGain[] = [];
  for (const p of done) {
    const at = p.postedAt!.getTime() / 1000;
    const base = { format: p.format!.toLowerCase(), tags: topicTags(p.topic), at };
    const n = logged(p.results);
    if (n !== null) { out.push({ ...base, newFollowers: n, estimated: false }); continue; }
    const w = windowOf(at);
    if (w <= 0) continue;
    const net = Math.max(0, sorted[w]!.followers - sorted[w - 1]!.followers);
    out.push({ ...base, newFollowers: round1(net / (perWindow.get(w) ?? 1)), estimated: true });
  }
  return out.sort((a, b) => b.at - a.at);
}

function group(gains: readonly PostGain[], keysOf: (g: PostGain) => string[], avgAll: number, minPosts: number): LedgerRow[] {
  const by = new Map<string, PostGain[]>();
  for (const g of gains) for (const k of keysOf(g)) by.set(k, [...(by.get(k) ?? []), g]);
  return [...by.entries()]
    .filter(([, list]) => list.length >= minPosts)
    .map(([key, list]) => {
      const avg = list.reduce((s, g) => s + g.newFollowers, 0) / list.length;
      return { key, posts: list.length, avgNew: round1(avg), vsAll: avgAll > 0 ? Math.round((avg / avgAll) * 100) / 100 : 0, estimated: list.some((g) => g.estimated) };
    })
    .sort((a, b) => b.avgNew - a.avgNew || a.key.localeCompare(b.key));
}

export function buildLedger(posts: readonly LedgerPost[], exports: readonly LedgerExport[]): Ledger {
  const gains = postGains(posts, exports);
  const avgAll = gains.length ? gains.reduce((s, g) => s + g.newFollowers, 0) / gains.length : 0;
  return {
    posts: gains,
    avgAll: round1(avgAll),
    formats: group(gains, (g) => [`format:${g.format}`], avgAll, 1),
    topics: group(gains, (g) => g.tags, avgAll, 2),
  };
}

// The rows the coach sees (L3), one line each. No titles, just formats and words.
export function ledgerLines(l: Ledger, max = 6): string[] {
  if (!l.posts.length) return [];
  const row = (r: LedgerRow) => `- ${r.key}: ${r.posts} post${r.posts === 1 ? '' : 's'}, about ${r.avgNew} new followers each (${r.vsAll}x the average)${r.estimated ? ', partly estimated from the exports' : ''}`;
  return [`Average: ${l.avgAll} new followers per post over ${l.posts.length} posts.`, ...[...l.formats, ...l.topics].slice(0, max).map(row)];
}

type L = 'en' | 'es' | 'pt';
const FORMAT_NAME: Record<L, Record<string, string>> = {
  en: { carousel: 'Carousels', reel: 'Reels', photo: 'Single photos', video: 'Videos', story: 'Stories' },
  es: { carousel: 'Los carruseles', reel: 'Los Reels', photo: 'Las fotos sueltas', video: 'Los videos', story: 'Las historias' },
  pt: { carousel: 'Os carrosséis', reel: 'Os Reels', photo: 'As fotos únicas', video: 'Os vídeos', story: 'Os stories' },
};
const T = {
  en: { worked: (f: string, n: number, x: number, p: number) => `${f} bring about ${n} new followers a post, ${x}x your average (${p} posts).`, didnt: (f: string, n: number, p: number) => `${f} bring about ${n} new followers a post, well under your average (${p} posts).` },
  es: { worked: (f: string, n: number, x: number, p: number) => `${f} traen unos ${n} seguidores nuevos por publicación, ${x}x tu media (${p} publicaciones).`, didnt: (f: string, n: number, p: number) => `${f} traen unos ${n} seguidores nuevos por publicación, muy por debajo de tu media (${p} publicaciones).` },
  pt: { worked: (f: string, n: number, x: number, p: number) => `${f} trazem uns ${n} seguidores novos por post, ${x}x a sua média (${p} posts).`, didnt: (f: string, n: number, p: number) => `${f} trazem uns ${n} seguidores novos por post, bem abaixo da sua média (${p} posts).` },
} as const;

export const WORKED_RATIO = 1.5;
export const DIDNT_RATIO = 0.5;
export const NOTE_MIN_POSTS = 2;

// what_worked / what_didnt notes, written by code from the format rows.
export function ledgerNotes(l: Ledger, locale: L = 'en'): NewNote[] {
  const out: NewNote[] = [];
  for (const r of l.formats) {
    if (r.posts < NOTE_MIN_POSTS || !l.avgAll) continue;
    const fmt = r.key.slice('format:'.length);
    const name = FORMAT_NAME[locale][fmt] ?? fmt;
    if (r.vsAll >= WORKED_RATIO) {
      out.push({ type: 'what_worked', body: T[locale].worked(name, Math.round(r.avgNew), Math.round(r.vsAll * 10) / 10, r.posts), tags: [r.key], source: 'export', origin: 'code', confidence: r.estimated ? 0.6 : 0.8, importance: 4 });
    } else if (r.vsAll <= DIDNT_RATIO) {
      out.push({ type: 'what_didnt', body: T[locale].didnt(name, Math.round(r.avgNew), r.posts), tags: [r.key], source: 'export', origin: 'code', confidence: r.estimated ? 0.6 : 0.8, importance: 3 });
    }
  }
  return out;
}
