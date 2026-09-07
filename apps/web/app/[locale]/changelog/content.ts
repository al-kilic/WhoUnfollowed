import type { AppLocale } from '@/i18n/routing';

// Chrome only. Changelog entries themselves stay English-only on purpose:
// they're added most sessions as English prose, and fully translating every
// entry (and every future one) isn't sustainable for a fast-changing log.
// This still gives ES/PT visitors a localized page shell and tag labels.
export interface ChangelogContent {
  eyebrow: string;
  headline: string;
  subhead: string;
  tagLabels: Record<'launch' | 'feature' | 'improvement' | 'fix', string>;
  backToHome: string;
}

const EN: ChangelogContent = {
  eyebrow: 'CHANGELOG',
  headline: "What's new.",
  subhead: 'Updates, fixes, and improvements to WhoUnfollowed.',
  tagLabels: { launch: 'Launch', feature: 'Feature', improvement: 'Improvement', fix: 'Fix' },
  backToHome: 'Back to WhoUnfollowed',
};

const ES: ChangelogContent = {
  eyebrow: 'REGISTRO DE CAMBIOS',
  headline: 'Novedades.',
  subhead: 'Actualizaciones, correcciones y mejoras de WhoUnfollowed.',
  tagLabels: { launch: 'Lanzamiento', feature: 'Función', improvement: 'Mejora', fix: 'Corrección' },
  backToHome: 'Volver a WhoUnfollowed',
};

const PT: ChangelogContent = {
  eyebrow: 'CHANGELOG',
  headline: 'Novidades.',
  subhead: 'Atualizações, correções e melhorias do WhoUnfollowed.',
  tagLabels: { launch: 'Lançamento', feature: 'Recurso', improvement: 'Melhoria', fix: 'Correção' },
  backToHome: 'Voltar ao WhoUnfollowed',
};

export function getChangelogContent(locale: AppLocale): ChangelogContent {
  if (locale === 'es') return ES;
  if (locale === 'pt') return PT;
  return EN;
}
