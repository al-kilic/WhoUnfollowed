// @vitest-environment node
import { describe, it, expect, vi } from 'vitest';

vi.mock('server-only', () => ({}));
vi.mock('@/lib/telegram', () => ({ sendTelegramMessage: vi.fn().mockResolvedValue({ ok: true }), escapeTelegramHtml: (s: string) => s }));

const { isLimitError, takeEmailTally } = await import('./send');

describe('isLimitError', () => {
  it('spots Resend quota and rate limit errors', () => {
    expect(isLimitError('You have reached your daily email sending quota', 'daily_quota_exceeded')).toBe(true);
    expect(isLimitError('Too many requests', 'rate_limit_exceeded')).toBe(true);
    expect(isLimitError('Invalid `to` field', 'validation_error')).toBe(false);
  });
});

describe('takeEmailTally', () => {
  it('returns the counters and resets them', () => {
    const first = takeEmailTally();
    expect(first).toMatchObject({ sent: 0, failed: 0, limited: 0 });
    expect(takeEmailTally().since).toBeGreaterThanOrEqual(first.since);
  });
});
