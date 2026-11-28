// Pro AI: every AI action, the model it runs on, what it costs in credits and
// how many tokens it may use. One place to calibrate after real usage: the
// server log has token counts and cost per action (see lib/ai/run.ts).
//
// Models and credits (founder, 2026-11-19, after a blind test on a real
// account: .claude/reference/pro-ai-spec.md). Claude only: Haiku 5.5 for
// everyday work, Sonnet 5.5 where the founder scored it clearly better. Each
// model runs at its normal effort ("don't cut quality"); speed comes from
// caching. maxTokens leaves room for hidden thinking, which was 50-60% of
// output in the test; too little room cuts the answer off.
//
// Every action is included: members spend a monthly usage allowance measured
// in what each call really costs (lib/ai/allowance.ts), not credits. The
// `credits` field is always 0 and only kept until the old credit screens are
// removed; nothing charges it.

import type { Effort } from './provider';

export type AiAction = 'read' | 'memory' | 'draft' | 'ideas' | 'check' | 'plan' | 'planRevise' | 'chat' | 'chatDeep' | 'insights' | 'photoStyle';

export interface AiActionConfig {
  model: string;
  effort: Effort;
  credits: number;
  maxTokens: number;
  // Whether the request may carry images.
  vision?: boolean;
}

export const MODELS = {
  fast: 'claude-haiku-5-5',
  strong: 'claude-sonnet-5-5',
} as const;

export const AI_ACTIONS: Record<AiAction, AiActionConfig> = {
  // Each new export, at most one a day per platform.
  read: { model: MODELS.fast, effort: 'medium', credits: 0, maxTokens: 6000 },
  // Runs inside other actions; never charged.
  memory: { model: MODELS.fast, effort: 'medium', credits: 0, maxTokens: 3000 },
  draft: { model: MODELS.fast, effort: 'medium', credits: 0, maxTokens: 6000, vision: true },
  ideas: { model: MODELS.fast, effort: 'medium', credits: 0, maxTokens: 6000 },
  check: { model: MODELS.strong, effort: 'high', credits: 0, maxTokens: 10000, vision: true },
  // Later rounds of feedback run as planRevise.
  plan: { model: MODELS.strong, effort: 'high', credits: 0, maxTokens: 16000 },
  // A full Sonnet plan rewrite.
  planRevise: { model: MODELS.strong, effort: 'high', credits: 0, maxTokens: 16000 },
  // Ask coach.
  chat: { model: MODELS.fast, effort: 'medium', credits: 0, maxTokens: 6000, vision: true },
  chatDeep: { model: MODELS.strong, effort: 'high', credits: 0, maxTokens: 10000, vision: true },
  // Photo insights: the user's own posts, photos and results.
  insights: { model: MODELS.strong, effort: 'high', credits: 0, maxTokens: 12000, vision: true },
  // "Learn my photo style" (memory v2, 3B): up to 24 small photos from the
  // export, described once. About $0.004 a run on Haiku.
  photoStyle: { model: MODELS.fast, effort: 'medium', credits: 0, maxTokens: 5000, vision: true },
};

// Deprecated: only the old read offer screen still shows it (reads are included now).
export const READ_FREE_PER_MONTH = 2;
export const PLAN_FREE_REVISIONS = 1;

// Deprecated credit allowance by plan, still shown by the old credit screens
// and the confirmation email until they move to the usage allowance.
export type AiPlan = 'monthly' | 'yearly' | 'lifetime' | 'earlyLifetime' | 'legacy';

export const MONTHLY_CREDITS: Record<AiPlan, number> = {
  monthly: 100,
  yearly: 100,
  lifetime: 100,
  earlyLifetime: 0,
  // One-off, not monthly: people who bought the old one-time Pro unlock.
  legacy: 30,
};

// Memory stays small so every call stays cheap.
export const MEMORY_MAX_CHARS = 9_000; // about 1,500 words
