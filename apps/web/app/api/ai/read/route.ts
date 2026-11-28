import { NextResponse } from 'next/server';
import { platformSchema } from '@ig-tracker/core';
import { actionResponse, guardProAi, localeOf, needsOnboarding, readJson } from '@/lib/ai/guard';
import { readStatus, runRead } from '@/lib/ai/actions';

// A coach read of the latest export, asked for by the member (after the free
// reads this month it costs credits; at most one a day).
export async function POST(req: Request) {
  const g = await guardProAi();
  if (!g.ok) return g.response;
  if (!g.onboarded) return needsOnboarding();
  const body = (await readJson(req)) as { platform?: unknown; locale?: unknown } | null;
  const platform = platformSchema.catch('instagram').parse(body?.platform);
  const status = await readStatus(g.userId, platform);
  if (status.kind === 'tomorrow') return NextResponse.json({ ok: false, error: 'read_tomorrow' }, { status: 429 });
  return actionResponse(await runRead(g.userId, platform, localeOf(body?.locale)));
}
