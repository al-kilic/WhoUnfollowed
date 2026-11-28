'use client';

import { useEffect, useMemo, useState } from 'react';
import { analyzeSnapshot, compareSnapshots, type Account } from '@ig-tracker/core';
import { ArrowDown, ArrowUp, Download, Search } from 'lucide-react';
import { useVisited } from '@/hooks/useVisited';
import { useTriage } from '@/hooks/useTriage';
import { PLATFORM_NAME, snapshotPlatform, triageKeyOf } from '@/lib/platform';
import { downloadCsv } from '@/lib/csv';
import { freeCsvExportUsed, markFreeCsvExportUsed } from '@/lib/exportLimit';
import { getResultsContent as getOldResultsContent } from '@/app/[locale]/results/content';
import { TikTokCapNotice } from '@/app/[locale]/results/TikTokCapNotice';
import { useStudio } from '../StudioContext';
import { useRouter } from '@/i18n/navigation';
import { PlatformIcon } from '@/components/PlatformIcon';
import { LockBar } from '../Lock';
import { RadarGate, type RadarData } from '../radar/RadarGate';
import { ResultRow, type Filter, FILTERS } from './ResultRow';
import { ResultsSide } from './ResultsSide';
import { ResultsStats, type StatTile } from './ResultsStats';
import { getResultsContent } from './results.content';
import { ResultsScroll } from './ResultsScroll';
import { Hint } from '../Hint';
import { ResultsExportNote } from './ResultsExportNote';

type Tab = 'noBack' | 'fans' | 'mutuals' | 'left';

// "2 for every follower" when you follow more than follow you, otherwise
// "1 for every 3 followers". Never "1 for every 0.5 followers".
function followingNote(following: number, followers: number, k: ReturnType<typeof getResultsContent>['statNotes'], locale: string): string {
  const fmt = (x: number) => (Math.round(x * 10) / 10).toLocaleString(locale, { maximumFractionDigits: 1 });
  if (!following || !followers) return '';
  return following >= followers ? k.followingMore(fmt(following / followers)) : k.following(fmt(followers / following));
}
type SortKey = 'date' | 'name';
const PAGE = 30;

function Lists({ d }: { d: RadarData }) {
  const { locale, hasPro, openUpgrade } = useStudio();
  const t = getResultsContent(locale);
  const old = getOldResultsContent(locale);
  const a = useMemo(() => analyzeSnapshot(d.snapshot), [d.snapshot]);
  const cmp = useMemo(() => (d.previousSnapshot ? compareSnapshots(d.previousSnapshot, d.snapshot) : null), [d.previousSnapshot, d.snapshot]);
  const platform = snapshotPlatform(d.snapshot);
  const app = PLATFORM_NAME[platform];
  const { triage, setTriageState } = useTriage(triageKeyOf(d.snapshot));
  // History is one tab away: have it ready so switching feels instant.
  const router = useRouter();
  useEffect(() => { router.prefetch('/app/history'); }, [router]);
  const [tab, setTab] = useState<Tab>('noBack');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<{ key: SortKey; asc: boolean }>({ key: 'date', asc: true });
  const { visited, mark } = useVisited(triageKeyOf(d.snapshot));
  const [filter, setFilter] = useState<Filter>('all');
  const [shown, setShown] = useState(PAGE);
  const n = (x: number) => x.toLocaleString(locale);
  const dateOf = (s: number) => new Date(s * 1000).toLocaleDateString(locale, { day: 'numeric', month: 'short' });

  const lists: Record<Tab, Account[]> = { noBack: a.nonFollowers, fans: a.fans, mutuals: a.mutuals, left: cmp?.lostFollowers ?? [] };
  const rows = useMemo(() => {
    const term = q.trim().toLowerCase().replace(/^@/, '');
    let r = lists[tab].filter((x) => !term || x.username.toLowerCase().includes(term));
    if (tab === 'noBack' && filter !== 'all') r = r.filter((x) => (filter === 'untriaged' ? !triage.get(x.username) : triage.get(x.username) === filter));
    const dir = sort.asc ? 1 : -1;
    if (sort.key === 'name') return [...r].sort((x, y) => dir * x.username.localeCompare(y.username));
    return [...r].sort((x, y) => dir * ((x.followedAt ?? Infinity) - (y.followedAt ?? Infinity)));
  // eslint-disable-next-line react-hooks/exhaustive-deps -- lists is rebuilt from a and cmp each render
  }, [a, cmp, tab, q, sort, filter, triage]);

  const unfollowed = [...triage.values()].filter((s) => s === 'done').length;
  const csv = () => {
    // The names of who left are Pro AI, so they can't leave by CSV either.
    if (!hasPro && tab === 'left') { openUpgrade('history'); return; }
    if (!hasPro && freeCsvExportUsed()) { openUpgrade('radar'); return; }
    downloadCsv(rows, `${tab}-${d.snapshot.exportedAt}.csv`);
    if (!hasPro) markFreeCsvExportUsed();
  };
  const go = (x: Tab) => { setTab(x); setShown(PAGE); setFilter('all'); };
  const counts: Record<Tab, number> = { noBack: a.nonFollowers.length, fans: a.fans.length, mutuals: a.mutuals.length, left: lists.left.length };
  const label = (f: Filter) => (f === 'all' ? t.all : f === 'untriaged' ? t.untriaged : f === 'let_it_slide' ? t.marks.keep : f === 'not_a_fan' ? t.marks.unfollow : f === 'done' ? t.marks.done : f === 'check_later' ? t.marks.later : t.marks.dead);
  const pctOf = (x: number, of: number) => (of ? Math.round((x / of) * 100) : 0);
  const tiles: StatTile[] = [
    { label: old.statFollowers, value: a.totalFollowers, meter: 100, note: t.statNotes.followers(pctOf(a.fans.length, a.totalFollowers)) },
    { label: old.statFollowing, value: a.totalFollowing, meter: pctOf(a.totalFollowing, a.totalFollowers), note: followingNote(a.totalFollowing, a.totalFollowers, t.statNotes, locale),
      extra: unfollowed > 0 ? old.nowApprox(n(a.totalFollowing - unfollowed)) : null, extraTitle: old.markedAsUnfollowed(unfollowed) },
    { label: old.statMutuals, value: a.mutuals.length, meter: pctOf(a.mutuals.length, a.totalFollowing), note: t.statNotes.mutuals(pctOf(a.mutuals.length, a.totalFollowing)) },
  ];

  return (
    <>
      <section className={`s-card s-rhero pf-${platform}`}>
        <div className="s-col" style={{ gap: 6, minWidth: 0 }}>
          <span className="s-rhero-pf"><PlatformIcon platform={platform} size={13} />{app}</span>
          <h2><span>{n(a.nonFollowers.length)}</span> {old.headlineSuffix(a.nonFollowers.length, app)}</h2>
          <p className="s-sub-t" style={{ margin: 0 }}>{t.sub(dateOf(d.snapshot.exportedAt), d.previousSnapshot ? dateOf(d.previousSnapshot.exportedAt) : null)}</p>
        </div>
        <ResultsStats tiles={tiles} locale={locale} />
      </section>
      <TikTokCapNotice snapshot={d.snapshot} locale={locale} />
      <ResultsExportNote snapshot={d.snapshot} previous={d.previousSnapshot} />

      <div className="s-grid s-gres">
        <section className="s-card" style={{ overflow: 'hidden' }}>
          <div className="s-rtabs" role="tablist">
            {(Object.keys(lists) as Tab[]).map((k) => (
              <button key={k} type="button" role="tab" aria-selected={k === tab} className={k === tab ? 'on' : undefined} onClick={() => go(k)}>
                {t.tabs[k]}<span>{k === 'left' && !cmp ? '–' : n(counts[k])}</span>
              </button>
            ))}
          </div>
          <div className="s-pad s-col" style={{ gap: 10, borderBottom: '1px solid var(--line)' }}>
            <div className="s-row" style={{ gap: 8 }}>
              <label className="s-cbox s-grow"><Search size={15} /><input value={q} onChange={(e) => { setQ(e.target.value); setShown(PAGE); }} placeholder={t.search} aria-label={t.search} /></label>
              <div className="s-seg" role="group" aria-label={t.oldest}>
                {(['date', 'name'] as const).map((k) => {
                  const on = sort.key === k;
                  const Ic = on && !sort.asc ? ArrowUp : ArrowDown;
                  const text = k === 'date' ? (on && !sort.asc ? t.newest : t.oldest) : (on && !sort.asc ? 'Z → A' : 'A → Z');
                  return <button key={k} type="button" className={on ? 'on' : undefined} aria-pressed={on} title={k === 'date' ? t.date : t.name} onClick={() => { setSort(on ? { key: k, asc: !sort.asc } : { key: k, asc: true }); setShown(PAGE); }}><Ic size={13} />{text}</button>;
                })}
              </div>
              <button type="button" className="s-btn sec" onClick={csv} disabled={!rows.length} title={t.csvBody}><Download size={14} />{t.csv}</button>
            </div>
            {tab === 'noBack' && (
              <>
                <div className="s-row" style={{ gap: 6, flexWrap: 'wrap' }}>
                  {FILTERS.map((f) => {
                    const chip = <button type="button" className={`s-chip2${f === 'untriaged' ? ' s-chip-un' : ''}${filter === f ? ' on' : ''}`} aria-pressed={filter === f} onClick={() => { setFilter(f); setShown(PAGE); }}>{label(f)}</button>;
                    const hint = f === 'untriaged' || f === 'deactivated' ? t.filterHints[f] : f === 'all' ? null : t.markHints[f === 'let_it_slide' ? 'keep' : f === 'not_a_fan' ? 'unfollow' : f === 'done' ? 'done' : 'later'];
                    return hint ? <Hint key={f} text={hint}>{chip}</Hint> : <span key={f}>{chip}</span>;
                  })}
                </div>
              </>
            )}
          </div>
          {tab === 'left' && !cmp ? <p className="s-pad s-sub-t" style={{ margin: 0 }}>{t.needTwo}</p>
            // Free: who left is counted, the names come with Pro AI.
            : tab === 'left' && !hasPro ? <div className="s-pad"><LockBar feature="history" text={t.leftLocked(n(counts.left))} /></div> : (
            <ResultsScroll shown={Math.min(shown, rows.length)} total={rows.length} onMore={() => setShown((k) => k + PAGE)} countLabel={t.showing(n(Math.min(shown, rows.length)), n(rows.length))} resetKey={`${tab}|${q}|${sort.key}|${sort.asc}|${filter}`}>
            <div className="s-rlist">
              {rows.slice(0, shown).map((x) => (
                <ResultRow key={x.username} account={x} tab={tab} platform={platform} state={triage.get(x.username)} since={d.previousSnapshot ? [dateOf(d.previousSnapshot.exportedAt), dateOf(d.snapshot.exportedAt)] : null}
                  onMark={(s) => void setTriageState(x.username, s)} visited={visited.has(x.username)} onVisit={() => mark(x.username)} />
              ))}
              {!rows.length && <p className="s-pad s-sub-t" style={{ margin: 0 }}>{q ? t.noMatch : t.empty}</p>}
            </div>
            </ResultsScroll>
          )}
        </section>
        <ResultsSide d={d} a={a} cmp={cmp} triage={triage} onLeft={() => go('left')} onFilter={(f) => { setTab('noBack'); setFilter(f); setShown(PAGE); }} />
      </div>
    </>
  );
}

// Studio > Results: the old page's headline, the prototype's list, and what matters beside it.
export function StudioResultsPage() {
  const { c } = useStudio();
  return <RadarGate title={c.nav.results} sub="">{(d) => <Lists d={d} />}</RadarGate>;
}
