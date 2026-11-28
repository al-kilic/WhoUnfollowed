import 'server-only';
import { readdir, readFile } from 'fs/promises';
import path from 'path';
import type { AppLocale } from '@/i18n/routing';

// Weekly briefs written by the /weekly-brief skill into
// content/briefs/<YYYY-MM-DD>/ (index.json + <edition>.<lang>.md). Read-only
// here; next.config.js bundles the folder for the standalone build.

const ROOT = path.join(process.cwd(), 'content', 'briefs');

interface BriefIndex { date: string; editions: string[]; languages: string[] }
export interface BriefEdition { id: string; name: string; markdown: string | null }
export interface Brief { date: string; editions: BriefEdition[] }

async function readJson<T>(file: string): Promise<T | null> {
  try { return JSON.parse(await readFile(file, 'utf8')) as T; } catch { return null; }
}

// Newest first. Only folders with an index.json count.
export async function listBriefDates(root: string = ROOT): Promise<string[]> {
  const entries = await readdir(root, { withFileTypes: true }).catch(() => []);
  const dates = entries.filter((e) => e.isDirectory() && /^\d{4}-\d{2}-\d{2}$/.test(e.name)).map((e) => e.name).sort().reverse();
  const withIndex = await Promise.all(dates.map(async (d) => ((await readJson<BriefIndex>(path.join(root, d, 'index.json'))) ? d : null)));
  return withIndex.filter((d): d is string => d !== null);
}

// One brief in the reader's language (English when a translation is missing).
// `includeNiches` false leaves the niche editions' text out of the response,
// so paid editions never reach a free visitor's browser.
// root: the briefs folder (tests pass a temporary one).
export async function getBrief(date: string, locale: AppLocale, includeNiches: boolean, root: string = ROOT): Promise<Brief | null> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const index = await readJson<BriefIndex>(path.join(root, date, 'index.json'));
  if (!index) return null;
  const niches = (await readJson<{ niches: { id: string; name: string; names?: Partial<Record<AppLocale, string>> }[] }>(path.join(root, 'niches.json')))?.niches ?? [];
  const editions = await Promise.all(index.editions.map(async (id) => {
    const paid = id !== 'general';
    let markdown: string | null = null;
    if (!paid || includeNiches) {
      markdown = await readFile(path.join(root, date, `${id}.${locale}.md`), 'utf8')
        .catch(() => readFile(path.join(root, date, `${id}.en.md`), 'utf8'))
        .catch(() => null);
    }
    const niche = niches.find((n) => n.id === id);
    return { id, name: niche?.names?.[locale] ?? niche?.name ?? id, markdown };
  }));
  // An edition whose file is missing is left out, rather than shown as locked.
  return { date, editions: editions.filter((e) => e.markdown !== null || (e.id !== 'general' && !includeNiches)) };
}
