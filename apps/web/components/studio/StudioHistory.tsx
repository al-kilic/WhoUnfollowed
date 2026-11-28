'use client';

import { useEffect, type ComponentProps } from 'react';
import { CalendarDays, Layers, TrendingUp } from 'lucide-react';
import { HistoryClient } from '@/app/[locale]/history/HistoryClient';
import { useSnapshotList, type SnapshotRecord } from '@/hooks/useSnapshots';
import { useSampleOn } from '@/lib/sample/sampleMode';
import { getSampleRecords } from '@/lib/sample/sampleSnapshot';
import { PLATFORM_NAME, snapshotPlatform } from '@/lib/platform';
import { useStudio } from './StudioContext';
import { useRouter } from '@/i18n/navigation';
import { Tiles } from './Tiles';
import { getSummaryContent } from './radar/summary.content';

// Followers per saved check, for the platform of the newest export.
function Trend({ points, label }: { points: { t: number; v: number }[]; label: string }) {
  const W = 600, H = 90, P = 6;
  const lo = Math.min(...points.map((p) => p.v)), hi = Math.max(...points.map((p) => p.v));
  const t0 = points[0]!.t, t1 = points[points.length - 1]!.t;
  const x = (t: number) => P + ((t - t0) / Math.max(1, t1 - t0)) * (W - 2 * P);
  const y = (v: number) => P + (1 - (v - lo) / Math.max(1, hi - lo)) * (H - 2 * P);
  const d = points.map((p, i) => `${i ? 'L' : 'M'}${x(p.t).toFixed(1)} ${y(p.v).toFixed(1)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} style={{ width: '100%', height: 90, display: 'block' }} preserveAspectRatio="none">
      <path d={`${d} L${x(t1)} ${H} L${x(t0)} ${H} Z`} style={{ fill: 'var(--acc-soft)' }} />
      <path d={d} fill="none" style={{ stroke: 'var(--accent)' }} strokeWidth={2.5} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function HistorySummary({ all }: { all: SnapshotRecord[] }) {
  const { locale } = useStudio();
  const k = getSummaryContent(locale).history;
  if (!all.length) return null;
  const newest = [...all].sort((a, b) => b.exportedAt - a.exportedAt)[0]!;
  const list = all.filter((s) => snapshotPlatform(s.data) === snapshotPlatform(newest.data)).sort((a, b) => a.exportedAt - b.exportedAt);
  const first = list[0]!;
  const app = PLATFORM_NAME[snapshotPlatform(newest.data)];
  const change = newest.data.followers.length - first.data.followers.length;
  const fmt = (t: number) => new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(t * 1000));
  return (
    <Tiles tiles={[
      { label: k.checks, value: all.length, icon: Layers },
      { label: k.first, value: fmt(first.exportedAt), icon: CalendarDays },
      { label: k.change, value: list.length > 1 ? `${change > 0 ? '+' : ''}${change.toLocaleString(locale)}` : '–', icon: TrendingUp, tone: list.length > 1 ? (change >= 0 ? 'good' : 'bad') : undefined },
    ]}>
      <div className="s-col" style={{ gap: 6 }}>
        <span className="s-lab">{k.trend(app)}</span>
        {list.length > 1
          ? <Trend label={k.trend(app)} points={list.map((s) => ({ t: s.exportedAt, v: s.data.followers.length }))} />
          : <span className="s-sub-t">{k.needTwo(app)}</span>}
      </div>
    </Tiles>
  );
}

// History inside Studio: a summary on top, then the same list as /history,
// whose compare upsell opens the upgrade sheet.
export function StudioHistory(props: Omit<ComponentProps<typeof HistoryClient>, 'inStudio' | 'onUpgrade'>) {
  const { openUpgrade } = useStudio();
  const saved = useSnapshotList(props.userId);
  // The list is one tab away: have it ready so switching feels instant.
  const router = useRouter();
  useEffect(() => { router.prefetch('/app/results'); }, [router]);
  const sample = useSampleOn();
  // Sample mode: the made-up account's three exports, read only. The real
  // list (which can rename, delete and sync) is never shown with them.
  if (sample) return <><HistorySummary all={getSampleRecords()} /><SampleList /></>;
  return (
    <>
      <HistorySummary all={saved} />
      {/* The shared history list styles small labels in the old mono font; in
          Studio they read in the normal sans like every other page. */}
      <div style={{ ['--t-font-mono' as string]: 'var(--sans)' }}>
        <HistoryClient {...props} inStudio onUpgrade={() => openUpgrade('history')} />
      </div>
    </>
  );
}

function SampleList() {
  const { locale } = useStudio();
  const list = getSampleRecords();
  const n = (v: number) => v.toLocaleString(locale);
  const fmt = (t: number) => new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(t * 1000));
  return (
    <section className="s-card s-hist" style={{ marginTop: 12 }}>
      {list.map((r, i) => {
        const prev = list[i + 1];
        const d = prev ? r.data.followers.length - prev.data.followers.length : null;
        return (
          <div key={r.id}>
            <span><b style={{ fontWeight: 600 }}>{fmt(r.exportedAt)}</b> · {n(r.data.followers.length)}</span>
            <span>{d === null ? '' : `${d >= 0 ? '+' : ''}${n(d)}`}</span>
          </div>
        );
      })}
    </section>
  );
}
