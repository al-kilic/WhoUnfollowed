import { Events, track } from '@/lib/analytics';

// React's hydration error codes (production builds only print the number):
// 418 HTML/text mismatch, 419-425 the other "server HTML didn't match" cases.
const HYDRATION = /Minified React error #(41[89]|42[0-5])\b/;

// The error code if this message is a hydration failure, else null.
export function hydrationCode(message: string): string | null {
  return HYDRATION.exec(message)?.[1] ?? null;
}

// Report one hydration failure per page load to our own Umami: the path
// (no query string) and the error code, nothing about the visitor. Umami may
// not have loaded yet when hydration fails, so retry for a few seconds.
let sent = false;
export function reportHydrationError(code: string, path: string, tries = 20): void {
  if (sent) return;
  if (typeof window === 'undefined') return;
  if (!window.umami) {
    if (tries > 0) window.setTimeout(() => reportHydrationError(code, path, tries - 1), 500);
    return;
  }
  sent = true;
  track(Events.hydrationError, { path, code });
}

export function resetHydrationReportForTests(): void { sent = false; }
