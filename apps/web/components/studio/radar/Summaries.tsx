'use client';

import { useMemo } from 'react';
import { growthTimeline, runHealthChecks } from '@ig-tracker/core';
import { Award, Clock, Crosshair, Flame, Heart, TrendingUp, UserMinus, Users } from 'lucide-react';
import { hasPendingRequests } from '@/lib/platform';
import { useStudio } from '../StudioContext';
import { Tiles, type Tile } from '../Tiles';
import type { RadarData } from './RadarGate';
import { getSummaryContent } from './summary.content';

// Counts only, worked out in the browser. Locked tabs still show these: they
// are the same numbers the free Overview already shows in other words.

export function FixesSummary({ d }: { d: RadarData }) {
  const { locale } = useStudio();
  const k = getSummaryContent(locale).fixes;
  const f = useMemo(() => runHealthChecks({ current: d.snapshot, previous: d.previousSnapshot }).filter((x) => x.id !== 'second_export'), [d.snapshot, d.previousSnapshot]);
  const accounts = new Set(f.flatMap((x) => x.accounts.map((a) => a.username))).size;
  return <Tiles tiles={[
    { label: k.found, value: f.length, icon: Crosshair, tone: f.length ? 'bad' : 'good' },
    { label: k.high, value: f.filter((x) => x.impact >= 60).length, icon: Flame },
    { label: k.accounts, value: accounts.toLocaleString(locale), icon: Users },
  ]} />;
}

export function GrowthSummary({ d }: { d: RadarData }) {
  const { locale } = useStudio();
  const k = getSummaryContent(locale).growth;
  const t = useMemo(() => growthTimeline(d.snapshot), [d.snapshot]);
  const first = [...d.platformSnapshots].sort((a, b) => a.exportedAt - b.exportedAt)[0];
  const delta = first && first.exportedAt < d.snapshot.exportedAt ? d.snapshot.followers.length - first.data.followers.length : null;
  const month = t.best ? new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${t.best.month}-15T12:00:00Z`)) : '–';
  const tiles: Tile[] = [
    { label: k.followers, value: d.snapshot.followers.length.toLocaleString(locale), icon: Users },
    { label: k.sinceFirst, value: delta === null ? '–' : `${delta > 0 ? '+' : ''}${delta.toLocaleString(locale)}`, icon: TrendingUp, tone: delta === null ? undefined : delta >= 0 ? 'good' : 'bad' },
    { label: k.bestMonth, value: month, icon: Award },
    { label: k.lastYear, value: `${Math.round(t.lastYearShare * 100)}%`, icon: Clock },
  ];
  return <Tiles tiles={tiles} />;
}

// Scrolls to the pending requests card and moves keyboard focus there.
export function goToPending() {
  const el = document.getElementById('pending-requests');
  if (!el) return;
  const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
  el.focus({ preventScroll: true });
}

export function PeopleSummary({ d }: { d: RadarData }) {
  const { locale } = useStudio();
  const k = getSummaryContent(locale).people;
  const n = (x: number) => x.toLocaleString(locale);
  const tiles: Tile[] = [
    { label: k.mutuals, value: n(d.mutuals.length), icon: Users, tone: 'acc' },
    { label: k.fans, value: n(d.fans.length), icon: Heart },
    { label: k.oneWay, value: n(d.nonFollowers.length), icon: UserMinus, tone: 'bad' },
  ];
  // Requests you sent that were never accepted: amber, and a tap jumps to
  // their card at the bottom of the page.
  if (hasPendingRequests(d.platform)) tiles.push({ label: k.pending, value: n(d.snapshot.pendingRequests?.length ?? 0), icon: Clock, tone: 'amber', hint: k.pendingHint, onClick: () => goToPending() });
  return <Tiles tiles={tiles} />;
}
