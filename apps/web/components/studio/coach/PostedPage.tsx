'use client';

import { useEffect, useState } from 'react';
import { Check, Gauge, Sparkles } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useStudio } from '../StudioContext';
import { CoachGate } from './CoachGate';
import { Blur, ProPreview, RollingNumber } from './ProPreview';
import { FormatBadge } from './formats';
import { getPostedContent } from './posted.content';
import { getStudioCoachContent } from './studioCoach.content';
import { isFormat, type PostedItem as Item } from './postedMath';
import { QuickAdd, ResultForm } from './PostedForms';
import { PostedNudge, PostedRhythm } from './PostedExtras';
import { getPostedV2 } from './postedV2.content';
import { useShownPlatform } from '@/hooks/useShownPlatform';
import { PLATFORM_NAME, type Platform } from '@/lib/platform';
import { PostedChart, PostedKpis, PostedLearned, PostedPattern } from './PostedInsights';

function Board() {
  const { locale, userId } = useStudio();
  const t = getPostedContent(locale);
  const v = getPostedV2(locale);
  const { platform } = useShownPlatform(userId ?? null);
  const [adding, setAdding] = useState(false);
  const [items, setItems] = useState<Item[] | null>(null);
  const [tick, setTick] = useState(0);
  const [open, setOpen] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    void fetch('/api/ai/content', { cache: 'no-store' })
      .then((r) => (r.ok ? (r.json() as Promise<{ items: Item[] }>) : { items: [] }))
      .catch(() => ({ items: [] as Item[] }))
      .then((j) => { if (alive) setItems(j.items); });
    return () => { alive = false; };
  }, [tick]);
  if (!items) return <div className="s-card s-pad"><span className="s-shim" style={{ width: '60%' }} /></div>;
  const done = () => { setOpen(null); setTick((n) => n + 1); };
  const mark = async (id: string) => { await fetch('/api/ai/content', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, results: null }) }).catch(() => null); done(); };
  const d = (iso: string) => new Date(iso).toLocaleDateString(locale, { day: 'numeric', month: 'short' });
  const quick = <QuickAdd platform={platform} onDone={(id) => { setOpen(id); setAdding(false); setTick((n) => n + 1); }} />;
  const src = (it: Item) => it.source === 'plan' ? v.src.plan(it.planDay ?? null) : it.source === 'insights' ? v.src.insights : it.source === 'manual' ? v.src.manual : v.src.check;
  if (!items.length) return (
    <div className="s-col" style={{ gap: 12 }}>
      {quick}
      <p className="s-sub-t" style={{ margin: 0 }}>{t.empty} <Link href="/app/create/check" className="s-lnk">{t.check}</Link></p>
      <p className="s-sub-t" style={{ margin: 0 }}><Sparkles size={13} style={{ verticalAlign: '-2px', marginRight: 4 }} />{v.fromInsightsHint} <Link href="/app/plan/insights" className="s-lnk">{v.toInsights}</Link></p>
    </div>
  );

  return (
    <>
      <PostedNudge items={items} onDone={done} />
      <PostedKpis items={items} onAdd={(id) => { setOpen(id); document.getElementById(`post-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }} />
      <div className="s-gmain-top">
        <div className="s-col" style={{ gap: 16 }}><PostedPattern items={items} /><PostedChart items={items} /></div>
        <div className="s-col" style={{ gap: 16 }}><PostedRhythm items={items} /><PostedLearned /></div>
      </div>
      {adding && quick}
      <section className="s-card" style={{ overflow: 'hidden' }}>
        <div className="s-hd"><h3 className="s-h3">{t.log} <span className="s-sub-t" style={{ fontWeight: 400 }}>{items.length}</span></h3>{!adding && <button type="button" className="s-btn sec" onClick={() => setAdding(true)}>{t.addPost}</button>}</div>
        <div className="s-tw">
          <table>
            <thead><tr><th>{t.date}</th><th>{t.post}</th><th>{t.score}</th><th>{t.status}</th></tr></thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} id={`post-${it.id}`}>
                  <td className="s-sub-t" style={{ whiteSpace: 'nowrap' }}>{d(it.postedAt ?? it.createdAt)}</td>
                  <td style={{ minWidth: 220 }}>
                    <div className="s-col" style={{ gap: 4 }}>
                      <span className="s-row" style={{ gap: 8, flexWrap: 'wrap' }}>{isFormat(it.format) && <FormatBadge format={it.format} />}<b style={{ fontWeight: 500 }}>{it.hook}</b><span className="s-psrc">{src(it)}</span>{it.platform && it.platform !== 'instagram' && <span className="s-psrc">{PLATFORM_NAME[it.platform as Platform] ?? it.platform}</span>}</span>
                      {open === it.id && <ResultForm item={it} onDone={done} />}
                    </div>
                  </td>
                  <td>{it.score !== null ? <span className="s-row" style={{ gap: 4 }}><Gauge size={13} />{it.score}</span> : <span className="s-sub-t" style={{ fontSize: 12.5 }}>–</span>}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {typeof it.results?.newFollowers === 'number' ? <span className="s-badge good">{t.result(it.results.newFollowers.toLocaleString(locale))}</span>
                      : it.postedAt ? <span className="s-row" style={{ gap: 6 }}><span className="s-badge"><Check size={12} />{t.postedS}</span>{open !== it.id && <button type="button" className="s-btn sec xs" onClick={() => setOpen(it.id)}>{t.addResults}</button>}</span>
                      : <span className="s-row" style={{ gap: 6 }}><span className="s-badge">{t.checked}</span><button type="button" className="s-btn sec xs" onClick={() => void mark(it.id)}>{t.markPosted}</button></span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

// Studio > Plan > Posted: posts checked with the coach, and how they did.
export function PostedPage() {
  const { c: sc, locale } = useStudio();
  const k = getStudioCoachContent(locale);
  const t = getPostedContent(locale);
  return (
    <CoachGate title={sc.nav.posted} sub={k.sub.posted} feature="plan">
      {(state) => state ? <Board /> : (
        <ProPreview feature="plan" kind="posted" wide>
          {(['reel', 'carousel', 'photo', 'story'] as const).map((f, i) => (
            <div key={f} className="s-pp-row" style={{ gridTemplateColumns: 'auto minmax(0, 1fr) auto' }}>
              <FormatBadge format={f} />
              <Blur w={`${50 + ((i * 17) % 40)}%`} />
              <span className="s-sub-t">{t.newFollowers} <b style={{ color: 'var(--good)' }}><RollingNumber lo={2} hi={60} prefix="+" /></b></span>
            </div>
          ))}
        </ProPreview>
      )}
    </CoachGate>
  );
}
