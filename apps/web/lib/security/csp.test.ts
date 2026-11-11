import { describe, expect, it } from 'vitest';
import { buildCsp, summarizeCspReport } from './csp';

describe('buildCsp', () => {
  it('only lets the page talk to our own servers', () => {
    const csp = buildCsp();
    expect(csp).toContain("connect-src 'self' https://analytics.whounfollowed.co;");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain('report-uri /api/csp-report');
  });
});

describe('summarizeCspReport', () => {
  it('reads the classic report format and drops paths and queries', () => {
    expect(summarizeCspReport({ 'csp-report': {
      'document-uri': 'https://whounfollowed.co/results?x=1',
      'effective-directive': 'connect-src',
      'blocked-uri': 'https://evil.example/steal?list=abc',
    } })).toEqual({ directive: 'connect-src', blocked: 'https://evil.example', page: '/results' });
  });
  it('reads the Reporting API format', () => {
    expect(summarizeCspReport([{ type: 'csp-violation', body: {
      documentURL: 'https://whounfollowed.co/', effectiveDirective: 'script-src-elem', blockedURL: 'inline',
    } }])).toEqual({ directive: 'script-src-elem', blocked: 'inline', page: '/' });
  });
  it('ignores junk', () => {
    expect(summarizeCspReport(null)).toBeNull();
    expect(summarizeCspReport({ foo: 1 })).toBeNull();
    expect(summarizeCspReport('x')).toBeNull();
  });
});
