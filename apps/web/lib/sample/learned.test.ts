import { describe, expect, it } from 'vitest';
import { getSampleLearned, getSampleLedger, getSampleMoments, getSampleNotes } from './learned';

describe('Inês: what her coach knows and learned', () => {
  it('has the same 14 notes in every language, with sources and dates', () => {
    const [en, es, pt] = (['en', 'es', 'pt'] as const).map((l) => getSampleNotes(l).notes);
    expect(en).toHaveLength(14);
    expect(es!.map((n) => n.id)).toEqual(en!.map((n) => n.id));
    expect(pt!.map((n) => n.id)).toEqual(en!.map((n) => n.id));
    expect(new Set(en!.map((n) => n.type))).toEqual(new Set(['fact', 'goal', 'what_worked', 'what_didnt', 'like', 'dislike', 'voice', 'audience', 'context', 'photo']));
    for (const n of [...en!, ...es!, ...pt!]) {
      expect(n.body).not.toContain('—');
      expect(n.body).not.toMatch(/(^|[^\w.])@[A-Za-z]/);
      expect(Date.parse(n.sourceAt)).not.toBeNaN();
    }
  });

  it('agrees with her ledger: carousels about 42 a post, single photos about 4', () => {
    const l = getSampleLedger();
    expect(l.avgAll).toBe(19);
    expect(l.formats.find((r) => r.key === 'format:carousel')).toMatchObject({ posts: 2, avgNew: 41.5, vsAll: 2.18, estimated: false });
    expect(l.formats.find((r) => r.key === 'format:photo')).toMatchObject({ posts: 2, avgNew: 4 });
    expect(getSampleNotes('en').notes.find((n) => n.type === 'what_worked' && n.source === 'export')!.body).toContain('about 42');
  });

  it('one weekly note, pointing at real notes', () => {
    const w = getSampleLearned('en').weeks[0]!;
    const ids = new Set(getSampleNotes('en').notes.map((n) => n.id));
    expect(w.weekKey).toBe('2026-W47');
    expect(w.lines.every((l) => !l.noteId || ids.has(l.noteId))).toBe(true);
    expect(w.lines.map((l) => l.kind)).toContain('fading');
  });

  it('moments: October 2026 was her best month, with 72 new followers', () => {
    const m = getSampleMoments().moments;
    expect(m.find((x) => x.kind === 'best_month')).toMatchObject({ at: '2026-10', params: expect.objectContaining({ followers: 72 }) });
    expect(m.some((x) => x.kind === 'quiet_month' && x.at === '2026-07')).toBe(true);
  });
});
