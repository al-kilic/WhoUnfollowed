import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

import { anthropicParams, type ModelRequest } from './provider';
import { chatTurns } from './chatTurns';

// Phase 3D: Ask coach as real turns. Each new question must reuse the previous
// request's bytes as its prefix, so the conversation so far is read from the
// cache; only the moving breakpoint and the new tail may differ.

const base = (messages: { role: 'user' | 'coach'; text: string }[]): ModelRequest => {
  const t = chatTurns(messages);
  return { model: 'claude-haiku-5-5', effort: 'low', system: 'rules', core: 'core', context: 'CONTEXT', history: t.history, user: `# Question\n${t.latest}\n\n# Task\nanswer`, maxTokens: 1000, mock: null };
};
const strip = (v: unknown): unknown => JSON.parse(JSON.stringify(v, (k, x: unknown) => (k === 'cache_control' ? undefined : x)));

describe('chatTurns', () => {
  it('splits history from the latest question, drops a leading coach greeting, keeps coach turns as JSON', () => {
    const t = chatTurns([{ role: 'coach', text: 'Hi!' }, { role: 'user', text: 'q1' }, { role: 'coach', text: 'a1' }, { role: 'user', text: 'q2' }]);
    expect(t).toEqual({ history: [{ role: 'user', text: 'q1' }, { role: 'assistant', text: '{"answer":"a1"}' }], latest: 'q2', first: 'q1' });
    expect(chatTurns([{ role: 'user', text: 'only' }])).toEqual({ history: [], latest: 'only', first: 'only' });
  });
});

describe('anthropicParams with history', () => {
  const one = anthropicParams(base([{ role: 'user', text: 'q1' }]));
  const two = anthropicParams(base([{ role: 'user', text: 'q1' }, { role: 'coach', text: 'a1' }, { role: 'user', text: 'q2' }]));
  const three = anthropicParams(base([{ role: 'user', text: 'q1' }, { role: 'coach', text: 'a1' }, { role: 'user', text: 'q2' }, { role: 'coach', text: 'a2' }, { role: 'user', text: 'q3' }]));

  it('a first question keeps the old single-turn shape', () => {
    expect(one.messages).toEqual([{ role: 'user', content: [{ type: 'text', text: 'CONTEXT' }, { type: 'text', text: '# Question\nq1\n\n# Task\nanswer' }] }]);
  });

  it('later questions: context on the first turn, breakpoint on the last past turn, task only on the new one', () => {
    expect(two.messages.map((m) => m.role)).toEqual(['user', 'assistant', 'user']);
    const first = two.messages[0]!.content as { text: string }[];
    expect(first.map((b) => b.text)).toEqual(['CONTEXT', 'q1']);
    const lastPast = two.messages[1]!.content as { text: string; cache_control?: unknown }[];
    expect(lastPast[0]).toMatchObject({ text: '{"answer":"a1"}', cache_control: { type: 'ephemeral' } });
    const tail = JSON.stringify(two.messages[2]);
    expect(tail).not.toContain('CONTEXT');
    expect(tail).not.toContain('cache_control');
    expect(two.system).toEqual(one.system);
  });

  it('each request\'s past turns reappear unchanged at the start of the next one', () => {
    const prev = strip(two.messages.slice(0, 2));
    expect(strip(three.messages.slice(0, 2))).toEqual(prev);
    // At most two breakpoints in all: the core, and the end of the past turns.
    expect(JSON.stringify(three).match(/cache_control/g)).toHaveLength(2);
  });
});
