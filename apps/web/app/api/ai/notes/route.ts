import { NextResponse } from 'next/server';
import { aiNoteOpSchema } from '@ig-tracker/core';
import { guardProAi, readJson } from '@/lib/ai/guard';
import { applyNoteOp, listNotes } from '@/lib/ai/notesView';
import { underLimit } from '@/lib/ai/routeLimit';

// You > Memory: the coach's notes about this member, and what they change
// (pin, edit, forget, keep, add, resolve). No model call, no credits.
export const dynamic = 'force-dynamic';

export async function GET() {
  const g = await guardProAi();
  if (!g.ok) return g.response;
  if (!underLimit(`notes:get:${g.userId}`)) return NextResponse.json({ error: 'busy' }, { status: 429 });
  return NextResponse.json(await listNotes(g.userId));
}

export async function POST(req: Request) {
  const g = await guardProAi();
  if (!g.ok) return g.response;
  if (!underLimit(`notes:post:${g.userId}`, 30)) return NextResponse.json({ error: 'busy' }, { status: 429 });
  const parsed = aiNoteOpSchema.safeParse(await readJson(req));
  if (!parsed.success) return NextResponse.json({ error: 'invalid' }, { status: 400 });
  const res = await applyNoteOp(g.userId, parsed.data);
  if (!res.ok) return NextResponse.json({ error: res.reason }, { status: res.reason === 'not_found' ? 404 : 409 });
  return NextResponse.json({ ok: true, ...(res.id ? { id: res.id } : {}) });
}
