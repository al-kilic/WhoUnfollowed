'use client';

import { useState } from 'react';
import type { AiCheck } from '@ig-tracker/core';
import type { CoachContent } from './content';
import { AddedToMemory, card, CopyButton, eyebrow, input, PrimaryButton } from './ui';
import { T } from '@/components/landing/tokens';

// The scored post, its fixes, and the "I posted it / how did it do" loop that
// teaches memory what works for this account.
export function CheckResult({ c, result }: { c: CoachContent; result: { data: AiCheck; added: string[]; logId: string } }) {
  const k = c.check;
  const d = result.data;
  const [posted, setPosted] = useState(false);
  const [nums, setNums] = useState({ likes: '', saves: '', newFollowers: '' });

  async function save(withResults: boolean) {
    const results = withResults
      ? Object.fromEntries(Object.entries(nums).filter(([, v]) => v.trim() !== '').map(([key, v]) => [key, Math.max(0, Math.floor(Number(v)) || 0)]))
      : null;
    const res = await fetch('/api/ai/content', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: result.logId, results }) }).catch(() => null);
    if (res?.ok) setPosted(true);
  }

  return (
    <section style={card} aria-live="polite">
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
        <span style={eyebrow}>{k.overall}</span>
        <span style={{ fontFamily: T.serif, fontSize: 40, color: T.ink, fontVariantNumeric: 'tabular-nums' }}>{d.overall}</span>
        <span style={{ fontSize: 14, color: T.inkMute }}>/ 100</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 8 }}>
        {d.scores.map((s) => (
          <div key={s.criterion} style={{ padding: '10px 12px', borderRadius: 10, background: T.bg, border: `1px solid ${T.border1}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, color: T.ink }}>
              <span>{k.criteria[s.criterion]}</span><span style={{ fontVariantNumeric: 'tabular-nums' }}>{s.score}/10</span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: 12.5, lineHeight: 1.5, color: T.inkDim }}>{s.reason}</p>
          </div>
        ))}
      </div>
      <Section title={k.fixes}>
        <ol style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, color: T.inkDim }}>
          {d.fixes.map((f) => <li key={f.what}><strong style={{ color: T.ink }}>{f.what}.</strong> {f.why}</li>)}
        </ol>
      </Section>
      {d.altHooks.length > 0 && (
        <Section title={k.altHooks}>
          {d.altHooks.map((h) => (
            <div key={h} style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: 14, color: T.ink, flex: '1 1 200px' }}>{h}</span><CopyButton text={h} labels={c} />
            </div>
          ))}
        </Section>
      )}
      {d.caption && (
        <Section title={k.newCaption}>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: T.ink, whiteSpace: 'pre-wrap' }}>{d.caption}</p>
          <CopyButton text={d.caption} labels={c} />
        </Section>
      )}
      {d.cover.length > 0 && <Section title={k.coverNotes}><ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, color: T.inkDim }}>{d.cover.map((n) => <li key={n}>{n}</li>)}</ul></Section>}
      <AddedToMemory lines={result.added} title={c.addedToMemory} />

      <div style={{ borderTop: `1px solid ${T.border1}`, paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {posted ? <span role="status" style={{ fontSize: 13, color: T.tealLight }}>{k.postedDone}</span> : (
          <>
            <span style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>{k.resultsTitle}</span>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {(['likes', 'saves', 'newFollowers'] as const).map((key) => (
                <input key={key} id={`res-${key}`} aria-label={k[key]} placeholder={k[key]} inputMode="numeric" value={nums[key]}
                  onChange={(e) => setNums((p) => ({ ...p, [key]: e.target.value.replace(/\D/g, '') }))} style={{ ...input, width: 130 }} />
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <PrimaryButton onClick={() => void save(true)}>{k.saveResults}</PrimaryButton>
              <button type="button" onClick={() => void save(false)} style={{ font: 'inherit', fontSize: 13, background: 'none', border: 'none', color: T.tealLight, cursor: 'pointer' }}>{k.posted}</button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: T.tealLight, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{title}</div>
      {children}
    </div>
  );
}
