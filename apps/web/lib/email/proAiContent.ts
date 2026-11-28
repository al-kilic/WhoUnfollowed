import type { AppLocale } from '@/i18n/routing';

// Pro AI purchase confirmation, sent from the Stripe webhook.
export interface ProAiEmailContent {
  subject: string;
  preview: string;
  title: string;
  body: (plan: string) => string;
  privacy: string;
  button: string;
  footer: string;
  monthly: string;
  yearly: string;
}

const all: Record<AppLocale, ProAiEmailContent> = {
  en: {
    subject: 'Your Pro AI is on',
    preview: 'Your coach is ready in your Studio.',
    title: 'Your Pro AI is on',
    body: (plan) => `Thanks for subscribing to Pro AI ${plan}. Your coach is ready in your Studio, with generous monthly use that resets every month. Reading each new export is included.`,
    privacy: 'Your followers stay in your browser. The coach only gets counts and dates, never usernames.',
    button: 'Open your Studio',
    footer: 'You can change your card or cancel any time in Studio, under You.',
    monthly: 'monthly',
    yearly: 'yearly',
  },
  es: {
    subject: 'Tu Pro AI está activo',
    preview: 'Tu coach te espera en tu Studio.',
    title: 'Tu Pro AI está activo',
    body: (plan) => `Gracias por suscribirte a Pro AI ${plan}. Tu coach te espera en tu Studio, con un uso mensual generoso que se renueva cada mes. Leer cada nueva exportación está incluido.`,
    privacy: 'Tus seguidores se quedan en tu navegador. El coach solo recibe cifras y fechas, nunca nombres de usuario.',
    button: 'Abrir tu Studio',
    footer: 'Puedes cambiar tu tarjeta o cancelar cuando quieras en Studio, en Tú.',
    monthly: 'mensual',
    yearly: 'anual',
  },
  pt: {
    subject: 'Seu Pro AI está ativo',
    preview: 'Seu coach está pronto no seu Studio.',
    title: 'Seu Pro AI está ativo',
    body: (plan) => `Obrigado por assinar o Pro AI ${plan}. Seu coach está pronto no seu Studio, com um uso mensal generoso que renova todo mês. A leitura de cada nova exportação está incluída.`,
    privacy: 'Seus seguidores ficam no seu navegador. O coach só recebe números e datas, nunca nomes de usuário.',
    button: 'Abrir seu Studio',
    footer: 'Você pode trocar o cartão ou cancelar quando quiser no Studio, em Você.',
    monthly: 'mensal',
    yearly: 'anual',
  },
};

export const getProAiEmailContent = (locale: AppLocale): ProAiEmailContent => all[locale];

// Goal check-in, sent weekly or every two weeks when the user turned it on.
export interface CheckinEmailContent {
  subject: (current: string, target: string) => string;
  // Several goals (one per platform) in one email.
  subjectMulti: (count: number) => string;
  preview: string;
  title: string;
  progress: (current: string, target: string, pct: number) => string;
  status: Record<'done' | 'ahead' | 'on_track' | 'behind' | 'no_deadline' | 'no_data', string>;
  pace: (soFar: string | null, needed: string | null) => string;
  nudge: (app: string) => string;
  // Goals measured from Posted: posts a week, new followers per post.
  habit: { posts_week: (current: string, target: string) => string; per_post: (current: string, target: string) => string };
  habitNudge: string;
  deadline: (days: number) => string;
  button: string;
  footer: string;
}

const checkin: Record<AppLocale, CheckinEmailContent> = {
  en: {
    subject: (c, t) => `Your goal check-in: ${c} of ${t}`,
    subjectMulti: (n) => `Your goal check-in: ${n} goals`,
    preview: 'Where your follower goal stands.',
    title: 'Your goal check-in',
    progress: (c, t, p) => `${c} of ${t} followers (${p}%), from your latest export.`,
    status: { done: 'You reached your goal.', ahead: 'You are ahead of pace.', on_track: 'You are on track.', behind: 'You are behind pace.', no_deadline: 'No date set, so there is no pace to keep.', no_data: 'No new export since you set the goal.' },
    pace: (s, n) => [s ? `${s} a week so far` : '', n ? `${n} a week needed` : ''].filter(Boolean).join(', ') + '.',
    nudge: (app) => `Download a new export from ${app} and upload it to update these numbers.`,
    habit: { posts_week: (c, t) => `${c} of ${t} posts in the last 7 days.`, per_post: (c, t) => `${c} new followers per post on average, against a goal of ${t}.` },
    habitNudge: 'Add results to your latest posts under Plan, then Posted, so these numbers stay right.',
    deadline: (d) => `${d} ${d === 1 ? 'day' : 'days'} left until your deadline.`,
    button: 'Open your goal',
    footer: 'You get this because you turned on check-ins in Studio. Turn them off under Plan, then Goals.',
  },
  es: {
    subject: (c, t) => `Tu seguimiento: ${c} de ${t}`,
    subjectMulti: (n) => `Tu seguimiento: ${n} objetivos`,
    preview: 'Cómo va tu objetivo de seguidores.',
    title: 'Tu seguimiento',
    progress: (c, t, p) => `${c} de ${t} seguidores (${p}%), según tu última exportación.`,
    status: { done: 'Alcanzaste tu objetivo.', ahead: 'Vas por delante del ritmo.', on_track: 'Vas bien.', behind: 'Vas por detrás del ritmo.', no_deadline: 'Sin fecha, así que no hay ritmo que seguir.', no_data: 'No hay exportación nueva desde que fijaste el objetivo.' },
    pace: (s, n) => [s ? `${s} por semana hasta ahora` : '', n ? `${n} por semana necesarios` : ''].filter(Boolean).join(', ') + '.',
    nudge: (app) => `Descarga una exportación nueva de ${app} y súbela para actualizar estas cifras.`,
    habit: { posts_week: (c, t) => `${c} de ${t} publicaciones en los últimos 7 días.`, per_post: (c, t) => `${c} seguidores nuevos por publicación de media, frente a un objetivo de ${t}.` },
    habitNudge: 'Añade resultados a tus últimas publicaciones en Plan, Publicadas, para que estas cifras sigan bien.',
    deadline: (d) => `Quedan ${d} ${d === 1 ? 'día' : 'días'} para tu fecha límite.`,
    button: 'Ver tu objetivo',
    footer: 'Recibes esto porque activaste el seguimiento en Studio. Desactívalo en Plan, Objetivos.',
  },
  pt: {
    subject: (c, t) => `Seu acompanhamento: ${c} de ${t}`,
    subjectMulti: (n) => `Seu acompanhamento: ${n} metas`,
    preview: 'Como está sua meta de seguidores.',
    title: 'Seu acompanhamento',
    progress: (c, t, p) => `${c} de ${t} seguidores (${p}%), pela sua última exportação.`,
    status: { done: 'Você alcançou sua meta.', ahead: 'Você está à frente do ritmo.', on_track: 'Você está no ritmo.', behind: 'Você está atrás do ritmo.', no_deadline: 'Sem data, então não há ritmo a seguir.', no_data: 'Nenhuma exportação nova desde que você definiu a meta.' },
    pace: (s, n) => [s ? `${s} por semana até agora` : '', n ? `${n} por semana necessários` : ''].filter(Boolean).join(', ') + '.',
    nudge: (app) => `Baixe uma nova exportação do ${app} e envie para atualizar estes números.`,
    habit: { posts_week: (c, t) => `${c} de ${t} posts nos últimos 7 dias.`, per_post: (c, t) => `${c} seguidores novos por post em média, para uma meta de ${t}.` },
    habitNudge: 'Adicione resultados aos seus últimos posts em Plano, Postados, para estes números continuarem certos.',
    deadline: (d) => `${d === 1 ? 'Falta' : 'Faltam'} ${d} ${d === 1 ? 'dia' : 'dias'} para o seu prazo.`,
    button: 'Ver sua meta',
    footer: 'Você recebe isto porque ativou o acompanhamento no Studio. Desligue em Plano, Metas.',
  },
};

export const getCheckinEmailContent = (locale: AppLocale): CheckinEmailContent => checkin[locale];

// Weekly brief email (You > Settings > Notifications, on by default).
export interface BriefEmailContent { subject: (date: string) => string; preview: string; title: string; body: string; button: string; footer: string }

const brief: Record<AppLocale, BriefEmailContent> = {
  en: { subject: (d) => `Your weekly brief for ${d}`, preview: 'What changed on Instagram this week, and what to post.', title: "This week's brief is out", body: 'What changed on Instagram and Threads this week, what is working in your niche, and one thing to try.', button: 'Read the brief', footer: 'You get this because you turned on the weekly brief in You, Settings, Notifications. Turn it off there any time.' },
  es: { subject: (d) => `Tu resumen semanal del ${d}`, preview: 'Qué cambió en Instagram esta semana y qué publicar.', title: 'Ya está el resumen de esta semana', body: 'Qué cambió en Instagram y Threads esta semana, qué funciona en tu nicho y una cosa para probar.', button: 'Leer el resumen', footer: 'Lo recibes porque activaste el resumen semanal en Tú, Ajustes, Notificaciones. Desactívalo allí cuando quieras.' },
  pt: { subject: (d) => `Seu resumo semanal de ${d}`, preview: 'O que mudou no Instagram nesta semana e o que postar.', title: 'O resumo desta semana saiu', body: 'O que mudou no Instagram e no Threads nesta semana, o que funciona no seu nicho e uma coisa para testar.', button: 'Ler o resumo', footer: 'Você recebe isto porque ativou o resumo semanal em Você, Configurações, Notificações. Desative lá quando quiser.' },
};

export function getBriefEmailContent(locale: AppLocale): BriefEmailContent {
  return brief[locale];
}

// Posting-day reminder (You > Settings > Notifications, off by default).
export type PostFormatLabel = 'reel' | 'carousel' | 'photo' | 'story';
export interface PostingEmailContent {
  subject: (format: string | null) => string; preview: string; title: string;
  withPost: (format: string) => string; noPost: string; button: string; footer: string;
  formats: Record<PostFormatLabel, string>;
  // The "day before" version of the same email.
  tomorrow: { subject: (format: string | null) => string; preview: string; title: string; withPost: (format: string) => string };
}

const posting: Record<AppLocale, PostingEmailContent> = {
  en: {
    subject: (f) => (f ? `Today you post: ${f}` : 'Today is a posting day'), preview: 'Your plan has today covered.',
    title: 'Today is one of your posting days', withPost: (f) => `Your plan has a ${f} for today:`, noPost: 'Your plan and caption ideas are ready in Studio.',
    button: 'Open your plan', footer: 'You get this because you turned on posting-day reminders in You, Settings, Calendar and reminders. Turn it off there any time.',
    formats: { reel: 'reel', carousel: 'carousel', photo: 'photo post', story: 'story' },
    tomorrow: { subject: (f) => (f ? `Tomorrow you post: ${f}` : 'Tomorrow is a posting day'), preview: 'A heads-up for tomorrow.', title: 'Tomorrow is one of your posting days', withPost: (f) => `Your plan has a ${f} for tomorrow:` },
  },
  es: {
    subject: (f) => (f ? `Hoy publicas: ${f}` : 'Hoy es día de publicar'), preview: 'Tu plan ya tiene lo de hoy.',
    title: 'Hoy es uno de tus días de publicar', withPost: (f) => `Tu plan tiene un ${f} para hoy:`, noPost: 'Tu plan e ideas de texto están listos en Studio.',
    button: 'Abrir tu plan', footer: 'Lo recibes porque activaste el aviso en días de publicar en Tú, Ajustes, Calendario y avisos. Desactívalo allí cuando quieras.',
    formats: { reel: 'reel', carousel: 'carrusel', photo: 'post de foto', story: 'story' },
    tomorrow: { subject: (f) => (f ? `Mañana publicas: ${f}` : 'Mañana es día de publicar'), preview: 'Un aviso para mañana.', title: 'Mañana es uno de tus días de publicar', withPost: (f) => `Tu plan tiene un ${f} para mañana:` },
  },
  pt: {
    subject: (f) => (f ? `Hoje você posta: ${f}` : 'Hoje é dia de postar'), preview: 'Seu plano já tem o post de hoje.',
    title: 'Hoje é um dos seus dias de postar', withPost: (f) => `Seu plano tem um ${f} para hoje:`, noPost: 'Seu plano e ideias de legenda estão prontos no Studio.',
    button: 'Abrir seu plano', footer: 'Você recebe isto porque ativou o lembrete nos dias de postar em Você, Configurações, Calendário e lembretes. Desative lá quando quiser.',
    formats: { reel: 'reel', carousel: 'carrossel', photo: 'post de foto', story: 'story' },
    tomorrow: { subject: (f) => (f ? `Amanhã você posta: ${f}` : 'Amanhã é dia de postar'), preview: 'Um aviso para amanhã.', title: 'Amanhã é um dos seus dias de postar', withPost: (f) => `Seu plano tem um ${f} para amanhã:` },
  },
};

export const getPostingEmailContent = (locale: AppLocale): PostingEmailContent => posting[locale];
