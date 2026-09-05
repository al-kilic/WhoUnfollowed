import type { AppLocale } from '@/i18n/routing';

// Display copy for /pricing, per locale. Kept as plain data (not next-intl
// message catalogs) so it lives next to the other marketing content modules
// in this codebase (blog posts.ts, compare comparisons.ts) rather than mixing
// two different i18n patterns for one page.
export interface PricingContent {
  betaBadge: string;
  headline: string;
  subhead: string;
  freeBadge: string;
  freeNoSignup: string;
  freeBullets: string[];
  freeCta: string;
  proLabel: string;
  durationLabels: { monthly: string; yearly: string };
  // Templates use {pct}/{period} placeholders instead of functions: content
  // objects are passed from a Server Component (page.tsx) to a Client
  // Component (PricingClient), and functions cannot cross that boundary.
  saveBadgeTemplate: string;
  oneTime: string;
  unlockDescMonthly: string;
  unlockDescYearlyTemplate: string;
  proCore: { label: string; note: string }[];
  proMore: { label: string; note: string }[];
  seeEverything: string;
  errorGeneric: string;
  ctaRedirecting: string;
  ctaUnlockForTemplate: string;
  ctaGoToDashboard: string;
  ctaTryProFree: string;
  ctaExtendByTemplate: string;
  periodYear: string;
  period30Days: string;
  onetimeNote: string;
  betaNote: string;
  privacyTitle: string;
  privacy: string[];
  faqTitle: string;
}

const EN: PricingContent = {
  betaBadge: 'Pro is free during beta. Try everything for now.',
  headline: 'Always free. Pro helps keep it alive.',
  subhead:
    'See when someone unfollows you, who never follows back, and how your audience shifts over time. WhoUnfollowed is free, open source, and runs entirely in your browser. Pro adds memory and depth (history, trends, and cloud sync) and keeps the servers running so the free app stays free.',
  freeBadge: 'Free forever',
  freeNoSignup: 'no sign up required',
  freeBullets: [
    'See who unfollowed you',
    'Full non-followers list',
    'One snapshot at a time',
    'CSV export',
    'No account needed',
  ],
  freeCta: 'Use it free',
  proLabel: 'Pro',
  durationLabels: { monthly: '30 days', yearly: '365 days' },
  saveBadgeTemplate: 'SAVE {pct}%',
  oneTime: 'one-time',
  unlockDescMonthly: 'Unlocks Pro for 30 days',
  unlockDescYearlyTemplate: 'Unlocks Pro for 365 days · save {pct}% vs. buying 30 days at a time',
  proCore: [
    { label: 'Keep every snapshot forever', note: 'unlimited history' },
    { label: 'See exactly who unfollowed you, and when', note: '' },
    { label: 'Cloud sync across all your devices', note: 'encrypted in your browser' },
    { label: 'Watch your follower count trend over time', note: '' },
    { label: 'Catch the ghosts who never engage', note: '' },
  ],
  proMore: [
    { label: 'Get alerted the moment someone drops', note: 'email alerts, soon' },
    { label: 'See pending follow requests, and how long they\'ve been waiting', note: '' },
    { label: 'Compare any two snapshots side by side', note: '' },
    { label: 'Surface restricted, blocked, and close-friends lists', note: '' },
    { label: 'Clean up fast: batch-open everyone who left', note: '' },
    { label: 'Mobile app included', note: 'iOS + Android, soon' },
    { label: 'Keep the app free and independent', note: 'no ads, no investors' },
  ],
  seeEverything: 'See everything you get',
  errorGeneric: 'Something went wrong. Please try again.',
  ctaRedirecting: 'Redirecting...',
  ctaUnlockForTemplate: 'Unlock for {period}',
  ctaGoToDashboard: 'Go to dashboard',
  ctaTryProFree: 'Try Pro free',
  ctaExtendByTemplate: 'Extend by {period}',
  periodYear: 'a year',
  period30Days: '30 days',
  onetimeNote: 'One-time payment. No auto-renewal.',
  betaNote: 'No credit card required during beta.',
  privacyTitle: 'WHY PEOPLE TRUST IT',
  privacy: [
    'Your ZIP is parsed entirely in your browser. Nothing is uploaded to analyze.',
    'Cloud snapshots are encrypted in your browser before they ever leave your device.',
    'EU-based servers. Open-source core. No ads, no data brokers.',
  ],
  faqTitle: 'COMMON QUESTIONS',
};

const ES: PricingContent = {
  betaBadge: 'Pro es gratis durante la beta. Prueba todo por ahora.',
  headline: 'Siempre gratis. Pro ayuda a mantenerlo vivo.',
  subhead:
    'Descubre cuándo alguien te deja de seguir, quién nunca te sigue de vuelta y cómo cambia tu audiencia con el tiempo. WhoUnfollowed es gratis, de código abierto y funciona por completo en tu navegador. Pro añade memoria y profundidad (historial, tendencias y sincronización en la nube) y mantiene los servidores funcionando para que la app gratuita siga siendo gratis.',
  freeBadge: 'Gratis para siempre',
  freeNoSignup: 'sin necesidad de registrarte',
  freeBullets: [
    'Ver quién te dejó de seguir',
    'Lista completa de quienes no te siguen de vuelta',
    'Un snapshot a la vez',
    'Exportar a CSV',
    'Sin cuenta necesaria',
  ],
  freeCta: 'Usarlo gratis',
  proLabel: 'Pro',
  durationLabels: { monthly: '30 días', yearly: '365 días' },
  saveBadgeTemplate: 'AHORRA {pct}%',
  oneTime: 'pago único',
  unlockDescMonthly: 'Desbloquea Pro por 30 días',
  unlockDescYearlyTemplate: 'Desbloquea Pro por 365 días · ahorra {pct}% frente a comprar cada 30 días',
  proCore: [
    { label: 'Guarda cada snapshot para siempre', note: 'historial ilimitado' },
    { label: 'Ve exactamente quién te dejó de seguir, y cuándo', note: '' },
    { label: 'Sincronización en la nube en todos tus dispositivos', note: 'cifrada en tu navegador' },
    { label: 'Observa la tendencia de tus seguidores con el tiempo', note: '' },
    { label: 'Detecta a los fantasmas que nunca interactúan', note: '' },
  ],
  proMore: [
    { label: 'Recibe una alerta en el momento en que alguien se va', note: 'alertas por email, pronto' },
    { label: 'Ve las solicitudes de seguimiento pendientes y cuánto tiempo llevan esperando', note: '' },
    { label: 'Compara dos snapshots cualquiera lado a lado', note: '' },
    { label: 'Muestra listas de restringidos, bloqueados y mejores amigos', note: '' },
    { label: 'Limpia rápido: abre en lote a todos los que se fueron', note: '' },
    { label: 'App móvil incluida', note: 'iOS + Android, pronto' },
    { label: 'Mantén la app gratuita e independiente', note: 'sin anuncios, sin inversores' },
  ],
  seeEverything: 'Ver todo lo que incluye',
  errorGeneric: 'Algo salió mal. Inténtalo de nuevo.',
  ctaRedirecting: 'Redirigiendo...',
  ctaUnlockForTemplate: 'Desbloquear por {period}',
  ctaGoToDashboard: 'Ir al panel',
  ctaTryProFree: 'Probar Pro gratis',
  ctaExtendByTemplate: 'Extender por {period}',
  periodYear: 'un año',
  period30Days: '30 días',
  onetimeNote: 'Pago único. Sin renovación automática.',
  betaNote: 'No se necesita tarjeta durante la beta.',
  privacyTitle: 'POR QUÉ CONFÍAN EN NOSOTROS',
  privacy: [
    'Tu ZIP se procesa por completo en tu navegador. Nada se sube para analizarlo.',
    'Los snapshots en la nube se cifran en tu navegador antes de salir de tu dispositivo.',
    'Servidores en la UE. Núcleo de código abierto. Sin anuncios, sin intermediarios de datos.',
  ],
  faqTitle: 'PREGUNTAS FRECUENTES',
};

const PT: PricingContent = {
  betaBadge: 'O Pro é grátis durante a beta. Experimente tudo por enquanto.',
  headline: 'Sempre grátis. O Pro ajuda a manter tudo funcionando.',
  subhead:
    'Veja quando alguém deixa de te seguir, quem nunca te segue de volta e como sua audiência muda com o tempo. O WhoUnfollowed é gratuito, de código aberto e roda inteiramente no seu navegador. O Pro adiciona memória e profundidade (histórico, tendências e sincronização na nuvem) e mantém os servidores no ar para que o app gratuito continue grátis.',
  freeBadge: 'Grátis para sempre',
  freeNoSignup: 'sem necessidade de cadastro',
  freeBullets: [
    'Ver quem deixou de te seguir',
    'Lista completa de quem não te segue de volta',
    'Um snapshot por vez',
    'Exportar CSV',
    'Sem necessidade de conta',
  ],
  freeCta: 'Usar grátis',
  proLabel: 'Pro',
  durationLabels: { monthly: '30 dias', yearly: '365 dias' },
  saveBadgeTemplate: 'ECONOMIZE {pct}%',
  oneTime: 'pagamento único',
  unlockDescMonthly: 'Libera o Pro por 30 dias',
  unlockDescYearlyTemplate: 'Libera o Pro por 365 dias · economize {pct}% em vez de comprar a cada 30 dias',
  proCore: [
    { label: 'Guarde cada snapshot para sempre', note: 'histórico ilimitado' },
    { label: 'Veja exatamente quem deixou de te seguir, e quando', note: '' },
    { label: 'Sincronização na nuvem em todos os seus dispositivos', note: 'criptografada no seu navegador' },
    { label: 'Acompanhe a tendência dos seus seguidores ao longo do tempo', note: '' },
    { label: 'Encontre os fantasmas que nunca interagem', note: '' },
  ],
  proMore: [
    { label: 'Seja avisado no momento em que alguém deixa de seguir', note: 'alertas por email, em breve' },
    { label: 'Veja solicitações de seguidor pendentes e há quanto tempo esperam', note: '' },
    { label: 'Compare dois snapshots quaisquer lado a lado', note: '' },
    { label: 'Veja listas de restritos, bloqueados e melhores amigos', note: '' },
    { label: 'Limpe rápido: abra em lote todos que saíram', note: '' },
    { label: 'App móvel incluído', note: 'iOS + Android, em breve' },
    { label: 'Mantenha o app gratuito e independente', note: 'sem anúncios, sem investidores' },
  ],
  seeEverything: 'Ver tudo que está incluído',
  errorGeneric: 'Algo deu errado. Tente novamente.',
  ctaRedirecting: 'Redirecionando...',
  ctaUnlockForTemplate: 'Desbloquear por {period}',
  ctaGoToDashboard: 'Ir para o painel',
  ctaTryProFree: 'Testar o Pro grátis',
  ctaExtendByTemplate: 'Estender por {period}',
  periodYear: 'um ano',
  period30Days: '30 dias',
  onetimeNote: 'Pagamento único. Sem renovação automática.',
  betaNote: 'Nenhum cartão necessário durante a beta.',
  privacyTitle: 'POR QUE CONFIAM NA GENTE',
  privacy: [
    'Seu ZIP é processado inteiramente no seu navegador. Nada é enviado para análise.',
    'Os snapshots na nuvem são criptografados no seu navegador antes de sair do dispositivo.',
    'Servidores na UE. Núcleo de código aberto. Sem anúncios, sem corretores de dados.',
  ],
  faqTitle: 'PERGUNTAS FREQUENTES',
};

export function getPricingContent(locale: AppLocale): PricingContent {
  if (locale === 'es') return ES;
  if (locale === 'pt') return PT;
  return EN;
}
