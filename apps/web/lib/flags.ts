import { validateRequest } from '@/lib/auth/session';
import { db } from '@/lib/db/index';
import { profiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export function isPaidFeaturesEnabled(): boolean {
  return process.env.NEXT_PUBLIC_PAYMENTS_ENABLED === 'true';
}

// Server-only. Returns true if payments are off (beta) or user has pro/team/agency plan.
export async function isProUser(): Promise<boolean> {
  if (!isPaidFeaturesEnabled()) return true;

  const { user } = await validateRequest();
  if (!user) return false;

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, user.id),
  });

  return (
    profile?.plan === 'pro' ||
    profile?.plan === 'team' ||
    profile?.plan === 'agency'
  );
}
