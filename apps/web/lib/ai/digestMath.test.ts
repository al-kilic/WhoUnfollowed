import { describe, expect, it, vi } from 'vitest';
import { aiDigestSchema } from '@ig-tracker/core';
import { DIGEST_MIN_CHANGES, planDigest, shouldDigest } from './digestMath';
import { noteHash, type Note } from './noteMath';

vi.mock('server-only', () => ({}));

const note = (id: string, over: Partial<Note> = {}): Note => ({
  id, type: 'like', body: `note ${id}`, examples: '[]', tags: [], source: 'chat', origin: 'coach', confidence: 0.6, importance: 3, pinned: false,
  status: 'active', evidenceCount: 1, lastConfirmedAt: new Date('2026-11-01'), contradictsId: null, createdAt: new Date('2026-11-01'), ...over,
});
// shortId: the first 6 hex characters of the uuid.
const A = note('aaaaaa00-0000-4000-8000-000000000001', { tags: ['format:reel'], importance: 2 });
const B = note('bbbbbb00-0000-4000-8000-000000000002', { tags: ['tone:short'], importance: 4, confidence: 0.8 });
const PIN = note('cccccc00-0000-4000-8000-000000000003', { pinned: true });
const MINE = note('dddddd00-0000-4000-8000-000000000004', { origin: 'user' });
const notes = [A, B, PIN, MINE];
const digest = (d: object) => aiDigestSchema.parse(d);

describe('shouldDigest', () => {
  it('runs at most once per new export, and only when enough changed', () => {
    expect(shouldDigest({ lastExport: null, exportKey: '100', changes: DIGEST_MIN_CHANGES })).toBe(true);
    expect(shouldDigest({ lastExport: '100', exportKey: '100', changes: 50 })).toBe(false);
    expect(shouldDigest({ lastExport: '100', exportKey: '200', changes: DIGEST_MIN_CHANGES - 1 })).toBe(false);
    expect(shouldDigest({ lastExport: '100', exportKey: '200', changes: 5 })).toBe(true);
  });
});

describe('planDigest', () => {
  it('merges two of the coach\'s notes into one and keeps the stronger values', () => {
    const p = planDigest(digest({ merge: [{ ids: ['aaaaaa', 'bbbbbb'], text: 'Short Reels, said simply' }] }), notes);
    expect(p.insert).toHaveLength(1);
    expect(p.insert[0]).toMatchObject({ body: 'Short Reels, said simply', origin: 'coach', source: 'digest', importance: 4, confidence: 0.8, mergeOf: [A.id, B.id] });
    expect(p.insert[0]!.tags).toEqual(['format:reel', 'tone:short']);
  });

  it('never merges, archives or re-ranks pinned notes or notes the member wrote', () => {
    const p = planDigest(digest({
      merge: [{ ids: ['aaaaaa', 'cccccc'], text: 'x' }, { ids: ['bbbbbb', 'dddddd'], text: 'y' }],
      archive: ['cccccc', 'dddddd'],
      importance: [{ id: 'cccccc', importance: 1 }, { id: 'dddddd', importance: 1 }],
    }), notes);
    expect(p).toEqual({ insert: [], archive: [], importance: [] });
  });

  it('archives and re-ranks the coach\'s own notes, each note touched once', () => {
    const p = planDigest(digest({ archive: ['aaaaaa', 'aaaaaa', 'ffffff'], importance: [{ id: 'aaaaaa', importance: 5 }, { id: 'bbbbbb', importance: 5 }] }), notes);
    expect(p.archive).toEqual([A.id]);
    expect(p.importance).toEqual([{ id: B.id, importance: 5 }]);
  });

  it('adds only new ideas: no duplicates, nothing the member told it to forget, no handles', () => {
    const p = planDigest(digest({ add: [{ type: 'like', text: 'note aaaaaa00-0000-4000-8000-000000000001' }, { type: 'fact', text: 'Forgotten thing' }, { type: 'fact', text: 'Works with @someone.else on Sundays' }] }), notes, new Set([noteHash('Forgotten thing')]));
    expect(p.insert.map((n) => n.body)).toEqual(['Works with @[account] on Sundays']);
  });

  it('drops anything the schema refuses before it reaches the plan', () => {
    expect(aiDigestSchema.safeParse({ merge: [{ ids: ['aaaaaa'], text: 'one id' }] }).success).toBe(false);
    expect(aiDigestSchema.safeParse({ archive: ['not-an-id'] }).success).toBe(false);
  });
});

describe('roll-ups (3C)', () => {
  const O1 = note('e1e1e100-0000-4000-8000-000000000011', { status: 'archived', tags: ['format:reel'] });
  const O2 = note('e2e2e200-0000-4000-8000-000000000012', { status: 'archived', tags: ['time:morning'] });
  const O3 = note('e3e3e300-0000-4000-8000-000000000013', { status: 'archived' });
  const F = note('f1f1f100-0000-4000-8000-000000000014', { status: 'faded' });
  const older = [O1, O2, O3];

  it('folds 3 or more older or faded notes into one rollup note that supersedes them', () => {
    const plan = planDigest(digest({ rollup: [{ ids: ['e1e1e1', 'e2e2e2', 'f1f1f1'], text: 'Early on, reels in the morning did best.' }] }), [...notes, F], new Set(), older);
    expect(plan.insert).toHaveLength(1);
    expect(plan.insert[0]).toMatchObject({ type: 'rollup', body: 'Early on, reels in the morning did best.', importance: 2, source: 'digest', origin: 'coach' });
    expect(plan.insert[0]!.mergeOf.sort()).toEqual([O1.id, O2.id, F.id].sort());
    expect(plan.insert[0]!.tags).toEqual(['format:reel', 'time:morning']);
  });

  it('skips roll-ups of active, pinned or member notes, unknown ids, or fewer than three', () => {
    const d = digest({ rollup: [
      { ids: ['e1e1e1', 'e2e2e2', 'aaaaaa'], text: 'includes an active note' },
      { ids: ['e1e1e1', 'e2e2e2', 'cccccc'], text: 'includes a pinned note' },
      { ids: ['e1e1e1', 'e2e2e2', '999999'], text: 'unknown id' },
    ] });
    expect(planDigest(d, notes, new Set(), older).insert).toEqual([]);
    expect(aiDigestSchema.safeParse({ rollup: [{ ids: ['e1e1e1', 'e2e2e2'], text: 'two' }] }).success).toBe(false);
  });

  it('a tombstoned line is never written back', () => {
    const text = 'Forgotten gist.';
    const plan = planDigest(digest({ rollup: [{ ids: ['e1e1e1', 'e2e2e2', 'e3e3e3'], text }] }), notes, new Set([noteHash(text)]), older);
    expect(plan.insert).toEqual([]);
  });
});
