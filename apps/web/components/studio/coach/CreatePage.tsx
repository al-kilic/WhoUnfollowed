'use client';

import { isSampleOn } from '@/lib/sample/sampleMode';
import { getSampleCoach } from '@/lib/sample/coach';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { AiDraft } from '@ig-tracker/core';
import { ChevronDown, ChevronUp, Copy, Gauge, RefreshCw, Sparkles } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { getCoachContent } from '@/app/[locale]/coach/content';
import { postAction } from '@/app/[locale]/coach/api';
import { prepareCover } from '@/app/[locale]/coach/coverImage';
import { useStudio } from '../StudioContext';
import { CoachGate } from './CoachGate';
import { PhonePreview } from './PhonePreview';
import { PhotoStrip } from './PhotoStrip';
import { Blur, ProPreview } from './ProPreview';
import { MAX_PHOTOS, usePostPhotos } from '@/hooks/usePostPhotos';
import { FormatSeg, Seg, FORMATS, type Format } from './formats';
import { getCreateContent } from './create.content';
import { getStudioCoachContent } from './studioCoach.content';
import { AiError } from './AiError';
import { CoachSeen, type Seen } from './CoachSeen';
import { AnswerThumbs } from './AnswerThumbs';
import { sendDraftUse } from '@/lib/ai/signalClient';
import { getSampleSeen } from '@/lib/sample/coach/seen';

type Kind = 'hook' | 'caption' | 'script';
type Tone = 'voice' | 'warmer' | 'bolder';
type Len = 'short' | 'medium' | 'long';
const LIMIT = 2200; // Instagram's caption limit

interface Earlier { id: string; topic: string | null; format: string | null; createdAt: string; text: string }

function EarlierDrafts({ refresh }: { refresh: number }) {
  const { locale } = useStudio();
  const w = getCreateContent(locale).w;
  const c = getCoachContent(locale);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Earlier[] | null>(null);
  useEffect(() => {
    let alive = true;
    void fetch('/api/ai/content?kind=draft', { cache: 'no-store' }).then(async (r) => { if (r.ok && alive) setItems(((await r.json()) as { items: Earlier[] }).items); });
    return () => { alive = false; };
  }, [refresh]);
  const fmt = (iso: string) => new Date(iso).toLocaleDateString(locale, { day: 'numeric', month: 'short' });
  return (
    <section className="s-card" style={{ marginTop: 8 }}>
      <button type="button" className="s-hd" style={{ width: '100%', border: 0, background: 'none', color: 'var(--ink)', cursor: 'pointer', font: 'inherit' }} onClick={() => setOpen(!open)} aria-expanded={open}>
        <h3 className="s-h3">{w.earlier}</h3><span className="s-row s-sub-t">{items?.length ?? ''}{open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}</span>
      </button>
      {open && <div className="s-hist">{items?.length ? items.map((d) => <div key={d.id}><span>{d.text || d.topic}</span><span>{d.format ? `${c.formats[d.format as Format] ?? d.format} · ` : ''}{fmt(d.createdAt)}</span></div>) : <div><span>{w.noEarlier}</span></div>}</div>}
    </section>
  );
}

// Studio > Create > Write: controls, the options to pick from, and the phone.
export function CreatePage() {
  const { c: sc, locale, coach, openUpgrade } = useStudio();
  const c = getCoachContent(locale);
  const w = getCreateContent(locale).w;
  const k = getStudioCoachContent(locale);
  const params = useSearchParams();
  // Sample mode opens on a draft already written for the made-up account.
  const [seed] = useState(() => (isSampleOn() && !params.get('topic') ? getSampleCoach(locale).draft : null));
  const [seen, setSeen] = useState<Seen | null>(() => (seed ? getSampleSeen() : null));
  const initialFormat = params.get('format');
  // An idea for a Reel opens on the Reel script; everything else on the caption.
  const [kind, setKind] = useState<Kind>(initialFormat === 'reel' && params.get('topic') ? 'script' : 'caption');
  const [format, setFormat] = useState<Format>(FORMATS.includes(initialFormat as Format) ? (initialFormat as Format) : 'carousel');
  const [topic, setTopic] = useState(seed?.topic ?? params.get('topic') ?? '');
  const [tone, setTone] = useState<Tone>('voice');
  const [len, setLen] = useState<Len>('medium');
  // Start from the defaults in You > Settings once they load (until the member picks).
  const prefs = coach.state?.prefs;
  const touched = useRef(false);
  useEffect(() => { if (prefs && !touched.current) { setTone(prefs.tone); setLen(prefs.length); } }, [prefs]);
  const [opts, setOpts] = useState<string[]>(() => seed?.options.map((o) => o.text) ?? []);
  // What the coach wrote, to tell later edits apart (signals for the coach to learn from).
  const orig = useRef<string[]>(opts);
  const [logId, setLogId] = useState<string | null>(null);
  const [sel, setSel] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [refresh, setRefresh] = useState(0);
  // Kept in memory for this page only (Create is not tied to a planned post).
  const photos = usePostPhotos(null);

  const generate = useCallback(async (locked: boolean) => {
    if (locked) { openUpgrade('create'); return; }
    if (!topic.trim()) return;
    setBusy(true); setError(null);
    // Up to 4 of the photos in the preview, resized and stripped here first.
    const images: string[] = [];
    for (const b of photos.blobs.slice(0, 4)) { try { images.push(await prepareCover(new File([b], 'photo.jpg', { type: b.type || 'image/jpeg' }))); } catch { /* skip that photo */ } }
    const res = await postAction<AiDraft>('/api/ai/draft', { kind, format, topic, tone, length: len, locale, images });
    setBusy(false);
    if (!res.ok) { setError(c.errors[res.error as keyof typeof c.errors] ?? c.errors.failed); return; }
    setSeen(res.seen ?? null);
    setOpts(res.data.options.map((o) => o.text));
    orig.current = res.data.options.map((o) => o.text);
    setLogId(res.logId || null);
    setSel(0);
    setRefresh((n) => n + 1);
  }, [kind, format, topic, tone, len, locale, c, openUpgrade, photos.blobs]);

  return (
    <CoachGate title={sc.nav.create} sub={w.sub} feature="create">
      {(state) => {
        const locked = !state;
        const shown = opts;
        const text = shown[sel] ?? '';
        return (
          <div className="s-gwrite3">
            <section className="s-card s-pad s-col ctl" style={{ gap: 16 }}>
              <div className="s-field"><span className="s-lab">{c.draft.kind}</span>
                <Seg value={kind} onChange={setKind} label={c.draft.kind} options={(['hook', 'caption', 'script'] as const).map((v) => ({ value: v, label: c.draft.kinds[v] }))} /></div>
              <div className="s-field"><span className="s-lab">{c.draft.format}</span><FormatSeg value={format} onChange={setFormat} label={c.draft.format} /></div>
              <label className="s-field" htmlFor="w-topic"><span className="s-lab">{c.draft.topic}</span>
                <textarea id="w-topic" className="s-input" rows={2} maxLength={300} value={topic} placeholder={c.draft.topicPh} onChange={(e) => setTopic(e.target.value)} /></label>
              <div className="s-field"><span className="s-lab">{w.tone}</span>
                <Seg value={tone} onChange={(v) => { touched.current = true; setTone(v); }} label={w.tone} options={(['voice', 'warmer', 'bolder'] as const).map((v) => ({ value: v, label: w.tones[v] }))} /></div>
              <div className="s-field"><span className="s-lab">{w.length}</span>
                <Seg value={len} onChange={(v) => { touched.current = true; setLen(v); }} label={w.length} options={(['short', 'medium', 'long'] as const).map((v) => ({ value: v, label: w.lengths[v] }))} /></div>
              <div className="s-field"><span className="s-lab">{w.previewWith}</span>
                <PhotoStrip photos={photos} multiple={format === 'carousel'} max={MAX_PHOTOS} />
              </div>
              <button type="button" className="s-btn lg wide" disabled={busy || (!locked && !topic.trim())} onClick={() => void generate(locked)}>
                <Sparkles size={15} />{locked ? k.unlock : busy ? c.working : w.write3}
              </button>
              <AiError text={error} />
            </section>

            <div className="s-col" style={{ gap: 10, minWidth: 0 }}>
              <div className="s-row" style={{ justifyContent: 'space-between' }}><h3 className="s-h3">{w.options}</h3><span className="s-sub-t">{w.tones[tone]} · {w.lengths[len].toLowerCase()}</span></div>
              {locked ? (
                <ProPreview feature="create" kind="write">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="s-pp-row" style={{ gridTemplateColumns: '22px minmax(0, 1fr)' }}>
                      <span className="s-sub-t" style={{ fontWeight: 600 }}>{i + 1}</span>
                      <Blur w={`${60 + i * 12}%`}>{k.exampleDraft.text}</Blur>
                    </div>
                  ))}
                </ProPreview>
              ) : busy ? [0, 1, 2].map((i) => <div key={i} className="s-opt s-pad s-col"><span className="s-shim" style={{ width: '80%' }} /><span className="s-shim" style={{ width: '55%' }} /></div>)
                : shown.length === 0 ? <p className="s-sub-t" style={{ margin: 0 }}>{w.empty}</p>
                : shown.map((t, i) => i === sel ? (
                  <div key={i} className="s-opt on">
                    <button type="button" onClick={() => setSel(i)}><span className="n">{i + 1}</span><span className="s-lab" style={{ paddingTop: 1 }}>{w.selected}</span></button>
                    <div className="ed">
                      <textarea rows={kind === 'hook' ? 2 : kind === 'script' ? 6 : 7} value={t} readOnly={locked} aria-label={k.phone.option(i + 1)}
                        onChange={(e) => setOpts(opts.map((o, j) => (j === i ? e.target.value : o)))} />
                      <div className="s-row" style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
                        <span className="s-meta"><span className={t.length > LIMIT ? 'over' : 'ok'}>{w.chars(t.length, LIMIT)}</span>{t.length > LIMIT && <span className="over">{w.tooLong}</span>}</span>
                        {!locked && (
                          <span className="s-row">
                            <button type="button" className="s-btn sec xs" disabled={busy} onClick={() => void generate(false)}><RefreshCw size={13} />{w.redo}</button>
                            <button type="button" className="s-btn sec xs" onClick={() => { sendDraftUse({ option: i, of: shown.length, original: orig.current[i] ?? '', used: t, contentLogId: logId }); void navigator.clipboard?.writeText(t).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }); }}><Copy size={13} />{copied ? c.copied : c.copy}</button>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div key={i} className="s-opt"><button type="button" onClick={() => setSel(i)}><span className="n">{i + 1}</span><p>{t.split('\n')[0]}</p></button></div>
                ))}
              {!locked && text && (
                <div className="s-row" style={{ marginTop: 4 }}>
                  <Link href={`/app/create/check?${kind === 'hook' ? 'hook' : 'caption'}=${encodeURIComponent(text)}&format=${format}`} className="s-btn sec" onClick={() => sendDraftUse({ option: sel, of: shown.length, original: orig.current[sel] ?? '', used: text, contentLogId: logId })}><Gauge size={14} />{w.checkIt}</Link>
                </div>
              )}
              {!locked && text && <CoachSeen seen={seen} />}
              {!locked && text && <AnswerThumbs key={refresh} action="draft" logId={logId} />}
              {!locked && <EarlierDrafts refresh={refresh} />}
            </div>

            <div className="ip-wrap">
              <PhonePreview format={format} text={locked ? k.exampleDraft.text : text} blurText={locked} photos={photos.urls} account={k.phone.account} labels={k.phone} onAdd={locked ? undefined : (f) => void photos.add(f)} />
            </div>
          </div>
        );
      }}
    </CoachGate>
  );
}
