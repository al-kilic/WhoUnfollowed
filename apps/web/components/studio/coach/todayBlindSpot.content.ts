import type { AppLocale } from '@/i18n/routing';
import type { Detector } from '@/lib/ai/blindSpots';

// The blind-spot card on Today: notice, the number, why it matters, one step.
// Params are numbers or 'YYYY-MM' dates only; `month` formats them.

type P = Record<string, number | string>;
type Line = (p: P, f: Fmt) => string;
export interface Fmt { n: (x: number | string | undefined) => string; month: (m: number | string | undefined) => string; age: (months: number | string | undefined) => string; times: (x: number | string | undefined) => string; format: (code: number | string | undefined) => string; day: (weekday: number | string | undefined) => string }
export interface SpotCopy { title: Line; why: Line; step: string }

export interface BlindSpotContent {
  lab: string; show: string; know: string; later: string; knowDone: string; laterDone: string; ask: string;
  spots: Record<Detector, SpotCopy>;
}

const en: BlindSpotContent = {
  lab: "Something you might not have noticed", show: 'Show me', know: 'I know', later: 'Not now', ask: 'Ask your coach about it',
  knowDone: "Got it. Your coach won't bring this up again.", laterDone: 'Okay. It can wait two weeks.',
  spots: {
    stale_pending: { title: (p, f) => `${f.n(p.count)} follow requests you sent have waited ${f.age(p.months)}.`, why: () => 'Old, unanswered requests make your account look spammy to the people you asked. Cancel the stale ones in a few minutes.', step: 'See the list' },
    posting_below_plan: { title: (p, f) => `You posted ${f.times(p.posted)} in 4 weeks. Your plan had ${f.n(p.planned)}.`, why: () => 'Growth follows the days you actually show up. One fewer posting day you can keep beats three you skip.', step: 'Adjust my plan' },
    goal_pace_drift: { title: (p, f) => `You need about ${f.n(p.needed)} new followers a week for your goal. You're getting ${f.n(p.soFar)}.`, why: () => 'At this pace the date slips. Move the date, or add one posting day that has worked before.', step: 'Review my goal' },
    follow_back_drop: { title: (p, f) => `Only ${f.n(p.now)}% of the accounts you followed this year follow you back. Last year it was ${f.n(p.before)}%.`, why: () => 'You may be following outside your audience. The ones who never followed back are worth a look.', step: 'See who' },
    spree_didnt_work: { title: (p, f) => `In one week (${f.month(p.date)}) you followed ${f.n(p.count)} accounts. ${f.n(p.followedBack)} followed back.`, why: () => 'Follow sprees rarely pay off and can look like spam. Those one-way follows are easy to clean up.', step: 'Clean them up' },
    quiet_season: { title: (p, f) => `${f.month(p.month)} has been your quietest month two years running.`, why: () => 'Plan lighter, evergreen posts for it now, so a slow month does not become a silent one.', step: 'Plan ahead' },
    best_month_unexplained: { title: (p, f) => `${f.month(p.month)} was your best month: +${f.n(p.count)} followers.`, why: () => 'Nobody has asked what you did differently. Tell your coach what you posted then, and it can plan more of it.', step: 'Tell your coach' },
    results_never_logged: { title: (p, f) => `You marked ${f.n(p.posted)} posts as posted, with no results yet.`, why: () => 'Add new followers or saves to a few. That is how your coach learns what works for you.', step: 'Add results' },
    stale_numbers: { title: (p, f) => `Your latest export is ${f.n(p.days)} days old.`, why: () => 'Who left and what changed since then is still unknown. A fresh export takes a few minutes to request.', step: 'Get a fresh export' },
    current_gap: { title: (p, f) => `It has been ${f.n(p.days)} days since your last post. You usually post every ${f.n(p.usual)} days.`, why: () => 'The longer the pause, the more of your audience forgets to look for you. One simple post this week restarts the rhythm.', step: 'Plan this week' },
    winner_underused: { title: (p, f) => `${f.format(p.format)} bring you ${f.n(p.times)}x more followers per post, yet they are only ${f.n(p.share)}% of what you posted lately.`, why: () => 'You already know what works for your account. Making it a regular slot is the fastest win you have.', step: 'Add it to my plan' },
    mutuals_lost_twice: { title: (p, f) => `${f.n(p.count)} people you follow each other with left since your last export, after ${f.n(p.before)} the time before.`, why: () => 'Losing mutuals twice in a row usually means something changed in what you post or how often. Worth a look at who.', step: 'See who' },
    no_cta: { title: (p, f) => `Only ${f.n(p.pct)}% of your last ${f.n(p.captions)} captions ask a question or invite a reply.`, why: () => 'A short question at the end is the easiest way to get comments, and comments help new people find you.', step: 'Check my next caption' },
    weekday_mismatch: { title: (p, f) => `${f.n(p.pct)}% of your followers found you on a ${f.day(p.weekday)}, a day you never post.`, why: () => 'Your audience is already around that day. Moving one post there costs nothing to try.', step: 'Try it in my plan' },
    format_never_tried: { title: (p, f) => `Not one ${p.format === 3 ? 'Reel' : 'carousel'} in your last ${f.n(p.posts)} posts, a whole year.`, why: () => 'Each format reaches people in a different way. One small test shows you whether it works for your account.', step: 'Plan one' },
    story_reach_drop: { title: (p, f) => `Your stories reach about ${f.n(p.now)} people now. Earlier this year it was ${f.n(p.before)}.`, why: () => 'Fewer people see your stories, so fewer remember to visit your posts. A question sticker or a behind-the-scenes clip usually brings viewers back.', step: 'Get story ideas' },
    reach_stays_home: { title: (p, f) => `Only ${f.n(p.pct)}% of the ${f.n(p.reached)} accounts you reached don't follow you yet.`, why: () => 'Your posts mostly reach people who already know you. New followers come from posts that get shared or saved, so aim one post a week at that.', step: 'Get ideas' },
    drifted_from_winner: { title: (p, f) => (Number(p.kind) === 1 ? `Your last 5 captions run about ${f.n(p.recentChars)} characters. On your best-reached posts it was ${f.n(p.winnerChars)}.` : `Your last 5 posts use about ${f.n(p.recentTags)} hashtags. Your best-reached posts used ${f.n(p.winnerTags)}.`), why: () => 'Your writing has moved away from what your best posts had in common. Try one post the old way and compare.', step: 'Check my next caption' },
    near_following_cap: { title: (p, f) => `You can follow only ${f.n(p.left)} more accounts before Instagram's limit of ${f.n(p.cap)}.`, why: (p, f) => `At the limit you can't follow anyone new. ${f.n(p.oneWay)} of the accounts you follow don't follow you back, so there is room to clear.`, step: 'See who' },
  },
};

const es: BlindSpotContent = {
  lab: 'Algo que quizá no notaste', show: 'Muéstramelo', know: 'Ya lo sé', later: 'Ahora no', ask: 'Pregúntale a tu coach',
  knowDone: 'Entendido. Tu coach no volverá a sacarlo.', laterDone: 'Vale. Puede esperar dos semanas.',
  spots: {
    stale_pending: { title: (p, f) => `${f.n(p.count)} solicitudes que enviaste llevan ${f.age(p.months)} esperando.`, why: () => 'Las solicitudes viejas sin respuesta hacen que tu cuenta parezca spam. Cancela las antiguas en unos minutos.', step: 'Ver la lista' },
    posting_below_plan: { title: (p, f) => `Publicaste ${f.times(p.posted)} en 4 semanas. Tu plan tenía ${f.n(p.planned)}.`, why: () => 'Creces en los días que de verdad publicas. Un día menos que cumples vale más que tres que te saltas.', step: 'Ajustar mi plan' },
    goal_pace_drift: { title: (p, f) => `Necesitas unos ${f.n(p.needed)} seguidores nuevos por semana para tu meta. Llevas ${f.n(p.soFar)}.`, why: () => 'A este ritmo la fecha se escapa. Muévela o añade un día de publicación que ya te funcionó.', step: 'Revisar mi meta' },
    follow_back_drop: { title: (p, f) => `Solo el ${f.n(p.now)}% de las cuentas que seguiste este año te sigue de vuelta. El año pasado era el ${f.n(p.before)}%.`, why: () => 'Quizá sigues fuera de tu público. Merece la pena mirar quién nunca te siguió de vuelta.', step: 'Ver quiénes' },
    spree_didnt_work: { title: (p, f) => `En una semana (${f.month(p.date)}) seguiste ${f.n(p.count)} cuentas. ${f.n(p.followedBack)} te siguieron de vuelta.`, why: () => 'Seguir en masa rara vez funciona y puede parecer spam. Esos seguimientos de una sola vía son fáciles de limpiar.', step: 'Limpiarlos' },
    quiet_season: { title: (p, f) => `${f.month(p.month)} ha sido tu mes más tranquilo dos años seguidos.`, why: () => 'Planifica ya posts más ligeros y atemporales para ese mes, para que un mes lento no sea un mes en silencio.', step: 'Planificar' },
    best_month_unexplained: { title: (p, f) => `${f.month(p.month)} fue tu mejor mes: +${f.n(p.count)} seguidores.`, why: () => 'Nadie te ha preguntado qué hiciste distinto. Cuéntale a tu coach qué publicaste y podrá planificar más de eso.', step: 'Contárselo al coach' },
    results_never_logged: { title: (p, f) => `Marcaste ${f.n(p.posted)} posts como publicados, aún sin resultados.`, why: () => 'Añade seguidores nuevos o guardados a algunos. Así tu coach aprende qué te funciona.', step: 'Añadir resultados' },
    stale_numbers: { title: (p, f) => `Tu última exportación tiene ${f.n(p.days)} días.`, why: () => 'Quién se fue y qué cambió desde entonces sigue sin saberse. Pedir una nueva lleva unos minutos.', step: 'Pedir una nueva' },
    current_gap: { title: (p, f) => `Han pasado ${f.n(p.days)} días desde tu última publicación. Sueles publicar cada ${f.n(p.usual)} días.`, why: () => 'Cuanto más larga la pausa, más gente de tu público se olvida de buscarte. Una publicación sencilla esta semana recupera el ritmo.', step: 'Planificar esta semana' },
    winner_underused: { title: (p, f) => `${f.format(p.format)} te traen ${f.n(p.times)}x más seguidores por publicación, pero son solo el ${f.n(p.share)}% de lo que publicaste últimamente.`, why: () => 'Ya sabes qué funciona en tu cuenta. Darle un hueco fijo es la mejora más rápida que tienes.', step: 'Añadirlo a mi plan' },
    mutuals_lost_twice: { title: (p, f) => `${f.n(p.count)} personas que os seguíais se fueron desde tu última exportación, después de ${f.n(p.before)} la vez anterior.`, why: () => 'Perder seguidores mutuos dos veces seguidas suele indicar un cambio en qué o cuánto publicas. Merece la pena mirar quiénes.', step: 'Ver quiénes' },
    no_cta: { title: (p, f) => `Solo el ${f.n(p.pct)}% de tus últimos ${f.n(p.captions)} textos hace una pregunta o invita a responder.`, why: () => 'Una pregunta corta al final es la forma más fácil de conseguir comentarios, y los comentarios ayudan a que te encuentren.', step: 'Revisar mi próximo texto' },
    weekday_mismatch: { title: (p, f) => `El ${f.n(p.pct)}% de tus seguidores te encontró un ${f.day(p.weekday)}, un día en que nunca publicas.`, why: () => 'Tu público ya está activo ese día. Mover una publicación allí no cuesta nada probarlo.', step: 'Probarlo en mi plan' },
    format_never_tried: { title: (p, f) => `Ni un ${p.format === 3 ? 'Reel' : 'carrusel'} en tus últimas ${f.n(p.posts)} publicaciones, en todo un año.`, why: () => 'Cada formato llega a la gente de una forma distinta. Una prueba pequeña te dice si funciona en tu cuenta.', step: 'Planificar uno' },
    story_reach_drop: { title: (p, f) => `Tus historias llegan ahora a unas ${f.n(p.now)} personas. A principios de año eran ${f.n(p.before)}.`, why: () => 'Si menos gente ve tus historias, menos gente se acuerda de ver tus publicaciones. Un sticker de pregunta o un vídeo del proceso suele traer espectadores de vuelta.', step: 'Ideas para historias' },
    reach_stays_home: { title: (p, f) => `Solo el ${f.n(p.pct)}% de las ${f.n(p.reached)} cuentas a las que llegaste aún no te sigue.`, why: () => 'Tus publicaciones llegan sobre todo a gente que ya te conoce. Los seguidores nuevos llegan con publicaciones que se comparten o se guardan, así que dedica una a la semana a eso.', step: 'Ver ideas' },
    drifted_from_winner: { title: (p, f) => (Number(p.kind) === 1 ? `Tus últimos 5 textos tienen unos ${f.n(p.recentChars)} caracteres. En tus publicaciones con más alcance eran ${f.n(p.winnerChars)}.` : `Tus últimas 5 publicaciones usan unos ${f.n(p.recentTags)} hashtags. Las de más alcance usaban ${f.n(p.winnerTags)}.`), why: () => 'Tu forma de escribir se alejó de lo que tenían en común tus mejores publicaciones. Prueba una como antes y compara.', step: 'Revisar mi próximo texto' },
    near_following_cap: { title: (p, f) => `Solo puedes seguir ${f.n(p.left)} cuentas más antes del límite de ${f.n(p.cap)} de Instagram.`, why: (p, f) => `En el límite ya no puedes seguir a nadie nuevo. ${f.n(p.oneWay)} de las cuentas que sigues no te siguen, así que hay espacio para limpiar.`, step: 'Ver quiénes' },
  },
};

const pt: BlindSpotContent = {
  lab: 'Algo que talvez você não percebeu', show: 'Me mostre', know: 'Já sei', later: 'Agora não', ask: 'Pergunte ao seu coach',
  knowDone: 'Entendido. Seu coach não vai tocar nisso de novo.', laterDone: 'Ok. Pode esperar duas semanas.',
  spots: {
    stale_pending: { title: (p, f) => `${f.n(p.count)} solicitações que você enviou esperam há ${f.age(p.months)}.`, why: () => 'Solicitações antigas sem resposta deixam sua conta com cara de spam. Cancele as velhas em poucos minutos.', step: 'Ver a lista' },
    posting_below_plan: { title: (p, f) => `Você postou ${f.times(p.posted)} em 4 semanas. Seu plano tinha ${f.n(p.planned)}.`, why: () => 'Você cresce nos dias em que realmente aparece. Um dia a menos que você cumpre vale mais que três que pula.', step: 'Ajustar meu plano' },
    goal_pace_drift: { title: (p, f) => `Você precisa de uns ${f.n(p.needed)} seguidores novos por semana para sua meta. Está em ${f.n(p.soFar)}.`, why: () => 'Nesse ritmo a data escapa. Mude a data ou some um dia de postagem que já funcionou.', step: 'Rever minha meta' },
    follow_back_drop: { title: (p, f) => `Só ${f.n(p.now)}% das contas que você seguiu este ano seguem de volta. Ano passado eram ${f.n(p.before)}%.`, why: () => 'Talvez você esteja seguindo fora do seu público. Vale olhar quem nunca seguiu de volta.', step: 'Ver quem' },
    spree_didnt_work: { title: (p, f) => `Em uma semana (${f.month(p.date)}) você seguiu ${f.n(p.count)} contas. ${f.n(p.followedBack)} seguiram de volta.`, why: () => 'Seguir em massa quase nunca funciona e pode parecer spam. Esses seguimentos de mão única são fáceis de limpar.', step: 'Limpar' },
    quiet_season: { title: (p, f) => `${f.month(p.month)} foi seu mês mais calmo dois anos seguidos.`, why: () => 'Planeje agora posts mais leves e atemporais para ele, para um mês lento não virar um mês em silêncio.', step: 'Planejar' },
    best_month_unexplained: { title: (p, f) => `${f.month(p.month)} foi seu melhor mês: +${f.n(p.count)} seguidores.`, why: () => 'Ninguém perguntou o que você fez de diferente. Conte ao seu coach o que postou e ele planeja mais disso.', step: 'Contar ao coach' },
    results_never_logged: { title: (p, f) => `Você marcou ${f.n(p.posted)} posts como postados, ainda sem resultados.`, why: () => 'Adicione seguidores novos ou salvamentos em alguns. É assim que seu coach aprende o que funciona para você.', step: 'Adicionar resultados' },
    stale_numbers: { title: (p, f) => `Sua última exportação tem ${f.n(p.days)} dias.`, why: () => 'Quem saiu e o que mudou desde então ainda é um mistério. Pedir uma nova leva poucos minutos.', step: 'Pedir uma nova' },
    current_gap: { title: (p, f) => `Faz ${f.n(p.days)} dias desde seu último post. Você costuma postar a cada ${f.n(p.usual)} dias.`, why: () => 'Quanto mais longa a pausa, mais gente do seu público esquece de procurar você. Um post simples esta semana retoma o ritmo.', step: 'Planejar esta semana' },
    winner_underused: { title: (p, f) => `${f.format(p.format)} trazem ${f.n(p.times)}x mais seguidores por post, mas são só ${f.n(p.share)}% do que você postou ultimamente.`, why: () => 'Você já sabe o que funciona na sua conta. Dar a isso um espaço fixo é a vitória mais rápida que você tem.', step: 'Pôr no meu plano' },
    mutuals_lost_twice: { title: (p, f) => `${f.n(p.count)} pessoas que se seguiam com você saíram desde a última exportação, depois de ${f.n(p.before)} na vez anterior.`, why: () => 'Perder seguidores mútuos duas vezes seguidas costuma indicar mudança no que ou no quanto você posta. Vale ver quem.', step: 'Ver quem' },
    no_cta: { title: (p, f) => `Só ${f.n(p.pct)}% das suas últimas ${f.n(p.captions)} legendas fazem uma pergunta ou convidam a responder.`, why: () => 'Uma pergunta curta no fim é o jeito mais fácil de ganhar comentários, e comentários ajudam novas pessoas a te achar.', step: 'Revisar minha próxima legenda' },
    weekday_mismatch: { title: (p, f) => `${f.n(p.pct)}% dos seus seguidores te acharam numa ${f.day(p.weekday)}, um dia em que você nunca posta.`, why: () => 'Seu público já está por aí nesse dia. Mover um post para lá não custa nada testar.', step: 'Testar no meu plano' },
    format_never_tried: { title: (p, f) => `Nenhum ${p.format === 3 ? 'Reel' : 'carrossel'} nos seus últimos ${f.n(p.posts)} posts, um ano inteiro.`, why: () => 'Cada formato chega às pessoas de um jeito diferente. Um teste pequeno mostra se funciona na sua conta.', step: 'Planejar um' },
    story_reach_drop: { title: (p, f) => `Seus stories alcançam umas ${f.n(p.now)} pessoas agora. No começo do ano eram ${f.n(p.before)}.`, why: () => 'Menos gente vendo seus stories significa menos gente lembrando de ver seus posts. Uma caixinha de pergunta ou um bastidor costuma trazer quem assiste de volta.', step: 'Ideias de stories' },
    reach_stays_home: { title: (p, f) => `Só ${f.n(p.pct)}% das ${f.n(p.reached)} contas que você alcançou ainda não te seguem.`, why: () => 'Seus posts chegam mais a quem já te conhece. Seguidores novos vêm de posts que são compartilhados ou salvos, então dedique um por semana a isso.', step: 'Ver ideias' },
    drifted_from_winner: { title: (p, f) => (Number(p.kind) === 1 ? `Suas últimas 5 legendas têm uns ${f.n(p.recentChars)} caracteres. Nos posts com mais alcance eram ${f.n(p.winnerChars)}.` : `Seus últimos 5 posts usam uns ${f.n(p.recentTags)} hashtags. Os de mais alcance usavam ${f.n(p.winnerTags)}.`), why: () => 'Seu jeito de escrever se afastou do que seus melhores posts tinham em comum. Teste um do jeito antigo e compare.', step: 'Revisar minha próxima legenda' },
    near_following_cap: { title: (p, f) => `Você só pode seguir mais ${f.n(p.left)} contas antes do limite de ${f.n(p.cap)} do Instagram.`, why: (p, f) => `No limite você não consegue seguir mais ninguém. ${f.n(p.oneWay)} das contas que você segue não te seguem de volta, então há espaço para limpar.`, step: 'Ver quem' },
  },
};

const ALL: Record<AppLocale, BlindSpotContent> = { en, es, pt };
export const getBlindSpotContent = (l: AppLocale): BlindSpotContent => ALL[l] ?? en;

const AGE: Record<AppLocale, { y: (n: number) => string; m: (n: number) => string }> = {
  en: { y: (n) => `${n}+ ${n === 1 ? 'year' : 'years'}`, m: (n) => `${n}+ ${n === 1 ? 'month' : 'months'}` },
  es: { y: (n) => `${n}+ ${n === 1 ? 'año' : 'años'}`, m: (n) => `${n}+ ${n === 1 ? 'mes' : 'meses'}` },
  pt: { y: (n) => `${n}+ ${n === 1 ? 'ano' : 'anos'}`, m: (n) => `${n}+ ${n === 1 ? 'mês' : 'meses'}` },
};
const FORMATS: Record<AppLocale, string[]> = {
  en: ['', 'Single photos', 'Carousels', 'Reels', 'Videos'],
  es: ['', 'Las fotos sueltas', 'Los carruseles', 'Los Reels', 'Los videos'],
  pt: ['', 'As fotos únicas', 'Os carrosséis', 'Os Reels', 'Os vídeos'],
};
const TIMES: Record<AppLocale, (n: number) => string> = {
  en: (n) => (n === 1 ? 'once' : `${n} times`),
  es: (n) => `${n} ${n === 1 ? 'vez' : 'veces'}`,
  pt: (n) => `${n} ${n === 1 ? 'vez' : 'vezes'}`,
};

export function blindSpotFmt(locale: AppLocale): Fmt {
  const a = AGE[locale] ?? AGE.en, t = TIMES[locale] ?? TIMES.en;
  return {
    n: (x) => (typeof x === 'number' ? x.toLocaleString(locale) : String(x ?? '')),
    age: (m) => { const n = Number(m) || 0; return n >= 24 ? a.y(Math.floor(n / 12)) : a.m(n); },
    times: (x) => t(Number(x) || 0),
    format: (code) => (FORMATS[locale] ?? FORMATS.en)[Number(code) || 0] ?? '',
    // 0 = Monday, as the export facts count it.
    day: (w) => new Intl.DateTimeFormat(locale, { weekday: 'long', timeZone: 'UTC' }).format(new Date(Date.UTC(2024, 0, 1 + (Number(w) || 0)))),
    month: (m) => {
      if (typeof m === 'number') return new Intl.DateTimeFormat(locale, { month: 'long', timeZone: 'UTC' }).format(new Date(Date.UTC(2024, m - 1, 1)));
      if (typeof m === 'string' && /^\d{4}-\d{2}/.test(m)) {
        const [y, mo, d] = m.split('-').map(Number);
        const date = new Date(Date.UTC(y!, mo! - 1, d ?? 1));
        return new Intl.DateTimeFormat(locale, d ? { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' } : { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);
      }
      return '';
    },
  };
}
