'use client';

import { useEffect, useState } from 'react';
import { shouldAutoPlayWrap } from '@ig-tracker/core';
import type { Platform } from '@/lib/platform';
import { Events, track } from '@/lib/analytics';

// Which export the last wrap was shown for, per owner and platform, in this
// browser. A convenience only: if storage is blocked the wrap just plays again.
const keyOf = (owner: string | null, platform: Platform) => `wu:wrap-seen:${owner ?? 'anon'}:${platform}`;

function readSeen(key: string): number | null {
  try { const v = window.localStorage.getItem(key); return v ? Number(v) : null; } catch { return null; }
}
function writeSeen(key: string, exportedAt: number) {
  try { window.localStorage.setItem(key, String(exportedAt)); } catch { /* storage blocked */ }
}

// Opens the wrap once per new quarter of exports, or when the page was opened
// from the wrap email (?wrap=1). Returns the open state and a manual opener.
export function useWrapAutoplay(owner: string | null, platform: Platform, exportedAt: number | null, available: boolean) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!available || exportedAt === null) return;
    const key = keyOf(owner, platform);
    // Read from the URL directly (no useSearchParams, so no Suspense boundary).
    const fromEmail = new URLSearchParams(window.location.search).get('wrap') === '1';
    if (fromEmail || shouldAutoPlayWrap(readSeen(key), exportedAt)) {
      writeSeen(key, exportedAt);
      setOpen(true);
      track(Events.wrapShown, { trigger: fromEmail ? 'email' : 'auto' });
    }
  }, [owner, platform, exportedAt, available]);

  const openManually = () => { setOpen(true); track(Events.wrapShown, { trigger: 'chip' }); };
  return { open, close: () => setOpen(false), openManually };
}
