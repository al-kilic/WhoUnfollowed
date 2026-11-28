import { cache } from 'react';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/index';
import { profiles } from '@/lib/db/schema';

// The viewer's profiles row, read once per server render. A Studio page used
// to read the same row four times (subscription status, Lifetime, Pro AI plan,
// display name). React's cache only memoises inside a render; in route
// handlers and server actions every call still reads the database, so a write
// followed by a read there always sees the new row.
export const getProfileRow = cache(async (userId: string) =>
  db.query.profiles.findFirst({ where: eq(profiles.userId, userId) }),
);
