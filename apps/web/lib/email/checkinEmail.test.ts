import { describe, it, expect, vi } from 'vitest';

vi.mock('server-only', () => ({}));

import { checkinEmail } from './proAiTemplates';

const progress = { current: 1500, gained: 500, left: 500, pct: 50, perWeekNeeded: 40, perWeekSoFar: 20, status: 'behind' as const };

describe('goal check-in email with goals per platform', () => {
  it('one goal reads as before, with the platform in the nudge', () => {
    const e = checkinEmail({ locale: 'en', goals: [{ platform: 'threads', kind: 'followers', target: 2000, progress }] });
    expect(e.subject).toBe('Your goal check-in: 1,500 of 2,000');
    expect(e.text).toContain('Download a new export from Threads');
    expect(e.html).not.toContain('<h2');
  });

  it('two goals list each under its platform, with a deadline line only where due', () => {
    const e = checkinEmail({ locale: 'es', goals: [
      { platform: 'instagram', kind: 'followers', target: 2000, progress, deadlineDays: 4 },
      { platform: 'threads', kind: 'posts_week', target: 3, current: 2 },
    ] });
    expect(e.subject).toBe('Tu seguimiento: 2 objetivos');
    expect(e.text).toContain('Instagram: ');
    expect(e.text).toContain('Threads: ');
    expect(e.html.match(/<h2/g)?.length).toBe(2);
    expect(e.text.match(/Quedan 4 días/g)?.length).toBe(1);
    expect(e.text).not.toContain('—');
  });
});
