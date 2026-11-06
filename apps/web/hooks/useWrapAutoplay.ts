'use client';

import { useEffect, useState } from 'react';
import { shouldAutoPlayWrap, type WrapSeen } from '@ig-tracker/core';
import { Events, track } from '@/lib/analytics';

// The last wrap that opened by itself in this browser. One record for every
// app and identity, so a person gets about one wrap a quarter, not one per app
// or per sign-in. A convenience only: if storage is blocked the wrap may play
// again, which is harmless.
const KEY = 'wu:wrap-last';
const LEGACY_PREFIX = 'wu:wrap-seen:'; // v2.0 kept one exportedAt per owner and app

function readSeen(nowSec: number): WrapSeen | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const v = JSON.parse(raw) as Partial<WrapSeen>;
      if (typeof v.shownAt === 'number' && typeof v.exportedAt === 'number') return { shownAt: v.shownAt, exportedAt: v.exportedAt };
    }
    // Carry over v2.0 records so nobody who already watched it gets it again.
    let legacy = 0;
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k?.startsWith(LEGACY_PREFIX)) legacy = Math.max(legacy, Number(window.localStorage.getItem(k)) || 0);
    }
    return legacy > 0 ? { shownAt: nowSec, exportedAt: legacy } : null;
  } catch { return null; }
}

function writeSeen(seen: WrapSeen) {
  try { window.localStorage.setItem(KEY, JSON.stringify(seen)); } catch { /* storage blocked */ }
}

// Opens the wrap by itself about once a quarter (see shouldAutoPlayWrap), or
// once when the page was opened from the wrap email (?wrap=1, removed from the
// address bar right after so a refresh doesn't replay it). `activity` is new
// followers plus follows made in the window. Returns the open state and a
// manual opener for the button, which always works.
export function useWrapAutoplay(exportedAt: number | null, available: boolean, activity: number) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!available || exportedAt === null) return;
    const url = new URL(window.location.href);
    const fromEmail = url.searchParams.get('wrap') === '1';
    if (fromEmail) {
      url.searchParams.delete('wrap');
      window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
    }
    const now = Math.floor(Date.now() / 1000);
    if (fromEmail || shouldAutoPlayWrap(readSeen(now), exportedAt, now, activity)) {
      writeSeen({ shownAt: now, exportedAt });
      setOpen(true);
      track(Events.wrapShown, { trigger: fromEmail ? 'email' : 'auto' });
    }
  }, [exportedAt, available, activity]);

  const openManually = () => { setOpen(true); track(Events.wrapShown, { trigger: 'chip' }); };
  return { open, close: () => setOpen(false), openManually };
}
