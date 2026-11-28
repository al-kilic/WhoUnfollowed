import type { AppLocale } from '@/i18n/routing';
import type { BriefPlatform, IdeaFormat } from '@/lib/briefCards';

export interface BriefCardsContent {
  why: string; doThis: string; source: string; hook: string; tryLabel: string; writeIt: string; checkIt: string;
  platforms: Record<BriefPlatform, string>;
  formats: Record<IdeaFormat, string>;
  news: (n: number) => string;
}
const EN: BriefCardsContent = {
  why: 'Why it matters', doThis: 'Do this', source: 'Source', hook: 'Hook', tryLabel: 'Try this week', writeIt: 'Write it', checkIt: 'Plan it',
  platforms: { instagram: 'Instagram', threads: 'Threads', tiktok: 'TikTok', meta: 'Meta' },
  formats: { reel: 'Reel', carousel: 'Carousel', story: 'Stories', threads: 'Threads', tiktok: 'TikTok', photo: 'Photo', post: 'Post' },
  news: (n) => `${n} ${n === 1 ? 'change' : 'changes'} this week`,
};
const ES: BriefCardsContent = {
  why: 'Por qué importa', doThis: 'Haz esto', source: 'Fuente', hook: 'Gancho', tryLabel: 'Prueba esta semana', writeIt: 'Escribirlo', checkIt: 'Planificarlo',
  platforms: { instagram: 'Instagram', threads: 'Threads', tiktok: 'TikTok', meta: 'Meta' },
  formats: { reel: 'Reel', carousel: 'Carrusel', story: 'Stories', threads: 'Threads', tiktok: 'TikTok', photo: 'Foto', post: 'Post' },
  news: (n) => `${n} ${n === 1 ? 'cambio' : 'cambios'} esta semana`,
};
const PT: BriefCardsContent = {
  why: 'Por que importa', doThis: 'Faça isto', source: 'Fonte', hook: 'Gancho', tryLabel: 'Teste nesta semana', writeIt: 'Escrever', checkIt: 'Planejar',
  platforms: { instagram: 'Instagram', threads: 'Threads', tiktok: 'TikTok', meta: 'Meta' },
  formats: { reel: 'Reel', carousel: 'Carrossel', story: 'Stories', threads: 'Threads', tiktok: 'TikTok', photo: 'Foto', post: 'Post' },
  news: (n) => `${n} ${n === 1 ? 'mudança' : 'mudanças'} nesta semana`,
};
const BY: Record<AppLocale, BriefCardsContent> = { en: EN, es: ES, pt: PT };
export const getBriefCardsContent = (l: AppLocale): BriefCardsContent => BY[l] ?? EN;
