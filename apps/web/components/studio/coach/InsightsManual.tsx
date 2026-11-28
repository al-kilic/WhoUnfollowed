'use client';

import { X } from 'lucide-react';
import { useStudio } from '../StudioContext';
import { getInsightsContent } from './insights.content';

export const NUMS = ['likes', 'comments', 'saves', 'shares', 'reach'] as const;
export type Num = (typeof NUMS)[number];
export interface Row { id: number; file: File | null; url: string | null; place: string; date: string; caption: string; n: Record<Num, string>; key?: string }
export const blank = (id: number): Row => ({ id, file: null, url: null, place: '', date: '', caption: '', n: { likes: '', comments: '', saves: '', shares: '', reach: '' } });
export const toNum = (s: string) => { const v = Number(s.replace(/[^\d]/g, '')); return s.trim() && Number.isFinite(v) ? v : null; };

// One post added by hand: its photo, where and when, and Instagram's numbers.
export function InsightsRow({ r, n, set, remove }: { r: Row; n: number; set: (id: number, p: Partial<Row>) => void; remove: (r: Row) => void }) {
  const { locale } = useStudio();
  const t = getInsightsContent(locale);
  return (
    <div className="s-ins-row">
      {/* eslint-disable-next-line @next/next/no-img-element -- local object URL from this browser */}
      {r.url ? <img src={r.url} alt="" /> : <span className="s-noimg" style={{ width: 52, height: 65, borderRadius: 7 }} />}
      <div className="s-col" style={{ gap: 6, minWidth: 0, flex: 1 }}>
        <div className="s-row" style={{ gap: 6, flexWrap: 'wrap' }}>
          <b style={{ fontWeight: 600, fontSize: 13 }}>P{n}</b>
          <input className="s-input sm" id={`ins-place-${r.id}`} aria-label={t.place} placeholder={t.place} maxLength={80} value={r.place} onChange={(e) => set(r.id, { place: e.target.value })} style={{ flex: '1 1 140px' }} />
          <input className="s-input sm" id={`ins-date-${r.id}`} aria-label={t.date} type="date" value={r.date} onChange={(e) => set(r.id, { date: e.target.value })} style={{ flex: '0 1 150px' }} />
        </div>
        <div className="s-ins-nums">
          {NUMS.map((k) => <label key={k}><span>{t[k]}</span><input className="s-input sm" inputMode="numeric" id={`ins-${k}-${r.id}`} value={r.n[k]} onChange={(e) => set(r.id, { n: { ...r.n, [k]: e.target.value.replace(/[^\d.,]/g, '') } })} /></label>)}
        </div>
      </div>
      <button type="button" className="s-ib" aria-label={`${t.remove}: P${n}`} onClick={() => remove(r)}><X size={14} /></button>
    </div>
  );
}
