'use client';

import { useState } from 'react';
import { Check, Lock, Mic, X } from 'lucide-react';
import { contentStats, exportContentMoments, exportMoments, insightsStats, pickVoiceExemplars, readFullExport, snapshotPlatform, voiceStats, type ContentStats, type InsightsStats, type Moment, type VoiceStats } from '@ig-tracker/core';
import { useSnapshotList } from '@/hooks/useSnapshots';
import { PASTE_MIN, splitPastedCaptions } from '@/lib/pastedCaptions';
import { useStudio } from '../../StudioContext';
import { getMemoryContent } from './memory.content';
import { getTeachContent } from './teach.content';

type Ready = { stats: VoiceStats | null; exemplars: string[]; content: ContentStats | null; moments: Moment[]; insights: InsightsStats | null };
type Step = 'idle' | 'reading' | 'review' | 'sending' | 'done' | 'none' | 'error';

// "Your voice": read from the export chosen above (in this browser) or from
// pasted captions. The member sees the exact examples that would be sent, can
// remove any, and nothing goes out until they press Send. Handles, links,
// emails and phone numbers are removed from examples before they leave.
export function LearnVoice({ file, learned }: { file: File | null; learned: boolean }) {
  const { locale, userId } = useStudio();
  const t = getMemoryContent(locale).voice;
  const k = getTeachContent(locale);
  const snaps = useSnapshotList(userId);
  const [step, setStep] = useState<Step>('idle');
  const [ready, setReady] = useState<Ready | null>(null);
  const [filled, setFilled] = useState(0);
  const [paste, setPaste] = useState<string | null>(null);
  const [pasteErr, setPasteErr] = useState(false);

  async function fromExport() {
    if (!file) return;
    setStep('reading');
    try {
      const { content: items, insights: raw } = await readFullExport(file);
      const withText = items.filter((i) => i.caption.trim());
      const clock = { now: Math.floor(Date.now() / 1000), utcOffsetMinutes: -new Date().getTimezoneOffset() };
      const insights = raw.posts.length || raw.stories.length || raw.account ? insightsStats(raw, items, clock) : null;
      if (!withText.length && !insights) { setStep('none'); return; }
      const ig = snaps.filter((s) => snapshotPlatform(s.data) === 'instagram').map((s) => s.data);
      const content = contentStats(items, clock);
      setReady({
        stats: withText.length ? voiceStats(withText.map((i) => i.caption)) : null,
        exemplars: pickVoiceExemplars(withText.map((i) => ({ caption: i.caption, date: i.date }))),
        content, moments: [...exportMoments(ig), ...exportContentMoments(content, insights)], insights,
      });
      setStep('review');
    } catch { setStep('error'); }
  }

  function fromPaste() {
    const captions = splitPastedCaptions(paste ?? '');
    if (captions.length < PASTE_MIN) { setPasteErr(true); return; }
    const now = Math.floor(Date.now() / 1000);
    setReady({ stats: voiceStats(captions), exemplars: pickVoiceExemplars(captions.map((caption, i) => ({ caption, date: now - i * 86_400 }))), content: null, moments: [], insights: null });
    setPaste(null);
    setStep('review');
  }

  async function send() {
    if (!ready) return;
    setStep('sending');
    const json = (url: string, body: unknown) => fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const voice = ready.stats && ready.exemplars.length
      ? json('/api/ai/voice', { consent: true, stats: ready.stats, exemplars: ready.exemplars }).then((r) => r.ok || r.status === 409).catch(() => false)
      : Promise.resolve(true);
    const content = ready.content
      ? json('/api/ai/content-stats', { platform: 'instagram', stats: ready.content, moments: ready.moments, insights: ready.insights })
        .then(async (r) => ({ ok: r.ok, filled: r.ok ? ((await r.json().catch(() => ({}))) as { filled?: number }).filled ?? 0 : 0 })).catch(() => ({ ok: false, filled: 0 }))
      : Promise.resolve({ ok: true, filled: 0 });
    const [a, b] = await Promise.all([voice, content]);
    setFilled(b.filled);
    setStep(a && b.ok ? 'done' : 'error');
  }

  const s = ready?.stats;
  const busy = step === 'reading' || step === 'sending';
  return (
    <article className="s-teach-card" aria-labelledby="teach-voice">
      <header className="s-teach-hd">
        <span className="s-teach-ic"><Mic size={16} /></span>
        <span className="s-grow"><b id="teach-voice">{k.voiceTitle}</b><span className={`s-teach-st${learned || step === 'done' ? ' on' : ''}`}>{learned || step === 'done' ? <><Check size={12} />{k.voiceLearned}</> : k.voiceNotYet}</span></span>
      </header>
      <p className="s-teach-what">{k.voiceWhat}</p>
      {step !== 'review' && step !== 'sending' && (
        <div className="s-teach-act">
          <button type="button" className="s-btn xs" disabled={!file || busy} title={file ? undefined : k.needExport} onClick={() => void fromExport()}>{k.voiceLearn}</button>
          <span className="s-sub-t">{k.or}</span>
          <button type="button" className="s-lnk" onClick={() => { setPaste(paste === null ? '' : null); setPasteErr(false); }}>{k.pasteOpen}</button>
        </div>
      )}
      {!file && step === 'idle' && paste === null && <p className="s-teach-hint">{k.needExport}</p>}
      {paste !== null && step !== 'review' && (
        <div className="s-col" style={{ gap: 8 }}>
          <textarea className="s-teach-paste" rows={5} value={paste} aria-label={k.pasteLabel} placeholder={k.pastePh} maxLength={20_000} onChange={(e) => { setPaste(e.target.value); setPasteErr(false); }} />
          {pasteErr && <span role="alert" className="s-teach-err">{k.pasteTooFew}</span>}
          <span><button type="button" className="s-btn sec xs" disabled={!paste.trim()} onClick={fromPaste}>{k.pasteUse}</button></span>
        </div>
      )}
      {step === 'reading' && <p className="s-teach-hint"><Lock size={12} />{t.reading}</p>}
      {step === 'none' && <p className="s-teach-hint">{t.none}</p>}
      {step === 'done' && <p role="status" className="s-teach-ok">{t.done}{filled > 0 ? ` ${t.filled(filled)}` : ''}</p>}
      {step === 'error' && <p role="alert" className="s-teach-err">{getMemoryContent(locale).failed}</p>}
      {(step === 'review' || step === 'sending') && ready && (
        <div className="s-col" style={{ gap: 10 }}>
          {s && <span className="s-sub-t" style={{ fontSize: 12.5 }}>{t.stats({ captions: s.captions, chars: s.medianChars ?? 0, emoji: s.emojiPerCaption, hashtags: s.hashtagMedian ?? 0, questions: Math.round(s.questionShare * 100) })}</span>}
          {ready.insights && <span className="s-sub-t" style={{ fontSize: 12.5 }}>{t.insights({ stories: ready.insights.stories?.total ?? 0, posts: ready.insights.posts.length, account: !!ready.insights.account })}</span>}
          {s && <span className="s-sub-t" style={{ fontSize: 12.5 }}>{t.found(ready.exemplars.length)}</span>}
          <ul className="s-voice-ex">
            {ready.exemplars.map((x, i) => (
              <li key={i}><span>{x}</span><button type="button" className="s-icb" aria-label={t.remove} title={t.remove} onClick={() => setReady({ ...ready, exemplars: ready.exemplars.filter((_, j) => j !== i) })}><X size={13} /></button></li>
            ))}
          </ul>
          <p className="s-voice-consent"><Lock size={12} />{t.consent}</p>
          <span className="s-row" style={{ gap: 8 }}>
            <button type="button" className="s-btn xs" disabled={step === 'sending' || (!ready.exemplars.length && !ready.insights)} onClick={() => void send()}>{step === 'sending' ? t.sending : ready.exemplars.length ? t.send(ready.exemplars.length) : t.sendNumbers}</button>
            <button type="button" className="s-btn sec xs" disabled={step === 'sending'} onClick={() => { setReady(null); setStep('idle'); }}>{getMemoryContent(locale).cancel}</button>
          </span>
        </div>
      )}
    </article>
  );
}
