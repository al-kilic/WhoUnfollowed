import { NextResponse } from 'next/server';
import { platformSchema } from '@ig-tracker/core';
import { actionResponse, guardProAi, localeOf, needsOnboarding, readJson } from '@/lib/ai/guard';
import { runPlanRevise } from '@/lib/ai/actions';

// One feedback round on a 30-day plan ("move the Reels to weekends"). The
// first few rounds within a week of the plan are included; see config.ts.
export async function POST(req: Request) {
  const g = await guardProAi();
  if (!g.ok) return g.response;
  if (!g.onboarded) return needsOnboarding();
  const body = (await readJson(req)) as { id?: unknown; feedback?: unknown; platform?: unknown; locale?: unknown } | null;
  const id = typeof body?.id === 'string' ? body.id : '';
  const feedback = typeof body?.feedback === 'string' ? body.feedback.trim() : '';
  if (!id || feedback.length < 3 || feedback.length > 500) return NextResponse.json({ error: 'invalid' }, { status: 400 });
  const platform = platformSchema.catch('instagram').parse(body?.platform);
  const res = await runPlanRevise(g.userId, { id, feedback, platform }, localeOf(body?.locale));
  if (!res.ok && res.reason === 'not_found') return NextResponse.json({ error: 'not_found' }, { status: 404 });
  return actionResponse(res as Exclude<typeof res, { reason: 'not_found' }>);
}
