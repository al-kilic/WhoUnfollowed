'use client';

import { useState, useTransition } from 'react';
import { T } from '@/components/landing/tokens';
import { setMarketingOptOut } from './actions';
import type { AccountContent } from './content';

interface Props {
  optedIn: boolean;
  c: AccountContent['marketingConsent'];
}

export function MarketingConsent({ optedIn, c }: Props) {
  const [isOptedIn, setIsOptedIn] = useState(optedIn);
  const [pending, startTransition] = useTransition();

  function turnOff() {
    startTransition(async () => {
      const res = await setMarketingOptOut();
      if (res.ok) setIsOptedIn(false);
    });
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
      <p style={{ fontSize: 13, color: T.inkDim, lineHeight: 1.5, margin: 0, flex: 1, minWidth: 220 }}>
        {isOptedIn ? c.optedInDesc : c.optedOutDesc}
      </p>
      {isOptedIn && (
        <button
          onClick={turnOff}
          disabled={pending}
          style={{
            fontSize: 13, fontWeight: 600, fontFamily: T.sans, color: T.ink, background: 'transparent',
            border: `1px solid ${T.border3}`, borderRadius: 10, padding: '8px 16px',
            cursor: pending ? 'not-allowed' : 'pointer', opacity: pending ? 0.7 : 1,
          }}
        >
          {pending ? c.updating : c.toggleOff}
        </button>
      )}
    </div>
  );
}
