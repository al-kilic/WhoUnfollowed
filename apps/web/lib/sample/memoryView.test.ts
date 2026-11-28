import { describe, expect, it } from 'vitest';
import { getSampleLearned, getSampleMoments, getSampleNotes } from './learned';
import { sampleAnswer } from './sampleFetch';
import { grouped, archived, GROUPS, sameText } from '@/components/studio/you/memory/memoryTypes';

describe('sample memory', () => {
  for (const l of ['en', 'es', 'pt']) {
    it(`${l}: every note has text, no em dashes, no handles`, () => {
      const m = getSampleNotes(l);
      expect(m.notes.length).toBeGreaterThan(8);
      for (const n of m.notes) {
        expect(n.body.length).toBeGreaterThan(5);
        expect(n.body).not.toMatch(/—|@\w/);
      }
      for (const w of getSampleLearned(l).weeks) for (const line of w.lines) expect(line.text).not.toMatch(/—/);
    });
  }

  it('has a pinned note and a fading note, and groups every note it can show', () => {
    const { notes } = getSampleNotes('en');
    expect(notes.some((n) => n.pinned)).toBe(true);
    expect(notes.some((n) => n.status === 'faded')).toBe(true);
    const g = grouped(notes);
    const shown = GROUPS.reduce((n, k) => n + g[k].length, 0);
    expect(shown).toBe(notes.filter((n) => n.status !== 'archived').length);
    expect(archived(notes)).toHaveLength(0);
  });

  it('moments come from the sample exports: October 2026 is the best month', () => {
    const { moments } = getSampleMoments();
    expect(moments.find((m) => m.kind === 'best_month')?.at).toBe('2026-10');
  });

  it('sample fetch answers the memory routes and never saves', async () => {
    const u = (p: string) => new URL(`https://x.test/api/ai/${p}`);
    const notes = (await sampleAnswer(u('notes'), 'GET', 'en').json()) as { notes: unknown[] };
    expect(notes.notes).toHaveLength(getSampleNotes('en').notes.length);
    expect(await sampleAnswer(u('notes'), 'POST', 'en').json()).toEqual({ ok: true });
    expect(await sampleAnswer(u('voice'), 'POST', 'en').json()).toEqual({ ok: true, saved: 0 });
    const voice = (await sampleAnswer(u('voice'), 'GET', 'en').json()) as { voice: { stats: { captions: number } } };
    expect(voice.voice.stats.captions).toBeGreaterThan(0);
    const cs = (await sampleAnswer(u('content-stats?platform=instagram'), 'GET', 'en').json()) as { stats: unknown; ledger: { posts: number } };
    expect(cs.stats).toBeTruthy();
    expect(cs.ledger.posts).toBeGreaterThan(0);
    expect(await sampleAnswer(u('blindspots'), 'GET', 'en').json()).toEqual({ state: null });
    expect(((await sampleAnswer(u('learned'), 'GET', 'pt').json()) as { weeks: unknown[] }).weeks.length).toBeGreaterThan(0);
  });

  it('matches an added line to its note loosely', () => {
    expect(sameText('Prefers short captions.', 'prefers  short captions')).toBe(true);
    expect(sameText('Prefers short captions', 'Prefers long captions')).toBe(false);
  });
});

import { weekStart } from '@/components/studio/you/memory/memoryTypes';
describe('weekStart', () => {
  it('turns an ISO week into its Monday', () => {
    expect(weekStart('2026-W47')?.toISOString().slice(0, 10)).toBe('2026-11-16');
    expect(weekStart('2026-W01')?.toISOString().slice(0, 10)).toBe('2025-12-29');
    expect(weekStart('nope')).toBeNull();
  });
});

import { getMemoryContent } from '@/components/studio/you/memory/memory.content';
describe('moment labels', () => {
  it('every sample moment renders without undefined, in every language', () => {
    const { moments } = getSampleMoments();
    for (const l of ['en', 'es', 'pt'] as const) {
      const t = getMemoryContent(l);
      for (const m of moments) {
        const text = t.moments[m.kind]?.(m.params) ?? '';
        expect(text).not.toMatch(/undefined|NaN/);
        expect(text.length).toBeGreaterThan(5);
      }
    }
  });
});
