import { redirect } from 'next/navigation';
import { isPaidFeaturesEnabled } from '@/lib/flags';
import { SignupForm } from './SignupForm';

export default function SignupPage() {
  if (isPaidFeaturesEnabled()) {
    redirect('/pricing');
  }

  return <SignupForm />;
}
