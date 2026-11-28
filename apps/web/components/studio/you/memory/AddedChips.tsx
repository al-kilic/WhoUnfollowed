'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { Check, X } from 'lucide-react';
import type { AppLocale } from '@/i18n/routing';
import { getMemoryContent } from './memory.content';
import { sameText, type NotesPayload } from './memoryTypes';

// "Added to memory" under a coach answer: each new note with a "Not quite"
// that forgets it in one tap (the coach won't learn it again).
export function AddedToMemory({ lines, title }: { lines: string[]; title: string }) {
  const t = getMemoryContent(useLocale() as AppLocale);
  const [gone, setGone] = useState<Set<number>>(new Set());
  const [busy, setBusy] = useState<number | null>(null);
  if (!lines.length) return null;

  async function forget(i: number, line: string) {
    setBusy(i);
    try {
      const r = await fetch('/api/ai/notes', { cache: 'no-store' });
      const d = r.ok ? ((await r.json()) as NotesPayload) : null;
      const note = d?.notes.find((n) => sameText(n.body, line));
      if (note) {
        const f = await fetch('/api/ai/notes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ op: 'forget', id: note.id }) });
        if (f.ok) setGone((g) => new Set(g).add(i));
      }
    } catch { /* leave it as is */ }
    setBusy(null);
  }

  return (
    <div role="status" className="s-added">
      <b>{title}</b>
      <ul>
        {lines.map((l, i) => (
          <li key={i} className={gone.has(i) ? 'gone' : undefined}>
            <span>{l}</span>
            {gone.has(i)
              ? <span className="s-added-done"><Check size={12} />{t.notQuiteDone}</span>
              : <button type="button" className="s-added-nq" disabled={busy === i} onClick={() => void forget(i, l)}><X size={12} />{t.notQuite}</button>}
          </li>
        ))}
      </ul>
    </div>
  );
}
