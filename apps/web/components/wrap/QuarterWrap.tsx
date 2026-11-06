'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ParsedSnapshot, QuarterWrap as Wrap } from '@ig-tracker/core';
import { T } from '@/components/landing/tokens';
import type { AppLocale } from '@/i18n/routing';
import { useRouter } from '@/i18n/navigation';
import { PLATFORM_NAME, snapshotPlatform } from '@/lib/platform';
import { useVerdict } from '@/hooks/useVerdict';
import { Events, track, trackUpgradeClick } from '@/lib/analytics';
import { fmt } from '@/components/tools/ToolCard';
import { OrbitField } from './OrbitField';
import { buildSlides, dayLabel, pill, pillPrimary } from './WrapSlides';
import { drawWrapImage } from './wrapImage';
import { getWrapContent } from './wrap.content';

// Full-screen 3-month wrap that plays before the Radar. Free for everyone:
// counts only. Taps that would show names go to the Radar (Pro) or pricing.
export function QuarterWrap({ w, current, previous, locale, isPro, onClose }: {
  w: Wrap; current: ParsedSnapshot; previous?: ParsedSnapshot | undefined; locale: AppLocale; isPro: boolean; onClose: () => void;
}) {
  const c = getWrapContent(locale);
  const router = useRouter();
  const v = useVerdict(current, previous, locale, 'radar');
  const app = PLATFORM_NAME[snapshotPlatform(current)];
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [saved, setSaved] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  // A long press pauses; letting go after it must not also count as a tap.
  const downAt = useRef(0);
  const tap = (n: number) => { if (performance.now() - downAt.current < 300) go(n); };
  useEffect(() => { setCanShare(typeof navigator.share === 'function'); box.current?.focus(); }, []);

  // Lock the page behind the story.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);


  const image = useCallback(() => drawWrapImage({
    kicker: c.image.title(app), title: c.image.title(app), range: c.range(dayLabel(w.start, locale), dayLabel(w.end, locale)),
    big: fmt(w.arrived, locale), bigLabel: c.image.arrived,
    stats: [{ label: c.image.followed, value: fmt(w.followsMade, locale) }, { label: c.image.back, value: fmt(w.followsBack, locale) }],
    verdict: v.name, weeks: w.weeks, footer: c.image.footer,
  }), [app, c, locale, v.name, w]);

  const save = async () => {
    track(Events.wrapShare, { action: 'save' });
    const url = URL.createObjectURL(await image());
    const a = document.createElement('a');
    a.href = url; a.download = 'my-3-month-wrap.png'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    setSaved(true);
  };
  const share = async () => {
    track(Events.wrapShare, { action: 'share' });
    try {
      const file = new File([await image()], 'my-3-month-wrap.png', { type: 'image/png' });
      if (navigator.canShare?.({ files: [file] })) await navigator.share({ files: [file] }); else await save();
    } catch { /* share sheet cancelled */ }
  };

  const onPro = (what: 'follows' | 'left') => {
    track(Events.wrapProTap, { what, pro: isPro });
    if (!isPro) { trackUpgradeClick('wrap'); router.push('/pricing'); return; }
    onClose();
    if (what === 'left') router.push('/diff');
    else setTimeout(() => document.getElementById('radar')?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  const shareRow = (
    <div style={{ display: 'flex', gap: 8, marginTop: 26, flexWrap: 'wrap' }}>
      {canShare && <button type="button" style={pillPrimary} onClick={share}>{c.shareCard}</button>}
      <button type="button" style={canShare ? pill : pillPrimary} onClick={save}>{saved ? c.saved : c.saveCard}</button>
    </div>
  );
  const slides = buildSlides({ w, c, locale, app, isPro, verdict: { name: v.name, line: v.line }, onPro, onStart: () => setI(1), onClose, onReplay: () => setI(0), share: shareRow });
  const last = slides.length - 1;
  const slide = slides[Math.min(i, last)]!;
  const go = useCallback((n: number) => setI(Math.max(0, Math.min(last, n))), [last]);
  useEffect(() => { if (i === last) track(Events.wrapCompleted, { screens: slides.length }); }, [i, last, slides.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') go(i + 1);
      else if (e.key === 'ArrowLeft') go(i - 1);
      else if (e.key === ' ' && slide.dur > 0) { e.preventDefault(); setPaused(p => !p); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, i, onClose, slide.dur]);

  return (
    <div ref={box} role="dialog" aria-modal="true" aria-label={c.aria} tabIndex={-1}
      onPointerDown={e => { if ((e.target as HTMLElement).closest('.wu-slide button, [data-chrome]')) return; downAt.current = performance.now(); setPaused(true); }}
      onPointerUp={() => setPaused(false)} onPointerLeave={() => setPaused(false)}
      style={{ position: 'fixed', inset: 0, zIndex: 1100, background: `radial-gradient(90% 80% at 72% 40%, ${slide.tint}, #050f10 75%)`, color: '#F4F0E8', fontFamily: T.sans, transition: 'background 0.8s', outline: 'none', userSelect: 'none', overflow: 'hidden' }}>
      <OrbitField mutuals={v.stats.mutuals} fans={v.stats.fans} oneWay={v.stats.oneWay} hot={w.arrived} weeks={w.weeks} mode={slide.mode} />
      <style>{'@keyframes wu-fill { from { transform: scaleX(0) } to { transform: scaleX(1) } } @keyframes wu-in { from { opacity: 0; transform: translateY(22px) } to { opacity: 1; transform: none } } .wu-slide > * { animation: wu-in .7s cubic-bezier(.2,.75,.2,1) both } .wu-slide > *:nth-child(2) { animation-delay: .12s } .wu-slide > *:nth-child(3) { animation-delay: .3s } .wu-slide > *:nth-child(4) { animation-delay: .5s } .wu-slide > *:nth-child(5) { animation-delay: .7s } .wu-reveal { animation: wu-rev 1s cubic-bezier(.2,.8,.2,1) .5s both !important } @keyframes wu-rev { from { opacity: 0; filter: blur(12px); transform: scale(.92) } to { opacity: 1; filter: none; transform: none } } @media (prefers-reduced-motion: reduce) { .wu-slide > *, .wu-reveal { animation: none !important } }'}</style>

      {/* Progress: the active bar's animation end advances the story. */}
      <div style={{ position: 'absolute', top: 'calc(14px + env(safe-area-inset-top, 0px))', left: 'max(16px, env(safe-area-inset-left, 0px))', right: 'max(16px, env(safe-area-inset-right, 0px))', display: 'flex', gap: 4, zIndex: 3 }}>
        {slides.map((s, j) => (
          <span key={s.key} style={{ flex: 1, height: 3, borderRadius: 3, background: 'rgba(255,255,255,.22)', overflow: 'hidden' }}>
            <span key={j === i ? `on-${i}` : 'off'} onAnimationEnd={j === i && s.dur > 0 ? () => go(i + 1) : undefined} style={{
              display: 'block', height: '100%', background: '#fff', transformOrigin: 'left',
              transform: j < i || (j === i && s.dur === 0) ? 'scaleX(1)' : 'scaleX(0)',
              animation: j === i && s.dur > 0 ? `wu-fill ${s.dur}ms linear forwards` : 'none',
              animationPlayState: paused ? 'paused' : 'running',
            }} />
          </span>
        ))}
      </div>
      <div style={{ position: 'absolute', top: 'calc(30px + env(safe-area-inset-top, 0px))', left: 'max(16px, env(safe-area-inset-left, 0px))', right: 'max(16px, env(safe-area-inset-right, 0px))', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 3, fontFamily: T.mono, fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(244,240,232,.6)' }} data-chrome>
        <span>{c.kicker(app)}</span>
        <button type="button" onClick={onClose} style={{ ...pill, padding: '7px 12px', fontSize: 11, fontFamily: T.mono, letterSpacing: '0.1em' }}>{i === last ? c.close : c.skip} ✕</button>
      </div>

      {/* Tap zones sit under the text; only the buttons take clicks there. */}
      {slide.dur > 0 && <>
        <div aria-hidden="true" onClick={() => tap(i - 1)} style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '30%', zIndex: 1, cursor: 'w-resize' }} />
        <div aria-hidden="true" onClick={() => tap(i + 1)} style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '70%', zIndex: 1, cursor: 'e-resize' }} />
      </>}

      <div className="flex items-end md:items-center" style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', padding: 'calc(80px + env(safe-area-inset-top, 0px)) max(20px, env(safe-area-inset-right, 0px)) calc(40px + env(safe-area-inset-bottom, 0px)) max(20px, env(safe-area-inset-left, 0px))' }}>
        <div key={slide.key} className="wu-slide" style={{ maxWidth: 620, width: '100%', marginLeft: 'clamp(0px, 6vw, 96px)', pointerEvents: 'none' }}>
          {slide.body}
        </div>
      </div>
      <style>{'.wu-slide button { pointer-events: auto }'}</style>
    </div>
  );
}
