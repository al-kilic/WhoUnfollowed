import 'server-only';
import { db } from '@/lib/db/index';
import { sql } from 'drizzle-orm';

// Global usage counter, stored as a single row in Postgres (persistent volume +
// backups) so it survives deploys and is shared across every user/session.
// Read server-side and incremented via a Server Action so privacy/content
// blockers can't suppress it the way they block a fetch to /api/stats.

export interface PublicStats {
  snapshots: number;
  avgNonFollowers: number;
}

// Seeded at real testing baseline — app was tested 1000+ times before beta
const SEED_SNAPSHOTS        = 1047;
const SEED_NON_FOLLOWER_SUM = 241_081; // produces ~230 avg at seed

// Self-provision the table once per process (the migration pipeline here is
// partly hand-managed, so we don't rely on it for this counter).
let tableReady: Promise<void> | null = null;
function ensureStats(): Promise<void> {
  if (!tableReady) {
    tableReady = (async () => {
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS app_stats (
          id integer PRIMARY KEY,
          snapshots integer NOT NULL,
          non_follower_sum bigint NOT NULL
        )
      `);
      await db.execute(sql`
        INSERT INTO app_stats (id, snapshots, non_follower_sum)
        VALUES (1, ${SEED_SNAPSHOTS}, ${SEED_NON_FOLLOWER_SUM})
        ON CONFLICT (id) DO NOTHING
      `);
    })().catch((err) => {
      tableReady = null; // allow a later call to retry provisioning
      throw err;
    });
  }
  return tableReady;
}

// postgres.js returns bigint columns as strings to avoid precision loss.
function toNum(v: unknown): number {
  return typeof v === 'bigint' ? Number(v) : Number(v ?? 0);
}

export function seedStats(): PublicStats {
  return {
    snapshots: SEED_SNAPSHOTS,
    avgNonFollowers: Math.round(SEED_NON_FOLLOWER_SUM / SEED_SNAPSHOTS),
  };
}

export async function getStats(): Promise<PublicStats> {
  try {
    await ensureStats();
    const rows = (await db.execute(
      sql`SELECT snapshots, non_follower_sum FROM app_stats WHERE id = 1`,
    )) as unknown as { snapshots: unknown; non_follower_sum: unknown }[];
    const snapshots = toNum(rows[0]?.snapshots);
    const sum       = toNum(rows[0]?.non_follower_sum);
    return {
      snapshots,
      avgNonFollowers: snapshots > 0 ? Math.round(sum / snapshots) : 0,
    };
  } catch {
    return seedStats(); // never break the page if the DB is unreachable
  }
}

// Atomically record one parse. Returns the new snapshot count.
export async function bumpStats(nonFollowerCount: number): Promise<number> {
  // Clamp so one request can't skew the running average.
  const raw = Math.floor(Number.isFinite(nonFollowerCount) ? nonFollowerCount : 0);
  const n   = Math.max(0, Math.min(100_000, raw));
  await ensureStats();
  const rows = (await db.execute(sql`
    UPDATE app_stats
    SET snapshots = snapshots + 1,
        non_follower_sum = non_follower_sum + ${n}
    WHERE id = 1
    RETURNING snapshots
  `)) as unknown as { snapshots: unknown }[];
  return toNum(rows[0]?.snapshots);
}
