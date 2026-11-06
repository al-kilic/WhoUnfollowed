'use client';

import { useState, type CSSProperties } from 'react';
import type { EmailOptInSource } from '@ig-tracker/core';
import { T } from '@/components/landing/tokens';
import type { AppLocale } from '@/i18n/routing';

export interface EmailOptInLabels {
  placeholder: string;
  cta: string;
  sending: string;
  error: string;
  disposable: string;
}

// One email field + button that posts to /api/reminders. Used for reminder
// opt-ins and the Creator AI waitlist. Submitting is the consent: the label
// next to it says exactly what the email is for.
export function EmailOptInForm({
  source, locale, labels, defaultEmail = '', onDone, id, style,
}: {
  source: EmailOptInSource;
  locale: AppLocale;
  labels: EmailOptInLabels;
  defaultEmail?: string | undefined;
  onDone: (result: { nextAt?: string | undefined; alreadyOn?: boolean | undefined }) => void;
  id: string;
  style?: CSSProperties;
}) {
  const [email, setEmail] = useState(defaultEmail);
  const [state, setState] = useState<'idle' | 'sending' | 'error' | 'disposable'>('idle');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState('sending');
    try {
      const res = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source, locale, consent: true }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; nextAt?: string; alreadyOn?: boolean };
      if (res.ok && data.ok) {
        onDone({ nextAt: data.nextAt, alreadyOn: data.alreadyOn });
        return;
      }
      setState(data.error === 'disposable' ? 'disposable' : 'error');
    } catch {
      setState('error');
    }
  }

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <label htmlFor={id} className="sr-only">{labels.placeholder}</label>
        <input
          id={id}
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (state !== 'sending') setState('idle'); }}
          placeholder={labels.placeholder}
          style={{
            flex: '1 1 200px', minWidth: 0, padding: '10px 13px', borderRadius: 10,
            border: `1px solid ${T.border2}`, background: T.bgCard, color: T.ink,
            fontSize: 14, fontFamily: T.sans, outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={state === 'sending'}
          style={{
            flex: '0 0 auto', padding: '10px 16px', borderRadius: 10, border: 'none',
            background: T.teal, color: T.cream, fontSize: 14, fontWeight: 600, fontFamily: T.sans,
            cursor: state === 'sending' ? 'not-allowed' : 'pointer', opacity: state === 'sending' ? 0.7 : 1,
          }}
        >
          {state === 'sending' ? labels.sending : labels.cta}
        </button>
      </div>
      {(state === 'error' || state === 'disposable') && (
        <p role="alert" style={{ margin: 0, fontSize: 12.5, color: T.terraText }}>
          {state === 'disposable' ? labels.disposable : labels.error}
        </p>
      )}
    </form>
  );
}
