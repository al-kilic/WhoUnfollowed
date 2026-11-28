import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { BRIEF_PHOTOS, briefPhoto, formatOf, parseBriefCards } from './briefCards';

const dir = join(__dirname, '..', 'content', 'briefs');
const latest = readdirSync(dir).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)).sort().pop()!;

describe('parseBriefCards', () => {
  for (const lang of ['en', 'es', 'pt']) {
    it(`parses the real general edition (${lang})`, () => {
      const c = parseBriefCards(readFileSync(join(dir, latest, `general.${lang}.md`), 'utf8'))!;
      expect(c).not.toBeNull();
      expect(c.news.length).toBeGreaterThanOrEqual(3);
      for (const n of c.news) { expect(n.title.length).toBeGreaterThan(5); expect(n.why).toBeTruthy(); expect(n.doThis).toBeTruthy(); expect(n.source?.url).toMatch(/^https:\/\//); }
      expect(c.ideas).toHaveLength(5);
      expect(c.ideas.filter((i) => i.hook).length).toBeGreaterThanOrEqual(4);
      expect(c.tryThis).toBeTruthy();
    });
  }

  it('parses every niche edition of the latest week', () => {
    for (const f of readdirSync(join(dir, latest)).filter((x) => x.endsWith('.md'))) {
      expect(parseBriefCards(readFileSync(join(dir, latest, f), 'utf8')), f).not.toBeNull();
    }
  });

  it('returns null for markdown without the brief shape', () => {
    expect(parseBriefCards('just text')).toBeNull();
    expect(parseBriefCards('# Title\n\nonly a paragraph')).toBeNull();
  });

  it('detects formats and picks bundled photos deterministically', () => {
    expect(formatOf('Reel')).toBe('reel');
    expect(formatOf('Carrusel')).toBe('carousel');
    expect(formatOf('Story sequence')).toBe('story');
    expect(formatOf('Threads post')).toBe('threads');
    expect(briefPhoto('2026-11-23:general:0')).toBe(briefPhoto('2026-11-23:general:0'));
    expect(BRIEF_PHOTOS).toContain(briefPhoto('x'));
  });
});
