import 'server-only';
import { randomBytes } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/index';
import { syncSettings } from '@/lib/db/schema';

// Returns the user's cloud-sync salt, creating one on first use. The salt is not
// secret (it only personalizes PBKDF2); it is returned to the client so the
// browser can derive the encryption key from the account password.
export async function ensureSyncSalt(userId: string): Promise<string> {
  const existing = await db.query.syncSettings.findFirst({
    where: eq(syncSettings.userId, userId),
  });
  if (existing) return existing.passphraseSalt;

  const saltB64 = randomBytes(16).toString('base64');
  await db
    .insert(syncSettings)
    .values({ userId, passphraseSalt: saltB64 })
    .onConflictDoNothing();

  // Re-read in case a concurrent request created it first.
  const row = await db.query.syncSettings.findFirst({
    where: eq(syncSettings.userId, userId),
  });
  return row?.passphraseSalt ?? saltB64;
}
