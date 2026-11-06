import type { CuriosityId } from '@ig-tracker/core';
import type { AppLocale } from '@/i18n/routing';

// Copy for the redesigned Radar page: the cover, curiosities, section heads
// and the radar sweep. {placeholders} are filled by `fill`. No em dashes.
export interface RadarPageContent {
  nav: { label: string; overview: string; curiosities: string; verdict: string; radar: string; data: string };
  cover: {
    eyebrow: (app: string, date: string) => string;
    headline: (followers: string) => string;
    sub: (pct: number, oneWay: string) => string;
    ribbonLabel: string;
    mutuals: string; oneWay: string; fans: string;
    ribbonAria: (mutuals: string, oneWay: string, fans: string) => string;
    youAre: string;
    toFix: (n: number) => string;
    allClear: string;
    sinceLast: string;
    firstExport: string;
    followingCount: (n: string) => string;
  };
  sections: {
    curiosities: { kicker: string; title: string; sub: string };
    verdict: { kicker: string; title: string; sub: string };
    radar: { kicker: string; title: string; sub: string };
    data: { kicker: string; title: string; sub: string };
  };
  curiosities: Record<CuriosityId, { label: string; value: string; line: string }>;
  noCuriosities: string;
  sweep: {
    aria: (n: number) => string;
    top: string;
    impact: string;
    legendHigh: string; legendMid: string; legendLow: string;
  };
}

const en: RadarPageContent = {
  nav: { label: 'Jump to section', overview: 'Overview', curiosities: 'Curiosities', verdict: 'Verdict', radar: 'Radar', data: 'Data' },
  cover: {
    eyebrow: (app, date) => `Field report · ${app} · ${date}`,
    headline: f => `${f} people follow you.`,
    sub: (pct, oneWay) => `${pct}% of the accounts you follow follow you back. ${oneWay} don't.`,
    ribbonLabel: 'Who is who',
    mutuals: 'Mutuals', oneWay: 'You follow, they don\'t', fans: 'Fans',
    ribbonAria: (m, o, f) => `${m} mutuals, ${o} you follow who don't follow back, ${f} fans you don't follow back`,
    youAre: 'You are',
    toFix: n => (n === 1 ? '1 thing to fix' : `${n} things to fix`),
    allClear: 'Nothing to fix',
    sinceLast: 'since last export',
    firstExport: 'First export',
    followingCount: n => `You follow ${n}`,
  },
  sections: {
    curiosities: { kicker: '01', title: 'Things you didn\'t know', sub: 'Pulled from the dates and numbers in your own export. Counts only.' },
    verdict: { kicker: '02', title: 'Your verdict', sub: 'One card that sums you up. Sized for a story, with no usernames on it.' },
    radar: { kicker: '03', title: 'The radar', sub: 'Every fixable pattern, ranked. The closer to the center, the bigger the impact.' },
    data: { kicker: '04', title: 'The full picture', sub: 'Every chart and list behind the summary.' },
  },
  curiosities: {
    since_last: { label: 'Since last export', value: '{netSigned}', line: '{gained} new, {lost} gone.' },
    best_month: { label: 'Best month', value: '{monthName}', line: '{count} of today\'s followers found you that month.' },
    arrival_weekday: { label: 'Favorite day', value: '{weekdayName}', line: '{pct}% of your followers arrived on a {weekdayName}.' },
    first_follower: { label: 'Longest-standing follower', value: '{year}', line: 'Someone has followed you since {date}. That is {years} years.' },
    longest_wait: { label: 'Longest wait', value: '{days} days', line: 'Your oldest unanswered follow. {count} accounts never followed back in total.' },
    recent_share: { label: 'New faces', value: '{pct}%', line: 'of your followers arrived in the last 12 months ({count}).' },
    follow_spree: { label: 'Biggest follow spree', value: '{count}', line: 'accounts followed in one day, on {date}.' },
    fans: { label: 'Fan club', value: '{count}', line: 'people follow you that you don\'t follow back ({pct}% of followers).' },
  },
  noCuriosities: 'This export has no follow dates, so there is less to dig up. JSON exports have them.',
  sweep: {
    aria: n => `Radar with ${n} findings, plotted by impact`,
    top: 'Start here',
    impact: 'Impact',
    legendHigh: 'High', legendMid: 'Medium', legendLow: 'Low',
  },
};

const es: RadarPageContent = {
  nav: { label: 'Ir a la sección', overview: 'Resumen', curiosities: 'Curiosidades', verdict: 'Veredicto', radar: 'Radar', data: 'Datos' },
  cover: {
    eyebrow: (app, date) => `Informe de campo · ${app} · ${date}`,
    headline: f => `${f} personas te siguen.`,
    sub: (pct, oneWay) => `El ${pct}% de las cuentas que sigues te sigue de vuelta. ${oneWay} no.`,
    ribbonLabel: 'Quién es quién',
    mutuals: 'Mutuos', oneWay: 'Las sigues, no te siguen', fans: 'Fans',
    ribbonAria: (m, o, f) => `${m} mutuos, ${o} que sigues y no te siguen, ${f} fans que no sigues`,
    youAre: 'Eres',
    toFix: n => (n === 1 ? '1 cosa que arreglar' : `${n} cosas que arreglar`),
    allClear: 'Nada que arreglar',
    sinceLast: 'desde la última exportación',
    firstExport: 'Primera exportación',
    followingCount: n => `Sigues a ${n}`,
  },
  sections: {
    curiosities: { kicker: '01', title: 'Cosas que no sabías', sub: 'Sacadas de las fechas y números de tu propia exportación. Solo cifras.' },
    verdict: { kicker: '02', title: 'Tu veredicto', sub: 'Una tarjeta que te resume. Del tamaño de una historia, sin nombres de usuario.' },
    radar: { kicker: '03', title: 'El radar', sub: 'Cada patrón que se puede arreglar, en orden. Cuanto más al centro, más impacto.' },
    data: { kicker: '04', title: 'El panorama completo', sub: 'Todos los gráficos y listas detrás del resumen.' },
  },
  curiosities: {
    since_last: { label: 'Desde la última exportación', value: '{netSigned}', line: '{gained} nuevos, {lost} se fueron.' },
    best_month: { label: 'Mejor mes', value: '{monthName}', line: '{count} de tus seguidores actuales te encontraron ese mes.' },
    arrival_weekday: { label: 'Día favorito', value: '{weekdayName}', line: 'El {pct}% de tus seguidores llegó un {weekdayName}.' },
    first_follower: { label: 'Seguidor más antiguo', value: '{year}', line: 'Alguien te sigue desde el {date}. Son {years} años.' },
    longest_wait: { label: 'Espera más larga', value: '{days} días', line: 'Tu follow sin respuesta más antiguo. En total, {count} cuentas nunca te siguieron.' },
    recent_share: { label: 'Caras nuevas', value: '{pct}%', line: 'de tus seguidores llegó en los últimos 12 meses ({count}).' },
    follow_spree: { label: 'Mayor racha de follows', value: '{count}', line: 'cuentas seguidas en un día, el {date}.' },
    fans: { label: 'Club de fans', value: '{count}', line: 'personas te siguen y no las sigues ({pct}% de tus seguidores).' },
  },
  noCuriosities: 'Esta exportación no trae fechas de seguimiento, así que hay menos que descubrir. Las exportaciones JSON sí las traen.',
  sweep: {
    aria: n => `Radar con ${n} hallazgos, según su impacto`,
    top: 'Empieza aquí',
    impact: 'Impacto',
    legendHigh: 'Alto', legendMid: 'Medio', legendLow: 'Bajo',
  },
};

const pt: RadarPageContent = {
  nav: { label: 'Ir para a seção', overview: 'Resumo', curiosities: 'Curiosidades', verdict: 'Veredito', radar: 'Radar', data: 'Dados' },
  cover: {
    eyebrow: (app, date) => `Relatório de campo · ${app} · ${date}`,
    headline: f => `${f} pessoas te seguem.`,
    sub: (pct, oneWay) => `${pct}% das contas que você segue te seguem de volta. ${oneWay} não.`,
    ribbonLabel: 'Quem é quem',
    mutuals: 'Mútuos', oneWay: 'Você segue, não te seguem', fans: 'Fãs',
    ribbonAria: (m, o, f) => `${m} mútuos, ${o} que você segue e não te seguem, ${f} fãs que você não segue`,
    youAre: 'Você é',
    toFix: n => (n === 1 ? '1 coisa para arrumar' : `${n} coisas para arrumar`),
    allClear: 'Nada para arrumar',
    sinceLast: 'desde a última exportação',
    firstExport: 'Primeira exportação',
    followingCount: n => `Você segue ${n}`,
  },
  sections: {
    curiosities: { kicker: '01', title: 'Coisas que você não sabia', sub: 'Tiradas das datas e números da sua própria exportação. Só números.' },
    verdict: { kicker: '02', title: 'Seu veredito', sub: 'Um cartão que te resume. No tamanho de um story, sem nomes de usuário.' },
    radar: { kicker: '03', title: 'O radar', sub: 'Cada padrão que dá para arrumar, em ordem. Quanto mais perto do centro, maior o impacto.' },
    data: { kicker: '04', title: 'O quadro completo', sub: 'Todos os gráficos e listas por trás do resumo.' },
  },
  curiosities: {
    since_last: { label: 'Desde a última exportação', value: '{netSigned}', line: '{gained} novos, {lost} saíram.' },
    best_month: { label: 'Melhor mês', value: '{monthName}', line: '{count} dos seus seguidores atuais te acharam nesse mês.' },
    arrival_weekday: { label: 'Dia favorito', value: '{weekdayName}', line: '{pct}% dos seus seguidores chegaram nesse dia da semana.' },
    first_follower: { label: 'Seguidor mais antigo', value: '{year}', line: 'Alguém te segue desde {date}. São {years} anos.' },
    longest_wait: { label: 'Espera mais longa', value: '{days} dias', line: 'Seu follow sem resposta mais antigo. No total, {count} contas nunca te seguiram de volta.' },
    recent_share: { label: 'Rostos novos', value: '{pct}%', line: 'dos seus seguidores chegaram nos últimos 12 meses ({count}).' },
    follow_spree: { label: 'Maior maratona de follows', value: '{count}', line: 'contas seguidas em um dia, em {date}.' },
    fans: { label: 'Fã-clube', value: '{count}', line: 'pessoas te seguem e você não segue de volta ({pct}% dos seguidores).' },
  },
  noCuriosities: 'Esta exportação não tem datas de follow, então há menos para descobrir. Exportações em JSON têm.',
  sweep: {
    aria: n => `Radar com ${n} achados, pelo impacto`,
    top: 'Comece aqui',
    impact: 'Impacto',
    legendHigh: 'Alto', legendMid: 'Médio', legendLow: 'Baixo',
  },
};

const all: Record<AppLocale, RadarPageContent> = { en, es, pt };
export const getRadarPageContent = (locale: AppLocale) => all[locale];
