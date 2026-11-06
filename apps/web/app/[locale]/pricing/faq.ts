import type { AppLocale } from '@/i18n/routing';
import { LAUNCH_UNLOCK_PRICE_USD as L, STANDARD_UNLOCK_PRICE_USD as S, LIFETIME_TIERS, LIFETIME_TOTAL_SEATS } from '@/lib/pricing';

const [T1, T2, T3] = LIFETIME_TIERS.map((t) => t.price);

/**
 * Pricing page FAQ, per locale.
 *
 * Lives in its own module (not inside PricingClient) so the server component in
 * page.tsx can emit FAQPage JSON-LD from the exact same source. Schema.org
 * markup must match the visible on-page text, and sharing one array per
 * locale is the only way to guarantee the two never drift apart.
 */
export interface PricingFaqItem {
  q: string;
  a: string;
}

const PRICING_FAQ_EN: PricingFaqItem[] = [
  {
    q: 'Is it really free?',
    a: 'Yes. Seeing who doesn\'t follow you back, sorting that list, and one CSV export are free forever, with no account. Pro remembers every export, so each new one shows exactly who unfollowed you and when.',
  },
  {
    q: 'Does Pro auto-renew?',
    a: 'No. It\'s a one-time payment that unlocks Pro for 30 or 365 days. When it runs out, buy again if you want to keep going. No recurring charge, ever.',
  },
  {
    q: 'What is the Lifetime Insider option?',
    a: `Pay once, keep Pro forever. Lifetime sells in a fixed number of seats: the first ones cost $${T1}, the next $${T2}, the last $${T3}. When all ${LIFETIME_TOTAL_SEATS} are gone, Lifetime closes for good. Insiders also get a private community, Pro benefits on future tools, and hear first about new launches.`,
  },
  {
    q: 'Will the price go up?',
    a: `Yes. Launch prices ($${L.monthly} for 30 days, $${L.yearly} for a year) last until December 31. From January 1 they are $${S.monthly} and $${S.yearly}. Anything you buy before then keeps its full time.`,
  },
  {
    q: 'Do I need to give you my Instagram or Threads password?',
    a: 'Never. You download your own data from Instagram or Threads and upload the ZIP here. We have no connection to either app whatsoever.',
  },
  {
    q: 'Is my Instagram or Threads data safe?',
    a: 'Yes. ZIP parsing happens entirely in your browser, so nothing is sent to us. Cloud-synced snapshots are encrypted in your browser before leaving your device. We store only blobs we cannot read.',
  },
];

const PRICING_FAQ_ES: PricingFaqItem[] = [
  {
    q: '¿De verdad es gratis?',
    a: 'Sí. Ver quién no te sigue de vuelta, ordenar esa lista y una exportación CSV son gratis para siempre, sin cuenta. Pro recuerda cada exportación, así cada nueva te muestra exactamente quién te dejó de seguir y cuándo.',
  },
  {
    q: '¿Pro se renueva automáticamente?',
    a: 'No. Es un pago único que desbloquea Pro por 30 o 365 días. Cuando se acaba, puedes comprarlo de nuevo si quieres seguir usándolo. Nunca hay cobro recurrente.',
  },
  {
    q: '¿Qué es la opción Lifetime de Insider?',
    a: `Paga una vez y conserva Pro para siempre. Lifetime se vende en un número fijo de plazas: las primeras cuestan $${T1}, las siguientes $${T2} y las últimas $${T3}. Cuando se acaben las ${LIFETIME_TOTAL_SEATS}, Lifetime cierra para siempre. Los Insiders también tienen una comunidad privada, beneficios Pro en futuras herramientas y se enteran primero de cada lanzamiento.`,
  },
  {
    q: '¿Va a subir el precio?',
    a: `Sí. Los precios de lanzamiento ($${L.monthly} por 30 días, $${L.yearly} por un año) duran hasta el 31 de diciembre. Desde el 1 de enero son $${S.monthly} y $${S.yearly}. Lo que compres antes conserva todo su tiempo.`,
  },
  {
    q: '¿Tengo que darles mi contraseña de Instagram o Threads?',
    a: 'Nunca. Descargas tus propios datos desde Instagram o Threads y subes el ZIP aquí. No tenemos ninguna conexión con ninguna de las dos apps.',
  },
  {
    q: '¿Mis datos de Instagram o Threads están seguros?',
    a: 'Sí. El ZIP se procesa por completo en tu navegador, así que nada se nos envía. Las copias sincronizadas en la nube se cifran en tu navegador antes de salir de tu dispositivo. Solo guardamos datos que no podemos leer.',
  },
];

const PRICING_FAQ_PT: PricingFaqItem[] = [
  {
    q: 'É mesmo gratuito?',
    a: 'Sim. Ver quem não te segue de volta, organizar essa lista e uma exportação CSV são grátis para sempre, sem conta. O Pro lembra cada exportação, então cada nova mostra exatamente quem deixou de te seguir e quando.',
  },
  {
    q: 'O Pro renova automaticamente?',
    a: 'Não. É um pagamento único que libera o Pro por 30 ou 365 dias. Quando o prazo acaba, você compra de novo se quiser continuar. Nunca há cobrança recorrente.',
  },
  {
    q: 'O que é a opção Lifetime de Insider?',
    a: `Pague uma vez e fique com o Pro para sempre. O Lifetime é vendido em um número fixo de vagas: as primeiras custam $${T1}, as seguintes $${T2} e as últimas $${T3}. Quando as ${LIFETIME_TOTAL_SEATS} acabarem, o Lifetime fecha de vez. Insiders também têm uma comunidade privada, benefícios Pro em ferramentas futuras e ficam sabendo primeiro de cada lançamento.`,
  },
  {
    q: 'O preço vai subir?',
    a: `Sim. Os preços de lançamento ($${L.monthly} por 30 dias, $${L.yearly} por um ano) valem até 31 de dezembro. A partir de 1º de janeiro são $${S.monthly} e $${S.yearly}. O que você comprar antes mantém todo o tempo.`,
  },
  {
    q: 'Preciso dar minha senha do Instagram ou do Threads?',
    a: 'Nunca. Você baixa os próprios dados do Instagram ou do Threads e envia o ZIP aqui. Não temos nenhuma conexão com nenhum dos dois apps.',
  },
  {
    q: 'Meus dados do Instagram ou do Threads estão seguros?',
    a: 'Sim. O ZIP é processado inteiramente no seu navegador, então nada é enviado para nós. Os snapshots sincronizados na nuvem são criptografados no seu navegador antes de sair do dispositivo. Guardamos apenas dados que não conseguimos ler.',
  },
];

export function getPricingFaq(locale: AppLocale): PricingFaqItem[] {
  if (locale === 'es') return PRICING_FAQ_ES;
  if (locale === 'pt') return PRICING_FAQ_PT;
  return PRICING_FAQ_EN;
}
