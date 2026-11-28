import type { AppLocale } from '@/i18n/routing';

// Studio > Results: the lists from this export, and what matters about them.
export interface ResultsContent {
  sub: (date: string, prev: string | null) => string;
  tabs: { noBack: string; fans: string; mutuals: string; left: string };
  search: string; newest: string; oldest: string; all: string; untriaged: string;
  followingSince: (d: string) => string; followsSince: (d: string) => string; leftSince: (from: string, to: string) => string; az: string; seeThem: string; date: string; name: string; visited: string;
  statNotes: { followers: (fanPct: number) => string; following: (ratio: string) => string; followingMore: (ratio: string) => string; mutuals: (pct: number) => string }; noDate: string; deactivated: string;
  open: (app: string) => string; showMore: (n: number, total: number) => string; noMatch: string; empty: string; needTwo: string; leftLocked: (n: string) => string;
  sorted: string; sortedOf: (n: string, total: string) => string; sortedBody: string; sortedDone: string;
  matters: string; leftLine: (n: string, d: string) => string; leftNone: (d: string) => string; secondExport: string;
  droppingLine: (n: string, app: string) => string; whitelistLine: (n: string) => string; deadLine: (n: string) => string; oldestLine: (d: string) => string;
  marks: { keep: string; unfollow: string; done: string; later: string; dead: string };
  markHints: { keep: string; unfollow: string; done: string; later: string; dead: string };
  filterHints: { untriaged: string; deactivated: string };
  howTo: (app: string) => string; profile: string; openOn: (u: string, app: string) => string; progress: string; leftToDecide: (n: string) => string;
  read: string; readBody: string; openToday: string; csv: string; csvBody: string; csvLocked: string; privacy: string;
  showing: (n: string, total: string) => string;
  exportNote: { title: string; partialTitle: string; source: (app: string) => string; info: string; partial: string; why: string; reasons: { label: string; detail: (app: string) => string }[]; how: string; dismiss: string };
}

const EN: ResultsContent = {
  sub: (d, p) => (p ? `Your ${d} export, compared with ${p}. Worked out in this browser. Nothing is uploaded.` : `Your ${d} export. Worked out in this browser. Nothing is uploaded.`),
  tabs: { noBack: "Don't follow back", fans: 'Fans', mutuals: 'Mutuals', left: 'Unfollowed you' },
  search: 'Search usernames', newest: 'Newest first', oldest: 'Oldest first', all: 'All', untriaged: 'Untriaged',
  followingSince: (d) => `Following since ${d}`, followsSince: (d) => `Follows you since ${d}`, leftSince: (a, b) => `Left between ${a} and ${b}`, az: 'A to Z', seeThem: 'Show them', date: 'Date', name: 'Name', visited: 'Visited',
  statNotes: { followers: (p) => `${p}% are fans`, following: (r) => `1 for every ${r} followers`, followingMore: (r) => `${r} for every follower`, mutuals: (p) => `${p}% of who you follow` }, noDate: 'No date in the export', deactivated: 'looks deactivated',
  showing: (n, t) => `Showing ${n} of ${t}`,
  exportNote: { title: 'Missing someone?', partialTitle: 'This export looks partial', source: (app) => `These lists come straight from ${app}'s own export, not from our reading of it.`, info: 'If someone is missing, the export usually left them out.', partial: 'It looks like a scheduled export or a short date range, so the lists may be incomplete.', why: 'Why', reasons: [
    { label: 'All time', detail: (app) => `In ${app}'s export settings the date range must be All time. A shorter range only includes people from that period.` },
    { label: 'Scheduled exports', detail: () => 'Automatic, scheduled exports only include what changed since the last one, not your full lists.' },
    { label: 'Very large accounts', detail: (app) => `${app} sometimes trims very large exports. If the numbers look low, request the export again.` },
  ], how: 'How to export', dismiss: 'Hide for this export' },
  open: (app) => `Open on ${app}`, showMore: (n, t) => `Show ${n} more of ${t}`, noMatch: 'No accounts match.', empty: 'Nobody here.', needTwo: 'Upload a second export to see who left. Compare any two from the same account.', leftLocked: (n) => `${n} people left between your two exports. Their names come with Pro AI.`,
  sorted: 'Sorted', sortedOf: (n, t) => `${n} of ${t}`, sortedBody: 'Mark each account so the list gets shorter every time you come back.', sortedDone: 'All sorted. Nice.',
  matters: 'What matters', leftLine: (n, d) => `${n} unfollowed you since ${d}.`, leftNone: (d) => `Nobody unfollowed you since ${d}.`, secondExport: 'Export again in a few weeks to see who unfollowed you.',
  droppingLine: (n, app) => `${n} marked To unfollow. Do it on ${app}, a few a day.`, whitelistLine: (n) => `${n} marked Keep. They stay out of the queue.`, deadLine: (n) => `${n} look deactivated. They will drop off on their own.`, oldestLine: (d) => `You followed the oldest one in ${d}. They never followed back.`,
  marks: { keep: 'Keep', unfollow: 'To unfollow', done: 'Unfollowed', later: 'Later', dead: 'Deactivated' },
  markHints: { keep: "You'll keep following them. They drop out of your unfollow queue.", unfollow: 'You plan to unfollow them. Do it in the app, then mark Unfollowed.', done: 'You already unfollowed them on the app.', later: 'Not sure yet. Puts them aside to decide another time.', dead: "The profile doesn't open: it's deactivated, deleted or suspended. Exports keep these for a while. Mark it to clear it from your list." },
  filterHints: { untriaged: "Accounts you haven't sorted yet.", deactivated: 'Accounts you marked as deactivated, deleted or suspended. They stay in exports for a while, so mark them to keep your list clean.' },
  howTo: (app) => `For each account pick Keep or To unfollow. Unfollow on ${app}, then mark Unfollowed. Later puts it aside.`, profile: 'Profile', openOn: (u, app) => `Open @${u} on ${app}`, progress: 'Your progress', leftToDecide: (n) => `${n} left to decide`,
  read: 'Your read', readBody: 'What these numbers mean for your account, in plain words.', openToday: 'Open', csv: 'CSV', csvBody: 'Download the list on screen.', csvLocked: 'Your free CSV is used. Pro keeps it unlimited.', privacy: 'Lists stay in this browser. Marks too.',
};

const ES: ResultsContent = {
  sub: (d, p) => (p ? `Tu exportación del ${d}, comparada con la del ${p}. Calculado en este navegador. No se sube nada.` : `Tu exportación del ${d}. Calculado en este navegador. No se sube nada.`),
  tabs: { noBack: 'No te siguen', fans: 'Fans', mutuals: 'Mutuos', left: 'Te dejaron de seguir' },
  search: 'Buscar usuarios', newest: 'Más recientes', oldest: 'Más antiguos', all: 'Todos', untriaged: 'Sin marcar',
  followingSince: (d) => `Lo sigues desde ${d}`, followsSince: (d) => `Te sigue desde ${d}`, leftSince: (a, b) => `Se fue entre el ${a} y el ${b}`, az: 'A a Z', seeThem: 'Ver cuáles', date: 'Fecha', name: 'Nombre', visited: 'Visto',
  statNotes: { followers: (p) => `${p}% son fans`, following: (r) => `1 por cada ${r} seguidores`, followingMore: (r) => `${r} por cada seguidor`, mutuals: (p) => `${p}% de a quién sigues` }, noDate: 'Sin fecha en la exportación', deactivated: 'parece desactivada',
  showing: (n, t) => `Mostrando ${n} de ${t}`,
  exportNote: { title: '¿Falta alguien?', partialTitle: 'Esta exportación parece parcial', source: (app) => `Estas listas vienen directo de la exportación de ${app}, no de nuestra lectura.`, info: 'Si falta alguien, normalmente la exportación lo dejó fuera.', partial: 'Parece una exportación programada o un rango de fechas corto, así que las listas pueden estar incompletas.', why: 'Por qué', reasons: [
    { label: 'Todo el tiempo', detail: (app) => `En la configuración de exportación de ${app} el rango de fechas debe ser Todo el tiempo. Un rango más corto solo incluye a las personas de ese periodo.` },
    { label: 'Exportaciones programadas', detail: () => 'Las exportaciones automáticas solo incluyen lo que cambió desde la anterior, no tus listas completas.' },
    { label: 'Cuentas muy grandes', detail: (app) => `${app} a veces recorta las exportaciones muy grandes. Si los números parecen bajos, solicítala de nuevo.` },
  ], how: 'Cómo exportar', dismiss: 'Ocultar para esta exportación' },
  open: (app) => `Abrir en ${app}`, showMore: (n, t) => `Ver ${n} más de ${t}`, noMatch: 'Ninguna cuenta coincide.', empty: 'Nadie aquí.', needTwo: 'Sube una segunda exportación para ver quién se fue. Compara dos de la misma cuenta.', leftLocked: (n) => `${n} personas se fueron entre tus dos exportaciones. Sus nombres llegan con Pro AI.`,
  sorted: 'Ordenadas', sortedOf: (n, t) => `${n} de ${t}`, sortedBody: 'Marca cada cuenta para que la lista sea más corta cada vez que vuelvas.', sortedDone: 'Todo ordenado. Bien.',
  matters: 'Lo importante', leftLine: (n, d) => `${n} te dejaron de seguir desde el ${d}.`, leftNone: (d) => `Nadie te dejó de seguir desde el ${d}.`, secondExport: 'Vuelve a exportar en unas semanas para ver quién te dejó de seguir.',
  droppingLine: (n, app) => `${n} marcadas para dejar de seguir. Hazlo en ${app}, unas pocas al día.`, whitelistLine: (n) => `${n} marcadas Mantener. Quedan fuera de la cola.`, deadLine: (n) => `${n} parecen desactivadas. Desaparecerán solas.`, oldestLine: (d) => `Seguiste a la más antigua en ${d} y nunca te siguió.`,
  marks: { keep: 'Mantener', unfollow: 'Dejar de seguir', done: 'Ya no lo sigo', later: 'Después', dead: 'Desactivada' },
  markHints: { keep: 'Lo seguirás siguiendo. Sale de tu cola para dejar de seguir.', unfollow: 'Piensas dejar de seguirlo. Hazlo en la app y luego marca Ya no lo sigo.', done: 'Ya lo dejaste de seguir en la app.', later: 'Aún no lo sabes. Lo aparta para decidir en otro momento.', dead: 'El perfil no abre: está desactivado, eliminado o suspendido. Las exportaciones los conservan un tiempo. Márcalo para quitarlo de tu lista.' },
  filterHints: { untriaged: 'Cuentas que aún no marcaste.', deactivated: 'Cuentas que marcaste como desactivadas, eliminadas o suspendidas. Siguen en las exportaciones un tiempo, así que márcalas para mantener tu lista limpia.' },
  howTo: (app) => `En cada cuenta elige Mantener o Dejar de seguir. Hazlo en ${app} y marca Ya no lo sigo. Después la aparta.`, profile: 'Perfil', openOn: (u, app) => `Abrir @${u} en ${app}`, progress: 'Tu progreso', leftToDecide: (n) => `${n} por decidir`,
  read: 'Tu lectura', readBody: 'Qué significan estos números para tu cuenta, en palabras simples.', openToday: 'Abrir', csv: 'CSV', csvBody: 'Descarga la lista en pantalla.', csvLocked: 'Ya usaste tu CSV gratis. Pro lo deja ilimitado.', privacy: 'Las listas se quedan en este navegador. Las marcas también.',
};

const PT: ResultsContent = {
  sub: (d, p) => (p ? `Sua exportação de ${d}, comparada com a de ${p}. Calculado neste navegador. Nada é enviado.` : `Sua exportação de ${d}. Calculado neste navegador. Nada é enviado.`),
  tabs: { noBack: 'Não te seguem', fans: 'Fãs', mutuals: 'Mútuos', left: 'Deixaram de seguir' },
  search: 'Buscar usuários', newest: 'Mais recentes', oldest: 'Mais antigos', all: 'Todos', untriaged: 'Sem marca',
  followingSince: (d) => `Você segue desde ${d}`, followsSince: (d) => `Te segue desde ${d}`, leftSince: (a, b) => `Saiu entre ${a} e ${b}`, az: 'A a Z', seeThem: 'Ver quais', date: 'Data', name: 'Nome', visited: 'Visto',
  statNotes: { followers: (p) => `${p}% são fãs`, following: (r) => `1 a cada ${r} seguidores`, followingMore: (r) => `${r} para cada seguidor`, mutuals: (p) => `${p}% de quem você segue` }, noDate: 'Sem data na exportação', deactivated: 'parece desativada',
  showing: (n, t) => `Mostrando ${n} de ${t}`,
  exportNote: { title: 'Falta alguém?', partialTitle: 'Esta exportação parece parcial', source: (app) => `Estas listas vêm direto da exportação do ${app}, não da nossa leitura.`, info: 'Se falta alguém, normalmente a exportação deixou de fora.', partial: 'Parece uma exportação programada ou um intervalo de datas curto, então as listas podem estar incompletas.', why: 'Por quê', reasons: [
    { label: 'Todo o período', detail: (app) => `Nas configurações de exportação do ${app} o intervalo de datas precisa ser Todo o período. Um intervalo menor só inclui as pessoas daquele período.` },
    { label: 'Exportações programadas', detail: () => 'As exportações automáticas só trazem o que mudou desde a anterior, não as suas listas completas.' },
    { label: 'Contas muito grandes', detail: (app) => `O ${app} às vezes corta exportações muito grandes. Se os números parecerem baixos, solicite de novo.` },
  ], how: 'Como exportar', dismiss: 'Ocultar para esta exportação' },
  open: (app) => `Abrir no ${app}`, showMore: (n, t) => `Ver mais ${n} de ${t}`, noMatch: 'Nenhuma conta corresponde.', empty: 'Ninguém aqui.', needTwo: 'Envie uma segunda exportação para ver quem saiu. Compare duas da mesma conta.', leftLocked: (n) => `${n} pessoas saíram entre as suas duas exportações. Os nomes vêm com o Pro AI.`,
  sorted: 'Organizadas', sortedOf: (n, t) => `${n} de ${t}`, sortedBody: 'Marque cada conta para a lista ficar menor a cada volta.', sortedDone: 'Tudo organizado. Boa.',
  matters: 'O que importa', leftLine: (n, d) => `${n} deixaram de te seguir desde ${d}.`, leftNone: (d) => `Ninguém deixou de te seguir desde ${d}.`, secondExport: 'Exporte de novo em algumas semanas para ver quem deixou de te seguir.',
  droppingLine: (n, app) => `${n} marcadas para deixar de seguir. Faça no ${app}, poucas por dia.`, whitelistLine: (n) => `${n} marcadas Manter. Ficam fora da fila.`, deadLine: (n) => `${n} parecem desativadas. Vão sumir sozinhas.`, oldestLine: (d) => `Você seguiu a mais antiga em ${d} e ela nunca te seguiu de volta.`,
  marks: { keep: 'Manter', unfollow: 'Deixar de seguir', done: 'Já deixei', later: 'Depois', dead: 'Desativada' },
  markHints: { keep: 'Você vai continuar seguindo. Sai da sua fila para deixar de seguir.', unfollow: 'Você pretende deixar de seguir. Faça no app e marque Já deixei.', done: 'Você já deixou de seguir no app.', later: 'Ainda não sabe. Deixa de lado para decidir outra hora.', dead: 'O perfil não abre: está desativado, excluído ou suspenso. As exportações mantêm esses perfis por um tempo. Marque para tirar da sua lista.' },
  filterHints: { untriaged: 'Contas que você ainda não marcou.', deactivated: 'Contas que você marcou como desativadas, excluídas ou suspensas. Elas ficam nas exportações por um tempo, então marque para manter sua lista limpa.' },
  howTo: (app) => `Em cada conta escolha Manter ou Deixar de seguir. Faça no ${app} e marque Já deixei. Depois deixa de lado.`, profile: 'Perfil', openOn: (u, app) => `Abrir @${u} no ${app}`, progress: 'Seu progresso', leftToDecide: (n) => `${n} para decidir`,
  read: 'Sua leitura', readBody: 'O que esses números significam para a sua conta, em palavras simples.', openToday: 'Abrir', csv: 'CSV', csvBody: 'Baixe a lista da tela.', csvLocked: 'Seu CSV grátis já foi usado. O Pro deixa ilimitado.', privacy: 'As listas ficam neste navegador. As marcas também.',
};

export function getResultsContent(locale: AppLocale): ResultsContent {
  return locale === 'es' ? ES : locale === 'pt' ? PT : EN;
}
