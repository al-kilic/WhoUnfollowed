'use client';

import { isSampleOn } from '@/lib/sample/sampleMode';
import { getSampleCoach } from '@/lib/sample/coach';
import { useEffect, useState } from 'react';
import { ArrowLeft, ImagePlus, Plus, ShieldCheck, Sparkles } from 'lucide-react';
import { CoachSeen } from './CoachSeen';
import { getSampleSeen } from '@/lib/sample/coach/seen';
import { useStudio } from '../StudioContext';
import { CoachGate } from './CoachGate';
import { ProPreview } from './ProPreview';
import { InsightsResult } from './InsightsResult';
import { InsightsPull, type PulledPost } from './InsightsPull';
import { StudioDialog } from '../StudioDialog';
import { getInsightsContent } from './insights.content';
import { getInsightsV2 } from './insightsV2.content';
import { AiError } from './AiError';
import { InsightsRuns, useInsightsHistory, type InsightsRun } from './InsightsHistory';
import { InsightsExample, InsightsHero } from './InsightsHero';
import { InsightsRow, NUMS, blank, toNum, type Row } from './InsightsManual';
import { InsightsToPosted } from './InsightsToPosted';
import { useInsightsRun, type InsightsShown, type RunPost } from './useInsightsRun';
import { loadInsightsRun } from '@/lib/insightsThumbs';
import { NO_NUMS } from '@/lib/insightsPick';

const MIN = 3, MAX = 8;

// Photo insights: which of your photos grow your account, and what to shoot
// next. Fast path: the full export (posts + Instagram's numbers, picked for
// you); slow path: photos by hand. Earlier runs are always one tap away.
function Insights() {
  const { locale } = useStudio();
  const t = getInsightsContent(locale);
  const v = getInsightsV2(locale);
  const sample = isSampleOn();
  const history = useInsightsHistory(!sample);
  const { run, busy, err, working } = useInsightsRun(locale, () => void history.reload());
  const [shown, setShown] = useState<InsightsShown | null>(() => (sample ? { data: getSampleCoach(locale).insights, thumbs: [], seen: getSampleSeen() } : null));
  const [view, setView] = useState<'auto' | 'start' | 'manual'>('auto');
  const [pulling, setPulling] = useState<'run' | 'rows' | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const open = (r: InsightsRun) => { const l = loadInsightsRun(r.id); setShown({ id: r.id, data: r.data, thumbs: l.thumbs, nums: l.nums, dates: l.dates, seen: null }); };
  // Open on the latest analysis when there is one; otherwise on the start.
  useEffect(() => {
    if (view !== 'auto' || shown || !history.items) return;
    if (history.items[0]) open(history.items[0]); else setView('start');
  }, [history.items]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => rows.forEach((r) => r.url && URL.revokeObjectURL(r.url)), []); // eslint-disable-line react-hooks/exhaustive-deps

  const startNew = () => { setShown(null); setView('start'); };
  const fromExport = async (posts: PulledPost[]) => {
    setPulling(null);
    const runPosts: RunPost[] = posts.map((p) => ({ file: p.file, url: URL.createObjectURL(p.file), place: '', date: p.date, caption: p.caption, nums: p.nums, key: p.key, format: p.format }));
    const res = await run(runPosts);
    if (res) setShown(res);
  };
  const nextId = () => (rows.length ? Math.max(...rows.map((x) => x.id)) + 1 : 1);
  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const add = [...files].slice(0, MAX - rows.length).map((file, k) => ({ ...blank(nextId() + k), file, url: URL.createObjectURL(file) }));
    setRows((rs) => [...rs, ...add]);
  };
  const addPulled = (posts: PulledPost[]) => {
    setRows((rs) => [...rs, ...posts.slice(0, MAX - rs.length).map((p, k) => ({
      ...blank(nextId() + k), file: p.file, url: URL.createObjectURL(p.file), caption: p.caption, date: p.date, key: p.key,
      n: Object.fromEntries(NUMS.map((x) => [x, p.nums[x] === null ? '' : String(p.nums[x])])) as Row['n'],
    }))]);
    setPulling(null);
  };
  const ready = rows.filter((r) => r.file);
  const analyzeRows = async () => {
    const res = await run(ready.map((r) => ({ file: r.file!, url: r.url!, place: r.place, date: r.date || null, caption: r.caption, key: r.key, nums: { ...NO_NUMS, ...Object.fromEntries(NUMS.map((k) => [k, toNum(r.n[k])])) } })));
    if (res) setShown(res);
  };
  const runs = history.items ?? [];
  const bar = (
    <div className="s-insbar">
      {runs.length > 0 ? <InsightsRuns items={runs} activeId={shown?.id ?? null} onPick={open} label={v.earlierTitle} latest={v.latest} locale={locale} /> : <span />}
      {!sample && <button type="button" className="s-btn" onClick={startNew}><Plus size={15} />{v.newAnalysis}</button>}
    </div>
  );

  if (shown) return (
    <div className="s-col" style={{ gap: 18 }}>
      {bar}
      <InsightsResult data={shown.data} thumbs={shown.thumbs} nums={shown.nums} dates={shown.dates} />
      {!sample && <InsightsToPosted shown={shown} />}
      <CoachSeen seen={shown.seen} />
    </div>
  );
  if (view === 'auto') return <div className="s-card s-pad"><span className="s-shim" style={{ width: '55%' }} /></div>;
  const back = runs.length > 0 && <button type="button" className="s-lnk" style={{ alignSelf: 'flex-start', background: 'none', border: 0, cursor: 'pointer', font: 'inherit', fontSize: 13.5 }} onClick={() => open(runs[0]!)}><ArrowLeft size={14} style={{ verticalAlign: '-2px', marginRight: 4 }} />{v.back}</button>;

  return (
    <div className="s-col" style={{ gap: 18 }}>
      {back}
      {view === 'start' ? (
        <>
          <InsightsHero onStart={() => setPulling('run')} onHand={() => setView('manual')} />
          {busy && <div className="s-nextci"><Sparkles size={16} /><span>{working}</span></div>}
          <AiError text={err} />
          {runs.length === 0 && !busy && <InsightsExample />}
        </>
      ) : (
        <section className="s-card">
          <div className="s-hd">
            <h3 className="s-h3">{t.postsTitle} <span className="s-sub-t" style={{ fontWeight: 400 }}>{t.ready(ready.length, MAX)}</span></h3>
            {rows.length < MAX && <span className="s-row" style={{ gap: 6 }}>
              <button type="button" className="s-btn sec xs" onClick={() => setPulling('rows')}>{t.pullTitle}</button>
              <label className="s-btn sec xs" style={{ cursor: 'pointer' }}><ImagePlus size={13} />{t.handTitle}
                <input type="file" accept="image/*" multiple hidden aria-label={t.handTitle} onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} />
              </label>
            </span>}
          </div>
          {rows.map((r, i) => <InsightsRow key={r.id} r={r} n={i + 1} set={(id, p) => setRows((rs) => rs.map((x) => (x.id === id ? { ...x, ...p } : x)))} remove={(r2) => { if (r2.url) URL.revokeObjectURL(r2.url); setRows((rs) => rs.filter((x) => x.id !== r2.id)); }} />)}
          <div className="s-pad s-col" style={{ gap: 10, borderTop: rows.length ? '1px solid var(--line)' : undefined }}>
            <span className="s-sub-t" style={{ fontSize: 12.5 }}>{rows.length ? t.numbersHint : t.how}</span>
            <button type="button" className="s-btn lg" style={{ alignSelf: 'flex-start' }} disabled={busy || ready.length < MIN} onClick={() => void analyzeRows()}><Sparkles size={15} />{busy ? working : t.analyze}</button>
            {ready.length < MIN && <span className="s-sub-t" style={{ fontSize: 13 }}>{t.needMore(MIN - ready.length)}</span>}
            <AiError text={err} />
            <span className="s-sub-t s-row" style={{ gap: 6, fontSize: 12.5, alignItems: 'flex-start' }}><ShieldCheck size={14} style={{ flex: 'none', marginTop: 2 }} />{t.privacy}</span>
          </div>
        </section>
      )}
      <StudioDialog open={pulling !== null} onClose={() => setPulling(null)} title={t.pullTitle} wide>
        {pulling === 'rows'
          ? <InsightsPull max={MAX - rows.length} onAdd={addPulled} cta={t.addSelected} />
          : <InsightsPull max={MAX} onAdd={(p) => void fromExport(p)} />}
      </StudioDialog>
    </div>
  );
}

// For visitors without Pro AI: the promise and the full example, then the
// upgrade, so the value is clear before anyone pays.
function Locked() {
  const { locale } = useStudio();
  const t = getInsightsContent(locale);
  return (
    <div className="s-col" style={{ gap: 18 }}>
      <InsightsHero locked onStart={() => undefined} onHand={() => undefined} />
      <ProPreview feature="insights" kind="insights"><span className="s-sub-t">{t.how}</span></ProPreview>
      <InsightsExample />
    </div>
  );
}

export function InsightsPage() {
  const { locale, c } = useStudio();
  const t = getInsightsContent(locale);
  return (
    <CoachGate title={c.nav.insights} sub={t.sub} feature="insights">
      {(state) => (state ? <Insights /> : <Locked />)}
    </CoachGate>
  );
}
