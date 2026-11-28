// The most one AI call can possibly cost, worked out BEFORE it is sent.
// Founder rule (2026-11-27): a member's real AI cost may never go above their
// allowance, not even by one request. So every call reserves this worst case
// from the allowance first (allowance.ts reserve), and is settled to its real
// cost afterwards. Pure, so it is easy to test.
//
// Why it is an upper bound:
// - Input: Claude's tokenizer never makes more tokens than UTF-8 bytes, so the
//   byte length of everything we send bounds the input tokens. Each image is
//   counted at IMAGE_TOKENS (Anthropic resizes images to about 1.15 megapixels,
//   about 1,600 tokens). Every input token is priced at the dearest input rate
//   (cache write), whether or not it is cached.
// - Output: max_tokens caps everything the model writes, thinking included.
// - SAFETY covers per-message overhead and the OpenRouter fee.

export interface Rates { in: number; out: number; cacheRead: number; cacheWrite: number }

export const IMAGE_TOKENS = 2_000;
export const OVERHEAD_TOKENS = 200;
export const SAFETY = 1.25;

export interface CallShape {
  // Every text sent: system rules, core, context, history turns, user turn.
  texts: readonly string[];
  images: number;
  maxTokens: number;
}

const bytes = (s: string): number => new TextEncoder().encode(s).length;

// null when the model has no known price: the caller must refuse the call.
export function worstCaseUsd(rates: Rates | undefined, shape: CallShape): number | null {
  if (!rates) return null;
  const inputTokens = shape.texts.reduce((n, t) => n + bytes(t), 0) + shape.images * IMAGE_TOKENS + OVERHEAD_TOKENS;
  const inRate = Math.max(rates.in, rates.cacheWrite);
  const usd = (inputTokens * inRate + shape.maxTokens * rates.out) / 1e6;
  return usd * SAFETY;
}
