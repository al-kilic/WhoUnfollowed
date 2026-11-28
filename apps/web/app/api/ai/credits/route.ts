import { NextResponse } from 'next/server';
import { and, eq, gte } from 'drizzle-orm';
import { guardProAi } from '@/lib/ai/guard';
import { creditHistory, getCredits } from '@/lib/ai/credits';
import { MONTHLY_CREDITS } from '@/lib/ai/config';
import { allowanceFor } from '@/lib/ai/allowance';
import { usageBreakdown } from '@/lib/ai/usageBreakdown';
import { db } from '@/lib/db/index';
import { aiUsageLog } from '@/lib/db/schema';

// Studio > You: the usage allowance and what it went to, as shares only (no
// dollar amounts). The old credit fields stay until the credit screens are gone.
export const dynamic = 'force-dynamic';

export async function GET() {
  const g = await guardProAi();
  if (!g.ok) return g.response;
  const now = new Date();
  const since = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5, 1));
  const [credits, history, usage, rows] = await Promise.all([
    getCredits(g.userId), creditHistory(g.userId), allowanceFor(g.userId, g.access),
    db.select({ action: aiUsageLog.action, costUsd: aiUsageLog.costUsd, at: aiUsageLog.createdAt }).from(aiUsageLog)
      .where(and(eq(aiUsageLog.userId, g.userId), gte(aiUsageLog.createdAt, since))).catch(() => []),
  ]);
  // This period started a month before it resets (or on the 1st when there is no reset date).
  const reset = usage.resetsAt ? new Date(usage.resetsAt) : null;
  const periodStart = reset ? new Date(Date.UTC(reset.getUTCFullYear(), reset.getUTCMonth() - 1, reset.getUTCDate(), reset.getUTCHours())) : new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const breakdown = usageBreakdown(rows, periodStart, now);
  return NextResponse.json({ ...credits, allowance: MONTHLY_CREDITS[g.access.plan], history, usage, breakdown });
}
