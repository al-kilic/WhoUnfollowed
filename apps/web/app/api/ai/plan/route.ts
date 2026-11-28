import { NextResponse } from 'next/server';
import { aiPlanRequestSchema, platformSchema } from '@ig-tracker/core';
import { actionResponse, guardProAi, localeOf, needsOnboarding, readJson } from '@/lib/ai/guard';
import { runPlan } from '@/lib/ai/actions';

export async function POST(req: Request) {
  const g = await guardProAi();
  if (!g.ok) return g.response;
  if (!g.onboarded) return needsOnboarding();
  const body = (await readJson(req)) as Record<string, unknown> | null;
  const parsed = aiPlanRequestSchema.safeParse(body ?? {});
  if (!parsed.success) return NextResponse.json({ error: 'invalid' }, { status: 400 });
  const platform = platformSchema.catch('instagram').parse(body?.platform);
  return actionResponse(await runPlan(g.userId, { ...parsed.data, platform }, localeOf(body?.locale)));
}
