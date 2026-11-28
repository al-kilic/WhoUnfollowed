import type { AppLocale } from '@/i18n/routing';

// Copy for the Studio shell (/app): navigation, plan labels, locks and the
// upgrade sheet. Page-specific copy lives next to each page.

export type StudioNavKey =
  | 'today' | 'ask' | 'create' | 'plan' | 'radar' | 'results' | 'you'
  | 'overview' | 'fixes' | 'growth' | 'people' | 'whyLeft' | 'benchmarks'
  | 'list' | 'history' | 'posted' | 'insights' | 'ideas' | 'goals' | 'brief' | 'kit' | 'guides'
  | 'write' | 'check' | 'planCal' | 'settings' | 'credits';

export type SheetFeature = 'radar' | 'history' | 'coach' | 'create' | 'plan' | 'ask' | 'goals' | 'insights';

export interface StudioContent {
  name: string;
  menu: string;
  closeMenu: string;
  nav: Record<StudioNavKey, string>;
  groupCoach: string;
  // Pro AI is in beta (founder, 2026-11-27): a tag next to the Coach group.
  beta: string;
  betaHint: string;
  collapseNav: string;
  expandNav: string;
  groupData: string;
  notSignedIn: string;
  signIn: string;
  saveStudio: string;
  backToSite: string;
  // The sidebar logo: hover turns it into a way home to the main site.
  homeLabel: string;
  plan: { free: string; pro: string; proAi: string };
  comingLater: string;
  soon: string;
  upgradePro: { title: string; body: string; cta: string };
  loading: string;
  empty: { title: string; body: string; upload: string; howTo: string };
  lock: {
    pro: string;
    proAi: string;
    cta: string;
  };
  sheet: {
    eyebrow: string;
    titles: Record<SheetFeature, string>;
    bullets: string[];
    monthly: string;
    yearly: string;
    perMonth: (price: string) => string;
    perYear: (price: string) => string;
    yearlyNote: (perMonth: string) => string;
    cancel: string;
    privacy: string;
    start: string;
    notNow: string;
    error: string;
    legacyNote: string;
  };
}

const EN: StudioContent = {
  name: 'Studio',
  menu: 'Open menu',
  closeMenu: 'Close menu',
  nav: {
    today: 'Today', ask: 'Ask coach', create: 'Create', plan: 'Plan', radar: 'Radar', results: 'Results', you: 'You',
    overview: 'Overview', fixes: 'Fixes', growth: 'Growth', people: 'People', whyLeft: 'Why they left', benchmarks: 'Benchmarks',
    list: 'List', history: 'History', posted: 'Posted', insights: 'Photo insights', ideas: 'Ideas', goals: 'Goal', brief: 'Weekly brief', kit: 'Media kit', guides: 'Guides',
    write: 'Write', check: 'Check a post', planCal: '30-day plan', settings: 'Settings', credits: 'Monthly use',
  },
  groupCoach: 'Coach',
  beta: 'Beta',
  betaHint: 'Pro AI is in beta. Something may not work now and then. We fix it fast.',
  collapseNav: 'Collapse the menu',
  expandNav: 'Expand the menu',
  groupData: 'Your data',
  notSignedIn: 'Not signed in',
  signIn: 'Sign in',
  saveStudio: 'Save your Studio',
  backToSite: 'Back to the site',
  homeLabel: 'Back to whounfollowed.co',
  plan: { free: 'Free', pro: 'Pro', proAi: 'Pro AI' },
  comingLater: 'Coming later',
  soon: 'Soon',
  upgradePro: { title: 'You have Pro', body: "Your coach runs on a small trial gift. Pro AI adds generous monthly use.", cta: 'Upgrade to Pro AI' },
  loading: 'Opening your Studio...',
  empty: {
    title: 'Your Studio is empty',
    body: 'Upload your export to fill it. The file is read in this browser and never uploaded.',
    upload: 'Upload your export',
    howTo: 'How to get your export',
  },
  lock: { pro: 'Pro', proAi: 'Pro AI', cta: 'See what Pro AI adds' },
  sheet: {
    eyebrow: 'PRO AI',
    titles: {
      radar: 'See the full Radar',
      history: 'See who left between your checks',
      coach: 'Get a coach that knows your account',
      create: 'Write posts in your own voice',
      plan: 'Get your 30-day post plan',
      ask: 'Ask your coach anything',
      goals: 'Track a goal and get check-ins',
      insights: 'See which of your photos work, and why',
    },
    bullets: [
      'Every Radar chart, fix and list unlocked',
      'Compare any two exports and see who left',
      'An AI coach that reads each export and plans your posts',
    ],
    monthly: 'Monthly',
    yearly: 'Yearly',
    perMonth: (p) => `${p} a month`,
    perYear: (p) => `${p} a year`,
    yearlyNote: (m) => `About ${m} a month`,
    cancel: 'Cancel any time.',
    privacy: 'Your followers never leave your browser. The coach only gets counts and dates, never usernames.',
    start: 'Continue to checkout',
    notNow: 'Not now',
    error: 'Checkout could not start. Try again in a moment.',
    legacyNote: 'You already have Pro. Pro AI adds the coach, with generous monthly use.',
  },
};

const ES: StudioContent = {
  name: 'Studio',
  menu: 'Abrir menú',
  closeMenu: 'Cerrar menú',
  nav: {
    today: 'Hoy', ask: 'Pregunta al coach', create: 'Crear', plan: 'Plan', radar: 'Radar', results: 'Resultados', you: 'Tú',
    overview: 'Resumen', fixes: 'Arreglos', growth: 'Crecimiento', people: 'Personas', whyLeft: 'Por qué se fueron', benchmarks: 'Comparativas',
    list: 'Lista', history: 'Historial', posted: 'Publicadas', insights: 'Análisis de fotos', ideas: 'Ideas', goals: 'Objetivo', brief: 'Resumen semanal', kit: 'Media kit', guides: 'Guías',
    write: 'Escribir', check: 'Revisar una publicación', planCal: 'Plan de 30 días', settings: 'Ajustes', credits: 'Uso mensual',
  },
  groupCoach: 'Coach',
  beta: 'Beta',
  betaHint: 'Pro AI está en beta. Algo puede fallar de vez en cuando. Lo arreglamos rápido.',
  collapseNav: 'Contraer el menú',
  expandNav: 'Expandir el menú',
  groupData: 'Tus datos',
  notSignedIn: 'Sin iniciar sesión',
  signIn: 'Iniciar sesión',
  saveStudio: 'Guarda tu Studio',
  backToSite: 'Volver al sitio',
  homeLabel: 'Volver a whounfollowed.co',
  plan: { free: 'Gratis', pro: 'Pro', proAi: 'Pro AI' },
  comingLater: 'Próximamente',
  soon: 'Pronto',
  upgradePro: { title: 'Tienes Pro', body: "Tu coach funciona con un pequeño regalo de prueba. Pro AI suma un uso mensual generoso.", cta: 'Pasar a Pro AI' },
  loading: 'Abriendo tu Studio...',
  empty: {
    title: 'Tu Studio está vacío',
    body: 'Sube tu exportación para llenarlo. El archivo se lee en este navegador y nunca se sube.',
    upload: 'Sube tu exportación',
    howTo: 'Cómo obtener tu exportación',
  },
  lock: { pro: 'Pro', proAi: 'Pro AI', cta: 'Mira lo que añade Pro AI' },
  sheet: {
    eyebrow: 'PRO AI',
    titles: {
      radar: 'Mira el Radar completo',
      history: 'Mira quién se fue entre tus revisiones',
      coach: 'Un coach que conoce tu cuenta',
      create: 'Escribe publicaciones con tu propia voz',
      plan: 'Tu plan de publicaciones de 30 días',
      ask: 'Pregúntale lo que quieras a tu coach',
      goals: 'Sigue una meta y recibe seguimientos',
      insights: 'Descubre qué fotos funcionan y por qué',
    },
    bullets: [
      'Todos los gráficos, arreglos y listas del Radar',
      'Compara dos exportaciones y mira quién se fue',
      'Un coach con IA que lee cada exportación y planifica tus publicaciones',
    ],
    monthly: 'Mensual',
    yearly: 'Anual',
    perMonth: (p) => `${p} al mes`,
    perYear: (p) => `${p} al año`,
    yearlyNote: (m) => `Unos ${m} al mes`,
    cancel: 'Cancela cuando quieras.',
    privacy: 'Tus seguidores nunca salen de tu navegador. El coach solo recibe cifras y fechas, nunca nombres de usuario.',
    start: 'Continuar al pago',
    notNow: 'Ahora no',
    error: 'No se pudo iniciar el pago. Inténtalo de nuevo en un momento.',
    legacyNote: 'Ya tienes Pro. Pro AI añade el coach, con un uso mensual generoso.',
  },
};

const PT: StudioContent = {
  name: 'Studio',
  menu: 'Abrir menu',
  closeMenu: 'Fechar menu',
  nav: {
    today: 'Hoje', ask: 'Pergunte ao coach', create: 'Criar', plan: 'Plano', radar: 'Radar', results: 'Resultados', you: 'Você',
    overview: 'Resumo', fixes: 'Ajustes', growth: 'Crescimento', people: 'Pessoas', whyLeft: 'Por que saíram', benchmarks: 'Comparativos',
    list: 'Lista', history: 'Histórico', posted: 'Postados', insights: 'Análise de fotos', ideas: 'Ideias', goals: 'Meta', brief: 'Resumo semanal', kit: 'Media kit', guides: 'Guias',
    write: 'Escrever', check: 'Revisar um post', planCal: 'Plano de 30 dias', settings: 'Configurações', credits: 'Uso mensal',
  },
  groupCoach: 'Coach',
  beta: 'Beta',
  betaHint: 'O Pro AI está em beta. Algo pode falhar de vez em quando. Corrigimos rápido.',
  collapseNav: 'Recolher o menu',
  expandNav: 'Expandir o menu',
  groupData: 'Seus dados',
  notSignedIn: 'Sem login',
  signIn: 'Entrar',
  saveStudio: 'Salve seu Studio',
  backToSite: 'Voltar ao site',
  homeLabel: 'Voltar para whounfollowed.co',
  plan: { free: 'Grátis', pro: 'Pro', proAi: 'Pro AI' },
  comingLater: 'Em breve',
  soon: 'Em breve',
  upgradePro: { title: 'Você tem o Pro', body: "Seu coach usa um pequeno presente de teste. O Pro AI adiciona uso mensal generoso.", cta: 'Mudar para o Pro AI' },
  loading: 'Abrindo seu Studio...',
  empty: {
    title: 'Seu Studio está vazio',
    body: 'Envie sua exportação para preenchê-lo. O arquivo é lido neste navegador e nunca é enviado.',
    upload: 'Envie sua exportação',
    howTo: 'Como obter sua exportação',
  },
  lock: { pro: 'Pro', proAi: 'Pro AI', cta: 'Veja o que o Pro AI adiciona' },
  sheet: {
    eyebrow: 'PRO AI',
    titles: {
      radar: 'Veja o Radar completo',
      history: 'Veja quem saiu entre suas verificações',
      coach: 'Um coach que conhece sua conta',
      create: 'Escreva posts com a sua voz',
      plan: 'Seu plano de posts de 30 dias',
      ask: 'Pergunte o que quiser ao seu coach',
      goals: 'Acompanhe uma meta e receba check-ins',
      insights: 'Veja quais fotos funcionam e por quê',
    },
    bullets: [
      'Todos os gráficos, ajustes e listas do Radar',
      'Compare duas exportações e veja quem saiu',
      'Um coach com IA que lê cada exportação e planeja seus posts',
    ],
    monthly: 'Mensal',
    yearly: 'Anual',
    perMonth: (p) => `${p} por mês`,
    perYear: (p) => `${p} por ano`,
    yearlyNote: (m) => `Cerca de ${m} por mês`,
    cancel: 'Cancele quando quiser.',
    privacy: 'Seus seguidores nunca saem do seu navegador. O coach só recebe números e datas, nunca nomes de usuário.',
    start: 'Continuar para o pagamento',
    notNow: 'Agora não',
    error: 'Não foi possível iniciar o pagamento. Tente novamente em instantes.',
    legacyNote: 'Você já tem o Pro. O Pro AI adiciona o coach, com uso mensal generoso.',
  },
};

export function getStudioContent(locale: AppLocale): StudioContent {
  return locale === 'es' ? ES : locale === 'pt' ? PT : EN;
}
