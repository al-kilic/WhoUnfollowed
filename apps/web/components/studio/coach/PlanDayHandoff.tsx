'use client';

import { useState } from 'react';
import type { AiPlanCalendarItem } from '@ig-tracker/core';
import type { Format as AiPostFormat } from './formats';
import { CalendarPlus, CalendarCheck } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { nextPlanDay, planStart } from '@/lib/ai/planDays';
import { useStudio } from '../StudioContext';
import { getPrecheckContent } from './precheck.content';

interface Plan { id: string; createdAt: string; calendar: AiPlanCalendarItem[] }

// Check -> Plan: puts the checked draft on the next free posting day of the
// newest 30-day plan. No model call.
export function PlanDayHandoff({ format, hook, caption }: { format: AiPostFormat; hook: string; caption: string }) {
  const { locale, coach } = useStudio();
  const t = getPrecheckContent(locale);
  const [state, setState] = useState<{ kind: 'idle' | 'busy' | 'none' } | { kind: 'done'; label: string }>({ kind: 'idle' });

  async function place() {
    setState({ kind: 'busy' });
    const r = await fetch('/api/ai/content?kind=plan', { cache: 'no-store' }).catch(() => null);
    const plan = r?.ok ? ((await r.json()) as { plan: Plan | null }).plan : null;
    if (!plan) { setState({ kind: 'none' }); return; }
    const start = planStart(new Date(plan.createdAt));
    const day = nextPlanDay(start, plan.calendar.map((i) => i.day), coach.state?.prefs?.days ?? []);
    if (day === null) { setState({ kind: 'none' }); return; }
    const idea = (caption.split('\n')[0] || hook).slice(0, 300);
    const items = [...plan.calendar, { day, format, idea, hook: hook.slice(0, 200), posted: false }].sort((a, b) => a.day - b.day);
    await fetch('/api/ai/plan/calendar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: plan.id, items }) }).catch(() => null);
    const at = new Date(start.getTime() + day * 86_400_000);
    setState({ kind: 'done', label: at.toLocaleDateString(locale, { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' }) });
  }

  if (state.kind === 'done') return <Link href="/app/plan" className="s-btn sec xs"><CalendarCheck size={13} />{t.planned(state.label)}</Link>;
  if (state.kind === 'none') return <span className="s-sub-t s-row" style={{ gap: 6 }}>{t.noPlan} <Link href="/app/plan" className="s-lnk">{t.makePlan}</Link></span>;
  return <button type="button" className="s-btn sec xs" disabled={state.kind === 'busy'} onClick={() => void place()}><CalendarPlus size={13} />{t.planDay}</button>;
}
