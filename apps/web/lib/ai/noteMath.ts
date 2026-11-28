import { createHash } from 'crypto';
import type { AiMemoryOps } from '@ig-tracker/core';
import { scrubHandles } from './coachContext';

// Memory v2 (phase 2A): the pure part of coach notes. Decay, fading, the
// one-time backfill from memory.md, and turning the coach's memory ops into a
// plan of database changes. No database here, so it is easy to test.
// See .claude/reference/memory-v2-spec.md sections 1 to 3.

export type NoteOrigin = 'user' | 'coach' | 'code';
export type NoteStatus = 'active' | 'disputed' | 'faded' | 'archived';

export interface Note {
  id: string;
  type: string;
  body: string;
  examples: string;
  tags: string[];
  source: string;
  origin: string;
  confidence: number;
  importance: number;
  pinned: boolean;
  status: string;
  evidenceCount: number;
  lastConfirmedAt: Date;
  contradictsId: string | null;
  createdAt: Date;
}

export interface NewNote {
  type: string;
  body: string;
  examples?: { text?: string; before?: string; after?: string }[];
  tags?: string[];
  source: string;
  origin: NoteOrigin;
  confidence: number;
  importance?: number;
  pinned?: boolean;
  status?: NoteStatus;
  contradictsId?: string | null;
  createdAt?: Date;
}

const DAY = 86_400_000;

// How fast a note loses weight when nothing confirms it, in days. Pinned
// notes and notes the member wrote never decay. Voice notes hold while the
// examples exist (Infinity).
export const HALF_LIFE: Record<string, number> = {
  like: 120, dislike: 120, what_worked: 90, what_didnt: 90, audience: 60, fact: 365, goal: 180, photo: 180, context: 90, voice: Infinity,
};
export const FADE_BELOW = 0.25;
export const FADE_AFTER_DAYS = 60;
export const ARCHIVE_AFTER_DAYS = 150;

export const neverDecays = (n: Pick<Note, 'pinned' | 'origin'>) => n.pinned || n.origin === 'user';

// Confidence today: the stored confidence, halved every half-life since the
// note was last confirmed.
export function effectiveConfidence(n: Pick<Note, 'pinned' | 'origin' | 'type' | 'confidence' | 'lastConfirmedAt'>, now: Date): number {
  if (neverDecays(n)) return n.confidence;
  const half = HALF_LIFE[n.type] ?? 120;
  if (!Number.isFinite(half)) return n.confidence;
  const age = Math.max(0, (now.getTime() - n.lastConfirmedAt.getTime()) / DAY);
  return n.confidence * Math.pow(0.5, age / half);
}

// Active notes nobody confirmed for a while fade; faded ones are archived
// later. Nothing is ever deleted here. Disputed notes wait for the member.
export function nextStatus(n: Pick<Note, 'pinned' | 'origin' | 'type' | 'confidence' | 'lastConfirmedAt' | 'status'>, now: Date): NoteStatus {
  const status = n.status as NoteStatus;
  if (neverDecays(n) || status === 'disputed' || status === 'archived') return status;
  const age = (now.getTime() - n.lastConfirmedAt.getTime()) / DAY;
  if (age >= ARCHIVE_AFTER_DAYS && effectiveConfidence(n, now) < FADE_BELOW) return 'archived';
  if (age >= FADE_AFTER_DAYS && effectiveConfidence(n, now) < FADE_BELOW) return 'faded';
  return status;
}

export const normBody = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
export const noteHash = (s: string) => createHash('sha256').update(normBody(s)).digest('hex');
// The id the coach sees: the first 6 hex characters of the uuid. Stable, so
// the cached core never changes because of it.
export const shortId = (id: string) => id.replace(/-/g, '').slice(0, 6);

// ── Backfill from memory.md ─────────────────────────────────────────────────

const COACH_HEADINGS = ['## Notes from your coach', '## Notas de tu coach', '## Notas do seu coach'];
const STARTED = /^(memory started|memoria iniciada|mem[oó]ria iniciada)\.?$/i;

// The member's own part of memory.md (everything above the coach heading).
// It stays free text in the cached core; only coach lines become notes.
export function userPartOfMemory(md: string, max = 2000): string {
  const at = COACH_HEADINGS.map((h) => md.indexOf(h)).filter((i) => i >= 0).sort((a, b) => a - b)[0];
  const user = (at === undefined ? md : md.slice(0, at)).trim();
  return user.length > max ? `${user.slice(0, max).trimEnd()}…` : user;
}

// Dated coach lines ("- 2026-11-02 Carousels do best") under the coach heading.
export function coachLinesOfMemory(md: string): { date: string | null; text: string }[] {
  const at = COACH_HEADINGS.map((h) => md.indexOf(h)).filter((i) => i >= 0).sort((a, b) => a - b)[0];
  if (at === undefined) return [];
  return md.slice(at).split('\n').slice(1)
    .map((l) => l.trim())
    .filter((l) => l.startsWith('- '))
    .map((l) => {
      const m = /^- (\d{4}-\d{2}-\d{2})\s+(.*)$/.exec(l);
      return m ? { date: m[1]!, text: m[2]!.trim() } : { date: null, text: l.slice(2).trim() };
    })
    .filter((l) => l.text.length > 0 && !STARTED.test(l.text));
}

// Notes to create from memory.md the first time memory v2 runs for a member.
export function backfillNotes(md: string): NewNote[] {
  return coachLinesOfMemory(md).map((l) => ({
    type: 'fact', body: scrubHandles(l.text).slice(0, 240), source: 'backfill', origin: 'coach' as const, confidence: 0.6,
    ...(l.date ? { createdAt: new Date(`${l.date}T12:00:00Z`) } : {}),
  }));
}

// ── Memory ops → database plan ──────────────────────────────────────────────

export interface OpsPlan {
  insert: NewNote[];
  confirm: string[];
  dispute: string[];
  supersede: { id: string; by: number }[];
}

// Turns what the coach returned (plus old-style memoryNotes) into changes.
// Rules: tombstoned ideas are never re-added; a duplicate confirms the note
// it repeats; pinned notes and notes the member wrote are never disputed or
// replaced by the coach; a member correction wins over the note it fixes.
export function planOps(input: {
  ops: AiMemoryOps;
  legacy: string[];
  notes: Note[];
  tombstones: Set<string>;
  source: string;
}): OpsPlan {
  const plan: OpsPlan = { insert: [], confirm: [], dispute: [], supersede: [] };
  const byShort = new Map(input.notes.map((n) => [shortId(n.id), n]));
  const byHash = new Map(input.notes.map((n) => [noteHash(n.body), n]));
  const seen = new Set<string>();
  const protectedNote = (n: Note) => n.pinned || n.origin === 'user';

  const add = (nn: NewNote) => {
    const body = scrubHandles(nn.body.replace(/\s+/g, ' ').trim()).slice(0, 240);
    if (!body) return -1;
    const h = noteHash(body);
    if (input.tombstones.has(h) || seen.has(h)) return -1;
    seen.add(h);
    const dup = byHash.get(h);
    if (dup) { if (!plan.confirm.includes(dup.id)) plan.confirm.push(dup.id); return -1; }
    plan.insert.push({ ...nn, body });
    return plan.insert.length - 1;
  };

  for (const a of input.ops.add) {
    add({ type: a.type, body: a.text, tags: a.tags, examples: a.example ? [{ text: scrubHandles(a.example) }] : [], source: input.source, origin: 'coach', confidence: a.confidence });
  }
  for (const text of input.legacy) add({ type: 'fact', body: text, source: input.source, origin: 'coach', confidence: 0.5 });

  for (const id of input.ops.confirm) {
    const n = byShort.get(id);
    if (n && !plan.confirm.includes(n.id)) plan.confirm.push(n.id);
  }
  for (const c of input.ops.contradict) {
    const target = byShort.get(c.id);
    if (!target || protectedNote(target)) continue;
    const idx = add({ type: target.type, body: c.text, tags: target.tags, source: input.source, origin: 'coach', confidence: 0.5, status: 'disputed', contradictsId: target.id });
    if (idx >= 0 && !plan.dispute.includes(target.id)) plan.dispute.push(target.id);
  }
  if (input.ops.corrected) {
    const target = input.ops.corrected.id ? byShort.get(input.ops.corrected.id) : undefined;
    const idx = add({ type: target?.type ?? 'fact', body: input.ops.corrected.text, tags: target?.tags ?? [], source: input.source, origin: 'user', confidence: 0.9, contradictsId: target?.id ?? null });
    if (idx >= 0 && target && !target.pinned) plan.supersede.push({ id: target.id, by: idx });
  }
  return plan;
}
