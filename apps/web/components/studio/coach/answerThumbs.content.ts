import type { AppLocale } from '@/i18n/routing';

// Copy for the thumbs under a coach answer. Never mentions how the coach works.
const en = {
  ask: 'Was this useful?', up: 'Useful', down: 'Not useful', thanks: 'Thanks. Your coach will remember.', why: 'What was off?',
  chips: { not_my_voice: 'Not my voice', too_generic: 'Too generic', wrong_facts: 'Wrong facts', too_long: 'Too long', already_do: 'I already do this' },
};
type ThumbsContent = typeof en;
const es: ThumbsContent = {
  ask: '¿Te sirvió?', up: 'Útil', down: 'No me sirvió', thanks: 'Gracias. Tu coach lo recordará.', why: '¿Qué falló?',
  chips: { not_my_voice: 'No es mi voz', too_generic: 'Muy genérico', wrong_facts: 'Datos incorrectos', too_long: 'Muy largo', already_do: 'Ya lo hago' },
};
const pt: ThumbsContent = {
  ask: 'Isso ajudou?', up: 'Útil', down: 'Não ajudou', thanks: 'Obrigado. Seu coach vai lembrar.', why: 'O que não funcionou?',
  chips: { not_my_voice: 'Não é minha voz', too_generic: 'Genérico demais', wrong_facts: 'Dados errados', too_long: 'Longo demais', already_do: 'Já faço isso' },
};

export function getAnswerThumbsContent(locale: AppLocale): ThumbsContent {
  return locale === 'es' ? es : locale === 'pt' ? pt : en;
}
