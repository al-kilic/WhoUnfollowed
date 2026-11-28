import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { GUIDE_PACKS, STUDIO_ROUTES, guideFor } from './guides.content';
import { TAB_HINTS, TAB_KEYS } from './tabHints.content';

const LOCALES = ['en', 'es', 'pt'] as const;

// Every page under app/[locale]/app (except the /app redirect) needs a guide.
function studioRoutesOnDisk(): string[] {
  const root = path.join(__dirname, '../../app/[locale]/app');
  const out: string[] = [];
  const walk = (dir: string, rel: string) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory()) walk(path.join(dir, e.name), `${rel}/${e.name}`);
      else if (e.name === 'page.tsx' && rel) out.push(`/app${rel}`);
    }
  };
  walk(root, '');
  return out;
}

describe('Studio page guides', () => {
  it('cover every Studio route on disk', () => {
    for (const r of studioRoutesOnDisk()) expect(STUDIO_ROUTES, r).toContain(r);
  });
  it('exist in en, es and pt with steps and a good-to-know line, no em dashes', () => {
    for (const l of LOCALES) {
      for (const r of STUDIO_ROUTES) {
        const g = GUIDE_PACKS[l].guides[r];
        expect(g.lead.length, `${l} ${r}`).toBeGreaterThan(20);
        expect(g.steps.length, `${l} ${r}`).toBeGreaterThanOrEqual(2);
        expect(g.good.length, `${l} ${r}`).toBeGreaterThan(10);
        expect(JSON.stringify(g), `${l} ${r}`).not.toContain('—');
      }
    }
  });
  it('resolve nested and bare paths', () => {
    expect(guideFor('/app', 'en')).toBe(GUIDE_PACKS.en.guides['/app/today']);
    expect(guideFor('/app/radar/people', 'es')).toBe(GUIDE_PACKS.es.guides['/app/radar/people']);
    expect(guideFor('/app/history/compare', 'pt')).toBe(GUIDE_PACKS.pt.guides['/app/history/compare']);
  });
});

describe('Section tab hints', () => {
  it('exist for every tab in en, es and pt, no em dashes', () => {
    for (const l of LOCALES) for (const k of TAB_KEYS) {
      expect(TAB_HINTS[l][k].length, `${l} ${k}`).toBeGreaterThan(10);
      expect(TAB_HINTS[l][k]).not.toContain('—');
    }
  });
});
