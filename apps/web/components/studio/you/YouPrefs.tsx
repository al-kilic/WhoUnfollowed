'use client';

import { useEffect, useSyncExternalStore } from 'react';
import type { AiPrefs } from '@ig-tracker/core';
import { Check } from 'lucide-react';
import { Seg } from '../coach/formats';
import { getCreateContent } from '../coach/create.content';
import { useStudio } from '../StudioContext';
import { SetRow } from './YouParts';
import { getYouContent } from './you.content';

// You > Settings: the coach defaults and the brief email. One shared copy of
// the prefs for the page, so the Coach and Notifications cards never save
// over each other. Each change saves right away.

type Status = 'idle' | 'saved' | 'error';
let state: { prefs: AiPrefs | null; status: Status } = { prefs: null, status: 'idle' };
const subs = new Set<() => void>();
const set = (s: typeof state) => { state = s; subs.forEach((f) => f()); };
const subscribe = (f: () => void) => { subs.add(f); return () => subs.delete(f); };
let loading = false;
let timer: ReturnType<typeof setTimeout> | undefined;

export function usePrefs() {
  const s = useSyncExternalStore(subscribe, () => state, () => state);
  useEffect(() => {
    if (state.prefs || loading) return;
    loading = true;
    void fetch('/api/ai/prefs', { cache: 'no-store' }).then(async (r) => { if (r.ok) set({ prefs: (await r.json()) as AiPrefs, status: 'idle' }); }).catch(() => undefined).finally(() => { loading = false; });
  }, []);
  const save = async (patch: Partial<AiPrefs>) => {
    if (!state.prefs) return;
    const next = { ...state.prefs, ...patch };
    set({ prefs: next, status: 'idle' });
    const r = await fetch('/api/ai/prefs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(next) }).catch(() => null);
    set({ prefs: state.prefs, status: r?.ok ? 'saved' : 'error' });
    clearTimeout(timer);
    timer = setTimeout(() => set({ ...state, status: 'idle' }), 1800);
  };
  return { ...s, save };
}

export function SaveNote() {
  const { locale } = useStudio();
  const t = getYouContent(locale);
  const { status } = usePrefs();
  if (status === 'saved') return <span className="s-saved"><Check size={13} />{t.savedNote}</span>;
  if (status === 'error') return <span role="alert" style={{ color: 'var(--bad)', fontSize: 12.5 }}>{t.saveError}</span>;
  return null;
}

export function CoachPrefs() {
  const { locale } = useStudio();
  const t = getYouContent(locale);
  const w = getCreateContent(locale).w;
  const { prefs, save } = usePrefs();
  if (!prefs) return <div className="s-pad"><span className="s-shim" style={{ width: '60%' }} /></div>;
  const wd = (i: number) => new Intl.DateTimeFormat(locale, { weekday: 'narrow', timeZone: 'UTC' }).format(new Date(Date.UTC(2024, 0, 1 + i)));
  const wdLong = (i: number) => new Intl.DateTimeFormat(locale, { weekday: 'long', timeZone: 'UTC' }).format(new Date(Date.UTC(2024, 0, 1 + i)));
  return (
    <>
      <SetRow title={t.tone} body={t.toneBody}><Seg value={prefs.tone} onChange={(tone) => void save({ tone })} label={t.tone} options={(['voice', 'warmer', 'bolder'] as const).map((v) => ({ value: v, label: w.tones[v] }))} /></SetRow>
      <SetRow title={t.length}><Seg value={prefs.length} onChange={(length) => void save({ length })} label={t.length} options={(['short', 'medium', 'long'] as const).map((v) => ({ value: v, label: w.lengths[v] }))} /></SetRow>
      <SetRow title={t.days} body={t.daysBody}>
        <div className="s-daysel" role="group" aria-label={t.days}>
          {Array.from({ length: 7 }, (_, i) => {
            const on = prefs.days.includes(i);
            return <button key={i} type="button" className={on ? 'on' : undefined} aria-pressed={on} aria-label={wdLong(i)} onClick={() => void save({ days: on ? prefs.days.filter((d) => d !== i) : [...prefs.days, i].sort() })}>{wd(i)}</button>;
          })}
        </div>
      </SetRow>
      <SetRow title={t.bestTime} body={t.bestTimeBody}>
        <span className="s-row" style={{ gap: 10, flexWrap: 'wrap' }}>
          <input type="time" className="s-input" style={{ maxWidth: 140 }} value={prefs.bestTime ?? ''} aria-label={t.bestTime} onChange={(e) => void save({ bestTime: e.target.value || null })} />
          {prefs.bestTime && <button type="button" className="s-lnk" onClick={() => void save({ bestTime: null })}>{t.anyTime}</button>}
        </span>
      </SetRow>
    </>
  );
}

export function BriefToggle() {
  const { locale } = useStudio();
  const t = getYouContent(locale);
  const { prefs, save } = usePrefs();
  const on = !!prefs?.briefEmail;
  return (
    <SetRow title={t.brief} body={t.briefBody}>
      <button type="button" role="switch" aria-checked={on} aria-label={t.brief} disabled={!prefs} className={`s-tg${on ? ' on' : ''}`} onClick={() => void save({ briefEmail: !on })} />
    </SetRow>
  );
}

export function PostingReminderToggle() {
  const { locale } = useStudio();
  const t = getYouContent(locale);
  const { prefs, save } = usePrefs();
  const on = !!prefs?.postingReminder;
  return (
    <SetRow title={t.postRemind} body={t.postRemindBody}>
      <button type="button" role="switch" aria-checked={on} aria-label={t.postRemind} disabled={!prefs} className={`s-tg${on ? ' on' : ''}`} onClick={() => void save({ postingReminder: !on })} />
    </SetRow>
  );
}
