import 'server-only';
import { and, eq, gte, sql } from 'drizzle-orm';
import { db } from '@/lib/db/index';
import { aiUsageLog } from '@/lib/db/schema';
import type { SpendSource } from './spendCap';

export interface TokenUse { input: number; output: number; cacheRead: number; cacheWrite: number }

// What each model call cost us: the action, model, cost and token counts
// (uncached input, output, cache reads and writes). Never prompts or answers.
export async function logUsage(userId: string, action: string, model: string, costUsd: number | null, tokens?: TokenUse): Promise<void> {
  if (typeof costUsd !== 'number' || !Number.isFinite(costUsd) || costUsd <= 0) return;
  const t = (n: number | undefined) => (Number.isFinite(n) && (n ?? 0) > 0 ? Math.round(n!) : 0);
  await db.insert(aiUsageLog).values({
    userId, action, model, costUsd,
    inputTokens: t(tokens?.input), outputTokens: t(tokens?.output), cacheReadTokens: t(tokens?.cacheRead), cacheWriteTokens: t(tokens?.cacheWrite),
  });
}

const sum = sql<number>`coalesce(sum(${aiUsageLog.costUsd}), 0)::float8`;

export const usageSource: SpendSource = {
  async total(since) {
    const [row] = await db.select({ v: sum }).from(aiUsageLog).where(gte(aiUsageLog.createdAt, since));
    return Number(row?.v ?? 0);
  },
  async forUser(userId, since) {
    const [row] = await db.select({ v: sum }).from(aiUsageLog).where(and(eq(aiUsageLog.userId, userId), gte(aiUsageLog.createdAt, since)));
    return Number(row?.v ?? 0);
  },
};
