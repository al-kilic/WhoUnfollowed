import type { AppLocale } from '@/i18n/routing';

// forgotPasswordAction (actions.ts) returns one of these codes instead of
// English text, so the client component can translate it via this file.
export type ForgotPasswordErrorCode = 'missing_email' | 'rate_limited';

export interface ForgotPasswordContent {
  title: string;
  subtitle: string;
  rememberedPre: string;
  logIn: string;
  emailLabel: string;
  sending: string;
  sendResetLink: string;
  sentTitle: string;
  sentSubtitle: string;
  didntGetIt: string;
  backToLogIn: string;
  errors: Record<ForgotPasswordErrorCode, string>;
}

const EN: ForgotPasswordContent = {
  title: 'Reset your password',
  subtitle: "Enter your account email and we'll send you a reset link.",
  rememberedPre: 'Remembered it?',
  logIn: 'Log in',
  emailLabel: 'Email',
  sending: 'Sending...',
  sendResetLink: 'Send reset link',
  sentTitle: 'Check your email',
  sentSubtitle: 'If an account exists for that address, we sent a link to reset your password. The link is valid for 1 hour.',
  didntGetIt: 'Did not get it? Check your spam folder, or try again in a few minutes.',
  backToLogIn: 'Back to log in',
  errors: {
    missing_email: 'Enter your email address.',
    rate_limited: 'Too many requests. Try again in 15 minutes.',
  },
};

const ES: ForgotPasswordContent = {
  title: 'Restablece tu contraseña',
  subtitle: 'Ingresa el correo de tu cuenta y te enviaremos un enlace para restablecerla.',
  rememberedPre: '¿La recordaste?',
  logIn: 'Iniciar sesión',
  emailLabel: 'Correo electrónico',
  sending: 'Enviando...',
  sendResetLink: 'Enviar enlace',
  sentTitle: 'Revisa tu correo',
  sentSubtitle: 'Si existe una cuenta con esa dirección, te enviamos un enlace para restablecer tu contraseña. El enlace es válido por 1 hora.',
  didntGetIt: '¿No lo recibiste? Revisa tu carpeta de spam, o inténtalo de nuevo en unos minutos.',
  backToLogIn: 'Volver a iniciar sesión',
  errors: {
    missing_email: 'Ingresa tu dirección de correo electrónico.',
    rate_limited: 'Demasiadas solicitudes. Vuelve a intentarlo en 15 minutos.',
  },
};

const PT: ForgotPasswordContent = {
  title: 'Redefina sua senha',
  subtitle: 'Digite o email da sua conta e enviaremos um link para redefinir sua senha.',
  rememberedPre: 'Lembrou?',
  logIn: 'Entrar',
  emailLabel: 'E-mail',
  sending: 'Enviando...',
  sendResetLink: 'Enviar link',
  sentTitle: 'Verifique seu email',
  sentSubtitle: 'Se existe uma conta com esse endereço, enviamos um link para redefinir sua senha. O link é válido por 1 hora.',
  didntGetIt: 'Não recebeu? Confira sua pasta de spam ou tente novamente em alguns minutos.',
  backToLogIn: 'Voltar para o login',
  errors: {
    missing_email: 'Digite seu endereço de email.',
    rate_limited: 'Muitas solicitações. Tente novamente em 15 minutos.',
  },
};

export function getForgotPasswordContent(locale: AppLocale): ForgotPasswordContent {
  if (locale === 'es') return ES;
  if (locale === 'pt') return PT;
  return EN;
}
