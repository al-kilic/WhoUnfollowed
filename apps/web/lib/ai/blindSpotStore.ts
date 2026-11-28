import 'server-only';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/index';
import { aiBlindspots } from '@/lib/db/schema';
import { rowsToState, stateToRows, type CardState, type SpotRow } from './blindSpotState';

// Memory v2 (phase 2E): blind-spot cadence for Pro AI members, in the database
// so it follows them across browsers. Anonymous and sample visitors keep it in
// the browser (blindSpotState.ts).

const ms = (d: Date | null) => (d ? d.getTime() : null);

async function rowsOf(userId: string): Promise<SpotRow[]> {
  const rows = await db.select().from(aiBlindspots).where(eq(aiBlindspots.userId, userId));
  return rows.map((r) => ({
    key: r.key, detector: r.detector, status: r.status === 'dismissed' ? 'dismissed' : 'open', isCurrent: r.isCurrent,
    dataKey: r.dataKey, shownCount: r.shownCount, firstSeenAt: ms(r.firstSeenAt), snoozeUntil: ms(r.snoozeUntil),
  }));
}

export async function loadSpotState(userId: string): Promise<CardState> {
  return rowsToState(await rowsOf(userId));
}

export async function saveSpotState(userId: string, next: CardState, dataKey: string | null, now: number = Date.now()): Promise<void> {
  const rows = stateToRows(next, await rowsOf(userId), dataKey, now);
  await db.transaction(async (tx) => {
    for (const r of rows) {
      const values = {
        detector: r.detector, status: r.status, isCurrent: r.isCurrent, dataKey: r.dataKey, shownCount: r.shownCount,
        firstSeenAt: r.firstSeenAt ? new Date(r.firstSeenAt) : null, lastShownAt: r.isCurrent ? new Date(now) : null,
        snoozeUntil: r.snoozeUntil ? new Date(r.snoozeUntil) : null,
      };
      await tx.insert(aiBlindspots).values({ userId, key: r.key, ...values })
        .onConflictDoUpdate({ target: [aiBlindspots.userId, aiBlindspots.key], set: { ...values, lastShownAt: values.lastShownAt ?? undefined } });
    }
  });
}
