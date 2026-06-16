'use client';

import { useState } from 'react';
import { T } from '@/components/landing/tokens';

export function ManageBillingButton() {
  const [loading, setLoading] = useState(false);

  async function handle() {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
    } catch {
      // fall through to re-enable the button
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handle}
      disabled={loading}
      style={{
        fontSize: 13,
        fontWeight: 600,
        fontFamily: T.sans,
        color: T.ink,
        background: T.surface2,
        border: `1px solid ${T.border3}`,
        borderRadius: 9,
        padding: '8px 14px',
        cursor: loading ? 'default' : 'pointer',
        opacity: loading ? 0.6 : 1,
      }}
    >
      {loading ? 'Opening...' : 'Manage billing'}
    </button>
  );
}
