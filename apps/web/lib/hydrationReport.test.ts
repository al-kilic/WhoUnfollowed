// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { hydrationCode, reportHydrationError, resetHydrationReportForTests } from './hydrationReport';

describe('hydrationCode', () => {
  it('reads React hydration error codes', () => {
    expect(hydrationCode('Minified React error #418; visit https://react.dev/errors/418?args[]=HTML')).toBe('418');
    expect(hydrationCode('Minified React error #423; visit ...')).toBe('423');
  });
  it('ignores other errors', () => {
    expect(hydrationCode('Minified React error #185; visit ...')).toBeNull();
    expect(hydrationCode('TypeError: x is undefined')).toBeNull();
    expect(hydrationCode('Minified React error #4180')).toBeNull();
  });
});

describe('reportHydrationError', () => {
  const trackFn = vi.fn();
  beforeEach(() => { vi.useFakeTimers(); resetHydrationReportForTests(); trackFn.mockReset(); });
  afterEach(() => { vi.useRealTimers(); delete (window as { umami?: unknown }).umami; });

  it('sends one event with only the path and the code', () => {
    window.umami = { track: trackFn } as unknown as NonNullable<typeof window.umami>;
    reportHydrationError('418', '/es');
    reportHydrationError('418', '/es');
    expect(trackFn).toHaveBeenCalledTimes(1);
    expect(trackFn).toHaveBeenCalledWith('hydration-error', { path: '/es', code: '418' });
  });

  it('waits for Umami to load', () => {
    reportHydrationError('418', '/pt');
    expect(trackFn).not.toHaveBeenCalled();
    window.umami = { track: trackFn } as unknown as NonNullable<typeof window.umami>;
    vi.advanceTimersByTime(600);
    expect(trackFn).toHaveBeenCalledWith('hydration-error', { path: '/pt', code: '418' });
  });

  it('gives up quietly when Umami never loads', () => {
    reportHydrationError('418', '/');
    vi.advanceTimersByTime(15_000);
    expect(trackFn).not.toHaveBeenCalled();
  });
});
