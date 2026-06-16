import { redirect } from 'next/navigation';

// Settings has been merged into the unified /account page.
export default function SettingsPage() {
  redirect('/account');
}
