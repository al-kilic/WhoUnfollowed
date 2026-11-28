import { NextResponse } from 'next/server';
import { aiVoiceUploadSchema } from '@ig-tracker/core';
import { guardProAi } from '@/lib/ai/guard';
import { guardUpload } from '@/lib/ai/uploadGuard';
import { UPLOAD_LIMITS } from '@/lib/uploadLimits';
import { getVoice, saveVoice } from '@/lib/ai/memoryData';
import { underLimit } from '@/lib/ai/routeLimit';

// "Learn my voice": caption habits (numbers) and up to 12 short examples the
// member chose to share, worked out from their export in the browser. Only
// after they said yes (consent: true). No model call, no credits.
export const dynamic = 'force-dynamic';

// GET: what the coach keeps about how the member writes (null until shared).
export async function GET() {
  const g = await guardProAi();
  if (!g.ok) return g.response;
  if (!underLimit(`voice:get:${g.userId}`)) return NextResponse.json({ error: 'busy' }, { status: 429 });
  return NextResponse.json({ voice: await getVoice(g.userId) });
}

export async function POST(req: Request) {
  const g = await guardProAi();
  if (!g.ok) return g.response;
  if (!underLimit(`voice:${g.userId}`, 10)) return NextResponse.json({ error: 'busy' }, { status: 429 });
  const up = await guardUpload(req, g.userId, 'voice', UPLOAD_LIMITS.body.voice);
  if (!up.ok) return up.response;
  const parsed = aiVoiceUploadSchema.safeParse(up.json);
  if (!parsed.success) return NextResponse.json({ error: 'invalid' }, { status: 400 });
  await saveVoice(g.userId, parsed.data);
  up.done();
  return NextResponse.json({ ok: true, exemplars: parsed.data.exemplars.length });
}
