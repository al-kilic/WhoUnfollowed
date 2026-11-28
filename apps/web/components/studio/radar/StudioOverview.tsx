'use client';

import { useMemo, type CSSProperties } from 'react';
import { curiosities, runHealthChecks, type ParsedSnapshot } from '@ig-tracker/core';
import { Award, Crosshair, Info, TrendingDown, TrendingUp, UserPlus } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { PLATFORM_NAME, snapshotPlatform } from '@/lib/platform';
import { useVerdict } from '@/hooks/useVerdict';
import { fmt } from '@/components/tools/ToolCard';
import { getRadarPageContent } from '@/components/radar/radar.content';
import type { AppLocale } from '@/i18n/routing';
import { CurCard, Ribbon, VerdictCard } from './OverviewParts';
import { WrapCard, useCardPhoto } from './WrapCard';
import { getRadarPagesContent } from './radarPages.content';

// Studio > Radar > Overview, as in the prototype: the field report, the
// things you didn't know, then your verdict and the 3-month wrap. Counts only,
// all worked out in this browser.
export function StudioOverview({ current, previous, locale, dateLabel, aboutLabel, onAbout, wrapLabel, onWrap, wrapRange }: {
  current: ParsedSnapshot; previous: ParsedSnapshot | undefined; locale: AppLocale; dateLabel: string;
  aboutLabel: string; onAbout: () => void; wrapLabel?: string | undefined; onWrap?: (() => void) | undefined; wrapRange?: string | undefined;
}) {
  const c = getRadarPageContent(locale);
  const o = getRadarPagesContent(locale).ov;
  const photo = useCardPhoto('verdict');
  const v = useVerdict(current, previous, locale, 'radar', { photo: photo.ok ? photo.src : undefined });
  const s = v.stats;
  const n = (x: number) => fmt(x, locale);
  const fixCount = useMemo(() => runHealthChecks({ current, previous }).filter((f) => f.id !== 'second_export').length, [current, previous]);
  const list = useMemo(() => curiosities({ current, previous, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }), [current, previous]);
  const net = s.gained !== undefined && s.lost !== undefined ? s.gained - s.lost : null;
  const ribbon = (big: boolean) => <Ribbon mutuals={s.mutuals} oneWay={s.oneWay} fans={s.fans} c={c} locale={locale} big={big} />;

  return (
    <>
      <section className="s-card s-glow s-cover">
        <div className="s-pad s-col" style={{ gap: 14, padding: 22 }}>
          <div className="s-row" style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <span className="s-lab">{c.cover.eyebrow(PLATFORM_NAME[snapshotPlatform(current)], dateLabel)}</span>
            <button type="button" className="s-btn sec xs" onClick={onAbout}><Info size={13} />{aboutLabel}</button>
          </div>
          <h2 className="s-hlxl">{c.cover.headline(n(s.followers))}</h2>
          <span className="s-sub-t" style={{ fontSize: 15 }}>{c.cover.sub(s.followBackPct, n(s.oneWay))}</span>
          {ribbon(true)}
          <div className="s-row" style={{ gap: 8, flexWrap: 'wrap' }}>
            <span className="s-badge big"><Award size={14} />{c.cover.youAre}: {v.name}</span>
            {fixCount > 0
              ? <Link href="/app/radar/fixes" className="s-badge big warnb"><Crosshair size={14} />{c.cover.toFix(fixCount)}</Link>
              : <span className="s-badge big"><Crosshair size={14} />{c.cover.allClear}</span>}
            {net !== null && <span className={`s-badge big${net >= 0 ? ' good' : ''}`}>{net < 0 ? <TrendingDown size={14} /> : <TrendingUp size={14} />}{net > 0 ? '+' : net < 0 ? '−' : ''}{n(Math.abs(net))} {c.cover.sinceLast}</span>}
            <span className="s-badge big"><UserPlus size={14} />{c.cover.followingCount(n(s.following))}</span>
          </div>
        </div>
      </section>

      <div className="s-col" style={{ gap: 10 }}>
        <div className="s-row" style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <h3 className="s-h3">{c.sections.curiosities.title}</h3>
          <span className="s-sub-t">{c.sections.curiosities.sub}</span>
        </div>
        {list.length
          ? <div className="s-grid s-curg2" style={{ '--cols': list.length % 4 === 0 || list.length > 6 ? 4 : list.length % 3 === 0 ? 3 : Math.min(4, list.length) } as CSSProperties}>{list.map((cu, i) => <CurCard key={cu.id} cu={cu} c={c} locale={locale} i={i} today={o.today} />)}</div>
          : <p className="s-sub-t">{c.noCuriosities}</p>}
      </div>

      <div className={onWrap ? 's-grid s-gmain-r' : 's-col'} style={{ alignItems: 'stretch' }}>
        <VerdictCard v={v} ribbon={ribbon(false)} title={c.sections.verdict.title} sub={o.verdictSub} photo={photo} />
        {onWrap && <WrapCard onOpen={onWrap} kicker={wrapRange ?? o.wrapKicker} title={o.wrapTitle} sub={o.wrapSub} label={wrapLabel ?? o.wrapTitle} />}
      </div>
    </>
  );
}
