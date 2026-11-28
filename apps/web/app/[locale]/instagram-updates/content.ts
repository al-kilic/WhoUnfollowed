import type { AppLocale } from '@/i18n/routing';

// The public weekly brief: the free General edition of the brief Studio shows
// at /app/plan/brief, as a dated page per week. Fresh, dated, sourced content
// is what search and AI answer engines pick up for "what changed on Instagram"
// questions. Niche editions stay inside Pro AI (lib/briefs.ts never returns
// their text here).

export interface UpdatesPageContent {
  meta: { title: string; description: string };
  eyebrow: string;
  h1: string;
  intro: string;
  weekOf: string; // {date}
  archiveH: string;
  nicheH: string;
  nicheBody: string; // {niches}
  nicheCta: string;
  uploadCta: string;
  empty: string;
}

const EN: UpdatesPageContent = {
  meta: {
    title: 'Instagram Updates This Week: What Changed and What to Do',
    description: 'A free weekly brief on what changed on Instagram, Threads and TikTok, why it matters and what to do about it, plus 5 post ideas. Sources linked.',
  },
  eyebrow: 'Weekly brief · free',
  h1: 'Instagram updates this week',
  intro: 'What changed on Instagram, Threads and TikTok, why it matters for a small account and what to do about it. Every item links to its source.',
  weekOf: 'Brief of {date}',
  archiveH: 'Earlier briefs',
  nicheH: 'Want it for your niche?',
  nicheBody: 'Pro AI members also get editions for {niches}, and a coach that turns them into a plan for their own account.',
  nicheCta: 'See the coach',
  uploadCta: 'Check who unfollowed you, free',
  empty: 'The first brief is on its way.',
};

const ES: UpdatesPageContent = {
  meta: {
    title: 'Novedades de Instagram esta semana: qué cambió y qué hacer',
    description: 'Un resumen semanal gratis de lo que cambió en Instagram, Threads y TikTok, por qué importa y qué hacer, más 5 ideas para publicar. Con fuentes.',
  },
  eyebrow: 'Resumen semanal · gratis',
  h1: 'Novedades de Instagram esta semana',
  intro: 'Qué cambió en Instagram, Threads y TikTok, por qué le importa a una cuenta pequeña y qué hacer al respecto. Cada punto enlaza a su fuente.',
  weekOf: 'Resumen del {date}',
  archiveH: 'Resúmenes anteriores',
  nicheH: '¿Lo quieres para tu nicho?',
  nicheBody: 'Los miembros de Pro AI reciben además ediciones para {niches}, y un coach que las convierte en un plan para su propia cuenta.',
  nicheCta: 'Ver el coach',
  uploadCta: 'Mira quién te dejó de seguir, gratis',
  empty: 'El primer resumen está en camino.',
};

const PT: UpdatesPageContent = {
  meta: {
    title: 'Novidades do Instagram nesta semana: o que mudou e o que fazer',
    description: 'Um resumo semanal grátis do que mudou no Instagram, no Threads e no TikTok, por que importa e o que fazer, mais 5 ideias de posts. Com fontes.',
  },
  eyebrow: 'Resumo semanal · grátis',
  h1: 'Novidades do Instagram nesta semana',
  intro: 'O que mudou no Instagram, no Threads e no TikTok, por que isso importa para uma conta pequena e o que fazer a respeito. Cada item leva à sua fonte.',
  weekOf: 'Resumo de {date}',
  archiveH: 'Resumos anteriores',
  nicheH: 'Quer para o seu nicho?',
  nicheBody: 'Membros do Pro AI também recebem edições para {niches}, e um coach que as transforma em um plano para a própria conta.',
  nicheCta: 'Ver o coach',
  uploadCta: 'Veja quem deixou de te seguir, grátis',
  empty: 'O primeiro resumo está a caminho.',
};

const CONTENT: Record<AppLocale, UpdatesPageContent> = { en: EN, es: ES, pt: PT };

export function getUpdatesPageContent(locale: AppLocale): UpdatesPageContent {
  return CONTENT[locale];
}

// "November 23, 2026" in the reader's language, from a YYYY-MM-DD brief date.
export function formatBriefDate(date: string, locale: AppLocale): string {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}
