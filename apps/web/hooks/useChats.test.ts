import { describe, expect, it } from 'vitest';
import { chatTitle, contextTurns } from './useChats';

describe('chatTitle', () => {
  it('keeps short questions and tidies spaces', () => {
    expect(chatTitle('  Why did   I lose followers? ')).toBe('Why did I lose followers?');
  });
  it('cuts long questions at a word', () => {
    const t = chatTitle('What should I post this week if my best month was November and Reels did better than carousels?');
    expect(t.length).toBeLessThanOrEqual(60);
    expect(t.endsWith('…')).toBe(true);
    expect(t).not.toMatch(/\s…$/);
  });
});

describe('contextTurns', () => {
  const mk = (n: number) => Array.from({ length: n }, (_, i) => ({ role: (i % 2 ? 'coach' : 'user') as 'user' | 'coach', text: `t${i}`, followUps: ['x'], deep: true }));

  it('sends everything while short, without local-only fields', () => {
    const out = contextTurns(mk(11));
    expect(out).toHaveLength(11);
    expect(out[0]).toEqual({ role: 'user', text: 't0' });
  });

  it('moves the window in steps, so its start holds for a few questions and always opens on the member', () => {
    const starts = [13, 15, 17, 19, 21, 23, 25].map((n) => contextTurns(mk(n))[0]!.text);
    expect(starts).toEqual(['t6', 't6', 't6', 't12', 't12', 't12', 't18']);
    for (const n of [13, 15, 17, 19, 25]) {
      const out = contextTurns(mk(n));
      expect(out.length).toBeLessThanOrEqual(12);
      expect(out[0]!.role).toBe('user');
      expect(out.at(-1)!.text).toBe(`t${n - 1}`);
    }
  });
});
