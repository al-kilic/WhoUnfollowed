import type { PostNums } from './insightsPick';

// What a Photo insights run needs to show its cards again later, kept only in
// this browser (localStorage): small thumbnails of the photos, each post's
// numbers and date. Never sent to the server. Missing or blocked storage just
// means an earlier result shows P1, P2... without photos or numbers.
const KEY = 'wu-insights-thumbs';
const KEEP = 6;

export interface InsightsRunLocal { thumbs: string[]; nums?: PostNums[] | undefined; dates?: (string | null)[] | undefined }
type Store = ({ id: string } & InsightsRunLocal)[];

function read(): Store {
  try { const v = JSON.parse(localStorage.getItem(KEY) ?? '[]') as unknown; return Array.isArray(v) ? (v as Store) : []; } catch { return []; }
}

export function saveInsightsRun(id: string, run: InsightsRunLocal): void {
  if (!id || !run.thumbs.length) return;
  const next = [{ id, ...run }, ...read().filter((x) => x.id !== id)].slice(0, KEEP);
  // On a full store, drop the oldest runs until it fits.
  for (let n = next.length; n > 0; n--) {
    try { localStorage.setItem(KEY, JSON.stringify(next.slice(0, n))); return; } catch { /* too big: keep fewer */ }
  }
}

export function loadInsightsRun(id: string): InsightsRunLocal {
  const r = read().find((x) => x.id === id);
  return r ? { thumbs: r.thumbs, nums: r.nums, dates: r.dates } : { thumbs: [] };
}

// Kept for older callers.
export const saveInsightsThumbs = (id: string, thumbs: string[]) => saveInsightsRun(id, { thumbs });
export const loadInsightsThumbs = (id: string) => loadInsightsRun(id).thumbs;
