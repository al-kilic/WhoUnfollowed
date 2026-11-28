'use client';

import { useEffect, useState } from 'react';
import { Link } from '@/i18n/navigation';
import type { AppLocale } from '@/i18n/routing';
import { T } from '@/components/landing/tokens';
import { getCoachContent } from '../content';
import { card, ErrorLine, eyebrow, input, PrimaryButton } from '../ui';

const MAX = 9_000; // keep in sync with MEMORY_MAX_CHARS in lib/ai/config.ts

// memory.md, editable. A version number guards against overwriting a coach
// note added while the user was typing.
// inStudio: Studio > You supplies its own heading, so the back link and title go.
export function MemoryEditor({ locale, inStudio = false }: { locale: AppLocale; inStudio?: boolean }) {
  const c = getCoachContent(locale);
  const m = c.memory;
  const [text, setText] = useState('');
  const [version, setVersion] = useState<number | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmWipe, setConfirmWipe] = useState(false);

  useEffect(() => {
    void fetch('/api/ai/memory', { cache: 'no-store' }).then(async (r) => {
      if (!r.ok) return;
      const j = (await r.json()) as { memory: { content: string; version: number } | null };
      setText(j.memory?.content ?? '');
      setVersion(j.memory?.version ?? null);
    });
  }, []);

  async function save() {
    if (version === null) return;
    setError(null); setStatus(null);
    const r = await fetch('/api/ai/memory', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: text, version }) }).catch(() => null);
    const j = r ? ((await r.json().catch(() => ({}))) as { version?: number; error?: string }) : {};
    if (r?.ok && j.version) { setVersion(j.version); setStatus(m.saved); return; }
    setError(j.error === 'conflict' ? m.conflict : j.error === 'too_long' ? m.tooLong : c.errors.failed);
  }

  async function wipe() {
    const r = await fetch('/api/ai/memory', { method: 'DELETE' }).catch(() => null);
    setConfirmWipe(false);
    if (r?.ok) { setText(''); setVersion(null); setStatus(m.wiped); }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {!inStudio && <Link href="/coach" style={{ fontSize: 13, color: T.tealLight, textDecoration: 'none', fontWeight: 600 }}>← {m.back}</Link>}
      {!inStudio && <div>
        <div style={eyebrow}>{c.eyebrow}</div>
        <h1 style={{ fontFamily: T.serif, fontSize: 'clamp(32px, 5vw, 44px)', fontWeight: 400, margin: '4px 0 8px', color: T.ink }}>{m.title}</h1>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: T.inkDim, maxWidth: 620 }}>{m.intro}</p>
      </div>}
      <div style={card}>
        <textarea id="memory-md" aria-label={m.title} value={text} onChange={(e) => { setText(e.target.value); setStatus(null); }}
          disabled={version === null} rows={22} spellCheck
          style={{ ...input, fontFamily: T.mono, fontSize: 13, lineHeight: 1.6, resize: 'vertical', minHeight: 320 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <PrimaryButton onClick={() => void save()} disabled={version === null || text.length > MAX}>{m.save}</PrimaryButton>
          <span style={{ fontSize: 12, color: text.length > MAX ? T.terra : T.inkMute, fontVariantNumeric: 'tabular-nums' }}>{m.chars(text.length, MAX)}</span>
          {status && <span role="status" style={{ fontSize: 13, color: T.tealLight }}>{status}</span>}
        </div>
        <ErrorLine text={error} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        {confirmWipe ? (
          <>
            <span style={{ fontSize: 13, color: T.inkDim }}>{m.wipeConfirm}</span>
            <button type="button" onClick={() => void wipe()} style={{ font: 'inherit', fontSize: 13, fontWeight: 600, padding: '8px 14px', borderRadius: 10, border: 'none', background: T.terra, color: T.onTeal, cursor: 'pointer' }}>{m.wipeYes}</button>
            <button type="button" onClick={() => setConfirmWipe(false)} style={{ font: 'inherit', fontSize: 13, background: 'none', border: 'none', color: T.tealLight, cursor: 'pointer' }}>{m.wipeNo}</button>
          </>
        ) : (
          <button type="button" onClick={() => setConfirmWipe(true)} style={{ font: 'inherit', fontSize: 13, background: 'none', border: 'none', color: T.terraText, cursor: 'pointer', padding: 0 }}>{m.wipe}</button>
        )}
      </div>
    </div>
  );
}
