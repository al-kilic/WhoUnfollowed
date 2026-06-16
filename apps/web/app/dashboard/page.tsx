import { validateRequest } from '@/lib/auth/session';
import { isProUser } from '@/lib/flags';
import { DashboardClient } from './DashboardClient';

export default async function DashboardPage() {
  const { user } = await validateRequest();
  const isPro = await isProUser();
  return <DashboardClient account={{ userEmail: user?.email ?? null, isPro }} />;
}
