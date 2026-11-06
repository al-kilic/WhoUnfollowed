import type { AppLocale } from '@/i18n/routing';

export interface GrowthTimelineContent {
  label: string;
  title: string;
  sub: string;
  best: string; // {month} {count}
  lastYear: string; // {pct}
  undated: string; // {count}
  empty: string;
  range3y: string;
  rangeAll: string;
  showTable: string;
  showChart: string;
  colMonth: string;
  colFollowers: string;
  tooltip: string; // {count}
  chartLabel: string;
}

const en: GrowthTimelineContent = {
  label: 'Growth timeline',
  title: 'When your followers found you',
  sub: 'Month by month, from the follow dates in your export. Only people who still follow you are counted.',
  best: 'Best month: {month}, +{count}',
  lastYear: '{pct}% of your followers arrived in the last 12 months',
  undated: '{count} followers have no date in the export and are left out.',
  empty: 'This export has no follow dates (HTML exports don\'t). Request a JSON export to see your timeline.',
  range3y: 'Last 3 years',
  rangeAll: 'All time',
  showTable: 'Table view',
  showChart: 'Chart view',
  colMonth: 'Month',
  colFollowers: 'New followers who stayed',
  tooltip: '+{count} followers',
  chartLabel: 'Bar chart of new followers per month',
};

const es: GrowthTimelineContent = {
  label: 'Línea de crecimiento',
  title: 'Cuándo te encontraron tus seguidores',
  sub: 'Mes a mes, con las fechas de seguimiento de tu exportación. Solo cuenta a quienes todavía te siguen.',
  best: 'Mejor mes: {month}, +{count}',
  lastYear: 'El {pct}% de tus seguidores llegó en los últimos 12 meses',
  undated: '{count} seguidores no tienen fecha en la exportación y quedan fuera.',
  empty: 'Esta exportación no tiene fechas (las HTML no las traen). Pide una exportación JSON para ver tu línea.',
  range3y: 'Últimos 3 años',
  rangeAll: 'Todo',
  showTable: 'Ver tabla',
  showChart: 'Ver gráfico',
  colMonth: 'Mes',
  colFollowers: 'Nuevos seguidores que se quedaron',
  tooltip: '+{count} seguidores',
  chartLabel: 'Gráfico de barras de nuevos seguidores por mes',
};

const pt: GrowthTimelineContent = {
  label: 'Linha do crescimento',
  title: 'Quando seus seguidores te encontraram',
  sub: 'Mês a mês, a partir das datas na sua exportação. Só conta quem ainda te segue.',
  best: 'Melhor mês: {month}, +{count}',
  lastYear: '{pct}% dos seus seguidores chegaram nos últimos 12 meses',
  undated: '{count} seguidores não têm data na exportação e ficam de fora.',
  empty: 'Esta exportação não tem datas (as HTML não trazem). Peça uma exportação JSON para ver sua linha.',
  range3y: 'Últimos 3 anos',
  rangeAll: 'Tudo',
  showTable: 'Ver tabela',
  showChart: 'Ver gráfico',
  colMonth: 'Mês',
  colFollowers: 'Novos seguidores que ficaram',
  tooltip: '+{count} seguidores',
  chartLabel: 'Gráfico de barras de novos seguidores por mês',
};

const all: Record<AppLocale, GrowthTimelineContent> = { en, es, pt };
export const getGrowthTimelineContent = (locale: AppLocale) => all[locale];
