import type { AppLocale } from '@/i18n/routing';

// The compact cards, the Pro AI perks further down the page and the full
// comparison table (Nov 2026 redesign). Claims only repeat what the plan lists
// in content.ts already say; no numbers that are not real.
export type Cell = boolean | string;
export type PerkKind = 'coach' | 'check' | 'voice' | 'plan' | 'left' | 'radar';

export interface PricingMore {
  freeFor: string;
  proFor: string;
  lifeFor: string;
  freeTop: string[];
  proTop: string[];
  lifeTop: string[];
  compareLink: string;
  perksTitle: string;
  perksSub: string;
  perks: { kind: PerkKind; h: string; p: string }[];
  compareTitle: string;
  cols: { feature: string; free: string; pro: string; life: string };
  groups: { label: string; rows: { label: string; free: Cell; pro: Cell; life: Cell }[] }[];
  yes: string;
  no: string;
  stickyNote: string;
  // Small labelled examples inside the perk pictures. Never real numbers or
  // real usernames: placeholder handles, words instead of figures.
  sample: {
    coachQ: string;
    coachA: string;
    checkTitle: string;
    checkBadge: string;
    checkFixes: string[];
    checkOk: string;
    voiceTabs: string[];
    voiceText: string;
    planDays: string[];
    planTypes: { reel: string; carousel: string; photo: string };
    leftTitle: string;
    leftTag: string;
    radarTitle: string;
    radarX: string[];
    radarY: string;
  };
}

const EN: PricingMore = {
  freeFor: 'For a quick check of who does not follow you back.',
  proFor: 'For growing your account with a coach that knows it.',
  lifeFor: 'Pay once. Pro AI, the base plan, is yours for life.',
  freeTop: ['Works with Instagram, Threads and TikTok', "Who doesn't follow you back, today", 'Sort the list: keep, unfollow, decide later', 'No account needed'],
  proTop: ['A coach that remembers your account', 'Drafts in your voice', 'Checks a post before you share it', 'See exactly who unfollowed you, and when'],
  lifeTop: ['Pro AI, the base plan, for life', 'Pay once, nothing to renew', 'Founding Insider club', 'Insider badge and title on your account'],
  compareLink: 'Compare every feature',
  perksTitle: 'What Pro AI does for you',
  perksSub: 'Everything below is in the plan, from the first day.',
  perks: [
    { kind: 'coach', h: 'A coach that remembers your account', p: 'Ask anything. It knows your exports, your memory and the posts you checked, so the answer is about your account. You can read and edit what it remembers.' },
    { kind: 'check', h: 'Check a post before you share it', p: 'Send a draft or a photo and get clear fixes before it goes live.' },
    { kind: 'voice', h: 'Drafts in your voice', p: 'Hooks, captions and Reel scripts written the way you write, learned from your own posts.' },
    { kind: 'plan', h: 'A 30-day post plan for your niche', p: 'A month of posts built around your audience, that you can change in plain words.' },
    { kind: 'left', h: 'See exactly who unfollowed you, and when', p: 'Every export is kept and each new one is compared for you, so you see who left since last time.' },
    { kind: 'radar', h: 'Radar', p: 'Ghost followers, follow age and old requests, so you know who is really there.' },
  ],
  compareTitle: 'Compare every feature',
  cols: { feature: 'Feature', free: 'Free', pro: 'Pro AI', life: 'Lifetime' },
  groups: [
    { label: 'Your follower lists', rows: [
      { label: 'Follower lists for Instagram, Threads and TikTok', free: true, pro: true, life: true },
      { label: "Who doesn't follow you back, today", free: true, pro: true, life: true },
      { label: 'Sort the list: keep, unfollow, decide later', free: true, pro: true, life: true },
      { label: "Reminder emails when it's time to check again", free: true, pro: true, life: true },
      { label: 'Exports kept and compared', free: 'One snapshot at a time', pro: 'Unlimited history', life: 'Unlimited history' },
      { label: 'CSV exports', free: 'One CSV export', pro: 'Unlimited, every list', life: 'Unlimited, every list' },
      { label: 'See exactly who unfollowed you, and when', free: false, pro: true, life: true },
      { label: 'Radar: ghost followers, follow age, old requests', free: false, pro: true, life: true },
      { label: 'Cloud sync across all your devices, encrypted in your browser', free: false, pro: true, life: true },
      { label: 'No account needed', free: true, pro: false, life: false },
    ] },
    { label: 'Your coach', rows: [
      { label: 'A coach that remembers your account, with editable memory', free: false, pro: true, life: true },
      { label: 'Drafts hooks, captions and Reel scripts in your voice (Instagram)', free: false, pro: true, life: true },
      { label: 'Checks an Instagram post before you share it, with fixes', free: false, pro: true, life: true },
      { label: 'A 30-day Instagram post plan for your niche', free: false, pro: true, life: true },
      { label: 'An AI read of every new export, on every platform', free: false, pro: true, life: true },
      { label: 'Generous monthly coach use, resets every month', free: false, pro: true, life: true },
      { label: 'Never your followers or their usernames sent to AI', free: true, pro: true, life: true },
      { label: 'Ebooks on growing your account', free: false, pro: 'On yearly', life: false },
    ] },
    { label: 'Lifetime extras', rows: [
      { label: 'Pay once, no expiry, no renewals', free: false, pro: false, life: true },
      { label: 'Every Pro feature we add later, included', free: false, pro: true, life: true },
      { label: 'Founding Insider club: a private group that opens at 10 members, with perks like generous affiliate rates', free: false, pro: false, life: true },
      { label: 'Pro features on future Alcatraz Studio tools (their AI features are not included)', free: false, pro: false, life: true },
      { label: 'First to hear about new launches', free: false, pro: false, life: true },
      { label: 'Insider badge and title on your account', free: false, pro: false, life: true },
    ] },
  ],
  yes: 'Included',
  no: 'Not included',
  stickyNote: 'Cancel any time',
  sample: {
    coachQ: 'What should I post this week?',
    coachA: "Your best posts name the place in the first line. Try it on Friday's post.",
    checkTitle: 'Post check',
    checkBadge: 'Ready after 2 fixes',
    checkFixes: ['Open with what went wrong: "My roll came out green."', 'Add one slide with the fix and end with a question'],
    checkOk: 'The look fits what your followers came for',
    voiceTabs: ['Hook', 'Caption', 'Reel script'],
    voiceText: '"My Sintra roll came out green. Here is the fix."',
    planDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    planTypes: { reel: 'Reel', carousel: 'Carousel', photo: 'Photo' },
    leftTitle: 'Unfollowed you since your last export',
    leftTag: 'Left',
    radarTitle: 'How long they have followed you',
    radarX: ['New', 'Months', '1 year', 'Years'],
    radarY: 'Followers',
  },
};

const ES: PricingMore = {
  freeFor: 'Para revisar rápido quién no te sigue de vuelta.',
  proFor: 'Para hacer crecer tu cuenta con un coach que la conoce.',
  lifeFor: 'Paga una vez. Pro AI, el plan base, es tuyo de por vida.',
  freeTop: ['Funciona con Instagram, Threads y TikTok', 'Quién no te sigue de vuelta, hoy', 'Ordena la lista: mantener, dejar de seguir, decidir luego', 'Sin cuenta necesaria'],
  proTop: ['Un coach que recuerda tu cuenta', 'Textos con tu voz', 'Revisa un post antes de publicarlo', 'Mira exactamente quién te dejó de seguir y cuándo'],
  lifeTop: ['Pro AI, el plan base, de por vida', 'Pagas una vez, nada que renovar', 'Club de Insiders fundadores', 'Insignia y título de Insider en tu cuenta'],
  compareLink: 'Comparar todas las funciones',
  perksTitle: 'Lo que Pro AI hace por ti',
  perksSub: 'Todo esto viene en el plan desde el primer día.',
  perks: [
    { kind: 'coach', h: 'Un coach que recuerda tu cuenta', p: 'Pregunta lo que quieras. Conoce tus exportaciones, tu memoria y los posts que revisaste, así que la respuesta es sobre tu cuenta. Puedes leer y editar lo que recuerda.' },
    { kind: 'check', h: 'Revisa un post antes de publicarlo', p: 'Envía un borrador o una foto y recibe arreglos claros antes de publicarlo.' },
    { kind: 'voice', h: 'Textos con tu voz', p: 'Ganchos, textos y guiones de Reels escritos como tú escribes, aprendidos de tus propios posts.' },
    { kind: 'plan', h: 'Un plan de 30 días para tu nicho', p: 'Un mes de publicaciones pensado para tu audiencia, que puedes cambiar con tus propias palabras.' },
    { kind: 'left', h: 'Mira exactamente quién te dejó de seguir y cuándo', p: 'Guardamos cada exportación y comparamos cada nueva por ti, así ves quién se fue desde la última vez.' },
    { kind: 'radar', h: 'Radar', p: 'Seguidores fantasma, antigüedad de los seguimientos y solicitudes viejas, para saber quién está de verdad.' },
  ],
  compareTitle: 'Comparar todas las funciones',
  cols: { feature: 'Función', free: 'Gratis', pro: 'Pro AI', life: 'Lifetime' },
  groups: [
    { label: 'Tus listas de seguidores', rows: [
      { label: 'Listas de seguidores de Instagram, Threads y TikTok', free: true, pro: true, life: true },
      { label: 'Quién no te sigue de vuelta, hoy', free: true, pro: true, life: true },
      { label: 'Ordena la lista: mantener, dejar de seguir, decidir luego', free: true, pro: true, life: true },
      { label: 'Emails de recordatorio cuando toque revisar de nuevo', free: true, pro: true, life: true },
      { label: 'Exportaciones guardadas y comparadas', free: 'Un snapshot a la vez', pro: 'Historial ilimitado', life: 'Historial ilimitado' },
      { label: 'Exportaciones CSV', free: 'Una exportación CSV', pro: 'Ilimitadas, cada lista', life: 'Ilimitadas, cada lista' },
      { label: 'Mira exactamente quién te dejó de seguir y cuándo', free: false, pro: true, life: true },
      { label: 'Radar: seguidores fantasma, antigüedad, solicitudes viejas', free: false, pro: true, life: true },
      { label: 'Sincronización en todos tus dispositivos, cifrada en tu navegador', free: false, pro: true, life: true },
      { label: 'Sin cuenta necesaria', free: true, pro: false, life: false },
    ] },
    { label: 'Tu coach', rows: [
      { label: 'Un coach que recuerda tu cuenta, con memoria editable', free: false, pro: true, life: true },
      { label: 'Escribe ganchos, textos y guiones de Reels con tu voz (Instagram)', free: false, pro: true, life: true },
      { label: 'Revisa un post de Instagram antes de publicarlo, con arreglos', free: false, pro: true, life: true },
      { label: 'Un plan de 30 días para Instagram, pensado para tu nicho', free: false, pro: true, life: true },
      { label: 'Una lectura con IA de cada exportación nueva, en todas las plataformas', free: false, pro: true, life: true },
      { label: 'Uso mensual generoso del coach, se renueva cada mes', free: false, pro: true, life: true },
      { label: 'Nunca enviamos a la IA tus seguidores ni sus nombres de usuario', free: true, pro: true, life: true },
      { label: 'Ebooks para hacer crecer tu cuenta', free: false, pro: 'En el plan anual', life: false },
    ] },
    { label: 'Extras de Lifetime', rows: [
      { label: 'Pagas una vez, sin vencimiento ni renovaciones', free: false, pro: false, life: true },
      { label: 'Cada función Pro que añadamos después, incluida', free: false, pro: true, life: true },
      { label: 'Club de Insiders fundadores: un grupo privado que abre al llegar a 10 miembros, con ventajas como comisiones de afiliado generosas', free: false, pro: false, life: true },
      { label: 'Funciones Pro en las futuras herramientas de Alcatraz Studio (sin sus funciones de IA)', free: false, pro: false, life: true },
      { label: 'Primero en enterarte de cada lanzamiento', free: false, pro: false, life: true },
      { label: 'Insignia y título de Insider en tu cuenta', free: false, pro: false, life: true },
    ] },
  ],
  yes: 'Incluido',
  no: 'No incluido',
  stickyNote: 'Cancela cuando quieras',
  sample: {
    coachQ: '¿Qué publico esta semana?',
    coachA: 'Tus mejores posts nombran el lugar en la primera línea. Pruébalo en el post del viernes.',
    checkTitle: 'Revisión del post',
    checkBadge: 'Listo tras 2 arreglos',
    checkFixes: ['Empieza con lo que salió mal: "Mi carrete salió verde."', 'Añade una diapositiva con la solución y termina con una pregunta'],
    checkOk: 'El estilo encaja con lo que buscan tus seguidores',
    voiceTabs: ['Gancho', 'Texto', 'Guion de Reel'],
    voiceText: '"Mi carrete de Sintra salió verde. Así lo arreglé."',
    planDays: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    planTypes: { reel: 'Reel', carousel: 'Carrusel', photo: 'Foto' },
    leftTitle: 'Te dejaron de seguir desde tu última exportación',
    leftTag: 'Se fue',
    radarTitle: 'Cuánto tiempo llevan siguiéndote',
    radarX: ['Nuevos', 'Meses', '1 año', 'Años'],
    radarY: 'Seguidores',
  },
};

const PT: PricingMore = {
  freeFor: 'Para conferir rápido quem não te segue de volta.',
  proFor: 'Para crescer sua conta com um coach que a conhece.',
  lifeFor: 'Pague uma vez. O Pro AI, plano base, é seu para sempre.',
  freeTop: ['Funciona com Instagram, Threads e TikTok', 'Quem não te segue de volta, hoje', 'Organize a lista: manter, deixar de seguir, decidir depois', 'Sem precisar de conta'],
  proTop: ['Um coach que lembra da sua conta', 'Textos com a sua voz', 'Checa um post antes de você publicar', 'Veja exatamente quem deixou de te seguir e quando'],
  lifeTop: ['Pro AI, o plano base, para sempre', 'Pague uma vez, nada para renovar', 'Clube de Insiders fundadores', 'Selo e título de Insider na sua conta'],
  compareLink: 'Comparar todos os recursos',
  perksTitle: 'O que o Pro AI faz por você',
  perksSub: 'Tudo isso vem no plano desde o primeiro dia.',
  perks: [
    { kind: 'coach', h: 'Um coach que lembra da sua conta', p: 'Pergunte o que quiser. Ele conhece suas exportações, sua memória e os posts que você checou, então a resposta é sobre a sua conta. Você pode ler e editar o que ele lembra.' },
    { kind: 'check', h: 'Cheque um post antes de publicar', p: 'Envie um rascunho ou uma foto e receba ajustes claros antes de publicar.' },
    { kind: 'voice', h: 'Textos com a sua voz', p: 'Ganchos, legendas e roteiros de Reels escritos do jeito que você escreve, aprendidos dos seus próprios posts.' },
    { kind: 'plan', h: 'Um plano de 30 dias para o seu nicho', p: 'Um mês de posts pensado para o seu público, que você pode mudar com as suas palavras.' },
    { kind: 'left', h: 'Veja exatamente quem deixou de te seguir e quando', p: 'Cada exportação fica guardada e cada nova é comparada para você, então você vê quem saiu desde a última vez.' },
    { kind: 'radar', h: 'Radar', p: 'Seguidores fantasmas, tempo de follow e pedidos antigos, para saber quem está lá de verdade.' },
  ],
  compareTitle: 'Comparar todos os recursos',
  cols: { feature: 'Recurso', free: 'Grátis', pro: 'Pro AI', life: 'Lifetime' },
  groups: [
    { label: 'Suas listas de seguidores', rows: [
      { label: 'Listas de seguidores do Instagram, Threads e TikTok', free: true, pro: true, life: true },
      { label: 'Quem não te segue de volta, hoje', free: true, pro: true, life: true },
      { label: 'Organize a lista: manter, deixar de seguir, decidir depois', free: true, pro: true, life: true },
      { label: 'Emails de lembrete quando for hora de conferir de novo', free: true, pro: true, life: true },
      { label: 'Exportações guardadas e comparadas', free: 'Um snapshot por vez', pro: 'Histórico ilimitado', life: 'Histórico ilimitado' },
      { label: 'Exportações CSV', free: 'Uma exportação CSV', pro: 'Ilimitadas, cada lista', life: 'Ilimitadas, cada lista' },
      { label: 'Veja exatamente quem deixou de te seguir e quando', free: false, pro: true, life: true },
      { label: 'Radar: seguidores fantasmas, tempo de follow, pedidos antigos', free: false, pro: true, life: true },
      { label: 'Sincronização em todos os seus aparelhos, criptografada no seu navegador', free: false, pro: true, life: true },
      { label: 'Sem precisar de conta', free: true, pro: false, life: false },
    ] },
    { label: 'Seu coach', rows: [
      { label: 'Um coach que lembra da sua conta, com memória editável', free: false, pro: true, life: true },
      { label: 'Escreve ganchos, legendas e roteiros de Reels com a sua voz (Instagram)', free: false, pro: true, life: true },
      { label: 'Checa um post do Instagram antes de você publicar, com ajustes', free: false, pro: true, life: true },
      { label: 'Um plano de 30 dias para o Instagram, pensado para o seu nicho', free: false, pro: true, life: true },
      { label: 'Uma leitura com IA de cada exportação nova, em todas as plataformas', free: false, pro: true, life: true },
      { label: 'Uso mensal generoso do coach, renova todo mês', free: false, pro: true, life: true },
      { label: 'Nunca enviamos à IA seus seguidores nem os nomes de usuário deles', free: true, pro: true, life: true },
      { label: 'Ebooks para crescer sua conta', free: false, pro: 'No plano anual', life: false },
    ] },
    { label: 'Extras do Lifetime', rows: [
      { label: 'Pague uma vez, sem vencimento nem renovação', free: false, pro: false, life: true },
      { label: 'Todo recurso Pro que adicionarmos depois, incluído', free: false, pro: true, life: true },
      { label: 'Clube de Insiders fundadores: um grupo privado que abre ao chegar a 10 membros, com vantagens como comissões de afiliado generosas', free: false, pro: false, life: true },
      { label: 'Recursos Pro nas futuras ferramentas da Alcatraz Studio (sem os recursos de IA delas)', free: false, pro: false, life: true },
      { label: 'Primeiro a saber de cada lançamento', free: false, pro: false, life: true },
      { label: 'Selo e título de Insider na sua conta', free: false, pro: false, life: true },
    ] },
  ],
  yes: 'Incluído',
  no: 'Não incluído',
  stickyNote: 'Cancele quando quiser',
  sample: {
    coachQ: 'O que eu posto esta semana?',
    coachA: 'Seus melhores posts citam o lugar na primeira linha. Teste no post de sexta.',
    checkTitle: 'Checagem do post',
    checkBadge: 'Pronto após 2 ajustes',
    checkFixes: ['Comece com o que deu errado: "Meu filme saiu verde."', 'Adicione um slide com a solução e termine com uma pergunta'],
    checkOk: 'O estilo combina com o que seus seguidores buscam',
    voiceTabs: ['Gancho', 'Legenda', 'Roteiro de Reel'],
    voiceText: '"Meu filme de Sintra saiu verde. Veja como resolvi."',
    planDays: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    planTypes: { reel: 'Reel', carousel: 'Carrossel', photo: 'Foto' },
    leftTitle: 'Deixaram de te seguir desde a última exportação',
    leftTag: 'Saiu',
    radarTitle: 'Há quanto tempo seguem você',
    radarX: ['Novos', 'Meses', '1 ano', 'Anos'],
    radarY: 'Seguidores',
  },
};

const MAP: Record<AppLocale, PricingMore> = { en: EN, es: ES, pt: PT };

export function getPricingMore(locale: AppLocale): PricingMore {
  return MAP[locale];
}
