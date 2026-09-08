import type { AppLocale } from '@/i18n/routing';

export interface DiffContent {
  loading: string;
  loadingSnapshots: string;
  missingIds: string;
  notFound: string;
  failedToLoad: string;
  backToHistory: string;
  historyNav: string;
  eyebrow: string;
  headlineTemplate: (days: number) => string;
  statUnfollowedYou: string;
  statNewFollowers: string;
  statYouUnfollowed: string;
  statNetChange: string;
  lostFollowersTitle: string;
  lostFollowersLabel: string;
  lostFollowersEmpty: string;
  newFollowersTitle: string;
  newFollowersLabel: string;
  newFollowersEmpty: string;
  youUnfollowedTitle: string;
  youUnfollowedLabel: string;
  youUnfollowedEmpty: string;
  newFollowingTitle: string;
  newFollowingLabel: string;
  newFollowingEmpty: string;
}

const EN: DiffContent = {
  loading: 'Loading…',
  loadingSnapshots: 'Loading snapshots…',
  missingIds: 'Missing snapshot IDs.',
  notFound: 'One or both snapshots not found.',
  failedToLoad: 'Failed to load snapshots.',
  backToHistory: '← Back to history',
  historyNav: '← History',
  eyebrow: 'SNAPSHOT COMPARISON',
  headlineTemplate: (days) => `${days} day${days !== 1 ? 's' : ''} of changes.`,
  statUnfollowedYou: 'Unfollowed you',
  statNewFollowers: 'New followers',
  statYouUnfollowed: 'You unfollowed',
  statNetChange: 'Net change',
  lostFollowersTitle: 'Who unfollowed you',
  lostFollowersLabel: 'Lost followers',
  lostFollowersEmpty: 'Nobody unfollowed you in this period.',
  newFollowersTitle: 'New followers',
  newFollowersLabel: 'Gained',
  newFollowersEmpty: 'No new followers in this period.',
  youUnfollowedTitle: 'You unfollowed',
  youUnfollowedLabel: 'You dropped',
  youUnfollowedEmpty: "You didn't unfollow anyone in this period.",
  newFollowingTitle: 'You started following',
  newFollowingLabel: 'New following',
  newFollowingEmpty: "You didn't follow anyone new in this period.",
};

const ES: DiffContent = {
  loading: 'Cargando…',
  loadingSnapshots: 'Cargando snapshots…',
  missingIds: 'Faltan los IDs de los snapshots.',
  notFound: 'No se encontró uno o ambos snapshots.',
  failedToLoad: 'Error al cargar los snapshots.',
  backToHistory: '← Volver al historial',
  historyNav: '← Historial',
  eyebrow: 'COMPARACIÓN DE SNAPSHOTS',
  headlineTemplate: (days) => `${days} día${days !== 1 ? 's' : ''} de cambios.`,
  statUnfollowedYou: 'Te dejaron de seguir',
  statNewFollowers: 'Nuevos seguidores',
  statYouUnfollowed: 'Dejaste de seguir',
  statNetChange: 'Cambio neto',
  lostFollowersTitle: 'Quién te dejó de seguir',
  lostFollowersLabel: 'Seguidores perdidos',
  lostFollowersEmpty: 'Nadie te dejó de seguir en este periodo.',
  newFollowersTitle: 'Nuevos seguidores',
  newFollowersLabel: 'Ganados',
  newFollowersEmpty: 'No hay nuevos seguidores en este periodo.',
  youUnfollowedTitle: 'Dejaste de seguir',
  youUnfollowedLabel: 'Eliminaste',
  youUnfollowedEmpty: 'No dejaste de seguir a nadie en este periodo.',
  newFollowingTitle: 'Empezaste a seguir',
  newFollowingLabel: 'Nuevos seguidos',
  newFollowingEmpty: 'No empezaste a seguir a nadie nuevo en este periodo.',
};

const PT: DiffContent = {
  loading: 'Carregando…',
  loadingSnapshots: 'Carregando snapshots…',
  missingIds: 'IDs de snapshot ausentes.',
  notFound: 'Um ou ambos os snapshots não foram encontrados.',
  failedToLoad: 'Falha ao carregar os snapshots.',
  backToHistory: '← Voltar ao histórico',
  historyNav: '← Histórico',
  eyebrow: 'COMPARAÇÃO DE SNAPSHOTS',
  headlineTemplate: (days) => `${days} dia${days !== 1 ? 's' : ''} de mudanças.`,
  statUnfollowedYou: 'Deixaram de te seguir',
  statNewFollowers: 'Novos seguidores',
  statYouUnfollowed: 'Você deixou de seguir',
  statNetChange: 'Mudança líquida',
  lostFollowersTitle: 'Quem deixou de te seguir',
  lostFollowersLabel: 'Seguidores perdidos',
  lostFollowersEmpty: 'Ninguém deixou de te seguir neste período.',
  newFollowersTitle: 'Novos seguidores',
  newFollowersLabel: 'Ganhos',
  newFollowersEmpty: 'Nenhum seguidor novo neste período.',
  youUnfollowedTitle: 'Você deixou de seguir',
  youUnfollowedLabel: 'Você removeu',
  youUnfollowedEmpty: 'Você não deixou de seguir ninguém neste período.',
  newFollowingTitle: 'Você começou a seguir',
  newFollowingLabel: 'Novos seguindo',
  newFollowingEmpty: 'Você não começou a seguir ninguém novo neste período.',
};

export function getDiffContent(locale: AppLocale): DiffContent {
  if (locale === 'es') return ES;
  if (locale === 'pt') return PT;
  return EN;
}
