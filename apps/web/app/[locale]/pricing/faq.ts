import type { AppLocale } from '@/i18n/routing';

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
    a: 'Yes. The core app (see who unfollowed you, who doesn\'t follow back, CSV export) is free forever and needs no account. Pro is optional and adds history, cloud sync, and trends.',
  },
  {
    q: 'Does Pro auto-renew?',
    a: 'No. It\'s a one-time payment that unlocks Pro for 30 or 365 days. When it runs out, buy again if you want to keep going. No recurring charge, ever.',
  },
  {
    q: 'Why charge for Pro at all?',
    a: 'To keep the lights on. Pro covers servers and storage so the free app stays free, fast, and independent. No ads, no investors, no selling your data.',
  },
  {
    q: 'Do I need to give you my Instagram password?',
    a: 'Never. You download your own data from Instagram and upload the ZIP here. We have no connection to Instagram whatsoever.',
  },
  {
    q: 'Is my Instagram data safe?',
    a: 'Yes. ZIP parsing happens entirely in your browser, so nothing is sent to us. Cloud-synced snapshots are encrypted in your browser before leaving your device. We store only blobs we cannot read.',
  },
];

const PRICING_FAQ_ES: PricingFaqItem[] = [
  {
    q: '¿De verdad es gratis?',
    a: 'Sí. La app principal (ver quién te dejó de seguir, quién no te sigue de vuelta, exportar a CSV) es gratis para siempre y no necesita cuenta. Pro es opcional y añade historial, sincronización en la nube y tendencias.',
  },
  {
    q: '¿Pro se renueva automáticamente?',
    a: 'No. Es un pago único que desbloquea Pro por 30 o 365 días. Cuando se acaba, puedes comprarlo de nuevo si quieres seguir usándolo. Nunca hay cobro recurrente.',
  },
  {
    q: '¿Por qué cobrar por Pro?',
    a: 'Para mantener el servicio funcionando. Pro cubre los servidores y el almacenamiento para que la app gratuita siga siendo gratis, rápida e independiente. Sin anuncios, sin inversores, sin vender tus datos.',
  },
  {
    q: '¿Tengo que darles mi contraseña de Instagram?',
    a: 'Nunca. Descargas tus propios datos desde Instagram y subes el ZIP aquí. No tenemos ninguna conexión con Instagram.',
  },
  {
    q: '¿Mis datos de Instagram están seguros?',
    a: 'Sí. El ZIP se procesa por completo en tu navegador, así que nada se nos envía. Las copias sincronizadas en la nube se cifran en tu navegador antes de salir de tu dispositivo. Solo guardamos datos que no podemos leer.',
  },
];

const PRICING_FAQ_PT: PricingFaqItem[] = [
  {
    q: 'É mesmo gratuito?',
    a: 'Sim. O app principal (ver quem deixou de te seguir, quem não te segue de volta, exportar CSV) é gratuito para sempre e não precisa de conta. O Pro é opcional e adiciona histórico, sincronização na nuvem e tendências.',
  },
  {
    q: 'O Pro renova automaticamente?',
    a: 'Não. É um pagamento único que libera o Pro por 30 ou 365 dias. Quando o prazo acaba, você compra de novo se quiser continuar. Nunca há cobrança recorrente.',
  },
  {
    q: 'Por que cobrar pelo Pro?',
    a: 'Para manter o serviço no ar. O Pro cobre servidores e armazenamento para que o app gratuito continue grátis, rápido e independente. Sem anúncios, sem investidores, sem venda dos seus dados.',
  },
  {
    q: 'Preciso dar minha senha do Instagram?',
    a: 'Nunca. Você baixa os próprios dados do Instagram e envia o ZIP aqui. Não temos nenhuma conexão com o Instagram.',
  },
  {
    q: 'Meus dados do Instagram estão seguros?',
    a: 'Sim. O ZIP é processado inteiramente no seu navegador, então nada é enviado para nós. Os snapshots sincronizados na nuvem são criptografados no seu navegador antes de sair do dispositivo. Guardamos apenas dados que não conseguimos ler.',
  },
];

export function getPricingFaq(locale: AppLocale): PricingFaqItem[] {
  if (locale === 'es') return PRICING_FAQ_ES;
  if (locale === 'pt') return PRICING_FAQ_PT;
  return PRICING_FAQ_EN;
}
