import { NextResponse } from 'next/server';
import { guardProAi, readJson } from '@/lib/ai/guard';
import { getMemory, saveMemoryByUser, wipeAiData } from '@/lib/ai/store';

// The user's memory.md: read it, edit it, or delete everything the coach knows.
export const dynamic = 'force-dynamic';

export async function GET() {
  const g = await guardProAi();
  if (!g.ok) return g.response;
  return NextResponse.json({ memory: await getMemory(g.userId) });
}

export async function PUT(req: Request) {
  const g = await guardProAi();
  if (!g.ok) return g.response;
  const body = (await readJson(req)) as { content?: unknown; version?: unknown } | null;
  if (typeof body?.content !== 'string' || typeof body.version !== 'number') return NextResponse.json({ error: 'invalid' }, { status: 400 });
  const res = await saveMemoryByUser(g.userId, body.content, body.version);
  if (!res.ok) return NextResponse.json({ error: res.reason }, { status: res.reason === 'conflict' ? 409 : 400 });
  return NextResponse.json({ ok: true, version: res.version });
}

export async function DELETE() {
  const g = await guardProAi();
  if (!g.ok) return g.response;
  await wipeAiData(g.userId);
  return NextResponse.json({ ok: true });
}
