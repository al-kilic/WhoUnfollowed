import { describe, expect, it } from 'vitest';
import { backfillNotes, coachLinesOfMemory, effectiveConfidence, nextStatus, noteHash, planOps, shortId, userPartOfMemory, type Note } from './noteMath';

const now = new Date('2026-11-23T12:00:00Z');
const daysAgo = (d: number) => new Date(now.getTime() - d * 86_400_000);
let seq = 0;
const note = (o: Partial<Note> = {}): Note => ({
  id: `${(++seq).toString(16).padStart(6, '0')}aa-0000-4000-8000-000000000000`,
  type: 'like', body: 'Prefers short captions', examples: '[]', tags: [], source: 'draft', origin: 'coach',
  confidence: 0.8, importance: 3, pinned: false, status: 'active', evidenceCount: 1, lastConfirmedAt: now, contradictsId: null, createdAt: now, ...o,
});
const EMPTY = { add: [], confirm: [], contradict: [] };

const MD = [
  '## About me', 'Creator. Niche: film photography.', '', '## My voice', '> short lines', '',
  '## Notes from your coach', '- 2026-10-01 Memory started.', '- 2026-10-03 Carousels bring the most follows', '- 2026-11-02 Reply to @rui.analog every week', '',
].join('\n');

describe('backfill from memory.md', () => {
  it('keeps the member part as text and turns only coach lines into notes', () => {
    expect(userPartOfMemory(MD)).toContain('## My voice');
    expect(userPartOfMemory(MD)).not.toContain('Notes from your coach');
    expect(coachLinesOfMemory(MD).map((l) => l.text)).toEqual(['Carousels bring the most follows', 'Reply to @rui.analog every week']);
  });
  it('dates notes from the line, and scrubs handles', () => {
    const n = backfillNotes(MD);
    expect(n).toHaveLength(2);
    expect(n[0]!.createdAt!.toISOString().slice(0, 10)).toBe('2026-10-03');
    expect(n[1]!.body).toContain('@[account]');
    expect(n.every((x) => x.origin === 'coach' && x.source === 'backfill')).toBe(true);
  });
  it('gives the same notes every time (the database flag makes it run once)', () => {
    expect(backfillNotes(MD)).toEqual(backfillNotes(MD));
    expect(backfillNotes('## About me\nonly mine')).toEqual([]);
  });
});

describe('decay and fading', () => {
  it('halves confidence every half-life', () => {
    expect(effectiveConfidence(note({ type: 'like', lastConfirmedAt: daysAgo(120) }), now)).toBeCloseTo(0.4, 5);
    expect(effectiveConfidence(note({ type: 'audience', lastConfirmedAt: daysAgo(120) }), now)).toBeCloseTo(0.2, 5);
    expect(effectiveConfidence(note({ type: 'fact', lastConfirmedAt: daysAgo(365) }), now)).toBeCloseTo(0.4, 5);
  });
  it('never decays pinned notes, the member\'s own notes, or voice', () => {
    expect(effectiveConfidence(note({ pinned: true, lastConfirmedAt: daysAgo(900) }), now)).toBe(0.8);
    expect(effectiveConfidence(note({ origin: 'user', lastConfirmedAt: daysAgo(900) }), now)).toBe(0.8);
    expect(effectiveConfidence(note({ type: 'voice', lastConfirmedAt: daysAgo(900) }), now)).toBe(0.8);
  });
  it('fades after 60 quiet days below 0.25, archives later, never deletes', () => {
    expect(nextStatus(note({ type: 'audience', confidence: 0.5, lastConfirmedAt: daysAgo(30) }), now)).toBe('active');
    expect(nextStatus(note({ type: 'audience', confidence: 0.5, lastConfirmedAt: daysAgo(70) }), now)).toBe('faded');
    expect(nextStatus(note({ type: 'audience', confidence: 0.5, lastConfirmedAt: daysAgo(160), status: 'faded' }), now)).toBe('archived');
    expect(nextStatus(note({ type: 'audience', confidence: 0.5, lastConfirmedAt: daysAgo(160), pinned: true }), now)).toBe('active');
    expect(nextStatus(note({ type: 'audience', confidence: 0.5, lastConfirmedAt: daysAgo(160), status: 'disputed' }), now)).toBe('disputed');
  });
});

describe('memory ops', () => {
  it('adds new notes and maps old memoryNotes to facts', () => {
    const p = planOps({ ops: { ...EMPTY, add: [{ type: 'what_worked', text: 'Reels from Alfama did best', tags: ['format:reel'], confidence: 0.7 }] }, legacy: ['Posts on Sundays'], notes: [], tombstones: new Set(), source: 'read' });
    expect(p.insert.map((n) => [n.type, n.body, n.origin])).toEqual([['what_worked', 'Reels from Alfama did best', 'coach'], ['fact', 'Posts on Sundays', 'coach']]);
    expect(p.insert[1]!.confidence).toBe(0.5);
  });
  it('a tombstone blocks the same idea from coming back', () => {
    const p = planOps({ ops: { ...EMPTY, add: [{ type: 'like', text: 'Prefers SHORT captions!', tags: [], confidence: 0.6 }] }, legacy: [], notes: [], tombstones: new Set([noteHash('prefers short captions')]), source: 'draft' });
    expect(p.insert).toEqual([]);
  });
  it('a repeat confirms the existing note instead of adding a copy', () => {
    const n = note();
    const p = planOps({ ops: { ...EMPTY, add: [{ type: 'like', text: 'Prefers short captions.', tags: [], confidence: 0.6 }], confirm: [shortId(n.id), 'ffffff'] }, legacy: [], notes: [n], tombstones: new Set(), source: 'draft' });
    expect(p.insert).toEqual([]);
    expect(p.confirm).toEqual([n.id]);
  });
  it('never lets the coach dispute pinned notes or notes the member wrote', () => {
    const pinned = note({ pinned: true, body: 'Goal: 2,000 by March' });
    const mine = note({ origin: 'user', body: 'I never post selfies' });
    const coach = note({ body: 'Posts at 9am' });
    const p = planOps({ ops: { ...EMPTY, contradict: [{ id: shortId(pinned.id), text: 'Goal is 5,000' }, { id: shortId(mine.id), text: 'Posts selfies' }] }, legacy: [], notes: [pinned, mine, coach], tombstones: new Set(), source: 'chat' });
    expect(p.insert).toEqual([]);
    expect(p.dispute).toEqual([]);
    const q = planOps({ ops: { ...EMPTY, contradict: [{ id: shortId(coach.id), text: 'Posts at 6pm' }] }, legacy: [], notes: [coach], tombstones: new Set(), source: 'read' });
    expect(q.dispute).toEqual([coach.id]);
    expect(q.insert[0]).toMatchObject({ status: 'disputed', contradictsId: coach.id });
  });
  it('a member correction wins and replaces the note it fixes', () => {
    const coach = note({ body: 'Posts at 9am' });
    const p = planOps({ ops: { ...EMPTY, corrected: { text: 'Posts at 7pm after work', id: shortId(coach.id) } }, legacy: [], notes: [coach], tombstones: new Set(), source: 'chat' });
    expect(p.insert[0]).toMatchObject({ origin: 'user', confidence: 0.9, contradictsId: coach.id });
    expect(p.supersede).toEqual([{ id: coach.id, by: 0 }]);
  });
  it('scrubs handles from new notes', () => {
    const p = planOps({ ops: EMPTY, legacy: ['Collab with @rui.analog worked'], notes: [], tombstones: new Set(), source: 'chat' });
    expect(p.insert[0]!.body).toBe('Collab with @[account] worked');
  });
});
