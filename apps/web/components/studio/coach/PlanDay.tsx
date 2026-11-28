'use client';

import { useEffect, useState } from 'react';
import type { AiIdeas } from '@ig-tracker/core';
import { CalendarPlus, Check, ChevronLeft, ChevronRight, Move, PenLine, Plus, RefreshCw, Sparkles } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { getCoachContent } from '@/app/[locale]/coach/content';
import { postAction } from '@/app/[locale]/coach/api';
import { movePost } from '@/lib/ai/planCalendar';
import { MAX_PHOTOS, planPhotoId, postPhotoKey, usePostPhotos } from '@/hooks/usePostPhotos';
import { useStudio } from '../StudioContext';
import { FORMAT_ICON, FormatBadge, FormatSeg, type Format } from './formats';
import { getPlanContent } from './plan.content';
import { PhotoStrip } from './PhotoStrip';
import { getStudioCoachContent } from './studioCoach.content';
import { DAY_MS, DAYS, writeHref, type Item } from './PlanCalendar';
import { AiError } from './AiError';
import { AddPostToCalendar } from './PlanAddCalendar';

// The right-hand panel of the plan: the chosen day's post, or ways to fill an empty day.

export function DayPanel({ start, items, day, todayIdx, onChange, planId, onPhotos, onPickMove }: { start: Date; items: Item[]; day: number; todayIdx: number; onChange: (items: Item[]) => void; planId: string; onPhotos: () => void; onPickMove?: (day: number) => void }) {
  const { locale, userId } = useStudio();
  const p = getPlanContent(locale);
  const c = getCoachContent(locale);
  const it = items.find((i) => i.day === day);
  const [fmt, setFmt] = useState<Format>('reel');
  const [text, setText] = useState('');
  const [ideas, setIdeas] = useState<AiIdeas['ideas']>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => { setText(''); setIdeas([]); setErr(null); }, [day]);
  const label = new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(start.getTime() + day * DAY_MS));
  const photos = usePostPhotos(it ? postPhotoKey(userId ?? 'me', planId, planPhotoId(items, it)) : null, MAX_PHOTOS, onPhotos);
  const add = (x: Omit<Item, 'day' | 'posted'>) => onChange([...items, { ...x, day, posted: false }].sort((a, b) => a.day - b.day));

  if (it) {
    const Ic = FORMAT_ICON[it.format];
    return (
      <section className="s-card" style={{ overflow: 'hidden' }}>
        {photos.urls[0] ? (
          <div style={{ position: 'relative' }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- local object URL from this browser */}
            <img src={photos.urls[0]} alt="" style={{ width: '100%', aspectRatio: '4 / 3', objectFit: 'cover', display: 'block' }} />
            {photos.urls.length > 1 && <span className="ig-cnt">1/{photos.urls.length}</span>}
          </div>
        ) : <div className={`s-noimg big f-${it.format}`}><Ic size={26} /><small>{p.noPhoto}</small></div>}
        <div className="s-col s-pad" style={{ gap: 12 }}>
          <div className="s-row" style={{ justifyContent: 'space-between' }}>
            <span className="s-sub-t">{label}</span>
            {it.posted ? <span className="s-pace good"><Check size={13} />{p.posted}</span> : day === todayIdx ? <span className="s-pace warn">{p.today}</span> : null}
          </div>
          <h2 style={{ fontSize: 17, fontWeight: 600, margin: 0, lineHeight: 1.35 }}>{it.idea}</h2>
          {it.hook && <div className="s-col" style={{ gap: 2 }}><span className="s-lab">{p.hook}</span><span>&ldquo;{it.hook}&rdquo;</span></div>}
          <div className="s-row"><FormatBadge format={it.format} /></div>
          <PhotoStrip photos={photos} multiple={it.format === 'carousel'} max={MAX_PHOTOS} swipeNote={false} />
          {it.posted ? (
            <div className="s-row">
              <Link href="/app/plan/posted" className="s-btn sec grow" style={{ flex: 1 }}>{getStudioCoachContent(locale).posted.addResults}</Link>
              <button type="button" className="s-btn sec" onClick={() => onChange(items.map((i) => (i.day === day ? { ...i, posted: false } : i)))}>{p.notPosted}</button>
            </div>
          ) : (
            <>
              <div className="s-row">
                <Link href={writeHref(it)} className="s-btn" style={{ flex: 1 }}><PenLine size={14} />{p.writeIt}</Link>
                <button type="button" className="s-btn sec" onClick={() => onChange(items.map((i) => (i.day === day ? { ...i, posted: true } : i)))}><Check size={14} />{p.markPosted}</button>
              </div>
              <div className="s-row s-sub-t" style={{ justifyContent: 'space-between', borderTop: '1px solid var(--line)', paddingTop: 12 }}>
                <span>{p.moveThis}</span>
                <span className="s-row">
                  <button type="button" className="s-btn sec xs" aria-label={p.earlier} onClick={() => onChange(movePost(items, day, -1, DAYS - 1))}><ChevronLeft size={14} /></button>
                  <button type="button" className="s-btn sec xs" aria-label={p.later} onClick={() => onChange(movePost(items, day, 1, DAYS - 1))}><ChevronRight size={14} /></button>
                  {onPickMove && <button type="button" className="s-btn sec xs" onClick={() => onPickMove(day)}><Move size={13} />{p.pickDay}</button>}
                </span>
              </div>
              {day >= todayIdx && <AddPostToCalendar planId={planId} start={start} item={it} />}
            </>
          )}
        </div>
      </section>
    );
  }

  const w0 = Math.floor(day / 7) * 7;
  const inWeek = items.filter((i) => i.day >= w0 && i.day < w0 + 7).length;
  const movable = items.filter((i) => !i.posted).slice(0, 5);
  async function suggest() {
    if (ideas.length > 1) { setIdeas(ideas.slice(1)); return; }
    setBusy(true); setErr(null);
    const res = await postAction<AiIdeas>('/api/ai/ideas', { theme: '', locale });
    setBusy(false);
    if (!res.ok) { setErr(c.errors[res.error as keyof typeof c.errors] ?? c.errors.failed); return; }
    setIdeas(res.data.ideas);
  }
  const idea = ideas[0];
  return (
    <section className="s-card">
      <div className="s-emptyday">
        <span className="s-edi"><CalendarPlus size={20} /></span>
        <div><span className="s-sub-t">{label}</span><h2 style={{ fontSize: 17, fontWeight: 600, margin: '2px 0' }}>{p.nothing}</h2><span className="s-sub-t">{p.weekCount(inWeek)}</span></div>
      </div>
      <div className="s-col s-pad" style={{ gap: 16, borderTop: '1px solid var(--line)' }}>
        <div className="s-field">
          <span className="s-lab">{p.addPost}</span>
          <FormatSeg value={fmt} onChange={setFmt} label={p.addPost} />
          <form className="s-row" onSubmit={(e) => { e.preventDefault(); if (text.trim()) add({ format: fmt, idea: text.trim(), hook: '' }); }}>
            <input className="s-input" value={text} maxLength={300} onChange={(e) => setText(e.target.value)} placeholder={p.aboutPh} aria-label={p.aboutPh} />
            <button type="submit" className="s-btn" disabled={!text.trim()}><Plus size={14} />{p.add}</button>
          </form>
        </div>
        {idea ? (
          <div className="s-sug">
            <div className="s-col" style={{ gap: 6 }}><FormatBadge format={idea.format} /><b style={{ fontWeight: 600 }}>{idea.idea}</b><span className="s-sub-t">&ldquo;{idea.hook}&rdquo;</span></div>
            <div className="s-row">
              <button type="button" className="s-btn xs" onClick={() => add({ format: idea.format, idea: idea.idea, hook: idea.hook })}><Check size={13} />{p.addToPlan}</button>
              <button type="button" className="s-btn sec xs" disabled={busy} onClick={() => void suggest()}><RefreshCw size={13} />{p.another}</button>
            </div>
          </div>
        ) : (
          <button type="button" className="s-btn sec" disabled={busy} onClick={() => void suggest()}><Sparkles size={14} />{busy ? c.working : p.suggest}</button>
        )}
        <AiError text={err} />
        {movable.length > 0 && (
          <div className="s-field">
            <span className="s-lab">{p.moveHere}</span>
            {movable.map((m) => {
              const Ic = FORMAT_ICON[m.format];
              return (
                <button key={m.day} type="button" className="s-mv" onClick={() => onChange(items.map((i) => (i.day === m.day ? { ...i, day } : i)).sort((a, b) => a.day - b.day))}>
                  <span className={`s-noimg s-mini f-${m.format}`}><Ic size={14} /></span>
                  <span style={{ minWidth: 0, flex: 1 }}><b>{m.idea}</b><span className="s-sub-t" style={{ fontSize: 12 }}>{new Intl.DateTimeFormat(locale, { weekday: 'short', day: 'numeric', timeZone: 'UTC' }).format(new Date(start.getTime() + m.day * DAY_MS))}</span></span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
