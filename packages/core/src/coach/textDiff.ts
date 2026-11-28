// How a member edited a draft before using it: a word-level diff summed up as
// numbers plus a few short phrases. Pure, no dependencies (LCS on words).
// The coach learns from this (shorter, no hashtags, a phrase they always cut),
// so it must stay small and hold no usernames; callers scrub handles too.

export interface TextDiff {
  lengthDelta: number;
  wordsBefore: number;
  wordsAfter: number;
  emojiDelta: number;
  hashtagDelta: number;
  lineBreakDelta: number;
  // 'lower' when they turned it all lowercase, 'upper' all caps, else 'none'.
  caseChange: 'none' | 'lower' | 'upper';
  // Up to 3 runs of removed and added words, each at most 60 characters.
  removed: string[];
  added: string[];
}

const MAX_WORDS = 400;
const MAX_PHRASES = 3;
const MAX_PHRASE = 60;
const EMOJI = /\p{Extended_Pictographic}/gu;
const HASHTAG = /(^|\s)#[\p{L}\p{N}_]+/gu;

const count = (s: string, re: RegExp) => (s.match(re) ?? []).length;
const words = (s: string) => s.split(/\s+/).filter(Boolean).slice(0, MAX_WORDS);
const clip = (s: string) => (s.length > MAX_PHRASE ? `${s.slice(0, MAX_PHRASE - 1).trimEnd()}…` : s);

// Longest common subsequence table over words, then a walk that yields
// runs of removed (only in a) and added (only in b) words, in order.
function runs(a: string[], b: string[]): { removed: string[]; added: string[] } {
  const n = a.length, m = b.length;
  const t: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) {
    t[i]![j] = a[i] === b[j] ? t[i + 1]![j + 1]! + 1 : Math.max(t[i + 1]![j]!, t[i]![j + 1]!);
  }
  const removed: string[] = [], added: string[] = [];
  let rem: string[] = [], add: string[] = [];
  const flush = () => {
    if (rem.length) removed.push(clip(rem.join(' ')));
    if (add.length) added.push(clip(add.join(' ')));
    rem = []; add = [];
  };
  let i = 0, j = 0;
  while (i < n || j < m) {
    if (i < n && j < m && a[i] === b[j]) { flush(); i++; j++; }
    else if (j >= m || (i < n && t[i + 1]![j]! >= t[i]![j + 1]!)) rem.push(a[i++]!);
    else add.push(b[j++]!);
  }
  flush();
  return { removed: removed.slice(0, MAX_PHRASES), added: added.slice(0, MAX_PHRASES) };
}

export function textDiff(before: string, after: string): TextDiff {
  const a = words(before), b = words(after);
  const letters = (s: string) => /\p{L}/u.test(s);
  const caseChange = letters(after) && after !== before
    ? after === after.toLowerCase() && before !== before.toLowerCase() ? 'lower'
      : after === after.toUpperCase() && before !== before.toUpperCase() ? 'upper' : 'none'
    : 'none';
  return {
    lengthDelta: after.length - before.length,
    wordsBefore: a.length,
    wordsAfter: b.length,
    emojiDelta: count(after, EMOJI) - count(before, EMOJI),
    hashtagDelta: count(after, HASHTAG) - count(before, HASHTAG),
    lineBreakDelta: count(after, /\n/g) - count(before, /\n/g),
    caseChange,
    ...runs(a, b),
  };
}
