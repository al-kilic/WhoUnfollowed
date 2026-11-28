'use client';

import { useState } from 'react';
import { ArrowRight, ArrowUpRight, User } from 'lucide-react';
import { getDashboardContent } from '@/app/[locale]/dashboard/content';
import { Link } from '@/i18n/navigation';
import { useStudio } from '../StudioContext';
import type { RadarData } from './RadarGate';
import { getRadarPagesContent } from './radarPages.content';

// Radar > People, the prototype's two counts cards: your circle (a donut of
// mutuals, one-way follows and fans, so it sums to everyone you are connected to)
// and how long the one-way follows have been waiting. Counts only.

const DAY = 86_400;

export function PeopleCards({ d }: { d: RadarData }) {
  const { locale } = useStudio();
  const t = getRadarPagesContent(locale).pp;
  const n = (x: number) => x.toLocaleString(locale);
  const parts: [number, string, string][] = [[d.mutuals.length, 'var(--accent)', t.mutuals], [d.nonFollowers.length, 'var(--bad)', t.oneWay], [d.fans.length, 'var(--t-amber-c)', t.fans]];
  const total = Math.max(1, parts.reduce((a, [v]) => a + v, 0));
  let off = 0;
  const now = d.snapshot.exportedAt;
  const buckets = [0, 0, 0, 0, 0];
  for (const a of d.nonFollowers) {
    if (!a.followedAt) { buckets[4]!++; continue; }
    const days = (now - a.followedAt) / DAY;
    buckets[days < 91 ? 0 : days < 365 ? 1 : days < 3 * 365 ? 2 : 3]!++;
  }
  const mx = Math.max(1, ...buckets);
  return (
    <div className="s-grid s-g2" style={{ alignItems: 'stretch' }}>
      <section className="s-card">
        <div className="s-hd"><h3 className="s-h3">{t.who}</h3><span className="s-sub-t">{t.followers(n(d.mutuals.length + d.nonFollowers.length + d.fans.length))}</span></div>
        <div className="s-pad s-row" style={{ gap: 22, flexWrap: 'wrap' }}>
          <svg viewBox="0 0 120 120" className="s-donut" role="img" aria-label={parts.map(([v, , l]) => `${l}: ${n(v)}`).join(', ')}>
            {parts.map(([v, color], i) => {
              const len = (v / total) * 100;
              const el = <circle key={i} cx="60" cy="60" r="46" fill="none" stroke={color} strokeWidth="16" pathLength={100} strokeDasharray={`${Math.max(0, len - 0.8).toFixed(2)} 100`} strokeDashoffset={-off} style={{ animationDelay: `${i * 120}ms` }} />;
              off += len;
              return el;
            })}
          </svg>
          <div className="s-col" style={{ gap: 8, flex: 1, minWidth: 160 }}>
            {parts.map(([v, color, l]) => <span key={l} className="s-row" style={{ gap: 8 }}><i className="s-sw" style={{ background: color }} /><span style={{ flex: 1 }}>{l}</span><b>{n(v)}</b></span>)}
          </div>
        </div>
      </section>
      <section className="s-card">
        <div className="s-hd"><h3 className="s-h3">{t.waiting}</h3><span className="s-sub-t">{t.never(n(d.nonFollowers.length))}</span></div>
        <div className="s-pad s-col" style={{ gap: 10 }}>
          {buckets.map((v, i) => (v || i < 4) && (
            <Link key={i} href="/app/results" className="s-fbr" style={{ gridTemplateColumns: '130px minmax(0, 1fr) 40px', color: 'inherit' }}>
              <span>{t.buckets[i]}</span>
              <span className="tr"><i style={{ width: `${(v / mx) * 100}%`, background: i === 3 ? 'var(--bad)' : 'color-mix(in srgb, var(--bad) 45%, var(--sunk))' }} /></span>
              <b>{n(v)}</b>
            </Link>
          ))}
          <Link href="/app/results" className="s-lnk" style={{ fontSize: 12.5 }}>{t.tap}<ArrowRight size={13} /></Link>
        </div>
      </section>
    </div>
  );
}

// Follow requests you sent that were never accepted (Instagram exports only).
export function PendingCard({ d, locked }: { d: RadarData; locked: boolean }) {
  const { locale } = useStudio();
  const c = getDashboardContent(locale).pending;
  const pp = getRadarPagesContent(locale).pp;
  const [all, setAll] = useState(false);
  const now = d.snapshot.exportedAt;
  const list = [...(d.snapshot.pendingRequests ?? [])].sort((a, b) => (a.followedAt ?? now) - (b.followedAt ?? now));
  const days = (t: number | null) => (t ? Math.floor((now - t) / DAY) : null);
  const buckets: [string, number, string][] = [
    [c.bucket90, list.filter((a) => (days(a.followedAt) ?? 0) >= 90).length, 'var(--bad)'],
    [c.bucket30to90, list.filter((a) => { const x = days(a.followedAt) ?? 0; return x >= 30 && x < 90; }).length, 'var(--warn)'],
    [c.bucketUnder30, list.filter((a) => (days(a.followedAt) ?? 0) < 30).length, 'var(--accent)'],
  ];
  return (
    <section className="s-card s-pending" id="pending-requests" tabIndex={-1} aria-labelledby="pending-requests-h">
      <div className="s-hd"><div className="s-col" style={{ gap: 2, minWidth: 0 }}><h3 className="s-h3" id="pending-requests-h">{pp.pendingTitle}</h3><span className="s-sub-t" style={{ fontSize: 12.5 }}>{pp.pendingSub}</span></div><span className="s-badge k-amber">{list.length.toLocaleString(locale)}</span></div>
      {!list.length ? <p className="s-pad s-sub-t" style={{ margin: 0 }}>{c.emptyMessage}</p> : (
        <>
          <div className="s-pad s-row" style={{ gap: 10, flexWrap: 'wrap', borderBottom: '1px solid var(--line)' }}>
            {buckets.map(([l, n, color]) => <span key={l} className="s-badge big"><i className="s-sw" style={{ background: color, borderRadius: '50%' }} /><b>{n}</b>{l}</span>)}
          </div>
          <div className={`s-rlist${locked ? ' s-blur' : ''}`} inert={locked || undefined}>
            {list.slice(0, all ? list.length : 8).map((a) => (
              <div key={a.username} className="s-rr">
                <span className="s-uav"><User size={14} /></span>
                <div style={{ flex: 1, minWidth: 0 }}><b>@{a.username}</b><span className="s-sub-t">{days(a.followedAt) !== null ? `${days(a.followedAt)}d` : ''}</span></div>
                <a className="s-ib" href={a.href} target="_blank" rel="noopener noreferrer" aria-label={`@${a.username}`}><ArrowUpRight size={15} /></a>
              </div>
            ))}
          </div>
          {list.length > 8 && !all && !locked && <div className="s-pad" style={{ borderTop: '1px solid var(--line)' }}><button type="button" className="s-btn sec" style={{ width: '100%' }} onClick={() => setAll(true)}>+{(list.length - 8).toLocaleString(locale)}</button></div>}
        </>
      )}
    </section>
  );
}
