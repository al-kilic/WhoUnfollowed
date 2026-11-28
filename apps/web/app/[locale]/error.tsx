'use client';

import { usePathname } from 'next/navigation';
import { ErrorView, localeFromPath } from '@/components/site/ErrorView';

// Error boundary for every localized page: a calm message, a retry and a way home.
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const pathname = usePathname();
  return <ErrorView locale={localeFromPath(pathname)} digest={error.digest} onRetry={reset} />;
}
