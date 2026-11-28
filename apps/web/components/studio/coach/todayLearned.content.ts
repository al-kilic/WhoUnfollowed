import type { AppLocale } from '@/i18n/routing';

// The slim weekly card on Today: "This week your coach learned N things".
export interface LearnedContent {
  title: (n: number) => string;
  open: string;
  close: string;
  kinds: { learned: string; confirmed: string; fading: string; disputed: string; forgot: string };
  manage: string;
}

const en: LearnedContent = {
  title: (n) => `This week your coach learned ${n === 1 ? 'one thing' : `${n} things`}`,
  open: 'Show', close: 'Hide',
  kinds: { learned: 'New', confirmed: 'Confirmed', fading: 'Fading', disputed: 'Unsure', forgot: 'Forgotten' },
  manage: 'See everything your coach remembers',
};
const es: LearnedContent = {
  title: (n) => `Esta semana tu coach aprendió ${n === 1 ? 'una cosa' : `${n} cosas`}`,
  open: 'Ver', close: 'Ocultar',
  kinds: { learned: 'Nuevo', confirmed: 'Confirmado', fading: 'Se olvida', disputed: 'Dudoso', forgot: 'Olvidado' },
  manage: 'Ver todo lo que recuerda tu coach',
};
const pt: LearnedContent = {
  title: (n) => `Esta semana seu coach aprendeu ${n === 1 ? 'uma coisa' : `${n} coisas`}`,
  open: 'Ver', close: 'Ocultar',
  kinds: { learned: 'Novo', confirmed: 'Confirmado', fading: 'Sumindo', disputed: 'Incerto', forgot: 'Esquecido' },
  manage: 'Ver tudo que seu coach lembra',
};

const ALL: Record<AppLocale, LearnedContent> = { en, es, pt };
export const getLearnedContent = (l: AppLocale): LearnedContent => ALL[l] ?? en;
