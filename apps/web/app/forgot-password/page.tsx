import { redirect } from 'next/navigation';
import { validateRequest } from '@/lib/auth/session';
import { ForgotPasswordForm } from './ForgotPasswordForm';

export const metadata = {
  title: 'Reset your password',
  robots: { index: false, follow: false },
};

export default async function ForgotPasswordPage() {
  const { user } = await validateRequest();
  if (user) redirect('/account');
  return <ForgotPasswordForm />;
}
