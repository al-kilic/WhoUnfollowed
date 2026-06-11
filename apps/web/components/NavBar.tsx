import { validateRequest } from '@/lib/auth/session';
import { NavBarClient } from './NavBarClient';

export async function NavBar() {
  const { user } = await validateRequest();
  return <NavBarClient userEmail={user?.email ?? null} />;
}
