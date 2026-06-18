'use client';

import { useEffect } from 'react';
import { track } from '@/lib/analytics';

// Fires a single Umami custom event once on mount. Used for server-rendered
// pages that want to record a conversion (e.g. a successful signup redirect).
export function AnalyticsEvent({ event }: { event: string }) {
  useEffect(() => {
    track(event);
  }, [event]);
  return null;
}
