// The policy itself lives in csp-policy.mjs so next.config.js can load it.
export { CSP_DIRECTIVES, buildCsp } from './csp-policy.mjs';

// Keeps only what a report needs to be useful: the directive and the blocked
// origin (scheme + host), never a full URL, path or query string.
export function summarizeCspReport(body: unknown): { directive: string; blocked: string; page: string } | null {
  if (!body || typeof body !== 'object') return null;
  const raw = Array.isArray(body) ? body[0] : body;
  if (!raw || typeof raw !== 'object') return null;
  const r = ('csp-report' in raw ? (raw as Record<string, unknown>)['csp-report']
    : 'body' in raw ? (raw as Record<string, unknown>).body : raw) as Record<string, unknown> | undefined;
  if (!r || typeof r !== 'object') return null;
  const str = (...keys: string[]) => {
    for (const k of keys) { const v = r[k]; if (typeof v === 'string' && v) return v; }
    return '';
  };
  const directive = str('effective-directive', 'effectiveDirective', 'violated-directive', 'violatedDirective').split(' ')[0] ?? '';
  const origin = (u: string) => {
    if (!u || !u.includes(':')) return u.slice(0, 40); // 'inline', 'eval', ...
    try { return new URL(u).origin; } catch { return u.split(':')[0] ?? ''; }
  };
  const pagePath = (u: string) => { try { return new URL(u).pathname; } catch { return ''; } };
  if (!directive) return null;
  return {
    directive: directive.slice(0, 40),
    blocked: origin(str('blocked-uri', 'blockedURL')).slice(0, 100),
    page: pagePath(str('document-uri', 'documentURL')).slice(0, 80),
  };
}
