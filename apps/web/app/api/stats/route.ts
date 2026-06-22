import { NextResponse } from 'next/server';
import { db } from '@/lib/db/index';
import { sql } from 'drizzle-orm';

// Stats live in Postgres (a single-row `app_stats` table on the persistent
// volume) so the counter is global across every user/session and survives
// deploys. The previous JSON-file approach reset to the seed on every redeploy
// because the web container has no persistent volume.

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

// Seeded at real testing baseline — app was tested 1000+ times before beta
const SEED_SNAPSHOTS         = 1047;
const SEED_NON_FOLLOWER_SUM  = 241_081; // produces ~230 avg at seed

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
      tableReady = null; // allow a later request to retry provisioning
      throw err;
    });
  }
  return tableReady;
}

// postgres.js returns bigint columns as strings to avoid precision loss.
function toNum(v: unknown): number {
  return typeof v === 'bigint' ? Number(v) : Number(v ?? 0);
}

export async function GET() {
  try {
    await ensureStats();
    const rows = (await db.execute(
      sql`SELECT snapshots, non_follower_sum FROM app_stats WHERE id = 1`,
    )) as unknown as { snapshots: unknown; non_follower_sum: unknown }[];
    const snapshots = toNum(rows[0]?.snapshots);
    const sum       = toNum(rows[0]?.non_follower_sum);
    const avgNonFollowers = snapshots > 0 ? Math.round(sum / snapshots) : 0;
    return NextResponse.json({ snapshots, avgNonFollowers });
  } catch {
    // Never break the landing page — fall back to the seed display.
    return NextResponse.json({
      snapshots: SEED_SNAPSHOTS,
      avgNonFollowers: Math.round(SEED_NON_FOLLOWER_SUM / SEED_SNAPSHOTS),
    });
  }
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (isStatsRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  let body: { nonFollowerCount?: unknown };
  try { body = await req.json() as typeof body; } catch { body = {}; }

  // Clamp to a sane range so one request can't skew the running average.
  const raw = typeof body.nonFollowerCount === 'number' ? Math.floor(body.nonFollowerCount) : 0;
  const nonFollowerCount = Math.max(0, Math.min(100_000, raw));

  try {
    await ensureStats();
    const rows = (await db.execute(sql`
      UPDATE app_stats
      SET snapshots = snapshots + 1,
          non_follower_sum = non_follower_sum + ${nonFollowerCount}
      WHERE id = 1
      RETURNING snapshots
    `)) as unknown as { snapshots: unknown }[];
    return NextResponse.json({ ok: true, snapshots: toNum(rows[0]?.snapshots) });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
