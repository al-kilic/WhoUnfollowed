import type { AppLocale } from '@/i18n/routing';

export interface CompareDetailUiContent {
  allComparisons: string;
  whoUnfollowedVs: string;
  featureHeader: string;
  verdictLabel: string;
  relatedReadingLabel: string;
  relatedReadingLink: string;
  ctaButton: string;
  moreComparisonsLabel: string;
  vsPrefix: string;
}

const EN: CompareDetailUiContent = {
  allComparisons: 'All comparisons',
  whoUnfollowedVs: 'WhoUnfollowed vs',
  featureHeader: 'Feature',
  verdictLabel: 'Verdict',
  relatedReadingLabel: 'Related reading',
  relatedReadingLink: 'Why Instagram follower trackers ask for your password →',
  ctaButton: 'Try WhoUnfollowed free →',
  moreComparisonsLabel: 'More comparisons',
  vsPrefix: 'WhoUnfollowed vs',
};

const ES: CompareDetailUiContent = {
  allComparisons: 'Todas las comparaciones',
  whoUnfollowedVs: 'WhoUnfollowed vs',
  featureHeader: 'Función',
  verdictLabel: 'Veredicto',
  relatedReadingLabel: 'Lectura relacionada',
  relatedReadingLink: 'Por qué los rastreadores de seguidores de Instagram piden tu contraseña →',
  ctaButton: 'Prueba WhoUnfollowed gratis →',
  moreComparisonsLabel: 'Más comparaciones',
  vsPrefix: 'WhoUnfollowed vs',
};

const PT: CompareDetailUiContent = {
  allComparisons: 'Todas as comparações',
  whoUnfollowedVs: 'WhoUnfollowed vs',
  featureHeader: 'Recurso',
  verdictLabel: 'Veredito',
  relatedReadingLabel: 'Leitura relacionada',
  relatedReadingLink: 'Por que os rastreadores de seguidores do Instagram pedem sua senha →',
  ctaButton: 'Experimente o WhoUnfollowed grátis →',
  moreComparisonsLabel: 'Mais comparações',
  vsPrefix: 'WhoUnfollowed vs',
};

export function getCompareDetailUiContent(locale: AppLocale): CompareDetailUiContent {
  if (locale === 'es') return ES;
  if (locale === 'pt') return PT;
  return EN;
}
