import { redirect } from 'next/navigation';
import { validateRequest } from '@/lib/auth/session';
import type { Metadata } from 'next';
import { LoginForm } from './LoginForm';

// Auth surface: nothing here belongs in a search index.
export const metadata: Metadata = {
  title: 'Log in',
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  // Already logged in? Don't show the login form again — send them to history.
  const { user } = await validateRequest();
  if (user) {
    redirect('/history');
  }

  return <LoginForm />;
}
