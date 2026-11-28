'use client';

import { useState } from 'react';
import { aiReadSchema } from '@ig-tracker/core';
import { Link } from '@/i18n/navigation';
import type { AppLocale } from '@/i18n/routing';
import { T } from '@/components/landing/tokens';
import { getCoachContent } from './content';
import { useCoachState } from './useCoachState';
import { Onboarding } from './Onboarding';
import { ReadCard } from './ReadCard';
import { DraftTool } from './DraftTool';
import { CheckTool } from './CheckTool';
import { PlanTool } from './PlanTool';
import { card, Choice, eyebrow } from './ui';

type Tab = 'read' | 'draft' | 'check' | 'plan';

export function CoachClient({ locale }: { locale: AppLocale }) {
  const c = getCoachContent(locale);
  const { state, activating, reload: load } = useCoachState();
  const [tab, setTab] = useState<Tab>('read');

  if (!state) return <p role="status" style={{ color: T.inkDim }}>{activating ? c.activating : c.working}</p>;
  if (!state.onboarded) return <Onboarding c={c} locale={locale} onDone={() => void load()} />;

  const read = state.latestRead ? aiReadSchema.safeParse(state.latestRead.data) : null;
  const tool = { c, locale };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <header style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={eyebrow}>{c.eyebrow}</div>
          <h1 style={{ fontFamily: T.serif, fontSize: 'clamp(34px, 5vw, 48px)', fontWeight: 400, margin: '4px 0 0', color: T.ink }}>{c.title}</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 13, color: T.inkDim }}>
          <Link href="/coach/memory" style={{ color: T.tealLight, fontWeight: 600, textDecoration: 'none' }}>{c.memoryLink} →</Link>
        </div>
      </header>

      <Choice name={c.title} value={tab} onChange={setTab}
        options={(['read', 'draft', 'check', 'plan'] as const).map((t) => ({ value: t, label: c.tabs[t] }))} />

      {tab === 'read' && (read?.success
        ? <ReadCard read={read.data} c={c} caption={c.read.from(state.latestRead!.platform ?? '', new Date(state.latestRead!.createdAt).toLocaleDateString(locale))} />
        : <div style={card}><p style={{ margin: 0, fontSize: 14, color: T.inkDim }}>{c.read.empty}</p></div>)}
      {tab === 'draft' && <DraftTool {...tool} />}
      {tab === 'check' && <CheckTool {...tool} />}
      {tab === 'plan' && <PlanTool {...tool} />}
    </div>
  );
}
