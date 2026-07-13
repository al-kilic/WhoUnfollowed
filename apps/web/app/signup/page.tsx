import { redirect } from 'next/navigation';
import { validateRequest } from '@/lib/auth/session';
import { SignupForm } from './SignupForm';

export default async function SignupPage() {
  // Already logged in? Skip the signup form.
  const { user } = await validateRequest();
  if (user) {
    redirect('/history');
  }

  return <SignupForm />;
}
