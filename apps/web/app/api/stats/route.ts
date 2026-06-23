import { NextResponse } from 'next/server';
import { getStats, bumpStats } from '@/lib/stats';

// Kept for compatibility. The landing page no longer relies on this route — it
// reads stats server-side and records parses via a Server Action — because a
// path named /api/stats gets dropped by some privacy/content blockers.

// Rate limit: max 3 POST requests per IP per minute
const statsRateMap = new Map<string, { count: number; resetAt: number }>();
function isStatsRateLimited(ip: string): boolean {
  const now   = Date.now();
  const entry = statsRateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    statsRateMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  if (entry.count >= 3) return true;
  entry.count++;
  return false;
}

export async function GET() {
  return NextResponse.json(await getStats());
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (isStatsRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  let body: { nonFollowerCount?: unknown };
  try { body = await req.json() as typeof body; } catch { body = {}; }

  const nonFollowerCount = typeof body.nonFollowerCount === 'number' ? body.nonFollowerCount : 0;
  const snapshots = await bumpStats(nonFollowerCount);
  return NextResponse.json({ ok: true, snapshots });
}
