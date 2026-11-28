'use client';

import { useState, type FormEvent } from 'react';
import type { AiPlan } from '@ig-tracker/core';
import { Brain, Sparkles, Upload } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { postAction } from '@/app/[locale]/coach/api';
import type { Seen } from './CoachSeen';
import { getCoachContent } from '@/app/[locale]/coach/content';
import { useStudio } from '../StudioContext';
import { AiError } from './AiError';
import { FORMAT_ICON, Seg, type Format } from './formats';
import { getPlanContent } from './plan.content';
import { PlanReminders } from './PlanReminders';
import { getPlanRemindersContent } from './planReminders.content';

export interface PlanSetupInfo {
  prefs: Partial<Prefs> | null; followers: number | null; exportedAt: string | null; postsWithResults: number; niche: string | null;
}
interface Prefs { postsPerWeek: number; formats: Format[]; photos: 'ready' | 'weekly' | 'none'; readyCount: number | null; places: string; focus: string; avoid: string; time: 'quick' | 'hour' | 'half_day' }
const FORMATS: Format[] = ['reel', 'carousel', 'photo', 'story'];
const DEFAULTS: Prefs = { postsPerWeek: 3, formats: ['carousel', 'reel', 'photo'], photos: 'weekly', readyCount: null, places: '', focus: '', avoid: '', time: 'hour' };

// Before a 30-day plan: what the plan is built on (the account), and what the
// member can realistically make this month. The answers are kept for next time.
export function PlanSetup({ info, onDone }: { info: PlanSetupInfo | null; onDone: (plan: AiPlan, seen: Seen | null) => void }) {
  const { locale } = useStudio();
  const p = getPlanContent(locale);
  const t = p.setup;
  const c = getCoachContent(locale);
  const [f, setF] = useState<Prefs>({ ...DEFAULTS, ...(info?.prefs ?? {}) });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const set = <K extends keyof Prefs>(k: K, v: Prefs[K]) => setF((x) => ({ ...x, [k]: v }));
  const toggle = (fmt: Format) => set('formats', f.formats.includes(fmt) ? (f.formats.length > 1 ? f.formats.filter((x) => x !== fmt) : f.formats) : [...f.formats, fmt]);

  if (!info?.exportedAt) {
    return (
      <div className="s-col" style={{ gap: 12, alignItems: 'flex-start' }}>
        <p className="s-sub-t" style={{ margin: 0 }}>{t.noExport}</p>
        <Link href="/" className="s-btn"><Upload size={14} />{t.upload}</Link>
      </div>
    );
  }
  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true); setErr(null);
    const res = await postAction<AiPlan>('/api/ai/plan', { ...f, locale, platform: 'instagram' });
    setBusy(false);
    if (!res.ok) { setErr(c.errors[res.error as keyof typeof c.errors] ?? c.errors.failed); return; }
    onDone(res.data, res.seen ?? null);
  }
  const date = new Date(info.exportedAt).toLocaleDateString(locale, { day: 'numeric', month: 'short' });
  return (
    <form onSubmit={submit} className="s-col" style={{ gap: 16 }}>
      <div className="s-nextci"><Brain size={16} /><span><b style={{ fontWeight: 600 }}>{t.basis}</b><br /><span className="s-sub-t" style={{ fontSize: 13 }}>{t.basisLine((info.followers ?? 0).toLocaleString(locale), date, info.postsWithResults)}</span></span></div>
      <div className="s-field">
        <span className="s-lab">{t.perWeek}</span>
        <div className="s-row" style={{ gap: 6, flexWrap: 'wrap' }}>{[1, 2, 3, 4, 5, 7].map((n) => <button key={n} type="button" className={`s-chip2${f.postsPerWeek === n ? ' on' : ''}`} aria-pressed={f.postsPerWeek === n} onClick={() => set('postsPerWeek', n)}>{n}</button>)}</div>
        <span className="s-sub-t" style={{ fontSize: 12.5 }}>{t.perWeekHelp}</span>
      </div>
      <div className="s-field">
        <span className="s-lab">{t.formats}</span>
        <div className="s-row" style={{ gap: 6, flexWrap: 'wrap' }}>
          {FORMATS.map((fmt) => { const Ic = FORMAT_ICON[fmt]; return <button key={fmt} type="button" className={`s-chip2${f.formats.includes(fmt) ? ' on' : ''}`} aria-pressed={f.formats.includes(fmt)} onClick={() => toggle(fmt)}><span className="s-row" style={{ gap: 5 }}><Ic size={13} />{c.formats[fmt]}</span></button>; })}
        </div>
      </div>
      <div className="s-field">
        <span className="s-lab">{t.photos}</span>
        <Seg value={f.photos} onChange={(v) => set('photos', v)} label={t.photos} options={(['ready', 'weekly', 'none'] as const).map((v) => ({ value: v, label: t.photoStates[v] }))} />
        {f.photos === 'ready' && <input className="s-input" id="plan-ready" style={{ maxWidth: 200 }} inputMode="numeric" aria-label={t.readyCount} placeholder={t.readyCount} value={f.readyCount ?? ''} onChange={(e) => set('readyCount', e.target.value ? Number(e.target.value.replace(/\D/g, '')) : null)} />}
      </div>
      <label className="s-field" htmlFor="plan-places"><span className="s-lab">{t.places}</span>
        <input id="plan-places" className="s-input" maxLength={300} placeholder={t.placesPh} value={f.places} onChange={(e) => set('places', e.target.value)} />
      </label>
      <label className="s-field" htmlFor="plan-focus"><span className="s-lab">{t.wants}</span>
        <input id="plan-focus" className="s-input" maxLength={300} placeholder={t.wantsPh} value={f.focus} onChange={(e) => set('focus', e.target.value)} />
      </label>
      <label className="s-field" htmlFor="plan-avoid"><span className="s-lab">{t.avoid}</span>
        <input id="plan-avoid" className="s-input" maxLength={200} placeholder={t.avoidPh} value={f.avoid} onChange={(e) => set('avoid', e.target.value)} />
      </label>
      <div className="s-field">
        <span className="s-lab">{t.time}</span>
        <Seg value={f.time} onChange={(v) => set('time', v)} label={t.time} options={(['quick', 'hour', 'half_day'] as const).map((v) => ({ value: v, label: t.times[v] }))} />
      </div>
      <details className="s-field s-card s-pad">
        <summary style={{ cursor: 'pointer', fontWeight: 600 }}>{getPlanRemindersContent(locale).title}</summary>
        <div style={{ paddingTop: 12 }}><PlanReminders /></div>
      </details>
      <AiError text={err} />
      <div className="s-row" style={{ gap: 10, flexWrap: 'wrap' }}>
        <button type="submit" className="s-btn lg" disabled={busy}><Sparkles size={15} />{busy ? c.working : t.submit}</button>
        <span className="s-sub-t" style={{ fontSize: 12.5 }}>{t.remembered}</span>
      </div>
    </form>
  );
}
