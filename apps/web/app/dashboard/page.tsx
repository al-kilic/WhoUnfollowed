import { redirect } from 'next/navigation';
import { validateRequest } from '@/lib/auth/session';
import { isProUser } from '@/lib/flags';
import { isUserVerified } from '@/lib/auth/verification';
import type { Metadata } from 'next';
import { DashboardClient } from './DashboardClient';

// Private, per-user surface. robots.ts already disallows it, but the meta tag
// also covers crawlers that fetch the page directly and ignore robots.txt.
export const metadata: Metadata = {
  title: 'Radar',
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const { user } = await validateRequest();
  if (user && !(await isUserVerified(user.id))) redirect('/verify-email');
  const isPro = await isProUser();
  return <DashboardClient account={{ userId: user?.id ?? null, userEmail: user?.email ?? null, isPro }} />;
}
