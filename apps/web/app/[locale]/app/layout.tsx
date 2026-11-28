import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { routing, type AppLocale } from '@/i18n/routing';
import { redirect } from '@/i18n/navigation';
import { AuthProvider } from '@/components/AuthProvider';
import { getAuthState } from '@/lib/auth/getAuthState';
import { isUserVerified } from '@/lib/auth/verification';
import { StudioProvider } from '@/components/studio/StudioContext';
import { StudioShell } from '@/components/studio/StudioShell';
import { getStudioContent } from '@/components/studio/studio.content';
import { StudioFrame } from '@/components/studio/StudioFrame';

// Studio (/app): the dashboard. Open without an account so anyone can see their
// own export in it; paid parts are locked in the UI, and the real gate for AI
// is on the server (/api/ai/*).
export const dynamic = 'force-dynamic';

interface LayoutProps { children: ReactNode; params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return { title: getStudioContent(locale).name, robots: { index: false, follow: false } };
}

export default async function StudioLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const auth = await getAuthState();
  if (auth.userId && !(await isUserVerified(auth.userId))) redirect({ href: '/verify-email', locale });
  return (
    <AuthProvider value={auth}>
      <StudioFrame>
        <StudioProvider locale={locale as AppLocale}>
          <StudioShell>{children}</StudioShell>
        </StudioProvider>
      </StudioFrame>
    </AuthProvider>
  );
}
