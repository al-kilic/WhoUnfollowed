import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

import { postingEmail } from './proAiTemplates';

describe('postingEmail', () => {
  it('names the planned post and escapes it', () => {
    const e = postingEmail({ locale: 'en', post: { format: 'carousel', idea: 'Blue hour <3 & friends' } });
    expect(e.subject).toBe('Today you post: carousel');
    expect(e.html).toContain('Your plan has a carousel for today:');
    expect(e.html).toContain('Blue hour &lt;3 &amp; friends');
    expect(e.html).toContain('/app/plan');
  });
  it('works without a planned post', () => {
    const e = postingEmail({ locale: 'en', post: null });
    expect(e.subject).toBe('Today is a posting day');
    expect(e.text).toContain('Your plan and caption ideas are ready in Studio.');
  });
  it('cuts long ideas and translates', () => {
    const e = postingEmail({ locale: 'es', post: { format: 'photo', idea: 'x'.repeat(300) } });
    expect(e.subject).toBe('Hoy publicas: post de foto');
    expect(e.html).toContain('…');
    expect(e.html).toContain('/es/app/plan');
  });
  it('has no em dashes in any language', () => {
    for (const locale of ['en', 'es', 'pt'] as const) {
      for (const post of [null, { format: 'reel', idea: 'x' }]) expect(postingEmail({ locale, post }).text).not.toContain("\u2014");
    }
  });
});
