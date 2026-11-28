import type { AppLocale } from '@/i18n/routing';

// A month name that starts a sentence ("outubro" -> "Outubro").
const cap = (x: string) => x.charAt(0).toLocaleUpperCase() + x.slice(1);

// Copy for the Today widgets (Studio > Today).
export interface TodayContent {
  greet: (hour: number) => string;
  fans: (pct: number) => string;
  fansLine: (fans: string) => string; mutualLine: (n: string) => string;
  postFor: (n: string) => string;
  coachRead: string; open: string; unlockRead: string; setupCta: string;
  loop: { write: string; check: string; plan: string };
  newRead: string; showRead: string; hideRead: string; readTomorrow: string; readFailed: string;
  followers: string; following: string; noBack: string; backRate: string; review: string;
  ratio: (x: string) => string; ratioMore: (x: string) => string; shareOf: (pct: number) => string; mutualOf: string;
  post: string; dayOf: (d: number) => string; startsOn: (d: string) => string; nothingToday: string; openPlan: string; writeIt: string; posted: string; postedDone: string; noPhoto: string; undo: string; addPhoto: string; addPhotos: string;
  postLocked: string; noPlan: string; makePlan: string;
  create: string; actWrite: string; actCheck: string; actIdeas: string;
  week: string; weekOf: (done: number, all: number) => string; weekLocked: string;
  goal: string; goalOf: (now: string, target: string) => string; toGo: (n: string) => string; byDate: (d: string) => string; changeGoal: string; setGoal: string; noGoal: string; goalLocked: string;
  ask: string; askSub: string; askPh: string; askChips: string[];
  brief: string; sample: string; openBrief: string;
  unlock: string;
  custom: { customize: string; done: string; reset: string; hint: string; add: string; sizes: [string, string, string]; earlier: string; later: string; remove: string; nothingHidden: string };
  since: string; uploadNew: string; sinceRange: (a: string, b: string) => string; newF: string; leftF: string; noPrev: string; dotNow: string; dotNext: string; whyLeft: string;
  growthSince: (m: string) => string;
  up: { title: string; points: string[]; cta: string; from: (p: string) => string };
  forYou: string; fullBrief: string; proBrief: string;
  tipFans: (fans: string, pct: number) => { t: string; p: string };
  tipClean: (n: string, ratio: string) => { t: string; p: string };
  tipCleanDone: { t: string; p: string };
  tipBest: (month: string, n: string, pct: number) => { t: string; p: string };
  tipNoDates: { t: string; p: string };
}

const EN: TodayContent = {
  greet: (h) => (h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'),
  fans: (p) => `${p}% of your followers are fans.`,
  fansLine: (n) => `${n} follow you, you don't follow them`, mutualLine: (n) => `${n} mutual`,
  postFor: (n) => `Post for them. Stop waiting on the ${n} who never followed back.`,
  open: 'Open', coachRead: "Your coach's read", unlockRead: 'Unlock your read', setupCta: 'Set up your coach',
  loop: { write: 'Write it', check: 'Check a draft', plan: 'Put it in the plan' },
  newRead: 'Read this export', showRead: 'Show the full read', hideRead: 'Show less', readTomorrow: 'You already got a read today. The next one is available tomorrow.', readFailed: 'That did not work. Try again.',
  followers: 'Followers', following: 'Following', noBack: "Don't follow back", backRate: 'Follow-back rate', review: 'Review',
  ratio: (x) => `1 for every ${x} followers`, ratioMore: (x) => `${x} for every follower`, shareOf: (p) => `${p}% of who you follow`, mutualOf: 'of who you follow follow you back',
  post: "Today's post", dayOf: (d) => `Day ${d} of 30`, startsOn: (d) => `Starts ${d}`, nothingToday: 'Nothing planned today.', openPlan: 'Open the plan', writeIt: 'Write it', posted: 'Posted', postedDone: 'Posted', noPhoto: 'No photo yet', undo: 'Undo', addPhoto: 'Add a photo', addPhotos: 'Add photos',
  postLocked: 'Your post for today, planned around your audience.', noPlan: 'No plan yet.', makePlan: 'Make a 30-day plan',
  create: 'Create', actWrite: 'Write a hook, caption or script', actCheck: 'Check a post before it goes out', actIdeas: 'Get 5 ideas',
  week: 'This week', weekOf: (d, a) => `${d} of ${a} posted`, weekLocked: 'Seven posts, one a day',
  goal: 'Goal', goalOf: (n, t) => `${n} of ${t}`, toGo: (n) => `${n} to go`, byDate: (d) => `by ${d}`, changeGoal: 'Change goal', setGoal: 'Set a goal', noGoal: 'No goal yet.', goalLocked: 'When will you hit your number?',
  ask: 'Ask your coach', askSub: 'Knows your memory and latest export', askPh: 'Why did I lose followers last month?',
  askChips: ['Is my follow-back rate good?', 'What should I post this week?', 'Why do people unfollow me?'],
  brief: 'Weekly brief', sample: 'Sample', openBrief: 'Open the brief',
  unlock: 'Unlock',
  custom: { customize: 'Customize', done: 'Done', reset: 'Reset', hint: 'Drag widgets to move them. Pick a size, remove what you don\'t need, or add it back at the end.', add: 'Add widget', sizes: ['Small', 'Medium', 'Large'], earlier: 'Move earlier', later: 'Move later', remove: 'Remove', nothingHidden: 'Every widget is on the board.' },
  since: 'Since your last export', uploadNew: 'Upload a newer export', sinceRange: (a, b) => `${a} to ${b}`, newF: 'new', leftF: 'left', noPrev: 'Upload your next export to see who joined and who left.', dotNow: 'This export', dotNext: 'Your next one', whyLeft: 'Who left',
  growthSince: (m) => `Since ${m}, from follow dates`,
  up: { title: 'Your coach, every week', points: ['A plain read of every export', 'A 30-day plan with a hook for each day', 'A score for each post before it goes live'], cta: 'See what Pro AI adds', from: (p) => `From ${p} a month` },
  forYou: 'From your numbers', fullBrief: 'Open the full brief', proBrief: 'Pro AI writes this for your niche every Monday.',
  tipFans: (f, p) => ({ t: `Make carousels for your ${f} quiet fans`, p: `${p}% of your followers follow you and never hear back. Carousels get a second showing when someone skips the first slide, so they reach more of them.` }),
  tipClean: (n, r) => ({ t: `Unfollow the ${n} who never followed back`, p: `Your ratio goes to 1 following for every ${r} followers, which looks stronger to anyone who opens your profile. It takes a few minutes in Results.` }),
  tipCleanDone: { t: 'Your following list is clean', p: 'Everyone you follow follows you back. Check again after your next export.' },
  tipBest: (m, n, p) => ({ t: `Do what you did in ${m} again`, p: `${cap(m)} brought ${n} of the followers you still have, your best month.${p > 0 ? ` ${p}% of your followers arrived in the last 12 months.` : ''} Make one post this week like the ones from then.` }),
  tipNoDates: { t: 'Your best month shows with your next export', p: 'This export has no follow dates. A full export from Instagram includes them.' },
};
const ES: TodayContent = {
  greet: (h) => (h < 12 ? 'Buenos días' : h < 20 ? 'Buenas tardes' : 'Buenas noches'),
  fans: (p) => `El ${p}% de tus seguidores son fans.`,
  fansLine: (n) => `${n} te siguen y tú no a ellos`, mutualLine: (n) => `${n} mutuos`,
  postFor: (n) => `Publica para ellos. Deja de esperar a los ${n} que nunca te siguieron.`,
  open: 'Abrir', coachRead: 'La lectura de tu coach', unlockRead: 'Desbloquear tu lectura', setupCta: 'Configurar tu coach',
  loop: { write: 'Escribirlo', check: 'Revisar un borrador', plan: 'Ponerlo en el plan' },
  newRead: 'Leer esta exportación', showRead: 'Ver la lectura completa', hideRead: 'Ver menos', readTomorrow: 'Ya tuviste una lectura hoy. La siguiente estará disponible mañana.', readFailed: 'No funcionó. Inténtalo de nuevo.',
  followers: 'Seguidores', following: 'Seguidos', noBack: 'No te siguen', backRate: 'Tasa de seguimiento mutuo', review: 'Revisar',
  ratio: (x) => `1 por cada ${x} seguidores`, ratioMore: (x) => `${x} por cada seguidor`, shareOf: (p) => `${p}% de quienes sigues`, mutualOf: 'de quienes sigues te siguen',
  post: 'Publicación de hoy', dayOf: (d) => `Día ${d} de 30`, startsOn: (d) => `Empieza el ${d}`, nothingToday: 'Nada planeado hoy.', openPlan: 'Abrir el plan', writeIt: 'Escribirla', posted: 'Publicada', postedDone: 'Publicada', noPhoto: 'Sin foto todavía', undo: 'Deshacer', addPhoto: 'Añadir una foto', addPhotos: 'Añadir fotos',
  postLocked: 'Tu publicación de hoy, pensada para tu audiencia.', noPlan: 'Aún no hay plan.', makePlan: 'Hacer un plan de 30 días',
  create: 'Crear', actWrite: 'Escribir un gancho, texto o guion', actCheck: 'Revisar una publicación antes de publicarla', actIdeas: 'Conseguir 5 ideas',
  week: 'Esta semana', weekOf: (d, a) => `${d} de ${a} publicadas`, weekLocked: 'Siete publicaciones, una al día',
  goal: 'Objetivo', goalOf: (n, t) => `${n} de ${t}`, toGo: (n) => `faltan ${n}`, byDate: (d) => `para el ${d}`, changeGoal: 'Cambiar objetivo', setGoal: 'Fijar un objetivo', noGoal: 'Aún no hay objetivo.', goalLocked: '¿Cuándo llegarás a tu cifra?',
  ask: 'Pregúntale a tu coach', askSub: 'Conoce tu memoria y tu última exportación', askPh: '¿Por qué perdí seguidores el mes pasado?',
  askChips: ['¿Mi tasa de seguimiento mutuo es buena?', '¿Qué publico esta semana?', '¿Por qué me dejan de seguir?'],
  brief: 'Resumen semanal', sample: 'Ejemplo', openBrief: 'Abrir el resumen',
  unlock: 'Desbloquear',
  custom: { customize: 'Personalizar', done: 'Listo', reset: 'Restablecer', hint: 'Arrastra los widgets para moverlos. Elige un tamaño, quita lo que no necesites o vuelve a añadirlo al final.', add: 'Añadir widget', sizes: ['Pequeño', 'Mediano', 'Grande'], earlier: 'Mover antes', later: 'Mover después', remove: 'Quitar', nothingHidden: 'Todos los widgets están en el tablero.' },
  since: 'Desde tu última exportación', uploadNew: 'Subir una exportación nueva', sinceRange: (a, b) => `${a} a ${b}`, newF: 'nuevos', leftF: 'se fueron', noPrev: 'Sube tu próxima exportación para ver quién llegó y quién se fue.', dotNow: 'Esta exportación', dotNext: 'La próxima', whyLeft: 'Quién se fue',
  growthSince: (m) => `Desde ${m}, según las fechas de seguimiento`,
  up: { title: 'Tu coach, cada semana', points: ['Una lectura clara de cada exportación', 'Un plan de 30 días con un gancho para cada día', 'Una nota para cada publicación antes de publicarla'], cta: 'Ver qué añade Pro AI', from: (p) => `Desde ${p} al mes` },
  forYou: 'Con tus números', fullBrief: 'Abrir el resumen completo', proBrief: 'Pro AI lo escribe para tu nicho cada lunes.',
  tipFans: (f, p) => ({ t: `Haz carruseles para tus ${f} fans silenciosos`, p: `El ${p}% de tus seguidores te sigue y nunca recibe respuesta. Los carruseles se muestran otra vez cuando alguien salta la primera imagen, así llegan a más de ellos.` }),
  tipClean: (n, r) => ({ t: `Deja de seguir a los ${n} que nunca te siguieron`, p: `Tu proporción pasa a 1 seguido por cada ${r} seguidores, y tu perfil se ve más fuerte para quien lo abre. Te lleva unos minutos en Resultados.` }),
  tipCleanDone: { t: 'Tu lista de seguidos está limpia', p: 'Todas las cuentas que sigues te siguen. Vuelve a mirar tras tu próxima exportación.' },
  tipBest: (m, n, p) => ({ t: `Repite lo que hiciste en ${m}`, p: `${cap(m)} te trajo ${n} de los seguidores que aún tienes, tu mejor mes.${p > 0 ? ` El ${p}% de tus seguidores llegó en los últimos 12 meses.` : ''} Haz esta semana una publicación como las de entonces.` }),
  tipNoDates: { t: 'Tu mejor mes aparece con tu próxima exportación', p: 'Esta exportación no trae fechas de seguimiento. Una exportación completa de Instagram las incluye.' },
};
const PT: TodayContent = {
  greet: (h) => (h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'),
  fans: (p) => `${p}% dos seus seguidores são fãs.`,
  fansLine: (n) => `${n} seguem você e você não segue`, mutualLine: (n) => `${n} mútuos`,
  postFor: (n) => `Poste para eles. Pare de esperar pelos ${n} que nunca seguiram de volta.`,
  open: 'Abrir', coachRead: 'A leitura do seu coach', unlockRead: 'Desbloquear sua leitura', setupCta: 'Configurar seu coach',
  loop: { write: 'Escrever', check: 'Revisar um rascunho', plan: 'Colocar no plano' },
  newRead: 'Ler esta exportação', showRead: 'Ver a leitura completa', hideRead: 'Ver menos', readTomorrow: 'Você já teve uma leitura hoje. A próxima fica disponível amanhã.', readFailed: 'Não funcionou. Tente de novo.',
  followers: 'Seguidores', following: 'Seguindo', noBack: 'Não seguem de volta', backRate: 'Taxa de retorno', review: 'Revisar',
  ratio: (x) => `1 a cada ${x} seguidores`, ratioMore: (x) => `${x} para cada seguidor`, shareOf: (p) => `${p}% de quem você segue`, mutualOf: 'de quem você segue segue de volta',
  post: 'Post de hoje', dayOf: (d) => `Dia ${d} de 30`, startsOn: (d) => `Começa em ${d}`, nothingToday: 'Nada planejado hoje.', openPlan: 'Abrir o plano', writeIt: 'Escrever', posted: 'Postado', postedDone: 'Postado', noPhoto: 'Sem foto ainda', undo: 'Desfazer', addPhoto: 'Adicionar uma foto', addPhotos: 'Adicionar fotos',
  postLocked: 'Seu post de hoje, pensado para o seu público.', noPlan: 'Ainda não há plano.', makePlan: 'Fazer um plano de 30 dias',
  create: 'Criar', actWrite: 'Escrever um gancho, legenda ou roteiro', actCheck: 'Revisar um post antes de publicar', actIdeas: 'Receber 5 ideias',
  week: 'Esta semana', weekOf: (d, a) => `${d} de ${a} postados`, weekLocked: 'Sete posts, um por dia',
  goal: 'Meta', goalOf: (n, t) => `${n} de ${t}`, toGo: (n) => `faltam ${n}`, byDate: (d) => `até ${d}`, changeGoal: 'Mudar meta', setGoal: 'Definir uma meta', noGoal: 'Ainda não há meta.', goalLocked: 'Quando você chega no seu número?',
  ask: 'Pergunte ao seu coach', askSub: 'Conhece sua memória e sua última exportação', askPh: 'Por que perdi seguidores no mês passado?',
  askChips: ['Minha taxa de retorno é boa?', 'O que posto esta semana?', 'Por que deixam de me seguir?'],
  brief: 'Resumo semanal', sample: 'Exemplo', openBrief: 'Abrir o resumo',
  unlock: 'Desbloquear',
  custom: { customize: 'Personalizar', done: 'Pronto', reset: 'Restaurar', hint: 'Arraste os widgets para mover. Escolha um tamanho, tire o que não precisa ou adicione de volta no fim.', add: 'Adicionar widget', sizes: ['Pequeno', 'Médio', 'Grande'], earlier: 'Mover para antes', later: 'Mover para depois', remove: 'Remover', nothingHidden: 'Todos os widgets estão no painel.' },
  since: 'Desde sua última exportação', uploadNew: 'Enviar uma exportação nova', sinceRange: (a, b) => `${a} a ${b}`, newF: 'novos', leftF: 'saíram', noPrev: 'Envie sua próxima exportação para ver quem chegou e quem saiu.', dotNow: 'Esta exportação', dotNext: 'A próxima', whyLeft: 'Quem saiu',
  growthSince: (m) => `Desde ${m}, pelas datas de follow`,
  up: { title: 'Seu coach, toda semana', points: ['Uma leitura clara de cada exportação', 'Um plano de 30 dias com um gancho por dia', 'Uma nota para cada post antes de publicar'], cta: 'Ver o que o Pro AI adiciona', from: (p) => `A partir de ${p} por mês` },
  forYou: 'Com os seus números', fullBrief: 'Abrir o resumo completo', proBrief: 'O Pro AI escreve isto para o seu nicho toda segunda.',
  tipFans: (f, p) => ({ t: `Faça carrosséis para seus ${f} fãs silenciosos`, p: `${p}% dos seus seguidores seguem você e nunca têm retorno. Carrosséis aparecem de novo quando alguém pula o primeiro slide, então chegam a mais deles.` }),
  tipClean: (n, r) => ({ t: `Deixe de seguir os ${n} que nunca seguiram de volta`, p: `Sua proporção vai para 1 seguindo a cada ${r} seguidores, e seu perfil parece mais forte para quem abre. Leva poucos minutos em Resultados.` }),
  tipCleanDone: { t: 'Sua lista de seguindo está limpa', p: 'Todo mundo que você segue segue de volta. Veja de novo depois da próxima exportação.' },
  tipBest: (m, n, p) => ({ t: `Repita o que você fez em ${m}`, p: `${cap(m)} trouxe ${n} dos seguidores que você ainda tem, seu melhor mês.${p > 0 ? ` ${p}% dos seus seguidores chegaram nos últimos 12 meses.` : ''} Faça um post esta semana como os daquela época.` }),
  tipNoDates: { t: 'Seu melhor mês aparece na próxima exportação', p: 'Esta exportação não tem datas de follow. Uma exportação completa do Instagram inclui as datas.' },
};

export function getTodayContent(locale: AppLocale): TodayContent {
  return locale === 'es' ? ES : locale === 'pt' ? PT : EN;
}

// One decimal in the reader's format ("1.2" in English, "1,2" in Spanish and Portuguese).
export const dec = (x: number, locale: string) => x.toLocaleString(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
