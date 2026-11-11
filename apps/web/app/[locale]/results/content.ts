export interface ResultsContent {
  metaTitle: string;
  eyebrow: string;
  exportFrom: (date: string) => string;
  headlineSuffix: (n: number, app: string) => string;
  htmlFormatNotice: string;
  seeHowToRequestJson: string;
  statFollowers: string;
  statFollowing: string;
  statMutuals: string;
  statNonFollowers: string;
  nowApprox: (n: string) => string;
  markedAsUnfollowed: (n: number) => string;
  tabs: {
    nonFollowers: { label: string; description: string; emptyMessage: string };
    fans: { label: string; description: string; emptyMessage: string };
    mutuals: { label: string; description: string; emptyMessage: string };
  };
  tutorial: { title: string; body: string }[];
  tutorialLabels: { featureTour: string; skipTour: string; next: string; gotIt: string };
  // One line under the headline for free users: this page is today, the next export shows who left.
  todayHint: { text: string; link: string };
  radarTeaser: {
    eyebrow: string;
    headline: () => string;
    body: string;
    checks: string[];
    // Entries of `checks` that only apply to Instagram (hidden for Threads).
    instagramOnlyChecks: string[];
    ctaPrimary: string;
    ctaSecondary: string;
    previewLabel: string;
    followBackRate: string;
    mutualsLabel: (n: string) => string;
    dontFollowBackLabel: (n: string) => string;
    today: string;
    nextExport: string;
    longNonFollowersLabel: string;
    oldRequestsLabel: string;
  };
  radarPulse: {
    prefix: string;
    linkText: string;
  };
}

const EN: ResultsContent = {
  metaTitle: 'Results',
  eyebrow: 'RESULTS',
  exportFrom: (date) => `Export from ${date}`,
  headlineSuffix: (n, app) => (n === 1 ? `person doesn't follow you back on ${app}.` : `people don't follow you back on ${app}.`),
  htmlFormatNotice:
    "This export was in HTML format, so follow dates aren't available. JSON exports include those timestamps, which power follow age and growth trends in Radar.",
  seeHowToRequestJson: 'See how to request a JSON export →',
  statFollowers: 'Followers',
  statFollowing: 'Following',
  statMutuals: 'Mutuals',
  statNonFollowers: 'Non-followers',
  nowApprox: (n) => `→ now ~${n}`,
  markedAsUnfollowed: (n) => `${n} marked as unfollowed`,
  tabs: {
    nonFollowers: {
      label: "Don't follow back",
      description: "Accounts you follow that don't follow you back.",
      emptyMessage: 'Everyone you follow also follows you back.',
    },
    fans: {
      label: 'Fans',
      description: "Accounts that follow you, but you don't follow back.",
      emptyMessage: 'You follow everyone who follows you.',
    },
    mutuals: {
      label: 'Mutuals',
      description: 'Accounts you both follow each other.',
      emptyMessage: 'No mutual follows found.',
    },
  },
  tutorial: [
    { title: 'Your stats', body: 'Followers, following, mutuals, non-followers - all from your export.' },
    { title: 'Fans & Mutuals', body: 'Switch tabs to see who follows you (Fans) and mutual connections.' },
    { title: 'Export CSV', body: "Download the current tab's list as a spreadsheet anytime." },
    { title: 'Open on {app}', body: "Tap ↗ on any row to open that account's {app} profile in a new tab." },
    { title: 'Triage buttons', body: 'Hover a row to reveal four action buttons. Pick one to label the account.' },
    { title: '"Dropping"', body: 'You plan to unfollow them. Marks it for your clean-up run.' },
    { title: '"Whitelist"', body: 'Keep following them - removes them from the list permanently.' },
    { title: '"Unfollowed"', body: 'Already unfollowed outside the app? Mark it to keep your count accurate.' },
    { title: 'Whitelist section', body: 'Whitelisted accounts collapse here. Expand anytime to review or undo.' },
  ],
  tutorialLabels: { featureTour: 'Feature tour', skipTour: 'Skip tour', next: 'Next', gotIt: 'Got it' },
  todayHint: {
    text: "This is today's snapshot, so it shows who doesn't follow you back, not who unfollowed you. Upload your next export in a few weeks to see who left.",
    link: 'How that works',
  },
  radarTeaser: {
    eyebrow: 'Who unfollowed you',
    headline: () => "Today's list can't show who unfollowed you. Your next export can.",
    body: 'Upload a new export in a few weeks and we compare it with this one. Free shows how many people left. Pro shows every name and date, keeps every export, and adds Radar: ghost followers, old requests and your follower trend.',
    checks: [
      'Compare any two snapshots',
      'Follower growth chart',
      'Ghost-follower detection',
      'Pending requests, sorted by wait time',
      'Who you recently unfollowed',
      'How long a non-follower has kept you waiting',
    ],
    instagramOnlyChecks: ['Pending requests, sorted by wait time'],
    ctaPrimary: 'See who unfollows you next',
    ctaSecondary: 'Preview Radar, no account needed →',
    previewLabel: 'your Radar preview · today',
    followBackRate: 'of who you follow, follows back',
    mutualsLabel: (n) => `${n} mutuals`,
    dontFollowBackLabel: (n) => `${n} don't follow back`,
    today: 'today',
    nextExport: 'your next export plots here',
    longNonFollowersLabel: "you've followed 3+ years, never followed back",
    oldRequestsLabel: 'follow requests waiting 6+ months',
  },
  radarPulse: {
    prefix: 'See your summary, verdict and fixes in',
    linkText: 'Radar ↗',
  },
};

const ES: ResultsContent = {
  metaTitle: 'Resultados',
  eyebrow: 'RESULTADOS',
  exportFrom: (date) => `Exportado el ${date}`,
  headlineSuffix: (n, app) => (n === 1 ? `persona no te sigue de vuelta en ${app}.` : `personas no te siguen de vuelta en ${app}.`),
  htmlFormatNotice:
    'Esta exportación estaba en formato HTML, así que las fechas de seguimiento no están disponibles. Las exportaciones JSON incluyen esas marcas de tiempo, que alimentan la antigüedad de seguimiento y las tendencias de crecimiento en Radar.',
  seeHowToRequestJson: 'Ve cómo solicitar una exportación JSON →',
  statFollowers: 'Seguidores',
  statFollowing: 'Seguidos',
  statMutuals: 'Mutuos',
  statNonFollowers: 'No te siguen',
  nowApprox: (n) => `→ ahora ~${n}`,
  markedAsUnfollowed: (n) => `${n} marcados como dejados de seguir`,
  tabs: {
    nonFollowers: {
      label: 'No te siguen de vuelta',
      description: 'Cuentas que sigues y que no te siguen de vuelta.',
      emptyMessage: 'Todos a quienes sigues también te siguen de vuelta.',
    },
    fans: {
      label: 'Fans',
      description: 'Cuentas que te siguen, pero que tú no sigues.',
      emptyMessage: 'Sigues a todos los que te siguen.',
    },
    mutuals: {
      label: 'Mutuos',
      description: 'Cuentas que se siguen mutuamente.',
      emptyMessage: 'No se encontraron seguimientos mutuos.',
    },
  },
  tutorial: [
    { title: 'Tus estadísticas', body: 'Seguidores, seguidos, mutuos, no seguidores: todo desde tu exportación.' },
    { title: 'Fans y Mutuos', body: 'Cambia de pestaña para ver quién te sigue (Fans) y las conexiones mutuas.' },
    { title: 'Exportar CSV', body: 'Descarga la lista de la pestaña actual como una hoja de cálculo en cualquier momento.' },
    { title: 'Abrir en {app}', body: 'Toca ↗ en cualquier fila para abrir el perfil de {app} de esa cuenta en una pestaña nueva.' },
    { title: 'Botones de triaje', body: 'Pasa el cursor sobre una fila para ver cuatro botones de acción. Elige uno para etiquetar la cuenta.' },
    { title: '"Dejar de seguir"', body: 'Planeas dejar de seguirlos. Lo marca para tu limpieza.' },
    { title: '"Lista blanca"', body: 'Sigue siguiéndolos: los elimina de la lista de forma permanente.' },
    { title: '"Dejado de seguir"', body: '¿Ya lo dejaste de seguir fuera de la app? Márcalo para mantener tu conteo exacto.' },
    { title: 'Sección de lista blanca', body: 'Las cuentas en lista blanca se colapsan aquí. Despliega en cualquier momento para revisar o deshacer.' },
  ],
  tutorialLabels: { featureTour: 'Recorrido guiado', skipTour: 'Saltar recorrido', next: 'Siguiente', gotIt: 'Entendido' },
  todayHint: {
    text: 'Esto es un snapshot de hoy: muestra quién no te sigue de vuelta, no quién te dejó de seguir. Sube tu próxima exportación en unas semanas para ver quién se fue.',
    link: 'Cómo funciona',
  },
  radarTeaser: {
    eyebrow: 'Quién te dejó de seguir',
    headline: () => 'La lista de hoy no puede mostrar quién te dejó de seguir. Tu próxima exportación sí.',
    body: 'Sube una nueva exportación en unas semanas y la comparamos con esta. Gratis ves cuántas personas se fueron. Pro muestra cada nombre y fecha, guarda cada exportación y suma Radar: seguidores fantasma, solicitudes viejas y la tendencia de tus seguidores.',
    checks: [
      'Compara dos snapshots cualesquiera',
      'Gráfico de crecimiento de seguidores',
      'Detección de seguidores fantasma',
      'Solicitudes pendientes, ordenadas por tiempo de espera',
      'A quién dejaste de seguir recientemente',
      'Cuánto tiempo te ha hecho esperar un no seguidor',
    ],
    instagramOnlyChecks: ['Solicitudes pendientes, ordenadas por tiempo de espera'],
    ctaPrimary: 'Ver quién te deja de seguir',
    ctaSecondary: 'Prueba Radar, sin necesidad de cuenta →',
    previewLabel: 'tu vista previa de Radar · hoy',
    followBackRate: 'de a quienes sigues, te siguen de vuelta',
    mutualsLabel: (n) => `${n} mutuos`,
    dontFollowBackLabel: (n) => `${n} no te siguen de vuelta`,
    today: 'hoy',
    nextExport: 'tu próxima exportación se grafica aquí',
    longNonFollowersLabel: 'sigues hace 3+ años y nunca te siguieron',
    oldRequestsLabel: 'solicitudes esperando 6+ meses',
  },
  radarPulse: {
    prefix: 'Mira tu resumen, veredicto y qué arreglar en',
    linkText: 'Radar ↗',
  },
};

const PT: ResultsContent = {
  metaTitle: 'Resultados',
  eyebrow: 'RESULTADOS',
  exportFrom: (date) => `Exportado em ${date}`,
  headlineSuffix: (n, app) => (n === 1 ? `pessoa não te segue de volta no ${app}.` : `pessoas não te seguem de volta no ${app}.`),
  htmlFormatNotice:
    'Esta exportação estava em formato HTML, então as datas de seguimento não estão disponíveis. As exportações JSON incluem esses registros de data e hora, que alimentam o tempo de seguimento e as tendências de crescimento no Radar.',
  seeHowToRequestJson: 'Veja como solicitar uma exportação JSON →',
  statFollowers: 'Seguidores',
  statFollowing: 'Seguindo',
  statMutuals: 'Mútuos',
  statNonFollowers: 'Não te seguem',
  nowApprox: (n) => `→ agora ~${n}`,
  markedAsUnfollowed: (n) => `${n} marcados como deixados de seguir`,
  tabs: {
    nonFollowers: {
      label: 'Não te seguem de volta',
      description: 'Contas que você segue e que não te seguem de volta.',
      emptyMessage: 'Todos que você segue também te seguem de volta.',
    },
    fans: {
      label: 'Fãs',
      description: 'Contas que te seguem, mas você não segue de volta.',
      emptyMessage: 'Você segue todos que te seguem.',
    },
    mutuals: {
      label: 'Mútuos',
      description: 'Contas que se seguem mutuamente.',
      emptyMessage: 'Nenhum seguimento mútuo encontrado.',
    },
  },
  tutorial: [
    { title: 'Suas estatísticas', body: 'Seguidores, seguindo, mútuos, não seguidores - tudo da sua exportação.' },
    { title: 'Fãs e Mútuos', body: 'Alterne as abas para ver quem te segue (Fãs) e as conexões mútuas.' },
    { title: 'Exportar CSV', body: 'Baixe a lista da aba atual como uma planilha a qualquer momento.' },
    { title: 'Abrir no {app}', body: 'Toque em ↗ em qualquer linha para abrir o perfil do {app} dessa conta em uma nova aba.' },
    { title: 'Botões de triagem', body: 'Passe o cursor sobre uma linha para revelar quatro botões de ação. Escolha um para rotular a conta.' },
    { title: '"Deixar de seguir"', body: 'Você planeja deixar de segui-los. Marca para sua limpeza.' },
    { title: '"Lista branca"', body: 'Continue seguindo-os: remove-os da lista permanentemente.' },
    { title: '"Deixou de seguir"', body: 'Já deixou de seguir fora do app? Marque para manter sua contagem precisa.' },
    { title: 'Seção de lista branca', body: 'Contas na lista branca ficam recolhidas aqui. Expanda a qualquer momento para revisar ou desfazer.' },
  ],
  tutorialLabels: { featureTour: 'Tour de recursos', skipTour: 'Pular tour', next: 'Próximo', gotIt: 'Entendi' },
  todayHint: {
    text: 'Isto é um snapshot de hoje: mostra quem não te segue de volta, não quem deixou de te seguir. Envie sua próxima exportação daqui a algumas semanas para ver quem saiu.',
    link: 'Como funciona',
  },
  radarTeaser: {
    eyebrow: 'Quem deixou de te seguir',
    headline: () => 'A lista de hoje não mostra quem deixou de te seguir. Sua próxima exportação mostra.',
    body: 'Envie uma nova exportação daqui a algumas semanas e a gente compara com esta. No grátis você vê quantas pessoas saíram. O Pro mostra cada nome e data, guarda cada exportação e inclui o Radar: seguidores fantasmas, pedidos antigos e a tendência dos seus seguidores.',
    checks: [
      'Compare dois snapshots quaisquer',
      'Gráfico de crescimento de seguidores',
      'Detecção de seguidores fantasmas',
      'Solicitações pendentes, ordenadas por tempo de espera',
      'Quem você deixou de seguir recentemente',
      'Há quanto tempo um não seguidor te faz esperar',
    ],
    instagramOnlyChecks: ['Solicitações pendentes, ordenadas por tempo de espera'],
    ctaPrimary: 'Ver quem deixa de te seguir',
    ctaSecondary: 'Experimente o Radar, sem precisar de conta →',
    previewLabel: 'sua prévia do Radar · hoje',
    followBackRate: 'de quem você segue, te segue de volta',
    mutualsLabel: (n) => `${n} mútuos`,
    dontFollowBackLabel: (n) => `${n} não te seguem de volta`,
    today: 'hoje',
    nextExport: 'sua próxima exportação aparece aqui',
    longNonFollowersLabel: 'você segue há 3+ anos e nunca te seguiram',
    oldRequestsLabel: 'pedidos esperando há 6+ meses',
  },
  radarPulse: {
    prefix: 'Veja seu resumo, veredito e o que arrumar no',
    linkText: 'Radar ↗',
  },
};

export function getResultsContent(locale: string): ResultsContent {
  if (locale === 'es') return ES;
  if (locale === 'pt') return PT;
  return EN;
}
