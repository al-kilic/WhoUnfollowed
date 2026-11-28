'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useStudio } from '../StudioContext';
import { FormatBadge, FORMATS, type Format } from './formats';
import { getPostedContent } from './posted.content';
import { getPostedV2 } from './postedV2.content';
import type { PostedItem } from './postedMath';

type Key = 'newFollowers' | 'saves' | 'likes' | 'shares' | 'comments' | 'reach';
const KEYS: Key[] = ['newFollowers', 'saves', 'likes', 'shares', 'comments', 'reach'];
const post = (body: unknown) => fetch('/api/ai/content', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).catch(() => null);

// How a post did. Every number is optional; new followers and saves first.
export function ResultForm({ item, onDone }: { item: PostedItem; onDone: () => void }) {
  const { locale } = useStudio();
  const t = getPostedContent(locale);
  const v = getPostedV2(locale);
  const label: Record<Key, string> = { newFollowers: t.newFollowers, saves: t.saves, likes: t.likes, shares: v.shares, comments: v.comments, reach: v.reach };
  const [nums, setNums] = useState<Partial<Record<Key, string>>>(() => Object.fromEntries(KEYS.map((k) => [k, item.results?.[k] !== undefined ? String(item.results[k]) : ''])));
  const [busy, setBusy] = useState(false);
  async function save() {
    setBusy(true);
    const results = Object.fromEntries(Object.entries(nums).filter(([, x]) => x !== '' && x !== undefined).map(([k, x]) => [k, Number(x)]));
    const r = await post({ id: item.id, results });
    setBusy(false);
    if (r?.ok) onDone();
  }
  return (
    <form className="s-row" style={{ gap: 6, flexWrap: 'wrap' }} onSubmit={(e) => { e.preventDefault(); void save(); }}>
      {KEYS.map((k) => <input key={k} className="s-input sm" style={{ width: 118 }} aria-label={label[k]} placeholder={label[k]} inputMode="numeric" value={nums[k] ?? ''} onChange={(e) => setNums((p) => ({ ...p, [k]: e.target.value.replace(/\D/g, '') }))} />)}
      <button type="submit" className="s-btn xs" disabled={busy}>{t.save}</button>
    </form>
  );
}

// Logging a post in two taps: the format, then Log it. Title and date are
// optional; without a title it is named after the format and the day.
export function QuickAdd({ onDone, platform }: { onDone: (id: string) => void; platform: string }) {
  const { locale } = useStudio();
  const v = getPostedV2(locale);
  const [format, setFormat] = useState<Format>('carousel');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [busy, setBusy] = useState(false);
  async function save() {
    setBusy(true);
    const day = date || new Date().toISOString().slice(0, 10);
    const name = title.trim().length >= 2 ? title.trim() : v.autoTitle(v.fmt[format], new Date(`${day}T12:00:00Z`).toLocaleDateString(locale, { day: 'numeric', month: 'short' }));
    const r = await post({ add: { format, title: name, platform, date: day } });
    const j = r?.ok ? ((await r.json()) as { id?: string }) : null;
    setBusy(false);
    if (j?.id) { setTitle(''); setDate(''); onDone(j.id); }
  }
  return (
    <form className="s-card s-pad s-col" style={{ gap: 10 }} onSubmit={(e) => { e.preventDefault(); void save(); }}>
      <div><b style={{ fontWeight: 600 }}>{v.quickTitle}</b><div className="s-sub-t" style={{ fontSize: 12.5 }}>{v.quickHint}</div></div>
      <div className="s-pquick" role="radiogroup" aria-label={v.quickTitle}>
        {FORMATS.map((f) => (
          <button key={f} type="button" role="radio" aria-checked={format === f} className={`s-chip2${format === f ? ' on' : ''}`} onClick={() => setFormat(f)}>
            <FormatBadge format={f} />
          </button>
        ))}
      </div>
      <div className="s-pquick">
        <input className="s-input" style={{ flex: '1 1 200px' }} maxLength={120} aria-label={v.titleOpt} placeholder={v.titleOpt} value={title} onChange={(e) => setTitle(e.target.value)} />
        <input className="s-input" style={{ flex: '0 1 160px' }} type="date" aria-label={v.when} max={new Date().toISOString().slice(0, 10)} value={date} onChange={(e) => setDate(e.target.value)} />
        <button type="submit" className="s-btn" disabled={busy}><Plus size={14} />{v.logIt}</button>
      </div>
    </form>
  );
}
