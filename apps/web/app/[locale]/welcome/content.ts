import type { AppLocale } from '@/i18n/routing';

// setPasswordAction (actions.ts) returns one of these codes instead of
// English text, so the client component can translate it via this file.
export type WelcomeErrorCode =
  | 'invalid_link'
  | 'weak_password'
  | 'password_mismatch'
  | 'payments_not_configured'
  | 'account_not_found_stripe'
  | 'invalid_or_expired_session'
  | 'account_not_found_webhook_pending';

export interface WelcomeContent {
  title: string;
  subtitle: string;
  alreadySetPre: string;
  logIn: string;
  invalidLink: string;
  backToPricing: string;
  newPasswordLabel: string;
  confirmPasswordLabel: string;
  settingUp: string;
  setPasswordAndStart: string;
  loading: string;
  errors: Record<WelcomeErrorCode, string>;
}

const EN: WelcomeContent = {
  title: 'Welcome to WhoUnfollowed',
  subtitle: 'Your payment is confirmed. Set a password to access your account.',
  alreadySetPre: 'Already set your password?',
  logIn: 'Log in',
  invalidLink: 'Invalid link. Please check your email or contact support.',
  backToPricing: 'Back to pricing',
  newPasswordLabel: 'Choose a password',
  confirmPasswordLabel: 'Confirm password',
  settingUp: 'Setting up your account...',
  setPasswordAndStart: 'Set password and get started',
  loading: 'Loading...',
  errors: {
    invalid_link: 'Invalid link.',
    weak_password: 'Password must be at least 8 characters.',
    password_mismatch: 'Passwords do not match.',
    payments_not_configured: 'Payments not configured.',
    account_not_found_stripe: 'Could not find your account. Please contact support.',
    invalid_or_expired_session: 'Invalid or expired session. Please contact support.',
    account_not_found_webhook_pending: 'Account not found. The webhook may still be processing — wait a moment and try again.',
  },
};

const ES: WelcomeContent = {
  title: 'Bienvenido a WhoUnfollowed',
  subtitle: 'Tu pago está confirmado. Elige una contraseña para acceder a tu cuenta.',
  alreadySetPre: '¿Ya elegiste tu contraseña?',
  logIn: 'Iniciar sesión',
  invalidLink: 'Enlace inválido. Revisa tu correo o contacta con soporte.',
  backToPricing: 'Volver a precios',
  newPasswordLabel: 'Elige una contraseña',
  confirmPasswordLabel: 'Confirmar contraseña',
  settingUp: 'Configurando tu cuenta...',
  setPasswordAndStart: 'Elegir contraseña y empezar',
  loading: 'Cargando...',
  errors: {
    invalid_link: 'Enlace inválido.',
    weak_password: 'La contraseña debe tener al menos 8 caracteres.',
    password_mismatch: 'Las contraseñas no coinciden.',
    payments_not_configured: 'Los pagos no están configurados.',
    account_not_found_stripe: 'No pudimos encontrar tu cuenta. Contacta con soporte.',
    invalid_or_expired_session: 'Sesión inválida o caducada. Contacta con soporte.',
    account_not_found_webhook_pending: 'Cuenta no encontrada. El webhook puede seguir procesándose, espera un momento e inténtalo de nuevo.',
  },
};

const PT: WelcomeContent = {
  title: 'Bem-vindo ao WhoUnfollowed',
  subtitle: 'Seu pagamento foi confirmado. Defina uma senha para acessar sua conta.',
  alreadySetPre: 'Já definiu sua senha?',
  logIn: 'Entrar',
  invalidLink: 'Link inválido. Confira seu email ou entre em contato com o suporte.',
  backToPricing: 'Voltar aos preços',
  newPasswordLabel: 'Escolha uma senha',
  confirmPasswordLabel: 'Confirmar senha',
  settingUp: 'Configurando sua conta...',
  setPasswordAndStart: 'Definir senha e começar',
  loading: 'Carregando...',
  errors: {
    invalid_link: 'Link inválido.',
    weak_password: 'A senha deve ter pelo menos 8 caracteres.',
    password_mismatch: 'As senhas não coincidem.',
    payments_not_configured: 'Pagamentos não configurados.',
    account_not_found_stripe: 'Não conseguimos encontrar sua conta. Entre em contato com o suporte.',
    invalid_or_expired_session: 'Sessão inválida ou expirada. Entre em contato com o suporte.',
    account_not_found_webhook_pending: 'Conta não encontrada. O webhook ainda pode estar processando — aguarde um momento e tente novamente.',
  },
};

export function getWelcomeContent(locale: AppLocale): WelcomeContent {
  if (locale === 'es') return ES;
  if (locale === 'pt') return PT;
  return EN;
}
