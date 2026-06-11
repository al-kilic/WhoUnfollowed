'use server';

import { redirect } from 'next/navigation';
import { db } from '@/lib/db/index';
import { syncSettings, users } from '@/lib/db/schema';
import { validateRequest, invalidateSession } from '@/lib/auth/session';
import { eq } from 'drizzle-orm';

export async function saveSyncSalt(saltB64: string) {
  const { user } = await validateRequest();
  if (!user) return { error: 'Not authenticated.' };

  await db
    .insert(syncSettings)
    .values({ userId: user.id, passphraseSalt: saltB64 })
    .onConflictDoUpdate({
      target: syncSettings.userId,
      set: {
        passphraseSalt: saltB64,
        passphraseSetAt: new Date(),
      },
    });

  return { ok: true };
}

export async function getSyncSalt(): Promise<string | null> {
  const { user } = await validateRequest();
  if (!user) return null;

  const row = await db.query.syncSettings.findFirst({
    where: eq(syncSettings.userId, user.id),
  });

  return row?.passphraseSalt ?? null;
}

export async function deleteAccountAction() {
  const { user, session } = await validateRequest();
  if (!user || !session) redirect('/login');

  await invalidateSession(session.id);
  // Cascade deletes handle profiles, sessions, snapshots, sync_settings
  await db.delete(users).where(eq(users.id, user.id));

  redirect('/');
}
