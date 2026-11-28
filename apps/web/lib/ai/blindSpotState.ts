import { rankBlindSpots, type BlindSpot, type SpotHistory } from './blindSpots';

// When Today shows a blind spot, kept in this browser (Phase 1; moves to the
// database in Phase 2). At most one card, a new one at most every 3 days and
// twice a week, at most two per export. "I know" hides it for good, "Not now"
// for 14 days. Sample mode keeps its own copy in sessionStorage.

const DAY = 86_400_000;
export const NEW_EVERY = 3 * DAY;
export const MAX_PER_WEEK = 2;
export const MAX_PER_EXPORT = 2;
export const SNOOZE = 14 * DAY;

export interface CardState {
  history: Record<string, SpotHistory>;
  current: string | null;   // key of the card on screen
  newAt: number[];          // when each new card was first shown
  perData: Record<string, number>; // new cards shown per export
}

export const emptyState = (): CardState => ({ history: {}, current: null, newAt: [], perData: {} });

const open = (h: SpotHistory | undefined, now: number) => !h?.known && !(h?.snoozeUntil && h.snoozeUntil > now);

// Which card to show now, and the state after showing it.
export function pickCard(spots: readonly BlindSpot[], state: CardState, dataKey: string, now: number): { spot: BlindSpot | null; state: CardState } {
  const cur = state.current ? spots.find((s) => s.key === state.current) : undefined;
  if (cur && open(state.history[cur.key], now)) return { spot: cur, state };
  const recent = state.newAt.filter((t) => now - t < 7 * DAY);
  const last = recent.length ? Math.max(...recent) : 0;
  const canNew = now - last >= NEW_EVERY && recent.length < MAX_PER_WEEK && (state.perData[dataKey] ?? 0) < MAX_PER_EXPORT;
  if (!canNew) return { spot: null, state: { ...state, current: null } };
  const top = rankBlindSpots(spots, state.history, now)[0];
  if (!top) return { spot: null, state: { ...state, current: null } };
  const h = state.history[top.key];
  return {
    spot: top,
    state: {
      history: { ...state.history, [top.key]: { ...h, shown: (h?.shown ?? 0) + 1 } },
      current: top.key,
      newAt: [...recent, now],
      perData: { ...state.perData, [dataKey]: (state.perData[dataKey] ?? 0) + 1 },
    },
  };
}

export function answerCard(state: CardState, key: string, answer: 'know' | 'later', now: number): CardState {
  const h = state.history[key] ?? { shown: 1 };
  const next: SpotHistory = answer === 'know' ? { ...h, known: true } : { ...h, snoozeUntil: now + SNOOZE };
  return { ...state, current: null, history: { ...state.history, [key]: next } };
}

// ── Pro AI: the same state, kept in the database (one row per key) ─────────

export interface SpotRow {
  key: string;
  detector: string;
  status: 'open' | 'dismissed';
  isCurrent: boolean;
  dataKey: string | null;
  shownCount: number;
  firstSeenAt: number | null; // epoch ms
  snoozeUntil: number | null; // epoch ms
}

export function rowsToState(rows: readonly SpotRow[]): CardState {
  const s = emptyState();
  for (const r of rows) {
    s.history[r.key] = { shown: r.shownCount, ...(r.status === 'dismissed' ? { known: true } : {}), ...(r.snoozeUntil ? { snoozeUntil: r.snoozeUntil } : {}) };
    if (r.isCurrent) s.current = r.key;
    if (r.firstSeenAt) s.newAt.push(r.firstSeenAt);
    if (r.dataKey) s.perData[r.dataKey] = (s.perData[r.dataKey] ?? 0) + 1;
  }
  s.newAt.sort((a, b) => a - b);
  return s;
}

// Only keys that were shown or answered get a row. firstSeenAt and dataKey are
// set the first time a key appears and never change after.
export function stateToRows(next: CardState, prev: readonly SpotRow[], dataKey: string | null, now: number): SpotRow[] {
  const before = new Map(prev.map((r) => [r.key, r]));
  return Object.entries(next.history).map(([key, h]) => {
    const old = before.get(key);
    return {
      key,
      detector: key.split(':')[0]!,
      status: h.known ? 'dismissed' : 'open',
      isCurrent: next.current === key,
      dataKey: old?.dataKey ?? (h.shown > 0 ? dataKey : null),
      shownCount: h.shown,
      firstSeenAt: old?.firstSeenAt ?? (h.shown > 0 ? now : null),
      snoozeUntil: h.snoozeUntil ?? null,
    };
  });
}

export async function loadRemoteState(): Promise<CardState | null> {
  try {
    const r = await fetch('/api/ai/blindspots', { cache: 'no-store' });
    return r.ok ? ((await r.json()) as { state: CardState }).state : null;
  } catch { return null; }
}

export async function saveRemoteState(s: CardState, dataKey: string | null): Promise<void> {
  try {
    await fetch('/api/ai/blindspots', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ state: s, dataKey }) });
  } catch { /* offline: the next visit catches up */ }
}

const KEY = 'wu:blindspots';
const store = (sample: boolean): Storage | null => {
  try { return sample ? window.sessionStorage : window.localStorage; } catch { return null; }
};

export function loadState(sample: boolean): CardState {
  try {
    const raw = store(sample)?.getItem(sample ? `${KEY}:sample` : KEY);
    const j = raw ? (JSON.parse(raw) as Partial<CardState>) : null;
    return j ? { ...emptyState(), ...j } : emptyState();
  } catch { return emptyState(); }
}

export function saveState(sample: boolean, s: CardState): void {
  try { store(sample)?.setItem(sample ? `${KEY}:sample` : KEY, JSON.stringify(s)); } catch { /* storage blocked */ }
}
