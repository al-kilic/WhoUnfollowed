import type { AppLocale } from '@/i18n/routing';

// Posted v2 (Nov 2026): two-tap logging, results nudges, rhythm and sources.
export interface PostedV2 {
  quickTitle: string; quickHint: string; logIt: string; titleOpt: string; when: string; today: string;
  autoTitle: (format: string, date: string) => string;
  fmt: Record<'reel' | 'carousel' | 'photo' | 'story', string>;
  due: (format: string, days: number) => string; dueMore: (n: number) => string; dueSkip: string;
  reach: string; shares: string; comments: string;
  rhythm: string; rhythmNote: string; streak: (n: number) => string; noStreak: string; best: string; bestDay: (day: string) => string;
  days: string[]; toGoals: string; toInsights: string; fromInsightsHint: string;
  src: { check: string; plan: (day: number | null) => string; manual: string; insights: string };
}

const EN: PostedV2 = {
  quickTitle: 'Log a post', quickHint: 'Pick the format and save. Add the title and numbers later if you like.', logIt: 'Log it', titleOpt: 'What was it? (optional)', when: 'Posted on', today: 'Today',
  autoTitle: (f, d) => `${f}, ${d}`,
  fmt: { reel: 'Reel', carousel: 'Carousel', photo: 'Photo', story: 'Story' },
  due: (f, d) => `How did your ${f.toLowerCase()} from ${d === 2 ? '2 days' : `${d} days`} ago do?`, dueMore: (n) => `and ${n} more waiting`, dueSkip: 'Later',
  reach: 'Reach', shares: 'Shares', comments: 'Comments',
  rhythm: 'Your rhythm', rhythmNote: 'Which days your posts do best, from the results you added.', streak: (n) => `${n} ${n === 1 ? 'week' : 'weeks'} in a row`, noStreak: 'Post this week to start a streak',
  best: 'Best post', bestDay: (d) => `${d} is your strongest day so far`,
  days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], toGoals: 'Set a posting goal', toInsights: 'See why posts work', fromInsightsHint: 'Bring in your past posts with their numbers from Photo insights.',
  src: { check: 'Post check', plan: (d) => (d ? `Plan, day ${d}` : 'Plan'), manual: 'Added by you', insights: 'From your export' },
};
const ES: PostedV2 = {
  quickTitle: 'Registrar una publicación', quickHint: 'Elige el formato y guarda. Si quieres, añade el título y los números después.', logIt: 'Registrar', titleOpt: '¿Qué era? (opcional)', when: 'Publicada el', today: 'Hoy',
  autoTitle: (f, d) => `${f}, ${d}`,
  fmt: { reel: 'Reel', carousel: 'Carrusel', photo: 'Foto', story: 'Historia' },
  due: (f, d) => `¿Cómo le fue a tu ${f.toLowerCase()} de hace ${d} días?`, dueMore: (n) => `y ${n} más esperando`, dueSkip: 'Después',
  reach: 'Alcance', shares: 'Compartidos', comments: 'Comentarios',
  rhythm: 'Tu ritmo', rhythmNote: 'Qué días te van mejor, según los resultados que añadiste.', streak: (n) => `${n} ${n === 1 ? 'semana' : 'semanas'} seguidas`, noStreak: 'Publica esta semana para empezar una racha',
  best: 'Mejor publicación', bestDay: (d) => `El ${d.toLowerCase()} es tu mejor día hasta ahora`,
  days: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'], toGoals: 'Ponte una meta de publicación', toInsights: 'Mira por qué funcionan', fromInsightsHint: 'Trae tus publicaciones pasadas con sus números desde Análisis de fotos.',
  src: { check: 'Revisión', plan: (d) => (d ? `Plan, día ${d}` : 'Plan'), manual: 'Añadida por ti', insights: 'De tu exportación' },
};
const PT: PostedV2 = {
  quickTitle: 'Registrar um post', quickHint: 'Escolha o formato e salve. Se quiser, adicione o título e os números depois.', logIt: 'Registrar', titleOpt: 'O que era? (opcional)', when: 'Postado em', today: 'Hoje',
  autoTitle: (f, d) => `${f}, ${d}`,
  fmt: { reel: 'Reel', carousel: 'Carrossel', photo: 'Foto', story: 'Story' },
  due: (f, d) => `Como foi seu ${f.toLowerCase()} de ${d} dias atrás?`, dueMore: (n) => `e mais ${n} esperando`, dueSkip: 'Depois',
  reach: 'Alcance', shares: 'Compartilhamentos', comments: 'Comentários',
  rhythm: 'Seu ritmo', rhythmNote: 'Em quais dias seus posts vão melhor, pelos resultados que você adicionou.', streak: (n) => `${n} ${n === 1 ? 'semana' : 'semanas'} seguidas`, noStreak: 'Poste esta semana para começar uma sequência',
  best: 'Melhor post', bestDay: (d) => `${d} é o seu melhor dia até agora`,
  days: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'], toGoals: 'Defina uma meta de posts', toInsights: 'Veja por que funcionam', fromInsightsHint: 'Traga seus posts passados com os números pela Análise de fotos.',
  src: { check: 'Revisão', plan: (d) => (d ? `Plano, dia ${d}` : 'Plano'), manual: 'Adicionado por você', insights: 'Da sua exportação' },
};

const ALL: Record<AppLocale, PostedV2> = { en: EN, es: ES, pt: PT };
export const getPostedV2 = (l: AppLocale): PostedV2 => ALL[l] ?? EN;
