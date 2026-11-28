import 'server-only';
import Anthropic from '@anthropic-ai/sdk';

// Calls the model. Since 2026-11-19 every Pro AI action runs on Claude
// (Haiku 5.5 or Sonnet 5.5, see config.ts), called directly through the
// Anthropic API: Anthropic does not keep prompts or answers by default and
// never trains on them. OpenRouter stays as a fallback (AI_PROVIDER=openrouter),
// limited to hosts that keep nothing (ALLOWED_HOSTS).
//
// AI_PROVIDER=mock (or no API key outside production) returns the action's
// sample answer instead, for local work and tests.

const TIMEOUT_MS = 120_000;
const OPENROUTER = 'https://openrouter.ai/api/v1/chat/completions';

// OpenRouter fallback only: hosts based in the US or EU that keep nothing and
// don't train on it. Slugs from openrouter.ai/api/v1/providers (checked 2026-11-11).
export const ALLOWED_HOSTS = [
  'together', 'fireworks', 'deepinfra', 'google-vertex', 'cloudflare', 'amazon-bedrock', 'azure',
  'nebius', 'mistral', 'parasail', 'baseten', 'coreweave', 'crusoe', 'modal', 'venice', 'novita',
] as const;

// USD per million tokens (Anthropic list prices, checked 2026-11-19).
const PRICES: Record<string, { in: number; out: number; cacheRead: number; cacheWrite: number }> = {
  'claude-haiku-5-5': { in: 0.1, out: 0.5, cacheRead: 0.01, cacheWrite: 0.125 },
  'claude-sonnet-5-5': { in: 2, out: 10, cacheRead: 0.1, cacheWrite: 2.5 },
};
const OPENROUTER_SLUG: Record<string, string> = {
  'claude-haiku-5-5': 'anthropic/claude-haiku-5.5',
  'claude-sonnet-5-5': 'anthropic/claude-sonnet-5.5',
};

export type ContentPart = { type: 'text'; text: string } | { type: 'image_url'; image_url: { url: string } };
export type Effort = 'low' | 'medium' | 'high';
// Called with the whole answer text so far, while it streams in.
export type OnText = (textSoFar: string) => void;
export interface ChatTurn { role: 'user' | 'assistant'; text: string }

export interface ModelRequest {
  model: string;
  effort: Effort;
  // The rules, the same for every action in a locale (no JSON shape, no task).
  system: string;
  // The account core (account and memory, see coachContext.ts): byte-stable
  // across actions and days, so system + core is one cached prefix that every
  // action of the same model reuses.
  core?: string;
  // Everything that moves (numbers, Radar, results, brief): after the cache
  // breakpoint, at the start of the user turn.
  context?: string;
  // Earlier turns of a chat, oldest first, starting with the member. Sent as
  // real turns: the context rides on the first one and a cache breakpoint
  // sits on the last one, so each new question reads the conversation so far
  // from the cache. Older turns must be sent byte-identical every time.
  history?: ChatTurn[];
  // The task and its JSON shape, plus any images. Varies per action.
  user: string | ContentPart[];
  // Room for the answer plus the model's hidden thinking.
  maxTokens: number;
  // Returned verbatim in mock mode.
  mock: unknown;
}

export interface ModelResponse {
  text: string;
  // All input tokens, cached or not.
  inputTokens: number;
  outputTokens: number;
  // Split of inputTokens: read from the cache, written to it, and the rest.
  cacheReadTokens: number;
  cacheWriteTokens: number;
  uncachedInputTokens: number;
  costUsd: number | null;
  mocked: boolean;
  model: string;
}

export class AiProviderError extends Error {
  constructor(message: string, readonly status: number | null = null) {
    super(message);
    this.name = 'AiProviderError';
  }
}

type Provider = 'anthropic' | 'openrouter' | 'mock';
export function providerFrom(env: Record<string, string | undefined> = process.env): Provider {
  if (env.AI_PROVIDER === 'mock') return 'mock';
  if (env.AI_PROVIDER === 'openrouter') return env.OPENROUTER_API_KEY ? 'openrouter' : 'mock';
  if (env.ANTHROPIC_API_KEY) return 'anthropic';
  if (env.OPENROUTER_API_KEY) return 'openrouter';
  return 'mock';
}

// A production build never returns mock answers, except the end-to-end test
// server, which sets E2E_ALLOW_MOCK_AI=1 explicitly (never set on a real
// deploy; staging and production use a real provider).
export function mockAllowed(env: Record<string, string | undefined> = process.env): boolean {
  return env.NODE_ENV !== 'production' || env.E2E_ALLOW_MOCK_AI === '1';
}

export function isMockProvider(): boolean {
  return providerFrom() === 'mock' && mockAllowed();
}

export function ratesFor(model: string) {
  return PRICES[model];
}

// OpenRouter charges a fee on top of the model price when credits are bought.
export const OPENROUTER_FEE = 1.06;

// What an OpenRouter call cost: its own figure when it sends one, otherwise
// the list price of the tokens it reports (all input at the cache-write rate,
// to stay on the high side). null when neither is known.
export function openRouterCost(model: string, usage: { prompt_tokens?: number; completion_tokens?: number; cost?: number }): number | null {
  if (typeof usage.cost === 'number' && Number.isFinite(usage.cost) && usage.cost >= 0) return usage.cost * OPENROUTER_FEE;
  const p = PRICES[model];
  if (!p || typeof usage.prompt_tokens !== 'number' || typeof usage.completion_tokens !== 'number') return null;
  return ((usage.prompt_tokens * Math.max(p.in, p.cacheWrite) + usage.completion_tokens * p.out) / 1e6) * OPENROUTER_FEE;
}

export function costOf(model: string, u: { input: number; output: number; cacheRead?: number; cacheWrite?: number }): number | null {
  const p = PRICES[model];
  if (!p) return null;
  return (u.input * p.in + u.output * p.out + (u.cacheRead ?? 0) * p.cacheRead + (u.cacheWrite ?? 0) * p.cacheWrite) / 1e6;
}

// "data:image/png;base64,...." -> an Anthropic image block.
function imageBlock(url: string): Anthropic.ImageBlockParam | null {
  const m = /^data:(image\/(?:png|jpeg|gif|webp));base64,(.+)$/.exec(url);
  return m ? { type: 'image', source: { type: 'base64', media_type: m[1] as 'image/png', data: m[2]! } } : null;
}

let client: Anthropic | null = null;

// The exact request body for the Anthropic API. Pure, so tests can check that
// the cached prefix (system rules + core) is the same for every action.
export function anthropicParams(req: ModelRequest): Anthropic.MessageCreateParamsNonStreaming {
  const history = req.history?.length ? req.history : null;
  const parts: Anthropic.ContentBlockParam[] = [];
  if (req.context && !history) parts.push({ type: 'text', text: req.context });
  if (typeof req.user === 'string') parts.push({ type: 'text', text: req.user });
  else for (const p of req.user) {
    if (p.type === 'text') parts.push({ type: 'text', text: p.text });
    else { const img = imageBlock(p.image_url.url); if (img) parts.push(img); }
  }
  const system: Anthropic.TextBlockParam[] = req.core
    ? [{ type: 'text', text: req.system }, { type: 'text', text: req.core, cache_control: { type: 'ephemeral' } }]
    : [{ type: 'text', text: req.system, cache_control: { type: 'ephemeral' } }];
  return {
    model: req.model,
    max_tokens: req.maxTokens,
    system,
    messages: [...(history ? historyMessages(history, req.context) : []), { role: 'user', content: parts }],
    output_config: { effort: req.effort },
  };
}

// Earlier chat turns as messages: the context opens the first one, and the
// last one carries the conversation's cache breakpoint.
function historyMessages(history: ChatTurn[], context: string | undefined): Anthropic.MessageParam[] {
  return history.map((t, i) => {
    const blocks: Anthropic.TextBlockParam[] = i === 0 && context ? [{ type: 'text', text: context }] : [];
    blocks.push({ type: 'text', text: t.text, ...(i === history.length - 1 ? { cache_control: { type: 'ephemeral' as const } } : {}) });
    return { role: t.role, content: blocks };
  });
}

async function callAnthropic(req: ModelRequest, onText?: OnText): Promise<ModelResponse> {
  client ??= new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, timeout: TIMEOUT_MS, maxRetries: 1 });
  const params = anthropicParams(req);
  let msg: Anthropic.Message;
  try {
    if (onText) {
      const stream = client.messages.stream(params);
      stream.on('text', (_delta, snapshot) => onText(snapshot));
      msg = await stream.finalMessage();
    } else {
      msg = await client.messages.create(params);
    }
  } catch (err) {
    // Never include the request in errors: it holds user content.
    if (err instanceof Anthropic.APIError) throw new AiProviderError(`Anthropic returned ${err.status ?? 'an error'}`, err.status ?? null);
    throw new AiProviderError('Could not reach the AI provider');
  }
  if (msg.stop_reason === 'refusal') throw new AiProviderError('The model declined this request');
  if (msg.stop_reason === 'max_tokens') throw new AiProviderError('The answer was cut off');
  const text = msg.content.filter((b): b is Anthropic.TextBlock => b.type === 'text').map((b) => b.text).join('');
  if (!text) throw new AiProviderError('Empty answer from the model');
  const u = msg.usage;
  const cacheRead = u.cache_read_input_tokens ?? 0;
  const cacheWrite = u.cache_creation_input_tokens ?? 0;
  return {
    text,
    inputTokens: u.input_tokens + cacheRead + cacheWrite,
    outputTokens: u.output_tokens,
    cacheReadTokens: cacheRead,
    cacheWriteTokens: cacheWrite,
    uncachedInputTokens: u.input_tokens,
    costUsd: costOf(req.model, { input: u.input_tokens, output: u.output_tokens, cacheRead, cacheWrite }),
    mocked: false,
    model: msg.model,
  };
}

async function callOpenRouter(req: ModelRequest, onText?: OnText): Promise<ModelResponse> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const history = req.history?.length ? req.history : null;
  const lead = history ? undefined : req.context;
  const content = lead
    ? (typeof req.user === 'string' ? `${lead}\n\n${req.user}` : [{ type: 'text', text: lead }, ...req.user])
    : req.user;
  const turns = history ? history.map((t, i) => ({ role: t.role, content: i === 0 && req.context ? `${req.context}\n\n${t.text}` : t.text })) : [];
  const systemText = req.core ? `${req.system}\n\n${req.core}` : req.system;
  try {
    const res = await fetch(OPENROUTER, {
      method: 'POST',
      signal: controller.signal,
      headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, 'Content-Type': 'application/json', 'HTTP-Referer': 'https://whounfollowed.co', 'X-Title': 'WhoUnfollowed' },
      body: JSON.stringify({
        model: OPENROUTER_SLUG[req.model] ?? req.model,
        max_tokens: req.maxTokens,
        reasoning: { effort: req.effort },
        messages: [{ role: 'system', content: systemText }, ...turns, { role: 'user', content }],
        provider: { data_collection: 'deny', zdr: true, only: ALLOWED_HOSTS },
        usage: { include: true },
        ...(onText ? { stream: true } : {}),
      }),
    });
    if (!res.ok) throw new AiProviderError(`OpenRouter returned ${res.status}`, res.status);
    if (onText && res.body) return await readOpenRouterStream(res.body, req.model, onText);
    const data = (await res.json()) as { model?: string; choices?: { message?: { content?: string | null } }[]; usage?: { prompt_tokens?: number; completion_tokens?: number; cost?: number } };
    const text = data.choices?.[0]?.message?.content ?? '';
    if (!text) throw new AiProviderError('Empty answer from the model');
    return { text, inputTokens: data.usage?.prompt_tokens ?? 0, outputTokens: data.usage?.completion_tokens ?? 0, cacheReadTokens: 0, cacheWriteTokens: 0, uncachedInputTokens: data.usage?.prompt_tokens ?? 0, costUsd: openRouterCost(req.model, data.usage ?? {}), mocked: false, model: data.model ?? req.model };
  } catch (err) {
    if (err instanceof AiProviderError) throw err;
    if (err instanceof Error && err.name === 'AbortError') throw new AiProviderError('The model took too long');
    throw new AiProviderError('Could not reach the AI provider');
  } finally {
    clearTimeout(timer);
  }
}

// Server-sent events from OpenRouter: text deltas, then a last chunk with usage.
async function readOpenRouterStream(body: ReadableStream<Uint8Array>, model: string, onText: OnText): Promise<ModelResponse> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buf = '', text = '', usage: { prompt_tokens?: number; completion_tokens?: number; cost?: number } = {}, used = model;
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let nl: number;
    while ((nl = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, nl).trim(); buf = buf.slice(nl + 1);
      if (!line.startsWith('data:') || line === 'data: [DONE]') continue;
      try {
        const chunk = JSON.parse(line.slice(5)) as { model?: string; choices?: { delta?: { content?: string | null } }[]; usage?: typeof usage };
        const d = chunk.choices?.[0]?.delta?.content;
        if (d) { text += d; onText(text); }
        if (chunk.usage) usage = chunk.usage;
        if (chunk.model) used = chunk.model;
      } catch { /* keep-alive or partial line */ }
    }
  }
  if (!text) throw new AiProviderError('Empty answer from the model');
  return { text, inputTokens: usage.prompt_tokens ?? 0, outputTokens: usage.completion_tokens ?? 0, cacheReadTokens: 0, cacheWriteTokens: 0, uncachedInputTokens: usage.prompt_tokens ?? 0, costUsd: openRouterCost(model, usage), mocked: false, model: used };
}

// Mock mode streams the sample answer in small pieces, so the streaming UI can
// be checked without spending anything.
async function mockStream(text: string, onText: OnText): Promise<void> {
  for (let i = 24; i < text.length + 24; i += 24) {
    onText(text.slice(0, i));
    await new Promise((r) => setTimeout(r, 35));
  }
}

export async function callModel(req: ModelRequest, onText?: OnText): Promise<ModelResponse> {
  const provider = providerFrom();
  if (provider === 'mock') {
    if (!mockAllowed()) throw new AiProviderError('No AI provider is configured');
    const text = JSON.stringify(req.mock);
    if (onText) await mockStream(text, onText);
    return { text, inputTokens: 0, outputTokens: 0, cacheReadTokens: 0, cacheWriteTokens: 0, uncachedInputTokens: 0, costUsd: 0, mocked: true, model: req.model };
  }
  return provider === 'anthropic' ? callAnthropic(req, onText) : callOpenRouter(req, onText);
}

// Models sometimes wrap JSON in prose or a code fence. Take the outermost object.
export function extractJson(text: string): unknown {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end <= start) throw new AiProviderError('No JSON in the answer');
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    throw new AiProviderError('The answer was not valid JSON');
  }
}
