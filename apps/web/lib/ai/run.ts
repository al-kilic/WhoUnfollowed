import 'server-only';
import { AI_ACTIONS, type AiAction } from './config';
import { callModel, extractJson, ratesFor, AiProviderError, isMockProvider, providerFrom, type ChatTurn, type ContentPart, type OnText } from './provider';
import { reserve, settle, type Hold } from './allowance';
import { getProAiAccess, isSubscriberPlan } from './access';
import { worstCaseUsd } from './costGuard';
import { capFromEnv, createSpendCap, DEFAULT_DAILY_CAP_USD } from './spendCap';
import { logUsage, usageSource } from './usageLog';
import { sendTelegramMessage } from '@/lib/telegram';
import { trackServerEvent } from '@/lib/umamiServer';
import { createFailureAlerter } from './failureAlert';

// Any zod schema fits this; the web app reaches zod only through @ig-tracker/core.
export interface Validator<T> {
  safeParse(value: unknown): { success: true; data: T } | { success: false };
}

export type AiRunResult<T> =
  // balance: always 0, kept until the old credit screens are gone.
  | { ok: true; data: T; balance: number; mocked: boolean }
  | { ok: false; reason: 'allowance_empty' }
  | { ok: false; reason: 'pace_limit' }
  | { ok: false; reason: 'busy' }
  | { ok: false; reason: 'paused' }
  | { ok: false; reason: 'not_allowed' }
  | { ok: false; reason: 'failed' };

// The global emergency brake only. Per member, the usage allowance and its
// daily pace (allowance.ts) are the limit; there is no second per-user cap.
const spendCap = createSpendCap({
  cap: capFromEnv(process.env.AI_DAILY_SPEND_CAP_USD, DEFAULT_DAILY_CAP_USD),
  userCap: null,
  source: usageSource,
  onReached: (spent, cap) => {
    const msg = `AI paused until midnight UTC: spend today is $${spent.toFixed(2)}, the cap is $${cap}.`;
    console.error(`[ai] ${msg}`);
    void sendTelegramMessage(msg);
  },
});

// A simple per-user brake: at most this many AI calls a minute per process.
const PER_MINUTE = 8;
const recent = new Map<string, number[]>();

function underRateLimit(userId: string, now: number): boolean {
  const list = (recent.get(userId) ?? []).filter((t) => now - t < 60_000);
  if (list.length >= PER_MINUTE) { recent.set(userId, list); return false; }
  list.push(now);
  recent.set(userId, list);
  return true;
}

async function runInner<T>(note: { detail: string }, opts: {
  userId: string;
  action: AiAction;
  // The shared rules (baseRules), the same for every action.
  system: string;
  // The account core, cached together with the rules (see provider.ts).
  core?: string;
  // The account context that moves with each export, sent uncached.
  context?: string;
  // Earlier chat turns, sent as real turns (see provider.ts).
  history?: ChatTurn[];
  user: string | ContentPart[];
  schema: Validator<T>;
  mock: T;
  // Streams the answer text as it is written (first attempt only).
  onText?: OnText;
}): Promise<AiRunResult<T>> {
  const cfg = AI_ACTIONS[opts.action];
  // 1. Only a paying Pro AI subscriber, checked again here so no route can
  //    forget it (founder, 2026-11-27).
  const access = await getProAiAccess(opts.userId);
  if (!isSubscriberPlan(access)) return { ok: false, reason: 'not_allowed' };
  // 2. The most this call can cost (costGuard.ts). Unknown price: no call.
  const texts = [opts.system, opts.core ?? '', opts.context ?? '', ...(opts.history ?? []).map((t) => t.text),
    ...(typeof opts.user === 'string' ? [opts.user] : opts.user.map((p) => (p.type === 'text' ? p.text : '')))];
  const images = typeof opts.user === 'string' ? 0 : opts.user.filter((p) => p.type === 'image_url').length;
  const worst = worstCaseUsd(ratesFor(cfg.model), { texts, images, maxTokens: cfg.maxTokens });
  if (worst === null) {
    console.error(`[ai] ${opts.action}: no price for ${cfg.model}, refusing the call`);
    note.detail = `no price for ${cfg.model}`;
    return { ok: false, reason: 'failed' };
  }
  const mock = isMockProvider();
  // Production without a provider key: refuse instead of failing after a hold.
  if (!mock && providerFrom() === 'mock') { note.detail = 'no provider key on the server'; return { ok: false, reason: 'failed' }; }
  if (!underRateLimit(opts.userId, Date.now())) return { ok: false, reason: 'busy' };
  // 3. The global brake, counting this call's worst case.
  if (!mock && (await spendCap.check(opts.userId, new Date(), worst)) !== 'ok') return { ok: false, reason: 'paused' };

  // The retry note goes at the end of the user turn, never into the system
  // block, so the cached prefix stays the same on a retry.
  const withNote = (extra: string): string | ContentPart[] =>
    !extra ? opts.user : typeof opts.user === 'string' ? opts.user + extra : [...opts.user, { type: 'text', text: extra.trim() }];
  const ask = (extra: string) =>
    callModel({
      model: cfg.model,
      effort: cfg.effort,
      system: opts.system,
      ...(opts.core ? { core: opts.core } : {}),
      ...(opts.context ? { context: opts.context } : {}),
      ...(opts.history?.length ? { history: opts.history } : {}),
      user: withNote(extra),
      maxTokens: cfg.maxTokens,
      mock: opts.mock,
    }, extra ? undefined : opts.onText);

  // 4. Each attempt (the answer, and at most one retry) first reserves its worst
  //    case from the allowance, then is settled to what it really cost. Every
  //    attempt counts, failed ones too: the allowance is our real cost, and it
  //    can never be passed (founder rule: at most $2.50 a member a month).
  for (const extra of ['', '\n\nYour previous answer was not valid. Reply with only the JSON object, matching the schema exactly.']) {
    // Mock mode (local and e2e only) takes the same path, so the limits are
    // tested exactly as they run; its answers cost 0 and give the hold back.
    const r = await reserve(opts.userId, access, worst);
    if (r === 'empty') return { ok: false, reason: 'allowance_empty' };
    if (r === 'pace') return { ok: false, reason: 'pace_limit' };
    const hold: Hold = r;
    let res: Awaited<ReturnType<typeof ask>>;
    try {
      res = await ask(extra);
    } catch (err) {
      // An HTTP error from the provider means it refused before writing
      // anything: nothing was billed. Anything else (cut off, timed out,
      // dropped stream) may have been billed: keep the whole hold.
      const billed = !(err instanceof AiProviderError && err.status !== null);
      await settleSafely(hold, billed ? null : 0);
      if (billed) {
        await logUsage(opts.userId, opts.action, cfg.model, hold.usd).catch(() => {});
        spendCap.record(hold.usd);
      }
      console.error(`[ai] ${opts.action} failed: ${err instanceof Error ? err.message : 'unknown'}`);
      note.detail = err instanceof AiProviderError && err.status !== null ? `provider error ${err.status}` : 'no answer (timeout or dropped)';
      return { ok: false, reason: 'failed' };
    }
    // No cost figure: count the whole worst case, never zero.
    const cost = res.mocked ? 0 : (res.costUsd ?? worst);
    await settleSafely(hold, cost);
    await logUsage(opts.userId, opts.action, res.model, cost, {
      input: res.uncachedInputTokens, output: res.outputTokens, cacheRead: res.cacheReadTokens, cacheWrite: res.cacheWriteTokens,
    }).catch(() => {});
    spendCap.record(cost);
    // Token counts only. Never log prompts or answers: they hold user content.
    console.log(`[ai] ${opts.action} model=${res.model} in=${res.inputTokens} (cache read ${res.cacheReadTokens}, write ${res.cacheWriteTokens}) out=${res.outputTokens} cost=${cost} worst=${worst.toFixed(4)}${res.mocked ? ' mock' : ''}`);
    let parsed: unknown;
    try { parsed = extractJson(res.text); } catch { continue; }
    const checked = opts.schema.safeParse(parsed);
    if (checked.success) return { ok: true, data: checked.data, balance: 0, mocked: res.mocked };
  }
  console.error(`[ai] ${opts.action} failed: answer did not match the schema twice`);
  note.detail = 'answer did not match the format twice';
  return { ok: false, reason: 'failed' };
}

// Every AI request goes through here: the call itself (runInner), then a
// server-side Umami event per request (action and result, no user data) and
// the Telegram alert when the coach starts or stops failing.
const failures = createFailureAlerter({ quietMs: 30 * 60_000, send: (text) => void sendTelegramMessage(text, 'alerts').catch(() => null) });

export async function runAiAction<T>(opts: Parameters<typeof runInner<T>>[1]): Promise<AiRunResult<T>> {
  const note = { detail: 'unknown' };
  const res = await runInner(note, opts);
  const result = res.ok ? 'ok' : res.reason;
  if (!res.ok && res.reason === 'failed') failures.failed(opts.action, note.detail, Date.now());
  else if (res.ok && !res.mocked) failures.succeeded(Date.now());
  // Never from mock mode (local, e2e): those are not real requests.
  if (!isMockProvider()) void trackServerEvent('ai-request', '/app', { action: opts.action, result });
  return res;
}

// A failed settle leaves the whole hold in place: the member keeps less, never
// more, than their real use allows.
async function settleSafely(hold: Hold, realUsd: number | null): Promise<void> {
  await settle(hold, realUsd).catch((err: unknown) => console.error(`[ai] settle failed: ${err instanceof Error ? err.message : 'unknown'}`));
}
