'use client';

import { useEffect, useState } from 'react';
import { openExportPosts, readFullExport, type ExportPost, type ExportPosts } from '@ig-tracker/core';
import { Check, FileArchive, Info, Sparkles } from 'lucide-react';
import { autoPick, NO_NUMS, numbersFor, type PostNums } from '@/lib/insightsPick';
import { useStudio } from '../StudioContext';
import { getInsightsContent } from './insights.content';
import { getInsightsV2 } from './insightsV2.content';
import { ExportRequest } from './ExportRequest';

export interface PulledPost { file: File; caption: string; date: string; nums: PostNums; key: string; format: 'photo' | 'carousel' }
const SHOW = 30;
const BIG = 1.5 * 1024 ** 3;

// Reads the member's full export in this browser: the posts, and Instagram's
// own numbers for each (past_instagram_insights), then picks the strongest
// and weakest recent posts. The member can change the pick, then analyse.
export function InsightsPull({ max, onAdd, cta }: { max: number; onAdd: (posts: PulledPost[]) => void; cta?: (n: number) => string }) {
  const { locale } = useStudio();
  const t = getInsightsContent(locale);
  const v = getInsightsV2(locale);
  const [state, setState] = useState<'idle' | 'reading' | 'empty' | 'error'>('idle');
  const [big, setBig] = useState(false);
  const [exp, setExp] = useState<ExportPosts | null>(null);
  const [nums, setNums] = useState<PostNums[]>([]);
  const [thumbs, setThumbs] = useState<Record<number, string>>({});
  const [picked, setPicked] = useState<number[]>([]);
  const [busy, setBusy] = useState(false);

  async function read(file: File | undefined) {
    if (!file) return;
    setBig(file.size > BIG); setState('reading'); setExp(null); setPicked([]);
    try {
      const [e, full] = await Promise.all([openExportPosts(file), readFullExport(file).catch(() => null)]);
      const rows = full?.insights.posts ?? [];
      const n = e.posts.map((p) => numbersFor(p.date, rows));
      setExp(e); setNums(n);
      setPicked(autoPick(e.posts.slice(0, SHOW).map((p, idx) => ({ idx, date: p.date, nums: n[idx] ?? NO_NUMS })), max));
      setState(e.posts.length ? 'idle' : 'empty');
    } catch { setState('error'); }
  }
  // Thumbnails for the newest posts, made from the ZIP.
  useEffect(() => {
    if (!exp) return;
    let alive = true;
    const urls: string[] = [];
    void (async () => {
      for (const [i, p] of exp.posts.slice(0, SHOW).entries()) {
        const b = await exp.photo(p.photos[0]!);
        if (!alive || !b) continue;
        const u = URL.createObjectURL(b); urls.push(u);
        setThumbs((x) => ({ ...x, [i]: u }));
      }
    })();
    return () => { alive = false; urls.forEach((u) => URL.revokeObjectURL(u)); };
  }, [exp]);

  async function add() {
    if (!exp || busy) return;
    setBusy(true);
    const out: PulledPost[] = [];
    for (const i of [...picked].sort((a, b) => a - b)) {
      const p: ExportPost = exp.posts[i]!;
      const b = await exp.photo(p.photos[0]!);
      if (b) out.push({ file: new File([b], `post-${i}.jpg`, { type: b.type }), caption: p.caption.slice(0, 300), date: new Date(p.date * 1000).toISOString().slice(0, 10), nums: nums[i] ?? NO_NUMS, key: `ig:${p.date}`, format: p.slides > 1 ? 'carousel' : 'photo' });
    }
    setBusy(false);
    onAdd(out);
  }
  const fmt = (s: number) => new Date(s * 1000).toLocaleDateString(locale, { day: 'numeric', month: 'short' });
  const metric = (n: PostNums | undefined) => (n?.reach !== null && n?.reach !== undefined ? `${n.reach.toLocaleString(locale)} ${v.reachShort}` : n?.likes != null ? `${n.likes.toLocaleString(locale)} ${v.likesShort}` : null);
  const anyNums = picked.some((i) => metric(nums[i]) !== null);

  return (
    <div className="s-col" style={{ gap: 14 }}>
      {!exp && <p className="s-sub-t" style={{ margin: 0 }}>{t.pullBody}</p>}
      {!exp && (
        <details className="s-exp-step" open={state !== 'reading' || undefined}>
          <summary><span className="n">1</span>{t.step1}</summary>
          <ExportRequest />
        </details>
      )}
      {!exp && (
        <div className="s-exp-step">
          <div className="summary"><span className="n">2</span>{t.step2}</div>
          <label className="s-btn" style={{ alignSelf: 'flex-start', cursor: 'pointer' }}>
            <FileArchive size={15} />{state === 'reading' ? t.reading : t.pullCta}
            <input type="file" accept=".zip,application/zip" hidden aria-label={t.pullCta} onChange={(e) => void read(e.target.files?.[0])} disabled={state === 'reading'} />
          </label>
        </div>
      )}
      {big && <div className="s-nextci"><Info size={16} /><span>{t.bigFile}</span></div>}
      {(state === 'empty' || state === 'error') && <div className="s-nextci"><Info size={16} /><span>{t.noPosts}</span></div>}
      {exp && exp.posts.length > 0 && (
        <>
          <span className="s-sub-t" style={{ fontSize: 13 }}>{v.picked(picked.length)}</span>
          {!anyNums && <div className="s-nextci"><Info size={16} /><span>{v.noNumbers}</span></div>}
          <div className="s-pullgrid">
            {exp.posts.slice(0, SHOW).map((p, i) => {
              const on = picked.includes(i);
              const m = metric(nums[i]);
              return (
                <button key={`${p.date}-${i}`} type="button" className={`s-pullp${on ? ' on' : ''}`} aria-pressed={on}
                  disabled={!on && picked.length >= max} onClick={() => setPicked((x) => (on ? x.filter((k) => k !== i) : [...x, i]))}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- local object URL from the member's ZIP */}
                  {thumbs[i] ? <img src={thumbs[i]} alt="" /> : <span className="s-shim" style={{ height: '100%' }} />}
                  {on && <span className="tick"><Check size={11} strokeWidth={3} /></span>}
                  <span className="cap">{m ?? fmt(p.date)}</span>
                </button>
              );
            })}
          </div>
          <button type="button" className="s-btn lg" style={{ alignSelf: 'flex-start' }} disabled={picked.length < (cta ? 1 : 3) || busy} onClick={() => void add()}>
            <Sparkles size={15} />{(cta ?? v.analyzeN)(picked.length)}
          </button>
        </>
      )}
    </div>
  );
}
