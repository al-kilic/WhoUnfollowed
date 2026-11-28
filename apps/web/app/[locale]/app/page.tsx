import { redirect } from '@/i18n/navigation';
import type { AppLocale } from '@/i18n/routing';

// Studio home is Today.
export default async function StudioHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  redirect({ href: '/app/today', locale: locale as AppLocale });
}
