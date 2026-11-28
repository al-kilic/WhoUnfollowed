'use client';

import type { ReactNode } from 'react';
import { T } from '@/components/landing/tokens';
import { getCoachContent } from '@/app/[locale]/coach/content';
import { Onboarding } from '@/app/[locale]/coach/Onboarding';
import type { CoachState } from '@/app/[locale]/coach/api';
import { useStudio } from '../StudioContext';
import { PageHead } from '../PageHead';
import { LockChip } from '../Lock';
import type { SheetFeature } from '../studio.content';

// Every coach page in Studio. With Pro AI: waits for the coach state and runs
// onboarding first. Without it: renders the page in its locked form (state is
// null) with a Pro AI chip in the title row, so it is clear before any click.
export function CoachGate({ title, sub, feature, actions, children }: {
  title: string; sub: string; feature: SheetFeature; actions?: ReactNode;
  children: (state: CoachState | null) => ReactNode;
}) {
  const { hasProAi, coach, locale } = useStudio();
  const c = getCoachContent(locale);
  const head = <PageHead title={title} sub={sub} actions={hasProAi ? actions : <LockChip feature={feature} />} />;

  if (!hasProAi) return <>{head}{children(null)}</>;
  if (!coach.state) return <>{head}<p role="status" style={{ color: T.inkDim, fontSize: 14 }}>{coach.activating ? c.activating : c.working}</p></>;
  if (!coach.state.onboarded) return <>{head}<Onboarding c={c} locale={locale} onDone={() => void coach.reload()} /></>;
  return <>{head}{children(coach.state)}</>;
}
