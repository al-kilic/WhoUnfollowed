import type { AppLocale } from '@/i18n/routing';

// verifyEmailAction / resendVerificationAction (actions.ts) return one of
// these codes instead of English text, so the client component can
// translate via this file.
export type VerifyEmailErrorCode =
  | 'session_expired'
  | 'invalid_code_format'
  | 'rate_limited'
  | 'invalid_or_expired_code'
  | 'send_failed';

export interface VerifyEmailContent {
  title: string;
  subtitleTemplate: (email: string) => string;
  codeLabel: string;
  codeHint: string;
  verifying: string;
  verifyEmail: string;
  didntGetIt: string;
  resendCode: string;
  resending: string;
  resendSuccess: string;
  errors: Record<VerifyEmailErrorCode, string>;
}

const EN: VerifyEmailContent = {
  title: 'Confirm your email',
  subtitleTemplate: (email) => `We sent a 6-digit code to ${email}. Enter it below to finish setting up your account.`,
  codeLabel: 'Verification code',
  codeHint: 'The code expires in 15 minutes.',
  verifying: 'Verifying...',
  verifyEmail: 'Verify email',
  didntGetIt: "Didn't get it?",
  resendCode: 'Resend code',
  resending: 'Sending...',
  resendSuccess: 'A new code is on its way.',
  errors: {
    session_expired: 'Your session expired. Please log in again.',
    invalid_code_format: 'Enter the 6-digit code from your email.',
    rate_limited: 'Too many attempts. Try again in 15 minutes.',
    invalid_or_expired_code: 'That code is invalid or has expired.',
    send_failed: 'Could not resend. Try again shortly.',
  },
};

const ES: VerifyEmailContent = {
  title: 'Confirma tu correo',
  subtitleTemplate: (email) => `Enviamos un código de 6 dígitos a ${email}. Ingrésalo abajo para terminar de configurar tu cuenta.`,
  codeLabel: 'Código de verificación',
  codeHint: 'El código caduca en 15 minutos.',
  verifying: 'Verificando...',
  verifyEmail: 'Verificar correo',
  didntGetIt: '¿No lo recibiste?',
  resendCode: 'Reenviar código',
  resending: 'Enviando...',
  resendSuccess: 'Un nuevo código está en camino.',
  errors: {
    session_expired: 'Tu sesión caducó. Inicia sesión de nuevo.',
    invalid_code_format: 'Ingresa el código de 6 dígitos de tu correo.',
    rate_limited: 'Demasiados intentos. Vuelve a intentarlo en 15 minutos.',
    invalid_or_expired_code: 'Ese código es inválido o ha caducado.',
    send_failed: 'No se pudo reenviar. Inténtalo de nuevo en breve.',
  },
};

const PT: VerifyEmailContent = {
  title: 'Confirme seu email',
  subtitleTemplate: (email) => `Enviamos um código de 6 dígitos para ${email}. Digite-o abaixo para terminar de configurar sua conta.`,
  codeLabel: 'Código de verificação',
  codeHint: 'O código expira em 15 minutos.',
  verifying: 'Verificando...',
  verifyEmail: 'Verificar email',
  didntGetIt: 'Não recebeu?',
  resendCode: 'Reenviar código',
  resending: 'Enviando...',
  resendSuccess: 'Um novo código está a caminho.',
  errors: {
    session_expired: 'Sua sessão expirou. Faça login novamente.',
    invalid_code_format: 'Digite o código de 6 dígitos do seu email.',
    rate_limited: 'Muitas tentativas. Tente novamente em 15 minutos.',
    invalid_or_expired_code: 'Esse código é inválido ou expirou.',
    send_failed: 'Não foi possível reenviar. Tente novamente em breve.',
  },
};

export function getVerifyEmailContent(locale: AppLocale): VerifyEmailContent {
  if (locale === 'es') return ES;
  if (locale === 'pt') return PT;
  return EN;
}
