import { describe, expect, it } from 'vitest';
import { costOf, extractJson, providerFrom } from './provider';
import { AI_ACTIONS } from './config';

describe('providerFrom', () => {
  it('prefers Anthropic, falls back to OpenRouter, else mock', () => {
    expect(providerFrom({ ANTHROPIC_API_KEY: 'a', OPENROUTER_API_KEY: 'o' })).toBe('anthropic');
    expect(providerFrom({ OPENROUTER_API_KEY: 'o' })).toBe('openrouter');
    expect(providerFrom({})).toBe('mock');
  });
  it('honours AI_PROVIDER', () => {
    expect(providerFrom({ AI_PROVIDER: 'openrouter', ANTHROPIC_API_KEY: 'a', OPENROUTER_API_KEY: 'o' })).toBe('openrouter');
    expect(providerFrom({ AI_PROVIDER: 'openrouter', ANTHROPIC_API_KEY: 'a' })).toBe('mock');
    expect(providerFrom({ AI_PROVIDER: 'mock', ANTHROPIC_API_KEY: 'a' })).toBe('mock');
  });
});

describe('costOf', () => {
  it('prices input, output and cache tokens per model', () => {
    // Haiku: 4,000 in, 1,000 out = 0.0004 + 0.0005
    expect(costOf('claude-haiku-5-5', { input: 4000, output: 1000 })).toBeCloseTo(0.0009, 6);
    // Sonnet with 3,000 cached tokens read: 0.002 + 0.01 + 0.0003
    expect(costOf('claude-sonnet-5-5', { input: 1000, output: 1000, cacheRead: 3000 })).toBeCloseTo(0.0123, 6);
    expect(costOf('unknown-model', { input: 1, output: 1 })).toBeNull();
  });
});

describe('AI_ACTIONS', () => {
  it('runs every action on a priced Claude model with room for thinking', () => {
    for (const [action, cfg] of Object.entries(AI_ACTIONS)) {
      expect(costOf(cfg.model, { input: 0, output: 0 }), action).toBe(0);
      expect(cfg.maxTokens, action).toBeGreaterThanOrEqual(3000);
    }
  });
});

describe('extractJson', () => {
  it('takes the object out of a fenced answer', () => {
    expect(extractJson('```json\n{"a":1}\n```')).toEqual({ a: 1 });
  });
});

describe('mockAllowed', () => {
  it('refuses mock answers in production unless the e2e flag is set', async () => {
    const { mockAllowed } = await import('./provider');
    expect(mockAllowed({ NODE_ENV: 'development' })).toBe(true);
    expect(mockAllowed({ NODE_ENV: 'production' })).toBe(false);
    expect(mockAllowed({ NODE_ENV: 'production', E2E_ALLOW_MOCK_AI: '1' })).toBe(true);
    expect(mockAllowed({ NODE_ENV: 'production', E2E_ALLOW_MOCK_AI: 'true' })).toBe(false);
  });
});
