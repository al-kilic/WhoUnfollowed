'use client';

import { useState, type FormEvent } from 'react';
import type { AiPlan } from '@ig-tracker/core';
import type { CoachContent } from './content';
import { postAction } from './api';
import { AddedToMemory, card, Choice, ErrorLine, eyebrow, input, label, PrimaryButton } from './ui';
import type { ToolProps } from './DraftTool';
import { T } from '@/components/landing/tokens';

// 30-day post plan on the stronger model.
// onResult: Studio draws the plan as a calendar instead of the table below.
export function PlanTool({ c, locale, locked, onResult }: ToolProps & { onResult?: ((plan: AiPlan) => void) | undefined }) {
  const [focus, setFocus] = useState('');
  const [perWeek, setPerWeek] = useState<'2' | '3' | '5' | '7'>('3');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ data: AiPlan; added: string[] } | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (locked) { locked.onClick(); return; }
    setBusy(true); setError(null);
    const res = await postAction<AiPlan>('/api/ai/plan', { focus, postsPerWeek: Number(perWeek), locale });
    setBusy(false);
    if (!res.ok) { setError(c.errors[res.error as keyof CoachContent['errors']] ?? c.errors.failed); return; }
   
    setResult({ data: res.data, added: res.added });
    onResult?.(res.data);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <form onSubmit={submit} style={card}>
        <label style={label} htmlFor="plan-focus">{c.plan.focus}
          <input id="plan-focus" maxLength={300} value={focus} onChange={(e) => setFocus(e.target.value)} placeholder={c.plan.focusPh} style={input} />
        </label>
        <div style={label}>{c.plan.perWeek}
          <Choice name={c.plan.perWeek} value={perWeek} onChange={setPerWeek} options={(['2', '3', '5', '7'] as const).map((v) => ({ value: v, label: v }))} />
        </div>
        <ErrorLine text={error} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <PrimaryButton type="submit" disabled={!locked && busy}>{locked ? locked.label : busy ? c.working : c.plan.submit}</PrimaryButton>

        </div>
      </form>

      {result && !onResult && (
        <section style={card} aria-live="polite">
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: T.ink }}>{result.data.summary}</p>
          <div>
            <div style={eyebrow}>{c.plan.principles}</div>
            <ul style={{ margin: '6px 0 0', paddingLeft: 18, fontSize: 14, color: T.inkDim, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {result.data.principles.map((p) => <li key={p}>{p}</li>)}
            </ul>
          </div>
          {result.data.weeks.map((w) => (
            <div key={w.week} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.ink }}>{c.plan.week(w.week)} · {w.theme}</div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 480, fontSize: 13.5 }}>
                  <tbody>
                    {w.posts.map((p, i) => (
                      <tr key={i} style={{ borderTop: `1px solid ${T.border1}` }}>
                        <td style={{ padding: '8px 8px 8px 0', color: T.inkMute, whiteSpace: 'nowrap', verticalAlign: 'top' }}>{p.day}</td>
                        <td style={{ padding: 8, color: T.tealLight, whiteSpace: 'nowrap', verticalAlign: 'top' }}>{c.formats[p.format]}</td>
                        <td style={{ padding: 8, color: T.ink, verticalAlign: 'top' }}>{p.idea}<div style={{ color: T.inkDim, marginTop: 2 }}>“{p.hook}”</div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
          <AddedToMemory lines={result.added} title={c.addedToMemory} />
        </section>
      )}
    </div>
  );
}
