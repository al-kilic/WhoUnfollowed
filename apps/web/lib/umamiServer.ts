// Server-side counterpart to lib/analytics.ts. The client-side `track()` only
// fires if the visitor's browser actually loads and runs script.js (ad
// blockers, closed tabs, and slow connections all silently drop it), which is
// too unreliable for a purchase-confirmation event we actually care about
// counting correctly. This posts straight to Umami's collection endpoint from
// the server instead, so it fires exactly once per completed purchase
// regardless of what happens in the customer's browser afterwards.

const UMAMI_HOST = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_UMAMI_SRC ?? 'https://analytics.whounfollowed.co/script.js').origin;
  } catch {
    return 'https://analytics.whounfollowed.co';
  }
})();
const UMAMI_WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID ?? '380314e5-fc79-480f-9483-d5ddded7ad59';

export async function trackServerEvent(name: string, url: string): Promise<void> {
  if (!UMAMI_WEBSITE_ID) return;
  try {
    await fetch(`${UMAMI_HOST}/api/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Umami's bot filter drops requests with no recognizable browser
        // User-Agent (server-to-server calls get silently discarded as a
        // "beep boop" no-op without this), so a real one is required here.
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
      },
      body: JSON.stringify({
        type: 'event',
        payload: {
          website: UMAMI_WEBSITE_ID,
          hostname: 'whounfollowed.co',
          url,
          name,
        },
      }),
    });
  } catch {
    // Analytics must never break the purchase flow.
  }
}
