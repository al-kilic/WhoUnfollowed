import { effectiveConfidence, shortId, type Note } from './noteMath';

// Memory v2 (phase 2A): which notes the coach sees for each action. Pure.
// L1 (the cached core) holds pinned notes and the strongest likes and
// dislikes, byte-stable: sorted by type then id, no dates, no numbers that
// move. L2 picks the most relevant other notes for the task, up to a budget.
// No vector search: a member has at most a few hundred notes, so tag overlap,
// importance, confidence and recency are enough. Spec section 1.

export type NoteAction = 'read' | 'chat' | 'chatDeep' | 'draft' | 'ideas' | 'check' | 'plan' | 'planRevise' | 'insights';

// L2 budget per action, in tokens (about 3.6 characters each).
export const NOTE_BUDGET: Record<NoteAction, number> = {
  read: 400, chat: 600, chatDeep: 900, draft: 900, ideas: 500, check: 500, plan: 1500, planRevise: 1500, insights: 400,
};
export const CHARS_PER_TOKEN = 3.6;
// The whole cached core (account + the member's text + L1 notes), in characters.
export const CORE_MAX_CHARS = 4300;
export const CORE_NOTES_MAX_CHARS = 1200;

const TYPE_ORDER = ['goal', 'fact', 'voice', 'like', 'dislike', 'what_worked', 'what_didnt', 'audience', 'photo', 'context'];
const typeRank = (t: string) => { const i = TYPE_ORDER.indexOf(t); return i < 0 ? TYPE_ORDER.length : i; };

// How much each note type matters for each action (0 to 1).
const W_TYPE: Record<NoteAction, Partial<Record<string, number>>> = {
  read: { what_worked: 1, what_didnt: 0.9, audience: 0.8, goal: 0.8, fact: 0.5, context: 0.5 },
  chat: { fact: 0.6, what_worked: 0.7, what_didnt: 0.6, audience: 0.6, goal: 0.6, like: 0.5, dislike: 0.5, context: 0.5 },
  chatDeep: { fact: 0.7, what_worked: 0.8, what_didnt: 0.7, audience: 0.7, goal: 0.7, like: 0.5, dislike: 0.5, context: 0.6 },
  draft: { voice: 1, like: 0.9, dislike: 0.9, what_worked: 0.6, photo: 0.4 },
  ideas: { what_worked: 0.9, what_didnt: 0.8, like: 0.6, dislike: 0.7, audience: 0.6, context: 0.5 },
  check: { what_worked: 0.9, what_didnt: 0.8, dislike: 0.8, like: 0.6, voice: 0.6 },
  plan: { what_worked: 1, what_didnt: 0.9, goal: 0.9, audience: 0.8, like: 0.6, dislike: 0.6, context: 0.7, fact: 0.5 },
  planRevise: { what_worked: 0.9, what_didnt: 0.9, goal: 0.8, like: 0.7, dislike: 0.7, context: 0.6 },
  insights: { photo: 1, what_worked: 0.8, what_didnt: 0.7, audience: 0.5 },
};
const RECENCY_HALF_DAYS = 60;

const usable = (n: Note) => n.status === 'active' || n.status === 'disputed';

// One note as the coach sees it: "[a1b2c3] like · format:carousel · Prefers short captions".
export function renderNote(n: Note): string {
  const tags = n.tags.length ? ` · ${n.tags.slice(0, 3).join(' ')}` : '';
  const unsure = n.status === 'disputed' ? ' (not sure yet)' : '';
  return `[${shortId(n.id)}] ${n.type}${tags} · ${n.body}${unsure}`;
}

// L1: pinned notes first, then the strongest likes and dislikes (importance 4
// or more, confirmed at least twice). Byte-stable across days.
export function coreNotes(notes: Note[]): Note[] {
  const pinned = notes.filter((n) => n.pinned && n.status === 'active');
  const prefs = notes
    .filter((n) => !n.pinned && n.status === 'active' && (n.type === 'like' || n.type === 'dislike') && n.importance >= 4 && (n.origin === 'user' || n.evidenceCount >= 2))
    .sort((a, b) => b.importance - a.importance || a.id.localeCompare(b.id))
    .slice(0, 6);
  const picked = [...pinned, ...prefs].sort((a, b) => typeRank(a.type) - typeRank(b.type) || a.id.localeCompare(b.id));
  const out: Note[] = [];
  let size = 0;
  for (const n of picked) {
    const len = renderNote(n).length + 1;
    if (size + len > CORE_NOTES_MAX_CHARS) continue;
    out.push(n); size += len;
  }
  return out;
}

const jaccard = (a: string[], b: string[]) => {
  if (!a.length || !b.length) return 0;
  const A = new Set(a), B = new Set(b);
  let both = 0;
  for (const x of A) if (B.has(x)) both++;
  return both / (A.size + B.size - both);
};

export function noteScore(n: Note, action: NoteAction, queryTags: string[], now: Date): number {
  if (n.pinned) return Infinity;
  const age = Math.max(0, (now.getTime() - n.lastConfirmedAt.getTime()) / 86_400_000);
  return (W_TYPE[action][n.type] ?? 0.2)
    + 0.30 * jaccard(n.tags, queryTags)
    + 0.20 * (n.importance / 5)
    + 0.15 * effectiveConfidence(n, now)
    + 0.15 * Math.pow(0.5, age / RECENCY_HALF_DAYS)
    + 0.05 * Math.min(n.evidenceCount, 5) / 5;
}

// L2: the best-scoring other notes that fit the action's budget. A disputed
// note is only sent when it is the newer side, marked "(not sure yet)".
export function selectNotes(notes: Note[], action: NoteAction, queryTags: string[], now: Date, exclude: Set<string> = new Set()): Note[] {
  const maxChars = Math.floor(NOTE_BUDGET[action] * CHARS_PER_TOKEN);
  const disputedOlder = new Set(notes.filter((n) => n.contradictsId).map((n) => n.contradictsId!));
  const ranked = notes
    .filter((n) => usable(n) && !exclude.has(n.id) && !(n.status === 'disputed' && disputedOlder.has(n.id)))
    .map((n) => ({ n, s: noteScore(n, action, queryTags, now) }))
    .sort((a, b) => b.s - a.s || a.n.id.localeCompare(b.n.id));
  const out: Note[] = [];
  let size = 0;
  for (const { n } of ranked) {
    const len = renderNote(n).length + 1;
    if (size + len > maxChars) continue;
    out.push(n); size += len;
  }
  return out;
}

// Tags for the task at hand, from what the member asked for.
export function queryTagsFor(input: { format?: string | null | undefined; topic?: string | null | undefined; platform?: string | null | undefined; text?: string | null | undefined }): string[] {
  const tags = new Set<string>();
  if (input.format) tags.add(`format:${input.format.toLowerCase()}`);
  if (input.platform) tags.add(`platform:${input.platform.toLowerCase()}`);
  const words = `${input.topic ?? ''} ${input.text ?? ''}`.toLowerCase().match(/\p{L}{4,}/gu) ?? [];
  for (const w of words.slice(0, 12)) tags.add(`topic:${w}`);
  return [...tags];
}
