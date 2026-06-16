import { validateRequest } from '@/lib/auth/session';
import { isProUser } from '@/lib/flags';
import { NavBarClient } from './NavBarClient';

export async function NavBar() {
  const { user } = await validateRequest();
  const isPro = await isProUser();
  return <NavBarClient userEmail={user?.email ?? null} isPro={isPro} />;
}
