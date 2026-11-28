import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

import { feedbackPlainText, formatFeedback } from './format';
import { toEnglish } from './translate';

const base = { type: 'bug' as const, message: 'x', locale: 'en' as const };

describe('formatFeedback', () => {
  it('uses fixed English labels whatever the locale, and includes the locale', () => {
    const f = formatFeedback({ ...base, type: 'missing', locale: 'es', rating: 4, where: '/es/pricing', email: 'a@b.co' }, { english: 'It has no dark mode', original: 'No tiene modo oscuro' });
    expect(f.subject).toBe('Feedback: Missing feature (4/5)');
    expect(f.lines).toEqual([['Type', 'Missing feature'], ['Rating', '4/5'], ['Where', '/es/pricing'], ['Language', 'Spanish (es)'], ['Reply to', 'a@b.co']]);
    expect(f.body).toBe('It has no dark mode\n\nOriginal (es):\nNo tiene modo oscuro');
  });

  it('tags an untranslated note with its language', () => {
    const f = formatFeedback({ ...base, locale: 'pt' }, { english: null, original: 'Não funciona' });
    expect(f.body).toBe('[not translated, pt] Não funciona');
  });

  it('leaves English notes as they are and skips optional lines', () => {
    const f = formatFeedback(base, { english: 'x', original: 'x' });
    expect(f.lines).toEqual([['Type', 'Bug'], ['Language', 'English (en)']]);
    expect(feedbackPlainText(f)).toBe('Type: Bug\nLanguage: English (en)\n\nMessage:\nx');
  });
});

describe('toEnglish', () => {
  // Public form: never a paid model call (founder rule, 2026-11-27).
  it('keeps English as it is and never translates other languages', async () => {
    expect(await toEnglish('hi', 'en')).toEqual({ english: 'hi', original: 'hi' });
    expect(await toEnglish('Hola', 'es')).toEqual({ english: null, original: 'Hola' });
    expect(await toEnglish('Olá', 'pt')).toEqual({ english: null, original: 'Olá' });
  });
});
