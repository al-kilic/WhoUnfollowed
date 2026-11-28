'use client';

import '@/styles/ask-attach.css';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { CalendarDays, FileBarChart2, Gauge, ImagePlus, Plus, Radar, ScanEye, Target, X } from 'lucide-react';
import { snapshotPlatform, PLATFORM_NAME } from '@/lib/platform';
import type { useAskAttachments } from './useAskAttachments';
import { getAskAttachContent } from './askAttach.content';

type Att = ReturnType<typeof useAskAttachments>;

// The + button in Ask coach: attach photos, an export report or other Studio
// data to the next question. Closes on Escape or a click outside.
export function AskAttachButton({ att, locale, disabled }: { att: Att; locale: string; disabled?: boolean }) {
  const t = getAskAttachContent(locale);
  const [open, setOpen] = useState(false);
  const [reports, setReports] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const file = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === 'Escape' : !box.current?.contains(e.target as Node)) { setOpen(false); setReports(false); }
    };
    document.addEventListener('mousedown', close); document.addEventListener('keydown', close);
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', close); };
  }, [open]);
  const pick = (fn: () => void | Promise<void>) => { setOpen(false); setReports(false); void fn(); };
  const item = (icon: ReactNode, label: string, onClick: () => void, hint?: string) => (
    <button type="button" role="menuitem" className="s-att-i" onClick={onClick}>{icon}<span><b>{label}</b>{hint && <small>{hint}</small>}</span></button>
  );

  return (
    <div className="s-att" ref={box}>
      <button type="button" className="s-ib s-att-b" aria-label={t.add} title={t.add} aria-haspopup="menu" aria-expanded={open} disabled={disabled} onClick={() => setOpen((o) => !o)}><Plus size={17} /></button>
      <input ref={file} type="file" accept="image/*" multiple hidden aria-label={t.photo} onChange={(e) => { void att.addPhotos(e.target.files); e.target.value = ''; }} />
      {open && (
        <div className="s-att-m" role="menu" aria-label={t.menu}>
          {reports ? att.exports.slice(0, 6).map((r) => item(<FileBarChart2 size={15} />, t.exportOf(PLATFORM_NAME[snapshotPlatform(r.data)], att.date(r.data.exportedAt)), () => pick(() => att.addReport(r))))
            : <>
              {item(<ImagePlus size={15} />, t.photo, () => pick(() => file.current?.click()), t.photoHint)}
              {att.exports.length > 0 && item(<FileBarChart2 size={15} />, t.report, () => setReports(true), t.reportHint)}
              {item(<CalendarDays size={15} />, t.plan, () => pick(() => att.add('plan')))}
              {item(<Target size={15} />, t.goal, () => pick(() => att.add('goal')))}
              {item(<ScanEye size={15} />, t.insights, () => pick(() => att.add('insights')))}
              {item(<Gauge size={15} />, t.check, () => pick(() => att.add('check')))}
              {att.exports.length > 0 && item(<Radar size={15} />, t.radar, () => pick(() => att.add('radar')))}
            </>}
        </div>
      )}
    </div>
  );
}

// What is attached to the next question, each removable.
export function AskAttachChips({ att, locale }: { att: Att; locale: string }) {
  const t = getAskAttachContent(locale);
  if (!att.photos.length && !att.context.length && !att.note) return null;
  return (
    <div className="s-att-chips">
      {att.photos.map((p, i) => (
        <span key={p.thumb} className="s-att-c ph">
          {/* eslint-disable-next-line @next/next/no-img-element -- a local preview of the member's own photo */}
          <img src={p.thumb} alt={t.labels.photo(i + 1)} />
          <button type="button" aria-label={t.remove(t.labels.photo(i + 1))} onClick={() => att.removePhoto(i)}><X size={11} /></button>
        </span>
      ))}
      {att.context.map((c) => (
        <span key={c.label} className="s-att-c"><span>{c.label}</span><button type="button" aria-label={t.remove(c.label)} onClick={() => att.removeContext(c.label)}><X size={11} /></button></span>
      ))}
      {att.note ? <span className="s-att-n" role="status">{att.note}</span> : <span className="s-att-n">{t.privacy}</span>}
    </div>
  );
}
