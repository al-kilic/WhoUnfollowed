import { NextResponse } from 'next/server';
import { aiSignalRequestSchema } from '@ig-tracker/core';
import { guardProAi, readJson } from '@/lib/ai/guard';
import { saveSignals } from '@/lib/ai/signals';

// What a Pro AI member did with an answer (picked or edited a draft, used a
// hook, thumbs). Batched from the browser, no model call, no credits.
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const g = await guardProAi();
  if (!g.ok) return g.response;
  const parsed = aiSignalRequestSchema.safeParse(await readJson(req));
  if (!parsed.success) return NextResponse.json({ error: 'invalid' }, { status: 400 });
  const saved = await saveSignals(g.userId, parsed.data.signals);
  if (!saved) return NextResponse.json({ error: 'busy' }, { status: 429 });
  return NextResponse.json({ ok: true, saved });
}
