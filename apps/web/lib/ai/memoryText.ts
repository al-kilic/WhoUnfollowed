import type { AiOnboardingInput } from '@ig-tracker/core';
import { MEMORY_MAX_CHARS } from './config';

// memory.md is plain markdown the user can read and edit. The coach only ever
// appends dated lines under COACH_HEADING; everything above it is the user's,
// and the user's lines always win. When memory grows past the cap, the oldest
// coach lines go first; the user's own text is never cut.

export type MemoryLang = 'en' | 'es' | 'pt';

// Headings and fixed lines of the starting memory, in the user's language.
const TEMPLATE: Record<MemoryLang, {
  about: string; voice: string; works: string; doesnt: string; coach: string; started: string; noVoice: string;
  niche: string; goal: string; post: string; account: Record<AiOnboardingInput['accountType'], string>;
}> = {
  en: {
    about: '## About me', voice: '## My voice', works: '## What works', doesnt: "## What doesn't", coach: '## Notes from your coach',
    started: 'Memory started.', noVoice: '_No examples yet. Add a few of your captions so drafts sound like you._',
    niche: 'Niche', goal: 'Goal', post: 'What I post', account: { personal: 'Personal account', creator: 'Creator', business: 'Business' },
  },
  es: {
    about: '## Sobre mí', voice: '## Mi voz', works: '## Lo que funciona', doesnt: '## Lo que no funciona', coach: '## Notas de tu coach',
    started: 'Memoria iniciada.', noVoice: '_Aún no hay ejemplos. Añade algunos de tus textos para que los borradores suenen como tú._',
    niche: 'Nicho', goal: 'Objetivo', post: 'Lo que publico', account: { personal: 'Cuenta personal', creator: 'Creador', business: 'Negocio' },
  },
  pt: {
    about: '## Sobre mim', voice: '## Minha voz', works: '## O que funciona', doesnt: '## O que não funciona', coach: '## Notas do seu coach',
    started: 'Memória iniciada.', noVoice: '_Ainda sem exemplos. Adicione algumas legendas suas para os rascunhos soarem como você._',
    niche: 'Nicho', goal: 'Meta', post: 'O que eu posto', account: { personal: 'Conta pessoal', creator: 'Criador', business: 'Negócio' },
  },
};

export const COACH_HEADING = TEMPLATE.en.coach;
// The coach section can be in any language; appends and the cap look for all.
const COACH_HEADINGS = Object.values(TEMPLATE).map((t) => t.coach);
const coachHeadingIn = (content: string) => COACH_HEADINGS.find((h) => content.includes(h)) ?? null;

export function buildInitialMemory(input: AiOnboardingInput, today: string, lang: MemoryLang = 'en'): string {
  const t = TEMPLATE[lang];
  const voice = input.voiceSamples.length
    ? input.voiceSamples.map((s) => `> ${s.replace(/\s*\n\s*/g, ' ')}`).join('\n')
    : t.noVoice;
  return [
    t.about,
    `${t.account[input.accountType]}. ${t.niche}: ${input.niche}.`,
    `${t.goal}: ${input.goal}`,
    `${t.post}: ${input.whatYouPost}`,
    '',
    t.voice,
    voice,
    '',
    t.works,
    '',
    t.doesnt,
    '',
    t.coach,
    `- ${today} ${t.started}`,
    '',
  ].join('\n');
}

const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

// Adds new coach notes (dated) unless memory already says the same thing.
export function appendCoachNotes(content: string, notes: readonly string[], today: string): { content: string; added: string[] } {
  const existing = norm(content);
  const added = notes
    .map((n) => n.replace(/\s+/g, ' ').trim())
    .filter((n) => n.length > 0 && !existing.includes(norm(n)));
  if (added.length === 0) return { content, added };
  let body = content.trimEnd();
  if (!coachHeadingIn(body)) body += `\n\n${COACH_HEADING}`;
  body += '\n' + added.map((n) => `- ${today} ${n}`).join('\n') + '\n';
  return { content: enforceCap(body), added };
}

// Drops the oldest coach lines until memory fits. The user's part is kept whole.
export function enforceCap(content: string, max: number = MEMORY_MAX_CHARS): string {
  if (content.length <= max) return content;
  const heading = coachHeadingIn(content);
  if (!heading) return content;
  const at = content.indexOf(heading);
  const head = content.slice(0, at + heading.length);
  const lines = content.slice(at + heading.length).split('\n').filter((l) => l.trim() !== '');
  while (lines.length > 0 && head.length + lines.join('\n').length + 2 > max) lines.shift();
  return `${head}\n${lines.join('\n')}\n`;
}
