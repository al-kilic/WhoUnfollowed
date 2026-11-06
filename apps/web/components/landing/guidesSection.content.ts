import type { AppLocale } from '@/i18n/routing';

// Homepage links to the strongest guides. The homepage is the page Google
// trusts most, so linking the key posts from here is what gets them crawled
// and weighted. Slugs must exist in app/blog/posts.ts (guidesSection.test.ts
// checks this). Posts are English only, so es/pt label the links in their
// own language and say the guides are in English.

export const HOME_GUIDE_SLUGS = [
  'how-to-see-who-unfollowed-you-on-instagram',
  'best-app-to-see-who-unfollowed-me-on-instagram-without-password',
  'how-to-download-your-instagram-data',
  'why-did-i-lose-followers-overnight-on-instagram',
  'how-to-see-who-unfollowed-you-on-threads',
] as const;

export type HomeGuideSlug = (typeof HOME_GUIDE_SLUGS)[number];

export interface GuidesSectionContent {
  eyebrow: string;
  heading: string;
  note?: string;
  allGuides: string;
  titles: Record<HomeGuideSlug, string>;
}

const CONTENT: Record<AppLocale, GuidesSectionContent> = {
  en: {
    eyebrow: 'GUIDES',
    heading: 'Start with the guide that fits your question.',
    allGuides: 'All guides',
    titles: {
      'how-to-see-who-unfollowed-you-on-instagram': 'How to see who unfollowed you on Instagram',
      'best-app-to-see-who-unfollowed-me-on-instagram-without-password': 'The best app to see who unfollowed you, without your password',
      'how-to-download-your-instagram-data': 'How to download your Instagram data, step by step',
      'why-did-i-lose-followers-overnight-on-instagram': 'Why you lost followers overnight',
      'how-to-see-who-unfollowed-you-on-threads': 'How to see who unfollowed you on Threads',
    },
  },
  es: {
    eyebrow: 'GUÍAS',
    heading: 'Empieza por la guía que responde a tu pregunta.',
    note: 'Las guías están en inglés.',
    allGuides: 'Todas las guías',
    titles: {
      'how-to-see-who-unfollowed-you-on-instagram': 'Cómo ver quién te dejó de seguir en Instagram',
      'best-app-to-see-who-unfollowed-me-on-instagram-without-password': 'La mejor app para ver quién te dejó de seguir, sin tu contraseña',
      'how-to-download-your-instagram-data': 'Cómo descargar tus datos de Instagram, paso a paso',
      'why-did-i-lose-followers-overnight-on-instagram': 'Por qué perdiste seguidores de la noche a la mañana',
      'how-to-see-who-unfollowed-you-on-threads': 'Cómo ver quién te dejó de seguir en Threads',
    },
  },
  pt: {
    eyebrow: 'GUIAS',
    heading: 'Comece pelo guia que responde à sua pergunta.',
    note: 'Os guias estão em inglês.',
    allGuides: 'Todos os guias',
    titles: {
      'how-to-see-who-unfollowed-you-on-instagram': 'Como ver quem deixou de te seguir no Instagram',
      'best-app-to-see-who-unfollowed-me-on-instagram-without-password': 'O melhor app para ver quem deixou de te seguir, sem sua senha',
      'how-to-download-your-instagram-data': 'Como baixar seus dados do Instagram, passo a passo',
      'why-did-i-lose-followers-overnight-on-instagram': 'Por que você perdeu seguidores da noite para o dia',
      'how-to-see-who-unfollowed-you-on-threads': 'Como ver quem deixou de te seguir no Threads',
    },
  },
};

export function getGuidesSectionContent(locale: AppLocale): GuidesSectionContent {
  return CONTENT[locale];
}
