'use client';

// Sends the browser to Stripe's billing portal (cancel, change card). Returns
// false if it could not open, so the caller can show its own error.
export async function openBillingPortal(locale: string): Promise<boolean> {
  const r = await fetch('/api/stripe/portal', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ locale }) }).catch(() => null);
  const j = r?.ok ? ((await r.json()) as { url?: string }) : null;
  if (!j?.url) return false;
  window.location.href = j.url;
  return true;
}

// Back from the billing portal (?billing=returned): re-read the subscription
// from Stripe, then refresh the page so a cancel or resume shows at once.
export async function syncAfterPortal(refresh: () => void): Promise<void> {
  let back = false;
  try { back = new URLSearchParams(window.location.search).get('billing') === 'returned'; } catch { /* no URL */ }
  if (!back) return;
  try {
    const url = new URL(window.location.href);
    url.searchParams.delete('billing');
    window.history.replaceState(null, '', url.toString());
  } catch { /* keep the flag */ }
  await fetch('/api/stripe/sync', { method: 'POST' }).catch(() => null);
  refresh();
}
