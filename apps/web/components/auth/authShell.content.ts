import type { AppLocale } from '@/i18n/routing';

// Copy for the side panel and controls shared by every account page
// (login, signup, password reset, verify email, welcome, unsubscribe).
export interface AuthShellContent {
  home: string;
  eyebrow: string;
  headline: string;
  points: string[];
  teaserBadge: string;
  teaserText: string;
  teaserCta: string;
  showPassword: string;
  hidePassword: string;
}

const EN: AuthShellContent = {
  home: 'WhoUnfollowed home',
  eyebrow: 'Private by design',
  headline: 'Your follower data stays in your browser.',
  points: ['No Instagram password, ever', 'Open source, so anyone can check', 'Free account, no card'],
  teaserBadge: 'Coming soon',
  teaserText: 'Something big is coming: tools that help you grow, not just track.',
  teaserCta: 'Join the waitlist',
  showPassword: 'Show password',
  hidePassword: 'Hide password',
};

const ES: AuthShellContent = {
  home: 'Inicio de WhoUnfollowed',
  eyebrow: 'Privado por diseño',
  headline: 'Tus datos de seguidores se quedan en tu navegador.',
  points: ['Nunca tu contraseña de Instagram', 'Código abierto, cualquiera puede revisarlo', 'Cuenta gratis, sin tarjeta'],
  teaserBadge: 'Muy pronto',
  teaserText: 'Algo grande se acerca: herramientas para crecer, no solo medir.',
  teaserCta: 'Únete a la lista',
  showPassword: 'Mostrar contraseña',
  hidePassword: 'Ocultar contraseña',
};

const PT: AuthShellContent = {
  home: 'Início do WhoUnfollowed',
  eyebrow: 'Privado por padrão',
  headline: 'Seus dados de seguidores ficam no seu navegador.',
  points: ['Nunca sua senha do Instagram', 'Código aberto, qualquer pessoa pode conferir', 'Conta grátis, sem cartão'],
  teaserBadge: 'Em breve',
  teaserText: 'Algo grande está chegando: ferramentas para crescer, não só acompanhar.',
  teaserCta: 'Entrar na lista',
  showPassword: 'Mostrar senha',
  hidePassword: 'Ocultar senha',
};

export function getAuthShellContent(locale: AppLocale): AuthShellContent {
  if (locale === 'es') return ES;
  if (locale === 'pt') return PT;
  return EN;
}
