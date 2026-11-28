import { describe, expect, it } from 'vitest';
import { aiAlerts, aiReportLines, cacheShare, createAlertGate, DEFAULT_THRESHOLDS, memberHash, summarize, thresholdsFromEnv, type MemoryCounts, type UsageRow } from './aiHealth';

const NOW = new Date('2026-11-24T12:00:00Z');
const H = 3_600_000;
const quietMemory: MemoryCounts = { exportsProcessed: 0, notesCreated: 0, notesConfirmed: 0, notesForgotten: 0, signalsReceived: 0, signalsProcessed: 0, signalBacklogOld: 0, learnedNotesBuilt: 0, blindSpotsShown: 0, blindSpotsResolved: 0 };

function row(p: Partial<UsageRow> = {}): UsageRow {
  return { userId: 'u1', action: 'read', model: 'claude-haiku-5-5', costUsd: 0.002, inputTokens: 300, outputTokens: 2000, cacheReadTokens: 1600, cacheWriteTokens: 0, createdAt: new Date(NOW.getTime() - H), ...p };
}
const many = (k: number, p: Partial<UsageRow> = {}) => Array.from({ length: k }, () => row(p));

async function health(rows24h: UsageRow[], opts: { rows7d?: UsageRow[]; memory?: Partial<MemoryCounts>; dailyCap?: number | null; userCap?: number | null } = {}) {
  return summarize({ now: NOW, rows24h, rows7d: opts.rows7d ?? rows24h, memory: { ...quietMemory, ...opts.memory }, dailyCap: opts.dailyCap === undefined ? 25 : opts.dailyCap, userCap: opts.userCap === undefined ? 1 : opts.userCap });
}

describe('cacheShare', () => {
  it('is null with no calls or no input', () => {
    expect(cacheShare([])).toBeNull();
    expect(cacheShare([row({ inputTokens: 0, cacheReadTokens: 0, cacheWriteTokens: 0 })])).toBeNull();
  });
  it('is cache reads over all input', () => {
    expect(cacheShare([row({ inputTokens: 200, cacheReadTokens: 600, cacheWriteTokens: 200 })])).toBeCloseTo(0.6);
  });
});

describe('summarize', () => {
  it('handles a day with no calls', async () => {
    const h = await health([]);
    expect(h).toMatchObject({ calls: 0, spend: 0, members: 0, perMember: 0, monthlyPerMember: 0, topMember: null, membersAtCap: 0, capShare: 0 });
    expect(aiReportLines(h).quiet).toBe(true);
  });

  it('counts spend, members, models and the 30-day projection', async () => {
    const rows = [...many(3, { userId: 'a', costUsd: 0.01 }), row({ userId: 'b', model: 'claude-sonnet-5-5', action: 'check', costUsd: 0.04, cacheReadTokens: 0, cacheWriteTokens: 1600 })];
    const h = await health(rows, { rows7d: [...rows, ...many(7, { userId: 'a', costUsd: 0.01, createdAt: new Date(NOW.getTime() - 3 * 24 * H) })] });
    expect(h.calls).toBe(4);
    expect(h.spend).toBeCloseTo(0.07);
    expect(h.members).toBe(2);
    expect(h.perMember).toBeCloseTo(0.035);
    expect(h.monthlyPerMember).toBeCloseTo((0.14 / 2) * (30 / 7));
    expect(h.byModel.map((m) => m.model)).toEqual(['claude-sonnet-5-5', 'claude-haiku-5-5']);
    expect(h.byModel[0]!.cacheShare).toBe(0);
    expect(h.byAction[0]).toMatchObject({ action: 'check', calls: 1 });
  });

  it('shows the top member only as a short hash', async () => {
    const h = await health([row({ userId: 'secret-user-id', costUsd: 0.5 })]);
    expect(h.topMember!.id).toMatch(/^[0-9a-f]{8}$/);
    expect(h.topMember!.id).toBe(await memberHash('secret-user-id'));
    expect(JSON.stringify(aiReportLines(h))).not.toContain('secret-user-id');
  });

  it('counts members at the per-member cap from today only', async () => {
    const yesterday = new Date('2026-11-23T20:00:00Z');
    const rows = [row({ userId: 'a', costUsd: 1.2 }), row({ userId: 'b', costUsd: 0.2 }), row({ userId: 'c', costUsd: 5, createdAt: yesterday })];
    expect((await health(rows)).membersAtCap).toBe(1);
    expect((await health(rows, { userCap: null })).membersAtCap).toBe(0);
  });
});

describe('aiAlerts', () => {
  const types = async (rows: UsageRow[], opts?: Parameters<typeof health>[1]) => aiAlerts(await health(rows, opts), DEFAULT_THRESHOLDS).map((a) => a.type);

  it('stays silent on a healthy day', async () => {
    expect(await types(many(40))).toEqual([]);
  });
  it('flags low cache reads only with enough calls', async () => {
    expect(await types(many(30, { cacheReadTokens: 0, cacheWriteTokens: 1600 }))).toContain('cache');
    expect(await types(many(29, { cacheReadTokens: 0, cacheWriteTokens: 1600 }))).not.toContain('cache');
  });
  it('flags spend at 70% of the daily cap', async () => {
    expect(await types([row({ costUsd: 7 })], { dailyCap: 10, userCap: null })).toContain('spend');
    expect(await types([row({ costUsd: 6.9 })], { dailyCap: 10, userCap: null })).not.toContain('spend');
    expect(await types([row({ costUsd: 50 })], { dailyCap: null, userCap: null })).not.toContain('spend');
  });
  it('flags members at their cap', async () => {
    expect(await types([row({ costUsd: 1 })])).toContain('member_cap');
    expect(await types([row({ costUsd: 0.99 })])).not.toContain('member_cap');
  });
  it('flags a high cost per member', async () => {
    const week = many(7, { costUsd: 1, createdAt: new Date(NOW.getTime() - 2 * 24 * H) });
    expect(await types([], { rows7d: week, userCap: null })).toContain('member_cost');
    expect(await types([], { rows7d: many(7, { costUsd: 0.05, createdAt: new Date(NOW.getTime() - 2 * 24 * H) }), userCap: null })).not.toContain('member_cost');
  });
  it('flags more tidy-ups than new exports', async () => {
    expect(await types(many(2, { action: 'memory' }), { memory: { exportsProcessed: 1 } })).toContain('digest');
    expect(await types(many(1, { action: 'memory' }), { memory: { exportsProcessed: 1 } })).not.toContain('digest');
  });
  it('flags an old signal backlog', async () => {
    expect(await types([], { memory: { signalBacklogOld: 3 } })).toContain('signals');
    expect(await types([], { memory: { signalBacklogOld: 0 } })).not.toContain('signals');
  });
  it('flags paid calls without token counts', async () => {
    expect(await types([row({ inputTokens: 0, outputTokens: 0, cacheReadTokens: 0, cacheWriteTokens: 0 })])).toContain('tokens');
    expect(await types([row()])).not.toContain('tokens');
  });
});

describe('createAlertGate', () => {
  it('lets each alert type through once per UTC day', () => {
    const gate = createAlertGate();
    const a = [{ type: 'spend' as const, text: 'x' }, { type: 'cache' as const, text: 'y' }];
    expect(gate(a, NOW)).toHaveLength(2);
    expect(gate(a, new Date(NOW.getTime() + 2 * H))).toHaveLength(0);
    expect(gate([a[0]!], new Date('2026-11-25T01:00:00Z'))).toHaveLength(1);
  });
});

describe('thresholdsFromEnv', () => {
  it('uses defaults and accepts overrides', () => {
    expect(thresholdsFromEnv({})).toEqual(DEFAULT_THRESHOLDS);
    expect(thresholdsFromEnv({ AI_ALERT_CACHE_MIN_SHARE: '0.3', AI_ALERT_MEMBER_MONTHLY_USD: 'abc' })).toMatchObject({ cacheMinShare: 0.3, memberMonthlyUsd: 2 });
  });
});

describe('aiReportLines', () => {
  it('has no em dashes and no ids', async () => {
    const h = await health([row({ userId: 'user-123', costUsd: 0.3 })], { memory: { notesCreated: 2, signalsReceived: 5 } });
    const { lines, quiet } = aiReportLines(h);
    const text = lines.join('\n');
    expect(quiet).toBe(false);
    expect(text).not.toContain('—');
    expect(text).not.toContain('user-123');
    expect(text).toContain('cache 84%');
    expect(text).toContain('2 notes added');
  });
  it('is not quiet when only memory moved', async () => {
    expect(aiReportLines(await health([], { memory: { notesCreated: 1 } })).quiet).toBe(false);
  });
});
