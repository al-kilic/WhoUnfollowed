import 'server-only';
import type { AiSignal } from '@ig-tracker/core';
import { db } from '@/lib/db/index';
import { aiSignals } from '@/lib/db/schema';
import { scrubHandles } from './coachContext';
import { PAYLOAD_MAX, signalPayload, signalsAllowed } from './signalRules';

// Memory v2 phase 1C: store what members did with the coach's answers. Only
// collected for now; turning signals into memory is phase 2. Handles are
// scrubbed and every row is small. No model call.
export async function saveSignals(userId: string, signals: AiSignal[], now = Date.now()): Promise<number> {
  const allowed = signalsAllowed(userId, signals.length, now);
  if (!allowed) return 0;
  const rows = signals.slice(0, allowed).map((s) => ({
    userId,
    kind: s.kind,
    action: s.action,
    contentLogId: s.contentLogId,
    payload: scrubHandles(signalPayload(s)).slice(0, PAYLOAD_MAX),
  }));
  await db.insert(aiSignals).values(rows);
  return rows.length;
}
