import { redirect } from 'next/navigation';
import { isPaidFeaturesEnabled } from '@/lib/flags';
import { validateRequest } from '@/lib/auth/session';
import { SignupForm } from './SignupForm';

export default async function SignupPage() {
  if (isPaidFeaturesEnabled()) {
    redirect('/pricing');
  }

  // Already logged in? Skip the signup form.
  const { user } = await validateRequest();
  if (user) {
    redirect('/history');
  }

  return <SignupForm />;
}
