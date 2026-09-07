// Shared toolbar copy for AccountList and TriageList (search/sort/export
// controls both lists have in common). AccountList is still used by the
// unmigrated /diff page, so every consumer must default to EN when no
// locale-specific content is supplied.
export interface ListToolbarContent {
  searchPlaceholder: string;
  sortingByNameTooltip: string;
  sortingByDateTooltip: string;
  nameLabel: string;
  dateLabel: string;
  aToZ: string;
  zToA: string;
  oldest: string;
  newest: string;
  aToZTooltip: string;
  zToATooltip: string;
  oldestFirstTooltip: string;
  newestFirstTooltip: string;
  exportCsv: string;
  accountsCount: (n: string) => string;
  ofTotal: (shown: string, total: string) => string;
  noResultsFor: (q: string) => string;
}

export const EN_LIST_TOOLBAR: ListToolbarContent = {
  searchPlaceholder: 'Search by username…',
  sortingByNameTooltip: 'Sorting by name. Click to sort by follow date instead',
  sortingByDateTooltip: 'Sorting by follow date. Click to sort by name instead',
  nameLabel: 'Name',
  dateLabel: 'Date',
  aToZ: 'A→Z',
  zToA: 'Z→A',
  oldest: 'Oldest',
  newest: 'Newest',
  aToZTooltip: 'A to Z. Click to reverse to Z to A',
  zToATooltip: 'Z to A. Click to reverse to A to Z',
  oldestFirstTooltip: 'Oldest first. Click to reverse to newest first',
  newestFirstTooltip: 'Newest first. Click to reverse to oldest first',
  exportCsv: 'Export CSV',
  accountsCount: (n) => `${n} accounts`,
  ofTotal: (shown, total) => `${shown} of ${total}`,
  noResultsFor: (q) => `No results for "${q}"`,
};

export const ES_LIST_TOOLBAR: ListToolbarContent = {
  searchPlaceholder: 'Buscar por usuario…',
  sortingByNameTooltip: 'Ordenando por nombre. Haz clic para ordenar por fecha de seguimiento',
  sortingByDateTooltip: 'Ordenando por fecha de seguimiento. Haz clic para ordenar por nombre',
  nameLabel: 'Nombre',
  dateLabel: 'Fecha',
  aToZ: 'A→Z',
  zToA: 'Z→A',
  oldest: 'Antiguos',
  newest: 'Recientes',
  aToZTooltip: 'A a Z. Haz clic para invertir a Z a A',
  zToATooltip: 'Z a A. Haz clic para invertir a A a Z',
  oldestFirstTooltip: 'Antiguos primero. Haz clic para invertir a recientes primero',
  newestFirstTooltip: 'Recientes primero. Haz clic para invertir a antiguos primero',
  exportCsv: 'Exportar CSV',
  accountsCount: (n) => `${n} cuentas`,
  ofTotal: (shown, total) => `${shown} de ${total}`,
  noResultsFor: (q) => `Sin resultados para "${q}"`,
};

export const PT_LIST_TOOLBAR: ListToolbarContent = {
  searchPlaceholder: 'Buscar por usuário…',
  sortingByNameTooltip: 'Ordenando por nome. Clique para ordenar por data de seguimento',
  sortingByDateTooltip: 'Ordenando por data de seguimento. Clique para ordenar por nome',
  nameLabel: 'Nome',
  dateLabel: 'Data',
  aToZ: 'A→Z',
  zToA: 'Z→A',
  oldest: 'Antigos',
  newest: 'Recentes',
  aToZTooltip: 'A a Z. Clique para inverter para Z a A',
  zToATooltip: 'Z a A. Clique para inverter para A a Z',
  oldestFirstTooltip: 'Antigos primeiro. Clique para inverter para recentes primeiro',
  newestFirstTooltip: 'Recentes primeiro. Clique para inverter para antigos primeiro',
  exportCsv: 'Exportar CSV',
  accountsCount: (n) => `${n} contas`,
  ofTotal: (shown, total) => `${shown} de ${total}`,
  noResultsFor: (q) => `Nenhum resultado para "${q}"`,
};

export function getListToolbarContent(locale: string): ListToolbarContent {
  if (locale === 'es') return ES_LIST_TOOLBAR;
  if (locale === 'pt') return PT_LIST_TOOLBAR;
  return EN_LIST_TOOLBAR;
}
