'use client';

import { useState, useTransition } from 'react';
import { T } from '@/components/landing/tokens';
import { track } from '@/lib/analytics';
import { setRemindersEnabled } from './actions';
import type { AccountContent } from './content';

interface Props {
  nextAt: string | null;
  locale: string;
  c: AccountContent['reminders'];
}

export function ReminderToggle({ nextAt: initialNextAt, locale, c }: Props) {
  const [nextAt, setNextAt] = useState(initialNextAt);
  const [pending, startTransition] = useTransition();
  const on = nextAt !== null;

  function toggle() {
    startTransition(async () => {
      const res = await setRemindersEnabled(!on, locale);
      if (!res.ok) return;
      setNextAt(on ? null : (res.nextAt ?? null));
      track(on ? 'reminder-unsubscribed' : 'reminder-optin', { source: 'account' });
    });
  }

  const dateLabel = nextAt
    ? new Date(nextAt).toLocaleDateString(locale, { day: 'numeric', month: 'long' })
    : null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
      <p style={{ fontSize: 13, color: T.inkDim, lineHeight: 1.5, margin: 0, flex: 1, minWidth: 220 }}>
        {dateLabel ? c.onDesc.replace('{date}', dateLabel) : c.offDesc}
      </p>
      <button
        onClick={toggle}
        disabled={pending}
        style={{
          fontSize: 13, fontWeight: 600, fontFamily: T.sans,
          color: on ? T.ink : T.cream, background: on ? 'transparent' : T.teal,
          border: on ? `1px solid ${T.border3}` : 'none', borderRadius: 10, padding: '8px 16px',
          cursor: pending ? 'not-allowed' : 'pointer', opacity: pending ? 0.7 : 1,
        }}
      >
        {pending ? c.updating : on ? c.turnOff : c.turnOn}
      </button>
    </div>
  );
}
