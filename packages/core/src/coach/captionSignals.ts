// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

// Small, language-light readings of one caption, shared by the voice profile
// and the content history. English, Spanish and Portuguese patterns.

const HASHTAG = /(^|[^\p{L}\p{N}_])#[\p{L}\p{N}_]+/gu;
const EMOJI = /\p{Extended_Pictographic}/gu;
const CTA = /(?<![\p{L}])(link in (my )?bio|comment|tell me|let me know|save (this|it|for later)|share (this|it|with)|follow (me|for|along)|dm me|tap the|swipe|sign up|subscribe|comenta|cu[ée]ntame|d[ií]me|gu[aá]rdalo|guarda (esto|este|esta)|comparte|s[ií]gueme|enlace en (la |mi )?bio|comente|me conta|salve (esse|este|esta|pra)|compartilhe|me siga|link na bio)(?![\p{L}])/iu;
const FIRST_PERSON = /(?<![\p{L}])(i|i'm|i've|i'd|my|me|mine|myself|eu|meu|minha|meus|minhas|comigo|yo|mi|mis|conmigo)(?![\p{L}'])/iu;

export function countHashtags(text: string): number {
  return (text.match(HASHTAG) ?? []).length;
}

export function countEmoji(text: string): number {
  return (text.match(EMOJI) ?? []).length;
}

export function isQuestion(text: string): boolean {
  return /[?¿]/.test(text);
}

export function hasCta(text: string): boolean {
  return CTA.test(text);
}

export function isFirstPerson(text: string): boolean {
  return FIRST_PERSON.test(text);
}

// The caption without its hashtag block and with whitespace tidied.
export function captionBody(text: string): string {
  return text.replace(HASHTAG, '$1').replace(/[ \t]+/g, ' ').replace(/\s*\n\s*/g, '\n').trim();
}

export function wordCount(text: string): number {
  return (captionBody(text).match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) ?? []).length;
}

export function median(values: readonly number[]): number | null {
  if (!values.length) return null;
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid]! : (s[mid - 1]! + s[mid]!) / 2;
}

// A share of a count, 0 to 1, two decimals.
export function share(n: number, of: number): number {
  return of > 0 ? Math.round((n / of) * 100) / 100 : 0;
}
