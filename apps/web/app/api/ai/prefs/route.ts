import { NextResponse } from 'next/server';
import { aiPrefsSchema } from '@ig-tracker/core';
import { guardProAi, readJson } from '@/lib/ai/guard';
import { getPrefs, savePrefs } from '@/lib/ai/prefs';

// You > Settings > Coach. No model call and no credits.
export const dynamic = 'force-dynamic';

export async function GET() {
  const g = await guardProAi();
  if (!g.ok) return g.response;
  return NextResponse.json(await getPrefs(g.userId));
}

export async function POST(req: Request) {
  const g = await guardProAi();
  if (!g.ok) return g.response;
  const parsed = aiPrefsSchema.safeParse(await readJson(req));
  if (!parsed.success) return NextResponse.json({ error: 'invalid' }, { status: 400 });
  await savePrefs(g.userId, parsed.data);
  return NextResponse.json(parsed.data);
}
