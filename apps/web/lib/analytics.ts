// Thin wrapper around the self-hosted Umami tracker. Safe to call anywhere on
// the client; no-ops if the script hasn't loaded (e.g. local dev, ad-blockers).
// Umami is cookieless and self-hosted, so this collects no personal data.

import type { SizeBucket, FileExt, ErrorName, CountBucket, YesNo } from '@/lib/uploadDiagnostics';
import type { DeltaReason } from '@ig-tracker/core';

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
  zipUpload: 'zip-upload',          // { platform }
  radarView: 'radar-view',           // { platform, pro, has_previous }
  lockedView: 'locked-view',          // { feature }
  teaserSeen: 'teaser-seen',          // { placement } fired once when an upgrade teaser is actually on screen (locked-view fires on render)
  upgradeClick: 'upgrade-click',      // { source }
  checkoutStart: 'checkout-start',    // { billing: 'unlock-monthly' | 'unlock-yearly' | 'lifetime' }
  subscribeComplete: 'subscribe-complete',
  csvExport: 'csv-export',            // { mode: pro | free | capture | limit }
  emailCaptured: 'email-captured',    // { context }
  snapshotLimitHit: 'snapshot-limit-hit',
  blogCtaClick: 'blog-cta-click',     // { slug } — the post's main "upload your export" CTA, not an upgrade click
  // V2 return loop and offers.
  offerView: 'offer-view',            // { placement }
  reminderOptin: 'reminder-optin',    // { source }
  revealView: 'reveal-view',          // { count_bucket }
  creatorWaitlist: 'creator-waitlist', // { placement }
  keepExportClick: 'keep-export-click', // { placement } signed-out "keep this export" card -> signup
  // Tools. Props are fixed literals or counts only, never usernames.
  verdictShare: 'verdict-share',      // { action: share | save | another, archetype, placement }
  planStarted: 'plan-started',        // { pace, size_bucket }
  planBatchDone: 'plan-batch-done',   // { day }
  healthOpened: 'health-opened',      // { check }
  starToggled: 'star-toggled',        // { on }
  wrapShown: 'wrap-shown',            // { trigger: auto | chip | email }
  wrapCompleted: 'wrap-completed',    // { screens }
  wrapShare: 'wrap-share',            // { action: share | save }
  wrapProTap: 'wrap-pro-tap',         // { what: follows | left, pro }
} as const;

// Coarse size for list lengths, so counts never identify anyone.
export function sizeBucketOf(n: number): string {
  if (n === 0) return '0';
  if (n <= 50) return '1-50';
  if (n <= 200) return '51-200';
  if (n <= 1000) return '201-1000';
  return 'gt1000';
}

// The most important conversion signal: which surface drove an upgrade intent.
export function trackUpgradeClick(source: string): void {
  track(Events.upgradeClick, { source });
}

// A free user actually saw a gated/teaser surface (denominator for conversion).
export function trackLockedView(feature: string): void {
  track(Events.lockedView, { feature });
}

// ─── First-user funnel (typed, allowlisted only) ────────────────────────────
// Homepage -> chosen path -> upload started -> analysis completed. Event names
// and prop values are a closed set on purpose: this map is the only way to
// call trackFunnel, so an arbitrary string can never reach Umami here. Never
// pass anything user-provided (usernames, filenames, raw error messages) as a
// prop value — only these fixed literals.
type PlatformTag = 'instagram' | 'threads' | 'tiktok';

type FunnelEventMap = {
  'Hero CTA Clicked': { path: 'have_zip' | 'get_export' };
  'Export Guide Opened': { entry: 'hero' | 'upload_error' };
  'Upload Started': { size: SizeBucket };
  'Analysis Completed': { analysis_type: 'non_followers' | 'comparison'; platform: PlatformTag };
  'Analysis Failed': {
    error_type: 'html_export' | 'missing_data' | 'invalid_zip' | 'unsupported_format' | 'unzipped_file' | 'file_read' | 'schema_changed' | 'unknown';
    // Which app the file was for, when the error tells us; otherwise 'unknown'.
    platform?: PlatformTag | 'unknown';
    // Diagnostics, all closed sets (see lib/uploadDiagnostics.ts).
    size?: SizeBucket;
    file_ext?: FileExt;
    error_name?: ErrorName;
    schema_reason?: 'not_json' | 'shape_mismatch';
    zip_files?: CountBucket;
    has_connections?: YesNo;
    has_media?: YesNo;
    has_threads?: YesNo;
    has_html?: YesNo;
    has_tiktok?: YesNo;
    missing_list?: 'followers' | 'following' | 'both';
    odd_follower_file?: YesNo;
    odd_following_file?: YesNo;
  };
  'Large File Warning': { size: SizeBucket; device: 'mobile' | 'desktop' };
  'Large File Choice': { choice: 'continue' | 'smaller_export' | 'cancel' };
  'Export Warning Shown': { reason: DeltaReason | 'multiple' };
  'Export Warning Choice': { choice: 're_export' | 'new_account' | 'proceed_anyway' };
  'Snapshot Saved': { storage: 'local' | 'cloud' };
  'Upgrade CTA Clicked': { placement: 'results' | 'pricing' | 'reveal' | 'diff' | 'home' };
};

export function trackFunnel<E extends keyof FunnelEventMap>(
  event: E,
  ...args: FunnelEventMap[E] extends undefined ? [] : [FunnelEventMap[E]]
): void {
  track(event, args[0] as Record<string, unknown> | undefined);
}
