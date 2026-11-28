import { describe, expect, it } from 'vitest';
import { radarFacts } from './radarFacts.js';
import { exportStats } from './exportStats.js';
import { exportStatsSchema } from '../aiSchemas.js';
import type { ParsedSnapshot } from '../schemas.js';

const T = Date.UTC(2026, 10, 1) / 1000;
const DAY = 86_400;
const acc = (username: string, daysAgo: number) => ({ username, href: `https://instagram.com/${username}`, followedAt: T - daysAgo * DAY });

// Usernames that look like dates or numbers are the hardest case for a value filter.
function snap(prefix: string, n: number): ParsedSnapshot {
  const followers = Array.from({ length: n }, (_, i) => acc(`${prefix}fan.${i}`, 10 + i * 9));
  const spree = Array.from({ length: 14 }, (_, i) => acc(`2026-03-0${i % 9}`, 600));
  const following = [...followers.slice(0, n - 5), ...spree, ...Array.from({ length: 12 }, (_, i) => acc(`oneway_${i}`, 300 + i))];
  return {
    exportedAt: T, format: 'json', followers, following,
    pendingRequests: Array.from({ length: 4 }, (_, i) => acc(`pending.person${i}`, 400 + i)),
  } as unknown as ParsedSnapshot;
}

describe('radarFacts', () => {
  const cur = snap('', 60);
  const prev = snap('', 70);
  const facts = radarFacts(cur, prev, T);
  const names = [...cur.followers, ...cur.following, ...(cur.pendingRequests ?? []), ...prev.followers].map((a) => a.username);

  it('keeps ids and numbers or dates only', () => {
    expect(facts.length).toBeGreaterThan(2);
    for (const f of facts) {
      expect(f.id).toMatch(/^(fix|fact)\./);
      for (const v of Object.values(f.params)) expect(typeof v === 'number' || /^\d{4}-\d{2}(-\d{2})?$/.test(v)).toBe(true);
    }
  });

  it('never contains a username, an @handle or a profile link', () => {
    const text = JSON.stringify(facts);
    expect(text).not.toMatch(/@|instagram\.com|oneway_|fan\.|pending\.person/);
    for (const n of names) if (!/^\d{4}-\d{2}(-\d{2})?$/.test(n)) expect(text.includes(`"${n}"`)).toBe(false);
  });

  it('rides along in exportStats and passes the server schema', () => {
    const s = exportStats(cur, prev);
    expect(s.facts?.length).toBe(facts.length);
    expect(exportStatsSchema.safeParse(s).success).toBe(true);
  });

  it('the server schema rejects a username smuggled into a fact', () => {
    const s = exportStats(cur, prev);
    const bad = { ...s, facts: [{ id: 'fact.fans', params: { who: 'some.person' } }] };
    expect(exportStatsSchema.safeParse(bad).success).toBe(false);
    const badId = { ...s, facts: [{ id: 'fact.@someone', params: {} }] };
    expect(exportStatsSchema.safeParse(badId).success).toBe(false);
  });
});
