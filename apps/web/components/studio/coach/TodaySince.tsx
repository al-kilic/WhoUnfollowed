'use client';

import { useMemo } from 'react';
import type { ParsedSnapshot } from '@ig-tracker/core';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useStudio } from '../StudioContext';
import { NextExportState } from '../NextExportState';
import { getTodayContent } from './today.content';
import { getTodayCardsContent } from './todayCards.content';

const SHOW = 3;

// Since your last export: a quiet ledger of who joined and who left, from
// the member's own two exports (computed in this browser, never sent).
export function SinceWidget({ snapshot, previous }: { snapshot: ParsedSnapshot; previous: ParsedSnapshot | undefined }) {
  const { locale } = useStudio();
  const t = getTodayContent(locale);
  const k = getTodayCardsContent(locale).since;
  const n = (x: number) => x.toLocaleString(locale);
  const d = (s: number) => new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric' }).format(new Date(s * 1000));
  const diff = useMemo(() => {
    if (!previous) return null;
    const before = new Set(previous.followers.map((f) => f.username));
    const now = new Set(snapshot.followers.map((f) => f.username));
    return { joined: [...now].filter((u) => !before.has(u)), left: [...before].filter((u) => !now.has(u)) };
  }, [snapshot, previous]);

  return (
    <section className="s-card s-wg s-since" style={{ flex: 1 }}>
      <div className="s-hd"><h3 className="s-h3">{t.since}</h3>{previous && <span className="s-sub-t">{t.sinceRange(d(previous.exportedAt), d(snapshot.exportedAt))}</span>}</div>
      {diff ? <Ledger joined={diff.joined} left={diff.left} total={snapshot.followers.length} n={n} k={k} /> : (
        <NextExportState text={t.noPrev} now={t.dotNow} next={t.dotNext} cta={t.uploadNew} />
      )}
    </section>
  );
}

function Ledger({ joined, left, total, n, k }: { joined: string[]; left: string[]; total: number; n: (x: number) => string; k: ReturnType<typeof getTodayCardsContent>['since'] }) {
  const net = joined.length - left.length;
  const tone = net > 0 ? 'up' : net < 0 ? 'down' : 'flat';
  return (
    <div className="s-pad s-col s-fill" style={{ gap: 14 }}>
      <div className="s-sn-top">
        <span className={`s-sn-net ${tone}`}>{net > 0 ? '+' : ''}{n(net)}</span>
        <span className="s-col" style={{ gap: 2 }}><span className="s-sub-t" style={{ fontSize: 12.5 }}>{k.net}</span><span className="s-sub-t" style={{ fontSize: 12.5 }}>{k.followersNow(n(total))}</span></span>
      </div>
      <div className="s-sn-bar" role="img" aria-label={k.barLabel(n(joined.length), n(left.length))}>
        <i className="j" style={{ flexGrow: joined.length || 0.0001 }} />
        <i className="l" style={{ flexGrow: left.length || 0.0001 }} />
      </div>
      <div className="s-sn-cols">
        <Col title={k.joined} count={n(joined.length)} names={joined} cls="j" k={k} n={n} />
        <Col title={k.left} count={n(left.length)} names={left} cls="l" k={k} n={n} />
      </div>
      <Link href="/app/results" className="s-lnk" style={{ fontSize: 13, marginTop: 'auto' }}>{k.seeWho}<ArrowRight size={13} /></Link>
    </div>
  );
}

function Col({ title, count, names, cls, k, n }: { title: string; count: string; names: string[]; cls: 'j' | 'l'; k: ReturnType<typeof getTodayCardsContent>['since']; n: (x: number) => string }) {
  return (
    <div className="s-sn-col">
      <span className="s-sn-h"><i className={cls} aria-hidden="true" />{title}<b>{count}</b></span>
      {names.length === 0 ? <span className="s-sub-t" style={{ fontSize: 12.5 }}>{k.none}</span> : (
        <ul>
          {names.slice(0, SHOW).map((u) => <li key={u}><span className="s-sn-av" aria-hidden="true">{u.charAt(0).toUpperCase()}</span><span className="s-sn-u">@{u}</span></li>)}
          {names.length > SHOW && <li className="s-sn-more">{k.more(n(names.length - SHOW))}</li>}
        </ul>
      )}
    </div>
  );
}
