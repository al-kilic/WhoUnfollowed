import { describe, expect, it } from 'vitest';
import { buildLedger, ledgerLines, ledgerNotes, postGains, topicTags } from './ledger';

const T = (iso: string) => Math.floor(Date.parse(`${iso}T10:00:00Z`) / 1000);
const exports = [{ exportedAt: T('2026-02-01'), followers: 1000 }, { exportedAt: T('2026-03-01'), followers: 1060 }, { exportedAt: T('2026-04-01'), followers: 1090 }];
const post = (format: string, day: string, newFollowers?: number, topic = 'roll of film') =>
  ({ format, topic, postedAt: new Date(`${day}T18:00:00Z`), results: newFollowers === undefined ? null : JSON.stringify({ newFollowers }) });

describe('postGains', () => {
  it('uses the logged result when there is one', () => {
    const g = postGains([post('carousel', '2026-02-10', 40)], exports);
    expect(g).toEqual([expect.objectContaining({ format: 'carousel', newFollowers: 40, estimated: false })]);
  });

  it('splits the net gain between two exports among the unlogged posts in that window', () => {
    const g = postGains([post('photo', '2026-02-10'), post('reel', '2026-02-20'), post('photo', '2026-03-10')], exports);
    const feb = g.filter((x) => x.at < T('2026-03-01'));
    expect(feb.map((x) => x.newFollowers)).toEqual([30, 30]); // +60 shared by 2
    expect(g.find((x) => x.at > T('2026-03-01'))!.newFollowers).toBe(30); // +30 for 1
    expect(g.every((x) => x.estimated)).toBe(true);
  });

  it('skips posts outside any export window and never counts losses as negative', () => {
    const drop = [{ exportedAt: T('2026-01-01'), followers: 500 }, { exportedAt: T('2026-02-01'), followers: 480 }];
    expect(postGains([post('photo', '2025-12-01')], drop)).toEqual([]);
    expect(postGains([post('photo', '2026-01-10')], drop)[0]!.newFollowers).toBe(0);
  });

  it('ignores posts that were never marked as posted', () => {
    expect(postGains([{ format: 'reel', topic: 'x', postedAt: null, results: null }], exports)).toEqual([]);
  });
});

describe('buildLedger', () => {
  const l = buildLedger([post('carousel', '2026-02-05', 50, 'film colour fix'), post('carousel', '2026-02-12', 30, 'film light'), post('photo', '2026-02-15', 4), post('photo', '2026-02-25', 2), post('reel', '2026-03-03', 14)], exports);

  it('averages per post, by format, against the overall average', () => {
    expect(l.avgAll).toBe(20);
    const car = l.formats.find((r) => r.key === 'format:carousel')!;
    expect(car).toMatchObject({ posts: 2, avgNew: 40, vsAll: 2, estimated: false });
    expect(l.formats.find((r) => r.key === 'format:photo')).toMatchObject({ posts: 2, avgNew: 3, vsAll: 0.15 });
  });

  it('groups topic words that appear in two or more posts', () => {
    expect(l.topics.map((r) => r.key)).toContain('topic:film');
    expect(l.topics.every((r) => r.posts >= 2)).toBe(true);
    expect(topicTags('Why my FILM looked cold, and the fix')).toEqual(['topic:film', 'topic:looked', 'topic:cold']);
  });

  it('writes what worked and what did not as notes, in the member\'s language', () => {
    const en = ledgerNotes(l, 'en');
    expect(en.map((n) => n.type)).toEqual(['what_worked', 'what_didnt']);
    expect(en[0]!.body).toBe('Carousels bring about 40 new followers a post, 2x your average (2 posts).');
    expect(en.every((n) => n.origin === 'code' && n.source === 'export')).toBe(true);
    expect(ledgerNotes(l, 'pt')[0]!.body).toContain('Os carrosséis');
    for (const n of [...en, ...ledgerNotes(l, 'es'), ...ledgerNotes(l, 'pt')]) expect(n.body).not.toContain('—');
  });

  it('needs two posts of a format before writing a note', () => {
    expect(ledgerNotes(buildLedger([post('carousel', '2026-02-05', 90), post('photo', '2026-02-06', 1)], exports))).toEqual([]);
  });

  it('gives the coach short lines, no titles', () => {
    const lines = ledgerLines(l);
    expect(lines[0]).toBe('Average: 20 new followers per post over 5 posts.');
    expect(lines.join('\n')).not.toContain('colour fix');
  });
});
