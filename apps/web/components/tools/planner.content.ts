import type { Pace } from '@ig-tracker/core';
import type { AppLocale } from '@/i18n/routing';

export interface PlannerContent {
  label: string;
  title: string;
  sub: string; // {count} {app}
  nothing: string;
  paceLabel: string;
  paces: Record<Pace, { name: string; hint: string }>;
  days: string; // {days}
  starredSkipped: string; // {count}
  start: string;
  safety: string; // {app} {sub}
  today: string; // {day} {total}
  leftToday: string; // {count}
  progress: string; // {done} {total} {days}
  open: string;
  markAll: string;
  pause: string; // {sub}
  finished: string;
  reset: string;
  privacy: string;
}

const en: PlannerContent = {
  label: 'Unfollow planner',
  title: 'Clean up without getting flagged',
  sub: '{count} accounts you follow don\'t follow you back on {app}. Pick a pace and work through a small batch each day.',
  nothing: 'Everyone you follow follows you back. Nothing to plan.',
  paceLabel: 'Pace',
  paces: {
    gentle: { name: 'Gentle, 20 a day', hint: 'Safest. Good for new or small accounts.' },
    steady: { name: 'Steady, 40 a day', hint: 'For accounts older than a few months.' },
    quick: { name: 'Quick, 80 a day', hint: 'Only for established accounts. Stop if {app} shows a warning.' },
  },
  days: '{days} days',
  starredSkipped: '{count} starred people are left out.',
  start: 'Start my plan',
  safety: 'You unfollow by hand in {app}; nothing here does it for you. Take a short break every {sub} or so, and stop for the day if {app} says you\'re going too fast.',
  today: 'Day {day} of {total}',
  leftToday: '{count} left in today\'s batch',
  progress: '{done} of {total} done · about {days} days to go',
  open: 'Open',
  markAll: 'Mark today\'s batch done',
  pause: 'Pause for a minute after every {sub}.',
  finished: 'Plan finished. Upload a new export in a couple of weeks to see what changed.',
  reset: 'Start over',
  privacy: 'The list and your progress stay in this browser.',
};

const es: PlannerContent = {
  label: 'Planificador de unfollows',
  title: 'Limpia sin que te marquen',
  sub: '{count} cuentas que sigues no te siguen en {app}. Elige un ritmo y avanza con un lote pequeño cada día.',
  nothing: 'Todos los que sigues te siguen. No hay nada que planear.',
  paceLabel: 'Ritmo',
  paces: {
    gentle: { name: 'Suave, 20 al día', hint: 'Lo más seguro. Bueno para cuentas nuevas o pequeñas.' },
    steady: { name: 'Constante, 40 al día', hint: 'Para cuentas con más de unos meses.' },
    quick: { name: 'Rápido, 80 al día', hint: 'Solo para cuentas consolidadas. Para si {app} muestra un aviso.' },
  },
  days: '{days} días',
  starredSkipped: '{count} personas con estrella quedan fuera.',
  start: 'Empezar mi plan',
  safety: 'Dejas de seguir a mano en {app}; aquí nada lo hace por ti. Haz una pausa corta cada {sub} más o menos, y para por hoy si {app} dice que vas muy rápido.',
  today: 'Día {day} de {total}',
  leftToday: 'Quedan {count} en el lote de hoy',
  progress: '{done} de {total} hechos · unos {days} días más',
  open: 'Abrir',
  markAll: 'Marcar el lote de hoy como hecho',
  pause: 'Pausa de un minuto cada {sub}.',
  finished: 'Plan terminado. Sube una nueva exportación en un par de semanas para ver qué cambió.',
  reset: 'Empezar de nuevo',
  privacy: 'La lista y tu avance se quedan en este navegador.',
};

const pt: PlannerContent = {
  label: 'Planejador de unfollows',
  title: 'Faça a faxina sem ser marcado',
  sub: '{count} contas que você segue não te seguem no {app}. Escolha um ritmo e faça um lote pequeno por dia.',
  nothing: 'Todo mundo que você segue te segue de volta. Nada para planejar.',
  paceLabel: 'Ritmo',
  paces: {
    gentle: { name: 'Leve, 20 por dia', hint: 'O mais seguro. Bom para contas novas ou pequenas.' },
    steady: { name: 'Constante, 40 por dia', hint: 'Para contas com mais de alguns meses.' },
    quick: { name: 'Rápido, 80 por dia', hint: 'Só para contas consolidadas. Pare se o {app} mostrar um aviso.' },
  },
  days: '{days} dias',
  starredSkipped: '{count} pessoas com estrela ficam de fora.',
  start: 'Começar meu plano',
  safety: 'Você deixa de seguir à mão no {app}; nada aqui faz isso por você. Faça uma pausa curta a cada {sub} mais ou menos, e pare por hoje se o {app} disser que você está indo rápido demais.',
  today: 'Dia {day} de {total}',
  leftToday: 'Faltam {count} no lote de hoje',
  progress: '{done} de {total} feitos · uns {days} dias pela frente',
  open: 'Abrir',
  markAll: 'Marcar o lote de hoje como feito',
  pause: 'Pausa de um minuto a cada {sub}.',
  finished: 'Plano concluído. Envie uma nova exportação em umas duas semanas para ver o que mudou.',
  reset: 'Recomeçar',
  privacy: 'A lista e seu progresso ficam neste navegador.',
};

const all: Record<AppLocale, PlannerContent> = { en, es, pt };
export const getPlannerContent = (locale: AppLocale) => all[locale];
