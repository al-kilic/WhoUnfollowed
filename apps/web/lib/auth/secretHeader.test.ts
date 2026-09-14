import { describe, it, expect } from 'vitest';
import { isAuthorizedBySecretHeader } from './secretHeader';

function makeRequest(headerValue: string | null): Request {
  const headers = new Headers();
  if (headerValue !== null) headers.set('x-cron-secret', headerValue);
  return new Request('http://localhost/x', { headers });
}

describe('isAuthorizedBySecretHeader', () => {
  it('accepts a matching secret', () => {
    expect(isAuthorizedBySecretHeader(makeRequest('correct-secret'), 'x-cron-secret', 'correct-secret')).toBe(true);
  });

  it('rejects a wrong secret of the same length', () => {
    expect(isAuthorizedBySecretHeader(makeRequest('wrong-secret1'), 'x-cron-secret', 'correct-secret')).toBe(false);
  });

  it('rejects a wrong secret of a different length', () => {
    expect(isAuthorizedBySecretHeader(makeRequest('short'), 'x-cron-secret', 'correct-secret')).toBe(false);
  });

  it('rejects a missing header', () => {
    expect(isAuthorizedBySecretHeader(makeRequest(null), 'x-cron-secret', 'correct-secret')).toBe(false);
  });

  it('rejects when the env var is not set', () => {
    expect(isAuthorizedBySecretHeader(makeRequest('anything'), 'x-cron-secret', undefined)).toBe(false);
  });

  it('rejects an empty env var (never treats "no secret configured" as "any secret accepted")', () => {
    expect(isAuthorizedBySecretHeader(makeRequest(''), 'x-cron-secret', '')).toBe(false);
  });
});
