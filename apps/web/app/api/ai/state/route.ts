import { NextResponse } from 'next/server';
import { guardProAi } from '@/lib/ai/guard';
import { getCredits } from '@/lib/ai/credits';
import { allowanceFor } from '@/lib/ai/allowance';
import { latestContent } from '@/lib/ai/store';
import { AI_ACTIONS } from '@/lib/ai/config';
import { getPrefs } from '@/lib/ai/prefs';

// What the Pro AI screens need on load: plan, the usage allowance (a share for
// a bar and flags, never dollar amounts), onboarding and the latest AI read.
// `credits` and `costs` (all 0) stay until the old credit screens are gone.
export const dynamic = 'force-dynamic';

export async function GET() {
  const g = await guardProAi();
  if (!g.ok) return g.response;
  const [credits, allowance, read, prefs] = await Promise.all([getCredits(g.userId), allowanceFor(g.userId, g.access), latestContent(g.userId, 'read'), getPrefs(g.userId)]);
  return NextResponse.json({
    plan: g.access.plan,
    onboarded: g.onboarded,
    allowance,
    credits,
    costs: Object.fromEntries(Object.entries(AI_ACTIONS).map(([k, v]) => [k, v.credits])),
    prefs,
    latestRead: read ? { id: read.id, platform: read.topic, createdAt: read.createdAt, data: JSON.parse(read.output) as unknown } : null,
  });
}
