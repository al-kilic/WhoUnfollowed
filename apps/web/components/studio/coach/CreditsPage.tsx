'use client';

import { useStudio } from '../StudioContext';
import { PageHead } from '../PageHead';
import { LockBar } from '../Lock';
import { CreditsView } from '../you/CreditsView';
import { getStudioCoachContent } from './studioCoach.content';
import { getYouContent } from '../you/you.content';

// Studio > You > Monthly use: the plain bar, refills and billing (CreditsView).
export function CreditsPage() {
  const { c, locale, hasProAi } = useStudio();
  const k = getStudioCoachContent(locale);
  return (
    <>
      <PageHead title={c.nav.credits} sub={k.sub.you} />
      {hasProAi ? <CreditsView /> : <LockBar feature="coach" text={getYouContent(locale).use.locked} />}
    </>
  );
}
