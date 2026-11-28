import { afterEach, describe, expect, it, vi } from 'vitest';
import { coachApiUrl, installSampleFetch, onOwnSettings, uninstallSampleFetch } from './sampleIntercept';

// Sample mode must never send a coach call to the server: every /api/ai/*
// request is answered in the browser, so nothing costs a model call.
describe('sample intercept', () => {
  const real = vi.fn(async () => new Response('{"real":true}'));
  afterEach(() => { uninstallSampleFetch(); real.mockClear(); window.history.replaceState(null, '', '/'); });

  it('recognises only same-origin coach API calls', () => {
    const o = window.location.origin;
    expect(coachApiUrl('/api/ai/draft', o)?.pathname).toBe('/api/ai/draft');
    expect(coachApiUrl(`${o}/api/ai/state`, o)).not.toBeNull();
    expect(coachApiUrl('/api/stats', o)).toBeNull();
    expect(coachApiUrl('https://example.com/api/ai/draft', o)).toBeNull();
    expect(onOwnSettings('/es/app/you/credits')).toBe(true);
    expect(onOwnSettings('/app/today')).toBe(false);
    // You > Memory shows the sample's memory, so its calls are answered here.
    expect(onOwnSettings('/app/you/memory')).toBe(false);
    expect(onOwnSettings('/pt/app/you/memory')).toBe(false);
    expect(onOwnSettings('/app/you')).toBe(true);
  });

  it('answers every coach route in the browser and never calls the network', async () => {
    window.fetch = real as unknown as typeof window.fetch;
    installSampleFetch();
    window.history.replaceState(null, '', '/app/create');
    for (const [path, method] of [['/api/ai/state', 'GET'], ['/api/ai/draft', 'POST'], ['/api/ai/check', 'POST'], ['/api/ai/plan', 'POST'], ['/api/ai/chat', 'POST'],
      ['/api/ai/read', 'POST'], ['/api/ai/ideas', 'POST'], ['/api/ai/insights', 'POST'], ['/api/ai/content?kind=plan', 'GET'], ['/api/ai/goal', 'GET'], ['/api/ai/memory', 'PUT'], ['/api/ai/anything-new', 'POST']] as const) {
      const res = await fetch(path, { method });
      expect(res.headers.get('content-type')).toContain('application/json');
    }
    expect(real).not.toHaveBeenCalled();
    const draft = await (await fetch('/api/ai/draft', { method: 'POST' })).json() as { ok: boolean; mocked: boolean; data: { options: unknown[] } };
    expect(draft.ok && draft.mocked).toBe(true);
    expect(draft.data.options.length).toBe(3);
    // Signals (what the member did with an answer) are never sent for the sample.
    const sig = await (await fetch('/api/ai/signal', { method: 'POST', body: '{}' })).json() as { ok: boolean; saved: number };
    expect(sig).toEqual({ ok: true, saved: 0 });
    expect(real).not.toHaveBeenCalled();
  });

  it('lets other calls, and the member\'s own settings pages, through', async () => {
    window.fetch = real as unknown as typeof window.fetch;
    installSampleFetch();
    await fetch('/api/stats');
    window.history.replaceState(null, '', '/app/you/credits');
    await fetch('/api/ai/credits');
    expect(real).toHaveBeenCalledTimes(2);
  });

  it('puts the real fetch back when sample mode ends', () => {
    window.fetch = real as unknown as typeof window.fetch;
    installSampleFetch();
    expect(window.fetch).not.toBe(real);
    uninstallSampleFetch();
    expect(window.fetch).toBe(real);
  });
});
