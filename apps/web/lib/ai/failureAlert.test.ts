import { describe, expect, it, vi } from 'vitest';
import { createFailureAlerter } from './failureAlert';

const MIN = 60_000;

describe('createFailureAlerter', () => {
  it('alerts on the first failure, then at most once per quiet period with a count', () => {
    const send = vi.fn();
    const a = createFailureAlerter({ quietMs: 30 * MIN, send });
    a.failed('chat', 'provider 502', 0);
    expect(send).toHaveBeenCalledTimes(1);
    expect(send.mock.calls[0]![0]).toContain('1 failed request just now');
    a.failed('chat', 'provider 502', 5 * MIN);
    a.failed('draft', 'timeout', 10 * MIN);
    expect(send).toHaveBeenCalledTimes(1);
    a.failed('chat', 'provider 502', 31 * MIN);
    expect(send).toHaveBeenCalledTimes(2);
    expect(send.mock.calls[1]![0]).toContain('3 failed requests in the last 31 min');
  });

  it('says when the coach answers again, and stays quiet when nothing failed', () => {
    const send = vi.fn();
    const a = createFailureAlerter({ quietMs: 30 * MIN, send });
    a.succeeded(0);
    expect(send).not.toHaveBeenCalled();
    a.failed('chat', 'provider 500', MIN);
    a.failed('chat', 'provider 500', 2 * MIN);
    a.succeeded(3 * MIN);
    expect(send).toHaveBeenCalledTimes(2);
    expect(send.mock.calls[1]![0]).toContain('answering again (1 more failed');
    a.succeeded(4 * MIN);
    expect(send).toHaveBeenCalledTimes(2);
    // A new failing stretch alerts at once again.
    a.failed('chat', 'provider 500', 5 * MIN);
    expect(send).toHaveBeenCalledTimes(3);
  });
});
