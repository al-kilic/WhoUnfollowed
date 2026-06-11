import { redirect } from 'next/navigation';
import { validateRequest, invalidateSession } from '@/lib/auth/session';

export async function POST() {
  const { session } = await validateRequest();

  if (session) {
    await invalidateSession(session.id);
  }

  redirect('/');
}
