'use client';

import { useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import type { HomeCopy } from './copy';
import { Ic } from './icons';

// "Buy us a coffee": $5, $10 or another amount, through the same anonymous
// Stripe checkout as the rest of the site (/api/stripe/donate).
export function FooterDonate({ c }: { c: HomeCopy['footer'] }) {
  const path = usePathname();
  const [msg, setMsg] = useState(c.note);
  const [picked, setPicked] = useState<number | null>(null);
  const other = useRef<HTMLInputElement>(null);
  const giveOther = () => {
    const v = parseFloat((other.current?.value ?? '').replace(',', '.'));
    if (Number.isFinite(v) && v > 0) void give(Math.round(v * 100) / 100); else setMsg(c.enter);
  };
  const give = async (amount: number) => {
    setMsg(c.opening);
    try {
      const res = await fetch('/api/stripe/donate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount, returnPath: path || '/' }) });
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (res.ok && data.url) { window.location.href = data.url; return; }
      setMsg(data.error ?? c.failed);
    } catch {
      setMsg(c.failed);
    }
  };
  return (
    <>
      <div className="donate" role="group" aria-label={c.coffee}>
        <span className="dh2"><Ic n="heart" s={13} />{c.coffee}</span>
        {[5, 10].map((a) => <button key={a} className="amt" type="button" aria-pressed={picked === a} onClick={() => { setPicked(a); void give(a); }}>${a}</button>)}
        <label className="amt custom">$<input ref={other} inputMode="decimal" placeholder={c.other} aria-label={c.otherAria} onKeyDown={(e) => { if (e.key === 'Enter') giveOther(); }} />
          <button className="go" type="button" aria-label={c.give} onClick={giveOther}><Ic n="arrow" s={12} /></button>
        </label>
      </div>
      <span className="dmsg" aria-live="polite">{msg}</span>
    </>
  );
}
