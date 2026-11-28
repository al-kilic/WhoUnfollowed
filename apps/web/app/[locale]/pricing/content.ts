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
  // Pro AI is in beta (founder, 2026-11-27).
  proBetaNote: string;
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
  // {price} {months}
  topupNoteTemplate: string;
  monthly: string;
  yearly: string;
  perMonthShort: string;
  perYearShort: string;
  // {pct}
  savePctTemplate: string;
  freeLabel: string;
  inStudio: string;
  ctaProAi: string;
  // Shown to Pro AI subscribers instead of the buy button.
  manageBilling: string;
  subscriberNote: string;
  lifetime: {
    badge: string;
    oneTime: string;
    // Short unit under the Lifetime price.
    once: string;
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
  headline: 'Free to check. Pro AI to grow.',
  subhead:
    'See who doesn\'t follow you back for free, right in your browser. Pro AI adds a coach that remembers your account, writes in your voice and checks posts before you share them.',
  launchBanner: 'Launch prices until December 31. From January 1, a year of Pro AI is {std}.',
  freeBadge: 'Free forever',
  freeNoSignup: 'no sign up required',
  freeBullets: [
    'Works with Instagram, Threads and TikTok',
    'Who doesn\'t follow you back, today',
    'Sort the list: keep, unfollow, decide later',
    'Reminder emails when it\'s time to check again',
    'One snapshot at a time',
    'One CSV export',
    'No account needed',
  ],
  freeCta: 'Use it free',
  proLabel: 'Pro AI',
  proBadge: 'Beta',
  proBetaNote: 'In beta: now and then something may not work. We fix it fast and tell you, and nothing about your plan changes without notice.',
  oneTime: 'a year',
  perMonthTemplate: 'About {price} a month.',
  launchNoteTemplate: 'Launch price, kept for as long as you stay. {std} from January 1.',
  proCore: [
    { label: 'A coach that remembers your account', note: 'editable memory' },
    { label: 'Drafts hooks, captions and Reel scripts in your voice', note: '' },
    { label: 'Checks a post before you share it, with fixes', note: '' },
    { label: 'A 30-day post plan for your niche', note: '' },
    { label: 'An AI read of every new export', note: '' },
    { label: 'Generous monthly coach use, resets every month', note: '' },
  ],
  proMore: [
    { label: 'See exactly who unfollowed you, and when', note: '' },
    { label: 'Every export kept, each new one compared for you', note: 'unlimited history' },
    { label: 'Radar: ghost followers, follow age, old requests', note: '' },
    { label: 'Cloud sync across all your devices', note: 'encrypted in your browser' },
    { label: 'Unlimited CSV exports of every list', note: '' },
    { label: 'Ebooks on growing your account, on yearly', note: '' },
    { label: 'Never your followers or their usernames sent to AI', note: 'counts and your own words only' },
  ],
  seeEverything: 'See everything you get',
  errorGeneric: 'Something went wrong. Please try again.',
  ctaRedirecting: 'Redirecting...',
  ctaYearly: 'Get Pro AI for a year',
  ctaExtendYear: 'Get Pro AI for a year',
  monthlyLinkTemplate: 'Or {price} a month',
  monthlyExtendTemplate: 'Or {price} a month',
  ctaGoToDashboard: 'Go to dashboard',
  ctaTryProFree: 'Try Pro free',
  onetimeNote: 'Renews automatically. Cancel any time in two clicks.',
  betaNote: 'No credit card required during beta.',
  privacyTitle: 'Why people trust it',
  privacy: [
    'Your ZIP is parsed entirely in your browser. Nothing is uploaded to analyze.',
    'Cloud snapshots are encrypted in your browser before they ever leave your device.',
    'EU-based servers. Open-source core. No ads, no data brokers.',
  ],
  faqTitle: 'Common questions',
  topupNoteTemplate: 'Use your coach a lot? Refill a full month for half price, {price}. Used after your monthly allowance, valid for {months} months.',
  monthly: 'Monthly', yearly: 'Yearly', perMonthShort: 'a month', perYearShort: 'a year',
  savePctTemplate: 'Save {pct}%', freeLabel: 'Free', inStudio: 'Everything opens in your Studio.', ctaProAi: 'Get Pro AI',
  manageBilling: 'Manage billing', subscriberNote: "You're on Pro AI. Change plan, card or cancel in billing.",
  lifetime: {
    badge: 'Insider · Lifetime',
    oneTime: 'once, yours for life',
    once: 'once',
    desc: 'Pay once. Pro is yours for life. 40 seats, sold only until December 31, 2026.',
    seatsLeftTemplate: 'Seats left at this price',
    nextPriceTemplate: 'Then {price}. Be quick.',
    lastStep: 'On sale until December 31, 2026. Then Lifetime closes for good.',
    bullets: [
      'Founding Insider club: a private online group and community that opens at 10 members, with member perks like generous affiliate rates',
      'Pro for life: every Pro feature, no expiry, no renewals',
      'Every Pro feature we add later, included',
      "Pro AI for life: our base paid plan, with the same monthly coach use as subscribers. Bigger plans we add later aren't included, but Insiders get a discount on them",
      'Pro features on future Alcatraz Studio tools (their AI features are not included)',
      'First to hear about new launches',
      'Insider badge and title on your account',
    ],
    consentLabel: 'Email me when new Alcatraz Studio tools launch, so I can claim my Insider perks. Optional. Unsubscribe any time.',
    cta: 'Become an Insider',
    note: 'One-time payment. No subscription, nothing to renew, ever.',
    alreadyMember: 'You are an Insider. Thank you.',
    soldOutTitle: 'Lifetime is closed',
    soldOutBody: 'Lifetime is no longer on sale. Thank you to everyone who backed it early. Pro AI is still open.',
  },
};

const ES: PricingContent = {
  betaBadge: 'Pro es gratis durante la beta. Prueba todo por ahora.',
  headline: 'Gratis para revisar. Pro AI para crecer.',
  subhead:
    'Mira gratis quién no te sigue de vuelta, dentro de tu navegador. Pro AI suma un coach que recuerda tu cuenta, escribe con tu voz y revisa tus posts antes de publicarlos.',
  launchBanner: 'Precios de lanzamiento hasta el 31 de diciembre. Desde el 1 de enero, un año de Pro AI cuesta {std}.',
  freeBadge: 'Gratis para siempre',
  freeNoSignup: 'sin necesidad de registrarte',
  freeBullets: [
    'Funciona con Instagram, Threads y TikTok',
    'Quién no te sigue de vuelta, hoy',
    'Ordena la lista: mantener, dejar de seguir, decidir luego',
    'Emails de recordatorio cuando toque revisar de nuevo',
    'Un snapshot a la vez',
    'Una exportación CSV',
    'Sin cuenta necesaria',
  ],
  freeCta: 'Usarlo gratis',
  proLabel: 'Pro AI',
  proBadge: 'Beta',
  proBetaNote: 'En beta: de vez en cuando algo puede fallar. Lo arreglamos rápido y te avisamos, y nada de tu plan cambia sin aviso.',
  oneTime: 'al año',
  perMonthTemplate: 'Unos {price} al mes.',
  launchNoteTemplate: 'Precio de lanzamiento, mientras sigas suscrito. {std} desde el 1 de enero.',
  proCore: [
    { label: 'Un coach que recuerda tu cuenta', note: 'memoria editable' },
    { label: 'Escribe ganchos, textos y guiones de Reels con tu voz', note: '' },
    { label: 'Revisa un post antes de publicarlo, con arreglos', note: '' },
    { label: 'Un plan de publicaciones de 30 días para tu nicho', note: '' },
    { label: 'Una lectura con IA de cada exportación nueva', note: '' },
    { label: 'Uso mensual generoso del coach, se renueva cada mes', note: '' },
  ],
  proMore: [
    { label: 'Mira exactamente quién te dejó de seguir y cuándo', note: '' },
    { label: 'Guarda cada exportación y compara cada nueva por ti', note: 'historial ilimitado' },
    { label: 'Radar: seguidores fantasma, antigüedad, solicitudes viejas', note: '' },
    { label: 'Sincronización en todos tus dispositivos', note: 'cifrado en tu navegador' },
    { label: 'Exportaciones CSV ilimitadas de cada lista', note: '' },
    { label: 'Ebooks para hacer crecer tu cuenta, en el plan anual', note: '' },
    { label: 'Nunca enviamos a la IA tus seguidores ni sus nombres de usuario', note: 'solo cifras y tus palabras' },
  ],
  seeEverything: 'Ver todo lo que incluye',
  errorGeneric: 'Algo salió mal. Inténtalo de nuevo.',
  ctaRedirecting: 'Redirigiendo...',
  ctaYearly: 'Pro AI por un año',
  ctaExtendYear: 'Pro AI por un año',
  monthlyLinkTemplate: 'O {price} al mes',
  monthlyExtendTemplate: 'O {price} al mes',
  ctaGoToDashboard: 'Ir al panel',
  ctaTryProFree: 'Probar Pro gratis',
  onetimeNote: 'Se renueva solo. Cancela cuando quieras en dos clics.',
  betaNote: 'No se necesita tarjeta durante la beta.',
  privacyTitle: 'Por qué confían en nosotros',
  privacy: [
    'Tu ZIP se procesa por completo en tu navegador. Nada se sube para analizarlo.',
    'Los snapshots en la nube se cifran en tu navegador antes de salir de tu dispositivo.',
    'Servidores en la UE. Núcleo de código abierto. Sin anuncios, sin intermediarios de datos.',
  ],
  faqTitle: 'Preguntas frecuentes',
  topupNoteTemplate: '¿Usas mucho tu coach? Recarga un mes completo a mitad de precio, {price}. Se usa después de tu uso mensual y vale {months} meses.',
  monthly: 'Mensual', yearly: 'Anual', perMonthShort: 'al mes', perYearShort: 'al año',
  savePctTemplate: 'Ahorra {pct}%', freeLabel: 'Gratis', inStudio: 'Todo se abre en tu Studio.', ctaProAi: 'Obtener Pro AI',
  manageBilling: 'Gestionar pagos', subscriberNote: 'Ya tienes Pro AI. Cambia de plan, de tarjeta o cancela en pagos.',
  lifetime: {
    badge: 'Insider · Lifetime',
    oneTime: 'una vez, tuyo de por vida',
    once: 'pago único',
    desc: 'Paga una vez. Pro es tuyo de por vida. 40 plazas, a la venta solo hasta el 31 de diciembre de 2026.',
    seatsLeftTemplate: 'Plazas que quedan a este precio',
    nextPriceTemplate: 'Luego {price}. Date prisa.',
    lastStep: 'A la venta hasta el 31 de diciembre de 2026. Después, Lifetime cierra para siempre.',
    bullets: [
      'Club de Insiders fundadores: un grupo y una comunidad online privados que abren al llegar a 10 miembros, con ventajas como comisiones de afiliado generosas',
      'Pro de por vida: todas las funciones Pro, sin vencimiento ni renovaciones',
      'Cada función Pro que añadamos después, incluida',
      'Pro AI de por vida: nuestro plan pago base, con el mismo uso mensual del coach que los suscriptores. Los planes más grandes que agreguemos después no están incluidos, pero los Insiders tienen descuento en ellos',
      'Funciones Pro en futuras herramientas de Alcatraz Studio (sus funciones de IA no están incluidas)',
      'Te enteras primero de cada lanzamiento',
      'Insignia y título de Insider en tu cuenta',
    ],
    consentLabel: 'Avísame por email cuando salgan nuevas herramientas de Alcatraz Studio para reclamar mis beneficios de Insider. Opcional. Puedes darte de baja cuando quieras.',
    cta: 'Hazte Insider',
    note: 'Pago único. Sin suscripción, nada que renovar, nunca.',
    alreadyMember: 'Eres Insider. Gracias.',
    soldOutTitle: 'Lifetime está cerrado',
    soldOutBody: 'Lifetime ya no está a la venta. Gracias a quienes lo apoyaron pronto. Pro AI sigue disponible.',
  },
};

const PT: PricingContent = {
  betaBadge: 'O Pro é grátis durante o beta. Experimente tudo por enquanto.',
  headline: 'Grátis para checar. Pro AI para crescer.',
  subhead:
    'Veja de graça quem não te segue de volta, no seu navegador. O Pro AI traz um coach que lembra da sua conta, escreve com a sua voz e checa seus posts antes de você publicar.',
  launchBanner: 'Preços de lançamento até 31 de dezembro. A partir de 1º de janeiro, um ano de Pro AI custa {std}.',
  freeBadge: 'Grátis para sempre',
  freeNoSignup: 'sem precisar de cadastro',
  freeBullets: [
    'Funciona com Instagram, Threads e TikTok',
    'Quem não te segue de volta, hoje',
    'Organize a lista: manter, deixar de seguir, decidir depois',
    'Emails de lembrete quando for hora de conferir de novo',
    'Um snapshot por vez',
    'Uma exportação CSV',
    'Sem precisar de conta',
  ],
  freeCta: 'Usar grátis',
  proLabel: 'Pro AI',
  proBadge: 'Beta',
  proBetaNote: 'Em beta: de vez em quando algo pode falhar. Corrigimos rápido e avisamos, e nada no seu plano muda sem aviso.',
  oneTime: 'por ano',
  perMonthTemplate: 'Cerca de {price} por mês.',
  launchNoteTemplate: 'Preço de lançamento, enquanto você continuar assinando. {std} a partir de 1º de janeiro.',
  proCore: [
    { label: 'Um coach que lembra da sua conta', note: 'memória editável' },
    { label: 'Escreve ganchos, legendas e roteiros de Reels com a sua voz', note: '' },
    { label: 'Checa um post antes de você publicar, com ajustes', note: '' },
    { label: 'Um plano de posts de 30 dias para o seu nicho', note: '' },
    { label: 'Uma leitura com IA de cada exportação nova', note: '' },
    { label: 'Uso mensal generoso do coach, renova todo mês', note: '' },
  ],
  proMore: [
    { label: 'Veja exatamente quem deixou de te seguir e quando', note: '' },
    { label: 'Cada exportação guardada, cada nova comparada para você', note: 'histórico ilimitado' },
    { label: 'Radar: seguidores fantasmas, tempo de follow, pedidos antigos', note: '' },
    { label: 'Sincronização em todos os seus aparelhos', note: 'criptografado no seu navegador' },
    { label: 'Exportações CSV ilimitadas de cada lista', note: '' },
    { label: 'Ebooks para crescer sua conta, no plano anual', note: '' },
    { label: 'Nunca enviamos à IA seus seguidores nem os nomes de usuário deles', note: 'só números e as suas palavras' },
  ],
  seeEverything: 'Ver tudo o que está incluído',
  errorGeneric: 'Algo deu errado. Tente novamente.',
  ctaRedirecting: 'Redirecionando...',
  ctaYearly: 'Pro AI por um ano',
  ctaExtendYear: 'Pro AI por um ano',
  monthlyLinkTemplate: 'Ou {price} por mês',
  monthlyExtendTemplate: 'Ou {price} por mês',
  ctaGoToDashboard: 'Ir para o painel',
  ctaTryProFree: 'Experimentar o Pro grátis',
  onetimeNote: 'Renova automaticamente. Cancele quando quiser em dois cliques.',
  betaNote: 'Não precisa de cartão durante o beta.',
  privacyTitle: 'Por que as pessoas confiam',
  privacy: [
    'Seu ZIP é processado inteiramente no seu navegador. Nada é enviado para análise.',
    'Os snapshots na nuvem são criptografados no seu navegador antes de sair do dispositivo.',
    'Servidores na UE. Núcleo de código aberto. Sem anúncios, sem corretores de dados.',
  ],
  faqTitle: 'Perguntas frequentes',
  topupNoteTemplate: 'Usa muito o seu coach? Recarregue um mês inteiro pela metade do preço, {price}. É usado depois do seu uso mensal e vale por {months} meses.',
  monthly: 'Mensal', yearly: 'Anual', perMonthShort: 'por mês', perYearShort: 'por ano',
  savePctTemplate: 'Economize {pct}%', freeLabel: 'Grátis', inStudio: 'Tudo abre no seu Studio.', ctaProAi: 'Assinar o Pro AI',
  manageBilling: 'Gerenciar pagamento', subscriberNote: 'Você já tem o Pro AI. Troque de plano, de cartão ou cancele no pagamento.',
  lifetime: {
    badge: 'Insider · Lifetime',
    oneTime: 'uma vez, seu para sempre',
    once: 'pagamento único',
    desc: 'Pague uma vez. O Pro é seu para sempre. 40 vagas, à venda só até 31 de dezembro de 2026.',
    seatsLeftTemplate: 'Vagas restantes neste preço',
    nextPriceTemplate: 'Depois {price}. Corra.',
    lastStep: 'À venda até 31 de dezembro de 2026. Depois, o Lifetime fecha de vez.',
    bullets: [
      'Clube de Insiders fundadores: um grupo e uma comunidade online privados que abrem ao chegar a 10 membros, com vantagens como comissões de afiliado generosas',
      'Pro para sempre: todos os recursos Pro, sem vencimento nem renovação',
      'Todo recurso Pro que adicionarmos depois, incluído',
      'Pro AI para sempre: nosso plano pago base, com o mesmo uso mensal do coach dos assinantes. Planos maiores que adicionarmos depois não estão incluídos, mas os Insiders têm desconto neles',
      'Recursos Pro nas futuras ferramentas da Alcatraz Studio (os recursos de IA delas não estão incluídos)',
      'Primeiro a saber de cada lançamento',
      'Selo e título de Insider na sua conta',
    ],
    consentLabel: 'Me avise por email quando novas ferramentas da Alcatraz Studio forem lançadas, para eu resgatar meus benefícios de Insider. Opcional. Cancele quando quiser.',
    cta: 'Virar Insider',
    note: 'Pagamento único. Sem assinatura, nada para renovar, nunca.',
    alreadyMember: 'Você é Insider. Obrigado.',
    soldOutTitle: 'O Lifetime fechou',
    soldOutBody: 'O Lifetime não está mais à venda. Obrigado a quem apoiou cedo. O Pro AI continua disponível.',
  },
};

export function getPricingContent(locale: AppLocale): PricingContent {
  if (locale === 'es') return ES;
  if (locale === 'pt') return PT;
  return EN;
}
