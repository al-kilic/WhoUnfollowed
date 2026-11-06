import type { AppLocale } from '@/i18n/routing';

export interface StarsContent {
  label: string;
  title: string;
  sub: string;
  search: string;
  starredCount: string; // {count}
  left: string; // {count}
  leftNone: string;
  star: string; // {name}
  unstar: string; // {name}
  empty: string;
  noMatch: string;
  more: string; // {count}
}

const en: StarsContent = {
  label: 'Your people',
  title: 'Star the ones who matter',
  sub: 'Starred people are never put in your unfollow plan, and if one of them leaves you\'ll see it first.',
  search: 'Search your mutuals',
  starredCount: '{count} starred',
  left: '{count} people you starred stopped following you since your last export',
  leftNone: 'None of your starred people left since your last export.',
  star: 'Star {name}',
  unstar: 'Remove star from {name}',
  empty: 'No mutuals in this export yet.',
  noMatch: 'No mutual matches that.',
  more: 'Showing the first 60. Search to find {count} more.',
};

const es: StarsContent = {
  label: 'Tu gente',
  title: 'Marca con estrella a quienes importan',
  sub: 'Las personas con estrella nunca entran en tu plan de unfollows, y si alguna se va lo verás primero.',
  search: 'Busca entre tus mutuos',
  starredCount: '{count} con estrella',
  left: '{count} personas con estrella dejaron de seguirte desde tu última exportación',
  leftNone: 'Ninguna persona con estrella se fue desde tu última exportación.',
  star: 'Marcar a {name}',
  unstar: 'Quitar la estrella a {name}',
  empty: 'Todavía no hay mutuos en esta exportación.',
  noMatch: 'Ningún mutuo coincide.',
  more: 'Mostrando los primeros 60. Busca para encontrar {count} más.',
};

const pt: StarsContent = {
  label: 'Sua gente',
  title: 'Dê estrela para quem importa',
  sub: 'Quem tem estrela nunca entra no seu plano de unfollows, e se alguém assim sair você vê primeiro.',
  search: 'Busque entre seus mútuos',
  starredCount: '{count} com estrela',
  left: '{count} pessoas com estrela deixaram de te seguir desde a última exportação',
  leftNone: 'Ninguém com estrela saiu desde a última exportação.',
  star: 'Dar estrela para {name}',
  unstar: 'Tirar a estrela de {name}',
  empty: 'Ainda não há mútuos nesta exportação.',
  noMatch: 'Nenhum mútuo corresponde.',
  more: 'Mostrando os primeiros 60. Busque para achar mais {count}.',
};

const all: Record<AppLocale, StarsContent> = { en, es, pt };
export const getStarsContent = (locale: AppLocale) => all[locale];
