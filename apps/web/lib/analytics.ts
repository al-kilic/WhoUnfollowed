// Thin wrapper around the self-hosted Umami tracker. Safe to call anywhere on
// the client; no-ops if the script hasn't loaded (e.g. local dev, ad-blockers).
// Umami is cookieless and self-hosted, so this collects no personal data.

type UmamiTracker = {
  track: (eventName: string, eventData?: Record<string, unknown>) => void;
};

declare global {
  interface Window {
    umami?: UmamiTracker;
  }
}

export function track(eventName: string, eventData?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  try {
    window.umami?.track(eventName, eventData);
  } catch {
    // analytics must never break the app
  }
}
