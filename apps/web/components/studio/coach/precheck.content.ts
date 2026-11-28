import type { AppLocale } from '@/i18n/routing';
import type { PrecheckId, PrecheckItem, PrecheckSource } from '@/lib/ai/precheck';

// Format names for the format-vs-results line (the rule passes the raw key).
const FMT_EN: Record<string, string> = { reel: 'Reels', carousel: 'Carousels', photo: 'Photos', story: 'Stories' };
const FMT_ES: Record<string, string> = { reel: 'Los Reels', carousel: 'Los carruseles', photo: 'Las fotos', story: 'Las Stories' };
const FMT_PT: Record<string, string> = { reel: 'Os Reels', carousel: 'Os carrosséis', photo: 'As fotos', story: 'Os Stories' };

// Copy for Check's rules counted in code. Each rule has a title and a line per
// state; the line reads the rule's numbers.
type P = PrecheckItem['params'];
export interface PrecheckContent {
  title: string; sub: string; free: string;
  sources: Record<PrecheckSource, string>;
  rules: Record<PrecheckId, { title: string; pass: (p: P) => string; warn: (p: P) => string; fail: (p: P) => string }>;
  days: string[];
  planDay: string; planned: (day: string) => string; noPlan: string; makePlan: string;
  nextDay: (day: string) => string;
}

const EN: PrecheckContent = {
  title: 'Quick check', sub: 'Updates as you type. Your coach builds on it.', free: 'Free for everyone.',
  sources: { past: 'Your past posts', settings: 'Your settings', platform: 'Platform guidance' },
  days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  rules: {
    hook_length: { title: 'Hook before "more"', pass: (p) => `${p.length} characters, all visible before "more" (about ${p.visible}).`, warn: (p) => `${p.length} characters: Instagram cuts it after about ${p.visible}.`, fail: () => 'Add a first line. It is what stops the scroll.' },
    caption_limit: { title: 'Caption length', pass: (p) => `${p.length} of ${p.max} characters.`, warn: () => 'No caption yet. Even one line helps people decide to stay.', fail: (p) => `${p.length} characters: over Instagram's limit of ${p.max}.` },
    question_cta: { title: 'A question or a call to action', pass: () => 'Asks something or tells people what to do next.', warn: () => 'Nothing invites a reply, a save or a share.', fail: () => '' },
    hashtags: { title: 'Hashtags', pass: (p) => `${p.count} hashtags: within the ${p.good} Instagram suggests.`, warn: (p) => `${p.count} hashtags: Instagram suggests ${p.good} at most.`, fail: (p) => `${p.count} hashtags: Instagram allows ${p.max}.` },
    posting_day: { title: 'Posting day', pass: () => 'Today is one of your posting days.', warn: () => '', fail: () => '' },
    format_results: { title: 'Format vs your results', pass: (p) => `This format is among your best: about +${p.bestAvg} followers a post.`, warn: (p) => (Number(p.mine) < 0 ? `No logged results for this format yet. ${FMT_EN[String(p.best)] ?? p.best} bring you about +${p.bestAvg} a post.` : `${FMT_EN[String(p.best)] ?? p.best} bring you more: about +${p.bestAvg} a post vs +${p.mine}.`), fail: () => '' },
  },
  nextDay: (d) => `Not one of your posting days. Your next one is ${d}.`,
  planDay: 'Put it on a plan day', planned: (d) => `On your plan for ${d}`, noPlan: 'No 30-day plan yet.', makePlan: 'Make a plan',
};

const ES: PrecheckContent = {
  title: 'Revisión rápida', sub: 'Se actualiza mientras escribes. Tu coach parte de aquí.', free: 'Gratis para todos.',
  sources: { past: 'Tus publicaciones', settings: 'Tus ajustes', platform: 'Guía de la plataforma' },
  days: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'],
  rules: {
    hook_length: { title: 'Gancho antes de "más"', pass: (p) => `${p.length} caracteres, todos visibles antes de "más" (unos ${p.visible}).`, warn: (p) => `${p.length} caracteres: Instagram lo corta tras unos ${p.visible}.`, fail: () => 'Añade una primera línea. Es lo que detiene el scroll.' },
    caption_limit: { title: 'Largo del texto', pass: (p) => `${p.length} de ${p.max} caracteres.`, warn: () => 'Aún no hay texto. Incluso una línea ayuda a que la gente se quede.', fail: (p) => `${p.length} caracteres: supera el límite de Instagram de ${p.max}.` },
    question_cta: { title: 'Una pregunta o llamada a la acción', pass: () => 'Pregunta algo o dice qué hacer después.', warn: () => 'Nada invita a responder, guardar o compartir.', fail: () => '' },
    hashtags: { title: 'Hashtags', pass: (p) => `${p.count} hashtags: dentro de los ${p.good} que sugiere Instagram.`, warn: (p) => `${p.count} hashtags: Instagram sugiere ${p.good} como máximo.`, fail: (p) => `${p.count} hashtags: Instagram permite ${p.max}.` },
    posting_day: { title: 'Día de publicación', pass: () => 'Hoy es uno de tus días de publicación.', warn: () => '', fail: () => '' },
    format_results: { title: 'Formato vs tus resultados', pass: (p) => `Este formato está entre los mejores: unos +${p.bestAvg} seguidores por publicación.`, warn: (p) => (Number(p.mine) < 0 ? `Aún no hay resultados de este formato. ${FMT_ES[String(p.best)] ?? p.best} te dan unos +${p.bestAvg} por publicación.` : `${FMT_ES[String(p.best)] ?? p.best} te dan más: unos +${p.bestAvg} por publicación frente a +${p.mine}.`), fail: () => '' },
  },
  nextDay: (d) => `Hoy no es uno de tus días de publicación. El próximo es el ${d}.`,
  planDay: 'Ponerlo en un día del plan', planned: (d) => `En tu plan para el ${d}`, noPlan: 'Aún no hay plan de 30 días.', makePlan: 'Crear un plan',
};

const PT: PrecheckContent = {
  title: 'Verificação rápida', sub: 'Atualiza enquanto você escreve. Seu coach parte daqui.', free: 'Grátis para todos.',
  sources: { past: 'Seus posts', settings: 'Suas configurações', platform: 'Orientação da plataforma' },
  days: ['segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado', 'domingo'],
  rules: {
    hook_length: { title: 'Gancho antes do "mais"', pass: (p) => `${p.length} caracteres, todos visíveis antes do "mais" (uns ${p.visible}).`, warn: (p) => `${p.length} caracteres: o Instagram corta depois de uns ${p.visible}.`, fail: () => 'Adicione uma primeira linha. É ela que para o scroll.' },
    caption_limit: { title: 'Tamanho da legenda', pass: (p) => `${p.length} de ${p.max} caracteres.`, warn: () => 'Ainda sem legenda. Até uma linha ajuda as pessoas a ficarem.', fail: (p) => `${p.length} caracteres: acima do limite do Instagram de ${p.max}.` },
    question_cta: { title: 'Uma pergunta ou chamada para ação', pass: () => 'Pergunta algo ou diz o que fazer em seguida.', warn: () => 'Nada convida a responder, salvar ou compartilhar.', fail: () => '' },
    hashtags: { title: 'Hashtags', pass: (p) => `${p.count} hashtags: dentro das ${p.good} que o Instagram sugere.`, warn: (p) => `${p.count} hashtags: o Instagram sugere no máximo ${p.good}.`, fail: (p) => `${p.count} hashtags: o Instagram permite ${p.max}.` },
    posting_day: { title: 'Dia de postar', pass: () => 'Hoje é um dos seus dias de postar.', warn: () => '', fail: () => '' },
    format_results: { title: 'Formato vs seus resultados', pass: (p) => `Este formato está entre os melhores: uns +${p.bestAvg} seguidores por post.`, warn: (p) => (Number(p.mine) < 0 ? `Ainda sem resultados deste formato. ${FMT_PT[String(p.best)] ?? p.best} trazem uns +${p.bestAvg} por post.` : `${FMT_PT[String(p.best)] ?? p.best} trazem mais: uns +${p.bestAvg} por post contra +${p.mine}.`), fail: () => '' },
  },
  nextDay: (d) => `Hoje não é um dos seus dias de postar. O próximo é ${d}.`,
  planDay: 'Colocar num dia do plano', planned: (d) => `No seu plano para ${d}`, noPlan: 'Ainda sem plano de 30 dias.', makePlan: 'Criar um plano',
};

export function getPrecheckContent(locale: AppLocale): PrecheckContent {
  return locale === 'es' ? ES : locale === 'pt' ? PT : EN;
}
