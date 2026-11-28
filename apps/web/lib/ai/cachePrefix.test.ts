import { describe, expect, it, vi } from 'vitest';
import { exportStats } from '@ig-tracker/core';

vi.mock('server-only', () => ({}));

import { anthropicParams, type ModelRequest } from './provider';
import { baseRules, SHAPES, TASKS } from './prompts';
import { buildCoachContext } from './coachContext';
import { getSampleSnapshots } from '@/lib/sample/sampleSnapshot';

// Memory v2, phase 1B: the cached prefix (rules + account core) must be the
// same bytes for every action, and nothing that moves may sit inside it.

const snaps = getSampleSnapshots();
const allStats = [exportStats(snaps[2]!, snaps[1]!), exportStats(snaps[1]!, snaps[0]!), exportStats(snaps[0]!)];
const base = {
  accountLine: 'Type: creator. Niche: film photography. Goal: grow.',
  extraLines: ['Posts on Tuesday, Thursday, Saturday; plans should put posts on these days.'],
  goal: true,
  memory: 'Shoots film portraits in Lisbon.',
  stats: allStats,
  results: ['- carousel about "Lisbon light" (from the plan); results: +34 followers'],
  brief: { date: '2026-11-23', lines: ['- Story edits for 15 minutes'] },
};

const ctx = buildCoachContext(base);
const req = (user: ModelRequest['user'], model = 'claude-haiku-5-5'): ModelRequest => ({
  model, effort: 'medium', system: baseRules('en'), core: ctx.core, context: ctx.volatile, user, maxTokens: 6000, mock: {},
});
const userFor = (task: string, shape: string) => `# Task\n${task}\n\n# JSON shape\n${shape}`;

describe('cached prefix', () => {
  const perAction = [
    userFor(TASKS.read, SHAPES.read),
    userFor(TASKS.ideas('travel'), SHAPES.ideas),
    userFor(TASKS.check, SHAPES.check),
    userFor(TASKS.chat(false), SHAPES.chat),
    userFor(TASKS.insights, SHAPES.insights),
  ].map((u) => anthropicParams(req(u)));

  it('sends the exact same system blocks for every action', () => {
    const first = JSON.stringify(perAction[0]!.system);
    for (const p of perAction) expect(JSON.stringify(p.system)).toBe(first);
  });

  it('caches only the account core, after the shared rules', () => {
    const sys = perAction[0]!.system as { text: string; cache_control?: unknown }[];
    expect(sys).toHaveLength(2);
    expect(sys[0]!.cache_control).toBeUndefined();
    expect(sys[1]!.text).toBe(ctx.core);
    expect(sys[1]!.cache_control).toEqual({ type: 'ephemeral' });
  });

  it('keeps JSON shapes, tasks and the moving numbers out of the system blocks', () => {
    const sysText = (perAction[2]!.system as { text: string }[]).map((b) => b.text).join('\n');
    for (const shape of Object.values(SHAPES)) expect(sysText.includes(shape)).toBe(false);
    expect(sysText).not.toContain('# Task');
    expect(sysText).not.toContain('# Numbers');
    const firstUser = perAction[2]!.messages[0]!.content as { type: string; text?: string; cache_control?: unknown }[];
    expect(firstUser[0]!.text).toBe(ctx.volatile);
    expect(firstUser.every((b) => b.cache_control === undefined)).toBe(true);
  });

  it('caches the rules alone when there is no account core', () => {
    const noCore: ModelRequest = { ...req('hi') };
    delete noCore.core;
    const p = anthropicParams(noCore);
    expect(p.system).toEqual([{ type: 'text', text: baseRules('en'), cache_control: { type: 'ephemeral' } }]);
  });
});

describe('account core', () => {
  it('stays byte-identical when exports, results and the brief change', () => {
    const later = buildCoachContext({ ...base, stats: allStats.slice(1), results: [], brief: { date: '2026-11-30', lines: ['- something new'] } });
    expect(later.core).toBe(ctx.core);
    expect(later.volatile).not.toBe(ctx.volatile);
  });

  it('holds no dates or export numbers, and the full text is core then volatile', () => {
    expect(ctx.core).not.toMatch(/\b20\d\d-\d\d-\d\d\b/);
    expect(ctx.core).not.toContain('# Numbers');
    expect(ctx.text).toBe(`${ctx.core}\n\n${ctx.volatile}`);
  });
});
