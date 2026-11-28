import { NextResponse } from 'next/server';
import { aiLearnedSeenSchema } from '@ig-tracker/core';
import { guardProAi, localeOf, readJson } from '@/lib/ai/guard';
import { ensureLearnedNote, listLearned, markLearnedSeen } from '@/lib/ai/notesView';
import { underLimit } from '@/lib/ai/routeLimit';

// The weekly "what your coach learned" note. Built the first time it is asked
// for each week (no model call). ?locale=es|pt picks the language of new notes.
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const g = await guardProAi();
  if (!g.ok) return g.response;
  if (!underLimit(`learned:get:${g.userId}`)) return NextResponse.json({ error: 'busy' }, { status: 429 });
  await ensureLearnedNote(g.userId, localeOf(new URL(req.url).searchParams.get('locale'))).catch(() => undefined);
  return NextResponse.json({ weeks: await listLearned(g.userId) });
}

export async function POST(req: Request) {
  const g = await guardProAi();
  if (!g.ok) return g.response;
  if (!underLimit(`learned:post:${g.userId}`, 30)) return NextResponse.json({ error: 'busy' }, { status: 429 });
  const parsed = aiLearnedSeenSchema.safeParse(await readJson(req));
  if (!parsed.success) return NextResponse.json({ error: 'invalid' }, { status: 400 });
  if (!(await markLearnedSeen(g.userId, parsed.data.weekKey))) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
