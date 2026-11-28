import { describe, expect, it } from 'vitest';
import { appendCoachNotes, buildInitialMemory, COACH_HEADING, enforceCap } from './memoryText';

const onboarding = {
  accountType: 'creator' as const,
  niche: 'Street photography',
  goal: '10k followers by June',
  whatYouPost: 'Night walks in Istanbul',
  voiceSamples: ['Rain again.\nGood.'],
};

describe('buildInitialMemory', () => {
  it('writes the onboarding answers and a coach section', () => {
    const m = buildInitialMemory(onboarding, '2026-11-11');
    expect(m).toContain('Creator. Niche: Street photography.');
    expect(m).toContain('> Rain again. Good.');
    expect(m).toContain(`${COACH_HEADING}\n- 2026-11-11 Memory started.`);
  });
});

describe('appendCoachNotes', () => {
  it('adds dated notes and skips ones memory already says', () => {
    const m = buildInitialMemory(onboarding, '2026-11-11');
    const r = appendCoachNotes(m, ['Carousels of night shots work best', 'night walks in istanbul'], '2026-11-12');
    expect(r.added).toEqual(['Carousels of night shots work best']);
    expect(r.content).toContain('- 2026-11-12 Carousels of night shots work best');
  });

  it('adds the coach heading if the user deleted it', () => {
    const r = appendCoachNotes('## About me\nHi', ['Posting Tuesdays works'], '2026-11-12');
    expect(r.content).toContain(`${COACH_HEADING}\n- 2026-11-12 Posting Tuesdays works`);
  });
});

describe('enforceCap', () => {
  it('drops the oldest coach lines first and keeps the user part', () => {
    const user = '## About me\nKeep this.\n';
    const coach = `${COACH_HEADING}\n- 2026-01-01 old note\n- 2026-11-01 new note\n`;
    const out = enforceCap(user + coach, user.length + COACH_HEADING.length + 30);
    expect(out).toContain('Keep this.');
    expect(out).toContain('new note');
    expect(out).not.toContain('old note');
  });
});

describe('localized memory', () => {
  it('starts memory in Spanish and still appends under the Spanish coach heading', () => {
    const m = buildInitialMemory(onboarding, '2026-11-11', 'es');
    expect(m).toContain('## Sobre mí');
    expect(m).toContain('## Notas de tu coach\n- 2026-11-11 Memoria iniciada.');
    const r = appendCoachNotes(m, ['Los carruseles funcionan'], '2026-11-12');
    expect(r.content).not.toContain(COACH_HEADING);
    expect(r.content).toContain('- 2026-11-12 Los carruseles funcionan');
  });

  it('caps a Portuguese memory by dropping the oldest coach lines', () => {
    const user = '## Sobre mim\nOi\n';
    const coach = '## Notas do seu coach\n- 2026-01-01 old note\n- 2026-11-01 new note\n';
    const out = enforceCap(user + coach, user.length + 30 + 25);
    expect(out).toContain('new note');
    expect(out).not.toContain('old note');
  });
});
