'use server';

import { redirect } from 'next/navigation';
import { db } from '@/lib/db/index';
import { users } from '@/lib/db/schema';
import { validateRequest, invalidateSession } from '@/lib/auth/session';
import { eq } from 'drizzle-orm';

export async function deleteAccountAction() {
  const { user, session } = await validateRequest();
  if (!user || !session) redirect('/login');

  await invalidateSession(session.id);
  // Cascade deletes handle profiles, sessions, snapshots, sync_settings
  await db.delete(users).where(eq(users.id, user.id));

  redirect('/');
}
