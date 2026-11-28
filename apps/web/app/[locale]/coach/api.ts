'use client';

import type { AiPrefs } from '@ig-tracker/core';
import type { ContextSources } from '@/lib/ai/coachContext';
import type { PrecheckItem } from '@/lib/ai/precheck';
import type { AllowanceView } from '@/lib/ai/allowanceMath';

// Thin client for the Pro AI routes. Every action answers with the same shape
// (see lib/ai/guard.ts actionResponse).

export type ApiError = 'busy' | 'paused' | 'failed' | 'invalid' | 'needs_onboarding' | 'unauthorized' | 'not_pro_ai' | 'needs_export' | 'allowance_empty' | 'pace_limit' | 'invalid_image' | 'attach_limit';

export type ActionOk<T> = { ok: true; data: T; added: string[]; logId: string; mocked: boolean; seen?: { text: string; sources: ContextSources }; precheck?: PrecheckItem[] };
export type ActionReply<T> = ActionOk<T> | { ok: false; error: ApiError };

// Every AI action (done or refused) may change this month's coach use: the
// coach state listens for this and reads itself again (useCoachState).
export const AI_USED_EVENT = 'wu-ai-used';
function announceUse() {
  try { window.dispatchEvent(new Event(AI_USED_EVENT)); } catch { /* not in a browser */ }
}

export async function postAction<T>(path: string, body: unknown): Promise<ActionReply<T>> {
  try { return await sendAction<T>(path, body); } finally { announceUse(); }
}

async function sendAction<T>(path: string, body: unknown): Promise<ActionReply<T>> {
  try {
    const res = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    if (res.ok && json.ok) return json as unknown as ActionOk<T>;
    const error = typeof json.error === 'string' ? (json.error as ApiError) : 'failed';
    return { ok: false, error };
  } catch {
    return { ok: false, error: 'failed' };
  }
}

export interface CoachState {
  plan: string;
  onboarded: boolean;
  // The usage allowance: a share for a bar and flags, never dollar amounts.
  allowance?: AllowanceView;
  prefs?: AiPrefs;
  latestRead: { id: string; platform: string | null; createdAt: string; data: unknown } | null;
}

// Like postAction, for routes that stream (`stream: true`): `onAnswer` gets
// the answer so far as it is written, then the usual reply arrives.
export async function postStream<T>(path: string, body: Record<string, unknown>, onAnswer: (answer: string) => void): Promise<ActionReply<T>> {
  try { return await sendStream<T>(path, body, onAnswer); } finally { announceUse(); }
}

async function sendStream<T>(path: string, body: Record<string, unknown>, onAnswer: (answer: string) => void): Promise<ActionReply<T>> {
  try {
    const res = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...body, stream: true }) });
    if (!res.body || !(res.headers.get('content-type') ?? '').includes('text/event-stream')) {
      const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
      if (res.ok && json.ok) return json as unknown as ActionOk<T>;
      return { ok: false, error: typeof json.error === 'string' ? (json.error as ApiError) : 'failed' };
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buf = '';
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      let cut: number;
      while ((cut = buf.indexOf('\n\n')) >= 0) {
        const block = buf.slice(0, cut); buf = buf.slice(cut + 2);
        const event = /^event: (.+)$/m.exec(block)?.[1];
        const data = /^data: (.+)$/m.exec(block)?.[1];
        if (!event || !data) continue;
        const json = JSON.parse(data) as Record<string, unknown>;
        if (event === 'delta' && typeof json.answer === 'string') onAnswer(json.answer);
        if (event === 'done') {
          if (json.ok) return json as unknown as ActionOk<T>;
          return { ok: false, error: typeof json.error === 'string' ? (json.error as ApiError) : 'failed' };
        }
      }
    }
    return { ok: false, error: 'failed' };
  } catch {
    return { ok: false, error: 'failed' };
  }
}
