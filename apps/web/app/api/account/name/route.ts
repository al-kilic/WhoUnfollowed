import { NextResponse } from 'next/server';
import { displayNameSchema } from '@ig-tracker/core';
import { validateRequest } from '@/lib/auth/session';
import { checkRateLimit } from '@/lib/auth/rate-limit';
import { db } from '@/lib/db/index';
import { profiles } from '@/lib/db/schema';

// You > profile: the optional name Today greets with. Any signed-in member,
// no plan needed. An empty name clears it.
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const { user } = await validateRequest();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (!checkRateLimit(`display-name:${user.id}`).allowed) return NextResponse.json({ error: 'busy' }, { status: 429 });
  const parsed = displayNameSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'invalid' }, { status: 400 });
  const name = parsed.data.name || null;
  await db.insert(profiles).values({ userId: user.id, displayName: name })
    .onConflictDoUpdate({ target: profiles.userId, set: { displayName: name } });
  return NextResponse.json({ name });
}
