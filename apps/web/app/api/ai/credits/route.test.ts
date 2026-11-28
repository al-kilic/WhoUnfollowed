// @vitest-environment node
import { describe, it, expect, vi } from 'vitest';
import { NextResponse } from 'next/server';

const m = vi.hoisted(() => ({
  guardProAi: vi.fn(),
  getCredits: vi.fn().mockResolvedValue({ balance: 57, resetsAt: null }),
  usage: { usedShare: 0.2, nearLimit: false, empty: false, resetsAt: null, refills: { held: 0, canBuy: true, expiresAt: [] }, gift: { left: false } },
  creditHistory: vi.fn().mockResolvedValue([{ delta: -1, reason: 'spend', action: 'draft', createdAt: new Date('2026-11-17T00:00:00Z') }]),
}));
vi.mock('@/lib/ai/guard', () => ({ guardProAi: m.guardProAi }));
vi.mock('@/lib/ai/credits', () => ({ getCredits: m.getCredits, creditHistory: m.creditHistory }));
vi.mock('@/lib/ai/allowance', () => ({ allowanceFor: vi.fn().mockResolvedValue(m.usage) }));
const rows = [{ action: 'chat', costUsd: 0.1, at: new Date() }, { action: 'check', costUsd: 0.3, at: new Date() }];
vi.mock('@/lib/db/index', () => ({ db: { select: () => ({ from: () => ({ where: () => Promise.resolve(rows) }) }) } }));

import { GET } from './route';
import { MONTHLY_CREDITS } from '@/lib/ai/config';

describe('/api/ai/credits', () => {
  it('returns balance, the plan allowance and recent activity', async () => {
    m.guardProAi.mockResolvedValueOnce({ ok: true, userId: 'u1', access: { plan: 'yearly', periodEnd: null }, onboarded: true });
    const json = await (await GET()).json();
    expect(json.balance).toBe(57);
    expect(json.allowance).toBe(MONTHLY_CREDITS.yearly);
    expect(json.history).toHaveLength(1);
    // The usage allowance, with no dollar amounts.
    expect(json.usage).toEqual(m.usage);
    // What this month went to, as shares only.
    expect(json.breakdown.byFeature).toEqual([{ feature: 'create', share: 0.75 }, { feature: 'ask', share: 0.25 }]);
    expect(JSON.stringify(json.breakdown)).not.toMatch(/usd|cost/i);
  });
  it('refuses people without Pro AI', async () => {
    m.guardProAi.mockResolvedValueOnce({ ok: false, response: NextResponse.json({ error: 'not_pro_ai' }, { status: 403 }) });
    expect((await GET()).status).toBe(403);
  });
});
