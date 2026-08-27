import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import path from 'path';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db } from '@/lib/db/index';

// Invoked by the deploy pipeline (from inside this same container, over its
// own loopback — never exposed publicly) right after a new image starts, so
// pending migrations actually apply. Importing the migrator directly here
// (rather than in an ad-hoc `docker exec node -e` script) is what makes Next's
// standalone build tracer bundle it — a bare inline script reaching for
// drizzle-orm/postgres-js/migrator at deploy time silently fails because that
// subpath isn't referenced anywhere else the app actually runs.
function isAuthorized(req: Request): boolean {
  const expected = process.env.MIGRATE_SECRET;
  if (!expected) return false;
  const provided = req.headers.get('x-migrate-secret') ?? '';
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Next's standalone server.js does process.chdir(__dirname) on startup,
    // so cwd here is already .../apps/web — not the monorepo root.
    await migrate(db, { migrationsFolder: path.join(process.cwd(), 'lib/db/migrations') });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[internal/migrate] failed:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Migration failed' },
      { status: 500 },
    );
  }
}
