'use server';

import { hash, verify } from '@node-rs/argon2';
import { and, eq } from 'drizzle-orm';
import { db } from '@/lib/db/index';
import { users, cloudSnapshots } from '@/lib/db/schema';
import { validateRequest } from '@/lib/auth/session';

const ARGON2_OPTIONS = { memoryCost: 19456, timeCost: 2, parallelism: 1 };

// Change the password for the logged-in user. The cloud-sync key is derived from
// the password, so the client re-encrypts every cloud snapshot under the new key
// (same salt) and passes the new blobs here; we swap them in the same transaction
// as the password change so the two never drift apart.
export async function changePassword(input: {
  currentPassword: string;
  newPassword: string;
  reEncrypted: { id: string; ciphertextB64: string; ivB64: string }[];
}): Promise<{ ok: boolean; error?: string }> {
  const { user } = await validateRequest();
  if (!user) return { ok: false, error: 'Not authenticated.' };

  if (!input.newPassword || input.newPassword.length < 8) {
    return { ok: false, error: 'New password must be at least 8 characters.' };
  }

  const row = await db.query.users.findFirst({
    where: eq(users.id, user.id),
    columns: { passwordHash: true },
  });
  if (!row) return { ok: false, error: 'Account not found.' };

  const valid = await verify(row.passwordHash, input.currentPassword, ARGON2_OPTIONS);
  if (!valid) return { ok: false, error: 'Your current password is incorrect.' };

  const newHash = await hash(input.newPassword, ARGON2_OPTIONS);

  await db.transaction(async (tx) => {
    await tx.update(users).set({ passwordHash: newHash }).where(eq(users.id, user.id));

    for (const s of input.reEncrypted) {
      await tx
        .update(cloudSnapshots)
        .set({
          encryptedBlob: Buffer.from(s.ciphertextB64, 'base64'),
          iv: Buffer.from(s.ivB64, 'base64'),
        })
        .where(and(eq(cloudSnapshots.id, s.id), eq(cloudSnapshots.userId, user.id)));
    }
  });

  return { ok: true };
}
