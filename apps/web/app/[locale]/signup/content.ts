import type { AppLocale } from '@/i18n/routing';

// signupAction (actions.ts) returns one of these codes instead of English
// text, so the client component can translate it via this content file.
export type SignupErrorCode = 'missing_fields' | 'password_too_short' | 'rate_limited' | 'email_taken' | 'create_failed';

export interface SignupContent {
  title: string;
  subtitle: string;
  alreadyHavePre: string;
  logIn: string;
  csvBullet: string;
  emailLabel: string;
  passwordLabel: string;
  passwordHint: string;
  creatingAccount: string;
  createAccount: string;
  errors: Record<SignupErrorCode, string>;
}

const EN: SignupContent = {
  title: 'Create your account',
  subtitle: 'Takes 10 seconds. No credit card, ever, unless you choose Pro.',
  alreadyHavePre: 'Already have an account?',
  logIn: 'Log in',
  csvBullet: 'Unlimited CSV exports of every list, non-followers, fans, and mutuals',
  emailLabel: 'Email',
  passwordLabel: 'Password',
  passwordHint: 'Minimum 8 characters.',
  creatingAccount: 'Creating account...',
  createAccount: 'Create account',
  errors: {
    missing_fields: 'Email and password are required.',
    password_too_short: 'Password must be at least 8 characters.',
    rate_limited: 'Too many attempts. Try again in 15 minutes.',
    email_taken: 'An account with this email already exists.',
    create_failed: 'Failed to create account. Please try again.',
  },
};

const ES: SignupContent = {
  title: 'Crea tu cuenta',
  subtitle: 'Toma 10 segundos. Sin tarjeta de crédito, nunca, a menos que elijas Pro.',
  alreadyHavePre: '¿Ya tienes una cuenta?',
  logIn: 'Iniciar sesión',
  csvBullet: 'Exportaciones CSV ilimitadas de cada lista: quienes no te siguen, fans y amigos mutuos',
  emailLabel: 'Correo electrónico',
  passwordLabel: 'Contraseña',
  passwordHint: 'Mínimo 8 caracteres.',
  creatingAccount: 'Creando cuenta...',
  createAccount: 'Crear cuenta',
  errors: {
    missing_fields: 'El correo electrónico y la contraseña son obligatorios.',
    password_too_short: 'La contraseña debe tener al menos 8 caracteres.',
    rate_limited: 'Demasiados intentos. Vuelve a intentarlo en 15 minutos.',
    email_taken: 'Ya existe una cuenta con este correo electrónico.',
    create_failed: 'No se pudo crear la cuenta. Inténtalo de nuevo.',
  },
};

const PT: SignupContent = {
  title: 'Crie sua conta',
  subtitle: 'Leva 10 segundos. Sem cartão de crédito, nunca, a menos que escolha o Pro.',
  alreadyHavePre: 'Já tem uma conta?',
  logIn: 'Entrar',
  csvBullet: 'Exportações CSV ilimitadas de cada lista: quem não te segue de volta, fãs e seguidos mútuos',
  emailLabel: 'E-mail',
  passwordLabel: 'Senha',
  passwordHint: 'Mínimo de 8 caracteres.',
  creatingAccount: 'Criando conta...',
  createAccount: 'Criar conta',
  errors: {
    missing_fields: 'E-mail e senha são obrigatórios.',
    password_too_short: 'A senha deve ter pelo menos 8 caracteres.',
    rate_limited: 'Muitas tentativas. Tente novamente em 15 minutos.',
    email_taken: 'Já existe uma conta com este e-mail.',
    create_failed: 'Falha ao criar a conta. Tente novamente.',
  },
};

export function getSignupContent(locale: AppLocale): SignupContent {
  if (locale === 'es') return ES;
  if (locale === 'pt') return PT;
  return EN;
}
