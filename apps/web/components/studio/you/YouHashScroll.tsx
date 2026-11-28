'use client';

import { useEffect } from 'react';

// Links like /app/you#billing (the old /account redirect, the Stripe portal's
// way back) arrive before the sections are on the page, so the browser's own
// jump misses. Once they are rendered, go to the section the hash names.
export function YouHashScroll() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    const t = window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }), 60);
    return () => window.clearTimeout(t);
  }, []);
  return null;
}
