'use client';

import { useState } from 'react';
import type { AiPlan } from '@ig-tracker/core';
import { MessageSquarePlus } from 'lucide-react';
import { postAction } from '@/app/[locale]/coach/api';
import type { Seen } from './CoachSeen';
import { getCoachContent } from '@/app/[locale]/coach/content';
import { useStudio } from '../StudioContext';
import { getPlanContent } from './plan.content';
import { AiError } from './AiError';

// Feedback on a 30-day plan: the coach rewrites it, keeping posted posts in place.
export function PlanRevise({ id, onDone }: { id: string; onDone: (seen: Seen | null) => void }) {
  const { locale } = useStudio();
  const p = getPlanContent(locale);
  const c = getCoachContent(locale);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  async function send() {
    if (text.trim().length < 3 || busy) return;
    setBusy(true); setMsg(null);
    const res = await postAction<AiPlan>('/api/ai/plan/revise', { id, feedback: text.trim(), locale, platform: 'instagram' });
    setBusy(false);
    if (!res.ok) { setMsg({ ok: false, text: c.errors[res.error as keyof typeof c.errors] ?? c.errors.failed }); return; }
    setText(''); setMsg({ ok: true, text: p.revised });
    onDone(res.seen ?? null);
  }
  return (
    <section className="s-card s-pad s-col" style={{ gap: 10 }}>
      <div className="s-row" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <h3 className="s-h3 s-row" style={{ gap: 6, margin: 0 }}><MessageSquarePlus size={15} />{p.reviseTitle}</h3>
      </div>
      <span className="s-sub-t" style={{ fontSize: 13.5 }}>{p.reviseSub}</span>
      <form className="s-col" style={{ gap: 8 }} onSubmit={(e) => { e.preventDefault(); void send(); }}>
        <label htmlFor="plan-feedback" className="s-sub-t" hidden>{p.reviseTitle}</label>
        <textarea id="plan-feedback" className="s-input" rows={2} maxLength={500} value={text} placeholder={p.revisePh} onChange={(e) => setText(e.target.value)} style={{ resize: 'vertical' }} />
        <div className="s-row" style={{ gap: 10, flexWrap: 'wrap' }}>
          <button type="submit" className="s-btn" disabled={busy || text.trim().length < 3}>{busy ? c.working : p.reviseCta}</button>
          {msg?.ok && <span role="status" style={{ fontSize: 13, color: 'var(--good)' }}>{msg.text}</span>}
        </div>
        <AiError text={msg && !msg.ok ? msg.text : null} />
      </form>
    </section>
  );
}
