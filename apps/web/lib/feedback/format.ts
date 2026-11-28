import type { SiteFeedbackInput, SiteFeedbackType } from '@ig-tracker/core';

// What the founder receives from the feedback widget: always English labels,
// whatever language the visitor used. Pure, so it's easy to test.

export const TYPE_LABEL: Record<SiteFeedbackType, string> = {
  bug: 'Bug', idea: 'Idea', confusing: 'Confusing', missing: 'Missing feature', praise: 'Praise',
};
const LANG: Record<SiteFeedbackInput['locale'], string> = { en: 'English', es: 'Spanish', pt: 'Portuguese' };

// The note as it should be read: the English version, and the original when
// it was translated or couldn't be.
export interface FeedbackText {
  english: string | null; // null when translation was needed but failed or was skipped
  original: string;
}

export interface FormattedFeedback {
  subject: string;
  lines: [label: string, value: string][];
  body: string; // the note block, English first
}

export function formatFeedback(f: SiteFeedbackInput, t: FeedbackText): FormattedFeedback {
  const lines: [string, string][] = [['Type', TYPE_LABEL[f.type]]];
  if (f.rating) lines.push(['Rating', `${f.rating}/5`]);
  if (f.where) lines.push(['Where', f.where]);
  lines.push(['Language', `${LANG[f.locale]} (${f.locale})`]);
  if (f.email) lines.push(['Reply to', f.email]);

  let body: string;
  if (f.locale === 'en') body = t.original;
  else if (t.english) body = `${t.english}\n\nOriginal (${f.locale}):\n${t.original}`;
  else body = `[not translated, ${f.locale}] ${t.original}`;

  const subject = `Feedback: ${TYPE_LABEL[f.type]}${f.rating ? ` (${f.rating}/5)` : ''}`;
  return { subject, lines, body };
}

export function feedbackPlainText(x: FormattedFeedback): string {
  return `${x.lines.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\nMessage:\n${x.body}`;
}
