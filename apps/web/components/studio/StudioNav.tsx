'use client';

import { useEffect, type ComponentType } from 'react';
import {
  Aperture, BookOpen, CalendarDays, ChartColumn, CheckCheck, Crosshair, Gauge, History, IdCard, LayoutDashboard, Lightbulb,
  ListChecks, Lock, MessageCircle, Newspaper, PenLine, Radar, Settings2, Sun, Target, TrendingUp, UserMinus, UserRound, Users, Zap,
} from 'lucide-react';
import { useLinkStatus } from 'next/link';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { Hint } from './Hint';
import { IgOnlyBadge } from './IgOnlyBadge';
import { UsageRing } from './UsageRing';
import { tabHint } from './tabHints.content';
import type { ScopeFeature } from './platformScope.content';
import { useStudio } from './StudioContext';
import type { StudioNavKey } from './studio.content';

type Icon = ComponentType<{ size?: number }>;
// free: open to everyone even inside a Pro AI section (the general brief).
export interface NavSub { key: StudioNavKey; href: string; icon: Icon; locked?: 'pro' | 'proAi'; later?: boolean; bulb?: boolean; free?: boolean }
export interface NavItem { key: StudioNavKey; href: string; icon: Icon; subs?: NavSub[]; coach?: boolean }

// Every Studio page, in the prototype's order: Today on its own, then
// "Your data" (free) and "Coach" (Pro AI). The sidebar and the tab bar
// under each section title both read these lists.
export const TODAY: NavItem = { key: 'today', href: '/app/today', icon: Sun };
export const DATA: NavItem[] = [
  { key: 'results', href: '/app/results', icon: ListChecks, subs: [
    { key: 'list', href: '/app/results', icon: ListChecks },
    { key: 'history', href: '/app/history', icon: History },
  ] },
  { key: 'radar', href: '/app/radar', icon: Radar, subs: [
    { key: 'overview', href: '/app/radar', icon: LayoutDashboard },
    { key: 'fixes', href: '/app/radar/fixes', icon: Crosshair, locked: 'pro' },
    { key: 'growth', href: '/app/radar/growth', icon: TrendingUp, locked: 'pro' },
    { key: 'people', href: '/app/radar/people', icon: Users, locked: 'pro' },
    { key: 'whyLeft', href: '/app/radar/why', icon: UserMinus, later: true },
    { key: 'benchmarks', href: '/app/radar/benchmarks', icon: ChartColumn, later: true },
  ] },
];
export const COACH: NavItem[] = [
  { key: 'ask', href: '/app/ask', icon: MessageCircle, coach: true },
  { key: 'create', href: '/app/create', icon: PenLine, coach: true, subs: [
    { key: 'write', href: '/app/create', icon: PenLine },
    { key: 'check', href: '/app/create/check', icon: Gauge },
    { key: 'ideas', href: '/app/create/ideas', icon: Lightbulb, bulb: true },
  ] },
  { key: 'plan', href: '/app/plan', icon: CalendarDays, coach: true, subs: [
    { key: 'planCal', href: '/app/plan', icon: CalendarDays },
    { key: 'posted', href: '/app/plan/posted', icon: CheckCheck },
    { key: 'insights', href: '/app/plan/insights', icon: Aperture },
    { key: 'goals', href: '/app/plan/goals', icon: Target },
    { key: 'brief', href: '/app/plan/brief', icon: Newspaper, free: true },
  ] },
];
export const ACCOUNT: NavItem = { key: 'you', href: '/app/you', icon: UserRound, subs: [
  { key: 'settings', href: '/app/you', icon: Settings2 },
  { key: 'credits', href: '/app/you/credits', icon: Zap },
  { key: 'kit', href: '/app/you/kit', icon: IdCard, later: true },
  { key: 'guides', href: '/app/you/guides', icon: BookOpen, later: true },
] };
export const ALL = [TODAY, ...DATA, ...COACH, ACCOUNT];

const onPath = (path: string, href: string) => path === href || path.startsWith(`${href}/`);
export function sectionOf(path: string): NavItem | undefined {
  return ALL.find((it) => onPath(path, it.href) || it.subs?.some((s) => onPath(path, s.href)));
}
// The sub-page on screen: the longest matching href wins (/app/plan vs /app/plan/goals).
export function activeSub(item: NavItem, path: string): NavSub | undefined {
  return [...(item.subs ?? [])].sort((a, b) => b.href.length - a.href.length).find((s) => onPath(path, s.href));
}

function LockMark({ label }: { label: string }) {
  return <><Lock size={12} style={{ color: 'var(--faint)', marginLeft: 'auto' }} aria-hidden="true" /><span className="s-sr">({label})</span></>;
}

// A spinner on the menu item whose page is loading, so a click answers at once.
function Pending() {
  const { pending } = useLinkStatus();
  return pending ? <span className="s-pend" aria-hidden="true" /> : null;
}

// The sidebar menu. Number keys 1 to 7 jump between sections, as in the prototype.
export function StudioNav({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  const { c, hasPro, hasProAi } = useStudio();
  const path = usePathname();
  const router = useRouter();
  const current = sectionOf(path);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (e.metaKey || e.ctrlKey || e.altKey || t?.closest('input, textarea, select, [contenteditable="true"]')) return;
      const n = Number(e.key);
      if (n >= 1 && n <= ALL.length) router.push(ALL[n - 1]!.href);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [router]);

  const item = (it: NavItem) => {
    const open = current?.key === it.key;
    const Ic = it.icon;
    const locked = it.coach && !hasProAi;
    const sub = open ? activeSub(it, path) : undefined;
    return (
      <div key={it.key} style={{ display: 'contents' }}>
        <Link href={it.href} onClick={onNavigate} className={open ? 's-ni on' : 's-ni'} aria-current={open && !it.subs ? 'page' : undefined} title={c.nav[it.key]}>
          <Ic size={16} /><span className="s-nl">{c.nav[it.key]}</span><Pending />{locked ? <LockMark label={c.lock.proAi} /> : <kbd className="s-kbd" aria-hidden="true">{ALL.indexOf(it) + 1}</kbd>}
        </Link>
        {open && it.subs && (
          <div className="s-sub">
            {it.subs.map((s) => {
              const on = s === sub;
              const showLock = s.locked && !(s.locked === 'pro' && hasPro);
              return (
                <Link key={s.key} href={s.href} onClick={onNavigate} className={on ? 'on' : undefined} aria-current={on ? 'page' : undefined}>
                  <span>{c.nav[s.key]}</span>{s.key === 'credits' && <UsageRing size={13} />}<Pending />
                  {s.later ? <span className="s-later">{c.soon}</span> : showLock && s.locked ? <LockMark label={c.lock.proAi} /> : null}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav aria-label={c.name} className="s-col" style={{ gap: 0, flex: 1 }}>
      <div className="s-nav">{item(TODAY)}</div>
      <span className="s-navh s-navg">{c.groupData}</span>
      <div className="s-nav">{DATA.map(item)}</div>
      <span className="s-navh s-navg s-row" style={{ justifyContent: 'space-between' }}><span className="s-row" style={{ gap: 6 }}>{c.groupCoach}<span className="s-badge dashed" title={c.betaHint} style={{ height: 18, fontSize: 11 }}>{c.beta}</span></span>{!hasProAi && <span className="s-badge" style={{ height: 18, fontSize: 11 }}>{c.plan.proAi}</span>}</span>
      <div className="s-nav">{COACH.map(item)}</div>
      <div className="s-nav" style={{ marginTop: 'auto', paddingTop: 12 }}>{item(ACCOUNT)}</div>
    </nav>
  );
}

// Sub-pages that read Instagram data only get an "Instagram only" badge to the
// left of the tab bar (see platformScope.content and platform-matrix.md).
const IG_ONLY: Partial<Record<string, ScopeFeature>> = { write: 'create', check: 'create', ideas: 'create', planCal: 'plan', posted: 'plan', insights: 'insights' };

// The tab bar under a section's title, with each tab's icon in a small chip.
// Icons glow once in turn when the bar is hovered or a section has just opened.
// Each tab explains itself in a hint (hover pause, focus or long press).
export function SectionTabs() {
  const { c, hasPro, hasProAi, locale, coach } = useStudio();
  const path = usePathname();
  const section = sectionOf(path);
  if (!section?.subs) return null;
  const sub = activeSub(section, path);
  const scope = sub ? IG_ONLY[sub.key] : undefined;
  return (
    <div className="s-snrow">
      {scope && <IgOnlyBadge feature={scope} />}
      <nav className="s-sn live" aria-label={c.nav[section.key]}>
        {section.subs.map((s, k) => {
          const Ic = s.icon;
          const locked = !s.free && ((s.locked && !(s.locked === 'pro' && hasPro)) || (section.coach && !hasProAi));
          const hint = tabHint(s.key, locale);
          const link = (
            <Link key={s.key} href={s.href} className={s === sub ? 'on' : undefined} aria-current={s === sub ? 'page' : undefined}>
              <span className={`s-snb s-led${s.bulb ? ' bulb' : ''}`} style={{ ['--d' as string]: `${(k * 1.6).toFixed(1)}s` }}>{s.key === 'credits' && coach.state?.allowance ? <UsageRing size={15} /> : <Ic size={15} />}</span>
              {c.nav[s.key]}<Pending />
              {s.later ? <span className="s-snx">{c.soon}</span> : locked ? <><Lock size={12} aria-hidden="true" style={{ opacity: .6 }} /><span className="s-sr">({c.lock.proAi})</span></> : null}
            </Link>
          );
          return hint ? <Hint key={s.key} text={hint}>{link}</Hint> : link;
        })}
      </nav>
    </div>
  );
}
