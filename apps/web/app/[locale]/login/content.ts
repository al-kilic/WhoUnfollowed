import type { AppLocale } from '@/i18n/routing';

// loginAction (actions.ts) returns one of these codes instead of English
// text, so the client component can translate it via this content file.
export type LoginErrorCode = 'missing_fields' | 'rate_limited' | 'invalid_credentials';

export interface LoginContent {
  title: string;
  subtitle: string;
  noAccountPre: string;
  signUpFree: string;
  emailLabel: string;
  passwordLabel: string;
  forgotPassword: string;
  loggingIn: string;
  logIn: string;
  errors: Record<LoginErrorCode, string>;
}

const EN: LoginContent = {
  title: 'Welcome back',
  subtitle: 'Log in to your WhoUnfollowed account.',
  noAccountPre: 'No account?',
  signUpFree: 'Sign up free',
  emailLabel: 'Email',
  passwordLabel: 'Password',
  forgotPassword: 'Forgot password?',
  loggingIn: 'Logging in...',
  logIn: 'Log in',
  errors: {
    missing_fields: 'Email and password are required.',
    rate_limited: 'Too many attempts. Try again in 15 minutes.',
    invalid_credentials: 'Invalid email or password.',
  },
};

const ES: LoginContent = {
  title: 'Bienvenido de nuevo',
  subtitle: 'Inicia sesión en tu cuenta de WhoUnfollowed.',
  noAccountPre: '¿No tienes cuenta?',
  signUpFree: 'Regístrate gratis',
  emailLabel: 'Correo electrónico',
  passwordLabel: 'Contraseña',
  forgotPassword: '¿Olvidaste tu contraseña?',
  loggingIn: 'Iniciando sesión...',
  logIn: 'Iniciar sesión',
  errors: {
    missing_fields: 'El correo electrónico y la contraseña son obligatorios.',
    rate_limited: 'Demasiados intentos. Vuelve a intentarlo en 15 minutos.',
    invalid_credentials: 'Correo electrónico o contraseña incorrectos.',
  },
};

const PT: LoginContent = {
  title: 'Bem-vindo de volta',
  subtitle: 'Faça login na sua conta do WhoUnfollowed.',
  noAccountPre: 'Não tem uma conta?',
  signUpFree: 'Cadastre-se grátis',
  emailLabel: 'E-mail',
  passwordLabel: 'Senha',
  forgotPassword: 'Esqueceu sua senha?',
  loggingIn: 'Entrando...',
  logIn: 'Entrar',
  errors: {
    missing_fields: 'E-mail e senha são obrigatórios.',
    rate_limited: 'Muitas tentativas. Tente novamente em 15 minutos.',
    invalid_credentials: 'E-mail ou senha inválidos.',
  },
};

export function getLoginContent(locale: AppLocale): LoginContent {
  if (locale === 'es') return ES;
  if (locale === 'pt') return PT;
  return EN;
}
