import { NextResponse } from 'next/server';
import { aiBlindspotStateSchema } from '@ig-tracker/core';
import { guardProAi, readJson } from '@/lib/ai/guard';
import { loadSpotState, saveSpotState } from '@/lib/ai/blindSpotStore';
import { underLimit } from '@/lib/ai/routeLimit';

// When Today showed each blind spot and what the member answered, so it
// follows them across browsers. Numbers and keys only. No model call.
export const dynamic = 'force-dynamic';

export async function GET() {
  const g = await guardProAi();
  if (!g.ok) return g.response;
  if (!underLimit(`blindspots:get:${g.userId}`)) return NextResponse.json({ error: 'busy' }, { status: 429 });
  return NextResponse.json({ state: await loadSpotState(g.userId) });
}

export async function POST(req: Request) {
  const g = await guardProAi();
  if (!g.ok) return g.response;
  if (!underLimit(`blindspots:post:${g.userId}`, 30)) return NextResponse.json({ error: 'busy' }, { status: 429 });
  const body = (await readJson(req)) as { state?: unknown; dataKey?: unknown } | null;
  const parsed = aiBlindspotStateSchema.safeParse(body?.state);
  const dataKey = typeof body?.dataKey === 'string' && /^\d{1,12}$/.test(body.dataKey) ? body.dataKey : null;
  if (!parsed.success) return NextResponse.json({ error: 'invalid' }, { status: 400 });
  const history = Object.fromEntries(Object.entries(parsed.data.history).map(([k, h]) => [k, {
    shown: h.shown, ...(h.known ? { known: true } : {}), ...(h.snoozeUntil ? { snoozeUntil: h.snoozeUntil } : {}),
  }]));
  await saveSpotState(g.userId, { ...parsed.data, history }, dataKey);
  return NextResponse.json({ ok: true });
}
