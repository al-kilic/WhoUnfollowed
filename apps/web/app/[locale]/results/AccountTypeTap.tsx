'use client';

import { useEffect, useState } from 'react';
import type { AppLocale } from '@/i18n/routing';
import { T } from '@/components/landing/tokens';
import { Events, track } from '@/lib/analytics';
import { getAccountTypeContent } from './accountType.content';

type AccountType = 'personal' | 'creator' | 'business';
interface Saved { type: AccountType; niche: string | null }

const KEY = 'wu:account-type';

// Reads the answer saved in this browser, if any. Studio can use it too.
export function readAccountType(): Saved | null {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? 'null') as Saved | null;
    return v && ['personal', 'creator', 'business'].includes(v.type) ? v : null;
  } catch { return null; }
}

const chip = (on: boolean) => ({
  font: 'inherit', fontSize: 13.5, padding: '7px 13px', borderRadius: 99, cursor: 'pointer',
  border: `1px solid ${on ? T.tealMid : T.border2}`, background: on ? T.tealGlow : 'transparent', color: T.ink,
});

// One tap on /results: what this account is for (and, for creators and
// businesses, the niche). Saved only in this browser, plus one analytics
// event with fixed values. Nothing typed, nothing about the followers.
export function AccountTypeTap({ locale }: { locale: AppLocale }) {
  const c = getAccountTypeContent(locale);
  const [saved, setSaved] = useState<Saved | null>(null);
  const [type, setType] = useState<AccountType | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => { setSaved(readAccountType()); setReady(true); }, []);

  function save(next: Saved) {
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* private mode: keep it for this page only */ }
    track(Events.accountType, { type: next.type, niche: next.niche ?? 'none' });
    setSaved(next);
  }

  if (!ready) return null;
  const box = { marginTop: 24, padding: '16px 18px', borderRadius: 14, border: `1px solid ${T.border2}`, background: T.surface1, display: 'flex', flexDirection: 'column' as const, gap: 10 };

  if (saved) {
    return (
      <div style={{ ...box, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <span style={{ fontSize: 14, color: T.inkDim }}>{c.thanks} <strong style={{ color: T.ink }}>{c.types[saved.type]}{saved.niche && saved.niche !== 'other' ? ` · ${c.niches[saved.niche]}` : ''}</strong></span>
        <button type="button" onClick={() => { setSaved(null); setType(null); }} style={{ ...chip(false), fontSize: 12.5, padding: '5px 11px' }}>{c.change}</button>
      </div>
    );
  }
  return (
    <section style={box} aria-label={c.question}>
      <b style={{ fontSize: 15 }}>{c.question}</b>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {(['personal', 'creator', 'business'] as const).map((t) => (
          <button key={t} type="button" aria-pressed={type === t} style={chip(type === t)} onClick={() => (t === 'personal' ? save({ type: t, niche: null }) : setType(t))}>{c.types[t]}</button>
        ))}
      </div>
      {type && type !== 'personal' && (
        <>
          <span style={{ fontSize: 13.5, color: T.inkDim }}>{c.nicheQuestion}</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {[...Object.keys(c.niches), 'other'].map((n) => (
              <button key={n} type="button" style={chip(false)} onClick={() => save({ type, niche: n })}>{n === 'other' ? c.other : c.niches[n]}</button>
            ))}
          </div>
        </>
      )}
      <span style={{ fontSize: 12, color: T.inkMute }}>{c.why}</span>
    </section>
  );
}
