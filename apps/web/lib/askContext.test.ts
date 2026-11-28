import { describe, expect, it } from 'vitest';
import type { ParsedSnapshot } from '@ig-tracker/core';
import { checkSummary, fitsContext, goalSummary, radarSummary, reportSummary } from './askContext';

const acc = (u: string, t = 1_600_000_000) => ({ username: u, href: `https://instagram.com/${u}`, followedAt: t });
const snap = (exportedAt: number, followers: string[], following: string[]): ParsedSnapshot => ({
  exportedAt, followers: followers.map((u) => acc(u)), following: following.map((u) => acc(u)), platform: 'instagram',
});

describe('ask context summaries', () => {
  const prev = snap(1_700_000_000, ['secret_ana', 'secret_bo'], ['secret_ana', 'secret_cy']);
  const now = snap(1_710_000_000, ['secret_ana', 'secret_dee'], ['secret_ana', 'secret_cy', 'secret_eve']);

  it('reports counts and change since the previous export, never usernames', () => {
    const t = reportSummary(now, prev);
    expect(t).toContain('Followers: 2');
    expect(t).toContain("Don't follow back: 2");
    expect(t).toMatch(/1 new followers, 1 left/);
    expect(t).not.toMatch(/secret_/);
  });
  it('radar summary has no usernames either', () => {
    expect(radarSummary(now, 1_720_000_000)).not.toMatch(/secret_/);
  });
  it('says when there is nothing to compare with', () => {
    expect(reportSummary(now)).toContain('No earlier export');
  });
  it('summarises a goal and post checks', () => {
    expect(goalSummary({ platform: 'instagram', goal: { type: 'followers', target: 3000, by: '2027-01-01', startFollowers: 2700 }, current: 2800, progress: { pct: 33, status: 'on_track' }, habit: null })).toContain('3000 followers by 2027-01-01');
    expect(goalSummary(null)).toBe('');
    expect(checkSummary([{ format: 'reel', hook: 'Golden hour', score: 82, postedAt: null, results: null }])).toContain('check score 82');
  });
  it('enforces the total context limit', () => {
    expect(fitsContext([{ kind: 'plan', label: 'a', text: 'x'.repeat(4001) }])).toBe(false);
    expect(fitsContext([{ kind: 'plan', label: 'a', text: 'x'.repeat(100) }])).toBe(true);
  });
});
