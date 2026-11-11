import type { AppLocale } from '@/i18n/routing';

// Display copy for /pricing, per locale. Kept as plain data (not next-intl
// message catalogs) so it lives next to the other marketing content modules
// in this codebase (blog posts.ts, compare comparisons.ts) rather than mixing
// two different i18n patterns for one page.
//
// Templates use {placeholders} instead of functions: content objects are
// passed from a Server Component (page.tsx) to a Client Component
// (PricingClient), and functions cannot cross that boundary.
export interface PricingContent {
  betaBadge: string;
  headline: string;
  subhead: string;
  // {std} = the yearly price from Jan 1.
  launchBanner: string;
  freeBadge: string;
  freeNoSignup: string;
  freeBullets: string[];
  freeCta: string;
  proLabel: string;
  proBadge: string;
  oneTime: string;
  // {price} = yearly price spread over 12 months.
  perMonthTemplate: string;
  // {std} = the yearly price from Jan 1.
  launchNoteTemplate: string;
  proCore: { label: string; note: string }[];
  proMore: { label: string; note: string }[];
  seeEverything: string;
  errorGeneric: string;
  ctaRedirecting: string;
  ctaYearly: string;
  ctaExtendYear: string;
  // {price} = 30-day price.
  monthlyLinkTemplate: string;
  monthlyExtendTemplate: string;
  ctaGoToDashboard: string;
  ctaTryProFree: string;
  onetimeNote: string;
  betaNote: string;
  privacyTitle: string;
  privacy: string[];
  faqTitle: string;
  lifetime: {
    badge: string;
    oneTime: string;
    desc: string;
    seatsLeftTemplate: string;
    // {price} = the next step's price.
    nextPriceTemplate: string;
    lastStep: string;
    bullets: string[];
    consentLabel: string;
    cta: string;
    note: string;
    alreadyMember: string;
    soldOutTitle: string;
    soldOutBody: string;
  };
}

const EN: PricingContent = {
  betaBadge: 'Pro is free during beta. Try everything for now.',
  headline: 'Free to check. Pro to keep watch.',
  subhead:
    'See who doesn\'t follow you back for free, right in your browser. Pro remembers every export, so each new one shows exactly who unfollowed you and when.',
  launchBanner: 'Launch prices until December 31. From January 1, a year of Pro is {std}.',
  freeBadge: 'Free forever',
  freeNoSignup: 'no sign up required',
  freeBullets: [
    'Works with Instagram and Threads',
    'Who doesn\'t follow you back, today',
    'Sort the list: keep, unfollow, decide later',
    'Reminder emails when it\'s time to check again',
    'One snapshot at a time',
    'One CSV export',
    'No account needed',
  ],
  freeCta: 'Use it free',
  proLabel: 'Pro · 1 year',
  proBadge: 'Best value',
  oneTime: 'one-time',
  perMonthTemplate: 'About {price} a month.',
  launchNoteTemplate: 'Launch price. {std} from January 1.',
  proCore: [
    { label: 'See exactly who unfollowed you, and when', note: '' },
    { label: 'Every export kept, each new one compared for you', note: 'unlimited history' },
    { label: 'Reminders every 2 weeks, so you never miss a check', note: '' },
    { label: 'Radar: ghost followers, follow age, old requests', note: '' },
    { label: 'Your follower trend over time', note: '' },
  ],
  proMore: [
    { label: 'Cloud sync across all your devices', note: 'encrypted in your browser' },
    { label: 'See pending follow requests, and how long they\'ve been waiting', note: '' },
    { label: 'Compare any two snapshots side by side', note: '' },
    { label: 'Surface restricted, blocked, and close-friends lists', note: '' },
    { label: 'Clean up fast: open everyone who left in batches', note: '' },
    { label: 'Unlimited CSV exports of every list', note: '' },
    { label: 'Keeps the app free and independent', note: 'no ads, no investors' },
  ],
  seeEverything: 'See everything you get',
  errorGeneric: 'Something went wrong. Please try again.',
  ctaRedirecting: 'Redirecting...',
  ctaYearly: 'Get Pro for a year',
  ctaExtendYear: 'Add another year',
  monthlyLinkTemplate: 'Only need one check? {price} for 30 days',
  monthlyExtendTemplate: 'Or add 30 days for {price}',
  ctaGoToDashboard: 'Go to dashboard',
  ctaTryProFree: 'Try Pro free',
  onetimeNote: 'One-time payment. No auto-renewal.',
  betaNote: 'No credit card required during beta.',
  privacyTitle: 'WHY PEOPLE TRUST IT',
  privacy: [
    'Your ZIP is parsed entirely in your browser. Nothing is uploaded to analyze.',
    'Cloud snapshots are encrypted in your browser before they ever leave your device.',
    'EU-based servers. Open-source core. No ads, no data brokers.',
  ],
  faqTitle: 'COMMON QUESTIONS',
  lifetime: {
    badge: 'Insider · Lifetime',
    oneTime: 'once, yours for life',
    desc: 'Pay once. Pro is yours for life. Limited seats, and the price goes up as they go.',
    seatsLeftTemplate: 'Seats left at this price',
    nextPriceTemplate: 'Then {price}. Be quick.',
    lastStep: 'Last seats. After these, Lifetime closes for good.',
    bullets: [
      'Pro for life: every Pro feature, no expiry, no renewals',
      'Every Pro feature we add later, included',
      'Private Insider community on Discord: growth, open-source apps, ideas',
      'Pro features on future Alcatraz Studio tools. AI features that run on credits are not included',
      'First to hear about new launches',
      'Insider badge and title on your account',
    ],
    consentLabel: 'Email me when new Alcatraz Studio tools launch, so I can claim my Insider perks. Optional. Unsubscribe any time.',
    cta: 'Become an Insider',
    note: 'One-time payment. No subscription, nothing to renew, ever.',
    alreadyMember: 'You are an Insider. Thank you.',
    soldOutTitle: 'Lifetime is closed',
    soldOutBody: 'Every Insider seat is taken. Thank you to everyone who backed it early. Pro for a year is still open.',
  },
};

const ES: PricingContent = {
  betaBadge: 'Pro es gratis durante la beta. Prueba todo por ahora.',
  headline: 'Gratis para revisar. Pro para no perderte nada.',
  subhead:
    'Mira gratis quién no te sigue de vuelta, dentro de tu navegador. Pro recuerda cada exportación, así cada nueva te muestra exactamente quién te dejó de seguir y cuándo.',
  launchBanner: 'Precios de lanzamiento hasta el 31 de diciembre. Desde el 1 de enero, un año de Pro cuesta {std}.',
  freeBadge: 'Gratis para siempre',
  freeNoSignup: 'sin necesidad de registrarte',
  freeBullets: [
    'Funciona con Instagram y Threads',
    'Quién no te sigue de vuelta, hoy',
    'Ordena la lista: mantener, dejar de seguir, decidir luego',
    'Emails de recordatorio cuando toque revisar de nuevo',
    'Un snapshot a la vez',
    'Una exportación CSV',
    'Sin cuenta necesaria',
  ],
  freeCta: 'Usarlo gratis',
  proLabel: 'Pro · 1 año',
  proBadge: 'Mejor valor',
  oneTime: 'pago único',
  perMonthTemplate: 'Unos {price} al mes.',
  launchNoteTemplate: 'Precio de lanzamiento. {std} desde el 1 de enero.',
  proCore: [
    { label: 'Ve exactamente quién te dejó de seguir, y cuándo', note: '' },
    { label: 'Cada exportación guardada, cada nueva comparada por ti', note: 'historial ilimitado' },
    { label: 'Recordatorios cada 2 semanas, para no saltarte ninguna revisión', note: '' },
    { label: 'Radar: seguidores fantasma, antigüedad, solicitudes viejas', note: '' },
    { label: 'La tendencia de tus seguidores con el tiempo', note: '' },
  ],
  proMore: [
    { label: 'Sincronización en la nube en todos tus dispositivos', note: 'cifrada en tu navegador' },
    { label: 'Ve las solicitudes de seguimiento pendientes y cuánto tiempo llevan esperando', note: '' },
    { label: 'Compara dos snapshots cualquiera lado a lado', note: '' },
    { label: 'Muestra listas de restringidos, bloqueados y mejores amigos', note: '' },
    { label: 'Limpia rápido: abre por lotes a todos los que se fueron', note: '' },
    { label: 'Exportaciones CSV ilimitadas de cada lista', note: '' },
    { label: 'Mantiene la app gratuita e independiente', note: 'sin anuncios, sin inversores' },
  ],
  seeEverything: 'Ver todo lo que incluye',
  errorGeneric: 'Algo salió mal. Inténtalo de nuevo.',
  ctaRedirecting: 'Redirigiendo...',
  ctaYearly: 'Obtener Pro por un año',
  ctaExtendYear: 'Añadir otro año',
  monthlyLinkTemplate: '¿Solo una revisión? {price} por 30 días',
  monthlyExtendTemplate: 'O añade 30 días por {price}',
  ctaGoToDashboard: 'Ir al panel',
  ctaTryProFree: 'Probar Pro gratis',
  onetimeNote: 'Pago único. Sin renovación automática.',
  betaNote: 'No se necesita tarjeta durante la beta.',
  privacyTitle: 'POR QUÉ CONFÍAN EN NOSOTROS',
  privacy: [
    'Tu ZIP se procesa por completo en tu navegador. Nada se sube para analizarlo.',
    'Los snapshots en la nube se cifran en tu navegador antes de salir de tu dispositivo.',
    'Servidores en la UE. Núcleo de código abierto. Sin anuncios, sin intermediarios de datos.',
  ],
  faqTitle: 'PREGUNTAS FRECUENTES',
  lifetime: {
    badge: 'Insider · Lifetime',
    oneTime: 'una vez, tuyo de por vida',
    desc: 'Paga una vez. Pro es tuyo de por vida. Plazas limitadas, y el precio sube a medida que se agotan.',
    seatsLeftTemplate: 'Plazas que quedan a este precio',
    nextPriceTemplate: 'Luego {price}. Date prisa.',
    lastStep: 'Últimas plazas. Después, Lifetime cierra para siempre.',
    bullets: [
      'Pro de por vida: todas las funciones Pro, sin vencimiento ni renovaciones',
      'Cada función Pro que añadamos después, incluida',
      'Comunidad privada de Insiders en Discord: crecimiento, apps de código abierto, ideas',
      'Funciones Pro en futuras herramientas de Alcatraz Studio. No incluye las funciones de IA que funcionan con créditos',
      'Te enteras primero de cada lanzamiento',
      'Insignia y título de Insider en tu cuenta',
    ],
    consentLabel: 'Avísame por email cuando salgan nuevas herramientas de Alcatraz Studio para reclamar mis beneficios de Insider. Opcional. Puedes darte de baja cuando quieras.',
    cta: 'Hazte Insider',
    note: 'Pago único. Sin suscripción, nada que renovar, nunca.',
    alreadyMember: 'Eres Insider. Gracias.',
    soldOutTitle: 'Lifetime está cerrado',
    soldOutBody: 'Todas las plazas de Insider están ocupadas. Gracias a quienes lo apoyaron pronto. Pro por un año sigue disponible.',
  },
};

const PT: PricingContent = {
  betaBadge: 'O Pro é grátis durante o beta. Experimente tudo por enquanto.',
  headline: 'Grátis para conferir. Pro para não perder nada.',
  subhead:
    'Veja de graça quem não te segue de volta, no seu navegador. O Pro lembra cada exportação, então cada nova mostra exatamente quem deixou de te seguir e quando.',
  launchBanner: 'Preços de lançamento até 31 de dezembro. A partir de 1º de janeiro, um ano de Pro custa {std}.',
  freeBadge: 'Grátis para sempre',
  freeNoSignup: 'sem precisar de cadastro',
  freeBullets: [
    'Funciona com Instagram e Threads',
    'Quem não te segue de volta, hoje',
    'Organize a lista: manter, deixar de seguir, decidir depois',
    'Emails de lembrete quando for hora de conferir de novo',
    'Um snapshot por vez',
    'Uma exportação CSV',
    'Sem precisar de conta',
  ],
  freeCta: 'Usar grátis',
  proLabel: 'Pro · 1 ano',
  proBadge: 'Melhor valor',
  oneTime: 'pagamento único',
  perMonthTemplate: 'Cerca de {price} por mês.',
  launchNoteTemplate: 'Preço de lançamento. {std} a partir de 1º de janeiro.',
  proCore: [
    { label: 'Veja exatamente quem deixou de te seguir, e quando', note: '' },
    { label: 'Cada exportação guardada, cada nova comparada para você', note: 'histórico ilimitado' },
    { label: 'Lembretes a cada 2 semanas, para nunca pular uma conferida', note: '' },
    { label: 'Radar: seguidores fantasmas, tempo de follow, pedidos antigos', note: '' },
    { label: 'A tendência dos seus seguidores ao longo do tempo', note: '' },
  ],
  proMore: [
    { label: 'Sincronização na nuvem em todos os seus dispositivos', note: 'criptografada no seu navegador' },
    { label: 'Veja pedidos para seguir pendentes e há quanto tempo estão esperando', note: '' },
    { label: 'Compare dois snapshots quaisquer lado a lado', note: '' },
    { label: 'Mostre listas de restritos, bloqueados e melhores amigos', note: '' },
    { label: 'Limpe rápido: abra em lotes todos que saíram', note: '' },
    { label: 'Exportações CSV ilimitadas de cada lista', note: '' },
    { label: 'Mantém o app gratuito e independente', note: 'sem anúncios, sem investidores' },
  ],
  seeEverything: 'Ver tudo o que está incluído',
  errorGeneric: 'Algo deu errado. Tente novamente.',
  ctaRedirecting: 'Redirecionando...',
  ctaYearly: 'Pegar o Pro por um ano',
  ctaExtendYear: 'Adicionar mais um ano',
  monthlyLinkTemplate: 'Só precisa de uma conferida? {price} por 30 dias',
  monthlyExtendTemplate: 'Ou adicione 30 dias por {price}',
  ctaGoToDashboard: 'Ir para o painel',
  ctaTryProFree: 'Experimentar o Pro grátis',
  onetimeNote: 'Pagamento único. Sem renovação automática.',
  betaNote: 'Não precisa de cartão durante o beta.',
  privacyTitle: 'POR QUE AS PESSOAS CONFIAM',
  privacy: [
    'Seu ZIP é processado inteiramente no seu navegador. Nada é enviado para análise.',
    'Os snapshots na nuvem são criptografados no seu navegador antes de sair do dispositivo.',
    'Servidores na UE. Núcleo de código aberto. Sem anúncios, sem corretores de dados.',
  ],
  faqTitle: 'PERGUNTAS FREQUENTES',
  lifetime: {
    badge: 'Insider · Lifetime',
    oneTime: 'uma vez, seu para sempre',
    desc: 'Pague uma vez. O Pro é seu para sempre. Vagas limitadas, e o preço sobe conforme acabam.',
    seatsLeftTemplate: 'Vagas restantes neste preço',
    nextPriceTemplate: 'Depois {price}. Corra.',
    lastStep: 'Últimas vagas. Depois delas, o Lifetime fecha de vez.',
    bullets: [
      'Pro para sempre: todos os recursos Pro, sem vencimento nem renovação',
      'Todo recurso Pro que adicionarmos depois, incluído',
      'Comunidade privada de Insiders no Discord: crescimento, apps de código aberto, ideias',
      'Recursos Pro nas futuras ferramentas da Alcatraz Studio. Não inclui recursos de IA que funcionam com créditos',
      'Primeiro a saber de cada lançamento',
      'Selo e título de Insider na sua conta',
    ],
    consentLabel: 'Me avise por email quando novas ferramentas da Alcatraz Studio forem lançadas, para eu resgatar meus benefícios de Insider. Opcional. Cancele quando quiser.',
    cta: 'Virar Insider',
    note: 'Pagamento único. Sem assinatura, nada para renovar, nunca.',
    alreadyMember: 'Você é Insider. Obrigado.',
    soldOutTitle: 'O Lifetime fechou',
    soldOutBody: 'Todas as vagas de Insider foram preenchidas. Obrigado a quem apoiou cedo. O Pro por um ano continua disponível.',
  },
};

export function getPricingContent(locale: AppLocale): PricingContent {
  if (locale === 'es') return ES;
  if (locale === 'pt') return PT;
  return EN;
}
