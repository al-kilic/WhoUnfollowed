'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { T } from './tokens';

const SUGGESTED = [3, 5, 10];

export function DonateWidget() {
  const pathname = usePathname();
  const [amount, setAmount] = useState<number | null>(5);
  const [custom, setCustom] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const effectiveAmount = custom ? Number(custom) : amount;

  async function donate() {
    if (!effectiveAmount || effectiveAmount <= 0) {
      setError('Pick or enter an amount first.');
      return;
    }
    setPending(true);
    setError(null);
    try {
      const res = await fetch('/api/stripe/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: effectiveAmount, returnPath: pathname }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error ?? 'Something went wrong. Try again.');
        setPending(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError('Something went wrong. Try again.');
      setPending(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ fontSize: 11, color: T.inkMute, letterSpacing: '0.16em', textTransform: 'uppercase', fontFamily: T.mono, fontWeight: 600 }}>
        Support the project
      </div>
      <p style={{ fontSize: 13, color: T.inkDim, lineHeight: 1.5, maxWidth: 260 }}>
        No pressure, no perks. If this saved you from a shady password-asking app, throw a few dollars our way.
      </p>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {SUGGESTED.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => { setAmount(n); setCustom(''); }}
            style={{
              padding: '7px 14px',
              borderRadius: 8,
              fontSize: 13,
              fontFamily: T.sans,
              fontWeight: 600,
              cursor: 'pointer',
              border: `1px solid ${!custom && amount === n ? T.teal : T.border2}`,
              background: !custom && amount === n ? T.tealGlow : 'transparent',
              color: !custom && amount === n ? T.teal : T.inkDim,
            }}
          >
            ${n}
          </button>
        ))}
        <input
          type="number"
          min={1}
          max={500}
          placeholder="Other"
          value={custom}
          onChange={(e) => { setCustom(e.target.value); setAmount(null); }}
          style={{
            width: 72,
            padding: '7px 10px',
            borderRadius: 8,
            fontSize: 13,
            fontFamily: T.sans,
            border: `1px solid ${T.border2}`,
            background: 'transparent',
            color: T.ink,
          }}
        />
      </div>
      {error && <span style={{ fontSize: 12, color: T.terra }}>{error}</span>}
      <button
        type="button"
        onClick={donate}
        disabled={pending}
        style={{
          alignSelf: 'flex-start',
          padding: '9px 18px',
          borderRadius: 10,
          fontSize: 13,
          fontWeight: 600,
          fontFamily: T.sans,
          border: 'none',
          cursor: pending ? 'default' : 'pointer',
          opacity: pending ? 0.6 : 1,
          background: T.teal,
          color: T.cream,
        }}
      >
        {pending ? 'Redirecting...' : 'Donate'}
      </button>
    </div>
  );
}
