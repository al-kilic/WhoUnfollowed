'use client';

import { useState, type FormEvent } from 'react';
import type { AiCheck } from '@ig-tracker/core';
import type { CoachContent } from './content';
import { postAction } from './api';
import { prepareCover } from './coverImage';
import { CheckResult } from './CheckResult';
import { card, Choice, ErrorLine, input, label, PrimaryButton } from './ui';
import type { ToolProps } from './DraftTool';
import { T } from '@/components/landing/tokens';

type Format = 'reel' | 'carousel' | 'photo' | 'story';

// Pre-post check: score a post before it goes live, then (optionally) record
// how it did so memory learns what works for this account.
export function CheckTool({ c, locale, locked }: ToolProps) {
  const k = c.check;
  const [format, setFormat] = useState<Format>('reel');
  const [hook, setHook] = useState('');
  const [caption, setCaption] = useState('');
  const [cover, setCover] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ data: AiCheck; added: string[]; logId: string } | null>(null);

  async function onFile(file: File | undefined) {
    if (!file) return;
    try { setCover(await prepareCover(file)); } catch { setError(c.errors.invalid); }
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (locked) { locked.onClick(); return; }
    setBusy(true); setError(null);
    const res = await postAction<AiCheck>('/api/ai/check', { format, hook, caption, coverImage: cover, locale });
    setBusy(false);
    if (!res.ok) { setError(c.errors[res.error as keyof CoachContent['errors']] ?? c.errors.failed); return; }
   
    setResult({ data: res.data, added: res.added, logId: res.logId });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <form onSubmit={submit} style={card}>
        <div style={label}>{c.draft.format}
          <Choice name={c.draft.format} value={format} onChange={setFormat} options={(['reel', 'carousel', 'photo', 'story'] as const).map((v) => ({ value: v, label: c.formats[v] }))} />
        </div>
        <label style={label} htmlFor="check-hook">{k.hook}
          <input id="check-hook" required={!locked} maxLength={300} value={hook} onChange={(e) => setHook(e.target.value)} placeholder={k.hookPh} style={input} />
        </label>
        <label style={label} htmlFor="check-caption">{k.caption}
          <textarea id="check-caption" maxLength={2200} rows={4} value={caption} onChange={(e) => setCaption(e.target.value)} placeholder={k.captionPh} style={{ ...input, resize: 'vertical' }} />
        </label>
        <div style={label}>
          {k.cover}
          <span style={{ fontWeight: 400, fontSize: 12, color: T.inkMute }}>{k.coverHelp}</span>
          {cover ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* eslint-disable-next-line @next/next/no-img-element -- local data URL preview */}
              <img src={cover} alt="" style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8 }} />
              <button type="button" onClick={() => setCover(null)} style={{ font: 'inherit', fontSize: 13, background: 'none', border: 'none', color: T.tealLight, cursor: 'pointer' }}>{k.removeCover}</button>
            </div>
          ) : (
            <input id="check-cover" type="file" accept="image/*" onChange={(e) => void onFile(e.target.files?.[0])} style={{ fontSize: 13, color: T.inkDim }} />
          )}
        </div>
        <ErrorLine text={error} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <PrimaryButton type="submit" disabled={!locked && (busy || !hook.trim())}>{locked ? locked.label : busy ? c.working : k.submit}</PrimaryButton>

        </div>
      </form>
      {result && <CheckResult c={c} result={result} />}
    </div>
  );
}
