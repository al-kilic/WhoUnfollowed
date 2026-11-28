import { describe, expect, it } from 'vitest';
import { currentUpdates, platformUpdateSchema, updateLines, type PlatformUpdate } from './platformUpdates.js';

const NOW = new Date('2026-12-01T12:00:00Z');
const u = (o: Partial<PlatformUpdate> & { id: string }): PlatformUpdate => platformUpdateSchema.parse({
  platform: 'instagram', summary: 'Something changed on the platform.', status: 'live', firstSeen: '2026-11-01', lastVerified: '2026-11-20', source: 'https://example.com/a', ...o,
});

describe('currentUpdates', () => {
  it('keeps fresh live items, drops ones not checked for 90 days, marks 60+ as stale', () => {
    const out = currentUpdates([u({ id: 'fresh' }), u({ id: 'oldish', lastVerified: '2026-09-25' }), u({ id: 'old', lastVerified: '2026-08-01' })], NOW);
    expect(out.map((c) => [c.update.id, c.stale])).toEqual([['fresh', false], ['oldish', true]]);
  });

  it('tests fade after 45 days; stopped changes stay 120 days as no longer true', () => {
    const out = currentUpdates([
      u({ id: 'test-new', status: 'testing', lastVerified: '2026-11-10' }),
      u({ id: 'test-old', status: 'testing', lastVerified: '2026-10-01' }),
      u({ id: 'rolled-back', status: 'reverted', statusChangedAt: '2026-10-01' }),
      u({ id: 'long-gone', status: 'ended', statusChangedAt: '2026-06-01' }),
    ], NOW);
    expect(out.map((c) => c.update.id).sort()).toEqual(['rolled-back', 'test-new']);
  });

  it('drops superseded items and filters by platform (meta always counts)', () => {
    const out = currentUpdates([u({ id: 'ver-1' }), u({ id: 'ver-2', supersedes: 'ver-1' }), u({ id: 'tik-1', platform: 'tiktok' }), u({ id: 'meta', platform: 'meta' })], NOW, ['instagram']);
    expect(out.map((c) => c.update.id).sort()).toEqual(['meta', 'ver-2']);
  });

  it('a stopped change needs the day it stopped', () => {
    expect(platformUpdateSchema.safeParse({ id: 'x-1', platform: 'instagram', summary: 'Something changed.', status: 'reverted', firstSeen: '2026-11-01', lastVerified: '2026-11-02', source: 'https://example.com' }).success).toBe(false);
  });
});

describe('updateLines', () => {
  it('says the status plainly, and puts stopped changes first so the cap never cuts them', () => {
    const lines = updateLines(currentUpdates([
      u({ id: 'item-a', status: 'rolling_out' }),
      u({ id: 'item-b', status: 'testing', note: 'a few accounts' }),
      u({ id: 'item-c', status: 'reverted', statusChangedAt: '2026-11-25' }),
    ], NOW), 2);
    expect(lines).toHaveLength(2);
    expect(lines[0]).toMatch(/^- NO LONGER TRUE \(rolled back 2026-11-25\): Instagram: /);
    expect(lines[1]).toMatch(/rolling out since 2026-11-01, not everyone has it yet/);
  });
});
