'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { siteFeedbackTypes, type SiteFeedbackType } from '@ig-tracker/core';
import type { HomeCopy } from './copy';
import { Ic } from './icons';

const SENT_KEY = 'wu:feedback-sent';

// The homepage feedback widget: a glass pill bottom right that opens a small
// glass panel. Type, an optional rating, the note, where, an optional email.
// It reaches the founder in English (/api/site-feedback translates).
export function FeedbackWidget({ c, locale }: { c: HomeCopy['feedback']; locale: 'en' | 'es' | 'pt' }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [hide, setHide] = useState(false);
  const [type, setType] = useState<SiteFeedbackType>('idea');
  const [rating, setRating] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [where, setWhere] = useState(path ?? '/');
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle');
  const [err, setErr] = useState<string | null>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => { try { if (sessionStorage.getItem(SENT_KEY)) setHide(true); } catch { /* storage blocked */ } }, []);
  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector('textarea')?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);
  if (hide) return null;

  const send = async () => {
    setErr(null);
    const m = message.trim(), e = email.trim();
    if (!m) { setErr(c.errMessage); return; }
    if (e && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) { setErr(c.errEmail); return; }
    setState('sending');
    try {
      const res = await fetch('/api/site-feedback', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, message: m, locale, ...(rating ? { rating } : {}), ...(where.trim() ? { where: where.trim() } : {}), ...(e ? { email: e } : {}) }),
      });
      if (!res.ok) throw new Error('failed');
      setState('done');
      try { sessionStorage.setItem(SENT_KEY, '1'); } catch { /* storage blocked */ }
      setTimeout(() => { setOpen(false); setHide(true); }, 2400);
    } catch {
      setState('idle'); setErr(c.errGeneric);
    }
  };

  return (
    <div className={`fbw${open ? ' open' : ''}`}>
      <button className="fbw-pill" type="button" aria-expanded={open} aria-controls="fbw-panel" onClick={() => setOpen((o) => !o)}>
        <Ic n="comment" s={15} /><span>{c.open}</span>
      </button>
      <div className="fbw-panel" id="fbw-panel" ref={panel} role="dialog" aria-label={c.title} hidden={!open}>
        <div className="fbw-h"><b>{c.title}</b><button type="button" className="fbw-x" aria-label={c.close} onClick={() => setOpen(false)}><Ic n="x" s={14} /></button></div>
        {state === 'done' ? <p className="fbw-done"><Ic n="check" s={16} />{c.thanks}</p> : (
          <>
            <span className="fbw-l">{c.type}</span>
            <div className="fbw-types" role="radiogroup" aria-label={c.type}>
              {siteFeedbackTypes.map((t, i) => <button key={t} type="button" role="radio" aria-checked={type === t} onClick={() => setType(t)}>{c.types[i]}</button>)}
            </div>
            <span className="fbw-l">{c.rating} <i>{c.optional}</i></span>
            <div className="fbw-rate" role="radiogroup" aria-label={c.rating}>
              {[1, 2, 3, 4, 5].map((n) => <button key={n} type="button" role="radio" aria-checked={rating === n} className={rating && n <= rating ? 'on' : undefined} onClick={() => setRating(rating === n ? null : n)}>{n}</button>)}
            </div>
            <textarea rows={3} maxLength={2000} placeholder={c.message} aria-label={c.message} value={message} onChange={(e) => setMessage(e.target.value)} />
            <div className="fbw-row">
              <label><span className="fbw-l">{c.where}</span><input value={where} maxLength={200} onChange={(e) => setWhere(e.target.value)} /></label>
              <label><span className="fbw-l">{c.email} <i>{c.optional}</i></span><input type="email" inputMode="email" value={email} maxLength={320} onChange={(e) => setEmail(e.target.value)} /></label>
            </div>
            {err && <p className="fbw-err" role="alert">{err}</p>}
            <div className="fbw-f"><span>{c.privacy}</span><button type="button" className="fbw-send" disabled={state === 'sending'} onClick={() => void send()}>{state === 'sending' ? c.sending : c.send}</button></div>
          </>
        )}
      </div>
    </div>
  );
}
