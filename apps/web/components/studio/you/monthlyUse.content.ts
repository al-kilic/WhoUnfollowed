import type { AppLocale } from '@/i18n/routing';
import type { UsageFeature } from '@/lib/ai/usageBreakdown';

// You > Monthly use: plain words, never numbers of money or credits.
export interface MonthlyUseContent {
  wentTo: string; wentToEmpty: string;
  features: Record<UsageFeature, string>;
  most: string;
  pastTitle: string; pastSub: string;
  tipsTitle: string; tips: string[];
  ringLeft: Record<'low' | 'mid' | 'high' | 'full', string>;
}

const EN: MonthlyUseContent = {
  wentTo: 'What your month went to', wentToEmpty: 'Nothing used yet this month. Ask your coach something to start.',
  features: { ask: 'Ask coach', create: 'Writing and post checks', plan: '30-day plans', photos: 'Photo insights and style', reads: 'Reads of your exports' },
  most: 'Most used',
  pastTitle: 'Past months', pastSub: 'How full each month got.',
  tipsTitle: 'Make your month last',
  tips: ['Short, specific questions use very little.', 'Keep asking in the same chat: follow-ups reuse what the coach already read.', 'A plan change uses less than a brand-new plan.', 'Photo insights and deeper answers use the most. Save them for what matters.'],
  ringLeft: { low: 'Plenty left', mid: 'Good amount left', high: 'Most of it used', full: 'Used up' },
};
const ES: MonthlyUseContent = {
  wentTo: 'En qué se fue tu mes', wentToEmpty: 'Aún no usaste nada este mes. Pregúntale algo a tu coach para empezar.',
  features: { ask: 'Preguntar al coach', create: 'Textos y revisiones', plan: 'Planes de 30 días', photos: 'Análisis y estilo de fotos', reads: 'Lecturas de tus exportaciones' },
  most: 'Lo más usado',
  pastTitle: 'Meses anteriores', pastSub: 'Cuánto se llenó cada mes.',
  tipsTitle: 'Haz que tu mes rinda',
  tips: ['Las preguntas cortas y concretas usan muy poco.', 'Sigue en el mismo chat: las preguntas siguientes reutilizan lo que el coach ya leyó.', 'Cambiar un plan usa menos que crear uno nuevo.', 'El análisis de fotos y las respuestas profundas usan más. Guárdalos para lo importante.'],
  ringLeft: { low: 'Queda mucho', mid: 'Queda bastante', high: 'Usaste la mayor parte', full: 'Agotado' },
};
const PT: MonthlyUseContent = {
  wentTo: 'Para onde foi seu mês', wentToEmpty: 'Nada usado ainda este mês. Pergunte algo ao seu coach para começar.',
  features: { ask: 'Perguntar ao coach', create: 'Textos e revisões', plan: 'Planos de 30 dias', photos: 'Análise e estilo de fotos', reads: 'Leituras das suas exportações' },
  most: 'Mais usado',
  pastTitle: 'Meses anteriores', pastSub: 'Quanto cada mês encheu.',
  tipsTitle: 'Faça seu mês render',
  tips: ['Perguntas curtas e específicas usam muito pouco.', 'Continue no mesmo chat: as próximas perguntas reaproveitam o que o coach já leu.', 'Mudar um plano usa menos do que criar um novo.', 'Análise de fotos e respostas profundas usam mais. Guarde para o que importa.'],
  ringLeft: { low: 'Sobra bastante', mid: 'Sobra uma boa parte', high: 'Quase tudo usado', full: 'Esgotado' },
};
const BY: Record<AppLocale, MonthlyUseContent> = { en: EN, es: ES, pt: PT };
export const getMonthlyUseContent = (l: AppLocale): MonthlyUseContent => BY[l] ?? EN;
