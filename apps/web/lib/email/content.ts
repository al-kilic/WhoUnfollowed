import 'server-only';
import type { AppLocale } from '@/i18n/routing';

// Locale content for every transactional email. Mirrors the content.ts
// pattern used across app/[locale]/*/content.ts, kept in one file here since
// the email templates are short and tightly coupled to their markup.

export interface VerificationEmailContent {
  subject: (code: string) => string;
  preview: (code: string) => string;
  title: string;
  body: string;
  note: string;
}

export interface PasswordResetEmailContent {
  subject: string;
  preview: string;
  title: string;
  body: string;
  button: string;
  note1: string;
  note2Strong: string;
  note2Rest: string;
}

export interface PurchaseEmailContent {
  subjectNew: string;
  subjectRenewal: string;
  previewNew: string;
  previewRenewal: string;
  titleNew: string;
  titleRenewal: string;
  bodyNew: (planLabel: string, expiresOn: string) => string;
  bodyRenewal: (planLabel: string, expiresOn: string) => string;
  button: string;
  planMonthly: string;
  planYearly: string;
  footerNote: string;
}

export interface ExpiringSoonEmailContent {
  subject: string;
  preview: (daysLeft: number) => string;
  title: string;
  body: (daysLeft: number, expiresOn: string) => string;
  button: string;
}

export interface ExpiredEmailContent {
  subject: string;
  preview: string;
  title: string;
  body: string;
  button: string;
}

const verification: Record<AppLocale, VerificationEmailContent> = {
  en: {
    subject: (code) => `${code} is your WhoUnfollowed verification code`,
    preview: (code) => `Your verification code is ${code}`,
    title: 'Confirm your email',
    body: 'Enter this code to finish creating your account. It expires in 15 minutes.',
    note: 'If you did not create a WhoUnfollowed account, you can safely ignore this email. Nothing happens until the code is used.',
  },
  es: {
    subject: (code) => `${code} es tu código de verificación de WhoUnfollowed`,
    preview: (code) => `Tu código de verificación es ${code}`,
    title: 'Confirma tu correo',
    body: 'Ingresa este código para terminar de crear tu cuenta. Caduca en 15 minutos.',
    note: 'Si no creaste una cuenta en WhoUnfollowed, puedes ignorar este correo. No pasa nada hasta que se use el código.',
  },
  pt: {
    subject: (code) => `${code} é o seu código de verificação do WhoUnfollowed`,
    preview: (code) => `Seu código de verificação é ${code}`,
    title: 'Confirme seu email',
    body: 'Digite este código para concluir a criação da sua conta. Ele expira em 15 minutos.',
    note: 'Se você não criou uma conta no WhoUnfollowed, pode ignorar este email com segurança. Nada acontece até o código ser usado.',
  },
};

const passwordReset: Record<AppLocale, PasswordResetEmailContent> = {
  en: {
    subject: 'Reset your WhoUnfollowed password',
    preview: 'Reset your WhoUnfollowed password (link valid 1 hour).',
    title: 'Reset your password',
    body: 'Click the button below to set a new password. This link is valid for 1 hour.',
    button: 'Reset password',
    note1: 'If you did not request a password reset, you can safely ignore this email. Your password stays the same.',
    note2Strong: 'Heads up:',
    note2Rest: 'for your privacy, cloud snapshots are encrypted with a key derived from your password. Resetting it means any existing cloud snapshots can no longer be decrypted and will be removed.',
  },
  es: {
    subject: 'Restablece tu contraseña de WhoUnfollowed',
    preview: 'Restablece tu contraseña de WhoUnfollowed (enlace válido por 1 hora).',
    title: 'Restablece tu contraseña',
    body: 'Haz clic en el botón para definir una nueva contraseña. Este enlace es válido por 1 hora.',
    button: 'Restablecer contraseña',
    note1: 'Si no solicitaste un cambio de contraseña, puedes ignorar este correo. Tu contraseña no cambia.',
    note2Strong: 'Importante:',
    note2Rest: 'por tu privacidad, las copias en la nube se cifran con una clave derivada de tu contraseña. Al restablecerla, esas copias ya no se pueden descifrar y se eliminarán.',
  },
  pt: {
    subject: 'Redefina sua senha do WhoUnfollowed',
    preview: 'Redefina sua senha do WhoUnfollowed (link válido por 1 hora).',
    title: 'Redefina sua senha',
    body: 'Clique no botão abaixo para definir uma nova senha. Este link é válido por 1 hora.',
    button: 'Redefinir senha',
    note1: 'Se você não solicitou uma redefinição de senha, pode ignorar este email. Sua senha continua a mesma.',
    note2Strong: 'Atenção:',
    note2Rest: 'para sua privacidade, os snapshots na nuvem são criptografados com uma chave derivada da sua senha. Ao redefini-la, esses snapshots não podem mais ser descriptografados e serão removidos.',
  },
};

const purchase: Record<AppLocale, PurchaseEmailContent> = {
  en: {
    subjectNew: 'Welcome to WhoUnfollowed Pro',
    subjectRenewal: 'Your WhoUnfollowed Pro access was renewed',
    previewNew: 'Your Pro access is active.',
    previewRenewal: 'Your Pro access was extended.',
    titleNew: 'Welcome to Pro',
    titleRenewal: 'Pro access renewed',
    bodyNew: (planLabel, expiresOn) =>
      `Thanks for upgrading. Your ${planLabel} Pro access is active now and runs through ${expiresOn}.`,
    bodyRenewal: (planLabel, expiresOn) =>
      `Your ${planLabel} unlock went through. Pro access now runs through ${expiresOn}.`,
    button: 'Open WhoUnfollowed',
    planMonthly: 'monthly',
    planYearly: 'yearly',
    footerNote: 'This is a receipt, not a subscription. Buying again before it runs out just adds time on top.',
  },
  es: {
    subjectNew: 'Bienvenido a WhoUnfollowed Pro',
    subjectRenewal: 'Tu acceso Pro de WhoUnfollowed se renovó',
    previewNew: 'Tu acceso Pro está activo.',
    previewRenewal: 'Tu acceso Pro se extendió.',
    titleNew: 'Bienvenido a Pro',
    titleRenewal: 'Acceso Pro renovado',
    bodyNew: (planLabel, expiresOn) =>
      `Gracias por mejorar tu cuenta. Tu acceso Pro ${planLabel} ya está activo y dura hasta el ${expiresOn}.`,
    bodyRenewal: (planLabel, expiresOn) =>
      `Tu compra ${planLabel} se procesó correctamente. Tu acceso Pro ahora dura hasta el ${expiresOn}.`,
    button: 'Abrir WhoUnfollowed',
    planMonthly: 'mensual',
    planYearly: 'anual',
    footerNote: 'Esto es un recibo, no una suscripción. Comprar de nuevo antes de que termine solo suma tiempo extra.',
  },
  pt: {
    subjectNew: 'Bem-vindo ao WhoUnfollowed Pro',
    subjectRenewal: 'Seu acesso Pro do WhoUnfollowed foi renovado',
    previewNew: 'Seu acesso Pro está ativo.',
    previewRenewal: 'Seu acesso Pro foi estendido.',
    titleNew: 'Bem-vindo ao Pro',
    titleRenewal: 'Acesso Pro renovado',
    bodyNew: (planLabel, expiresOn) =>
      `Obrigado por assinar o Pro. Seu acesso ${planLabel} já está ativo e vale até ${expiresOn}.`,
    bodyRenewal: (planLabel, expiresOn) =>
      `Sua compra ${planLabel} foi confirmada. Seu acesso Pro agora vale até ${expiresOn}.`,
    button: 'Abrir WhoUnfollowed',
    planMonthly: 'mensal',
    planYearly: 'anual',
    footerNote: 'Isto é um recibo, não uma assinatura recorrente. Comprar de novo antes de vencer apenas soma tempo.',
  },
};

const expiringSoon: Record<AppLocale, ExpiringSoonEmailContent> = {
  en: {
    subject: 'Your WhoUnfollowed Pro access is ending soon',
    preview: (daysLeft) => `${daysLeft} days left on your Pro access.`,
    title: 'Your Pro access is ending soon',
    body: (daysLeft, expiresOn) =>
      `You have ${daysLeft} day${daysLeft === 1 ? '' : 's'} left on your Pro access, until ${expiresOn}. Renew now to keep cloud snapshots, email alerts, and charts without a gap.`,
    button: 'Renew Pro access',
  },
  es: {
    subject: 'Tu acceso Pro de WhoUnfollowed termina pronto',
    preview: (daysLeft) => `Te quedan ${daysLeft} días de acceso Pro.`,
    title: 'Tu acceso Pro termina pronto',
    body: (daysLeft, expiresOn) =>
      `Te quedan ${daysLeft} día${daysLeft === 1 ? '' : 's'} de acceso Pro, hasta el ${expiresOn}. Renueva ahora para no perder las copias en la nube, las alertas por correo y los gráficos.`,
    button: 'Renovar acceso Pro',
  },
  pt: {
    subject: 'Seu acesso Pro do WhoUnfollowed está acabando',
    preview: (daysLeft) => `Faltam ${daysLeft} dias de acesso Pro.`,
    title: 'Seu acesso Pro está acabando',
    body: (daysLeft, expiresOn) =>
      `Faltam ${daysLeft} dia${daysLeft === 1 ? '' : 's'} de acesso Pro, até ${expiresOn}. Renove agora para não perder os snapshots na nuvem, os alertas por email e os gráficos.`,
    button: 'Renovar acesso Pro',
  },
};

const expired: Record<AppLocale, ExpiredEmailContent> = {
  en: {
    subject: 'Your WhoUnfollowed Pro access has ended',
    preview: 'Your Pro access has ended.',
    title: 'Your Pro access has ended',
    body: 'Your Pro access ran out. You can still use the free tier to check a single snapshot. Renew any time to get cloud snapshot history, email alerts, and charts back.',
    button: 'Renew Pro access',
  },
  es: {
    subject: 'Tu acceso Pro de WhoUnfollowed terminó',
    preview: 'Tu acceso Pro terminó.',
    title: 'Tu acceso Pro terminó',
    body: 'Tu acceso Pro se agotó. Puedes seguir usando el nivel gratuito para revisar una sola captura. Renueva cuando quieras para recuperar el historial en la nube, las alertas por correo y los gráficos.',
    button: 'Renovar acceso Pro',
  },
  pt: {
    subject: 'Seu acesso Pro do WhoUnfollowed terminou',
    preview: 'Seu acesso Pro terminou.',
    title: 'Seu acesso Pro terminou',
    body: 'Seu acesso Pro acabou. Você ainda pode usar o nível gratuito para analisar um único snapshot. Renove quando quiser para recuperar o histórico na nuvem, os alertas por email e os gráficos.',
    button: 'Renovar acesso Pro',
  },
};

export function getVerificationEmailContent(locale: AppLocale): VerificationEmailContent {
  return verification[locale];
}
export function getPasswordResetEmailContent(locale: AppLocale): PasswordResetEmailContent {
  return passwordReset[locale];
}
export function getPurchaseEmailContent(locale: AppLocale): PurchaseEmailContent {
  return purchase[locale];
}
export function getExpiringSoonEmailContent(locale: AppLocale): ExpiringSoonEmailContent {
  return expiringSoon[locale];
}
export function getExpiredEmailContent(locale: AppLocale): ExpiredEmailContent {
  return expired[locale];
}
