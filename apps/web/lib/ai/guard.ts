import 'server-only';
import { NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth/session';
import { getProAiAccess, type ProAiAccess } from './access';
import { ensureGrants } from './allowance';
import { getAiProfile } from './store';
import type { AiLocale } from './prompts';
import type { ActionResult } from './actions';

export type Guarded =
  | { ok: true; userId: string; access: ProAiAccess; onboarded: boolean }
  | { ok: false; response: NextResponse };

// Every Pro AI route starts here: signed in, on a Pro AI plan, this month's
// allowance (or the one-time gift or trial) granted. Whether there is use left
// is checked per call in run.ts. Routes that need memory also check `onboarded`.
export async function guardProAi(): Promise<Guarded> {
  const { user } = await validateRequest();
  if (!user) return { ok: false, response: NextResponse.json({ error: 'unauthorized' }, { status: 401 }) };
  const access = await getProAiAccess(user.id);
  if (!access) return { ok: false, response: NextResponse.json({ error: 'not_pro_ai' }, { status: 403 }) };
  await ensureGrants(user.id, access).catch((err: unknown) => console.error(`[ai] grant failed: ${err instanceof Error ? err.message : 'unknown'}`));
  const profile = await getAiProfile(user.id);
  return { ok: true, userId: user.id, access, onboarded: !!profile?.onboardedAt };
}

export function localeOf(value: unknown): AiLocale {
  return value === 'es' || value === 'pt' ? value : 'en';
}

export async function readJson(req: Request): Promise<unknown> {
  return req.json().catch(() => null);
}

// Same response shape for every action.
export function actionResponse<T>(res: ActionResult<T> & { precheck?: unknown }): NextResponse {
  if (res.ok) return NextResponse.json({ ok: true, data: res.data, added: res.added, balance: res.balance, logId: res.logId, mocked: res.mocked, ...(res.seen ? { seen: { text: res.seen.text, sources: res.seen.sources } } : {}), ...(res.precheck ? { precheck: res.precheck } : {}) });
  if (res.reason === 'allowance_empty') return NextResponse.json({ ok: false, error: 'allowance_empty' }, { status: 402 });
  if (res.reason === 'pace_limit') return NextResponse.json({ ok: false, error: 'pace_limit' }, { status: 429 });
  if (res.reason === 'busy') return NextResponse.json({ ok: false, error: 'busy' }, { status: 429 });
  if (res.reason === 'needs_export') return NextResponse.json({ ok: false, error: 'needs_export' }, { status: 409 });
  if (res.reason === 'not_allowed') return NextResponse.json({ ok: false, error: 'not_pro_ai' }, { status: 403 });
  if (res.reason === 'paused') return NextResponse.json({ ok: false, error: 'paused' }, { status: 503 });
  return NextResponse.json({ ok: false, error: 'failed' }, { status: 502 });
}

export const needsOnboarding = () => NextResponse.json({ error: 'needs_onboarding' }, { status: 409 });
