import { readFileSync } from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';
import { exportStats } from '@ig-tracker/core';
import { buildCoachContext, scrubHandles } from './coachContext';
import { userPartOfMemory, type Note } from './noteMath';
import { CHARS_PER_TOKEN, CORE_MAX_CHARS, NOTE_BUDGET, coreNotes, renderNote, selectNotes, type NoteAction } from './retrieve';
import { briefDigest } from './briefContext.digest';
import { getSampleSnapshots } from '@/lib/sample/sampleSnapshot';

// Inês's sample account: three real-shaped exports, the stats the browser would send.
const snaps = getSampleSnapshots();
const stats = [exportStats(snaps[2]!, snaps[1]!), exportStats(snaps[1]!, snaps[0]!), exportStats(snaps[0]!)];
const md = readFileSync(path.join(process.cwd(), 'content/briefs/2026-11-23/photo-video.en.md'), 'utf8');
const d = briefDigest(md);
const base = {
  accountLine: 'Type: creator. Niche: film photography. Goal: grow.',
  extraLines: ['Posts on Tuesday, Thursday, Saturday; plans should put posts on these days.'],
  goal: true,
  memory: 'Shoots film portraits in Lisbon. Collab idea with @rui.analog next month. Email me at ines@example.com',
  stats,
  results: ['- carousel about "Lisbon light" (from the plan); results: +34 followers'],
  brief: { date: '2026-11-23', lines: [`Weekly brief of 2026-11-23 (photo-video): ${d.title}`, ...d.items.map((i) => `- ${i}`)] },
};

describe('coach context', () => {
  const ctx = buildCoachContext(base);

  it('never contains a username from the snapshot', () => {
    const names = new Set(snaps.flatMap((s) => [...s.followers, ...s.following, ...(s.pendingRequests ?? [])].map((a) => a.username)));
    expect(names.size).toBeGreaterThan(1000);
    for (const n of names) expect(ctx.text.includes(n)).toBe(false);
  });

  it('turns typed @handles into a placeholder, but leaves email addresses alone', () => {
    expect(ctx.text).not.toMatch(/(^|[^\w.])@[A-Za-z0-9._]{2,}/);
    expect(ctx.text).toContain('@[account]');
    expect(scrubHandles('ines@example.com')).toBe('ines@example.com');
  });

  it('includes Radar findings and the brief, and says so in the sources', () => {
    expect(ctx.text).toContain('# Radar findings');
    expect(ctx.text).toContain('# This week on the platforms');
    expect(ctx.sources).toMatchObject({ exports: 3, goal: true, posted: 1, memory: true, brief: '2026-11-23' });
    expect(ctx.sources.facts).toBeGreaterThan(2);
    expect(ctx.sources.since).toBe(snaps[0]!.exportedAt);
  });

  it('stays small with everything in (logged so the size can be tracked)', () => {
    const before = buildCoachContext({ ...base, brief: null, stats: stats.map((s) => ({ ...s, facts: [] })) });
    console.log(`[context size] before=${before.text.length} after=${ctx.text.length} chars`);
    expect(ctx.text.length).toBeLessThan(6000);
  });
});

// Memory v2: per-layer budgets instead of one size limit (spec section 1).
describe('context budgets with notes', () => {
  let seq = 0;
  const mk = (o: Partial<Note>): Note => ({
    id: `${(++seq).toString(16).padStart(6, '0')}bb-0000-4000-8000-000000000000`, type: 'fact', body: 'note', examples: '[]', tags: [],
    source: 'read', origin: 'coach', confidence: 0.7, importance: 3, pinned: false, status: 'active', evidenceCount: 1,
    lastConfirmedAt: new Date('2026-11-01'), contradictsId: null, createdAt: new Date('2026-11-01'), ...o,
  });
  const types = ['fact', 'like', 'dislike', 'voice', 'what_worked', 'what_didnt', 'audience', 'photo', 'goal', 'context'];
  const notes: Note[] = [
    ...Array.from({ length: 6 }, (_, i) => mk({ pinned: i < 2, type: i < 2 ? 'goal' : 'like', importance: 5, evidenceCount: 3, body: `Strong preference ${i}: short lines, no hashtags, film colours, warm tone` })),
    ...Array.from({ length: 200 }, (_, i) => mk({ type: types[i % types.length]!, importance: (i % 5) + 1, body: `Note ${i}: carousels from the Alfama at golden hour bring follows on Thursdays`, tags: i % 2 ? ['format:carousel'] : [] })),
  ];
  const core = coreNotes(notes);
  const now = new Date('2026-11-23T12:00:00Z');

  for (const action of Object.keys(NOTE_BUDGET) as NoteAction[]) {
    it(`${action}: core within ${CORE_MAX_CHARS} chars, task notes within budget, no handles`, () => {
      const picked = selectNotes(notes, action, ['format:carousel'], now, new Set(core.map((n) => n.id)));
      const c = buildCoachContext({ ...base, memory: userPartOfMemory(base.memory), coreNotes: core.map(renderNote), notes: picked.map(renderNote) });
      expect(c.core.length).toBeLessThanOrEqual(CORE_MAX_CHARS);
      const section = c.volatile.split('# Notes for this task')[1] ?? '';
      expect(section.length).toBeLessThanOrEqual(NOTE_BUDGET[action] * CHARS_PER_TOKEN + 60);
      expect(c.text).not.toMatch(/(^|[^\w.])@[A-Za-z0-9._]{2,30}/);
      expect(c.text.length).toBeLessThan(13000);
    });
  }

  it('keeps the cached core byte-identical across days', () => {
    const a = buildCoachContext({ ...base, coreNotes: coreNotes(notes).map(renderNote) }).core;
    const later = notes.map((n) => ({ ...n, lastConfirmedAt: new Date('2027-03-01') }));
    const b = buildCoachContext({ ...base, coreNotes: coreNotes(later).map(renderNote) }).core;
    expect(b).toBe(a);
  });
});

describe('sample "what the coach saw"', () => {
  it('is built by the same code, with no sample usernames', async () => {
    const { getSampleSeen } = await import('@/lib/sample/coach/seen');
    const seen = getSampleSeen();
    expect(seen.sources).toMatchObject({ exports: 3, goal: true, memory: true, brief: '2026-11-23' });
    const names = new Set(snaps.flatMap((s) => [...s.followers, ...s.following].map((a) => a.username)));
    for (const n of names) expect(seen.text.includes(n)).toBe(false);
  });
});
