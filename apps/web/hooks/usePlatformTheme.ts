'use client';

import { useEffect } from 'react';
import type { Platform } from '@/lib/platform';

// Applies the Threads monochrome theme (see globals.css, [data-platform]) to
// the whole document while a page is showing Threads data. Set on <html> so
// portals (tour, dialogs) and the shared nav/footer pick it up too.
export function usePlatformTheme(platform: Platform | null): void {
  useEffect(() => {
    const root = document.documentElement;
    if (platform === 'threads') root.dataset.platform = 'threads';
    else delete root.dataset.platform;
    return () => { delete root.dataset.platform; };
  }, [platform]);
}
