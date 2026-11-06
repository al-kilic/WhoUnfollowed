import type { AppLocale } from '@/i18n/routing';

// Copy for the "Something big is coming: Creator AI" teaser shown on
// /pricing, the results page and the homepage pricing section. Deliberately
// vague: it names the plan and collects a waitlist, nothing more.
export interface CreatorAiTeaserContent {
  eyebrow: string;
  title: string;
  body: string;
  placeholder: string;
  cta: string;
  sending: string;
  done: string;
  error: string;
  disposable: string;
  note: string;
}

const EN: CreatorAiTeaserContent = {
  eyebrow: 'Coming next',
  title: 'Something big is coming: Creator AI',
  body: 'A new plan for creators who want to grow, not just track. Same privacy rules. Join the list to hear first.',
  placeholder: 'you@email.com',
  cta: 'Tell me first',
  sending: 'Adding...',
  done: 'You\'re on the list. We\'ll email you first.',
  error: 'That didn\'t work. Check the address and try again.',
  disposable: 'Please use a regular email address, not a temporary one.',
  note: 'Only your email is stored. Leave the list any time.',
};

const ES: CreatorAiTeaserContent = {
  eyebrow: 'Lo próximo',
  title: 'Algo grande se acerca: Creator AI',
  body: 'Un nuevo plan para creadores que quieren crecer, no solo medir. Las mismas reglas de privacidad. Apúntate para enterarte primero.',
  placeholder: 'tu@email.com',
  cta: 'Avísame primero',
  sending: 'Añadiendo...',
  done: 'Estás en la lista. Te escribiremos primero.',
  error: 'No funcionó. Revisa el email e inténtalo de nuevo.',
  disposable: 'Usa un correo normal, no uno temporal.',
  note: 'Solo guardamos tu email. Sal de la lista cuando quieras.',
};

const PT: CreatorAiTeaserContent = {
  eyebrow: 'Vem aí',
  title: 'Algo grande está chegando: Creator AI',
  body: 'Um novo plano para criadores que querem crescer, não só acompanhar. As mesmas regras de privacidade. Entre na lista para saber primeiro.',
  placeholder: 'voce@email.com',
  cta: 'Me avise primeiro',
  sending: 'Adicionando...',
  done: 'Você está na lista. Vamos te avisar primeiro.',
  error: 'Não funcionou. Confira o email e tente de novo.',
  disposable: 'Use um e-mail normal, não um temporário.',
  note: 'Só guardamos seu email. Saia da lista quando quiser.',
};

export function getCreatorAiTeaserContent(locale: AppLocale): CreatorAiTeaserContent {
  if (locale === 'es') return ES;
  if (locale === 'pt') return PT;
  return EN;
}
