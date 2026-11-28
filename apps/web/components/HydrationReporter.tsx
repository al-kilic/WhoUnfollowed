'use client';

import { hydrationCode, reportHydrationError } from '@/lib/hydrationReport';

// Listens from the moment this chunk loads, which is before React hydrates,
// so a hydration failure on any page is counted (see lib/hydrationReport.ts).
// React reports it through window.reportError, which fires an 'error' event.
if (typeof window !== 'undefined') {
  window.addEventListener('error', (e) => {
    const code = hydrationCode(String(e.message ?? e.error?.message ?? ''));
    if (code) reportHydrationError(code, window.location.pathname);
  });
}

export function HydrationReporter() {
  return null;
}
