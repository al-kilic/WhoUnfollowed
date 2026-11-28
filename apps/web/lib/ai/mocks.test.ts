import { describe, expect, it } from 'vitest';
import { aiChatSchema, aiCheckSchema, aiInsightsSchema, aiDraftSchema, aiIdeasSchema, aiPlanSchema, aiReadSchema } from '@ig-tracker/core';
import { MOCK_CHAT, MOCK_CHECK, MOCK_INSIGHTS, MOCK_DRAFT, MOCK_IDEAS, MOCK_PLAN, MOCK_READ } from './mocks';
import { extractJson } from './provider';

describe('mock answers', () => {
  it('pass the same schemas as real answers', () => {
    expect(aiReadSchema.safeParse(MOCK_READ).success).toBe(true);
    expect(aiDraftSchema.safeParse(MOCK_DRAFT).success).toBe(true);
    expect(aiCheckSchema.safeParse(MOCK_CHECK).success).toBe(true);
    expect(aiPlanSchema.safeParse(MOCK_PLAN).success).toBe(true);
    expect(aiIdeasSchema.safeParse(MOCK_IDEAS).success).toBe(true);
    expect(aiChatSchema.safeParse(MOCK_CHAT).success).toBe(true);
    expect(aiInsightsSchema.safeParse(MOCK_INSIGHTS).success).toBe(true);
  });
});

describe('extractJson', () => {
  it('finds the object inside prose or a code fence', () => {
    expect(extractJson('Here you go:\n```json\n{"a": 1}\n```')).toEqual({ a: 1 });
  });
  it('rejects an answer with no JSON', () => {
    expect(() => extractJson('Sorry, I cannot help.')).toThrow();
  });
});
