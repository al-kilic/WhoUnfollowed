import type { AppLocale } from '@/i18n/routing';

// The line under every coach answer (where it came from) and the drawer that
// shows the exact text the coach was given.
export interface CoachSeenContent {
  from: string;
  exports: (n: number, since: string) => string;
  goal: string;
  posted: (n: number) => string;
  memory: string;
  facts: (n: number) => string;
  brief: (date: string) => string;
}

const EN: CoachSeenContent = {
  from: 'From',
  exports: (n, since) => `${n} ${n === 1 ? 'export' : 'exports'}${since ? ` since ${since}` : ''}`,
  goal: 'your goal',
  posted: (n) => `${n} posted ${n === 1 ? 'result' : 'results'}`,
  memory: 'memory',
  facts: (n) => `${n} Radar ${n === 1 ? 'finding' : 'findings'}`,
  brief: (d) => `brief of ${d}`,
};

const ES: CoachSeenContent = {
  from: 'Con',
  exports: (n, since) => `${n} ${n === 1 ? 'exportación' : 'exportaciones'}${since ? ` desde ${since}` : ''}`,
  goal: 'tu meta',
  posted: (n) => `${n} ${n === 1 ? 'resultado publicado' : 'resultados publicados'}`,
  memory: 'memoria',
  facts: (n) => `${n} ${n === 1 ? 'hallazgo' : 'hallazgos'} de Radar`,
  brief: (d) => `resumen del ${d}`,
};

const PT: CoachSeenContent = {
  from: 'Com',
  exports: (n, since) => `${n} ${n === 1 ? 'exportação' : 'exportações'}${since ? ` desde ${since}` : ''}`,
  goal: 'sua meta',
  posted: (n) => `${n} ${n === 1 ? 'resultado postado' : 'resultados postados'}`,
  memory: 'memória',
  facts: (n) => `${n} ${n === 1 ? 'achado' : 'achados'} do Radar`,
  brief: (d) => `resumo de ${d}`,
};

export function getCoachSeenContent(locale: AppLocale): CoachSeenContent {
  return locale === 'es' ? ES : locale === 'pt' ? PT : EN;
}
