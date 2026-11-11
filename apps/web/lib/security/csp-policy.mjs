// Content Security Policy, shipped in REPORT-ONLY mode first (roadmap 8.3).
// The browser blocks nothing yet; it reports what it would have blocked to
// /api/csp-report. Once a week of reports shows no false alarms, switch the
// header name to Content-Security-Policy to enforce it.
//
// The part that matters most for us is connect-src: even if a script got
// injected, it could not send follower lists anywhere but our own servers.
// script-src still allows inline scripts (Next.js and our layout use them);
// tightening that needs nonces and is a later step.
const ANALYTICS = 'https://analytics.whounfollowed.co';

/** @type {Record<string, string[]>} */
export const CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", ANALYTICS],
  'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://api.fontshare.com'],
  'font-src': ["'self'", 'data:', 'https://fonts.gstatic.com', 'https://api.fontshare.com', 'https://cdn.fontshare.com'],
  'img-src': ["'self'", 'data:', 'blob:'],
  'media-src': ["'self'", 'blob:'],
  'connect-src': ["'self'", ANALYTICS],
  'worker-src': ["'self'", 'blob:'],
  'frame-src': ["'none'"],
  'frame-ancestors': ["'none'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'", 'https://checkout.stripe.com'],
  'report-uri': ['/api/csp-report'],
};

/** @param {Record<string, string[]>} [directives] @returns {string} */
export function buildCsp(directives = CSP_DIRECTIVES) {
  return Object.entries(directives).map(([k, v]) => `${k} ${v.join(' ')}`).join('; ');
}

