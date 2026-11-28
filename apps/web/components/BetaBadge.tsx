'use client';

import { useEffect, useState } from 'react';

// A small fixed "Beta" badge on staging. The middleware sets the readable
// wu_staging cookie whenever the staging gate is on (a runtime setting), so
// the badge also appears on pages rendered at build time. NEXT_PUBLIC_STAGING=1
// forces it on for images built for staging.
export function BetaBadge() {
  const [on, setOn] = useState(process.env.NEXT_PUBLIC_STAGING === '1');
  useEffect(() => {
    try { if (/(?:^|;\s*)wu_staging=1(?:;|$)/.test(document.cookie)) setOn(true); } catch { /* no cookies: no badge */ }
  }, []);
  if (!on) return null;
  return (
    <span aria-label="Beta test version" style={{
      position: 'fixed', bottom: 14, left: 14, zIndex: 2147483000,
      padding: '3px 10px', borderRadius: 999, font: '600 11px/1.4 system-ui, sans-serif', letterSpacing: '.06em',
      textTransform: 'uppercase', pointerEvents: 'none',
      // A solid dark-teal pill reads the same on light and dark pages.
      background: '#0b2426', color: '#5eead4', border: '1px solid #134e4a', boxShadow: '0 4px 14px -6px rgba(0,0,0,.4)',
    }}>Beta</span>
  );
}
