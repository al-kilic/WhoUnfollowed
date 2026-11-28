'use client';

import { useCallback, useEffect, useState } from 'react';
import { CalendarCheck, CalendarPlus, Copy, Mail, RefreshCw, X } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { isSampleOn } from '@/lib/sample/sampleMode';
import { usePrefs } from '../you/YouPrefs';
import { useStudio } from '../StudioContext';
import { Seg } from './formats';
import { getPlanRemindersContent } from './planReminders.content';

// Studio > Plan, the new-plan dialog and You > Settings: the private calendar
// feed (subscribe once, the calendar follows the plan) and the email reminder.

export interface FeedLinks { url: string; webcal: string; google: string; outlook: string; apple: string }

export function useCalendarFeed() {
  const { locale } = useStudio();
  const sample = isSampleOn();
  const [feed, setFeed] = useState<FeedLinks | null | undefined>(sample ? null : undefined);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(false);
  useEffect(() => {
    if (sample) return;
    void fetch(`/api/ai/calendar?locale=${locale}`, { cache: 'no-store' })
      .then(async (r) => setFeed(r.ok ? ((await r.json()) as { feed: FeedLinks | null }).feed : null))
      .catch(() => setFeed(null));
  }, [locale, sample]);
  const act = useCallback(async (action: 'create' | 'rotate' | 'revoke') => {
    setBusy(true); setErr(false);
    const r = await fetch('/api/ai/calendar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, locale }) }).catch(() => null);
    if (r?.ok) setFeed(((await r.json()) as { feed: FeedLinks | null }).feed); else setErr(true);
    setBusy(false);
  }, [locale]);
  return { feed, busy, err, act, sample };
}

function CopyLink({ url, label, done }: { url: string; label: string; done: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button type="button" className="s-btn sec xs" onClick={() => { void navigator.clipboard?.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1600); }); }}>
      <Copy size={13} />{copied ? done : label}
    </button>
  );
}

// The calendar part. `manage` adds rotate and revoke (You > Settings).
export function CalendarLinks({ manage = false }: { manage?: boolean }) {
  const { locale } = useStudio();
  const k = getPlanRemindersContent(locale);
  const { feed, busy, err, act, sample } = useCalendarFeed();
  if (sample) return <p className="s-sub-t" style={{ margin: 0, fontSize: 13 }}>{k.sampleNote}</p>;
  if (feed === undefined) return <p className="s-sub-t" style={{ margin: 0, fontSize: 13 }}>{k.working}</p>;
  return (
    <div className="s-col" style={{ gap: 10 }}>
      <p className="s-sub-t" style={{ margin: 0, fontSize: 13 }}>{k.why}</p>
      {!feed ? (
        <button type="button" className="s-btn" style={{ alignSelf: 'flex-start' }} disabled={busy} onClick={() => void act('create')}>
          <CalendarPlus size={14} />{busy ? k.working : k.turnOn}
        </button>
      ) : (
        <>
          <div className="s-row" style={{ flexWrap: 'wrap', gap: 8 }} data-testid="calendar-subscribe">
            <a className="s-btn sec xs" href={feed.google} target="_blank" rel="noopener noreferrer"><CalendarCheck size={13} />{k.google}</a>
            <a className="s-btn sec xs" href={feed.apple}><CalendarCheck size={13} />{k.apple}</a>
            <a className="s-btn sec xs" href={feed.outlook} target="_blank" rel="noopener noreferrer"><CalendarCheck size={13} />{k.outlook}</a>
            <CopyLink url={feed.url} label={k.copy} done={k.copied} />
          </div>
          <p className="s-sub-t" style={{ margin: 0, fontSize: 12.5 }}>{k.privateNote}</p>
          {manage ? (
            <div className="s-row" style={{ flexWrap: 'wrap', gap: 8 }}>
              <button type="button" className="s-btn sec xs" disabled={busy} onClick={() => void act('rotate')} title={k.rotateNote}><RefreshCw size={13} />{k.rotate}</button>
              <button type="button" className="s-btn sec xs" disabled={busy} onClick={() => void act('revoke')}><X size={13} />{k.revoke}</button>
            </div>
          ) : <Link href="/app/you#y-calendar" className="s-lnk" style={{ fontSize: 13 }}>{k.manage}</Link>}
        </>
      )}
      {err && <p role="alert" style={{ margin: 0, color: 'var(--bad)', fontSize: 13 }}>{k.error}</p>}
    </div>
  );
}

// The email part: on/off and when.
export function EmailReminder() {
  const { locale } = useStudio();
  const k = getPlanRemindersContent(locale);
  const { prefs, save } = usePrefs();
  const on = !!prefs?.postingReminder;
  return (
    <div className="s-col" style={{ gap: 8 }}>
      <div className="s-row" style={{ justifyContent: 'space-between', gap: 12 }}>
        <span className="s-col" style={{ gap: 2 }}>
          <b style={{ fontWeight: 600, fontSize: 14 }}><Mail size={14} style={{ verticalAlign: '-2px', marginRight: 6 }} />{k.emailTitle}</b>
          <span className="s-sub-t" style={{ fontSize: 13 }}>{k.emailWhy}</span>
        </span>
        <button type="button" role="switch" aria-checked={on} aria-label={k.emailTitle} disabled={!prefs} className={`s-tg${on ? ' on' : ''}`} onClick={() => void save({ postingReminder: !on })} />
      </div>
      {on && prefs && (
        <Seg value={prefs.reminderWhen} onChange={(reminderWhen) => void save({ reminderWhen })} label={k.when}
          options={[{ value: 'day_of', label: k.dayOf }, { value: 'day_before', label: k.dayBefore }]} />
      )}
    </div>
  );
}

// Both, with one line on how they differ.
export function PlanReminders({ manage = false }: { manage?: boolean }) {
  const { locale } = useStudio();
  const k = getPlanRemindersContent(locale);
  return (
    <div className="s-col" style={{ gap: 16 }}>
      <CalendarLinks manage={manage} />
      <div style={{ borderTop: '1px solid var(--line)' }} />
      <EmailReminder />
      <ul className="s-sub-t" style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, display: 'grid', gap: 2 }}>
        <li>{k.calWay}</li><li>{k.emailWay}</li>
      </ul>
    </div>
  );
}
