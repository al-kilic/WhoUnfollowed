import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// The hard rule: free accounts (signed out or signed in) never trigger a paid
// model call. Every coach route checks for an active Pro AI plan first, and
// the AI runner is only reached from those routes.
const ROOT = join(__dirname);
function routes(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? routes(p) : f === 'route.ts' ? [p] : [];
  });
}

describe('AI routes', () => {
  const files = routes(ROOT);
  it('finds the routes', () => { expect(files.length).toBeGreaterThan(10); });
  for (const f of files) {
    it(`${f.slice(ROOT.length)} checks for Pro AI before doing anything`, () => {
      const src = readFileSync(f, 'utf8');
      const handlers = src.split(/export async function (?:GET|POST|PUT|DELETE)\(/).slice(1);
      expect(handlers.length).toBeGreaterThan(0);
      for (const h of handlers) {
        const body = h.slice(0, 400);
        expect(body).toMatch(/await guardProAi\(\);\s*\n\s*if \(!g\.ok\) return g\.response;/);
      }
    });
  }
});
