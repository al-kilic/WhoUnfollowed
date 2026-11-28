import { NextResponse } from 'next/server';
import { aiInsightsRequestSchema, platformSchema } from '@ig-tracker/core';
import { actionResponse, guardProAi, localeOf, needsOnboarding } from '@/lib/ai/guard';
import { guardUpload } from '@/lib/ai/uploadGuard';
import { UPLOAD_LIMITS } from '@/lib/uploadLimits';
import { runInsights } from '@/lib/ai/actions';

// Photo insights: 3 to 8 of the user's own posts with their numbers.
export async function POST(req: Request) {
  const g = await guardProAi();
  if (!g.ok) return g.response;
  if (!g.onboarded) return needsOnboarding();
  const up = await guardUpload(req, g.userId, 'insights', UPLOAD_LIMITS.body.insights);
  if (!up.ok) return up.response;
  const body = up.json as Record<string, unknown> | null;
  const parsed = aiInsightsRequestSchema.safeParse(body ?? {});
  if (!parsed.success) return NextResponse.json({ error: 'invalid' }, { status: 400 });
  const platform = platformSchema.catch('instagram').parse(body?.platform);
  const res = await runInsights(g.userId, { ...parsed.data, platform }, localeOf(body?.locale));
  if (res.ok) up.done();
  return actionResponse(res);
}
