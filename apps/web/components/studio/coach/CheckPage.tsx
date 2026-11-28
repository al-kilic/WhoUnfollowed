'use client';

import { isSampleOn } from '@/lib/sample/sampleMode';
import { getSampleCoach } from '@/lib/sample/coach';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { AiCheck } from '@ig-tracker/core';
import { CircleAlert, Gauge, Image as ImageIcon } from 'lucide-react';
import { getCoachContent } from '@/app/[locale]/coach/content';
import { postAction } from '@/app/[locale]/coach/api';
import { prepareCover } from '@/app/[locale]/coach/coverImage';
import { useStudio } from '../StudioContext';
import { CoachGate } from './CoachGate';
import { FormatSeg, FORMATS, type Format } from './formats';
import { getCreateContent } from './create.content';
import { getStudioCoachContent } from './studioCoach.content';
import { PhotoStrip } from './PhotoStrip';
import { CheckEmpty } from './CreateEmpty';
import { MAX_PHOTOS, usePostPhotos } from '@/hooks/usePostPhotos';
import { Blur, ProPreview, RollingNumber, RollingRing } from './ProPreview';
import { AiError } from './AiError';
import { CheckResult } from './CheckResult';
import { PrecheckList } from './PrecheckList';
import { type Seen } from './CoachSeen';
import { getSampleSeen } from '@/lib/sample/coach/seen';
import { precheck, type PrecheckItem } from '@/lib/ai/precheck';

// Studio > Create > Check a post.
export function CheckPage() {
  const { c: sc, locale, coach, openUpgrade } = useStudio();
  const c = getCoachContent(locale);
  const k = getCreateContent(locale).k;
  const ex = getStudioCoachContent(locale);
  const params = useSearchParams();
  const f0 = params.get('format');
  // Sample mode opens on a draft that was already checked, unless a draft was handed over.
  const [seed] = useState(() => (isSampleOn() && !params.get('hook') && !params.get('caption') ? getSampleCoach(locale).check : null));
  const [format, setFormat] = useState<Format>(seed?.format ?? (FORMATS.includes(f0 as Format) ? (f0 as Format) : 'photo'));
  const [hook, setHook] = useState(seed?.hook ?? params.get('hook') ?? (params.get('caption') ?? '').split('\n')[0] ?? '');
  const [caption, setCaption] = useState(seed?.caption ?? params.get('caption') ?? '');
  const photos = usePostPhotos(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AiCheck | null>(seed?.result ?? null);
  const [seen, setSeen] = useState<Seen | null>(() => (seed ? getSampleSeen() : null));
  const [logId, setLogId] = useState<string | null>(null);
  // The server's rules also know your logged results; until a check runs, the
  // same rules run here as you type, with your posting days.
  const [serverRules, setServerRules] = useState<PrecheckItem[] | null>(null);
  const days = coach.state?.prefs?.days;
  const local = useMemo(() => precheck({ format, hook, caption, postingDays: days ?? [] }), [format, hook, caption, days]);
  const rules = serverRules ?? local;

  async function check(locked: boolean) {
    if (locked) { openUpgrade('create'); return; }
    setBusy(true); setError(null);
    // Only the first photo goes to the check, resized and stripped in the browser, used once.
    const first = photos.blobs[0];
    let cover: string | null = null;
    if (first) { try { cover = await prepareCover(new File([first], 'cover.jpg', { type: first.type || 'image/jpeg' })); } catch { cover = null; } }
    const res = await postAction<AiCheck>('/api/ai/check', { format, hook, caption, coverImage: cover, locale });
    setBusy(false);
    if (!res.ok) { setError(c.errors[res.error as keyof typeof c.errors] ?? c.errors.failed); return; }
    setResult(res.data);
    setSeen(res.seen ?? null);
    setLogId(res.logId || null);
    setServerRules(res.precheck ?? null);
  }

  return (
    <CoachGate title={sc.nav.create} sub={k.sub} feature="create">
      {(state) => {
        const locked = !state;
        return (
          <div className="s-grid s-g2" style={{ alignItems: 'start' }}>
            <section className="s-card">
              <div className="s-hd"><h3 className="s-h3">{k.yourDraft}</h3><FormatSeg value={format} onChange={setFormat} label={c.draft.format} /></div>
              <div className="s-row" style={{ alignItems: 'flex-start', gap: 0 }}>
                <div className="s-col s-pad" style={{ flex: 1, gap: 10 }}>
                  <label className="s-field" htmlFor="k-hook"><span className="s-lab">{c.check.hook}</span>
                    <input id="k-hook" className="s-input" maxLength={300} value={hook} placeholder={c.check.hookPh} onChange={(e) => { setHook(e.target.value); setServerRules(null); }} /></label>
                  <label className="s-field" htmlFor="k-caption"><span className="s-lab">{c.check.caption}</span>
                    <textarea id="k-caption" className="s-input" rows={7} maxLength={2200} value={caption} placeholder={c.check.captionPh} onChange={(e) => { setCaption(e.target.value); setServerRules(null); }} /></label>
                </div>
                <div className="s-pad s-col" style={{ alignItems: 'center', gap: 6, width: 150 }}>
                  {photos.urls[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element -- local object URL preview
                    <div className="s-crop" style={{ position: 'relative' }}><img src={photos.urls[0]} alt="" />{photos.urls.length > 1 && <span className="ig-cnt" style={{ top: 6, right: 6 }}>1/{photos.urls.length}</span>}</div>
                  ) : <div className={`s-noimg f-${format}`} style={{ width: 96, height: 120 }}><ImageIcon size={20} /><small>{k.cover}</small></div>}
                  {format === 'carousel' && photos.urls.length > 1 && <span className="s-sub-t" style={{ fontSize: 11.5, textAlign: 'center' }}>{k.firstSlide}</span>}
                </div>
              </div>
              <div className="s-pad" style={{ paddingTop: 0 }}><PhotoStrip photos={photos} multiple={format === 'carousel'} max={MAX_PHOTOS} swipeNote={false} /></div>
              <div className="s-row s-pad" style={{ justifyContent: 'space-between', flexWrap: 'wrap', borderTop: '1px solid var(--line)' }}>
                <span className="s-sub-t s-row"><ImageIcon size={14} />{k.imageNote}</span>
                <span className="s-row">
                  <button type="button" className="s-btn sec" onClick={() => { setHook(''); setCaption(''); photos.clear(); setResult(null); }}>{k.newDraft}</button>
                  <button type="button" className="s-btn" disabled={busy || (!locked && !hook.trim())} onClick={() => void check(locked)}>
                    <Gauge size={14} />{locked ? ex.unlock : busy ? c.working : k.checkAgain}
                  </button>
                </span>
              </div>
              <AiError text={error} style={{ padding: 16 }} />
            </section>
            <div className="s-col" style={{ gap: 12, minWidth: 0 }}>
            {(hook.trim() || caption.trim()) && <PrecheckList items={rules} free={locked} />}
            {locked ? (
              <ProPreview feature="create" kind="check" visual={<RollingRing lo={34} hi={96} size={104} />}>
                {(['hook', 'clarity', 'value', 'fit_you', 'fit_trend', 'action'] as const).map((cr, i) => (
                  <div key={cr} className="s-pp-row">
                    <span className="s-si" style={{ color: 'var(--faint)' }}><CircleAlert size={17} /></span>
                    <div className="s-col" style={{ gap: 3 }}><b style={{ fontWeight: 600, fontSize: 13.5 }}>{c.check.criteria[cr]}</b><Blur w={`${55 + ((i * 13) % 35)}%`} /></div>
                    <span className="s-sub-t" style={{ fontWeight: 600 }}><RollingNumber lo={3} hi={10} />/10</span>
                  </div>
                ))}
              </ProPreview>
            ) : result ? <CheckResult key={logId ?? 'r'} logId={logId} d={result} onHook={setHook} onCaption={setCaption} seen={seen} post={{ format, hook, caption }} />
              : <CheckEmpty />}
            </div>
          </div>
        );
      }}
    </CoachGate>
  );
}
