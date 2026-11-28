import type { AppLocale } from '@/i18n/routing';

export interface RefundContent {
  eyebrow: string;
  headline: string;
  lastUpdated: string;
  s1Title: string; s1Body: string;
  s2Title: string; s2Body: string;
  s3Title: string; s3Body: string;
  s4Title: string; s4Body: string;
  s5Title: string; s5Pre: string; s5Post: string;
  backToHome: string;
}

const EN: RefundContent = {
  eyebrow: 'LEGAL',
  headline: 'Refund Policy',
  lastUpdated: 'Last updated: November 24, 2026',
  s1Title: 'Payments are final',
  s1Body: 'We don\'t offer refunds for Pro AI subscriptions, Refills or Lifetime, including partial periods, except where the law gives you a right to cancel (see below). We would rather say this clearly up front than surprise anyone later.',
  s2Title: 'Try it free first',
  s2Body: 'Seeing who unfollowed you, who doesn\'t follow you back and how your account changes over time is free, with no time limit. Studio also has a sample mode that shows the coach working on a made-up account, so you can see what Pro AI does before you pay.',
  s3Title: 'Cancelling',
  s3Body: 'You can cancel Pro AI at any time from your account page. It stops renewing, you keep everything until the end of the period you already paid for, and nothing more is charged.',
  s4Title: 'Your legal right to cancel',
  s4Body: 'Pro AI, Refills and Lifetime start as soon as you pay, because at checkout you ask us to start right away. Some countries still give you a right to cancel an online purchase, and we always honour it. In the EU and the UK you can cancel within 14 days of buying: we refund what you paid minus a fair share for what you already received (for a subscription, the days you had it; for a Refill, the part you used). Once a service has been fully provided, this right ends. In Brazil you can cancel within 7 days of buying and we refund the full amount. To cancel this way, write to us within that time at the address below. We refund to your original payment method within 14 days.',
  s5Title: 'If something went wrong with billing',
  s5Pre: 'We never want anyone to feel cheated. If you were charged twice, charged after you cancelled, or charged the wrong amount, write to us at',
  s5Post: 'and we will fix it and refund the mistake. Please write to us before opening a dispute with your bank: it is faster for you, and we answer every message.',
  backToHome: 'Back to WhoUnfollowed',
};

const ES: RefundContent = {
  eyebrow: 'LEGAL',
  headline: 'Política de Reembolsos',
  lastUpdated: 'Última actualización: 24 de noviembre de 2026',
  s1Title: 'Los pagos son definitivos',
  s1Body: 'No ofrecemos reembolsos de suscripciones Pro AI, Recargas ni Lifetime, incluidos los períodos parciales, salvo cuando la ley te dé derecho a cancelar (lo explicamos abajo). Preferimos decirlo claro desde el principio antes que sorprender a alguien después.',
  s2Title: 'Pruébalo gratis primero',
  s2Body: 'Ver quién dejó de seguirte, quién no te sigue de vuelta y cómo cambia tu cuenta con el tiempo es gratis, sin límite de tiempo. Studio también tiene un modo de ejemplo que muestra al coach trabajando con una cuenta inventada, para que veas lo que hace Pro AI antes de pagar.',
  s3Title: 'Cancelar',
  s3Body: 'Puedes cancelar Pro AI cuando quieras desde tu página de cuenta. Deja de renovarse, mantienes todo hasta el final del período que ya pagaste y no se cobra nada más.',
  s4Title: 'Tu derecho legal a cancelar',
  s4Body: 'Pro AI, las Recargas y Lifetime empiezan en cuanto pagas, porque al pagar nos pides que empecemos de inmediato. Algunos países te dan igualmente derecho a cancelar una compra en línea, y siempre lo respetamos. En la UE y el Reino Unido puedes cancelar dentro de los 14 días posteriores a la compra: te devolvemos lo que pagaste menos una parte justa por lo que ya recibiste (en una suscripción, los días que la tuviste; en una Recarga, la parte que usaste). Cuando un servicio ya se prestó por completo, este derecho termina. En Brasil puedes cancelar dentro de los 7 días posteriores a la compra y te devolvemos el importe completo. Para cancelar así, escríbenos dentro de ese plazo a la dirección de abajo. Te devolvemos el dinero al mismo medio de pago en un plazo de 14 días.',
  s5Title: 'Si algo salió mal con el cobro',
  s5Pre: 'Nunca queremos que nadie se sienta engañado. Si te cobramos dos veces, te cobramos después de cancelar o te cobramos un importe equivocado, escríbenos a',
  s5Post: 'y lo corregiremos y te devolveremos el error. Escríbenos antes de abrir una disputa con tu banco: es más rápido para ti y respondemos todos los mensajes.',
  backToHome: 'Volver a WhoUnfollowed',
};

const PT: RefundContent = {
  eyebrow: 'LEGAL',
  headline: 'Política de Reembolso',
  lastUpdated: 'Última atualização: 24 de novembro de 2026',
  s1Title: 'Os pagamentos são definitivos',
  s1Body: 'Não oferecemos reembolso de assinaturas Pro AI, Recargas nem Lifetime, incluindo períodos parciais, exceto quando a lei te der o direito de cancelar (veja abaixo). Preferimos dizer isso com clareza desde o início a surpreender alguém depois.',
  s2Title: 'Experimente grátis primeiro',
  s2Body: 'Ver quem deixou de te seguir, quem não te segue de volta e como sua conta muda com o tempo é grátis, sem limite de tempo. O Studio também tem um modo de exemplo que mostra o coach trabalhando com uma conta inventada, para você ver o que o Pro AI faz antes de pagar.',
  s3Title: 'Cancelar',
  s3Body: 'Você pode cancelar o Pro AI quando quiser na página da sua conta. Ele deixa de renovar, você mantém tudo até o fim do período já pago e nada mais é cobrado.',
  s4Title: 'Seu direito legal de cancelar',
  s4Body: 'O Pro AI, as Recargas e o Lifetime começam assim que você paga, porque no checkout você nos pede para começar na hora. Alguns países ainda te dão o direito de cancelar uma compra online, e sempre respeitamos isso. No Brasil, você pode desistir em até 7 dias da compra e devolvemos o valor integral. Na UE e no Reino Unido, você pode cancelar em até 14 dias da compra: devolvemos o que você pagou menos uma parte justa pelo que já recebeu (numa assinatura, os dias em que a teve; numa Recarga, a parte que usou). Quando um serviço já foi prestado por completo, esse direito termina. Para cancelar assim, escreva para nós dentro desse prazo no endereço abaixo. Devolvemos o valor no mesmo meio de pagamento em até 14 dias.',
  s5Title: 'Se algo deu errado na cobrança',
  s5Pre: 'Nunca queremos que alguém se sinta enganado. Se você foi cobrado duas vezes, cobrado depois de cancelar ou cobrado no valor errado, escreva para',
  s5Post: 'e vamos corrigir e devolver o erro. Escreva para nós antes de abrir uma contestação no seu banco: é mais rápido para você, e respondemos todas as mensagens.',
  backToHome: 'Voltar ao WhoUnfollowed',
};

export function getRefundContent(locale: AppLocale): RefundContent {
  if (locale === 'es') return ES;
  if (locale === 'pt') return PT;
  return EN;
}
