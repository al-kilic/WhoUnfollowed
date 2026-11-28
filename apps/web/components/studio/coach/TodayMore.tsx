'use client';

import { useMemo } from 'react';
import { analyzeSnapshot, growthTimeline, type ParsedSnapshot } from '@ig-tracker/core';
import { ArrowRight, Check, Images, Lock, Sparkles, TrendingUp, UserMinus } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { proAiPricesAt } from '@/lib/pricing';
import { useStudio } from '../StudioContext';
import { dec, getTodayContent } from './today.content';

// More Today widgets: since the last export, the Pro AI card, and the
// weekly tips built from the user's own numbers (all computed in this browser).

// Since your last export lives in its own file (TodaySince.tsx).
export { SinceWidget } from './TodaySince';

export function UpsellWidget() {
  const { locale, openUpgrade } = useStudio();
  const t = getTodayContent(locale).up;
  return (
    <section className="s-card s-wg s-pp" style={{ flex: 1 }}>
      <div className="s-pad s-col" style={{ gap: 12 }}>
        <span className="s-badge acc" style={{ alignSelf: 'flex-start', cursor: 'default' }}><Sparkles size={12} />Pro AI</span>
        <h3 style={{ fontSize: 17, fontWeight: 600, margin: 0, letterSpacing: '-.02em' }}>{t.title}</h3>
        <ul className="s-col" style={{ gap: 7, margin: 0, padding: 0, listStyle: 'none', fontSize: 13.5 }}>
          {t.points.map((p) => <li key={p} className="s-row" style={{ gap: 8, alignItems: 'flex-start' }}><Check size={15} style={{ color: 'var(--accent)', flex: 'none', marginTop: 2 }} />{p}</li>)}
        </ul>
        <button type="button" className="s-btn acc" style={{ alignSelf: 'flex-start' }} onClick={() => openUpgrade('coach')}><Lock size={13} />{t.cta}</button>
        <span className="s-sub-t" style={{ fontSize: 12.5 }}>{t.from(`$${proAiPricesAt().monthly}`)}</span>
      </div>
    </section>
  );
}

export function BriefWidget({ snapshot }: { snapshot: ParsedSnapshot }) {
  const { locale, hasProAi } = useStudio();
  const t = getTodayContent(locale);
  const tips = useMemo(() => {
    const a = analyzeSnapshot(snapshot);
    const n = (x: number) => x.toLocaleString(locale);
    const followers = a.totalFollowers, mutual = a.mutuals.length, noBack = a.nonFollowers.length;
    const fans = Math.max(0, followers - mutual);
    const tl = growthTimeline(snapshot);
    const left = a.totalFollowing - noBack;
    const month = tl.best ? new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${tl.best.month}-15T12:00:00Z`)) : '';
    return [
      { icon: Images, tone: 'tone-blue', ...t.tipFans(n(fans), followers ? Math.round((fans / followers) * 100) : 0) },
      noBack > 0
        ? { icon: UserMinus, tone: 'tone-rose', ...t.tipClean(n(noBack), left > 0 ? dec(followers / left, locale) : n(followers)) }
        : { icon: UserMinus, tone: 'tone-green', ...t.tipCleanDone },
      tl.best
        ? { icon: TrendingUp, tone: 'tone-amber', ...t.tipBest(month, n(tl.best.followers), Math.round(tl.lastYearShare * 100)) }
        : { icon: TrendingUp, tone: 'tone-amber', ...t.tipNoDates },
    ];
  }, [snapshot, locale, t]);
  return (
    <section className="s-card s-wg">
      <div className="s-hd"><h3 className="s-h3">{t.brief}</h3><span className="s-badge">{t.forYou}</span></div>
      <div className="s-col">
        {tips.map(({ icon: Ic, tone, t: title, p }) => (
          <div key={title} className="s-row s-btip" style={{ gap: 10, alignItems: 'flex-start' }}>
            <span className={`s-bic ${tone}`}><Ic size={15} /></span>
            <span className="s-col" style={{ gap: 3, minWidth: 0 }}><b style={{ fontSize: 13.5, fontWeight: 600 }}>{title}</b><span className="s-sub-t" style={{ fontSize: 12.5, lineHeight: 1.45 }}>{p}</span></span>
          </div>
        ))}
      </div>
      <div className="s-pad s-col" style={{ gap: 6, borderTop: '1px solid var(--line)', marginTop: 'auto' }}>
        <Link href="/app/plan/brief" className="s-lnk" style={{ fontSize: 13 }}>{t.fullBrief}<ArrowRight size={13} /></Link>
        {!hasProAi && <span className="s-sub-t" style={{ fontSize: 12 }}>{t.proBrief}</span>}
      </div>
    </section>
  );
}
