import { redirect } from 'next/navigation';
import { validateRequest } from '@/lib/auth/session';
import { LoginForm } from './LoginForm';

export default async function LoginPage() {
  // Already logged in? Don't show the login form again — send them to history.
  const { user } = await validateRequest();
  if (user) {
    redirect('/history');
  }

  return <LoginForm />;
}
