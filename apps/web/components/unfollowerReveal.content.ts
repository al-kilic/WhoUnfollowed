import type { AppLocale } from '@/i18n/routing';

// Copy for the unfollower reveal: what a free user sees when a new export is
// compared with their last one. Counts are real; most names are hidden.
export interface UnfollowerRevealContent {
  eyebrow: string;
  // {n} {date}
  titleMany: string;
  titleOne: string;
  titleNone: string;
  // {n}
  newFollowers: string;
  // {n}
  moreHidden: string;
  body: string;
  // {price}
  cta: string;
  // {price}
  monthly: string;
  // {std}
  launch: string;
  continueFree: string;
  continueFreeNote: string;
  close: string;
  redirecting: string;
  error: string;
  noneBody: string;
  noneCta: string;
}

const EN: UnfollowerRevealContent = {
  eyebrow: 'Since your last export',
  titleMany: '{n} people unfollowed you since {date}.',
  titleOne: '1 person unfollowed you since {date}.',
  titleNone: 'Nobody unfollowed you since {date}.',
  newFollowers: '+{n} new followers',
  moreHidden: '+{n} more',
  body: 'Pro shows every name, with dates, and keeps every export so each check builds on the last.',
  cta: 'See all of them · {price} for a year',
  monthly: 'or {price} for this one check',
  launch: 'Launch price. {std} from January 1.',
  continueFree: 'Continue free',
  continueFreeNote: 'Replaces your old export with this one. The comparison is lost.',
  close: 'Close',
  redirecting: 'Redirecting...',
  error: 'Checkout didn\'t start. Please try again.',
  noneBody: 'Good news. Pro keeps every export, so you\'ll see the moment that changes.',
  noneCta: 'See today\'s results',
};

const ES: UnfollowerRevealContent = {
  eyebrow: 'Desde tu última exportación',
  titleMany: '{n} personas te dejaron de seguir desde el {date}.',
  titleOne: '1 persona te dejó de seguir desde el {date}.',
  titleNone: 'Nadie te dejó de seguir desde el {date}.',
  newFollowers: '+{n} seguidores nuevos',
  moreHidden: '+{n} más',
  body: 'Pro muestra cada nombre, con fechas, y guarda cada exportación para que cada revisión sume a la anterior.',
  cta: 'Verlos a todos · {price} por un año',
  monthly: 'o {price} solo por esta revisión',
  launch: 'Precio de lanzamiento. {std} desde el 1 de enero.',
  continueFree: 'Seguir gratis',
  continueFreeNote: 'Reemplaza tu exportación anterior por esta. La comparación se pierde.',
  close: 'Cerrar',
  redirecting: 'Redirigiendo...',
  error: 'No se pudo abrir el pago. Inténtalo de nuevo.',
  noneBody: 'Buenas noticias. Pro guarda cada exportación, así verás el momento en que eso cambie.',
  noneCta: 'Ver los resultados de hoy',
};

const PT: UnfollowerRevealContent = {
  eyebrow: 'Desde a sua última exportação',
  titleMany: '{n} pessoas deixaram de te seguir desde {date}.',
  titleOne: '1 pessoa deixou de te seguir desde {date}.',
  titleNone: 'Ninguém deixou de te seguir desde {date}.',
  newFollowers: '+{n} novos seguidores',
  moreHidden: '+{n} a mais',
  body: 'O Pro mostra cada nome, com datas, e guarda cada exportação para que cada conferida some à anterior.',
  cta: 'Ver todos · {price} por um ano',
  monthly: 'ou {price} só por esta conferida',
  launch: 'Preço de lançamento. {std} a partir de 1º de janeiro.',
  continueFree: 'Continuar grátis',
  continueFreeNote: 'Substitui a exportação antiga por esta. A comparação se perde.',
  close: 'Fechar',
  redirecting: 'Redirecionando...',
  error: 'O pagamento não abriu. Tente de novo.',
  noneBody: 'Boa notícia. O Pro guarda cada exportação, então você verá quando isso mudar.',
  noneCta: 'Ver os resultados de hoje',
};

export function getUnfollowerRevealContent(locale: AppLocale): UnfollowerRevealContent {
  if (locale === 'es') return ES;
  if (locale === 'pt') return PT;
  return EN;
}
