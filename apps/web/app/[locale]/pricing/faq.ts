import type { AppLocale } from '@/i18n/routing';
import { LAUNCH_PRO_AI_PRICE_USD as L, STANDARD_PRO_AI_PRICE_USD as S, LIFETIME_PRICE_USD as LT, LIFETIME_TOTAL_SEATS, TOPUP_PRICE_USD, TOPUP_VALID_MONTHS } from '@/lib/pricing';

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
    a: 'Yes. Seeing who doesn\'t follow you back, sorting that list, and one CSV export are free forever, with no account. Pro AI adds a coach that remembers your account, plus every export kept so each new one shows exactly who unfollowed you and when.',
  },
  {
    q: 'Does Pro AI renew automatically, and can I cancel?',
    a: 'Yes, it renews each month or each year, and you can cancel any time in two clicks from your account. You keep Pro AI until the end of the period you paid for.',
  },
  {
    q: 'What does the AI see?',
    a: 'Only what you choose to give it: the numbers from your exports (counts and dates), your answers about your account, and the posts you ask it to check or write. Never your followers or their usernames. Requests go only to AI providers that don\'t train on them, and you can read, edit or delete your coach\'s memory any time.',
  },
  {
    q: 'Is there a limit?',
    a: `Yes, a generous monthly one that most people never reach. Asking your coach, drafts, post checks, plans and photo insights all come from the same monthly use, and a short question uses much less than a long post check. If you do reach it, it resets with your plan, or you can refill a full month for half price, $${TOPUP_PRICE_USD}, valid for ${TOPUP_VALID_MONTHS} months.`,
  },
  {
    q: 'What is the Lifetime Insider option?',
    a: `Pay once, keep Pro forever. Lifetime costs $${LT} once, with ${LIFETIME_TOTAL_SEATS} seats, and is sold only until December 31, 2026. Then it closes for good. Insiders also get the founding Insider club (a private group and community that opens at 10 members, with perks like generous affiliate rates), Pro AI for life as our base paid plan, with the same monthly coach use as subscribers (bigger plans we add later aren't included, but Insiders get a discount on them), Pro features on future tools, and hear first about new launches.`,
  },
  {
    q: 'Will the price go up?',
    a: `Yes. Launch prices ($${L.monthly} a month, $${L.yearly} a year) last until December 31. From January 1 they are $${S.monthly} and $${S.yearly}. If you subscribe before then, you keep the launch price for as long as you stay.`,
  },
  {
    q: 'Do I need to give you my Instagram, Threads or TikTok password?',
    a: 'Never. You download your own data from Instagram, Threads or TikTok and upload the file here. We have no connection to any of these apps whatsoever.',
  },
  {
    q: 'Is my Instagram, Threads or TikTok data safe?',
    a: 'Yes. File parsing happens entirely in your browser, so your lists are never sent to us. Cloud-synced snapshots are encrypted in your browser before leaving your device. With Pro AI, only the numbers from an export (no usernames) reach our server.',
  },
];

const PRICING_FAQ_ES: PricingFaqItem[] = [
  {
    q: '¿De verdad es gratis?',
    a: 'Sí. Ver quién no te sigue de vuelta, ordenar esa lista y una exportación CSV son gratis para siempre, sin cuenta. Pro AI suma un coach que recuerda tu cuenta y guarda cada exportación, así cada nueva te muestra exactamente quién te dejó de seguir y cuándo.',
  },
  {
    q: '¿Pro AI se renueva solo? ¿Puedo cancelar?',
    a: 'Sí, se renueva cada mes o cada año, y puedes cancelar cuando quieras en dos clics desde tu cuenta. Mantienes Pro AI hasta el final del periodo que pagaste.',
  },
  {
    q: '¿Qué ve la IA?',
    a: 'Solo lo que tú le das: las cifras de tus exportaciones (conteos y fechas), tus respuestas sobre tu cuenta y los posts que le pidas revisar o escribir. Nunca tus seguidores ni sus nombres de usuario. Las peticiones van solo a proveedores de IA que no entrenan con ellas, y puedes leer, editar o borrar la memoria de tu coach cuando quieras.',
  },
  {
    q: '¿Hay un límite?',
    a: `Sí, uno mensual y generoso que la mayoría nunca alcanza. Preguntarle a tu coach, los borradores, las revisiones de posts, los planes y el análisis de tus fotos salen del mismo uso mensual, y una pregunta corta usa mucho menos que una revisión larga. Si llegas al límite, se renueva con tu plan, o puedes recargar un mes completo a mitad de precio, $${TOPUP_PRICE_USD}, válido ${TOPUP_VALID_MONTHS} meses.`,
  },
  {
    q: '¿Qué es la opción Lifetime de Insider?',
    a: `Paga una vez y conserva Pro para siempre. Lifetime cuesta $${LT} una sola vez, con ${LIFETIME_TOTAL_SEATS} plazas, y solo se vende hasta el 31 de diciembre de 2026. Después cierra para siempre. Los Insiders también tienen el club de Insiders fundadores (un grupo y una comunidad privados que abren al llegar a 10 miembros, con ventajas como comisiones de afiliado generosas), Pro AI de por vida como nuestro plan pago base, con el mismo uso mensual del coach que los suscriptores (los planes más grandes que agreguemos después no están incluidos, pero los Insiders tienen descuento en ellos), funciones Pro en futuras herramientas y se enteran primero de cada lanzamiento.`,
  },
  {
    q: '¿Va a subir el precio?',
    a: `Sí. Los precios de lanzamiento ($${L.monthly} al mes, $${L.yearly} al año) duran hasta el 31 de diciembre. Desde el 1 de enero son $${S.monthly} y $${S.yearly}. Si te suscribes antes, mantienes el precio de lanzamiento mientras sigas suscrito.`,
  },
  {
    q: '¿Tengo que darte mi contraseña de Instagram, Threads o TikTok?',
    a: 'Nunca. Descargas tus propios datos de Instagram, Threads o TikTok y subes el archivo aquí. No tenemos ninguna conexión con estas apps.',
  },
  {
    q: '¿Están seguros mis datos de Instagram, Threads o TikTok?',
    a: 'Sí. El archivo se procesa entero en tu navegador, así que tus listas nunca nos llegan. Los snapshots sincronizados se cifran en tu navegador antes de salir de tu dispositivo. Con Pro AI, solo las cifras de una exportación (sin nombres de usuario) llegan a nuestro servidor.',
  },
];

const PRICING_FAQ_PT: PricingFaqItem[] = [
  {
    q: 'É grátis mesmo?',
    a: 'Sim. Ver quem não te segue de volta, organizar essa lista e uma exportação CSV são grátis para sempre, sem conta. O Pro AI traz um coach que lembra da sua conta e guarda cada exportação, então cada nova mostra exatamente quem deixou de te seguir e quando.',
  },
  {
    q: 'O Pro AI renova sozinho? Posso cancelar?',
    a: 'Sim, renova a cada mês ou a cada ano, e você pode cancelar quando quiser em dois cliques na sua conta. Você continua com o Pro AI até o fim do período pago.',
  },
  {
    q: 'O que a IA vê?',
    a: 'Só o que você der a ela: os números das suas exportações (contagens e datas), suas respostas sobre a conta e os posts que você pedir para checar ou escrever. Nunca seus seguidores nem os nomes de usuário deles. Os pedidos vão só para provedores de IA que não treinam com eles, e você pode ler, editar ou apagar a memória do seu coach quando quiser.',
  },
  {
    q: 'Existe um limite?',
    a: `Sim, um limite mensal generoso que a maioria nunca alcança. Perguntar ao seu coach, rascunhos, revisões de posts, planos e a análise das suas fotos saem do mesmo uso mensal, e uma pergunta curta usa bem menos que uma revisão longa. Se você chegar ao limite, ele renova com o seu plano, ou você pode recarregar um mês inteiro pela metade do preço, $${TOPUP_PRICE_USD}, válido por ${TOPUP_VALID_MONTHS} meses.`,
  },
  {
    q: 'O que é a opção Lifetime de Insider?',
    a: `Pague uma vez e fique com o Pro para sempre. O Lifetime custa $${LT} uma única vez, com ${LIFETIME_TOTAL_SEATS} vagas, e só é vendido até 31 de dezembro de 2026. Depois fecha de vez. Insiders também têm o clube de Insiders fundadores (um grupo e uma comunidade privados que abrem ao chegar a 10 membros, com vantagens como comissões de afiliado generosas), o Pro AI para sempre como nosso plano pago base, com o mesmo uso mensal do coach dos assinantes (planos maiores que adicionarmos depois não estão incluídos, mas os Insiders têm desconto neles), recursos Pro em ferramentas futuras e ficam sabendo primeiro de cada lançamento.`,
  },
  {
    q: 'O preço vai subir?',
    a: `Sim. Os preços de lançamento ($${L.monthly} por mês, $${L.yearly} por ano) valem até 31 de dezembro. A partir de 1º de janeiro passam a $${S.monthly} e $${S.yearly}. Se você assinar antes, mantém o preço de lançamento enquanto continuar assinando.`,
  },
  {
    q: 'Preciso te dar minha senha do Instagram, Threads ou TikTok?',
    a: 'Nunca. Você baixa seus próprios dados do Instagram, Threads ou TikTok e envia o arquivo aqui. Não temos nenhuma conexão com esses apps.',
  },
  {
    q: 'Meus dados do Instagram, Threads ou TikTok estão seguros?',
    a: 'Sim. O arquivo é processado inteiro no seu navegador, então suas listas nunca chegam até nós. Os snapshots sincronizados são criptografados no seu navegador antes de sair do aparelho. Com o Pro AI, só os números de uma exportação (sem nomes de usuário) chegam ao nosso servidor.',
  },
];

export function getPricingFaq(locale: AppLocale): PricingFaqItem[] {
  if (locale === 'es') return PRICING_FAQ_ES;
  if (locale === 'pt') return PRICING_FAQ_PT;
  return PRICING_FAQ_EN;
}
