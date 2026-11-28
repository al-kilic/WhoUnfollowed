// Instructions for each Pro AI action.
//
// This is the open-source version: short, generic instructions that work with
// any model and keep every action functional for self-hosters. The hosted
// whounfollowed.co uses its own tuned instructions, which are not published.
// The reply formats (SHAPES) are the same in both, so the parsing and
// validation code (see @ig-tracker/core aiSchemas) is identical.

export type AiLocale = 'en' | 'es' | 'pt';

const LANGUAGE: Record<AiLocale, string> = { en: 'English', es: 'Spanish', pt: 'Brazilian Portuguese' };

export function baseRules(locale: AiLocale): string {
  return [
    'You are a helpful Instagram coach.',
    'Use only the facts in the context. Never invent numbers, dates or results.',
    'Never mention, guess or ask for any username or real person.',
    `Write every human-readable value in ${LANGUAGE[locale]}. Keep JSON keys and enum values in English.`,
    'memory: optional notes about this account to remember next time (at most 3 short facts); use empty lists if there is nothing new.',
    'Reply with only one JSON object, no prose before or after it.',
  ].join('\n');
}

export const SHAPES = {
  read: `{"headline": string (max 140 chars), "happening": string[1-3], "stop": {"what": string, "why": string}, "try": [{"what": string, "why": string}] (1-3), "memory": {"add": [{"type": string, "text": string, "tags": string[], "example"?: string}] (0-3), "confirm": string[] (note ids), "contradict": [{"id": string, "text": string}] (0-2), "corrected"?: {"text": string, "id"?: string}}}`,
  draft: `{"options": [{"text": string, "why": string}] (2-3 options), "memory": {"add": [{"type": string, "text": string, "tags": string[], "example"?: string}] (0-3), "confirm": string[] (note ids), "contradict": [{"id": string, "text": string}] (0-2), "corrected"?: {"text": string, "id"?: string}}}`,
  check: `{"overall": integer 0-100, "scores": [{"criterion": "hook"|"clarity"|"value"|"fit_you"|"fit_trend"|"action", "score": integer 1-10, "reason": string}] (exactly 6, one per criterion), "fixes": [{"what": string, "why": string}] (1-3, most important first), "altHooks": string[0-2], "caption": string (improved caption, same voice), "cover": string[0-3] (cover image notes, empty if no image), "memory": {"add": [{"type": string, "text": string, "tags": string[], "example"?: string}] (0-3), "confirm": string[] (note ids), "contradict": [{"id": string, "text": string}] (0-2), "corrected"?: {"text": string, "id"?: string}}}`,
  ideas: `{"ideas": [{"format": "reel"|"carousel"|"photo"|"story", "idea": string, "hook": string, "why": string}] (exactly 5), "memory": {"add": [{"type": string, "text": string, "tags": string[], "example"?: string}] (0-3), "confirm": string[] (note ids), "contradict": [{"id": string, "text": string}] (0-2), "corrected"?: {"text": string, "id"?: string}}}`,
  insights: `{"winners": [{"post": "P#", "why": string}] (1-3), "losers": [{"post": "P#", "why": string}] (0-3), "patterns": string[1-5] (what the photos and numbers show: subject, light, angle, composition, place, caption), "shootNext": [{"what": string, "why": string}] (1-3), "cropAndCarousel": string[0-3] (how to crop and order slides), "tips": [{"post": "P#", "tip": string}] (one short, concrete tip for every post, about that photo), "memory": {"add": [{"type": string, "text": string, "tags": string[], "example"?: string}] (0-3), "confirm": string[] (note ids), "contradict": [{"id": string, "text": string}] (0-2), "corrected"?: {"text": string, "id"?: string}}}`,
  chat: `{"answer": string (plain text, at most 1200 characters; short paragraphs, or lines starting with "- " for steps), "followUps": string[0-3] (short questions the user might ask next, at most 80 characters each), "memory": {"add": [{"type": string, "text": string, "tags": string[], "example"?: string}] (0-3), "confirm": string[] (note ids), "contradict": [{"id": string, "text": string}] (0-2), "corrected"?: {"text": string, "id"?: string}}}`,
  photoStyle: `{"summary": string (at most 300 characters: their photographic style in plain words), "findings": [{"text": string (at most 160 characters), "tags": string[0-4] (lowercase, e.g. "light:golden-hour", "subject:street", "format:carousel")}] (2-6), "tryNext": string[0-2] (a subject or style they already do well but rarely post), "memory": {"add": [{"type": string, "text": string, "tags": string[], "example"?: string}] (0-2), "confirm": string[] (note ids), "contradict": [{"id": string, "text": string}] (0-2), "corrected"?: {"text": string, "id"?: string}}}`,
  plan: `{"summary": string, "principles": string[1-5], "weeks": [{"week": 1-5, "theme": string, "posts": [{"day": "mon"|"tue"|"wed"|"thu"|"fri"|"sat"|"sun", "format": "reel"|"carousel"|"photo"|"story", "idea": string, "hook": string}]}] (4 weeks), "memory": {"add": [{"type": string, "text": string, "tags": string[], "example"?: string}] (0-3), "confirm": string[] (note ids), "contradict": [{"id": string, "text": string}] (0-2), "corrected"?: {"text": string, "id"?: string}}}`,
} as const;

export const TASKS = {
  read: 'Read the newest export and explain in plain words what changed and why. Then give one thing to stop doing and up to three things to try next.',
  draft: (kind: string, format: string, tone = 'voice', length = 'medium') =>
    `Write a ${kind} for a ${format} post. Tone: ${tone}. Length: ${length}. Give 2 or 3 options, each with one line on why it could work.`,
  check: 'Score this draft on each criterion from 1 to 10 with a short reason, give an overall score, and list up to three fixes.',
  ideas: (theme: string) => `Suggest five post ideas${theme ? ` about: ${theme}` : ''}, each with a format, a hook and why it fits this account.`,
  chat: (deep: boolean) => (deep
    ? 'Answer the question in depth, using the context. Offer up to three follow-up questions.'
    : 'Answer the question briefly, using the context. Offer up to three follow-up questions.'),
  insights: 'Look at the posts and their numbers. Name the ones that did best and worst and why, the patterns you see, and what to do next.',
  photoStyle: 'Describe the photographic style of these photos in plain words, with a few short findings.',
  planRevise: (feedback: string) => `Revise the current plan following this feedback and keep everything else: ${feedback}`,
  plan: (r: { postsPerWeek: number; focus: string; formats: string[]; photos: string; readyCount: number | null; places: string; avoid: string; time: string }) => [
    `Write a 4-week post plan with exactly ${r.postsPerWeek} posts a week, only in these formats: ${r.formats.join(', ')}.`,
    r.focus ? `What they would like to post: ${r.focus}.` : '',
    r.avoid ? `Avoid: ${r.avoid}.` : '',
    'Every post gets a day, a format, a specific idea and a hook. Start with a short summary.',
  ].filter(Boolean).join('\n'),
} as const;
