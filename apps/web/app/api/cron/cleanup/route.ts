import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/index';
import { profiles, users } from '@/lib/db/schema';
import { and, eq, lte, isNotNull } from 'drizzle-orm';

// Called daily by a server cron (e.g. `curl https://yourdomain.com/api/cron/cleanup`)
// Deletes accounts whose grace period has expired.
export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-cron-secret');
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();

  // Find all profiles past their grace period
  const expired = await db.query.profiles.findMany({
    where: and(
      eq(profiles.subscriptionStatus, 'grace'),
      isNotNull(profiles.gracePeriodEndsAt),
      lte(profiles.gracePeriodEndsAt, now),
    ),
    columns: { userId: true },
  });

  if (expired.length === 0) {
    return NextResponse.json({ deleted: 0 });
  }

  // Delete users — cascade handles profiles, sessions, snapshots, sync_settings
  for (const profile of expired) {
    await db.delete(users).where(eq(users.id, profile.userId));
  }

  console.log(`[cron/cleanup] Deleted ${expired.length} expired accounts`);

  return NextResponse.json({ deleted: expired.length });
}
