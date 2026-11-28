import type { NoteGroup } from './memory.content';

// The shapes the memory endpoints return (GET /api/ai/notes, /learned,
// /moments). Kept loose on purpose: unknown types or sources still render.

export interface MemNote {
  id: string;
  type: string;
  body: string;
  examples: { text?: string; before?: string; after?: string }[];
  tags: string[];
  source: string;
  sourceAt?: string | null;
  origin: 'user' | 'coach' | 'code' | string;
  confidence: number;
  importance: number;
  pinned: boolean;
  status: 'active' | 'disputed' | 'faded' | 'archived' | string;
  createdAt: string;
  lastConfirmedAt?: string | null;
}
export interface NotesPayload { notes: MemNote[]; disputed: [string, string][] }
export interface LearnedWeek { weekKey: string; lines: { kind: string; text: string; noteId?: string }[]; seenAt: string | null }
export interface Moment { kind: string; at: string; params: Record<string, number | string> }

export type NoteOp =
  | { op: 'pin' | 'unpin' | 'forget' | 'keep'; id: string }
  | { op: 'edit'; id: string; body: string }
  | { op: 'add'; body: string; type: string }
  | { op: 'resolve'; id: string; keepId: string };

const GROUP_OF: Record<string, NoteGroup> = {
  fact: 'about', goal: 'about', context: 'about',
  voice: 'voice', like: 'likes', dislike: 'dislikes',
  what_worked: 'works', what_didnt: 'works', photo: 'photos', audience: 'audience',
};
export const GROUPS: NoteGroup[] = ['about', 'voice', 'likes', 'dislikes', 'works', 'photos', 'audience'];
// Types a member can add by hand, one per group.
export const ADD_TYPES: [string, NoteGroup][] = [['fact', 'about'], ['voice', 'voice'], ['like', 'likes'], ['dislike', 'dislikes'], ['what_worked', 'works'], ['audience', 'audience']];

export const groupOf = (t: string): NoteGroup | null => GROUP_OF[t] ?? null;

// Notes on the Notes tab: everything not archived, grouped, pinned first.
export function grouped(notes: MemNote[]): Record<NoteGroup, MemNote[]> {
  const out = Object.fromEntries(GROUPS.map((g) => [g, [] as MemNote[]])) as Record<NoteGroup, MemNote[]>;
  for (const n of notes) {
    const g = groupOf(n.type);
    if (!g || n.status === 'archived') continue;
    out[g].push(n);
  }
  for (const g of GROUPS) out[g].sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.importance - a.importance || (b.lastConfirmedAt ?? b.createdAt).localeCompare(a.lastConfirmedAt ?? a.createdAt));
  return out;
}

export const archived = (notes: MemNote[]) => notes.filter((n) => n.status === 'archived' || n.type === 'rollup');

// Same text, ignoring case, spacing and end punctuation: used to find the
// note behind an "Added to memory" line.
export const sameText = (a: string, b: string) => {
  const k = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').replace(/[.!?\s]+$/, '').trim();
  return k(a) === k(b);
};

// "2026-W47" to the Monday of that ISO week, as a date.
export function weekStart(key: string): Date | null {
  const m = /^(\d{4})-W(\d{2})$/.exec(key);
  if (!m) return null;
  const jan4 = new Date(Date.UTC(Number(m[1]), 0, 4));
  const monday = new Date(jan4.getTime() - ((jan4.getUTCDay() + 6) % 7) * 86_400_000);
  return new Date(monday.getTime() + (Number(m[2]) - 1) * 7 * 86_400_000);
}
