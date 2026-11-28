import type { AppLocale } from '@/i18n/routing';

export interface RadarPagesContent {
  sub: { overview: string; fixes: string; growth: string; people: string };
  lock: { fixes: string; growth: string; people: string };
  why: { title: string; body: string; points: string[] };
  bench: { title: string; body: string; points: string[] };
  fx: { hint: string; impact: (l: string) => string; accounts: (n: number) => string; ask: string; people: string; allClear: string };
  pp: { who: string; followers: (n: string) => string; mutuals: string; oneWay: string; fans: string; waiting: string; never: (n: string) => string; buckets: string[]; tap: string; pendingTitle: string; pendingSub: string };
  ov: { wrapKicker: string; wrapTitle: string; wrapSub: string; verdictSub: string; today: string };
  gr: { title: string; since: (n: string) => string; exports: (n: number) => string; gained: string; lost: string; net: string; best: string; ratio: string; perEvery: (n: string) => string; perEveryMore: (n: string) => string; followers: string; following: string; ratioLine: (a: string, b: string) => string; left: string; leftLine: (n: number, shown: string) => string; newL: string; leftL: string; arrived: string; arrivedLine: (pct: number) => string; needTwo: string };
}

const EN: RadarPagesContent = {
  pp: { who: 'Your circle', followers: (n) => `${n} accounts`, mutuals: 'Mutuals', oneWay: "You follow, they don't", fans: 'Fans', waiting: "How long you've been waiting", never: (n) => `${n} never followed back`, buckets: ['Under 3 months', '3 to 12 months', '1 to 3 years', '3+ years', 'No date'], tap: 'Open Results to review them.', pendingTitle: 'Pending requests: sent, not accepted', pendingSub: 'Follow requests you sent to private accounts that never accepted them.' },
  ov: { wrapKicker: 'Last three months', wrapTitle: 'Your 3-month wrap', wrapSub: 'Who arrived, your best week and your verdict, in a few slides.', verdictSub: 'One card that sums you up. Sized for a story, with no usernames on it.', today: 'today' },
  sub: {
    overview: 'What your latest export says about your audience. Counts only, worked out in this browser.',
    fixes: 'Every fixable pattern in the accounts you follow, ranked by impact.',
    growth: 'How your followers changed over time.',
    people: 'Who is in your audience, and who you are still waiting on.',
  },
  lock: {
    fixes: 'The first two fixes are free. The rest, and the accounts behind them, come with Pro AI.',
    growth: 'These charts are drawn from your own exports. The numbers unlock with Pro AI.',
    people: 'The counts are real. Usernames stay hidden until you unlock them.',
  },
  why: {
    title: 'Why they left',
    body: 'For each person who unfollowed you, a likely reason, worked out in your browser from your full export.',
    points: ['Left after a specific post', 'Follow-for-follow accounts that dropped you', 'Accounts that went inactive'],
  },
  bench: {
    title: 'Benchmarks',
    body: 'How your numbers compare with accounts like yours, from anonymous totals that people choose to share.',
    points: ['Follow-back rate against your niche', 'Growth per month against similar accounts', 'Nothing is collected unless you opt in'],
  },
  fx: { hint: 'Every fixable pattern, ranked. The closer to the center, the bigger the impact.', impact: (l) => `${l} impact`, accounts: (n) => `${n.toLocaleString()} ${n === 1 ? 'account' : 'accounts'}`, ask: 'Ask the coach', people: 'Open People', allClear: 'Nothing to fix right now. Check again after your next export.' },
  gr: { title: 'Follower growth over time', since: (n) => `${n} since your first export`, exports: (n) => `${n} ${n === 1 ? 'export' : 'exports'}`, gained: 'Gained', lost: 'Lost', net: 'Net', best: 'Best month', ratio: 'Followers vs following', perEvery: (n) => `1 for every ${n} followers`, perEveryMore: (n) => `${n} for every follower`, followers: 'Followers', following: 'Following', ratioLine: (a, b) => `You follow ${b} accounts and ${a} follow you.`, left: 'Who left', leftLine: (n, shown) => (n ? `${shown} left since your last export.` : 'Nobody left since your last export.'), newL: 'new', leftL: 'left', arrived: 'When your followers arrived', arrivedLine: (p) => `${p}% of today's followers arrived in the last 12 months.`, needTwo: 'Add a second export to see gains and losses.' },
};

const ES: RadarPagesContent = {
  pp: { who: 'Tu círculo', followers: (n) => `${n} cuentas`, mutuals: 'Mutuos', oneWay: 'Los sigues, no te siguen', fans: 'Fans', waiting: 'Cuánto llevas esperando', never: (n) => `${n} nunca te siguieron`, buckets: ['Menos de 3 meses', '3 a 12 meses', '1 a 3 años', 'Más de 3 años', 'Sin fecha'], tap: 'Abre Resultados para revisarlos.', pendingTitle: 'Solicitudes pendientes: enviadas, no aceptadas', pendingSub: 'Solicitudes que enviaste a cuentas privadas y que nunca aceptaron.' },
  ov: { wrapKicker: 'Últimos tres meses', wrapTitle: 'Tu resumen de 3 meses', wrapSub: 'Quién llegó, tu mejor semana y tu veredicto, en unas diapositivas.', verdictSub: 'Una tarjeta que te resume. Del tamaño de una historia, sin nombres de usuario.', today: 'hoy' },
  sub: {
    overview: 'Lo que dice tu última exportación sobre tu audiencia. Solo cifras, calculadas en este navegador.',
    fixes: 'Cada patrón que puedes arreglar en las cuentas que sigues, ordenado por impacto.',
    growth: 'Cómo cambiaron tus seguidores con el tiempo.',
    people: 'Quién forma tu audiencia y a quién sigues esperando.',
  },
  lock: {
    fixes: 'Los dos primeros arreglos son gratis. El resto, y las cuentas detrás, llegan con Pro AI.',
    growth: 'Estos gráficos salen de tus propias exportaciones. Las cifras se desbloquean con Pro AI.',
    people: 'Las cifras son reales. Los nombres de usuario siguen ocultos hasta que los desbloquees.',
  },
  why: {
    title: 'Por qué se fueron',
    body: 'Para cada persona que dejó de seguirte, una razón probable, calculada en tu navegador a partir de tu exportación completa.',
    points: ['Se fue después de una publicación concreta', 'Cuentas de follow-for-follow que te dejaron', 'Cuentas que quedaron inactivas'],
  },
  bench: {
    title: 'Comparativas',
    body: 'Cómo se comparan tus cifras con cuentas como la tuya, a partir de totales anónimos que la gente decide compartir.',
    points: ['Tasa de seguimiento mutuo frente a tu nicho', 'Crecimiento mensual frente a cuentas similares', 'No se recoge nada salvo que aceptes'],
  },
  fx: { hint: 'Cada patrón que puedes arreglar, en orden. Cuanto más cerca del centro, mayor impacto.', impact: (l) => `Impacto ${l.toLowerCase()}`, accounts: (n) => `${n.toLocaleString('es')} ${n === 1 ? 'cuenta' : 'cuentas'}`, ask: 'Preguntar al coach', people: 'Abrir Personas', allClear: 'Nada que arreglar ahora. Vuelve a mirar tras tu próxima exportación.' },
  gr: { title: 'Crecimiento de seguidores', since: (n) => `${n} desde tu primera exportación`, exports: (n) => `${n} ${n === 1 ? 'exportación' : 'exportaciones'}`, gained: 'Ganados', lost: 'Perdidos', net: 'Neto', best: 'Mejor mes', ratio: 'Seguidores y seguidos', perEvery: (n) => `1 por cada ${n} seguidores`, perEveryMore: (n) => `${n} por cada seguidor`, followers: 'Seguidores', following: 'Seguidos', ratioLine: (a, b) => `Sigues a ${b} cuentas y te siguen ${a}.`, left: 'Quién se fue', leftLine: (n, shown) => (n ? `${shown} se fueron desde tu última exportación.` : 'Nadie se fue desde tu última exportación.'), newL: 'nuevos', leftL: 'se fueron', arrived: 'Cuándo llegaron tus seguidores', arrivedLine: (p) => `El ${p}% de tus seguidores de hoy llegó en los últimos 12 meses.`, needTwo: 'Añade una segunda exportación para ver altas y bajas.' },
};

const PT: RadarPagesContent = {
  pp: { who: 'Seu círculo', followers: (n) => `${n} contas`, mutuals: 'Mútuos', oneWay: 'Você segue, eles não', fans: 'Fãs', waiting: 'Há quanto tempo você espera', never: (n) => `${n} nunca seguiram de volta`, buckets: ['Menos de 3 meses', '3 a 12 meses', '1 a 3 anos', 'Mais de 3 anos', 'Sem data'], tap: 'Abra Resultados para revisar.', pendingTitle: 'Pedidos pendentes: enviados, não aceitos', pendingSub: 'Pedidos que você enviou para contas privadas e que nunca foram aceitos.' },
  ov: { wrapKicker: 'Últimos três meses', wrapTitle: 'Sua retrospectiva de 3 meses', wrapSub: 'Quem chegou, sua melhor semana e seu veredito, em poucos slides.', verdictSub: 'Um cartão que resume você. No tamanho de um story, sem nomes de usuário.', today: 'hoje' },
  sub: {
    overview: 'O que sua última exportação diz sobre seu público. Só números, calculados neste navegador.',
    fixes: 'Cada padrão que dá para ajustar nas contas que você segue, ordenado por impacto.',
    growth: 'Como seus seguidores mudaram ao longo do tempo.',
    people: 'Quem está no seu público e por quem você ainda espera.',
  },
  lock: {
    fixes: 'Os dois primeiros ajustes são grátis. O resto, e as contas por trás, vêm com o Pro AI.',
    growth: 'Estes gráficos vêm das suas próprias exportações. Os números são liberados com o Pro AI.',
    people: 'Os números são reais. Os nomes de usuário ficam ocultos até você liberar.',
  },
  why: {
    title: 'Por que saíram',
    body: 'Para cada pessoa que deixou de seguir você, um motivo provável, calculado no seu navegador a partir da exportação completa.',
    points: ['Saiu depois de um post específico', 'Contas de follow-for-follow que deixaram você', 'Contas que ficaram inativas'],
  },
  bench: {
    title: 'Comparativos',
    body: 'Como seus números se comparam com contas parecidas, a partir de totais anônimos que as pessoas escolhem compartilhar.',
    points: ['Taxa de retorno de follow frente ao seu nicho', 'Crescimento mensal frente a contas parecidas', 'Nada é coletado sem a sua permissão'],
  },
  fx: { hint: 'Cada padrão que dá para ajustar, em ordem. Quanto mais perto do centro, maior o impacto.', impact: (l) => `Impacto ${l.toLowerCase()}`, accounts: (n) => `${n.toLocaleString('pt')} ${n === 1 ? 'conta' : 'contas'}`, ask: 'Perguntar ao coach', people: 'Abrir Pessoas', allClear: 'Nada para ajustar agora. Confira de novo depois da próxima exportação.' },
  gr: { title: 'Crescimento de seguidores', since: (n) => `${n} desde a primeira exportação`, exports: (n) => `${n} ${n === 1 ? 'exportação' : 'exportações'}`, gained: 'Ganhos', lost: 'Perdidos', net: 'Líquido', best: 'Melhor mês', ratio: 'Seguidores e seguindo', perEvery: (n) => `1 para cada ${n} seguidores`, perEveryMore: (n) => `${n} para cada seguidor`, followers: 'Seguidores', following: 'Seguindo', ratioLine: (a, b) => `Você segue ${b} contas e ${a} seguem você.`, left: 'Quem saiu', leftLine: (n, shown) => (n ? `${shown} saíram desde a última exportação.` : 'Ninguém saiu desde a última exportação.'), newL: 'novos', leftL: 'saíram', arrived: 'Quando seus seguidores chegaram', arrivedLine: (p) => `${p}% dos seguidores de hoje chegaram nos últimos 12 meses.`, needTwo: 'Adicione uma segunda exportação para ver ganhos e perdas.' },
};

export function getRadarPagesContent(locale: AppLocale): RadarPagesContent {
  return locale === 'es' ? ES : locale === 'pt' ? PT : EN;
}
