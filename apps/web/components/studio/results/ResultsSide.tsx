'use client';

import type { analyzeSnapshot, SnapshotComparison } from '@ig-tracker/core';
import { ArrowRight, Check, Clock, Heart, Lock, Sparkles, UserMinus, UserX } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import type { TriageMap, TriageState } from '@/hooks/useTriage';
import { PLATFORM_NAME, snapshotPlatform } from '@/lib/platform';
import { useStudio } from '../StudioContext';
import type { RadarData } from '../radar/RadarGate';
import { getResultsContent } from './results.content';

type Line = [typeof UserMinus, string, (() => void) | null, (string | undefined)?, (() => void)?];

// The right column of Results, kept small: progress, what matters in this
// export, and a one-line way to the coach's read. Counted in this browser.
export function ResultsSide({ d, a, cmp, triage, onLeft, onFilter }: {
  d: RadarData; a: ReturnType<typeof analyzeSnapshot>; cmp: SnapshotComparison | null; triage: TriageMap; onLeft: () => void; onFilter: (f: TriageState) => void;
}) {
  const { c, locale, hasProAi, openUpgrade } = useStudio();
  const t = getResultsContent(locale);
  const n = (x: number) => x.toLocaleString(locale);
  const app = PLATFORM_NAME[snapshotPlatform(d.snapshot)];
  const dateOf = (s: number) => new Date(s * 1000).toLocaleDateString(locale, { day: 'numeric', month: 'short' });

  // Kept and deactivated accounts leave the queue, so they count toward neither side.
  let done = 0, total = 0, plan = 0, keep = 0, dead = 0, gone = 0;
  for (const x of a.nonFollowers) {
    const s = triage.get(x.username);
    if (s === 'let_it_slide') { keep++; continue; }
    if (s === 'deactivated') { dead++; continue; }
    total++;
    if (s) done++;
    if (s === 'not_a_fan') plan++;
    if (s === 'done') gone++;
  }
  const pct = total ? Math.round((done / total) * 100) : 100;
  const oldest = a.nonFollowers.reduce<number | null>((m, x) => (x.followedAt && (m === null || x.followedAt < m) ? x.followedAt : m), null);
  const lines: Line[] = [
    cmp && d.previousSnapshot
      ? [UserMinus, cmp.lostFollowers.length ? t.leftLine(n(cmp.lostFollowers.length), dateOf(d.previousSnapshot.exportedAt)) : t.leftNone(dateOf(d.previousSnapshot.exportedAt)), cmp.lostFollowers.length ? onLeft : null, 'var(--bad)']
      : [UserMinus, t.secondExport, null],
    ...(plan ? [[UserMinus, t.droppingLine(n(plan), app), null, 'var(--warn)', () => onFilter('not_a_fan')] as Line] : []),
    ...(gone ? [[Check, `${n(gone)} ${t.marks.done.toLowerCase()}.`, null, 'var(--good)', () => onFilter('done')] as Line] : []),
    ...(keep ? [[Heart, t.whitelistLine(n(keep)), null, undefined, () => onFilter('let_it_slide')] as Line] : []),
    ...(dead ? [[UserX, t.deadLine(n(dead)), null, undefined, () => onFilter('deactivated')] as Line] : []),
    ...(oldest ? [[Clock, t.oldestLine(new Date(oldest * 1000).toLocaleDateString(locale, { month: 'long', year: 'numeric' })), null] as Line] : []),
  ];

  return (
    <div className="s-col s-rside">
      <section className="s-card s-rside-c">
        <div className="s-pad s-col" style={{ gap: 8 }}>
          <div className="s-row" style={{ justifyContent: 'space-between' }}><b style={{ fontWeight: 600, fontSize: 13.5 }}>{t.progress}</b><span className="s-sub-t" style={{ fontSize: 12.5 }}>{t.sortedOf(n(done), n(total))}</span></div>
          <div className="s-meter" style={{ height: 6 }}><i style={{ width: `${pct}%`, background: 'var(--accent)' }} /></div>
          <span className="s-sub-t" style={{ fontSize: 12 }}>{total && done >= total ? t.sortedDone : t.leftToDecide(n(total - done))}</span>
        </div>
        <div className="s-mlab">{t.matters}</div>
        {lines.map(([Ic, text, act, color, see], i) => (
          <div key={i} className="s-li sm">
            <Ic size={14} style={color ? { color } : undefined} />
            {act ? <button type="button" className="s-lnk" style={{ textAlign: 'left', whiteSpace: 'normal', fontSize: 13 }} onClick={act}>{text}</button>
              : <span>{text}{see && <> <button type="button" className="s-see" onClick={see}>{t.seeThem}<ArrowRight size={12} /></button></>}</span>}
          </div>
        ))}
      </section>
      {hasProAi
        ? <Link href="/app/today" className="s-card s-readrow"><Sparkles size={14} /><span className="s-grow"><b>{t.read}</b><span className="s-sub-t">{t.readBody}</span></span><ArrowRight size={14} /></Link>
        : <button type="button" className="s-card s-readrow" onClick={() => openUpgrade('coach')}><Sparkles size={14} /><span className="s-grow"><b>{t.read}</b><span className="s-sub-t">{t.readBody}</span></span><span className="s-badge"><Lock size={11} />{c.plan.proAi}</span></button>}
      <span className="s-sub-t s-row" style={{ gap: 6, fontSize: 12, padding: '0 4px' }}><Lock size={12} />{t.privacy}</span>
    </div>
  );
}
