// While sample mode is on, every call to the coach API (/api/ai/*) is
// answered in the browser with the sample account's pre-written content
// (sampleFetch.ts, loaded on first use). Nothing reaches the server: no model
// call, no credits, nothing saved.
//
// The wrapper goes in synchronously when sample mode turns on, before any
// page asks for anything, so a real member's own coach data can't leak into
// the sample either. The member's own settings pages (/app/you) are the one
// exception: they show the real account, so their calls go through (except
// You > Memory, which shows the sample's memory).

type Fetch = typeof window.fetch;
let original: Fetch | null = null;

export function coachApiUrl(input: RequestInfo | URL, origin: string): URL | null {
  try {
    const raw = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    const url = new URL(raw, origin);
    return url.origin === origin && url.pathname.startsWith('/api/ai/') ? url : null;
  } catch { return null; }
}

// You > Memory is the exception to the exception: in sample mode it shows the
// sample account's memory, read-only.
export const onOwnSettings = (path: string) => /\/app\/you(\/|$)/.test(path) && !/\/app\/you\/memory(\/|$)/.test(path);

export function installSampleFetch(): void {
  if (typeof window === 'undefined' || original) return;
  original = window.fetch;
  const real = original.bind(window);
  window.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = coachApiUrl(input, window.location.origin);
    if (!url || onOwnSettings(window.location.pathname)) return real(input, init);
    const method = (init?.method ?? (input instanceof Request ? input.method : 'GET')).toUpperCase();
    const locale = (document.documentElement.lang || 'en').slice(0, 2);
    const { sampleAnswer } = await import('./sampleFetch');
    const body = typeof init?.body === 'string' ? init.body : undefined;
    return sampleAnswer(url, method, locale, new Date(), body);
  }) as Fetch;
}

export function uninstallSampleFetch(): void {
  if (typeof window === 'undefined' || !original) return;
  window.fetch = original;
  original = null;
}
