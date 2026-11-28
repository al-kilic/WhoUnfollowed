import { describe, expect, it } from 'vitest';
import { buildLearnedNote, weekKey, weekStart } from './learnedNote';

const now = new Date('2026-11-26T10:00:00Z'); // a Thursday
const d = (iso: string) => new Date(iso);
const note = (id: string, over: Partial<Parameters<typeof buildLearnedNote>[0]['notes'][number]> = {}) => ({
  id, body: `note ${id}`, type: 'like', status: 'active', importance: 3, origin: 'coach', createdAt: d('2026-10-01T00:00:00Z'),
  lastConfirmedAt: d('2026-10-01T00:00:00Z'), evidenceCount: 1, contradictsId: null, ...over,
});

describe('weekKey', () => {
  it('uses ISO weeks that start on Monday', () => {
    expect(weekKey(d('2026-11-23T00:00:00Z'))).toBe('2026-W48');
    expect(weekKey(d('2026-11-22T23:00:00Z'))).toBe('2026-W47');
    expect(weekKey(d('2027-01-01T12:00:00Z'))).toBe('2026-W53');
    expect(weekStart(now).toISOString()).toBe('2026-11-23T00:00:00.000Z');
  });
});

describe('buildLearnedNote', () => {
  it('lists up to 3 new or confirmed notes, most important first, then fading, disputes and forgets', () => {
    const notes = [
      note('a', { createdAt: d('2026-11-24T09:00:00Z'), lastConfirmedAt: d('2026-11-24T09:00:00Z'), importance: 2 }),
      note('b', { createdAt: d('2026-11-25T09:00:00Z'), lastConfirmedAt: d('2026-11-25T09:00:00Z'), importance: 5 }),
      note('c', { lastConfirmedAt: d('2026-11-24T12:00:00Z'), evidenceCount: 3, importance: 4 }),
      note('d', { createdAt: d('2026-11-23T09:00:00Z'), lastConfirmedAt: d('2026-11-23T09:00:00Z'), importance: 1 }),
      note('f', { status: 'faded', body: 'Posts at 9 a.m.' }),
      note('old', { body: 'Reels do best' }),
      note('new', { status: 'disputed', body: 'Carousels do best', contradictsId: 'old' }),
    ];
    const r = buildLearnedNote({ notes, events: [{ kind: 'forget', createdAt: d('2026-11-24T10:00:00Z') }, { kind: 'forget', createdAt: d('2026-11-10T10:00:00Z') }], now });
    expect(r.weekKey).toBe('2026-W48');
    expect(r.lines.map((l) => [l.kind, l.noteId])).toEqual([['learned', 'b'], ['confirmed', 'c'], ['learned', 'a'], ['fading', 'f'], ['disputed', 'new'], ['forgot', undefined]]);
    expect(r.lines[3]!.text).toBe('Fading: "Posts at 9 a.m.". Keep it?');
    expect(r.lines[4]!.text).toContain('"Reels do best" and "Carousels do best"');
    expect(r.lines[5]!.text).toBe("You asked your coach to forget one note. It won't bring it up again.");
  });

  it('is empty in a quiet week, and speaks the member\'s language', () => {
    expect(buildLearnedNote({ notes: [note('x')], events: [], now }).lines).toEqual([]);
    const es = buildLearnedNote({ notes: [note('f', { status: 'faded', body: 'X' })], events: [], now, locale: 'es' });
    expect(es.lines[0]!.text).toBe('Se está olvidando: "X". ¿Lo mantienes?');
  });

  it('never writes an em dash', () => {
    for (const locale of ['en', 'es', 'pt'] as const) {
      const r = buildLearnedNote({ notes: [note('f', { status: 'faded' }), note('o'), note('n', { status: 'disputed', contradictsId: 'o' })], events: [{ kind: 'forget', createdAt: now }], now, locale });
      expect(r.lines.map((l) => l.text).join(' ')).not.toContain('—');
    }
  });
});
