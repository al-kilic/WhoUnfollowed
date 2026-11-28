import { describe, expect, it } from 'vitest';
import { CHARS_PER_TOKEN, CORE_NOTES_MAX_CHARS, NOTE_BUDGET, coreNotes, queryTagsFor, renderNote, selectNotes, type NoteAction } from './retrieve';
import type { Note } from './noteMath';

const now = new Date('2026-11-23T12:00:00Z');
const types = ['fact', 'like', 'dislike', 'voice', 'what_worked', 'what_didnt', 'audience', 'photo', 'goal', 'context'];
let seq = 0;
const note = (o: Partial<Note> = {}): Note => ({
  id: `${(++seq).toString(16).padStart(6, '0')}aa-0000-4000-8000-000000000000`,
  type: 'fact', body: 'A note', examples: '[]', tags: [], source: 'read', origin: 'coach',
  confidence: 0.7, importance: 3, pinned: false, status: 'active', evidenceCount: 1, lastConfirmedAt: now, contradictsId: null, createdAt: now, ...o,
});
// 300 realistic notes, about 90 characters each.
const many = Array.from({ length: 300 }, (_, i) => note({
  type: types[i % types.length]!, body: `Note ${i}: carousels from the Alfama at golden hour bring follows when posted on Thursdays`,
  tags: i % 3 === 0 ? ['format:carousel'] : ['format:reel'], importance: (i % 5) + 1, evidenceCount: (i % 4) + 1,
}));

describe('per-action note budgets', () => {
  for (const action of Object.keys(NOTE_BUDGET) as NoteAction[]) {
    it(`${action}: stays within ${NOTE_BUDGET[action]} tokens`, () => {
      const picked = selectNotes(many, action, ['format:carousel'], now);
      const chars = picked.map(renderNote).join('\n').length;
      expect(picked.length).toBeGreaterThan(0);
      expect(chars).toBeLessThanOrEqual(NOTE_BUDGET[action] * CHARS_PER_TOKEN);
    });
  }

  it('prefers notes that match the task', () => {
    const picked = selectNotes(many, 'draft', ['format:carousel'], now);
    const carousel = picked.filter((n) => n.tags.includes('format:carousel')).length;
    expect(carousel / picked.length).toBeGreaterThan(0.5);
  });

  it('never sends archived or faded notes, and sends the older side of a dispute only once', () => {
    const old = note({ body: 'Posts at 9am', status: 'disputed' });
    const newer = note({ body: 'Posts at 6pm', status: 'disputed', contradictsId: old.id });
    const gone = note({ status: 'faded' });
    const picked = selectNotes([old, newer, gone], 'chat', [], now);
    expect(picked.map((n) => n.id)).toEqual([newer.id]);
    expect(renderNote(newer)).toContain('(not sure yet)');
  });
});

describe('core notes (cached)', () => {
  const pinned = note({ pinned: true, type: 'goal', body: 'Goal: 2,000 followers by March' });
  const strongLike = note({ type: 'like', importance: 5, evidenceCount: 3, body: 'Prefers short captions' });
  const weakLike = note({ type: 'like', importance: 5, evidenceCount: 1, body: 'Maybe likes emojis' });
  const notes = [weakLike, strongLike, pinned, ...many];

  it('holds pinned notes and confirmed strong preferences, within its size', () => {
    const core = coreNotes(notes);
    expect(core.map((n) => n.id)).toContain(pinned.id);
    expect(core.map((n) => n.id)).toContain(strongLike.id);
    expect(core.map((n) => n.id)).not.toContain(weakLike.id);
    expect(core.map(renderNote).join('\n').length).toBeLessThanOrEqual(CORE_NOTES_MAX_CHARS);
  });

  it('is byte-identical whatever the order or the day', () => {
    const a = coreNotes(notes).map(renderNote).join('\n');
    const b = coreNotes([...notes].reverse().map((n) => ({ ...n, lastConfirmedAt: new Date('2027-02-01') }))).map(renderNote).join('\n');
    expect(b).toBe(a);
    expect(a).not.toMatch(/\d{4}-\d{2}-\d{2}/);
  });
});

it('builds tags from the task', () => {
  expect(queryTagsFor({ format: 'Reel', topic: 'Lisbon light', platform: 'instagram' })).toEqual(['format:reel', 'platform:instagram', 'topic:lisbon', 'topic:light']);
});
