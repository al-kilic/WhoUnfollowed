import { NextResponse } from 'next/server';
import { platformSchema } from '@ig-tracker/core';
import { guardProAi } from '@/lib/ai/guard';
import { getMoments } from '@/lib/ai/memoryData';
import { underLimit } from '@/lib/ai/routeLimit';

// Key moments the member's exports show (best month, spikes, quiet months,
// follow sprees, drops). ?platform= narrows it. No model call.
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const g = await guardProAi();
  if (!g.ok) return g.response;
  if (!underLimit(`moments:${g.userId}`)) return NextResponse.json({ error: 'busy' }, { status: 429 });
  const p = platformSchema.safeParse(new URL(req.url).searchParams.get('platform'));
  return NextResponse.json({ moments: await getMoments(g.userId, p.success ? p.data : undefined) });
}
