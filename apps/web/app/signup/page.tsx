import { redirect } from 'next/navigation';
import { validateRequest } from '@/lib/auth/session';
import type { Metadata } from 'next';
import { SignupForm } from './SignupForm';

// Auth surface: nothing here belongs in a search index.
export const metadata: Metadata = {
  title: 'Sign up',
  robots: { index: false, follow: false },
};

export default async function SignupPage() {
  // Already logged in? Skip the signup form.
  const { user } = await validateRequest();
  if (user) {
    redirect('/history');
  }

  return <SignupForm />;
}
