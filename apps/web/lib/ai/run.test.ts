import { beforeEach, describe, expect, it, vi } from 'vitest';

const m = vi.hoisted(() => ({
  access: vi.fn(),
  reserve: vi.fn(),
  settle: vi.fn().mockResolvedValue(undefined),
  callModel: vi.fn(),
  logUsage: vi.fn().mockResolvedValue(undefined),
}));
vi.mock('server-only', () => ({}));
vi.mock('@/lib/telegram', () => ({ sendTelegramMessage: vi.fn().mockResolvedValue({ ok: true }) }));
vi.mock('./access', () => ({
  getProAiAccess: m.access,
  isSubscriberPlan: (a: { plan: string } | null) => !!a && (a.plan === 'monthly' || a.plan === 'yearly'),
}));
vi.mock('./allowance', () => ({ reserve: m.reserve, settle: m.settle }));
vi.mock('./usageLog', () => ({ logUsage: m.logUsage, usageSource: { total: async () => 0, forUser: async () => 0 } }));
vi.mock('./provider', async (orig) => {
  const real = await orig<typeof import('./provider')>();
  return { ...real, callModel: m.callModel, isMockProvider: () => false, providerFrom: () => 'openrouter' };
});

import { runAiAction } from './run';
import { AiProviderError } from './provider';

const schema = { safeParse: (v: unknown) => ({ success: true as const, data: v }) };
const go = (userId = 'u1') => runAiAction({ userId, action: 'chat', system: 'rules', user: 'hi', schema, mock: {} });
const answer = (costUsd: number | null) => ({ text: '{"a":1}', inputTokens: 10, outputTokens: 10, cacheReadTokens: 0, cacheWriteTokens: 0, uncachedInputTokens: 10, costUsd, mocked: false, model: 'claude-haiku-5-5' });
const hold = { userId: 'u1', usd: 0.01, parts: [{ id: 'g', add: 0.01 }] };

describe('runAiAction: no AI spend for anyone who has not paid', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it.each([null, { plan: 'lifetime' }, { plan: 'earlyLifetime' }, { plan: 'legacy' }])('never calls the model for %j', async (access) => {
    m.access.mockResolvedValue(access);
    expect(await go()).toEqual({ ok: false, reason: 'not_allowed' });
    expect(m.reserve).not.toHaveBeenCalled();
    expect(m.callModel).not.toHaveBeenCalled();
  });

  it('never calls the model when the worst case does not fit', async () => {
    m.access.mockResolvedValue({ plan: 'monthly', periodEnd: null });
    m.reserve.mockResolvedValue('empty');
    expect(await go('u2')).toEqual({ ok: false, reason: 'allowance_empty' });
    expect(m.callModel).not.toHaveBeenCalled();
  });

  it('reserves before the call and settles to the real cost', async () => {
    m.access.mockResolvedValue({ plan: 'yearly', periodEnd: null });
    m.reserve.mockResolvedValue(hold);
    m.callModel.mockResolvedValue(answer(0.004));
    expect((await go('u3')).ok).toBe(true);
    expect(m.reserve.mock.invocationCallOrder[0]!).toBeLessThan(m.callModel.mock.invocationCallOrder[0]!);
    expect(m.settle).toHaveBeenCalledWith(hold, 0.004);
  });

  it('charges the whole worst case when the cost is unknown', async () => {
    m.access.mockResolvedValue({ plan: 'monthly', periodEnd: null });
    m.reserve.mockResolvedValue(hold);
    m.callModel.mockResolvedValue(answer(null));
    await go('u4');
    const [, charged] = m.settle.mock.calls[0]!;
    expect(charged).toBeGreaterThan(0);
  });

  it('keeps the hold when a call fails after it may have been billed, releases it on an HTTP refusal', async () => {
    m.access.mockResolvedValue({ plan: 'monthly', periodEnd: null });
    m.reserve.mockResolvedValue(hold);
    m.callModel.mockRejectedValueOnce(new AiProviderError('The answer was cut off'));
    expect(await go('u5')).toEqual({ ok: false, reason: 'failed' });
    expect(m.settle).toHaveBeenLastCalledWith(hold, null);
    m.callModel.mockRejectedValueOnce(new AiProviderError('OpenRouter returned 503', 503));
    await go('u6');
    expect(m.settle).toHaveBeenLastCalledWith(hold, 0);
  });

  it('reserves again for the retry, so a retry is never free', async () => {
    m.access.mockResolvedValue({ plan: 'monthly', periodEnd: null });
    m.reserve.mockResolvedValue(hold);
    m.callModel.mockResolvedValueOnce({ ...answer(0.002), text: 'not json' }).mockResolvedValueOnce(answer(0.002));
    expect((await go('u7')).ok).toBe(true);
    expect(m.reserve).toHaveBeenCalledTimes(2);
    expect(m.settle).toHaveBeenCalledTimes(2);
  });
});
