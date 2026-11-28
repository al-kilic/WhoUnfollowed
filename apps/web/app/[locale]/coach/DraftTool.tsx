'use client';

import { useEffect, useState, type FormEvent } from 'react';
import type { AiDraft } from '@ig-tracker/core';
import type { CoachContent } from './content';
import { postAction } from './api';
import { AddedToMemory, card, Choice, CopyButton, ErrorLine, input, label, PrimaryButton } from './ui';
import { T } from '@/components/landing/tokens';

type Kind = 'hook' | 'caption' | 'script';
type Format = 'reel' | 'carousel' | 'photo' | 'story';

export interface ToolProps {
  c: CoachContent; locale: string;
  // Without Pro AI: the form works, but submitting opens the upgrade sheet
  // instead of calling the model (no request is sent).
  locked?: { label: string; onClick: () => void } | undefined;
}

export interface DraftState { kind: Kind; format: Format; options: string[] }

// "Write": hooks, captions and Reel scripts in the user's voice.
// onChange: Studio's Create page mirrors the choices and results in its phone preview.
export function DraftTool({ c, locale, locked, onChange }: ToolProps & { onChange?: ((s: DraftState) => void) | undefined }) {
  const [kind, setKind] = useState<Kind>('caption');
  const [format, setFormat] = useState<Format>('carousel');
  const [topic, setTopic] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ data: AiDraft; added: string[] } | null>(null);
  useEffect(() => { onChange?.({ kind, format, options: result?.data.options.map((o) => o.text) ?? [] }); }, [kind, format, result, onChange]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (locked) { locked.onClick(); return; }
    setBusy(true); setError(null);
    const res = await postAction<AiDraft>('/api/ai/draft', { kind, format, topic, locale });
    setBusy(false);
    if (!res.ok) { setError(c.errors[res.error as keyof CoachContent['errors']] ?? c.errors.failed); return; }
   
    setResult({ data: res.data, added: res.added });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <form onSubmit={submit} style={card}>
        <div style={label}>{c.draft.kind}
          <Choice name={c.draft.kind} value={kind} onChange={setKind} options={(['hook', 'caption', 'script'] as const).map((v) => ({ value: v, label: c.draft.kinds[v] }))} />
        </div>
        <div style={label}>{c.draft.format}
          <Choice name={c.draft.format} value={format} onChange={setFormat} options={(['reel', 'carousel', 'photo', 'story'] as const).map((v) => ({ value: v, label: c.formats[v] }))} />
        </div>
        <label style={label} htmlFor="draft-topic">{c.draft.topic}
          <textarea id="draft-topic" required={!locked} maxLength={300} rows={2} value={topic} onChange={(e) => setTopic(e.target.value)} placeholder={c.draft.topicPh} style={{ ...input, resize: 'vertical' }} />
        </label>
        <ErrorLine text={error} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <PrimaryButton type="submit" disabled={!locked && (busy || !topic.trim())}>{locked ? locked.label : busy ? c.working : c.draft.submit}</PrimaryButton>

        </div>
      </form>

      {result && (
        <section style={card} aria-live="polite">
          {result.data.options.map((o, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingBottom: 12, borderBottom: i < result.data.options.length - 1 ? `1px solid ${T.border1}` : 'none' }}>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: T.ink, whiteSpace: 'pre-wrap' }}>{o.text}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 13, color: T.inkDim, flex: '1 1 200px' }}>{o.why}</span>
                <CopyButton text={o.text} labels={c} />
              </div>
            </div>
          ))}
          <AddedToMemory lines={result.added} title={c.addedToMemory} />
        </section>
      )}
    </div>
  );
}
