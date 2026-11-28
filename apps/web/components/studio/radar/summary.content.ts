import type { AppLocale } from '@/i18n/routing';

// Labels for the number tiles at the top of Radar's tabs and History.
export interface SummaryContent {
  fixes: { found: string; high: string; accounts: string };
  growth: { followers: string; sinceFirst: string; bestMonth: string; lastYear: string };
  people: { mutuals: string; fans: string; oneWay: string; pending: string; pendingHint: string };
  history: { checks: string; first: string; change: string; trend: (app: string) => string; needTwo: (app: string) => string };
}

const EN: SummaryContent = {
  fixes: { found: 'Things to fix', high: 'High impact', accounts: 'Accounts involved' },
  growth: { followers: 'Followers', sinceFirst: 'Since your first check', bestMonth: 'Best month', lastYear: 'Arrived in the last 12 months' },
  people: { mutuals: 'Mutuals', fans: 'Fans', oneWay: "Don't follow back", pending: 'Requests waiting', pendingHint: 'See the requests you sent' },
  history: { checks: 'Checks saved', first: 'First check', change: 'Followers since then', trend: (a) => `${a} followers per check`, needTwo: (a) => `Add a second ${a} export to see the trend.` },
};
const ES: SummaryContent = {
  fixes: { found: 'Cosas que arreglar', high: 'Alto impacto', accounts: 'Cuentas implicadas' },
  growth: { followers: 'Seguidores', sinceFirst: 'Desde tu primera revisión', bestMonth: 'Mejor mes', lastYear: 'Llegaron en los últimos 12 meses' },
  people: { mutuals: 'Mutuos', fans: 'Fans', oneWay: 'No te siguen', pending: 'Solicitudes en espera', pendingHint: 'Ver las solicitudes que enviaste' },
  history: { checks: 'Revisiones guardadas', first: 'Primera revisión', change: 'Seguidores desde entonces', trend: (a) => `Seguidores en ${a} por revisión`, needTwo: (a) => `Añade una segunda exportación de ${a} para ver la tendencia.` },
};
const PT: SummaryContent = {
  fixes: { found: 'Coisas para ajustar', high: 'Alto impacto', accounts: 'Contas envolvidas' },
  growth: { followers: 'Seguidores', sinceFirst: 'Desde a primeira verificação', bestMonth: 'Melhor mês', lastYear: 'Chegaram nos últimos 12 meses' },
  people: { mutuals: 'Mútuos', fans: 'Fãs', oneWay: 'Não seguem de volta', pending: 'Pedidos aguardando', pendingHint: 'Ver os pedidos que você enviou' },
  history: { checks: 'Verificações salvas', first: 'Primeira verificação', change: 'Seguidores desde então', trend: (a) => `Seguidores no ${a} por verificação`, needTwo: (a) => `Adicione uma segunda exportação do ${a} para ver a tendência.` },
};

export function getSummaryContent(locale: AppLocale): SummaryContent {
  return locale === 'es' ? ES : locale === 'pt' ? PT : EN;
}
