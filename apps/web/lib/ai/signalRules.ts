import type { AiSignal } from '@ig-tracker/core';

// Pure helpers for signal capture, kept apart so tests need no database.

export const SIGNALS_PER_MINUTE = 60;
export const PAYLOAD_MAX = 1000;
const recent = new Map<string, number[]>();

// How many of `n` new signals this member may still save this minute.
export function signalsAllowed(userId: string, n: number, now: number): number {
  const list = (recent.get(userId) ?? []).filter((t) => now - t < 60_000);
  const room = Math.max(0, SIGNALS_PER_MINUTE - list.length);
  const take = Math.min(room, n);
  for (let i = 0; i < take; i++) list.push(now);
  recent.set(userId, list);
  if (recent.size > 2000) for (const [k, v] of recent) if (!v.some((t) => now - t < 60_000)) recent.delete(k);
  return take;
}

// The stored payload: everything but kind, action and the log id, as JSON,
// capped at PAYLOAD_MAX characters (long text fields are cut first).
export function signalPayload(s: AiSignal): string {
  const rest: Record<string, unknown> = { ...s };
  delete rest.kind; delete rest.action; delete rest.contentLogId;
  let json = JSON.stringify(rest);
  if (json.length <= PAYLOAD_MAX) return json;
  const cut: Record<string, unknown> = { ...rest };
  for (const key of ['before', 'after', 'text'] as const) if (typeof cut[key] === 'string') cut[key] = (cut[key] as string).slice(0, 120);
  json = JSON.stringify(cut);
  return json.length <= PAYLOAD_MAX ? json : json.slice(0, PAYLOAD_MAX);
}

export function resetSignalLimits(): void { recent.clear(); }
