import type { AppLocale } from '@/i18n/routing';

export interface RefundContent {
  eyebrow: string;
  headline: string;
  lastUpdated: string;
  s1Title: string; s1Body: string;
  s2Title: string; s2Body: string;
  s3Title: string; s3Pre: string; s3Post: string;
  backToHome: string;
}

const EN: RefundContent = {
  eyebrow: 'LEGAL',
  headline: 'Refund Policy',
  lastUpdated: 'Last updated: August 31, 2026',
  s1Title: 'No Refund Policy',
  s1Body: 'WhoUnfollowed provides a substantial free tier that allows you to fully test the application\'s core functionality before ever considering an upgrade. Pro is a one-time payment that unlocks access for a fixed period (30 or 365 days), not a recurring subscription. Because the service is intangible and the free tier is always available to ensure the tool meets your needs, we do not offer refunds once a Pro unlock has been purchased.',
  s2Title: 'Try Before You Buy',
  s2Body: 'We encourage all users to use the free version of WhoUnfollowed to its fullest extent. There are no time limits on the free tier, and it includes the primary parsing engine. Pro features are supplementary (such as cloud snapshots and history tracking) and do not change the core "WhoUnfollowed" experience.',
  s3Title: 'Exceptions',
  s3Pre: 'In exceptional circumstances (such as accidental duplicate billing due to a technical error on our part), we may issue a refund at our sole discretion. If you believe such an error has occurred, please contact us at',
  s3Post: 'within 14 days of the transaction.',
  backToHome: 'Back to WhoUnfollowed',
};

const ES: RefundContent = {
  eyebrow: 'LEGAL',
  headline: 'Política de Reembolsos',
  lastUpdated: 'Última actualización: 31 de agosto de 2026',
  s1Title: 'Política de no reembolso',
  s1Body: 'WhoUnfollowed ofrece un nivel gratuito sustancial que te permite probar por completo la funcionalidad principal de la aplicación antes de considerar una mejora. Pro es un pago único que desbloquea el acceso durante un período fijo (30 o 365 días), no una suscripción recurrente. Dado que el servicio es intangible y el nivel gratuito siempre está disponible para asegurar que la herramienta cumpla tus necesidades, no ofrecemos reembolsos una vez que se ha comprado un desbloqueo Pro.',
  s2Title: 'Pruébalo antes de comprar',
  s2Body: 'Animamos a todos los usuarios a usar la versión gratuita de WhoUnfollowed al máximo. No hay límites de tiempo en el nivel gratuito, e incluye el motor principal de análisis. Las funciones Pro son complementarias (como los snapshots en la nube y el seguimiento del historial) y no cambian la experiencia principal de "WhoUnfollowed".',
  s3Title: 'Excepciones',
  s3Pre: 'En circunstancias excepcionales (como una facturación duplicada accidental debido a un error técnico de nuestra parte), podemos emitir un reembolso a nuestra entera discreción. Si crees que ha ocurrido tal error, contáctanos en',
  s3Post: 'dentro de los 14 días posteriores a la transacción.',
  backToHome: 'Volver a WhoUnfollowed',
};

const PT: RefundContent = {
  eyebrow: 'LEGAL',
  headline: 'Política de Reembolso',
  lastUpdated: 'Última atualização: 31 de agosto de 2026',
  s1Title: 'Política de não reembolso',
  s1Body: 'O WhoUnfollowed oferece um nível gratuito substancial que permite testar completamente a funcionalidade principal do aplicativo antes mesmo de considerar um upgrade. O Pro é um pagamento único que desbloqueia o acesso por um período fixo (30 ou 365 dias), não uma assinatura recorrente. Como o serviço é intangível e o nível gratuito está sempre disponível para garantir que a ferramenta atenda às suas necessidades, não oferecemos reembolsos após a compra de um desbloqueio Pro.',
  s2Title: 'Experimente antes de comprar',
  s2Body: 'Incentivamos todos os usuários a usar a versão gratuita do WhoUnfollowed ao máximo. Não há limites de tempo no nível gratuito, e ele inclui o motor principal de análise. Os recursos Pro são complementares (como snapshots na nuvem e rastreamento de histórico) e não mudam a experiência principal do "WhoUnfollowed".',
  s3Title: 'Exceções',
  s3Pre: 'Em circunstâncias excepcionais (como cobrança duplicada acidental devido a um erro técnico de nossa parte), podemos emitir um reembolso a nosso exclusivo critério. Se você acredita que tal erro ocorreu, entre em contato conosco em',
  s3Post: 'dentro de 14 dias da transação.',
  backToHome: 'Voltar ao WhoUnfollowed',
};

export function getRefundContent(locale: AppLocale): RefundContent {
  if (locale === 'es') return ES;
  if (locale === 'pt') return PT;
  return EN;
}
