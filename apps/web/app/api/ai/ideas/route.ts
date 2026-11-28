import { NextResponse } from 'next/server';
import { aiIdeasRequestSchema, platformSchema } from '@ig-tracker/core';
import { actionResponse, guardProAi, localeOf, needsOnboarding, readJson } from '@/lib/ai/guard';
import { runIdeas } from '@/lib/ai/actions';

// Idea bank: five post ideas built from memory and the latest numbers.
export async function POST(req: Request) {
  const g = await guardProAi();
  if (!g.ok) return g.response;
  if (!g.onboarded) return needsOnboarding();
  const body = (await readJson(req)) as Record<string, unknown> | null;
  const parsed = aiIdeasRequestSchema.safeParse(body ?? {});
  if (!parsed.success) return NextResponse.json({ error: 'invalid' }, { status: 400 });
  const platform = platformSchema.catch('instagram').parse(body?.platform);
  return actionResponse(await runIdeas(g.userId, { ...parsed.data, platform }, localeOf(body?.locale)));
}
