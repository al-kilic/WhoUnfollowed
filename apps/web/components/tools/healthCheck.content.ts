import type { HealthCheckId } from '@ig-tracker/core';
import type { AppLocale } from '@/i18n/routing';

// Copy for the account health check. Each finding has a headline with the
// real numbers and one action. {app} is the platform name. No em dashes.
export interface HealthCheckContent {
  label: string;
  title: string;
  sub: string;
  summary: (n: number) => string;
  allClear: string;
  showAccounts: (n: number) => string;
  hideAccounts: string;
  copyList: string;
  copied: string;
  more: (n: number) => string;
  checks: Record<HealthCheckId, { title: string; action: string }>;
}

const en: HealthCheckContent = {
  label: 'Health check',
  title: 'What to fix, in order',
  sub: 'Every check runs on your own export, in this browser. Biggest impact first.',
  summary: n => (n === 1 ? '1 thing worth fixing' : `${n} things worth fixing`),
  allClear: 'Nothing to fix right now. Check again after your next export.',
  showAccounts: n => `Show the ${n}`,
  hideAccounts: 'Hide',
  copyList: 'Copy usernames',
  copied: 'Copied',
  more: n => `and ${n} more`,
  checks: {
    stale_pending: { title: '{count} follow requests have waited {months}+ months', action: 'Cancel them. After six months they are not going to accept, and the request just sits there.' },
    follow_back_gap_year: { title: 'Of the {total} accounts you followed in {year}, {count} never followed back ({pct}%)', action: 'That year was a follow-for-follow that didn\'t work. Start your cleanup there.' },
    old_one_way: { title: '{count} accounts you followed 2+ years ago never followed back', action: 'After two years they won\'t. Unfollowing them is the safest cleanup there is.' },
    sudden_drop: { title: 'You lost {count} followers ({pct}%) in {days} days', action: 'Look at what you posted in that window. A drop this size usually follows one post or a long pause.' },
    mutuals_lost: { title: '{count} people who followed each other with you stopped following you', action: 'These were mutuals, not strangers. Check the list: some may be worth a message, the rest you can unfollow back.' },
    follow_burst: { title: 'On {date} you followed {count} accounts in one day. {followedBack} followed back', action: '{app} watches for bursts like this. Spread follows over days, not one sitting.' },
    fans_unanswered: { title: '{count} people followed you this month and you didn\'t follow back', action: 'Follow back the ones you know. Mutuals stay longer than fans.' },
    ratio_imbalance: { title: 'You follow {following} and {followers} follow you', action: 'Profiles that follow far more than follow them look spammy to new visitors. Your {oneWay} one-way follows are where to start.' },
    following_limit: { title: 'You follow {following} of the {cap} {app} allows', action: 'Only {left} follows left before {app} blocks new ones. Clear some of your {oneWay} one-way follows first.' },
    second_export: { title: 'Upload a second export to unlock the rest', action: 'Drops, lost mutuals and who left all need two exports to compare. Request a new one in 2 weeks.' },
  },
};

const es: HealthCheckContent = {
  label: 'Chequeo de salud',
  title: 'Qué arreglar, en orden',
  sub: 'Cada chequeo se hace con tu propia exportación, en este navegador. Primero lo que más impacta.',
  summary: n => (n === 1 ? '1 cosa que vale la pena arreglar' : `${n} cosas que vale la pena arreglar`),
  allClear: 'Nada que arreglar por ahora. Revisa otra vez después de tu próxima exportación.',
  showAccounts: n => `Ver las ${n}`,
  hideAccounts: 'Ocultar',
  copyList: 'Copiar usuarios',
  copied: 'Copiado',
  more: n => `y ${n} más`,
  checks: {
    stale_pending: { title: '{count} solicitudes de seguimiento llevan {months}+ meses esperando', action: 'Cancélalas. Después de seis meses no las van a aceptar, y la solicitud solo se queda ahí.' },
    follow_back_gap_year: { title: 'De las {total} cuentas que seguiste en {year}, {count} nunca te siguieron ({pct}%)', action: 'Ese año fue un follow por follow que no funcionó. Empieza la limpieza por ahí.' },
    old_one_way: { title: '{count} cuentas que seguiste hace 2+ años nunca te siguieron', action: 'Después de dos años no lo harán. Dejarlas de seguir es la limpieza más segura.' },
    sudden_drop: { title: 'Perdiste {count} seguidores ({pct}%) en {days} días', action: 'Mira qué publicaste en ese periodo. Una caída así suele venir de una publicación o de una pausa larga.' },
    mutuals_lost: { title: '{count} personas que se seguían contigo dejaron de seguirte', action: 'Eran mutuos, no desconocidos. Revisa la lista: a algunos quizá valga la pena escribirles, al resto puedes dejarlos de seguir.' },
    follow_burst: { title: 'El {date} seguiste {count} cuentas en un día. {followedBack} te siguieron', action: '{app} vigila ráfagas así. Reparte los follows en varios días, no en una sola sesión.' },
    fans_unanswered: { title: '{count} personas te siguieron este mes y no las seguiste', action: 'Sigue a las que conoces. Los mutuos se quedan más que los fans.' },
    ratio_imbalance: { title: 'Sigues a {following} y te siguen {followers}', action: 'Los perfiles que siguen a muchos más de los que los siguen parecen spam. Empieza por tus {oneWay} follows de un solo lado.' },
    following_limit: { title: 'Sigues a {following} de las {cap} que permite {app}', action: 'Solo te quedan {left} follows antes de que {app} bloquee nuevos. Limpia primero algunos de tus {oneWay} follows de un solo lado.' },
    second_export: { title: 'Sube una segunda exportación para ver el resto', action: 'Caídas, mutuos perdidos y quién se fue necesitan dos exportaciones para comparar. Pide una nueva en 2 semanas.' },
  },
};

const pt: HealthCheckContent = {
  label: 'Check-up da conta',
  title: 'O que arrumar, em ordem',
  sub: 'Cada verificação roda na sua própria exportação, neste navegador. O que mais pesa primeiro.',
  summary: n => (n === 1 ? '1 coisa que vale arrumar' : `${n} coisas que vale arrumar`),
  allClear: 'Nada para arrumar agora. Confira de novo depois da próxima exportação.',
  showAccounts: n => `Ver as ${n}`,
  hideAccounts: 'Ocultar',
  copyList: 'Copiar usuários',
  copied: 'Copiado',
  more: n => `e mais ${n}`,
  checks: {
    stale_pending: { title: '{count} pedidos para seguir esperam há {months}+ meses', action: 'Cancele. Depois de seis meses não vão aceitar, e o pedido só fica parado lá.' },
    follow_back_gap_year: { title: 'Das {total} contas que você seguiu em {year}, {count} nunca seguiram de volta ({pct}%)', action: 'Aquele ano foi um sigo-de-volta que não deu certo. Comece a limpeza por ali.' },
    old_one_way: { title: '{count} contas que você seguiu há 2+ anos nunca seguiram de volta', action: 'Depois de dois anos, não vão seguir. Deixar de seguir essas é a limpeza mais segura.' },
    sudden_drop: { title: 'Você perdeu {count} seguidores ({pct}%) em {days} dias', action: 'Veja o que você postou nesse período. Uma queda assim costuma vir de um post ou de uma pausa longa.' },
    mutuals_lost: { title: '{count} pessoas que se seguiam com você deixaram de te seguir', action: 'Eram mútuos, não desconhecidos. Veja a lista: com alguns vale conversar, o resto você pode deixar de seguir.' },
    follow_burst: { title: 'Em {date} você seguiu {count} contas num dia só. {followedBack} seguiram de volta', action: 'O {app} fica de olho nesse tipo de rajada. Espalhe os follows por vários dias, não numa sessão só.' },
    fans_unanswered: { title: '{count} pessoas te seguiram este mês e você não seguiu de volta', action: 'Siga de volta quem você conhece. Mútuos ficam mais que fãs.' },
    ratio_imbalance: { title: 'Você segue {following} e {followers} te seguem', action: 'Perfis que seguem muito mais do que são seguidos parecem spam. Comece pelos seus {oneWay} follows de mão única.' },
    following_limit: { title: 'Você segue {following} das {cap} que o {app} permite', action: 'Restam só {left} follows antes do {app} bloquear novos. Limpe antes alguns dos seus {oneWay} follows de mão única.' },
    second_export: { title: 'Envie uma segunda exportação para ver o resto', action: 'Quedas, mútuos perdidos e quem saiu precisam de duas exportações para comparar. Peça uma nova em 2 semanas.' },
  },
};

const all: Record<AppLocale, HealthCheckContent> = { en, es, pt };
export const getHealthCheckContent = (locale: AppLocale) => all[locale];
