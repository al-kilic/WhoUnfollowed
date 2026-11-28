import { UPLOAD_LIMITS } from '@/lib/uploadLimits';

// "Paste captions instead" for Learn my voice: captions separated by an empty
// line, trimmed, de-duplicated, capped. Handles and links are removed later by
// pickVoiceExemplars, before anything leaves the browser.
export const PASTE_MIN = 5;
export const PASTE_MAX = 60;

export function splitPastedCaptions(text: string): string[] {
  const clipped = text.slice(0, UPLOAD_LIMITS.client.maxPastedChars);
  const out: string[] = [];
  const seen = new Set<string>();
  for (const part of clipped.split(/\r?\n\s*\r?\n/)) {
    const c = part.trim();
    if (c.length < 3 || seen.has(c)) continue;
    seen.add(c);
    out.push(c);
    if (out.length >= PASTE_MAX) break;
  }
  return out;
}
