import { NextResponse } from 'next/server';
import { aiContentUploadSchema, platformSchema } from '@ig-tracker/core';
import { guardProAi, readJson } from '@/lib/ai/guard';
import { getContentStats, getInsights, loadLedger, saveContent } from '@/lib/ai/memoryData';
import { underLimit } from '@/lib/ai/routeLimit';

// The member's posting history, export moments and Instagram's own numbers,
// worked out in the browser from their export: numbers and dates only. No model call, no credits.
export const dynamic = 'force-dynamic';

// GET ?platform=: the saved history numbers and the what-worked rows by format.
export async function GET(req: Request) {
  const g = await guardProAi();
  if (!g.ok) return g.response;
  if (!underLimit(`content-stats:get:${g.userId}`)) return NextResponse.json({ error: 'busy' }, { status: 429 });
  const p = platformSchema.safeParse(new URL(req.url).searchParams.get('platform') ?? 'instagram');
  if (!p.success) return NextResponse.json({ error: 'invalid' }, { status: 400 });
  const [stats, insights, ledger] = await Promise.all([getContentStats(g.userId, p.data), getInsights(g.userId, p.data), loadLedger(g.userId, p.data)]);
  return NextResponse.json({ stats, insights, ledger: { avgAll: ledger.avgAll, posts: ledger.posts.length, formats: ledger.formats, topics: ledger.topics } });
}

export async function POST(req: Request) {
  const g = await guardProAi();
  if (!g.ok) return g.response;
  if (!underLimit(`content-stats:${g.userId}`, 10)) return NextResponse.json({ error: 'busy' }, { status: 429 });
  const parsed = aiContentUploadSchema.safeParse(await readJson(req));
  if (!parsed.success) return NextResponse.json({ error: 'invalid' }, { status: 400 });
  const saved = await saveContent(g.userId, parsed.data);
  return NextResponse.json({ ok: true, moments: saved.moments, filled: saved.filled });
}
