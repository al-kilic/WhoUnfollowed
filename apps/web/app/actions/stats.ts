'use server';

import { headers } from 'next/headers';
import { bumpStats } from '@/lib/stats';

// Rate limit: max 3 records per IP per minute (in-memory, per instance).
const rateMap = new Map<string, { count: number; resetAt: number }>();
function isRateLimited(ip: string): boolean {
  const now   = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  if (entry.count >= 3) return true;
  entry.count++;
  return false;
}

// Called from the client after a successful parse. A Server Action posts to the
// page route (not a blockable /api/stats URL), so privacy blockers don't drop it.
export async function recordParse(nonFollowerCount: number): Promise<void> {
  try {
    const h  = await headers();
    const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
    if (isRateLimited(ip)) return;
    await bumpStats(nonFollowerCount);
  } catch {
    // best-effort; never surface to the user
  }
}
