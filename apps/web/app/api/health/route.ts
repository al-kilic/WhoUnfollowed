import { NextResponse } from 'next/server';
import { sql } from 'drizzle-orm';
import { db } from '@/lib/db/index';

// Uptime probe for the external monitor (UptimeRobot). 200 means the web
// container is serving and Postgres answers; 503 means the database is down
// or too slow. Reveals nothing beyond up/down.
export const dynamic = 'force-dynamic';

const DB_TIMEOUT_MS = 3000;

export async function GET() {
  let dbOk = false;
  try {
    await Promise.race([
      db.execute(sql`select 1`),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), DB_TIMEOUT_MS)),
    ]);
    dbOk = true;
  } catch {
    dbOk = false;
  }

  return NextResponse.json(
    { status: dbOk ? 'ok' : 'error', db: dbOk ? 'ok' : 'down' },
    { status: dbOk ? 200 : 503, headers: { 'Cache-Control': 'no-store' } },
  );
}
