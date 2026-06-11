import { validateRequest } from '@/lib/auth/session';
import { isProUser } from '@/lib/flags';
import { HistoryClient } from './HistoryClient';

export default async function HistoryPage() {
  const { user } = await validateRequest();
  const isPro = await isProUser();

  return (
    <HistoryClient
      userEmail={user?.email ?? null}
      isPro={isPro}
    />
  );
}
