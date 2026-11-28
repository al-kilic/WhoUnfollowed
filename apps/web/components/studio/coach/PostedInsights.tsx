'use client';

import { useEffect, useMemo, useState } from 'react';
import { Brain, Clock, Send, Sparkles, Target, TrendingUp, UserPlus } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { getCoachContent } from '@/app/[locale]/coach/content';
import { useStudio } from '../StudioContext';
import { FORMAT_ICON } from './formats';
import { getPostedContent } from './posted.content';
import { formatAverages, isFormat, type PostedItem as Item } from './postedMath';

const DAY = 86_400_000;
const gained = (it: Item) => (typeof it.results?.newFollowers === 'number' ? it.results.newFollowers : null);
const when = (it: Item) => new Date(it.postedAt ?? it.createdAt).getTime();

// The four numbers at the top of Plan > Posted.
export function PostedKpis({ items, onAdd }: { items: Item[]; onAdd: (id: string) => void }) {
  const { locale } = useStudio();
  const t = getPostedContent(locale);
  const now = new Date();
  const m0 = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1), p0 = Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1);
  const posted = items.filter((x) => x.postedAt);
  const thisMonth = posted.filter((x) => when(x) >= m0), lastMonth = posted.filter((x) => when(x) >= p0 && when(x) < m0);
  const days = Array.from({ length: 14 }, (_, i) => posted.some((x) => Math.floor((now.getTime() - when(x)) / DAY) === 13 - i));
  const res = items.filter((x) => gained(x) !== null).sort((a, b) => when(a) - when(b));
  const from = thisMonth.reduce((s, x) => s + (gained(x) ?? 0), 0);
  const avg = res.length ? res.reduce((s, x) => s + gained(x)!, 0) / res.length : 0;
  const beat = res.filter((x) => gained(x)! > avg);
  const waiting = posted.filter((x) => !x.results);
  const n = (v: number) => v.toLocaleString(locale);
  return (
    <section className="s-card">
      <div className="s-kpis">
        <div className="s-kpi">
          <span className="s-kl"><Send size={13} />{t.kPosted}</span>
          <span className="s-kv"><b>{thisMonth.length}</b>{lastMonth.length > 0 && <span className={thisMonth.length >= lastMonth.length ? 's-up' : 's-up dn'}><TrendingUp size={12} />{t.vsLast(thisMonth.length - lastMonth.length)}</span>}</span>
          <div className="s-strk" aria-hidden="true">{days.map((on, i) => <i key={i} className={on ? 'on' : ''} />)}</div>
        </div>
        <div className="s-kpi">
          <span className="s-kl"><UserPlus size={13} />{t.kFrom}</span>
          <span className="s-kv"><b>+{n(from)}</b><span className="s-sub-t">{t.thisMonth}</span></span>
          <div className="s-strk tall" aria-hidden="true">{res.slice(-14).map((x) => <i key={x.id} className="on" style={{ height: `${Math.max(12, (gained(x)! / Math.max(1, ...res.map((r) => gained(r)!))) * 100)}%` }} />)}</div>
        </div>
        <div className="s-kpi">
          <span className="s-kl"><Target size={13} />{t.kBeat}</span>
          <span className="s-kv"><b>{beat.length}</b><span className="s-sub-t">{t.of(res.length)}</span></span>
          <div className="s-waf" aria-hidden="true">{res.slice(-20).map((x) => <i key={x.id} className={gained(x)! > avg ? 'on g' : ''} />)}</div>
        </div>
        <div className="s-kpi">
          <span className="s-kl"><Clock size={13} />{t.kWait}</span>
          <span className="s-kv"><b>{waiting.length}</b>{waiting[0] && <button type="button" className="s-btn xs" style={{ marginLeft: 'auto' }} onClick={() => onAdd(waiting[0]!.id)}>{t.addNow}</button>}</span>
          <span className="s-kf">{waiting[0] ? `${waiting[0].hook ?? ''}, ${t.postedOn(new Date(when(waiting[0])).toLocaleDateString(locale, { day: 'numeric', month: 'short' }))}` : t.caughtUp}</span>
        </div>
      </div>
    </section>
  );
}

// Biggest pattern: average new followers by format.
export function PostedPattern({ items }: { items: Item[] }) {
  const { locale } = useStudio();
  const t = getPostedContent(locale);
  const c = getCoachContent(locale);
  const avgs = useMemo(() => formatAverages(items), [items]);
  const best = avgs[0], worst = avgs[avgs.length - 1];
  const name = (f: keyof typeof c.formats) => c.formats[f];
  const line = best && worst && avgs.length > 1 && worst.avg > 0
    ? t.better(name(best.format), (Math.round((best.avg / worst.avg) * 10) / 10).toLocaleString(locale, { maximumFractionDigits: 1 }), name(worst.format))
    : best ? t.onlyOne(name(best.format), Math.round(best.avg).toLocaleString(locale)) : t.needResults;
  const withResults = items.filter((x) => gained(x) !== null).length;
  return (
    <section className="s-card s-pad s-col" style={{ gap: 14 }}>
      <span className="s-lab s-row" style={{ gap: 6 }}><Sparkles size={14} style={{ color: 'var(--accent)' }} />{t.pattern}</span>
      <h2 className="s-hl">{line}</h2>
      {avgs.length > 0 && (
        <>
          <div className="s-fmtbars">
            {avgs.map(({ format, avg }, i) => {
              const Ic = FORMAT_ICON[format];
              return (
                <div key={format} className={`s-fbr f-${format}`}>
                  <span className="s-row" style={{ gap: 6 }}><Ic size={15} />{c.formats[format]}</span>
                  <span className="tr"><i style={{ width: `${best ? (avg / best.avg) * 100 : 0}%`, animationDelay: `${i * 90}ms` }} /></span>
                  <b>+{Math.round(avg).toLocaleString(locale)}</b>
                </div>
              );
            })}
          </div>
          <span className="s-sub-t" style={{ fontSize: 12.5 }}>{t.barsNote(withResults)}</span>
        </>
      )}
    </section>
  );
}

// New followers per post, oldest to newest, against the member's own average.
export function PostedChart({ items }: { items: Item[] }) {
  const { locale } = useStudio();
  const t = getPostedContent(locale);
  const res = items.filter((x) => gained(x) !== null).sort((a, b) => when(a) - when(b)).slice(-16);
  const mx = Math.max(1, ...res.map((x) => gained(x)!));
  const avg = res.length ? res.reduce((s, x) => s + gained(x)!, 0) / res.length : 0;
  return (
    <section className="s-card">
      <div className="s-hd"><h3 className="s-h3">{t.perPost}</h3>{res.length > 0 && <span className="s-sub-t s-row" style={{ gap: 6 }}><i className="s-avgk" />{t.avg(Math.round(avg).toLocaleString(locale))}</span>}</div>
      <div className="s-pad">
        {res.length < 2 ? <p className="s-sub-t" style={{ margin: 0 }}>{t.noChart}</p> : (
          <div className="s-ppc">
            <span className="s-avgl" style={{ bottom: `${36 + (avg / mx) * 110}px` }} />
            {res.map((x, k) => {
              const g = gained(x)!, Ic = isFormat(x.format) ? FORMAT_ICON[x.format] : null;
              return (
                <div key={x.id} className={`b${g === mx ? ' best' : g > avg ? ' above' : ''}`} title={`+${g.toLocaleString(locale)} · ${x.hook ?? ''}`}>
                  <span className="s-sub-t" style={{ fontSize: 11 }}>+{g.toLocaleString(locale)}</span>
                  <i style={{ height: `${Math.max(4, (g / mx) * 110)}px`, animationDelay: `${k * 50}ms` }} />
                  {Ic && <span className={`s-noimg s-mini f-${x.format}`}><Ic size={13} /></span>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

// Lessons the coach wrote into memory: what works, what doesn't, its own notes.
export function PostedLearned() {
  const { locale } = useStudio();
  const t = getPostedContent(locale);
  const [lines, setLines] = useState<string[] | null>(null);
  useEffect(() => {
    let alive = true;
    void fetch('/api/ai/memory', { cache: 'no-store' }).then((r) => (r.ok ? r.json() : null)).catch(() => null).then((j: { memory?: { content?: string } | null } | null) => {
      if (!alive) return;
      const out: string[] = [];
      let keep = false;
      for (const raw of (j?.memory?.content ?? '').split('\n')) {
        if (raw.startsWith('## ')) { keep = !/about|voice|sobre|voz/i.test(raw); continue; }
        const m = /^- (?:\d{4}-\d{2}-\d{2} )?(.+)$/.exec(raw.trim());
        if (keep && m && !/memory started|memoria iniciada|memória iniciada/i.test(m[1]!)) out.push(m[1]!);
      }
      setLines(out.slice(-5).reverse());
    });
    return () => { alive = false; };
  }, []);
  return (
    <section className="s-card">
      <div className="s-hd"><h3 className="s-h3 s-row" style={{ gap: 6 }}><Brain size={15} />{t.learned}</h3><Link href="/app/you" className="s-lnk" style={{ fontSize: 13 }}>{t.memory}</Link></div>
      {lines === null ? <div className="s-pad"><span className="s-shim" style={{ width: '70%' }} /></div>
        : lines.length === 0 ? <p className="s-pad s-sub-t" style={{ margin: 0 }}>{t.noLessons}</p>
        : lines.map((l) => (
          <div key={l} className="s-learn">
            <span>{l}</span>
            <span className="s-inmem"><Brain size={12} />{t.inMemory}</span>
          </div>
        ))}
      <div className="s-pad s-sub-t" style={{ borderTop: '1px solid var(--line)', fontSize: 12.5 }}>{t.learnedNote}</div>
    </section>
  );
}
