// Canonical list of app/[locale] pathnames that actually exist in all three
// locales today. Grows as more routes migrate under [locale]. Used to:
//  - decide whether the nav's language switcher has somewhere to send the
//    visitor (showing it on an unmigrated page would link to a 404), and
//  - gate which internal links can safely use the i18n-aware Link instead of
//    plain next/link (see i18n/navigation.ts).
export const LOCALIZED_PATHS: string[] = ['/pricing'];
