import 'server-only';
import { createHash, randomBytes } from 'node:crypto';
import { hash } from '@node-rs/argon2';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/index';
import { users, passwordResets, syncSettings, cloudSnapshots } from '@/lib/db/schema';
import { lucia } from '@/lib/auth/lucia';
import { sendEmail } from '@/lib/email/send';
import { passwordResetEmail } from '@/lib/email/templates';

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://whounfollowed.co';

// Keep argon2 params in sync with signup/login actions.
const ARGON2_OPTIONS = { memoryCost: 19456, timeCost: 2, parallelism: 1 };

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

// Always behaves the same whether or not the email exists, so the endpoint does
// not leak which addresses have accounts. Emails the reset link when it does.
export async function requestPasswordReset(email: string): Promise<void> {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
    columns: { id: true },
  });
  if (!user) return;

  const token = randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);

  await db
    .insert(passwordResets)
    .values({ userId: user.id, tokenHash: hashToken(token), expiresAt })
    .onConflictDoUpdate({
      target: passwordResets.userId,
      set: { tokenHash: hashToken(token), expiresAt, createdAt: new Date() },
    });

  const resetUrl = `${APP_URL}/reset-password?token=${token}`;
  const { subject, html, text } = passwordResetEmail(resetUrl);
  await sendEmail({ to: email, subject, html, text });
}

// Consume a reset token and set the new password. Because the cloud-sync key is
// derived from the password, the old encryption key is now unrecoverable, so we
// rotate the sync salt and drop the (now-undecryptable) cloud snapshots. All
// sessions are invalidated so the old password's sessions cannot continue.
export async function resetPassword(
  token: string,
  newPassword: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!token) return { ok: false, error: 'Invalid or expired reset link.' };
  if (newPassword.length < 8) return { ok: false, error: 'Password must be at least 8 characters.' };

  const row = await db.query.passwordResets.findFirst({
    where: eq(passwordResets.tokenHash, hashToken(token)),
  });
  if (!row || row.expiresAt.getTime() < Date.now()) {
    return { ok: false, error: 'This reset link is invalid or has expired. Request a new one.' };
  }

  const userId = row.userId;
  const passwordHash = await hash(newPassword, ARGON2_OPTIONS);
  const newSalt = randomBytes(16).toString('base64');

  await db.transaction(async (tx) => {
    // A valid reset link also proves email ownership.
    await tx
      .update(users)
      .set({ passwordHash, emailVerifiedAt: new Date() })
      .where(eq(users.id, userId));

    // Old cloud snapshots are encrypted under the old password's key and can no
    // longer be decrypted; remove them and rotate the salt for future syncs.
    await tx.delete(cloudSnapshots).where(eq(cloudSnapshots.userId, userId));
    await tx
      .insert(syncSettings)
      .values({ userId, passphraseSalt: newSalt })
      .onConflictDoUpdate({
        target: syncSettings.userId,
        set: { passphraseSalt: newSalt, passphraseSetAt: new Date() },
      });

    await tx.delete(passwordResets).where(eq(passwordResets.userId, userId));
  });

  // Invalidate every existing session for this user.
  await lucia.invalidateUserSessions(userId);

  return { ok: true };
}
