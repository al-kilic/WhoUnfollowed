// The lower part of Today can be arranged: which widgets show, in what order,
// and how wide (1 to 3 columns). Kept in this browser only; it is a layout
// preference, not data.

export type WidgetId = 'create' | 'week' | 'goal' | 'ask' | 'since' | 'brief';
export type Size = 1 | 2 | 3;
export type Layout = [WidgetId, Size][];

export const ALL_WIDGETS: WidgetId[] = ['create', 'week', 'goal', 'ask', 'brief', 'since'];
export const DEFAULT_LAYOUT: Layout = [['create', 1], ['week', 1], ['goal', 1], ['ask', 2], ['brief', 1], ['since', 2]];
export const LAYOUT_KEY = 'wu:today-layout';

// Reads a saved layout, dropping anything unknown or repeated.
export function parseLayout(raw: string | null): Layout {
  if (!raw) return DEFAULT_LAYOUT;
  try {
    const v: unknown = JSON.parse(raw);
    if (!Array.isArray(v)) return DEFAULT_LAYOUT;
    const seen = new Set<WidgetId>();
    const out: Layout = [];
    for (const e of v) {
      if (!Array.isArray(e)) continue;
      const [id, size] = e as unknown[];
      if (typeof id !== 'string' || !(ALL_WIDGETS as string[]).includes(id) || seen.has(id as WidgetId)) continue;
      const s = size === 1 || size === 2 || size === 3 ? size : 1;
      seen.add(id as WidgetId);
      out.push([id as WidgetId, s]);
    }
    return out;
  } catch {
    return DEFAULT_LAYOUT;
  }
}

export const resize = (l: Layout, id: WidgetId, size: Size): Layout => l.map(([w, s]) => [w, w === id ? size : s]);
export const removeWidget = (l: Layout, id: WidgetId): Layout => l.filter(([w]) => w !== id);
export const addWidget = (l: Layout, id: WidgetId): Layout => (l.some(([w]) => w === id) ? l : [...l, [id, 1]]);
export function moveWidget(l: Layout, id: WidgetId, by: -1 | 1): Layout {
  const i = l.findIndex(([w]) => w === id), j = i + by;
  if (i < 0 || j < 0 || j >= l.length) return l;
  const next = [...l];
  [next[i], next[j]] = [next[j]!, next[i]!];
  return next;
}
// Drag and drop: put `id` where `target` is.
export function dropWidget(l: Layout, id: WidgetId, target: WidgetId): Layout {
  if (id === target) return l;
  const from = l.findIndex(([w]) => w === id), to = l.findIndex(([w]) => w === target);
  if (from < 0 || to < 0) return l;
  const next = [...l];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item!);
  return next;
}
