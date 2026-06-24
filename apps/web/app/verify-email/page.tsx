import { redirect } from 'next/navigation';
import { validateRequest } from '@/lib/auth/session';
import { isUserVerified } from '@/lib/auth/verification';
import { VerifyEmailForm } from './VerifyEmailForm';

export const metadata = { title: 'Verify your email' };

export default async function VerifyEmailPage() {
  const { user } = await validateRequest();
  if (!user) redirect('/login');
  if (await isUserVerified(user.id)) redirect('/history');

  return <VerifyEmailForm email={user.email} />;
}
