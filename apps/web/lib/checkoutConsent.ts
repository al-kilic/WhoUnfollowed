import type Stripe from 'stripe';
import type { AppLocale } from '@/i18n/routing';
import { localizedPathname } from '@/i18n/localizedPathname';

// Every paid checkout asks the buyer, before paying, to accept the Terms and
// to ask for the service to start right away (EU CRD art 7(3)/8(8), UK CCR
// reg 36: an express request to start). For a digital service this does NOT
// end the 14-day right: a buyer who withdraws pays a proportionate amount
// (CRD art 14(3)), and Brazil's 7-day right (CDC art 49) can't be waived, so
// the text says so honestly. Pro AI also carries the auto-renewal disclosure
// (California ARL). See .claude/reference/legal-launch-notes.md. Stripe shows a required checkbox
// (consent_collection.terms_of_service) with this text next to it, and records
// `consent.terms_of_service: 'accepted'` on the session (dispute evidence).
// Needs a Terms of Service URL in Stripe > Settings > Business > Public
// details, or Stripe rejects the session.

export type ConsentProduct = 'pro_ai' | 'topup' | 'lifetime';

type Links = { terms: string; refund: string };

const TEXT: Record<AppLocale, Record<ConsentProduct, (l: Links) => string>> = {
  en: {
    pro_ai: (l) => `I agree to the [Terms](${l.terms}) and ask for Pro AI to start right away. I understand Pro AI is in beta, so some features may not always work as expected, and issues are fixed as quickly as possible. It renews automatically each month or year at the price shown until I cancel, which I can do any time in my account. Payments are final except for billing errors and the legal right to cancel in some countries, such as 14 days in the EU and UK, where I pay only for what I already used ([Refund Policy](${l.refund})).`,
    topup: (l) => `I agree to the [Terms](${l.terms}) and ask for this refill to be added to my coach right away. I understand Pro AI is in beta and issues are fixed as quickly as possible. This is a one-time payment. Payments are final except for billing errors and the legal right to cancel in some countries, such as 14 days in the EU and UK, where I pay only for what I already used ([Refund Policy](${l.refund})).`,
    lifetime: (l) => `I agree to the [Terms](${l.terms}) and ask for Lifetime to start right away. This is a one-time payment. Payments are final except for billing errors and the legal right to cancel in some countries, such as 14 days in the EU and UK, where I pay only for what I already used ([Refund Policy](${l.refund})).`,
  },
  es: {
    pro_ai: (l) => `Acepto los [Términos](${l.terms}) y pido que Pro AI empiece de inmediato. Entiendo que Pro AI está en beta, así que algunas funciones pueden no ir siempre como se espera, y los fallos se arreglan lo antes posible. Se renueva automáticamente cada mes o cada año al precio indicado hasta que lo cancele, y puedo hacerlo cuando quiera desde mi cuenta. Los pagos son definitivos, salvo por errores de cobro y el derecho legal a cancelar de algunos países, como 14 días en la UE y el Reino Unido, donde solo pago lo que ya usé ([Política de reembolsos](${l.refund})).`,
    topup: (l) => `Acepto los [Términos](${l.terms}) y pido que esta recarga se añada a mi coach de inmediato. Entiendo que Pro AI está en beta y que los fallos se arreglan lo antes posible. Es un pago único. Los pagos son definitivos, salvo por errores de cobro y el derecho legal a cancelar de algunos países, como 14 días en la UE y el Reino Unido, donde solo pago lo que ya usé ([Política de reembolsos](${l.refund})).`,
    lifetime: (l) => `Acepto los [Términos](${l.terms}) y pido que Lifetime empiece de inmediato. Es un pago único. Los pagos son definitivos, salvo por errores de cobro y el derecho legal a cancelar de algunos países, como 14 días en la UE y el Reino Unido, donde solo pago lo que ya usé ([Política de reembolsos](${l.refund})).`,
  },
  pt: {
    pro_ai: (l) => `Aceito os [Termos](${l.terms}) e peço que o Pro AI comece agora. Entendo que o Pro AI está em beta, então alguns recursos podem nem sempre funcionar como esperado, e os problemas são corrigidos o mais rápido possível. Ele renova automaticamente a cada mês ou ano pelo preço mostrado até eu cancelar, o que posso fazer a qualquer momento na minha conta. Os pagamentos são definitivos, exceto por erros de cobrança e pelo direito legal de cancelar em alguns países, como 7 dias no Brasil ([Política de reembolso](${l.refund})).`,
    topup: (l) => `Aceito os [Termos](${l.terms}) e peço que esta recarga seja adicionada ao meu coach agora. Entendo que o Pro AI está em beta e que os problemas são corrigidos o mais rápido possível. É um pagamento único. Os pagamentos são definitivos, exceto por erros de cobrança e pelo direito legal de cancelar em alguns países, como 7 dias no Brasil ([Política de reembolso](${l.refund})).`,
    lifetime: (l) => `Aceito os [Termos](${l.terms}) e peço que o Lifetime comece agora. É um pagamento único. Os pagamentos são definitivos, exceto por erros de cobrança e pelo direito legal de cancelar em alguns países, como 7 dias no Brasil ([Política de reembolso](${l.refund})).`,
  },
};

export function consentMessage(product: ConsentProduct, locale: AppLocale, appUrl: string): string {
  return TEXT[locale][product]({
    terms: `${appUrl}${localizedPathname('/terms', locale)}`,
    refund: `${appUrl}${localizedPathname('/refund', locale)}`,
  });
}

export function checkoutConsent(product: ConsentProduct, locale: AppLocale, appUrl: string): Pick<Stripe.Checkout.SessionCreateParams, 'consent_collection' | 'custom_text'> {
  return {
    consent_collection: { terms_of_service: 'required' },
    custom_text: { terms_of_service_acceptance: { message: consentMessage(product, locale, appUrl) } },
  };
}
