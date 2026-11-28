'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useAuth } from '@/components/AuthProvider';
import type { AppLocale } from '@/i18n/routing';
import { trackUpgradeClick } from '@/lib/analytics';
import { getStudioContent, type SheetFeature, type StudioContent } from './studio.content';
import { UpgradeSheet } from './UpgradeSheet';
import { useCoachState } from '@/app/[locale]/coach/useCoachState';
import { useSampleOn } from '@/lib/sample/sampleMode';

import { studioTier, type StudioTier } from './tier';
export type { StudioTier };

interface StudioValue {
  locale: AppLocale;
  c: StudioContent;
  tier: StudioTier;
  // True when the Radar, compare and History parts are unlocked (Pro or Pro AI).
  hasPro: boolean;
  hasProAi: boolean;
  // The signed-in member really has Pro AI (hasProAi is also true in sample
  // mode, which shows every Pro AI screen unlocked on the made-up account).
  memberProAi: boolean;
  userId: string | null;
  // Pro AI state (credits, onboarding, latest read). Null until loaded, and
  // never requested without Pro AI.
  coach: ReturnType<typeof useCoachState>;
  openUpgrade: (feature: SheetFeature) => void;
  // Where Studio dialogs render, so they keep Studio's styles.
  portal: HTMLElement | null;
}

const Ctx = createContext<StudioValue | null>(null);

export function StudioProvider({ locale, children }: { locale: AppLocale; children: ReactNode }) {
  const auth = useAuth();
  const [sheet, setSheet] = useState<SheetFeature | null>(null);
  // The sheet's portal lands inside the .studio wrapper so it gets Studio's styles.
  const [portal, setPortal] = useState<HTMLDivElement | null>(null);
  // Right after checkout (?welcome=1) the webhook may not have landed when the
  // page renders, so ask for the coach state anyway; it retries until active.
  const [justPaid, setJustPaid] = useState(false);
  useEffect(() => { setJustPaid(new URLSearchParams(window.location.search).get('welcome') === '1'); }, []);
  // Sample mode shows Pro AI fully unlocked on the made-up account. Its coach
  // calls are answered in the browser (lib/sample/sampleIntercept.ts), so it
  // never reaches the AI API or spends anything.
  const sample = useSampleOn();
  const coach = useCoachState(auth.hasProAi || justPaid || sample, sample ? 'sample' : 'real');
  const { tier, hasProAi: realProAi } = studioTier(auth, !sample && coach.state !== null);
  const hasProAi = realProAi || sample;

  // The sheet only ever opens from a click, never on page load.
  const openUpgrade = useCallback((feature: SheetFeature) => {
    trackUpgradeClick(`studio-${feature}`);
    setSheet(feature);
  }, []);

  const value = useMemo<StudioValue>(() => ({
    locale,
    c: getStudioContent(locale),
    tier,
    // The made-up sample account shows every non-AI part, unlocked.
    hasPro: sample || tier === 'pro' || tier === 'proAi',
    hasProAi,
    memberProAi: realProAi,
    userId: auth.userId,
    coach,
    openUpgrade,
    portal,
  }), [locale, tier, hasProAi, realProAi, sample, auth.userId, coach, openUpgrade, portal]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <div ref={setPortal} />
      <UpgradeSheet feature={sheet} onClose={() => setSheet(null)} container={portal} />
    </Ctx.Provider>
  );
}

export function useStudio(): StudioValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useStudio must be used inside <StudioProvider>');
  return v;
}
