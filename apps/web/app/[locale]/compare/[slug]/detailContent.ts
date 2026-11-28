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
  mobileTitle: string;
  faqLabel: string;
  mobileBody: string;
}

const EN: CompareDetailUiContent = {
  faqLabel: 'Questions',
  allComparisons: 'All comparisons',
  whoUnfollowedVs: 'WhoUnfollowed vs',
  featureHeader: 'Feature',
  verdictLabel: 'Verdict',
  relatedReadingLabel: 'Related reading',
  relatedReadingLink: 'Why Instagram follower trackers ask for your password →',
  ctaButton: 'Try WhoUnfollowed free →',
  moreComparisonsLabel: 'More comparisons',
  vsPrefix: 'WhoUnfollowed vs',
  mobileTitle: 'Is there a WhoUnfollowed app?',
  mobileBody: 'Our iPhone and Android apps are in development and coming soon. Until then, WhoUnfollowed already works on your phone: open whounfollowed.co in Safari or Chrome and add it to your home screen for one-tap access, like an app.',
};

const ES: CompareDetailUiContent = {
  faqLabel: 'Preguntas',
  allComparisons: 'Todas las comparaciones',
  whoUnfollowedVs: 'WhoUnfollowed vs',
  featureHeader: 'Función',
  verdictLabel: 'Veredicto',
  relatedReadingLabel: 'Lectura relacionada',
  relatedReadingLink: 'Por qué los rastreadores de seguidores de Instagram piden tu contraseña →',
  ctaButton: 'Prueba WhoUnfollowed gratis →',
  moreComparisonsLabel: 'Más comparaciones',
  vsPrefix: 'WhoUnfollowed vs',
  mobileTitle: '¿Hay una app de WhoUnfollowed?',
  mobileBody: 'Nuestras apps para iPhone y Android están en desarrollo y llegarán pronto. Mientras tanto, WhoUnfollowed ya funciona en tu móvil: abre whounfollowed.co en Safari o Chrome y añádelo a tu pantalla de inicio para abrirlo con un toque, como una app.',
};

const PT: CompareDetailUiContent = {
  faqLabel: 'Perguntas',
  allComparisons: 'Todas as comparações',
  whoUnfollowedVs: 'WhoUnfollowed vs',
  featureHeader: 'Recurso',
  verdictLabel: 'Veredito',
  relatedReadingLabel: 'Leitura relacionada',
  relatedReadingLink: 'Por que os rastreadores de seguidores do Instagram pedem sua senha →',
  ctaButton: 'Experimente o WhoUnfollowed grátis →',
  moreComparisonsLabel: 'Mais comparações',
  vsPrefix: 'WhoUnfollowed vs',
  mobileTitle: 'Existe um app do WhoUnfollowed?',
  mobileBody: 'Nossos apps para iPhone e Android estão em desenvolvimento e chegam em breve. Enquanto isso, o WhoUnfollowed já funciona no seu celular: abra whounfollowed.co no Safari ou no Chrome e adicione à tela de início para abrir com um toque, como um app.',
};

export function getCompareDetailUiContent(locale: AppLocale): CompareDetailUiContent {
  if (locale === 'es') return ES;
  if (locale === 'pt') return PT;
  return EN;
}
