import { NextResponse } from 'next/server';
import { aiPlanCalendarSchema } from '@ig-tracker/core';
import { guardProAi, readJson } from '@/lib/ai/guard';
import { savePlanCalendar } from '@/lib/ai/store';

// Saves the edited calendar of a 30-day plan (posted, moved, added posts).
// No model call, no credits.
export async function POST(req: Request) {
  const g = await guardProAi();
  if (!g.ok) return g.response;
  const parsed = aiPlanCalendarSchema.safeParse(await readJson(req));
  if (!parsed.success) return NextResponse.json({ error: 'invalid' }, { status: 400 });
  const days = parsed.data.items.map((i) => i.day);
  if (new Set(days).size !== days.length) return NextResponse.json({ error: 'invalid' }, { status: 400 });
  const ok = await savePlanCalendar(g.userId, parsed.data.id, parsed.data.items);
  return ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: 'not_found' }, { status: 404 });
}
