// Bump this whenever the marketing-opt-in checkbox copy on /pricing changes
// meaningfully, so a stored consent can always be matched back to the exact
// text the buyer agreed to at the time.
export const MARKETING_CONSENT_VERSION = 'lifetime-2026-09';

// Version tag for the standalone email-capture consent (mobile waitlist, CSV
// prompt). Bump when the wording next to those inputs changes meaningfully.
export const SUBSCRIBER_CONSENT_VERSION = 'email-capture-2026-09';
