import type { AppLocale } from '@/i18n/routing';

// Copy for the 3-month wrap (story before the Radar). Counts only, never
// usernames. {placeholders} are filled by `fill`. No em dashes.
export interface WrapContent {
  aria: string;
  kicker: (app: string) => string;
  range: (from: string, to: string) => string;
  introTitle: string;
  introBody: string;
  start: string;
  skip: string;
  close: string;
  pause: string;
  arrivedLabel: string;
  arrivedLine: string; // {n}
  vsMore: string; // {n}
  vsLess: string; // {n}
  vsSame: string;
  bestWeekLabel: string;
  bestWeekLine: string; // {date} {n}
  mutualLabel: string;
  mutualLine: string; // {n} {total}
  followsLabel: string;
  followsLine: string; // {made} {back} {pct}
  seeWhoNot: string;
  spreeLabel: string;
  spreeLine: string; // {n} {date}
  sinceLabel: string; // {date}
  sinceGained: string;
  sinceLost: string;
  seeWhoLeft: string;
  proHint: string;
  verdictLabel: string;
  youAre: string;
  shareCard: string;
  saveCard: string;
  saved: string;
  outroTitle: string;
  outroBody: string;
  openRadar: string;
  replay: string;
  chip: string;
  image: { title: (app: string) => string; arrived: string; followed: string; back: string; footer: string };
}

const en: WrapContent = {
  aria: 'Your last 3 months',
  kicker: app => `Your last 3 months on ${app}`,
  range: (from, to) => `${from} to ${to}`,
  introTitle: 'Your 3-month wrap',
  introBody: 'What happened since {from}, straight from your export. Made in your browser.',
  start: 'Play my wrap',
  skip: 'Skip to Radar',
  close: 'Close',
  pause: 'Hold to pause',
  arrivedLabel: 'New followers',
  arrivedLine: 'people found you and are still here.',
  vsMore: '{n} more than the 3 months before.',
  vsLess: '{n} fewer than the 3 months before.',
  vsSame: 'Same as the 3 months before.',
  bestWeekLabel: 'Your best week began',
  bestWeekLine: 'That week brought {n} new followers, the most of any week.',
  mutualLabel: 'Became mutuals',
  mutualLine: 'of your {total} new followers are now mutuals.',
  followsLabel: 'You followed',
  followsLine: '{made} accounts. {back} follow you back ({pct}%).',
  seeWhoNot: 'See who didn\'t',
  spreeLabel: 'Busiest follow day',
  spreeLine: 'follows on {date}.',
  sinceLabel: 'Since your export of {date}',
  sinceGained: 'new',
  sinceLost: 'gone',
  seeWhoLeft: 'See who left',
  proHint: 'Names are in Pro',
  verdictLabel: 'Your verdict',
  youAre: 'You are…',
  shareCard: 'Share my wrap',
  saveCard: 'Save image',
  saved: 'Saved',
  outroTitle: 'Now, the full picture.',
  outroBody: 'Your Radar has the curiosities, the fixes and every list behind this wrap.',
  openRadar: 'Open my Radar',
  replay: 'Replay',
  chip: 'Your 3-month wrap',
  image: { title: app => `My last 3 months on ${app}`, arrived: 'new followers', followed: 'followed', back: 'followed back', footer: 'whounfollowed.co · made in my browser, no password' },
};

const es: WrapContent = {
  aria: 'Tus últimos 3 meses',
  kicker: app => `Tus últimos 3 meses en ${app}`,
  range: (from, to) => `Del ${from} al ${to}`,
  introTitle: 'Tu resumen de 3 meses',
  introBody: 'Lo que pasó desde el {from}, sacado de tu exportación. Hecho en tu navegador.',
  start: 'Ver mi resumen',
  skip: 'Ir al Radar',
  close: 'Cerrar',
  pause: 'Mantén para pausar',
  arrivedLabel: 'Nuevos seguidores',
  arrivedLine: 'personas te encontraron y siguen aquí.',
  vsMore: '{n} más que los 3 meses anteriores.',
  vsLess: '{n} menos que los 3 meses anteriores.',
  vsSame: 'Igual que los 3 meses anteriores.',
  bestWeekLabel: 'Tu mejor semana empezó el',
  bestWeekLine: 'Esa semana llegaron {n} nuevos seguidores, la mejor de todas.',
  mutualLabel: 'Se volvieron mutuos',
  mutualLine: 'de tus {total} nuevos seguidores ya son mutuos.',
  followsLabel: 'Seguiste a',
  followsLine: '{made} cuentas. {back} te siguen ({pct}%).',
  seeWhoNot: 'Ver quién no',
  spreeLabel: 'Día con más follows',
  spreeLine: 'follows el {date}.',
  sinceLabel: 'Desde tu exportación del {date}',
  sinceGained: 'nuevos',
  sinceLost: 'se fueron',
  seeWhoLeft: 'Ver quién se fue',
  proHint: 'Los nombres están en Pro',
  verdictLabel: 'Tu veredicto',
  youAre: 'Eres…',
  shareCard: 'Compartir mi resumen',
  saveCard: 'Guardar imagen',
  saved: 'Guardada',
  outroTitle: 'Ahora, el panorama completo.',
  outroBody: 'Tu Radar tiene las curiosidades, lo que arreglar y cada lista detrás de este resumen.',
  openRadar: 'Abrir mi Radar',
  replay: 'Repetir',
  chip: 'Tu resumen de 3 meses',
  image: { title: app => `Mis últimos 3 meses en ${app}`, arrived: 'nuevos seguidores', followed: 'seguidos', back: 'me siguen', footer: 'whounfollowed.co · hecho en mi navegador, sin contraseña' },
};

const pt: WrapContent = {
  aria: 'Seus últimos 3 meses',
  kicker: app => `Seus últimos 3 meses no ${app}`,
  range: (from, to) => `De ${from} a ${to}`,
  introTitle: 'Sua retrospectiva de 3 meses',
  introBody: 'O que aconteceu desde {from}, direto da sua exportação. Feito no seu navegador.',
  start: 'Ver minha retrospectiva',
  skip: 'Ir para o Radar',
  close: 'Fechar',
  pause: 'Segure para pausar',
  arrivedLabel: 'Novos seguidores',
  arrivedLine: 'pessoas te encontraram e continuam aqui.',
  vsMore: '{n} a mais que nos 3 meses anteriores.',
  vsLess: '{n} a menos que nos 3 meses anteriores.',
  vsSame: 'O mesmo que nos 3 meses anteriores.',
  bestWeekLabel: 'Sua melhor semana começou em',
  bestWeekLine: 'Nessa semana chegaram {n} novos seguidores, a melhor de todas.',
  mutualLabel: 'Viraram mútuos',
  mutualLine: 'dos seus {total} novos seguidores já são mútuos.',
  followsLabel: 'Você seguiu',
  followsLine: '{made} contas. {back} te seguem de volta ({pct}%).',
  seeWhoNot: 'Ver quem não',
  spreeLabel: 'Dia com mais follows',
  spreeLine: 'follows em {date}.',
  sinceLabel: 'Desde sua exportação de {date}',
  sinceGained: 'novos',
  sinceLost: 'saíram',
  seeWhoLeft: 'Ver quem saiu',
  proHint: 'Os nomes estão no Pro',
  verdictLabel: 'Seu veredito',
  youAre: 'Você é…',
  shareCard: 'Compartilhar',
  saveCard: 'Salvar imagem',
  saved: 'Salva',
  outroTitle: 'Agora, o quadro completo.',
  outroBody: 'Seu Radar tem as curiosidades, o que arrumar e cada lista por trás desta retrospectiva.',
  openRadar: 'Abrir meu Radar',
  replay: 'Repetir',
  chip: 'Sua retrospectiva de 3 meses',
  image: { title: app => `Meus últimos 3 meses no ${app}`, arrived: 'novos seguidores', followed: 'seguidos', back: 'me seguem', footer: 'whounfollowed.co · feito no meu navegador, sem senha' },
};

const all: Record<AppLocale, WrapContent> = { en, es, pt };
export const getWrapContent = (locale: AppLocale) => all[locale];
