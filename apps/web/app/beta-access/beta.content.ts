// Copy for the staging gate page (/beta-access). en / es / pt.
export type BetaLocale = 'en' | 'es' | 'pt';

export interface BetaCopy {
  title: string;
  sub: string;
  label: string;
  button: string;
  checking: string;
  wrong: string;
  tooMany: string;
  failed: string;
  note: string;
}

export const BETA_COPY: Record<BetaLocale, BetaCopy> = {
  en: {
    title: 'WhoUnfollowed Beta',
    sub: 'Enter the access code you were given to try the test version.',
    label: 'Access code',
    button: 'Continue',
    checking: 'Checking...',
    wrong: 'That code is not right. Check it and try again.',
    tooMany: 'Too many tries. Wait a few minutes and try again.',
    failed: 'Something went wrong. Try again in a moment.',
    note: 'This is a private test version. Accounts you create here are for testing; we will ask before moving anything to the real site.',
  },
  es: {
    title: 'WhoUnfollowed Beta',
    sub: 'Escribe el código de acceso que te dimos para probar la versión de prueba.',
    label: 'Código de acceso',
    button: 'Continuar',
    checking: 'Comprobando...',
    wrong: 'Ese código no es correcto. Revísalo e inténtalo de nuevo.',
    tooMany: 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.',
    failed: 'Algo salió mal. Inténtalo de nuevo en un momento.',
    note: 'Esta es una versión de prueba privada. Las cuentas que crees aquí son para pruebas; te preguntaremos antes de pasar algo al sitio real.',
  },
  pt: {
    title: 'WhoUnfollowed Beta',
    sub: 'Digite o código de acesso que você recebeu para testar a versão de teste.',
    label: 'Código de acesso',
    button: 'Continuar',
    checking: 'Verificando...',
    wrong: 'Esse código não está certo. Confira e tente de novo.',
    tooMany: 'Tentativas demais. Espere alguns minutos e tente de novo.',
    failed: 'Algo deu errado. Tente de novo em um instante.',
    note: 'Esta é uma versão de teste privada. As contas que você criar aqui são para testes; vamos perguntar antes de levar algo para o site real.',
  },
};

// ?lang= wins, then the first supported language in Accept-Language.
export function betaLocale(lang: string | null | undefined, acceptLanguage: string | null | undefined): BetaLocale {
  const pick = (v: string) => v.toLowerCase().slice(0, 2);
  if (lang && (['en', 'es', 'pt'] as const).includes(pick(lang) as BetaLocale)) return pick(lang) as BetaLocale;
  for (const part of (acceptLanguage ?? '').split(',')) {
    const l = pick(part.trim());
    if (l === 'en' || l === 'es' || l === 'pt') return l;
  }
  return 'en';
}
