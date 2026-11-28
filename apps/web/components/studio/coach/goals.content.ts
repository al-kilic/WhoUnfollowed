import type { AppLocale } from '@/i18n/routing';
import type { GoalStatus } from '@/lib/ai/goalMath';

export interface GoalsContent {
  sub: string;
  target: string;
  by: string;
  byHelp: string;
  cadence: string;
  cadences: { weekly: string; biweekly: string; monthly: string; off: string };
  cadenceHelp: string;
  save: string;
  saved: string;
  noExport: string;
  progress: string;
  of: (current: string, target: string) => string;
  gained: (n: string) => string;
  left: (n: string) => string;
  needed: (n: string) => string;
  soFar: (n: string) => string;
  status: Record<GoalStatus, string>;
  catchUp: string;
  tiles: { gained: string; left: string; soFar: string; needed: string };
  example: string;
  g: {
    pace: string; you: string; atPace: string; neededL: string; nowL: string; neededK: string; etaK: string; aDay: string;
    yourGoal: string; byDate: (t: string, d: string) => string; noDate: (t: string) => string; toGo: (left: string, days: number | null) => string;
    changeGoal: string; setGoal: string; checkins: string; checkinsBody: string; start: string; next: string;
    nextOn: (d: string) => string; noReminders: string; thExport: string; thFollowers: string; thChange: string;
    noGoalTitle: string; noGoalBody: string; goalWord: string; noData: string; never: string;
  };
  // Goals per platform.
  p: {
    switcher: string; noGoalFor: (app: string) => string; noGoalForBody: (app: string) => string; setFor: (app: string) => string;
    remove: string; removeConfirm: (app: string) => string; keep: string; yourGoals: string; noExportYet: string; checkinsAll: string;
  };
  o: {
    goalType: string; types: Record<'followers' | 'posts_week' | 'per_post', string>; typeHelp: Record<'followers' | 'posts_week' | 'per_post', string>;
    targetL: Record<'followers' | 'posts_week' | 'per_post', string>;
    byQuick: { endMonth: string; m3: string; m6: string; none: string };
    note: string; notePh: string; noteHelp: string;
    neededWeek: (n: string) => string; reachIt: string;
    on: string; weekdays: string[]; anyDay: string; deadlineReminder: string; deadlineHelp: string;
    statusShort: Record<GoalStatus, string>;
    habitNow: Record<'posts_week' | 'per_post', (c: string, t: string) => string>;
    habitHelp: string; openPosted: string; thisWeek: string; recent: string;
  };
}

const EN: GoalsContent = {
  sub: 'Set a follower goal and see your progress every time you upload an export.',
  target: 'Follower goal',
  by: 'By (optional)',
  byHelp: 'With a date, you also see the weekly pace you need.',
  cadence: 'Check-in emails',
  cadences: { weekly: 'Weekly', biweekly: 'Every 2 weeks', monthly: 'Monthly', off: 'Off' },
  cadenceHelp: 'A short email with your progress and a reminder to upload a new export. Off unless you turn it on.',
  save: 'Save goal',
  saved: 'Saved',
  noExport: 'Upload an export first, so your goal starts from your real follower count.',
  progress: 'Progress',
  of: (c, t) => `${c} of ${t} followers`,
  gained: (n) => `${n} since you set the goal`,
  left: (n) => `${n} to go`,
  needed: (n) => `${n} a week needed`,
  soFar: (n) => `${n} a week so far`,
  status: {
    done: 'Goal reached.',
    ahead: 'Ahead of pace.',
    on_track: 'On track.',
    behind: 'Behind pace.',
    no_deadline: 'No date set, so there is no pace to keep.',
    no_data: 'Upload a new export to see your first progress.',
  },
  catchUp: 'Plan posts to catch up',
  tiles: { gained: 'Since you set it', left: 'To go', soFar: 'Per week so far', needed: 'Per week needed' },
  example: '2,100 of 3,000 followers. 25 a week so far, 42 a week needed.',
  g: {
    pace: 'Pace', you: 'You', atPace: 'At this pace', neededL: 'Needed', nowL: 'Now', neededK: 'Needed', etaK: 'At this pace', aDay: 'a day',
    yourGoal: 'Your goal', byDate: (t, d) => `${t} followers by ${d}`, noDate: (t) => `${t} followers`, toGo: (l, d) => `${l} to go${d !== null ? ` · ${d} days left` : ''}`,
    changeGoal: 'Change goal', setGoal: 'Set your goal', checkins: 'Check-ins', checkinsBody: 'Each check-in is a new export. Your goal updates every time you upload one.', start: 'Start', next: 'Next',
    nextOn: (d) => `Next: we email you on ${d} to download a new export and check in.`, noReminders: 'No reminders. Check in whenever you upload a new export.',
    thExport: 'Export', thFollowers: 'Followers', thChange: 'Change',
    noGoalTitle: 'No goal yet', noGoalBody: 'Pick a follower number and, if you like, a date. Every new export then shows how you are doing.', goalWord: 'Goal', noData: 'Upload a new export to see your pace.', never: 'Not at this pace',
  },
  p: {
    switcher: 'Platform', noGoalFor: (a) => `No ${a} goal yet`, noGoalForBody: (a) => `Each platform has its own goal. Pick a number for ${a} and, if you like, a date. Every new ${a} export shows how you are doing.`, setFor: (a) => `Set a ${a} goal`,
    remove: 'Remove goal', removeConfirm: (a) => `Remove your ${a} goal? Your other goals stay.`, keep: 'Keep it', yourGoals: 'Your goals', noExportYet: 'no export yet', checkinsAll: 'One check-in email covers all your goals.',
  },
  o: {
    goalType: 'Goal', types: { followers: 'Followers', posts_week: 'Posts a week', per_post: 'Followers per post' },
    typeHelp: { followers: 'Reach a follower count, by a date if you like.', posts_week: 'Build a posting habit. Counted from Plan, Posted.', per_post: 'Grow how many new followers each post brings, from the results you add.' },
    targetL: { followers: 'Follower goal', posts_week: 'Posts a week', per_post: 'New followers per post' },
    byQuick: { endMonth: 'End of month', m3: 'In 3 months', m6: 'In 6 months', none: 'No date' },
    note: 'Why this goal? (optional)', notePh: 'Brand deals, selling prints, a trip series...', noteHelp: 'Your coach sees this and plans around it.',
    neededWeek: (n) => `${n} new followers a week needed`, reachIt: 'Reached already',
    on: 'Send on', weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], anyDay: 'Any day', deadlineReminder: 'Remind me a week before my deadline', deadlineHelp: 'One email, 7 days before the date you picked.',
    statusShort: { done: 'Reached', ahead: 'Ahead', on_track: 'On track', behind: 'Behind', no_deadline: 'No date', no_data: 'No data yet' },
    habitNow: { posts_week: (c, t) => `${c} of ${t} posts`, per_post: (c, t) => `${c} of ${t} per post` },
    habitHelp: 'Counted from the posts you mark as posted and the results you add.', openPosted: 'Open Posted', thisWeek: 'Last 7 days', recent: 'Average of your latest 5 results',
  },
};

const ES: GoalsContent = {
  sub: 'Fija un objetivo de seguidores y mira tu progreso cada vez que subas una exportación.',
  target: 'Objetivo de seguidores',
  by: 'Para (opcional)',
  byHelp: 'Con una fecha también ves el ritmo semanal que necesitas.',
  cadence: 'Correos de seguimiento',
  cadences: { weekly: 'Semanal', biweekly: 'Cada 2 semanas', monthly: 'Mensual', off: 'Desactivado' },
  cadenceHelp: 'Un correo breve con tu progreso y un recordatorio para subir una exportación nueva. Desactivado salvo que lo actives.',
  save: 'Guardar objetivo',
  saved: 'Guardado',
  noExport: 'Sube primero una exportación para que tu objetivo parta de tu número real de seguidores.',
  progress: 'Progreso',
  of: (c, t) => `${c} de ${t} seguidores`,
  gained: (n) => `${n} desde que fijaste el objetivo`,
  left: (n) => `Faltan ${n}`,
  needed: (n) => `Necesitas ${n} por semana`,
  soFar: (n) => `${n} por semana hasta ahora`,
  status: {
    done: 'Objetivo alcanzado.',
    ahead: 'Vas por delante del ritmo.',
    on_track: 'Vas bien.',
    behind: 'Vas por detrás del ritmo.',
    no_deadline: 'Sin fecha, así que no hay ritmo que seguir.',
    no_data: 'Sube una exportación nueva para ver tu primer progreso.',
  },
  catchUp: 'Planificar publicaciones para recuperar',
  tiles: { gained: 'Desde que lo fijaste', left: 'Faltan', soFar: 'Por semana hasta ahora', needed: 'Por semana necesarios' },
  example: '2.100 de 3.000 seguidores. 25 por semana hasta ahora, 42 por semana necesarios.',
  g: {
    pace: 'Ritmo', you: 'Tú', atPace: 'A este ritmo', neededL: 'Necesario', nowL: 'Ahora', neededK: 'Necesario', etaK: 'A este ritmo', aDay: 'al día',
    yourGoal: 'Tu objetivo', byDate: (t, d) => `${t} seguidores para el ${d}`, noDate: (t) => `${t} seguidores`, toGo: (l, d) => `Faltan ${l}${d !== null ? ` · quedan ${d} días` : ''}`,
    changeGoal: 'Cambiar objetivo', setGoal: 'Fijar tu objetivo', checkins: 'Seguimiento', checkinsBody: 'Cada seguimiento es una exportación nueva. Tu objetivo se actualiza cada vez que subes una.', start: 'Inicio', next: 'Siguiente',
    nextOn: (d) => `Siguiente: te escribimos el ${d} para que descargues una exportación nueva.`, noReminders: 'Sin recordatorios. Haz el seguimiento cuando subas una exportación.',
    thExport: 'Exportación', thFollowers: 'Seguidores', thChange: 'Cambio',
    noGoalTitle: 'Aún no hay objetivo', noGoalBody: 'Elige una cifra de seguidores y, si quieres, una fecha. Cada exportación nueva te mostrará cómo vas.', goalWord: 'Objetivo', noData: 'Sube una exportación nueva para ver tu ritmo.', never: 'No a este ritmo',
  },
  p: {
    switcher: 'Plataforma', noGoalFor: (a) => `Aún no hay objetivo en ${a}`, noGoalForBody: (a) => `Cada plataforma tiene su propio objetivo. Elige una cifra para ${a} y, si quieres, una fecha. Cada exportación nueva de ${a} te mostrará cómo vas.`, setFor: (a) => `Fijar objetivo en ${a}`,
    remove: 'Quitar objetivo', removeConfirm: (a) => `¿Quitar tu objetivo de ${a}? Tus otros objetivos se quedan.`, keep: 'Mantenerlo', yourGoals: 'Tus objetivos', noExportYet: 'sin exportación aún', checkinsAll: 'Un solo correo de seguimiento cubre todos tus objetivos.',
  },
  o: {
    goalType: 'Objetivo', types: { followers: 'Seguidores', posts_week: 'Publicaciones por semana', per_post: 'Seguidores por publicación' },
    typeHelp: { followers: 'Llega a una cifra de seguidores, con fecha si quieres.', posts_week: 'Crea el hábito de publicar. Se cuenta desde Plan, Publicadas.', per_post: 'Aumenta los seguidores nuevos que trae cada publicación, según los resultados que añades.' },
    targetL: { followers: 'Objetivo de seguidores', posts_week: 'Publicaciones por semana', per_post: 'Seguidores nuevos por publicación' },
    byQuick: { endMonth: 'Fin de mes', m3: 'En 3 meses', m6: 'En 6 meses', none: 'Sin fecha' },
    note: '¿Por qué este objetivo? (opcional)', notePh: 'Colaboraciones con marcas, vender copias, una serie de viajes...', noteHelp: 'Tu coach lo ve y planifica en torno a ello.',
    neededWeek: (n) => `Se necesitan ${n} seguidores nuevos por semana`, reachIt: 'Ya alcanzado',
    on: 'Enviar el', weekdays: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'], anyDay: 'Cualquier día', deadlineReminder: 'Recordármelo una semana antes de la fecha', deadlineHelp: 'Un correo, 7 días antes de la fecha que elegiste.',
    statusShort: { done: 'Alcanzado', ahead: 'Adelantado', on_track: 'A tiempo', behind: 'Atrasado', no_deadline: 'Sin fecha', no_data: 'Sin datos aún' },
    habitNow: { posts_week: (c, t) => `${c} de ${t} publicaciones`, per_post: (c, t) => `${c} de ${t} por publicación` },
    habitHelp: 'Se cuenta desde las publicaciones que marcas como publicadas y los resultados que añades.', openPosted: 'Abrir Publicadas', thisWeek: 'Últimos 7 días', recent: 'Media de tus 5 últimos resultados',
  },
};

const PT: GoalsContent = {
  sub: 'Defina uma meta de seguidores e veja seu progresso a cada exportação que enviar.',
  target: 'Meta de seguidores',
  by: 'Até (opcional)',
  byHelp: 'Com uma data, você também vê o ritmo semanal necessário.',
  cadence: 'E-mails de acompanhamento',
  cadences: { weekly: 'Semanal', biweekly: 'A cada 2 semanas', monthly: 'Mensal', off: 'Desligado' },
  cadenceHelp: 'Um e-mail curto com seu progresso e um lembrete para enviar uma nova exportação. Desligado a menos que você ative.',
  save: 'Salvar meta',
  saved: 'Salvo',
  noExport: 'Envie uma exportação primeiro, para a meta partir do seu número real de seguidores.',
  progress: 'Progresso',
  of: (c, t) => `${c} de ${t} seguidores`,
  gained: (n) => `${n} desde que você definiu a meta`,
  left: (n) => `Faltam ${n}`,
  needed: (n) => `${n} por semana necessários`,
  soFar: (n) => `${n} por semana até agora`,
  status: {
    done: 'Meta alcançada.',
    ahead: 'À frente do ritmo.',
    on_track: 'No ritmo.',
    behind: 'Atrás do ritmo.',
    no_deadline: 'Sem data, então não há ritmo a seguir.',
    no_data: 'Envie uma nova exportação para ver seu primeiro progresso.',
  },
  catchUp: 'Planejar posts para recuperar',
  tiles: { gained: 'Desde que você definiu', left: 'Faltam', soFar: 'Por semana até agora', needed: 'Por semana necessários' },
  example: '2.100 de 3.000 seguidores. 25 por semana até agora, 42 por semana necessários.',
  g: {
    pace: 'Ritmo', you: 'Você', atPace: 'Neste ritmo', neededL: 'Necessário', nowL: 'Agora', neededK: 'Necessário', etaK: 'Neste ritmo', aDay: 'por dia',
    yourGoal: 'Sua meta', byDate: (t, d) => `${t} seguidores até ${d}`, noDate: (t) => `${t} seguidores`, toGo: (l, d) => `Faltam ${l}${d !== null ? ` · restam ${d} dias` : ''}`,
    changeGoal: 'Mudar meta', setGoal: 'Definir sua meta', checkins: 'Acompanhamento', checkinsBody: 'Cada acompanhamento é uma nova exportação. Sua meta atualiza sempre que você envia uma.', start: 'Início', next: 'Próximo',
    nextOn: (d) => `Próximo: enviamos um e-mail em ${d} para você baixar uma nova exportação.`, noReminders: 'Sem lembretes. Acompanhe quando enviar uma nova exportação.',
    thExport: 'Exportação', thFollowers: 'Seguidores', thChange: 'Mudança',
    noGoalTitle: 'Ainda não há meta', noGoalBody: 'Escolha um número de seguidores e, se quiser, uma data. Cada nova exportação mostra como você está indo.', goalWord: 'Meta', noData: 'Envie uma nova exportação para ver seu ritmo.', never: 'Não neste ritmo',
  },
  p: {
    switcher: 'Plataforma', noGoalFor: (a) => `Ainda não há meta no ${a}`, noGoalForBody: (a) => `Cada plataforma tem a sua própria meta. Escolha um número para o ${a} e, se quiser, uma data. Cada nova exportação do ${a} mostra como você está indo.`, setFor: (a) => `Definir meta no ${a}`,
    remove: 'Remover meta', removeConfirm: (a) => `Remover sua meta do ${a}? Suas outras metas continuam.`, keep: 'Manter', yourGoals: 'Suas metas', noExportYet: 'sem exportação ainda', checkinsAll: 'Um único e-mail de acompanhamento cobre todas as suas metas.',
  },
  o: {
    goalType: 'Meta', types: { followers: 'Seguidores', posts_week: 'Posts por semana', per_post: 'Seguidores por post' },
    typeHelp: { followers: 'Chegue a um número de seguidores, com data se quiser.', posts_week: 'Crie o hábito de postar. Contado em Plano, Postados.', per_post: 'Aumente os seguidores novos que cada post traz, pelos resultados que você adiciona.' },
    targetL: { followers: 'Meta de seguidores', posts_week: 'Posts por semana', per_post: 'Seguidores novos por post' },
    byQuick: { endMonth: 'Fim do mês', m3: 'Em 3 meses', m6: 'Em 6 meses', none: 'Sem data' },
    note: 'Por que esta meta? (opcional)', notePh: 'Parcerias com marcas, vender impressões, uma série de viagem...', noteHelp: 'Seu coach vê isso e planeja em torno disso.',
    neededWeek: (n) => `São necessários ${n} seguidores novos por semana`, reachIt: 'Já alcançada',
    on: 'Enviar no', weekdays: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'], anyDay: 'Qualquer dia', deadlineReminder: 'Me lembrar uma semana antes do prazo', deadlineHelp: 'Um e-mail, 7 dias antes da data escolhida.',
    statusShort: { done: 'Alcançada', ahead: 'Adiantado', on_track: 'No ritmo', behind: 'Atrasado', no_deadline: 'Sem data', no_data: 'Sem dados ainda' },
    habitNow: { posts_week: (c, t) => `${c} de ${t} posts`, per_post: (c, t) => `${c} de ${t} por post` },
    habitHelp: 'Contado pelos posts que você marca como postados e pelos resultados que adiciona.', openPosted: 'Abrir Postados', thisWeek: 'Últimos 7 dias', recent: 'Média dos seus 5 últimos resultados',
  },
};

export function getGoalsContent(locale: AppLocale): GoalsContent {
  return locale === 'es' ? ES : locale === 'pt' ? PT : EN;
}
