import type { AppLocale } from '@/i18n/routing';

// Launch-day emails for people who paid before Pro AI existed (founder,
// 2026-11-24; .claude/reference/usage-allowance-spec.md). Never state the size
// of the gift, never mention costs or models.

export interface EarlyLifetimeEmailContent {
  subject: string;
  preview: string;
  title: string;
  thanks: string;
  keeps: string;
  gift: string;
  discount: string;
  askButton: string;
  pricingLink: string;
  footer: string;
}

export interface LegacyProEmailContent {
  subject: string;
  preview: string;
  title: string;
  thanks: string;
  keeps: (until: string | null) => string;
  gift: string;
  yearly: (endsOn: string) => string;
  askButton: string;
  pricingLink: string;
  footer: string;
}

const early: Record<AppLocale, EarlyLifetimeEmailContent> = {
  en: {
    subject: 'A thank-you from WhoUnfollowed',
    preview: 'A gift of coach use is waiting in your account.',
    title: 'Thank you for backing us early',
    thanks: 'You bought Lifetime before the coach existed. That trust helped us build it, so here is something back.',
    keeps: 'Your Lifetime keeps every Pro feature, now and later, with nothing to renew.',
    gift: 'We added a gift of coach use to your account, on us. It never expires and works without subscribing: ask your coach about your account, check a post before you publish, or plan your next month.',
    discount: 'If you want the coach every month, Pro AI monthly is 60% off for you, for life. Sign in before you subscribe and the discount is applied for you.',
    askButton: 'Ask your coach',
    pricingLink: 'See Pro AI',
    footer: 'You get this email because you bought WhoUnfollowed Lifetime. It is a one-time message about your purchase.',
  },
  es: {
    subject: 'Un agradecimiento de WhoUnfollowed',
    preview: 'Te espera un regalo de uso del coach en tu cuenta.',
    title: 'Gracias por apoyarnos desde el principio',
    thanks: 'Compraste Lifetime antes de que existiera el coach. Esa confianza nos ayudó a crearlo, así que aquí va algo de vuelta.',
    keeps: 'Tu Lifetime mantiene todas las funciones Pro, ahora y en el futuro, sin nada que renovar.',
    gift: 'Añadimos a tu cuenta un regalo de uso del coach, por nuestra cuenta. Nunca vence y funciona sin suscribirte: pregúntale a tu coach por tu cuenta, revisa una publicación antes de subirla o planifica tu próximo mes.',
    discount: 'Si quieres el coach todos los meses, Pro AI mensual tiene un 60% de descuento para ti, para siempre. Inicia sesión antes de suscribirte y el descuento se aplica solo.',
    askButton: 'Pregúntale a tu coach',
    pricingLink: 'Ver Pro AI',
    footer: 'Recibes este email porque compraste WhoUnfollowed Lifetime. Es un mensaje único sobre tu compra.',
  },
  pt: {
    subject: 'Um agradecimento do WhoUnfollowed',
    preview: 'Um presente de uso do coach está esperando na sua conta.',
    title: 'Obrigado por apoiar a gente desde o começo',
    thanks: 'Você comprou o Lifetime antes de o coach existir. Essa confiança ajudou a gente a criá-lo, então aqui vai algo em troca.',
    keeps: 'Seu Lifetime mantém todos os recursos Pro, agora e no futuro, sem nada para renovar.',
    gift: 'Adicionamos à sua conta um presente de uso do coach, por nossa conta. Ele nunca expira e funciona sem assinar: pergunte ao seu coach sobre a sua conta, revise um post antes de publicar ou planeje o seu próximo mês.',
    discount: 'Se quiser o coach todo mês, o Pro AI mensal tem 60% de desconto para você, para sempre. Entre na sua conta antes de assinar e o desconto é aplicado automaticamente.',
    askButton: 'Pergunte ao seu coach',
    pricingLink: 'Ver o Pro AI',
    footer: 'Você recebe este email porque comprou o WhoUnfollowed Lifetime. É uma mensagem única sobre a sua compra.',
  },
};

const legacy: Record<AppLocale, LegacyProEmailContent> = {
  en: {
    subject: 'Something new for Pro members',
    preview: 'A small gift of coach use is waiting in your account.',
    title: 'Thank you for going Pro',
    thanks: 'You bought Pro before we had a coach. Thank you for that.',
    keeps: (until) => (until ? `Your Pro stays exactly as it is until ${until}.` : 'Your Pro stays exactly as you bought it.'),
    gift: 'We added a small gift of coach use to your account so you can try it, on us. It never expires: ask your coach about your account or check a post before you publish.',
    yearly: (endsOn) => `Because you bought Pro for a year: subscribe to Pro AI yearly by ${endsOn} and you get $9.99 off. Sign in before you subscribe and it is applied for you.`,
    askButton: 'Try your coach',
    pricingLink: 'See Pro AI',
    footer: 'You get this email because you bought WhoUnfollowed Pro. It is a one-time message about your purchase.',
  },
  es: {
    subject: 'Algo nuevo para los miembros Pro',
    preview: 'Te espera un pequeño regalo de uso del coach en tu cuenta.',
    title: 'Gracias por pasarte a Pro',
    thanks: 'Compraste Pro antes de que tuviéramos un coach. Gracias por eso.',
    keeps: (until) => (until ? `Tu Pro sigue exactamente igual hasta el ${until}.` : 'Tu Pro sigue exactamente como lo compraste.'),
    gift: 'Añadimos a tu cuenta un pequeño regalo de uso del coach para que lo pruebes, por nuestra cuenta. Nunca vence: pregúntale a tu coach por tu cuenta o revisa una publicación antes de subirla.',
    yearly: (endsOn) => `Como compraste Pro por un año: suscríbete a Pro AI anual antes del ${endsOn} y tienes $9.99 de descuento. Inicia sesión antes de suscribirte y se aplica solo.`,
    askButton: 'Prueba tu coach',
    pricingLink: 'Ver Pro AI',
    footer: 'Recibes este email porque compraste WhoUnfollowed Pro. Es un mensaje único sobre tu compra.',
  },
  pt: {
    subject: 'Algo novo para membros Pro',
    preview: 'Um pequeno presente de uso do coach está esperando na sua conta.',
    title: 'Obrigado por assinar o Pro',
    thanks: 'Você comprou o Pro antes de termos um coach. Obrigado por isso.',
    keeps: (until) => (until ? `Seu Pro continua exatamente igual até ${until}.` : 'Seu Pro continua exatamente como você comprou.'),
    gift: 'Adicionamos à sua conta um pequeno presente de uso do coach para você experimentar, por nossa conta. Ele nunca expira: pergunte ao seu coach sobre a sua conta ou revise um post antes de publicar.',
    yearly: (endsOn) => `Como você comprou o Pro por um ano: assine o Pro AI anual até ${endsOn} e ganhe $9.99 de desconto. Entre na sua conta antes de assinar e o desconto é aplicado automaticamente.`,
    askButton: 'Experimente seu coach',
    pricingLink: 'Ver o Pro AI',
    footer: 'Você recebe este email porque comprou o WhoUnfollowed Pro. É uma mensagem única sobre a sua compra.',
  },
};

export const getEarlyLifetimeEmailContent = (locale: AppLocale): EarlyLifetimeEmailContent => early[locale];
export const getLegacyProEmailContent = (locale: AppLocale): LegacyProEmailContent => legacy[locale];
