'use client';

import { useEffect } from 'react';
import type { HomeCopy } from './copy';
import { AVATARS, HANDLES } from './fx/data';
import { createCtx, shuffle } from './fx/ctx';
import { initDeck, initHeroPointer } from './fx/hero';
import { initProof, initReveals } from './fx/proof';
import { initTools } from './fx/tools';
import { initCoach } from './fx/coach';
import { initFaq, initPricing } from './fx/pricing';
import { initProReel } from './fx/proReel';
import { initFinal, initPrivacy, initVideo } from './fx/media';

const GHOSTS = ['lena.frames', 'oak.and.ash', 'mio.travels', 'rue.studio', 'kaito.film', 'pixel.poet', 'sunday.prints', 'jules.makes'];

// The homepage's motion, on the server-rendered markup: the hero deck and
// counters, the tools window, the coach, the video, privacy, pricing, FAQ.
// Renders nothing. Everything it starts stops when the page unmounts.
export function HomeFx({ locale, t, hooks }: { locale: string; t: HomeCopy['fx']; hooks: string[] }) {
  useEffect(() => {
    const root = document.getElementById('hm');
    if (!root) return;
    root.classList.add('js');
    const x = createCtx(root, locale, t);
    // Sample people: shuffled per visit, each with a real (Pexels) portrait.
    const ppl = { photos: shuffle([...AVATARS]), handles: shuffle([...HANDLES]) };
    initDeck(x, ppl);
    initHeroPointer(x);
    initProof(x);
    initReveals(x);
    initTools(x, ppl);
    initCoach(x, hooks);
    initVideo(x);
    initPrivacy(x);
    initPricing(x, ppl);
    initProReel(x);
    initFaq(x);
    initFinal(x, GHOSTS);
    return () => { x.dispose(); root.classList.remove('js'); };
  }, [locale, t, hooks]);
  return null;
}
