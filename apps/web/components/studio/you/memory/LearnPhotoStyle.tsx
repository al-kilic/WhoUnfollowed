'use client';

import { useRef, useState } from 'react';
import { Camera, Check, Lock, X } from 'lucide-react';
import { openExportPosts } from '@ig-tracker/core';
import { prepareCover } from '@/app/[locale]/coach/coverImage';
import { filterImages } from '@/lib/imageCheck';
import { useStudio } from '../../StudioContext';
import { getMemoryContent } from './memory.content';
import { getTeachContent } from './teach.content';

const MAX = 24;
const MIN = 6;
type Step = 'idle' | 'reading' | 'review' | 'sending' | 'done' | 'none' | 'error' | 'empty' | 'few';

// "Your photo style": the first photo of the newest posts in the export chosen
// above, or photos the member picks. Shrunk to 768 px in this browser (canvas,
// so no EXIF or location); every photo is shown before anything is sent, and
// photos are used once and never kept. The coach keeps short Photo notes.
export function LearnPhotoStyle({ file, learned, onSaved }: { file: File | null; learned: boolean; onSaved?: () => void }) {
  const { locale } = useStudio();
  const t = getMemoryContent(locale).photo;
  const k = getTeachContent(locale);
  const pick = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>('idle');
  const [photos, setPhotos] = useState<string[]>([]);
  const [saved, setSaved] = useState(0);
  const [skipped, setSkipped] = useState(0);

  async function shrink(blobs: Blob[]): Promise<string[]> {
    const out: string[] = [];
    for (const b of blobs) {
      if (out.length >= MAX) break;
      try { out.push(await prepareCover(new File([b], 'photo.jpg', { type: b.type || 'image/jpeg' }), 768, 0.78)); } catch { /* skip that photo */ }
    }
    return out;
  }

  async function fromExport() {
    if (!file) return;
    setStep('reading'); setSkipped(0);
    try {
      const exp = await openExportPosts(file);
      const blobs: Blob[] = [];
      for (const p of exp.posts) {
        if (blobs.length >= MAX) break;
        const b = p.photos[0] ? await exp.photo(p.photos[0]) : null;
        if (b) blobs.push(b);
      }
      const out = await shrink(blobs);
      if (out.length < MIN) { setStep('none'); return; }
      setPhotos(out); setStep('review');
    } catch { setStep('error'); }
  }

  async function fromFiles(list: FileList | null) {
    if (!list?.length) return;
    setStep('reading');
    const { ok, skipped: n } = await filterImages([...list], MAX);
    setSkipped(n);
    const out = await shrink(ok);
    if (out.length < MIN) { setPhotos(out); setStep('few'); return; }
    setPhotos(out); setStep('review');
  }

  async function send() {
    setStep('sending');
    try {
      const r = await fetch('/api/ai/photo-style', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ photos, locale, platform: 'instagram' }) });
      if (r.status === 402) { setStep('empty'); return; }
      const j = (await r.json().catch(() => null)) as { ok?: boolean; saved?: number } | null;
      if (!r.ok || !j?.ok) { setStep('error'); return; }
      setSaved(j.saved ?? 0); setPhotos([]); setStep('done'); onSaved?.();
    } catch { setStep('error'); }
  }

  const busy = step === 'reading' || step === 'sending';
  return (
    <article className="s-teach-card" aria-labelledby="teach-photo">
      <header className="s-teach-hd">
        <span className="s-teach-ic"><Camera size={16} /></span>
        <span className="s-grow"><b id="teach-photo">{k.photoTitle}</b><span className={`s-teach-st${learned || step === 'done' ? ' on' : ''}`}>{learned || step === 'done' ? <><Check size={12} />{k.photoLearned}</> : k.photoNotYet}</span></span>
      </header>
      <p className="s-teach-what">{k.photoWhat}</p>
      {step !== 'review' && step !== 'sending' && (
        <div className="s-teach-act">
          <button type="button" className="s-btn xs" disabled={!file || busy} title={file ? undefined : k.needExport} onClick={() => void fromExport()}>{k.photoLearn}</button>
          <span className="s-sub-t">{k.or}</span>
          <button type="button" className="s-lnk" disabled={busy} onClick={() => pick.current?.click()}>{k.photosOpen}</button>
          <input ref={pick} type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" multiple hidden aria-label={k.photosPick(MIN, MAX)} onChange={(e) => { void fromFiles(e.target.files); e.target.value = ''; }} />
        </div>
      )}
      {!file && step === 'idle' && <p className="s-teach-hint">{k.needExport}</p>}
      {step === 'reading' && <p className="s-teach-hint"><Lock size={12} />{t.reading}</p>}
      {step === 'none' && <p className="s-teach-hint">{t.none}</p>}
      {step === 'few' && <p role="alert" className="s-teach-err">{k.photosTooFew(MIN)}</p>}
      {skipped > 0 && (step === 'review' || step === 'few') && <p className="s-teach-hint">{k.photosBad}</p>}
      {step === 'done' && <p role="status" className="s-teach-ok">{t.done(saved)}</p>}
      {step === 'empty' && <p role="alert" className="s-teach-err">{t.noCredits}</p>}
      {step === 'error' && <p role="alert" className="s-teach-err">{getMemoryContent(locale).failed}</p>}
      {(step === 'review' || step === 'sending') && (
        <div className="s-col" style={{ gap: 10 }}>
          <div className="s-teach-grid">
            {photos.map((src, i) => (
              <span key={i}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" />
                <button type="button" className="s-icb" aria-label={getMemoryContent(locale).voice.remove} disabled={photos.length <= MIN || step === 'sending'} onClick={() => setPhotos(photos.filter((_, j) => j !== i))}><X size={12} /></button>
              </span>
            ))}
          </div>
          <p className="s-voice-consent"><Lock size={12} />{t.consent}</p>
          <span className="s-row" style={{ gap: 8 }}>
            <button type="button" className="s-btn xs" disabled={step === 'sending'} onClick={() => void send()}>{step === 'sending' ? t.sending : t.send(photos.length)}</button>
            <button type="button" className="s-btn sec xs" disabled={step === 'sending'} onClick={() => { setPhotos([]); setStep('idle'); }}>{getMemoryContent(locale).cancel}</button>
          </span>
        </div>
      )}
    </article>
  );
}
