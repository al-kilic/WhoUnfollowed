'use client';

import { useCallback, useEffect, useState } from 'react';
import type { LearnedWeek, MemNote, Moment, NoteOp, NotesPayload } from '@/components/studio/you/memory/memoryTypes';

// You > Memory: the coach's notes, the weekly learned notes and the moments
// timeline. In sample mode these calls are answered in the browser
// (lib/sample/sampleFetch.ts), and changes only live in this state.

async function getJson<T>(url: string): Promise<T | null> {
  try {
    const r = await fetch(url, { cache: 'no-store' });
    return r.ok ? ((await r.json()) as T) : null;
  } catch { return null; }
}

function applyLocal(notes: MemNote[], op: NoteOp): MemNote[] {
  switch (op.op) {
    case 'forget': return notes.filter((n) => n.id !== op.id);
    case 'pin': case 'unpin': return notes.map((n) => (n.id === op.id ? { ...n, pinned: op.op === 'pin' } : n));
    case 'keep': return notes.map((n) => (n.id === op.id ? { ...n, status: 'active', lastConfirmedAt: new Date().toISOString() } : n));
    case 'edit': return notes.map((n) => (n.id === op.id ? { ...n, body: op.body, origin: 'user', confidence: 1 } : n));
    case 'resolve': {
      // The other note is archived, not deleted.
      return notes.map((n) => (n.id === op.keepId ? { ...n, status: 'active' } : n.id === op.id ? { ...n, status: 'archived' } : n));
    }
    case 'add': {
      const now = new Date().toISOString();
      return [{ id: `local-${now}`, type: op.type, body: op.body, examples: [], tags: [], source: 'user', sourceAt: now, origin: 'user', confidence: 1, importance: 5, pinned: true, status: 'active', createdAt: now, lastConfirmedAt: now }, ...notes];
    }
  }
}

export function useMemoryNotes() {
  const [data, setData] = useState<NotesPayload | null | undefined>(undefined);
  const [learned, setLearned] = useState<LearnedWeek[] | undefined>(undefined);
  const [moments, setMoments] = useState<Moment[] | undefined>(undefined);

  useEffect(() => {
    void getJson<NotesPayload>('/api/ai/notes').then((d) => setData(d ? { notes: d.notes ?? [], disputed: d.disputed ?? [] } : null));
    void getJson<{ weeks: LearnedWeek[] }>('/api/ai/learned').then((d) => setLearned(d?.weeks ?? []));
    void getJson<{ moments: Moment[] }>('/api/ai/moments').then((d) => setMoments(d?.moments ?? []));
  }, []);

  // Applies the change here first, then on the server. A failed call puts the
  // previous state back.
  const act = useCallback(async (op: NoteOp): Promise<boolean> => {
    let before: NotesPayload | null | undefined;
    setData((d) => {
      before = d;
      if (!d) return d;
      const notes = applyLocal(d.notes, op);
      const ids = new Set(notes.map((n) => n.id));
      const disputed = op.op === 'resolve' ? d.disputed.filter(([a, b]) => a !== op.id && b !== op.id) : d.disputed.filter(([a, b]) => ids.has(a) && ids.has(b));
      return { notes, disputed };
    });
    try {
      const r = await fetch('/api/ai/notes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(op) });
      if (r.ok) {
        // A new note gets its real id, so it can be pinned or edited right away.
        const { id } = (await r.json().catch(() => ({}))) as { id?: string };
        if (op.op === 'add' && id) setData((d) => d && { ...d, notes: d.notes.map((n) => (n.id.startsWith('local-') && n.body === op.body ? { ...n, id } : n)) });
        return true;
      }
    } catch { /* fall through */ }
    setData(before);
    return false;
  }, []);

  return { data, learned, moments, act };
}
