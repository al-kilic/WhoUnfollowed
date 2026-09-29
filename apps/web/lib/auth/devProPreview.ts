import type { Session, User } from 'lucia';

// LOCAL-ONLY Pro preview for looking at Pro screens without a database.
// Active only under `next dev` (NODE_ENV=development; `next build`/`start`
// always run as production) AND when DEV_PRO_PREVIEW=1 is set, e.g. in the
// gitignored apps/web/.env.development.local. Every visitor to that local
// dev server is treated as one logged-in Pro user; nothing is stored.
export function isDevProPreview(): boolean {
  return process.env.NODE_ENV === 'development' && process.env.DEV_PRO_PREVIEW === '1';
}

// Stub profile so /account renders without a database. DEV_LIFETIME_PREVIEW=1
// makes it an Insider with marketing opt-in on.
export function devPreviewProfile() {
  const lifetime = process.env.DEV_LIFETIME_PREVIEW === '1';
  return {
    userId: 'dev-pro-preview',
    subscriptionStatus: 'active' as const,
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    gracePeriodEndsAt: null,
    subscriptionExpiresAt: lifetime ? null : new Date(Date.now() + 30 * 86_400_000),
    locale: 'en',
    expiryReminderSentAt: null,
    expiredEmailSentAt: null,
    lifetimePurchasedAt: lifetime ? new Date() : null,
    marketingOptIn: lifetime,
    marketingOptInAt: lifetime ? new Date() : null,
    marketingOptOutAt: null,
    marketingConsentVersion: lifetime ? 'dev-preview' : null,
    createdAt: new Date(),
  };
}

export const DEV_PREVIEW_USER: User = { id: 'dev-pro-preview', email: 'pro-preview@localhost' };

export function devPreviewSession(): { user: User; session: Session } {
  return {
    user: DEV_PREVIEW_USER,
    session: {
      id: 'dev-pro-preview-session',
      userId: DEV_PREVIEW_USER.id,
      expiresAt: new Date(Date.now() + 86_400_000),
      fresh: false,
    },
  };
}
