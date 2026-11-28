import type { AppLocale } from '@/i18n/routing';

// Service emails about what someone bought (never marketing): the Pro AI
// subscription confirmation, the Refill receipt, the consent line added to the
// Lifetime confirmation, and the renewal reminders. They carry what the law
// asks for (.claude/reference/legal-launch-notes.md): plan, price, how often,
// that it renews until cancelled, how to cancel, that the buyer asked us to
// start right away (EU/UK durable medium), the short legal cancel note, and
// links to the Terms and Refund Policy.

export interface BillingEmailContent {
  interval: { month: string; year: string };
  // "$9.99 a month"
  every: (price: string, interval: 'month' | 'year') => string;
  sub: {
    subject: string; preview: string; title: string;
    plan: (interval: string) => string;
    paid: (amount: string) => string;
    renews: (price: string, date: string | null) => string;
    ready: string;
    // Pro AI is in beta (founder, 2026-11-27).
    beta: string;
    button: string;
  };
  refill: {
    subject: string; preview: string; title: string;
    paid: (amount: string) => string;
    body: (until: string) => string;
    final: string;
    button: string;
  };
  remind: {
    yearSubject: (date: string) => string;
    annualSubject: string;
    preview: string;
    title: string;
    year: (price: string, date: string) => string;
    annual: (price: string, date: string) => string;
    keep: string;
    button: string;
  };
  startNow: string;
  cancel: string;
  legal: string;
  links: { terms: string; refund: string };
  footer: string;
}

const all: Record<AppLocale, BillingEmailContent> = {
  en: {
    interval: { month: 'monthly', year: 'yearly' },
    every: (p, i) => `${p} a ${i}`,
    sub: {
      subject: 'Your Pro AI is on',
      preview: 'Your coach is ready in your Studio.',
      title: 'Your Pro AI is on',
      plan: (i) => `Plan: Pro AI ${i}.`,
      paid: (a) => `Paid today: ${a}.`,
      renews: (p, d) => `It renews automatically at ${p} until you cancel${d ? `. Next renewal: ${d}` : ''}.`,
      ready: 'Your coach is ready in your Studio, with generous monthly use that resets every month.',
      beta: 'Pro AI is in beta. Now and then something may not work as it should. If it does, write to hello@whounfollowed.co: we fix it fast and tell you what happened.',
      button: 'Open your Studio',
    },
    refill: {
      subject: 'Your Refill is in',
      preview: 'One more month of coach use, added to your account.',
      title: 'Your Refill is in',
      paid: (a) => `Paid today: ${a}, one time. This is not a subscription.`,
      body: (u) => `One more month of coach use is in your account. It is used after your monthly allowance and stays valid until ${u}.`,
      final: 'Refills are final, except for billing errors and where the law gives you a right to cancel.',
      button: 'Ask your coach',
    },
    remind: {
      yearSubject: (d) => `Your Pro AI renews on ${d}`,
      annualSubject: 'A yearly note about your Pro AI plan',
      preview: 'What renews, when, and how to cancel.',
      title: 'About your Pro AI plan',
      year: (p, d) => `Your yearly Pro AI plan renews on ${d} at ${p}.`,
      annual: (p, d) => `You have been on Pro AI monthly for a while now. It renews at ${p}, next on ${d}.`,
      keep: 'Nothing to do if you want to keep it.',
      button: 'See your plan',
    },
    startNow: 'At checkout you asked us to start right away, so your access began when you paid.',
    cancel: 'Cancel any time in your Studio, under You. You keep access until the end of the period you paid for.',
    legal: 'In the EU and the UK you can still cancel within 14 days of buying and get back what you paid, minus a fair share for what you used. In Brazil you can cancel within 7 days for a full refund. Write to hello@whounfollowed.co.',
    links: { terms: 'Terms', refund: 'Refund Policy' },
    footer: 'You get this email because of a purchase on your WhoUnfollowed account.',
  },
  es: {
    interval: { month: 'mensual', year: 'anual' },
    every: (p, i) => `${p} al ${i === 'month' ? 'mes' : 'año'}`,
    sub: {
      subject: 'Tu Pro AI está activo',
      preview: 'Tu coach te espera en tu Studio.',
      title: 'Tu Pro AI está activo',
      plan: (i) => `Plan: Pro AI ${i}.`,
      paid: (a) => `Pagado hoy: ${a}.`,
      renews: (p, d) => `Se renueva automáticamente a ${p} hasta que lo canceles${d ? `. Próxima renovación: ${d}` : ''}.`,
      ready: 'Tu coach te espera en tu Studio, con un uso mensual generoso que se renueva cada mes.',
      beta: 'Pro AI está en beta. De vez en cuando algo puede no ir como debería. Si pasa, escríbenos a hello@whounfollowed.co: lo arreglamos rápido y te contamos qué pasó.',
      button: 'Abrir tu Studio',
    },
    refill: {
      subject: 'Tu Recarga ya está',
      preview: 'Un mes más de uso del coach, añadido a tu cuenta.',
      title: 'Tu Recarga ya está',
      paid: (a) => `Pagado hoy: ${a}, una sola vez. No es una suscripción.`,
      body: (u) => `Ya tienes en tu cuenta un mes más de uso del coach. Se usa después de tu uso mensual y es válido hasta el ${u}.`,
      final: 'Las Recargas son definitivas, salvo errores de cobro y cuando la ley te da derecho a cancelar.',
      button: 'Preguntar a tu coach',
    },
    remind: {
      yearSubject: (d) => `Tu Pro AI se renueva el ${d}`,
      annualSubject: 'Una nota anual sobre tu plan Pro AI',
      preview: 'Qué se renueva, cuándo y cómo cancelar.',
      title: 'Sobre tu plan Pro AI',
      year: (p, d) => `Tu plan anual de Pro AI se renueva el ${d} a ${p}.`,
      annual: (p, d) => `Llevas un tiempo con Pro AI mensual. Se renueva a ${p}, la próxima vez el ${d}.`,
      keep: 'Si quieres seguir, no tienes que hacer nada.',
      button: 'Ver tu plan',
    },
    startNow: 'Al pagar nos pediste empezar de inmediato, así que tu acceso empezó cuando pagaste.',
    cancel: 'Cancela cuando quieras en tu Studio, en Tú. Mantienes el acceso hasta el final del periodo que pagaste.',
    legal: 'En la UE y el Reino Unido puedes cancelar dentro de los 14 días posteriores a la compra y recuperar lo que pagaste, menos una parte justa por lo que usaste. En Brasil puedes cancelar dentro de 7 días con reembolso completo. Escríbenos a hello@whounfollowed.co.',
    links: { terms: 'Términos', refund: 'Política de reembolsos' },
    footer: 'Recibes este correo por una compra en tu cuenta de WhoUnfollowed.',
  },
  pt: {
    interval: { month: 'mensal', year: 'anual' },
    every: (p, i) => `${p} por ${i === 'month' ? 'mês' : 'ano'}`,
    sub: {
      subject: 'Seu Pro AI está ativo',
      preview: 'Seu coach está pronto no seu Studio.',
      title: 'Seu Pro AI está ativo',
      plan: (i) => `Plano: Pro AI ${i}.`,
      paid: (a) => `Pago hoje: ${a}.`,
      renews: (p, d) => `Ele renova automaticamente por ${p} até você cancelar${d ? `. Próxima renovação: ${d}` : ''}.`,
      ready: 'Seu coach está pronto no seu Studio, com um uso mensal generoso que renova todo mês.',
      beta: 'O Pro AI está em beta. De vez em quando algo pode não funcionar como deveria. Se acontecer, escreva para hello@whounfollowed.co: corrigimos rápido e contamos o que aconteceu.',
      button: 'Abrir seu Studio',
    },
    refill: {
      subject: 'Sua Recarga chegou',
      preview: 'Mais um mês de uso do coach, adicionado à sua conta.',
      title: 'Sua Recarga chegou',
      paid: (a) => `Pago hoje: ${a}, uma única vez. Não é uma assinatura.`,
      body: (u) => `Mais um mês de uso do coach está na sua conta. Ele é usado depois do seu uso mensal e vale até ${u}.`,
      final: 'Recargas são definitivas, exceto por erros de cobrança e quando a lei dá direito de cancelar.',
      button: 'Perguntar ao seu coach',
    },
    remind: {
      yearSubject: (d) => `Seu Pro AI renova em ${d}`,
      annualSubject: 'Um aviso anual sobre seu plano Pro AI',
      preview: 'O que renova, quando e como cancelar.',
      title: 'Sobre seu plano Pro AI',
      year: (p, d) => `Seu plano anual do Pro AI renova em ${d} por ${p}.`,
      annual: (p, d) => `Você já está no Pro AI mensal há um tempo. Ele renova por ${p}, a próxima vez em ${d}.`,
      keep: 'Se quiser continuar, não precisa fazer nada.',
      button: 'Ver seu plano',
    },
    startNow: 'No pagamento você pediu para começarmos agora, então seu acesso começou quando você pagou.',
    cancel: 'Cancele quando quiser no seu Studio, em Você. Você mantém o acesso até o fim do período pago.',
    legal: 'No Brasil você pode cancelar em até 7 dias após a compra, com reembolso total. Na UE e no Reino Unido, em até 14 dias, recebendo de volta o que pagou menos uma parte justa pelo que usou. Escreva para hello@whounfollowed.co.',
    links: { terms: 'Termos', refund: 'Política de reembolso' },
    footer: 'Você recebe este e-mail por causa de uma compra na sua conta WhoUnfollowed.',
  },
};

export const getBillingEmailContent = (locale: AppLocale): BillingEmailContent => all[locale];
