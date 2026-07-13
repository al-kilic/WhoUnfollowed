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

// Centralised event names so the Umami dashboard stays consistent and the funnel
// is easy to read. Conversion funnel: upload -> results -> locked-view -> upgrade
// -> checkout -> subscribe.
export const Events = {
  zipUpload: 'zip-upload',
  resultsView: 'results-view',
  radarView: 'radar-view',
  historyView: 'history-view',
  lockedView: 'locked-view',          // { feature }
  upgradeClick: 'upgrade-click',      // { source }
  checkoutStart: 'checkout-start',    // { billing }
  manageBilling: 'manage-billing',
  subscribeComplete: 'subscribe-complete',
  csvExport: 'csv-export',            // { mode: pro | free | capture | limit }
  emailCaptured: 'email-captured',    // { context }
  snapshotLimitHit: 'snapshot-limit-hit',
  heroCtaClicked: 'hero-cta-clicked',       // { path: 'have_zip' | 'get_export' }
  exportGuideOpened: 'export-guide-opened', // { entry: 'hero' | 'upload_error' }
  uploadStarted: 'upload-started',
  analysisCompleted: 'analysis-completed',  // { analysis_type: 'non_followers' | 'comparison' }
  analysisFailed: 'analysis-failed',        // { error_type: allowlisted fixed value only }
} as const;

// The most important conversion signal: which surface drove an upgrade intent.
export function trackUpgradeClick(source: string): void {
  track(Events.upgradeClick, { source });
}

// A free user actually saw a gated/teaser surface (denominator for conversion).
export function trackLockedView(feature: string): void {
  track(Events.lockedView, { feature });
}
