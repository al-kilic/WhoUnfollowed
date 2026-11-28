import { describe, expect, it } from 'vitest';
import { learnFromSignals, type SignalRow } from './learnRules';

const now = new Date('2026-11-23T12:00:00Z');
let t = 0;
const sig = (kind: string, payload: object, hoursAgo = ++t): SignalRow => ({ kind, action: 'draft', payload: JSON.stringify(payload), createdAt: new Date(now.getTime() - hoursAgo * 3_600_000) });
const diff = (o: object) => ({ lengthDelta: 0, wordsBefore: 10, wordsAfter: 10, emojiDelta: 0, hashtagDelta: 0, lineBreakDelta: 0, caseChange: 'none', removed: [], added: [], ...o });
const rules = (rows: SignalRow[], locale: 'en' | 'es' | 'pt' = 'en') => learnFromSignals(rows, locale, now).proposals.map((p) => p.rule);

describe('learning from picks', () => {
  it('3 short picks out of the last 5 make a "short captions" like, with examples', () => {
    const rows = [sig('draft_pick', { option: 0, of: 3, text: 'Lisbon, 7am.' }), sig('draft_pick', { option: 1, of: 3, text: 'Three frames.' }), sig('draft_pick', { option: 0, of: 3, text: 'Light first.' })];
    const r = learnFromSignals(rows, 'en', now);
    expect(r.proposals[0]).toMatchObject({ rule: 'short_captions', note: { type: 'like', body: 'Prefers short, one-line captions', origin: 'code' } });
    expect(r.proposals[0]!.note.examples).toHaveLength(3);
  });
  it('long picks or too few picks learn nothing', () => {
    const long = 'x'.repeat(200);
    expect(rules([sig('draft_pick', { text: long }), sig('draft_pick', { text: long }), sig('draft_pick', { text: long })])).toEqual([]);
    expect(rules([sig('draft_pick', { text: 'short' }), sig('draft_pick', { text: 'short' })])).toEqual([]);
  });
});

describe('learning from edits', () => {
  it('hashtags removed twice make a dislike with before and after', () => {
    const rows = [
      sig('draft_edit', { option: 0, diff: diff({ hashtagDelta: -3 }), before: 'Morning #lisbon #film', after: 'Morning' }),
      sig('draft_edit', { option: 1, diff: diff({ hashtagDelta: -2 }), before: 'Tram #lisboa', after: 'Tram' }),
    ];
    const p = learnFromSignals(rows, 'en', now).proposals.find((x) => x.rule === 'no_hashtags')!;
    expect(p.note).toMatchObject({ type: 'dislike', body: 'Removes hashtags from drafts' });
    expect(p.note.examples![0]).toEqual({ before: 'Morning #lisbon #film', after: 'Morning' });
  });
  it('the same phrase cut twice becomes a phrase to avoid', () => {
    const rows = [sig('draft_edit', { diff: diff({ removed: ['golden hour magic'] }) }), sig('draft_edit', { diff: diff({ removed: ['Golden hour magic'] }) })];
    expect(rules(rows)).toContain('phrase:golden hour magic');
    expect(learnFromSignals(rows, 'en', now).proposals[0]!.note.body).toBe('Doesn\'t say "golden hour magic"');
  });
  it('writes notes in the member\'s language', () => {
    const rows = [sig('draft_edit', { diff: diff({ emojiDelta: -2 }) }), sig('draft_edit', { diff: diff({ emojiDelta: -1 }) })];
    expect(learnFromSignals(rows, 'pt', now).proposals[0]!.note.body).toBe('Tira os emojis dos rascunhos');
  });
});

describe('learning from thumbs', () => {
  it('two "too generic" thumbs this week make a dislike; older ones do not count', () => {
    expect(rules([sig('thumb', { up: false, chip: 'too_generic' }, 2), sig('thumb', { up: false, chip: 'too_generic' }, 30)])).toContain('too_generic');
    expect(rules([sig('thumb', { up: false, chip: 'too_generic' }, 2), sig('thumb', { up: false, chip: 'too_generic' }, 24 * 9)])).not.toContain('too_generic');
  });
  it('two "not my voice" thumbs lower trust in voice notes', () => {
    expect(learnFromSignals([sig('thumb', { up: false, chip: 'not_my_voice' }), sig('thumb', { up: false, chip: 'not_my_voice' })], 'en', now).lowerVoice).toBe(true);
    expect(learnFromSignals([sig('thumb', { up: true, chip: null }), sig('thumb', { up: false, chip: 'not_my_voice' })], 'en', now).lowerVoice).toBe(false);
  });
});

it('never writes em dashes in any language', () => {
  const rows = [
    sig('draft_pick', { text: 'a b' }), sig('draft_pick', { text: 'c d' }), sig('draft_pick', { text: 'e f' }),
    sig('draft_edit', { diff: diff({ hashtagDelta: -1, emojiDelta: -1, lengthDelta: -40, removed: ['stock phrase'] }) }),
    sig('draft_edit', { diff: diff({ hashtagDelta: -1, emojiDelta: -1, lengthDelta: -40, removed: ['stock phrase'] }) }),
    sig('thumb', { up: false, chip: 'too_long' }), sig('thumb', { up: false, chip: 'too_long' }),
  ];
  for (const l of ['en', 'es', 'pt'] as const) for (const p of learnFromSignals(rows, l, now).proposals) expect(p.note.body).not.toContain('—');
});
