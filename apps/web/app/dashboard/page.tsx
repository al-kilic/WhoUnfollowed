import { redirect } from 'next/navigation';
import { validateRequest } from '@/lib/auth/session';
import { isProUser } from '@/lib/flags';
import { isUserVerified } from '@/lib/auth/verification';
import { DashboardClient } from './DashboardClient';

export default async function DashboardPage() {
  const { user } = await validateRequest();
  if (user && !(await isUserVerified(user.id))) redirect('/verify-email');
  const isPro = await isProUser();
  return <DashboardClient account={{ userId: user?.id ?? null, userEmail: user?.email ?? null, isPro }} />;
}
