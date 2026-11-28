'use client';

import { useCallback, useEffect, useState } from 'react';
import { db, type ChatRecord, type ChatTurnRecord } from '@/lib/db';

// Ask coach conversations, kept only in this browser (IndexedDB). The newest
// MAX_CHATS stay; older ones are dropped when a new chat is saved.
export const MAX_CHATS = 50;
// Turns sent with each question: enough for follow-ups, small enough to stay
// cheap. The window moves in steps, not one turn at a time, so its start stays
// put for a few questions and the server can read the earlier turns from its
// cache (lib/ai/chatTurns.ts). At most CONTEXT_TURNS (the API takes 12).
export const CONTEXT_TURNS = 12;
export const CONTEXT_STEP = 6;

export function chatTitle(question: string): string {
  const t = question.trim().replace(/\s+/g, ' ');
  return t.length > 60 ? `${t.slice(0, 59).replace(/\s+\S*$/, '')}…` : t;
}

// What goes to the server: the last turns, oldest first, ending with the question.
export function contextTurns(turns: ChatTurnRecord[], max = CONTEXT_TURNS, step = CONTEXT_STEP): { role: 'user' | 'coach'; text: string }[] {
  const over = Math.max(0, turns.length - max);
  const start = Math.min(turns.length - 1, Math.ceil(over / step) * step);
  return turns.slice(start).map(({ role, text }) => ({ role, text: text.slice(0, 2400) }));
}

const newId = () => (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`);

// `seed`: sample mode's example chats. They live in memory only: nothing is
// read from or written to IndexedDB while a seed is given.
export function useChats(owner: string, seed: ChatRecord[] | null = null) {
  const [chats, setChats] = useState<ChatRecord[]>(() => seed ?? []);
  const [currentId, setCurrentId] = useState<string | null>(() => seed?.[0]?.id ?? null);
  const memory = seed !== null;

  const load = useCallback(async () => {
    if (memory) return;
    const list = await db.chats.where('[owner+updatedAt]').between([owner, 0], [owner, Infinity]).reverse().toArray().catch(() => [] as ChatRecord[]);
    setChats(list);
  }, [owner, memory]);
  useEffect(() => { void load(); }, [load]);

  const current = chats.find((c) => c.id === currentId) ?? null;

  // Adds turns to the open chat, or starts one with the first question as its title.
  const append = useCallback(async (turns: ChatTurnRecord[]): Promise<ChatRecord> => {
    const base = chats.find((c) => c.id === currentId);
    const rec: ChatRecord = base
      ? { ...base, turns: [...base.turns, ...turns], updatedAt: Date.now() }
      : { id: newId(), owner, title: chatTitle(turns[0]?.text ?? ''), turns, updatedAt: Date.now() };
    setCurrentId(rec.id);
    setChats((list) => [rec, ...list.filter((c) => c.id !== rec.id)]);
    if (memory) return rec;
    await db.chats.put(rec).catch(() => undefined);
    const extra = (await db.chats.where('[owner+updatedAt]').between([owner, 0], [owner, Infinity]).reverse().offset(MAX_CHATS).primaryKeys().catch(() => [])) as string[];
    if (extra.length) { await db.chats.bulkDelete(extra).catch(() => undefined); void load(); }
    return rec;
  }, [chats, currentId, owner, load, memory]);

  const remove = useCallback(async (id: string) => {
    if (!memory) await db.chats.delete(id).catch(() => undefined);
    setChats((list) => list.filter((c) => c.id !== id));
    setCurrentId((cur) => (cur === id ? null : cur));
  }, [memory]);

  return { chats, current, open: setCurrentId, startNew: () => setCurrentId(null), append, remove };
}
