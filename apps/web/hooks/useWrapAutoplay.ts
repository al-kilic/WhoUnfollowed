'use client';

import { useEffect, useState } from 'react';
import { shouldAutoPlayWrap, type WrapSeen } from '@ig-tracker/core';
import { Events, track } from '@/lib/analytics';

// The last wrap that opened by itself for this account in this browser, one
// record across all apps, so a person gets about one wrap a quarter, not one
// per app. A convenience only: if storage is blocked the wrap may play again.
const keyFor = (userId: string) => `wu:wrap-last:${userId}`;
const SHARED_KEY = 'wu:wrap-last'; // 2026-11-07 build: one record per browser
const LEGACY_PREFIX = 'wu:wrap-seen:'; // v2.0 kept one exportedAt per owner and app

function readSeen(userId: string, nowSec: number): WrapSeen | null {
  try {
    const raw = window.localStorage.getItem(keyFor(userId)) ?? window.localStorage.getItem(SHARED_KEY);
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

function writeSeen(userId: string, seen: WrapSeen) {
  try { window.localStorage.setItem(keyFor(userId), JSON.stringify(seen)); } catch { /* storage blocked */ }
}

// Opens the wrap by itself only for signed-in accounts, about once a quarter
// and once per export (see shouldAutoPlayWrap). Signed-out visitors never get
// it by itself. Anyone opening the wrap email (?wrap=1) gets it once, and the
// parameter is removed right after so a refresh doesn't replay it. `activity`
// is new followers plus follows made in the window. The button always works.
export function useWrapAutoplay(userId: string | null, exportedAt: number | null, available: boolean, activity: number) {
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
    const auto = userId !== null && shouldAutoPlayWrap(readSeen(userId, now), exportedAt, now, activity);
    if (fromEmail || auto) {
      if (userId) writeSeen(userId, { shownAt: now, exportedAt });
      setOpen(true);
      track(Events.wrapShown, { trigger: fromEmail ? 'email' : 'auto' });
    }
  }, [userId, exportedAt, available, activity]);

  const openManually = () => { setOpen(true); track(Events.wrapShown, { trigger: 'chip' }); };
  return { open, close: () => setOpen(false), openManually };
}
