import { aiPostFormats } from '@ig-tracker/core';
import type { PostInput } from './store';

// Plan > Posted input, checked on the server. Numbers only, never text from
// other people; dates no later than today and no earlier than a year ago.
export const RESULT_KEYS = ['likes', 'saves', 'shares', 'comments', 'reach', 'newFollowers'] as const;
export const POSTED_PLATFORMS = ['instagram', 'threads', 'tiktok'] as const;
export const MAX_IMPORT = 8;

export function cleanResults(v: unknown): Record<string, number> | null {
  if (!v || typeof v !== 'object') return null;
  const out: Record<string, number> = {};
  for (const k of RESULT_KEYS) {
    const n = (v as Record<string, unknown>)[k];
    if (typeof n === 'number' && Number.isInteger(n) && n >= 0 && n < 10_000_000) out[k] = n;
  }
  return Object.keys(out).length ? out : null;
}

function cleanDate(v: unknown, now: Date): Date | null {
  if (typeof v !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return null;
  const d = new Date(`${v}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return null;
  const yearAgo = now.getTime() - 366 * 86_400_000;
  if (d.getTime() > now.getTime() + 86_400_000 || d.getTime() < yearAgo) return null;
  return d;
}

// One post to log. Returns null when the input is not usable.
export function parsePostAdd(v: unknown, now: Date = new Date(), source: 'manual' | 'insights' = 'manual'): PostInput | null {
  if (!v || typeof v !== 'object') return null;
  const o = v as Record<string, unknown>;
  const format = typeof o.format === 'string' && (aiPostFormats as readonly string[]).includes(o.format) ? o.format : null;
  const title = typeof o.title === 'string' ? o.title.replace(/\s+/g, ' ').trim().slice(0, 120) : '';
  if (!format || title.length < 2) return null;
  const platform = typeof o.platform === 'string' && (POSTED_PLATFORMS as readonly string[]).includes(o.platform) ? o.platform : 'instagram';
  const key = typeof o.key === 'string' && /^[a-z0-9:_-]{3,60}$/i.test(o.key) ? o.key : null;
  return { format, title, platform, postedAt: cleanDate(o.date, now), results: cleanResults(o.results), source, key };
}

// A batch brought in from a Photo insights run (at most MAX_IMPORT).
export function parsePostImport(v: unknown, now: Date = new Date()): PostInput[] {
  if (!Array.isArray(v)) return [];
  return v.slice(0, MAX_IMPORT).map((x) => parsePostAdd(x, now, 'insights')).filter((x): x is PostInput => !!x);
}

// Where a Posted row came from, for its label.
export type PostedSource = 'check' | 'plan' | 'manual' | 'insights';
export function postedMeta(kind: string, output: string): { source: PostedSource; planDay: number | null } {
  if (kind === 'check') return { source: 'check', planDay: null };
  try {
    const o = JSON.parse(output) as { planId?: unknown; day?: unknown; source?: unknown };
    if (typeof o.planId === 'string') return { source: 'plan', planDay: typeof o.day === 'number' ? o.day : null };
    return { source: o.source === 'insights' ? 'insights' : 'manual', planDay: null };
  } catch { return { source: 'manual', planDay: null }; }
}
