import 'server-only';
import { createHash, randomInt } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/index';
import { users, emailVerifications } from '@/lib/db/schema';
import { sendEmail, isEmailConfigured } from '@/lib/email/send';
import { verificationCodeEmail } from '@/lib/email/templates';

const CODE_TTL_MS = 15 * 60 * 1000; // 15 minutes

function hashCode(code: string): string {
  return createHash('sha256').update(code).digest('hex');
}

// 6-digit numeric code, zero-padded. randomInt is a CSPRNG.
function generateCode(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, '0');
}

// Create (or replace) the pending code for a user and email it.
export async function generateAndSendVerification(
  userId: string,
  email: string,
): Promise<{ ok: boolean; error?: string }> {
  const code = generateCode();
  const expiresAt = new Date(Date.now() + CODE_TTL_MS);

  await db
    .insert(emailVerifications)
    .values({ userId, codeHash: hashCode(code), expiresAt })
    .onConflictDoUpdate({
      target: emailVerifications.userId,
      set: { codeHash: hashCode(code), expiresAt, createdAt: new Date() },
    });

  const { subject, html, text } = verificationCodeEmail(code);
  const res = await sendEmail({ to: email, subject, html, text });
  if (!res.ok) return { ok: false, error: res.error };
  return { ok: true };
}

// Validate a submitted code. On success, mark the user verified and clear the
// pending row. Returns a generic error otherwise (no oracle on which part failed).
export async function verifyEmailCode(
  userId: string,
  code: string,
): Promise<{ ok: boolean; error?: string }> {
  const row = await db.query.emailVerifications.findFirst({
    where: eq(emailVerifications.userId, userId),
  });

  if (!row || row.expiresAt.getTime() < Date.now()) {
    return { ok: false, error: 'That code is invalid or has expired.' };
  }
  if (hashCode(code) !== row.codeHash) {
    return { ok: false, error: 'That code is invalid or has expired.' };
  }

  await db.update(users).set({ emailVerifiedAt: new Date() }).where(eq(users.id, userId));
  await db.delete(emailVerifications).where(eq(emailVerifications.userId, userId));
  return { ok: true };
}

// Whether the user must verify before using the app. When email is not
// configured, verification is disabled entirely so the app keeps working.
export async function isUserVerified(userId: string): Promise<boolean> {
  if (!isEmailConfigured()) return true;
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { emailVerifiedAt: true },
  });
  return !!user?.emailVerifiedAt;
}
