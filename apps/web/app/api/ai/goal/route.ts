import { NextResponse } from 'next/server';
import { aiGoalRequestSchema, platformSchema } from '@ig-tracker/core';
import { guardProAi, readJson } from '@/lib/ai/guard';
import { deleteGoal, getGoalView, saveGoal } from '@/lib/ai/goals';

// Studio > Plan > Goals, one goal per platform. No model call: counts only.
// ?platform= picks the platform; without it, Instagram when it has data, else the latest export's platform.
export const dynamic = 'force-dynamic';

function platformParam(req: Request) {
  const v = new URL(req.url).searchParams.get('platform');
  if (v === null) return { ok: true as const, platform: null };
  const p = platformSchema.safeParse(v);
  return p.success ? { ok: true as const, platform: p.data } : { ok: false as const };
}

export async function GET(req: Request) {
  const g = await guardProAi();
  if (!g.ok) return g.response;
  const p = platformParam(req);
  if (!p.ok) return NextResponse.json({ error: 'invalid' }, { status: 400 });
  return NextResponse.json(await getGoalView(g.userId, p.platform));
}

export async function POST(req: Request) {
  const g = await guardProAi();
  if (!g.ok) return g.response;
  const parsed = aiGoalRequestSchema.safeParse(await readJson(req));
  if (!parsed.success) return NextResponse.json({ error: 'invalid' }, { status: 400 });
  const platform = await saveGoal(g.userId, parsed.data);
  return NextResponse.json(await getGoalView(g.userId, platform));
}

export async function DELETE(req: Request) {
  const g = await guardProAi();
  if (!g.ok) return g.response;
  const p = platformParam(req);
  if (!p.ok || !p.platform) return NextResponse.json({ error: 'invalid' }, { status: 400 });
  await deleteGoal(g.userId, p.platform);
  return NextResponse.json(await getGoalView(g.userId, p.platform));
}
