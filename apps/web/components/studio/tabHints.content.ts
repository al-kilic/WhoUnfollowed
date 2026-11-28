import type { AppLocale } from '@/i18n/routing';
import type { StudioNavKey } from './studio.content';

// One line per section tab, shown in a hint after a hover pause, on keyboard
// focus or on a long press. Plain, no em dashes.
type TabKey = Extract<StudioNavKey,
  'list' | 'history' | 'overview' | 'fixes' | 'growth' | 'people' | 'whyLeft' | 'benchmarks'
  | 'write' | 'check' | 'ideas' | 'planCal' | 'posted' | 'insights' | 'goals' | 'brief'
  | 'settings' | 'credits' | 'kit' | 'guides'>;

export const TAB_KEYS: TabKey[] = ['list', 'history', 'overview', 'fixes', 'growth', 'people', 'whyLeft', 'benchmarks', 'write', 'check', 'ideas', 'planCal', 'posted', 'insights', 'goals', 'brief', 'settings', 'credits', 'kit', 'guides'];

const EN: Record<TabKey, string> = {
  list: 'Who does not follow you back, your fans and mutuals, sorted and searchable.',
  history: 'Every export you kept, with the trend and a compare between any two.',
  overview: 'A quick health check of your account with the tiles that matter most.',
  fixes: 'Clean ups ranked by impact: ghost followers, old requests and more.',
  growth: 'How your followers changed from one export to the next.',
  people: 'Your circle, the follow requests you sent and a calm unfollow planner.',
  whyLeft: 'Why people left, matched with what you posted. Coming later.',
  benchmarks: 'How you compare with accounts of a similar size. Coming later.',
  write: 'Hooks, captions and Reel scripts in your own voice.',
  check: 'A score and clear fixes for a post before you share it.',
  ideas: 'Five post ideas at a time, built from your memory and numbers.',
  planCal: 'Your 30-day post plan. Drag posts to move them between days.',
  posted: 'Posts you shared and how they did, so the coach learns what works.',
  insights: 'What worked in your own photos, and what to shoot next.',
  goals: 'One goal per platform, with your pace and check-ins.',
  brief: 'What changed on the platforms this week, and what to do about it.',
  settings: 'Your profile, how the coach writes for you, billing and emails.',
  credits: 'How much of this month\'s coach use is left, and your refills.',
  kit: 'A shareable media kit for brands. Coming later.',
  guides: 'Short guides on growing an account. Coming later.',
};

const ES: Record<TabKey, string> = {
  list: 'Quién no te sigue de vuelta, tus fans y mutuos, ordenados y con búsqueda.',
  history: 'Cada exportación que guardaste, con la tendencia y una comparación entre dos.',
  overview: 'Un chequeo rápido de tu cuenta con los indicadores que más importan.',
  fixes: 'Limpiezas ordenadas por impacto: seguidores fantasma, solicitudes viejas y más.',
  growth: 'Cómo cambiaron tus seguidores de una exportación a la siguiente.',
  people: 'Tu círculo, las solicitudes que enviaste y un planificador tranquilo para dejar de seguir.',
  whyLeft: 'Por qué se fue la gente, cruzado con lo que publicaste. Llega más adelante.',
  benchmarks: 'Cómo te comparas con cuentas de tamaño parecido. Llega más adelante.',
  write: 'Ganchos, textos y guiones de Reel con tu propia voz.',
  check: 'Una puntuación y arreglos claros para un post antes de compartirlo.',
  ideas: 'Cinco ideas de posts a la vez, hechas con tu memoria y tus números.',
  planCal: 'Tu plan de publicaciones de 30 días. Arrastra posts para moverlos de día.',
  posted: 'Los posts que compartiste y cómo les fue, para que el coach aprenda qué funciona.',
  insights: 'Qué funcionó en tus propias fotos y qué fotografiar después.',
  goals: 'Una meta por plataforma, con tu ritmo y recordatorios.',
  brief: 'Qué cambió en las plataformas esta semana y qué hacer al respecto.',
  settings: 'Tu perfil, cómo escribe el coach para ti, pagos y correos.',
  credits: 'Cuánto te queda del uso del coach este mes, y tus recargas.',
  kit: 'Un media kit para marcas que puedes compartir. Llega más adelante.',
  guides: 'Guías cortas para hacer crecer una cuenta. Llega más adelante.',
};

const PT: Record<TabKey, string> = {
  list: 'Quem não te segue de volta, seus fãs e mútuos, ordenados e com busca.',
  history: 'Cada exportação que você guardou, com a tendência e uma comparação entre duas.',
  overview: 'Um check-up rápido da sua conta com os indicadores que mais importam.',
  fixes: 'Limpezas ordenadas por impacto: seguidores fantasma, solicitações antigas e mais.',
  growth: 'Como seus seguidores mudaram de uma exportação para a outra.',
  people: 'Seu círculo, as solicitações que você enviou e um planejador calmo para deixar de seguir.',
  whyLeft: 'Por que as pessoas saíram, cruzado com o que você postou. Chega mais tarde.',
  benchmarks: 'Como você se compara com contas de tamanho parecido. Chega mais tarde.',
  write: 'Ganchos, legendas e roteiros de Reel com a sua voz.',
  check: 'Uma nota e ajustes claros para um post antes de compartilhar.',
  ideas: 'Cinco ideias de posts por vez, feitas com sua memória e seus números.',
  planCal: 'Seu plano de posts de 30 dias. Arraste posts para mudar de dia.',
  posted: 'Os posts que você compartilhou e como foram, para o coach aprender o que funciona.',
  insights: 'O que funcionou nas suas próprias fotos e o que fotografar depois.',
  goals: 'Uma meta por plataforma, com seu ritmo e lembretes.',
  brief: 'O que mudou nas plataformas nesta semana e o que fazer a respeito.',
  settings: 'Seu perfil, como o coach escreve para você, pagamentos e e-mails.',
  credits: 'Quanto ainda resta do uso do coach neste mês, e suas recargas.',
  kit: 'Um media kit para marcas que você pode compartilhar. Chega mais tarde.',
  guides: 'Guias curtos para crescer uma conta. Chega mais tarde.',
};

const ALL: Record<AppLocale, Record<TabKey, string>> = { en: EN, es: ES, pt: PT };

export function tabHint(key: StudioNavKey, locale: AppLocale): string | null {
  return (ALL[locale] ?? EN)[key as TabKey] ?? null;
}

export const TAB_HINTS = ALL;
