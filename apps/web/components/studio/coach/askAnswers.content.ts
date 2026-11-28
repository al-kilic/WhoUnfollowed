import type { AiChat } from '@ig-tracker/core';

// Written answers for the starter questions in Ask coach, shown in sample mode
// and to visitors without Pro AI (nothing is sent anywhere). Each question has
// its own answer about the made-up sample account. Pro AI members asking the
// same question get the real coach.

export type AskTopic = 'followBack' | 'slowdown' | 'postWeek' | 'unfollowPace' | 'lostFollowers' | 'bestTime' | 'bio';
type Answer = Pick<AiChat, 'answer' | 'followUps'>;

const EN: Record<AskTopic, { q: string[]; a: Answer }> = {
  followBack: {
    q: ['Is my follow-back rate good?'],
    a: { answer: 'Your follow-back rate is the share of people you follow who follow you back. On this account it is 76%, so about three in four follows are mutual.\n- That is healthy: most of the people you follow know you or care about your work.\n- The ones who never followed back are listed in Results. Sort them by oldest first: old one-way follows are the easiest to clean up.\nA high rate does not grow the account on its own. New followers come from posts that reach people who do not know you yet.', followUps: ['Who should I unfollow first?', 'How do I reach new people?'] },
  },
  slowdown: {
    q: ['Why did growth slow down this month?'],
    a: { answer: 'Comparing your last two exports, fewer people followed you this month and a few more left. The two clearest reasons on this account:\n- You posted less often than the month before, so fewer people outside your followers saw you.\n- Your best months had carousels about specific places; this month leaned on single photos.\nTry two carousels this week built like your best ones, then compare with your next export.', followUps: ['What made my best posts work?', 'Plan this week for me'] },
  },
  postWeek: {
    q: ['What should I post this week?'],
    a: { answer: 'Three posts, built on what already works for you:\n- Monday: a carousel about one place, with the place name in the first line.\n- Wednesday: a Reel under 15 seconds showing one moment from a shoot.\n- Saturday: your strongest single photo with a short story in the caption.\nPost when your audience is most active, and reply to every comment in the first hour.', followUps: ['Write the Monday caption', 'Check a post before I share it'] },
  },
  unfollowPace: {
    q: ['Is it safe to unfollow 10 accounts a day?'],
    a: { answer: 'Instagram does not publish exact limits, so nobody can promise a safe number. Ten a day, by hand, spread across the day, is a slow and conservative pace that looks like normal use.\n- Never use apps that unfollow for you or ask for your password: that is what gets accounts restricted.\n- If Instagram shows an "action blocked" message, stop for a few days and start again more slowly.\n- Start with old follows that never followed back; Results sorts them for you.', followUps: ['Who should I unfollow first?', 'Does unfollowing hurt my reach?'] },
  },
  lostFollowers: {
    q: ['Why did I lose followers?'],
    a: { answer: 'Some loss is normal on every account: people clean up their lists, and inactive or fake accounts get removed by Instagram.\n- Compare two exports in History to see exactly who left and when.\n- If many left right after one post, that post probably reached people outside your usual audience.\n- Steady small losses usually mean people stopped seeing your posts. Posting a bit more often brings them back into the feed.', followUps: ['Show me who left', 'How do I keep followers?'] },
  },
  bestTime: {
    q: ['Best time to post'],
    a: { answer: 'There is no single best time for everyone. The best time is when your own followers are online.\n- Instagram shows it under Insights, Total followers, Most active times, for professional accounts.\n- Post 30 to 60 minutes before that peak so the post is ready when people arrive.\n- Keep the time steady for two weeks before changing it, so you can see if it helped.', followUps: ['Plan my week around that', 'What should I post first?'] },
  },
  bio: {
    q: ['Rewrite my bio'],
    a: { answer: 'A good bio tells a new visitor in one glance what they will get by following. A version for this account:\n- "Street and travel photography. One place, one story, every week. Prints below."\nKeep the first line about what you post, not about you, and end with one clear action.', followUps: ['Give me two more options', 'Make it shorter'] },
  },
};

const ES: Record<AskTopic, { q: string[]; a: Answer }> = {
  followBack: { q: ['¿Mi tasa de seguimiento mutuo es buena?'], a: { answer: 'Tu tasa de seguimiento mutuo es la parte de las cuentas que sigues que te siguen de vuelta. En esta cuenta es del 76%, así que unas tres de cada cuatro son mutuas.\n- Es una buena señal: la mayoría de las cuentas que sigues te conocen o siguen tu trabajo.\n- Las que nunca te siguieron de vuelta están en Resultados. Ordénalas de más antiguas a más nuevas: son las más fáciles de limpiar.\nUna tasa alta no hace crecer la cuenta por sí sola. Los nuevos seguidores llegan con publicaciones que alcanzan a gente que aún no te conoce.', followUps: ['¿A quién dejo de seguir primero?', '¿Cómo llego a gente nueva?'] } },
  slowdown: { q: ['¿Por qué se frenó el crecimiento este mes?'], a: { answer: 'Al comparar tus dos últimas exportaciones, este mes te siguieron menos personas y se fueron algunas más. Las dos razones más claras en esta cuenta:\n- Publicaste menos que el mes anterior, así que menos gente fuera de tus seguidores te vio.\n- Tus mejores meses tuvieron carruseles sobre lugares concretos; este mes hubo más fotos sueltas.\nPrueba dos carruseles esta semana como los mejores y compara con tu próxima exportación.', followUps: ['¿Qué hizo funcionar mis mejores posts?', 'Planifica esta semana'] } },
  postWeek: { q: ['¿Qué publico esta semana?'], a: { answer: 'Tres publicaciones, basadas en lo que ya te funciona:\n- Lunes: un carrusel sobre un lugar, con su nombre en la primera línea.\n- Miércoles: un Reel de menos de 15 segundos con un momento de una sesión.\n- Sábado: tu mejor foto suelta con una historia corta en el texto.\nPublica cuando tu audiencia está más activa y responde todos los comentarios en la primera hora.', followUps: ['Escribe el texto del lunes', 'Revisa un post antes de publicarlo'] } },
  unfollowPace: { q: ['¿Es seguro dejar de seguir 10 cuentas al día?'], a: { answer: 'Instagram no publica límites exactos, así que nadie puede prometer un número seguro. Diez al día, a mano y repartidas durante el día, es un ritmo lento y prudente que parece un uso normal.\n- Nunca uses apps que dejan de seguir por ti o piden tu contraseña: eso es lo que hace que restrinjan cuentas.\n- Si Instagram muestra un aviso de acción bloqueada, para unos días y vuelve más despacio.\n- Empieza por los seguimientos antiguos que nunca te siguieron; Resultados los ordena por ti.', followUps: ['¿A quién dejo de seguir primero?', '¿Dejar de seguir afecta mi alcance?'] } },
  lostFollowers: { q: ['¿Por qué perdí seguidores?'], a: { answer: 'Perder algunos seguidores es normal en toda cuenta: la gente limpia sus listas e Instagram elimina cuentas inactivas o falsas.\n- Compara dos exportaciones en Historial para ver exactamente quién se fue y cuándo.\n- Si se fueron muchos justo después de un post, probablemente llegó a gente fuera de tu audiencia habitual.\n- Pérdidas pequeñas y constantes suelen indicar que la gente dejó de ver tus posts. Publicar un poco más a menudo te devuelve a su feed.', followUps: ['Muéstrame quién se fue', '¿Cómo mantengo a mis seguidores?'] } },
  bestTime: { q: ['Mejor hora para publicar'], a: { answer: 'No hay una hora ideal para todos. La mejor hora es cuando tus propios seguidores están conectados.\n- Instagram la muestra en Estadísticas, Total de seguidores, Momentos de más actividad, en cuentas profesionales.\n- Publica de 30 a 60 minutos antes de ese pico para que el post esté listo cuando lleguen.\n- Mantén la misma hora dos semanas antes de cambiarla, para ver si ayudó.', followUps: ['Planifica mi semana con eso', '¿Qué publico primero?'] } },
  bio: { q: ['Reescribir mi bio'], a: { answer: 'Una buena bio le dice a quien llega, de un vistazo, qué obtiene al seguirte. Una versión para esta cuenta:\n- "Fotografía urbana y de viajes. Un lugar, una historia, cada semana. Copias abajo."\nQue la primera línea hable de lo que publicas, no de ti, y termina con una acción clara.', followUps: ['Dame dos opciones más', 'Hazla más corta'] } },
};

const PT: Record<AskTopic, { q: string[]; a: Answer }> = {
  followBack: { q: ['Minha taxa de retorno de follow é boa?'], a: { answer: 'Sua taxa de retorno é a parte das contas que você segue que seguem você de volta. Nesta conta é de 76%, então cerca de três em cada quatro são mútuas.\n- É um bom sinal: a maioria das contas que você segue conhece você ou acompanha seu trabalho.\n- As que nunca seguiram de volta estão em Resultados. Ordene das mais antigas para as mais novas: são as mais fáceis de limpar.\nUma taxa alta não faz a conta crescer sozinha. Novos seguidores vêm de posts que alcançam quem ainda não conhece você.', followUps: ['Quem devo deixar de seguir primeiro?', 'Como alcanço pessoas novas?'] } },
  slowdown: { q: ['Por que o crescimento desacelerou este mês?'], a: { answer: 'Comparando suas duas últimas exportações, menos pessoas seguiram você este mês e algumas a mais saíram. Os dois motivos mais claros nesta conta:\n- Você postou menos que no mês anterior, então menos gente fora dos seus seguidores viu você.\n- Seus melhores meses tiveram carrosséis sobre lugares específicos; este mês teve mais fotos soltas.\nTeste dois carrosséis esta semana como os melhores e compare com sua próxima exportação.', followUps: ['O que fez meus melhores posts funcionarem?', 'Planeje esta semana'] } },
  postWeek: { q: ['O que devo postar esta semana?'], a: { answer: 'Três posts, com base no que já funciona para você:\n- Segunda: um carrossel sobre um lugar, com o nome dele na primeira linha.\n- Quarta: um Reel com menos de 15 segundos mostrando um momento de um ensaio.\n- Sábado: sua melhor foto solta com uma história curta na legenda.\nPoste quando seu público está mais ativo e responda todos os comentários na primeira hora.', followUps: ['Escreva a legenda de segunda', 'Revise um post antes de publicar'] } },
  unfollowPace: { q: ['É seguro deixar de seguir 10 contas por dia?'], a: { answer: 'O Instagram não publica limites exatos, então ninguém pode prometer um número seguro. Dez por dia, à mão e espalhadas ao longo do dia, é um ritmo lento e prudente que parece uso normal.\n- Nunca use apps que deixam de seguir por você ou pedem sua senha: é isso que faz contas serem restringidas.\n- Se o Instagram mostrar um aviso de ação bloqueada, pare por alguns dias e volte mais devagar.\n- Comece pelas contas antigas que nunca seguiram de volta; Resultados as ordena para você.', followUps: ['Quem devo deixar de seguir primeiro?', 'Deixar de seguir afeta meu alcance?'] } },
  lostFollowers: { q: ['Por que perdi seguidores?'], a: { answer: 'Perder alguns seguidores é normal em toda conta: as pessoas limpam suas listas e o Instagram remove contas inativas ou falsas.\n- Compare duas exportações em Histórico para ver exatamente quem saiu e quando.\n- Se muitos saíram logo depois de um post, ele provavelmente alcançou pessoas fora do seu público habitual.\n- Perdas pequenas e constantes costumam significar que as pessoas pararam de ver seus posts. Postar um pouco mais vezes traz você de volta ao feed delas.', followUps: ['Mostre quem saiu', 'Como mantenho meus seguidores?'] } },
  bestTime: { q: ['Melhor horário para postar'], a: { answer: 'Não existe um horário ideal para todo mundo. O melhor horário é quando os seus seguidores estão online.\n- O Instagram mostra isso em Insights, Total de seguidores, Horários mais ativos, em contas profissionais.\n- Poste de 30 a 60 minutos antes desse pico para o post estar pronto quando as pessoas chegarem.\n- Mantenha o mesmo horário por duas semanas antes de mudar, para ver se ajudou.', followUps: ['Planeje minha semana com isso', 'O que posto primeiro?'] } },
  bio: { q: ['Reescrever minha bio'], a: { answer: 'Uma boa bio diz a quem chega, num relance, o que ganha ao seguir você. Uma versão para esta conta:\n- "Fotografia de rua e de viagem. Um lugar, uma história, toda semana. Prints abaixo."\nDeixe a primeira linha sobre o que você posta, não sobre você, e termine com uma ação clara.', followUps: ['Me dê mais duas opções', 'Deixe mais curta'] } },
};

const BY: Record<string, Record<AskTopic, { q: string[]; a: Answer }>> = { en: EN, es: ES, pt: PT };
const norm = (s: string) => s.trim().toLowerCase().replace(/[¿?¡!.\s]+/g, ' ').trim();

// The written answer for a starter question, or null for anything else.
export function staticAskAnswer(locale: string, question: string): Answer | null {
  const n = norm(question);
  for (const table of [BY[locale] ?? EN, EN, ES, PT]) {
    for (const t of Object.values(table)) if (t.q.some((q) => norm(q) === n)) return t.a;
  }
  return null;
}
