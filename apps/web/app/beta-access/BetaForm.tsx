'use client';

import { useState, type FormEvent } from 'react';
import type { BetaCopy } from './beta.content';

// Sends the access code; on success goes to the page the tester asked for.
export function BetaForm({ c, next }: { c: BetaCopy; next: string }) {
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!code.trim() || busy) return;
    setBusy(true); setErr(null);
    const r = await fetch('/api/beta-access', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }),
    }).catch(() => null);
    if (r?.ok) { window.location.assign(next); return; }
    setBusy(false);
    setErr(r?.status === 401 ? c.wrong : r?.status === 429 ? c.tooMany : c.failed);
  }

  return (
    <form onSubmit={submit} className="s-col" style={{ gap: 14 }} noValidate>
      <div className="a-field">
        <label htmlFor="beta-code" className="a-label">{c.label}</label>
        <input id="beta-code" className="s-input a-input" type="password" autoComplete="off" autoFocus
          value={code} onChange={(e) => setCode(e.target.value)} aria-invalid={!!err} aria-describedby={err ? 'beta-err' : undefined} />
      </div>
      {err && <p id="beta-err" role="alert" className="a-error">{err}</p>}
      <button type="submit" className="s-btn a-btn" disabled={busy || !code.trim()}>{busy ? c.checking : c.button}</button>
    </form>
  );
}
