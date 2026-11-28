'use client';

import { useMemo, useState } from 'react';
import { exportStats } from '@ig-tracker/core';
import { Check, LayoutDashboard, RotateCcw, Sparkles } from 'lucide-react';
import { useAiRead, type Stats } from '@/app/[locale]/results/CoachCard';
import { getCoachCardContent } from '@/app/[locale]/results/coachCard.content';
import dynamic from 'next/dynamic';
import { useRadarData } from '@/hooks/useRadarData';
import { PLATFORM_NAME, snapshotPlatform } from '@/lib/platform';
import { useStudio } from '../StudioContext';
import { PageHead } from '../PageHead';
import { StudioDialog } from '../StudioDialog';
import { StudioEmpty, StudioLoading } from '../StudioStates';
import { getStudioCoachContent } from './studioCoach.content';
import { greetWithName } from './todayCards.content';
import { useAuth } from '@/components/AuthProvider';
import { getTodayContent } from './today.content';
import { TodayRead } from './TodayRead';
import { ReadBody } from './TodayReadBody';
import { isSampleOn } from '@/lib/sample/sampleMode';
import { getSampleSeen } from '@/lib/sample/coach/seen';
import { AskWidget, CreateWidget, GoalWidget, WeekWidget, useTodayPlan } from './TodayWidgets';
import { PostWidget } from './TodayPost';
import { BriefWidget, SinceWidget, UpsellWidget } from './TodayMore';
import { TodayBoard, useTodayLayout } from './TodayBoard';
import { TodayBlindSpot } from './TodayBlindSpot';
import { TodayLearned } from './TodayLearned';
import { TodayNewer } from './TodayNewer';

// Pro AI: the coach's read. Everyone else: their real numbers from this
// export (computed here) and the AI part blurred, with a clear Pro AI label.
function Read({ stats }: { stats: Stats }) {
  const { hasProAi, locale, openUpgrade } = useStudio();
  const k = getStudioCoachContent(locale).today;
  const t = getTodayContent(locale);
  const cc = getCoachCardContent(locale);
  const state = useAiRead(hasProAi ? stats : null, locale);
  const sampleSeen = isSampleOn() ? getSampleSeen() : null;
  if (!hasProAi) {
    // Two wide blurred lines and the button beside them, so the hidden part stays small.
    return (
      <div className="s-row" style={{ gap: 14, alignItems: 'center', flexWrap: 'wrap', borderTop: '1px solid var(--line)', paddingTop: 14 }}>
        <div className="s-col" style={{ gap: 4, flex: '1 1 300px', minWidth: 0 }}>
          <span className="s-lab s-row" style={{ gap: 6 }}><Sparkles size={13} />{t.coachRead}</span>
          <p aria-hidden="true" className="s-blur s-clamp2" style={{ margin: 0, fontSize: 14 }}>{cc.sample.join(' ')}</p>
        </div>
        <button type="button" className="s-btn acc" style={{ flex: 'none' }} onClick={() => openUpgrade('coach')}><Sparkles size={14} />{t.unlockRead}</button>
      </div>
    );
  }
  if (state.kind === 'read') return <ReadBody read={state.read} seen={state.seen ?? sampleSeen} />;
  // Reads are included: one a day per platform. A second export the same day
  // shows the latest read and says the next one comes tomorrow.
  if (state.kind === 'tomorrow') {
    return <>{state.old && <ReadBody read={state.old} />}<p className="s-sub-t" style={{ margin: 0, fontSize: 13.5, borderTop: '1px solid var(--line)', paddingTop: 12 }}>{t.readTomorrow}</p></>;
  }
  if (state.kind === 'setup') return <SetupCoach />;
  if (state.kind === 'loading') return <p className="s-sub-t" style={{ margin: 0 }}>{k.reading}</p>;
  return null;
}

// The setup questions and their strings load only when the dialog opens.
const SetupQuestions = dynamic(async () => {
  const [{ Onboarding }, { getCoachContent }] = await Promise.all([import('@/app/[locale]/coach/Onboarding'), import('@/app/[locale]/coach/content')]);
  return function SetupQuestions({ locale, onDone }: { locale: Parameters<typeof getCoachContent>[0]; onDone: () => void }) {
    return <Onboarding c={getCoachContent(locale)} locale={locale} onDone={onDone} />;
  };
}, { ssr: false });

// First visit with Pro AI: one line and a button; the questions open in a dialog
// so they don't stretch the read card.
function SetupCoach() {
  const { locale, coach } = useStudio();
  const k = getStudioCoachContent(locale).today;
  const t = getTodayContent(locale);
  const [open, setOpen] = useState(false);
  return (
    <div className="s-row" style={{ gap: 14, alignItems: 'center', flexWrap: 'wrap', borderTop: '1px solid var(--line)', paddingTop: 14 }}>
      <span className="s-col" style={{ gap: 3, flex: '1 1 260px' }}><span className="s-lab s-row" style={{ gap: 6 }}><Sparkles size={13} />{t.coachRead}</span><span className="s-sub-t" style={{ fontSize: 14 }}>{k.setup}</span></span>
      <button type="button" className="s-btn acc" onClick={() => setOpen(true)}><Sparkles size={14} />{t.setupCta}</button>
      <StudioDialog open={open} onClose={() => setOpen(false)} title={t.setupCta} wide>
        <SetupQuestions locale={locale} onDone={() => { void coach.reload(); window.location.reload(); }} />
      </StudioDialog>
    </div>
  );
}

// Studio > Today: the prototype's widget board. Numbers come from the user's
// own exports in this browser; the coach parts show for Pro AI and stay
// hidden (but visible in shape) for everyone else.
export function TodayPage() {
  const { locale, userId, hasProAi } = useStudio();
  const k = getStudioCoachContent(locale).today;
  const t = getTodayContent(locale);
  const { snapshot, previousSnapshot, loading } = useRadarData(userId);
  // The previous export rides along so Radar's two-export findings reach the coach.
  const stats = useMemo(() => (snapshot ? exportStats(snapshot, previousSnapshot ?? undefined) : null), [snapshot, previousSnapshot]);
  const tp = useTodayPlan(hasProAi);
  const board = useTodayLayout();
  const [edit, setEdit] = useState(false);
  const { displayName } = useAuth();

  if (loading) return <StudioLoading />;
  if (!snapshot || !stats) return <StudioEmpty />;
  const date = new Date(snapshot.exportedAt * 1000).toLocaleDateString(locale, { day: 'numeric', month: 'short' });
  const now = new Date();
  const today = new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'short' }).format(now);
  return (
    <>
      <PageHead title={greetWithName(t.greet(now.getHours()), displayName)} actions={<>
        <span className="s-sub-t s-hsm">{today}</span>
        {edit && <button type="button" className="s-btn sec" onClick={board.reset}><RotateCcw size={14} />{t.custom.reset}</button>}
        <button type="button" className={`s-btn${edit ? '' : ' sec'}`} aria-pressed={edit} onClick={() => setEdit((e) => !e)}>{edit ? <Check size={14} /> : <LayoutDashboard size={14} />}{edit ? t.custom.done : t.custom.customize}</button>
      </>} />
      <TodayNewer snapshot={snapshot} />
      <TodayBlindSpot snapshot={snapshot} previous={previousSnapshot ?? null} hasPlan={!!tp.plan} />
      <TodayLearned />
      <div className="s-dash">
        <TodayRead snapshot={snapshot} previous={previousSnapshot} dateLabel={k.readFrom(date, PLATFORM_NAME[snapshotPlatform(snapshot)])}><Read stats={stats} /></TodayRead>
        {hasProAi ? <PostWidget tp={tp} /> : <div className="s-dcol"><PostWidget tp={tp} /><UpsellWidget /></div>}
      </div>
      <TodayBoard edit={edit} layout={board.layout} save={board.save} render={{
        create: <CreateWidget />,
        week: <WeekWidget tp={tp} />,
        goal: <GoalWidget platform={snapshotPlatform(snapshot)} />,
        ask: <AskWidget />,
        since: <SinceWidget snapshot={snapshot} previous={previousSnapshot} />,
        brief: <BriefWidget snapshot={snapshot} />,
      }} />
    </>
  );
}
