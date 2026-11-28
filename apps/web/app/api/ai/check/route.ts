import { NextResponse } from 'next/server';
import { aiCheckRequestSchema, platformSchema } from '@ig-tracker/core';
import { actionResponse, guardProAi, localeOf, needsOnboarding, readJson } from '@/lib/ai/guard';
import { runCheck } from '@/lib/ai/actions';

// Pre-post check. The cover image (if any) is used for this one call and never stored.
export async function POST(req: Request) {
  const g = await guardProAi();
  if (!g.ok) return g.response;
  if (!g.onboarded) return needsOnboarding();
  const body = (await readJson(req)) as Record<string, unknown> | null;
  const parsed = aiCheckRequestSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'invalid' }, { status: 400 });
  const platform = platformSchema.catch('instagram').parse(body?.platform);
  return actionResponse(await runCheck(g.userId, { ...parsed.data, platform }, localeOf(body?.locale)));
}
