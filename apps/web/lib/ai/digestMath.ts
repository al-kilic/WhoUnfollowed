import type { AiDigest } from '@ig-tracker/core';
import { noteHash, shortId, type NewNote, type Note } from './noteMath';
import { scrubHandles } from './coachContext';

// Memory v2 (phase 2E): the coach's tidy-up pass, the pure part. It runs at
// most once per new export and only when enough changed since the last one.
// Whatever the pass suggests, pinned notes and notes the member wrote are
// never merged, archived or re-ranked. Spec section 3 (digest).

export const DIGEST_MIN_CHANGES = 5;

export function shouldDigest(i: { lastExport: string | null; exportKey: string; changes: number }): boolean {
  return i.exportKey !== i.lastExport && i.changes >= DIGEST_MIN_CHANGES;
}

export interface DigestPlan {
  insert: (NewNote & { mergeOf: string[] })[];
  archive: string[];
  importance: { id: string; importance: number }[];
}

const protectedNote = (n: Note) => n.pinned || n.origin === 'user';

// `older`: archived notes not yet rolled up. Roll-ups (phase 3C) fold 3 or
// more of them, or faded notes, into one short line, so the coach keeps the
// gist of old memory without carrying every line. The originals stay in the
// Archive, pointing to the roll-up.
export function planDigest(d: AiDigest, notes: readonly Note[], tombstones: ReadonlySet<string> = new Set(), older: readonly Note[] = []): DigestPlan {
  const byShort = new Map(notes.map((n) => [shortId(n.id), n]));
  const plan: DigestPlan = { insert: [], archive: [], importance: [] };
  const touched = new Set<string>();
  const mine = (id: string) => { const n = byShort.get(id); return n && !protectedNote(n) && n.status !== 'archived' ? n : undefined; };

  for (const m of d.merge) {
    const parts = [...new Set(m.ids)].map(mine).filter((n): n is Note => !!n && !touched.has(n.id));
    // A merge must cover at least two of the coach's own notes, or it is skipped.
    if (parts.length < 2 || parts.length !== new Set(m.ids).size) continue;
    const body = scrubHandles(m.text.replace(/\s+/g, ' ').trim()).slice(0, 240);
    if (!body || tombstones.has(noteHash(body))) continue;
    parts.forEach((n) => touched.add(n.id));
    plan.insert.push({
      type: parts[0]!.type, body, tags: [...new Set(parts.flatMap((n) => n.tags))].slice(0, 6), source: 'digest', origin: 'coach',
      confidence: Math.max(...parts.map((n) => n.confidence)), importance: Math.max(...parts.map((n) => n.importance)), mergeOf: parts.map((n) => n.id),
    });
  }
  for (const id of d.archive) {
    const n = mine(id);
    if (n && !touched.has(n.id)) { touched.add(n.id); plan.archive.push(n.id); }
  }
  for (const r of d.importance) {
    const n = mine(r.id);
    if (n && !touched.has(n.id) && n.importance !== r.importance) plan.importance.push({ id: n.id, importance: r.importance });
  }
  const oldById = new Map([...older, ...notes.filter((n) => n.status === 'faded')].map((n) => [shortId(n.id), n]));
  for (const r of d.rollup ?? []) {
    const ids = [...new Set(r.ids)];
    const parts = ids.map((id) => oldById.get(id)).filter((n): n is Note => !!n && !protectedNote(n) && n.type !== 'rollup' && !touched.has(n.id));
    if (parts.length < 3 || parts.length !== ids.length) continue;
    const body = scrubHandles(r.text.replace(/\s+/g, ' ').trim()).slice(0, 240);
    if (!body || tombstones.has(noteHash(body))) continue;
    parts.forEach((n) => touched.add(n.id));
    plan.insert.push({ type: 'rollup', body, tags: [...new Set(parts.flatMap((n) => n.tags))].slice(0, 6), source: 'digest', origin: 'coach', confidence: 0.7, importance: 2, mergeOf: parts.map((n) => n.id) });
  }
  for (const a of d.add) {
    const body = scrubHandles(a.text.replace(/\s+/g, ' ').trim()).slice(0, 240);
    const h = noteHash(body);
    if (!body || tombstones.has(h) || notes.some((n) => noteHash(n.body) === h)) continue;
    plan.insert.push({ type: a.type, body, tags: a.tags, source: 'digest', origin: 'coach', confidence: 0.6, mergeOf: [] });
  }
  return plan;
}
