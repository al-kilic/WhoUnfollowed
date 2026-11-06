import type { AppLocale } from '@/i18n/routing';

// Copy for the unfollow planner nudge. Counts only, never usernames. No em dashes.
export interface PlannerEmailContent {
  subject: (left: string, app: string) => string;
  preview: (perDay: string) => string;
  title: (app: string) => string;
  progress: (done: string, total: string, pct: number) => string;
  today: (n: string) => string;
  daysLeft: (days: string) => string;
  tip: string;
  button: string;
  privacyNote: string;
  footer: (cadence: 'weekly' | 'daily') => string;
  unsubscribe: string;
}

const en: PlannerEmailContent = {
  subject: (left, app) => `${left} left in your ${app} cleanup`,
  preview: n => `Today's batch is ready: ${n} accounts.`,
  title: app => `Your ${app} cleanup`,
  progress: (done, total, pct) => `${done} of ${total} done (${pct}%).`,
  today: n => `Today's batch is ready: ${n} accounts.`,
  daysLeft: d => `About ${d} days to go at this pace.`,
  tip: 'Take a short break every 10 or so, and stop for the day if the app says you are going too fast.',
  button: 'Open my plan',
  privacyNote: 'This email only knows how many are left. The list itself stays in your browser.',
  footer: c => `You get this ${c === 'daily' ? 'daily' : 'weekly'} because you turned on planner emails on whounfollowed.co.`,
  unsubscribe: 'Stop planner emails',
};

const es: PlannerEmailContent = {
  subject: (left, app) => `Te quedan ${left} en tu limpieza de ${app}`,
  preview: n => `El lote de hoy está listo: ${n} cuentas.`,
  title: app => `Tu limpieza de ${app}`,
  progress: (done, total, pct) => `${done} de ${total} hechos (${pct}%).`,
  today: n => `El lote de hoy está listo: ${n} cuentas.`,
  daysLeft: d => `Unos ${d} días más a este ritmo.`,
  tip: 'Haz una pausa corta cada 10 más o menos, y para por hoy si la app dice que vas muy rápido.',
  button: 'Abrir mi plan',
  privacyNote: 'Este email solo sabe cuántas quedan. La lista se queda en tu navegador.',
  footer: c => `Recibes esto ${c === 'daily' ? 'cada día' : 'cada semana'} porque activaste los emails del planificador en whounfollowed.co.`,
  unsubscribe: 'Dejar los emails del planificador',
};

const pt: PlannerEmailContent = {
  subject: (left, app) => `Faltam ${left} na sua faxina do ${app}`,
  preview: n => `O lote de hoje está pronto: ${n} contas.`,
  title: app => `Sua faxina do ${app}`,
  progress: (done, total, pct) => `${done} de ${total} feitos (${pct}%).`,
  today: n => `O lote de hoje está pronto: ${n} contas.`,
  daysLeft: d => `Uns ${d} dias pela frente nesse ritmo.`,
  tip: 'Faça uma pausa curta a cada 10 mais ou menos, e pare por hoje se o app disser que você está indo rápido demais.',
  button: 'Abrir meu plano',
  privacyNote: 'Este email só sabe quantas faltam. A lista fica no seu navegador.',
  footer: c => `Você recebe isto ${c === 'daily' ? 'todo dia' : 'toda semana'} porque ativou os emails do planejador no whounfollowed.co.`,
  unsubscribe: 'Parar os emails do planejador',
};

const all: Record<AppLocale, PlannerEmailContent> = { en, es, pt };
export const getPlannerEmailContent = (locale: AppLocale) => all[locale];
