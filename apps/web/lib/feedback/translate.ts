import 'server-only';
import type { FeedbackText } from './format';

// The homepage feedback widget is public (no account), so it must never call a
// paid AI model: anyone could run up the bill (founder rule, 2026-11-27: no AI
// spend for anyone who hasn't paid). Non-English notes reach the founder as
// written, with english: null; paste them into a translator if needed.
export async function toEnglish(text: string, locale: 'en' | 'es' | 'pt'): Promise<FeedbackText> {
  if (locale === 'en') return { english: text, original: text };
  return { english: null, original: text };
}
