import { afterEach, describe, expect, it } from 'vitest';
import type { AiSignal } from '@ig-tracker/core';
import { PAYLOAD_MAX, resetSignalLimits, SIGNALS_PER_MINUTE, signalPayload, signalsAllowed } from './signalRules';
import { scrubHandles } from './coachContext';

afterEach(() => resetSignalLimits());

describe('signal rules', () => {
  it('caps signals per member per minute, and frees room after a minute', () => {
    expect(signalsAllowed('u1', SIGNALS_PER_MINUTE - 5, 0)).toBe(SIGNALS_PER_MINUTE - 5);
    expect(signalsAllowed('u1', 20, 1000)).toBe(5);
    expect(signalsAllowed('u1', 1, 2000)).toBe(0);
    expect(signalsAllowed('u2', 3, 2000)).toBe(3);
    expect(signalsAllowed('u1', 4, 61_001)).toBe(4);
  });

  it('stores only the payload, small, with handles scrubbed', () => {
    const s: AiSignal = { kind: 'draft_edit', action: 'draft', contentLogId: null, option: 0,
      diff: { lengthDelta: -3, wordsBefore: 3, wordsAfter: 2, emojiDelta: 0, hashtagDelta: -1, lineBreakDelta: 0, caseChange: 'none', removed: ['#film'], added: [] },
      before: 'Shot with @rui.analog '.repeat(14).slice(0, 300), after: 'x'.repeat(300) };
    const p = scrubHandles(signalPayload(s));
    expect(p.length).toBeLessThanOrEqual(PAYLOAD_MAX);
    expect(p).not.toContain('"kind"');
    expect(p).not.toMatch(/(^|[^\w.])@[A-Za-z0-9._]{2,}/);
    expect(JSON.parse(signalPayload({ kind: 'thumb', action: 'read', contentLogId: null, up: true, chip: null }))).toEqual({ up: true, chip: null });
  });
});
