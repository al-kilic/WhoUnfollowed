'use client';

import { useEffect, useState } from 'react';
import { useStudio } from '../../StudioContext';
import { getMemoryContent } from './memory.content';

// The member's own free text: the part of memory.md above the coach's
// heading. Saving keeps the coach's part as it is.
const COACH_HEADINGS = ['## Notes from your coach', '## Notas de tu coach', '## Notas do seu coach'];
const MAX_ABOUT = 2_000;

export function splitMemory(md: string): { mine: string; coach: string } {
  const at = COACH_HEADINGS.map((h) => md.indexOf(h)).filter((i) => i >= 0).sort((a, b) => a - b)[0];
  return at === undefined ? { mine: md.trim(), coach: '' } : { mine: md.slice(0, at).trim(), coach: md.slice(at).trim() };
}

export function AboutMe() {
  const { locale } = useStudio();
  const t = getMemoryContent(locale);
  const [mem, setMem] = useState<{ content: string; version: number } | null | undefined>(undefined);
  const [text, setText] = useState<string | null>(null);
  const [note, setNote] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    void fetch('/api/ai/memory', { cache: 'no-store' })
      .then(async (r) => setMem(r.ok ? ((await r.json()) as { memory: { content: string; version: number } | null }).memory : null))
      .catch(() => setMem(null));
  }, []);

  const parts = splitMemory(mem?.content ?? '');
  const value = text ?? parts.mine;
  const dirty = text !== null && text !== parts.mine;

  async function save() {
    const content = parts.coach ? `${value.trim()}\n\n${parts.coach}\n` : `${value.trim()}\n`;
    const r = await fetch('/api/ai/memory', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content, version: mem?.version ?? 0 }) }).catch(() => null);
    const j = r ? ((await r.json().catch(() => ({}))) as { version?: number }) : {};
    if (r?.ok) { setMem({ content, version: j.version ?? (mem?.version ?? 0) + 1 }); setText(null); setNote({ ok: true, text: t.aboutSaved }); return; }
    setNote({ ok: false, text: t.failed });
  }

  return (
    <section className="s-card">
      <div className="s-hd"><b>{t.about}</b><span className="s-sub-t" style={{ fontSize: 12.5 }}>{t.aboutBody}</span></div>
      <textarea className="s-memta s-about" aria-label={t.about} value={value} maxLength={MAX_ABOUT} disabled={mem === undefined}
        onChange={(e) => { setText(e.target.value); setNote(null); }} />
      <div className="s-pad s-row" style={{ gap: 10, borderTop: '1px solid var(--line)' }}>
        <button type="button" className="s-btn xs" disabled={!dirty} onClick={() => void save()}>{t.save}</button>
        <span className="s-sub-t" style={{ fontSize: 12 }}>{value.length.toLocaleString(locale)} / {MAX_ABOUT.toLocaleString(locale)}</span>
        {note && <span role="status" style={{ fontSize: 13, color: note.ok ? 'var(--good)' : 'var(--bad)' }}>{note.text}</span>}
      </div>
    </section>
  );
}
