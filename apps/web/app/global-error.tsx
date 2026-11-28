'use client';

import { ErrorView, localeFromPath } from '@/components/site/ErrorView';

// Last-resort boundary: replaces the root layout when it crashes, so it brings
// its own <html> and <body> and reads the language from the URL (no providers).
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const locale = localeFromPath(typeof window === 'undefined' ? '/' : window.location.pathname);
  return (
    <html lang={locale}>
      <body style={{ margin: 0 }}>
        <ErrorView locale={locale} digest={error.digest} onRetry={reset} />
      </body>
    </html>
  );
}
