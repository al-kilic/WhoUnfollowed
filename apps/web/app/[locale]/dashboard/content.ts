export interface DashboardContent {
  metaTitle: string;
  loadingRadar: string;
  emptyState: {
    title: string;
    body: string;
    uploadExport: string;
    howToExport: string;
    // Shown when the page was opened from the 3-month wrap email.
    wrapNote: string;
  };
  header: {
    radar: string;
    exportDate: (date: string) => string;
    whatIsRadar: string;
    platformSwitcherLabel: string;
    headline: string;
    summary: (followers: string, following: string, nonFollowers: string) => string;
  };
  heroStats: {
    followers: string; following: string; mutuals: string; nonFollowers: string;
    noFollowBackPct: string; followRatio: string;
  };
  audience: {
    sectionLabel: string; title: string;
    mutuals: string; dontFollowBack: string; fans: string;
    tooltipRatio: string; tooltipAccounts: string;
  };
  ratio: {
    sectionLabel: string; title: string;
    tooltipAria: string; tooltipTitle: string; tooltipP1: string; tooltipP2: string;
    howToImprove: string; tooltipP3: string;
    moreFollowers: (x: string) => string;
    followingMore: (x: string) => string;
    improving: string; declining: string; stable: string;
    ratioOverTime: string;
    chartAria: (n: number, fromRatio: string, fromDate: string, toRatio: string, toDate: string) => string;
  };
  followAge: {
    sectionLabel: string; title: string; emptyMessage: string;
    longWait: string; longWaitDesc: string; longestWait: string;
    followedDaysAgo: (n: number) => string;
    visitProfileToUnfollow: string;
    topOldest: (n: number) => string;
    copyAll: string; copied: string; clickBarToSee: string;
    chartAria: (parts: string) => string;
    accountsSuffix: string;
    buckets: string[];
  };
  pending: {
    sectionLabel: string; title: string; emptyMessage: string;
    bucket90: string; bucket30to90: string; bucketUnder30: string;
    filterBy: (label: string) => string;
    tapToReset: string; sortToTop: string;
    labelsYearPlus: string[]; labelsHalfYear: string[]; labelsNinetyDays: string[]; labelsThirtyDays: string[];
  };
  recentlyUnfollowed: { sectionLabel: string; title: string; emptyMessage: string };
  growth: {
    sectionLabel: string; title: string; emptyMessage: string;
    sinceLastSnapshot: string;
    biggestDrop: (date: string, n: number) => string;
    chartAria: (n: number, fromCount: string, fromDate: string, toCount: string, toDate: string, dropSuffix: string) => string;
    dropSuffix: (date: string, n: number) => string;
    followersUnit: string;
    gained: (n: string) => string;
    lost: (n: string) => string;
    totalGained: string;
    totalLost: string;
  };
  radarModal: {
    eyebrow: string; title: string; intro: string;
    sections: { icon: string; title: string; body: string }[];
    tipLabel: string; tip: string;
  };
  tutorial: { title: string; body: string }[];
  tutorialLabels: { featureTour: string; skipTour: string; next: string; gotIt: string };
  proLock: { eyebrow: string; title: string; description: string; cta: string };
  openOn: (username: string, app: string) => string;
  // Radar view for a platform the viewer has no snapshot of yet.
  platformEmpty: { title: (app: string) => string; body: (app: string) => string; cta: string };
}

const EN: DashboardContent = {
  metaTitle: 'Radar',
  loadingRadar: 'Loading Radar…',
  emptyState: {
    title: 'No data to scan yet',
    body: 'Radar needs an Instagram, Threads or TikTok export to analyze. Upload your data once and your follower radar, non-followers, and growth show up here. Nothing leaves your browser.',
    uploadExport: 'Upload your export',
    howToExport: 'How to export',
    wrapNote: 'Your wrap is made from your own export, right here in your browser, so this device needs one first. Download a fresh export, upload it, then open your Radar to play your 3-month wrap.',
  },
  header: {
    radar: 'RADAR',
    exportDate: (date) => `· ${date}`,
    whatIsRadar: 'What is Radar?',
    platformSwitcherLabel: 'Choose platform',
    headline: 'The full picture.',
    summary: (followers, following, nonFollowers) => `${followers} followers · ${following} following · ${nonFollowers} don't follow back`,
  },
  heroStats: {
    followers: 'Followers', following: 'Following', mutuals: 'Mutuals', nonFollowers: 'Non-followers',
    noFollowBackPct: 'No follow-back %', followRatio: 'Follow ratio',
  },
  audience: {
    sectionLabel: 'Audience', title: 'Who follows you',
    mutuals: 'Mutuals', dontFollowBack: "Don't follow back", fans: 'Fans (follow you)',
    tooltipRatio: 'Ratio', tooltipAccounts: 'Accounts',
  },
  ratio: {
    sectionLabel: 'Follow ratio', title: 'Followers vs following',
    tooltipAria: 'What is follow ratio?', tooltipTitle: 'What is follow ratio?',
    tooltipP1: 'Followers ÷ Following. A ratio of 1.0 means equal. Above 1.0 means more people follow you than you follow back.',
    tooltipP2: "Most accounts have a ratio well below 1.0 - that's normal. A very low ratio (like 0.00) usually means you followed many accounts that never followed back.",
    howToImprove: 'HOW TO IMPROVE IT',
    tooltipP3: 'Use the Results page to triage non-followers. Mark them as Dropping and unfollow them in the app. As your following count drops, the ratio rises.',
    moreFollowers: (x) => `${x}x more followers than following.`,
    followingMore: (x) => `Following ${x}x more than follow you.`,
    improving: '↑ Improving', declining: '↓ Declining', stable: '→ Stable',
    ratioOverTime: 'RATIO OVER TIME',
    chartAria: (n, fromRatio, fromDate, toRatio, toDate) =>
      `Follow ratio across your last ${n} snapshots: from ${fromRatio} on ${fromDate} to ${toRatio} on ${toDate}.`,
  },
  followAge: {
    sectionLabel: 'Follow age', title: "How long you've been waiting",
    emptyMessage: 'Timestamps not available in HTML exports. Re-download as JSON to unlock this.',
    longWait: 'Long wait', longWaitDesc: "accounts you've followed for 1+ year with no follow-back",
    longestWait: 'Longest wait',
    followedDaysAgo: (n) => `followed ${n} days ago - still waiting`,
    visitProfileToUnfollow: 'Visit profile to unfollow',
    topOldest: (n) => `Top ${n} oldest non-followers`,
    copyAll: 'Copy all usernames', copied: '✓ Copied!', clickBarToSee: 'Click a bar to see accounts',
    chartAria: (parts) => `Non-followers by how long you've followed them: ${parts}.`,
    accountsSuffix: 'accounts',
    buckets: ['< 1 month', '1–6 months', '6–12 months', '1–2 years', '2+ years'],
  },
  pending: {
    sectionLabel: 'Pending requests', title: 'Sent, not accepted',
    emptyMessage: 'Nobody keeping you waiting.',
    bucket90: '90+ days', bucket30to90: '30–90 days', bucketUnder30: '< 30 days',
    filterBy: (label) => `Filter by ${label}`,
    tapToReset: 'tap to reset', sortToTop: 'sort to top',
    labelsYearPlus: ['Year+ and nothing.', 'Ancient request.', 'Let it go.', 'They forgot.'],
    labelsHalfYear: ['Half a year.', 'Six months ignored.', 'Long silence.', 'Probably never.'],
    labelsNinetyDays: ['They saw it.', 'No response.', 'Still waiting.', 'Ghosted.'],
    labelsThirtyDays: ['Probably not.', 'Going quiet.', 'Still pending.', 'No rush apparently.'],
  },
  recentlyUnfollowed: {
    sectionLabel: 'Recently unfollowed', title: 'Your recent clean-up',
    emptyMessage: "This wasn't included in your export.",
  },
  growth: {
    sectionLabel: 'Growth', title: 'Follower growth over time',
    emptyMessage: 'Upload a second snapshot to see your growth trend.',
    sinceLastSnapshot: 'since last snapshot',
    biggestDrop: (date, n) => `Biggest drop: ${date} - lost ${n} followers in one period.`,
    chartAria: (n, fromCount, fromDate, toCount, toDate, dropSuffix) =>
      `Follower count across ${n} snapshots, from ${fromCount} on ${fromDate} to ${toCount} on ${toDate}${dropSuffix}.`,
    dropSuffix: (date, n) => `. Biggest drop was on ${date}, losing ${n} followers`,
    followersUnit: 'followers',
    gained: (n) => `+${n} gained`,
    lost: (n) => `−${n} lost`,
    totalGained: 'total gained', totalLost: 'total lost',
  },
  radarModal: {
    eyebrow: 'RADAR', title: 'What is Radar?',
    intro: "Radar is the intelligence layer on top of your Instagram or Threads export. While the results page tells you who doesn't follow you back right now, Radar tells you the full story - trends, health, history, and context. It turns a static snapshot into an ongoing picture of your account.",
    sections: [
      { icon: '⬡', title: 'Account Health Check', body: 'Radar runs a set of specific checks on your export: old pending requests, the follow year that never followed back, follow bursts, sudden drops, lost mutuals and more. Each one comes with your real numbers and one thing to do about it, ranked by impact.' },
      { icon: '↑', title: 'Follower Growth Over Time', body: 'Every time you upload a new export, Radar plots your follower count on a timeline. You can see exactly when you gained or lost followers, and which period had the biggest drop. It turns a static number into a story.' },
      { icon: '⧗', title: 'Follow Age Analysis', body: "Radar reads the timestamps in your export to tell you how long you've been following people who never followed back. Broken into buckets: under a month, 1–6 months, 6–12, 1–2 years, and 2+ years. The longer the wait, the colder the lead." },
      { icon: '◎', title: 'Audience Breakdown', body: "Not all followers are equal. Radar splits your audience into Mutuals (both follow each other), Non-followers (you follow them, they don't follow back), and Fans (they follow you, you don't follow back). A donut chart makes it instant." },
      { icon: '⏳', title: 'Pending Follow Requests (Instagram)', body: 'Instagram tracks every follow request you\'ve sent that hasn\'t been accepted. Radar surfaces them, sorted oldest-first. Requests over 30 days get flagged. Over 90 days: "They saw it." You decide what to do.' },
      { icon: '✓', title: 'Recently Unfollowed', body: "Instagram and Threads log every account you've recently unfollowed. Radar shows it back to you - useful for confirming you already handled someone, or for seeing patterns in who you're cutting." },
    ],
    tipLabel: 'How to get more from Radar:',
    tip: 'Upload a new export every few weeks. Each upload adds a data point to your timeline, sharpens your growth trend, and unlocks the health checks that compare two exports.',
  },
  tutorial: [
    { title: 'The radar', body: 'Every fixable pattern as a blip. The closer to the center, the bigger the impact. Open any one to see the accounts behind it.' },
    { title: 'Growth chart', body: 'Upload a second export later and this fills in - followers gained, lost, and net change over time.' },
    { title: 'Audience breakdown', body: 'Your followers split into mutuals, fans, and non-followers - with a donut chart and follow ratio.' },
    { title: 'Follow age bars', body: "How long you've been following each non-follower. Tap a bar to expand it and see the accounts in that range." },
    { title: 'Pending requests', body: "Follow requests you sent that haven't been accepted yet - pulled from your export." },
    { title: 'Recently unfollowed', body: 'Accounts in your previous export but not this one - they unfollowed you between uploads.' },
  ],
  tutorialLabels: { featureTour: 'Feature tour', skipTour: 'Skip tour', next: 'Next', gotIt: 'Got it' },
  proLock: {
    eyebrow: 'Pro feature',
    title: 'Radar is a Pro feature',
    description: 'Your account health check, growth over time, audience breakdown, and follow-age analysis. Unlock the full picture of your account.',
    cta: 'Upgrade to Pro',
  },
  openOn: (u, app) => `Open @${u} on ${app}`,
  platformEmpty: {
    title: (app) => `No ${app} snapshot yet`,
    body: (app) => `Upload your ${app} export to see its Radar here. Your other app's data stays separate.`,
    cta: 'Upload an export',
  },
};

const ES: DashboardContent = {
  metaTitle: 'Radar',
  loadingRadar: 'Cargando Radar…',
  emptyState: {
    title: 'Aún no hay datos para analizar',
    body: 'Radar necesita una exportación de Instagram, Threads o TikTok para analizar. Sube tus datos una vez y tu radar de seguidores, no seguidores y crecimiento aparecerán aquí. Nada sale de tu navegador.',
    uploadExport: 'Sube tu exportación',
    howToExport: 'Cómo exportar',
    wrapNote: 'Tu resumen se hace con tu propia exportación, aquí mismo en tu navegador, así que este dispositivo necesita una primero. Descarga una exportación nueva, súbela y abre tu Radar para ver tu resumen de 3 meses.',
  },
  header: {
    radar: 'RADAR',
    exportDate: (date) => `· ${date}`,
    whatIsRadar: '¿Qué es Radar?',
    platformSwitcherLabel: 'Elige la plataforma',
    headline: 'El panorama completo.',
    summary: (followers, following, nonFollowers) => `${followers} seguidores · ${following} seguidos · ${nonFollowers} no te siguen de vuelta`,
  },
  heroStats: {
    followers: 'Seguidores', following: 'Seguidos', mutuals: 'Mutuos', nonFollowers: 'No te siguen',
    noFollowBackPct: '% sin seguimiento mutuo', followRatio: 'Ratio de seguimiento',
  },
  audience: {
    sectionLabel: 'Audiencia', title: 'Quién te sigue',
    mutuals: 'Mutuos', dontFollowBack: 'No te siguen de vuelta', fans: 'Fans (te siguen)',
    tooltipRatio: 'Ratio', tooltipAccounts: 'Cuentas',
  },
  ratio: {
    sectionLabel: 'Ratio de seguimiento', title: 'Seguidores vs seguidos',
    tooltipAria: '¿Qué es el ratio de seguimiento?', tooltipTitle: '¿Qué es el ratio de seguimiento?',
    tooltipP1: 'Seguidores ÷ Seguidos. Un ratio de 1.0 significa igualdad. Por encima de 1.0 significa que más personas te siguen de las que tú sigues.',
    tooltipP2: 'La mayoría de cuentas tienen un ratio bastante por debajo de 1.0, eso es normal. Un ratio muy bajo (como 0.00) suele significar que seguiste a muchas cuentas que nunca te siguieron de vuelta.',
    howToImprove: 'CÓMO MEJORARLO',
    tooltipP3: 'Usa la página de resultados para clasificar a quienes no te siguen. Márcalos como Dejar de seguir y déjalos de seguir en la app. A medida que baje tu número de seguidos, el ratio sube.',
    moreFollowers: (x) => `${x}x más seguidores que seguidos.`,
    followingMore: (x) => `Sigues ${x}x más de los que te siguen.`,
    improving: '↑ Mejorando', declining: '↓ Bajando', stable: '→ Estable',
    ratioOverTime: 'RATIO A LO LARGO DEL TIEMPO',
    chartAria: (n, fromRatio, fromDate, toRatio, toDate) =>
      `Ratio de seguimiento en tus últimos ${n} snapshots: de ${fromRatio} el ${fromDate} a ${toRatio} el ${toDate}.`,
  },
  followAge: {
    sectionLabel: 'Antigüedad de seguimiento', title: 'Cuánto tiempo llevas esperando',
    emptyMessage: 'Las marcas de tiempo no están disponibles en exportaciones HTML. Vuelve a descargar en JSON para desbloquear esto.',
    longWait: 'Espera larga', longWaitDesc: 'cuentas que sigues desde hace 1+ año sin seguimiento mutuo',
    longestWait: 'Espera más larga',
    followedDaysAgo: (n) => `seguido hace ${n} días - sigues esperando`,
    visitProfileToUnfollow: 'Visita el perfil para dejar de seguir',
    topOldest: (n) => `Los ${n} no seguidores más antiguos`,
    copyAll: 'Copiar todos los usuarios', copied: '✓ ¡Copiado!', clickBarToSee: 'Haz clic en una barra para ver las cuentas',
    chartAria: (parts) => `No seguidores según cuánto tiempo llevas siguiéndolos: ${parts}.`,
    accountsSuffix: 'cuentas',
    buckets: ['< 1 mes', '1–6 meses', '6–12 meses', '1–2 años', '2+ años'],
  },
  pending: {
    sectionLabel: 'Solicitudes pendientes', title: 'Enviadas, no aceptadas',
    emptyMessage: 'Nadie te tiene esperando.',
    bucket90: '90+ días', bucket30to90: '30–90 días', bucketUnder30: '< 30 días',
    filterBy: (label) => `Filtrar por ${label}`,
    tapToReset: 'toca para reiniciar', sortToTop: 'ordenar arriba',
    labelsYearPlus: ['Más de un año y nada.', 'Solicitud antigua.', 'Déjalo ir.', 'Se olvidaron.'],
    labelsHalfYear: ['Medio año.', 'Seis meses ignorada.', 'Silencio largo.', 'Probablemente nunca.'],
    labelsNinetyDays: ['Ya lo vieron.', 'Sin respuesta.', 'Sigue esperando.', 'Te dejaron en visto.'],
    labelsThirtyDays: ['Probablemente no.', 'Se está enfriando.', 'Aún pendiente.', 'Sin prisa, al parecer.'],
  },
  recentlyUnfollowed: {
    sectionLabel: 'Dejados de seguir recientemente', title: 'Tu limpieza reciente',
    emptyMessage: 'Esto no se incluyó en tu exportación.',
  },
  growth: {
    sectionLabel: 'Crecimiento', title: 'Crecimiento de seguidores en el tiempo',
    emptyMessage: 'Sube un segundo snapshot para ver tu tendencia de crecimiento.',
    sinceLastSnapshot: 'desde el último snapshot',
    biggestDrop: (date, n) => `Mayor caída: ${date} - perdiste ${n} seguidores en un período.`,
    chartAria: (n, fromCount, fromDate, toCount, toDate, dropSuffix) =>
      `Número de seguidores en ${n} snapshots, de ${fromCount} el ${fromDate} a ${toCount} el ${toDate}${dropSuffix}.`,
    dropSuffix: (date, n) => `. La mayor caída fue el ${date}, con una pérdida de ${n} seguidores`,
    followersUnit: 'seguidores',
    gained: (n) => `+${n} ganados`,
    lost: (n) => `−${n} perdidos`,
    totalGained: 'total ganado', totalLost: 'total perdido',
  },
  radarModal: {
    eyebrow: 'RADAR', title: '¿Qué es Radar?',
    intro: 'Radar es la capa de inteligencia sobre tu exportación de Instagram o Threads. Mientras la página de resultados te dice quién no te sigue de vuelta ahora mismo, Radar te cuenta la historia completa: tendencias, salud, historial y contexto. Convierte un snapshot estático en una imagen continua de tu cuenta.',
    sections: [
      { icon: '⬡', title: 'Chequeo de salud de la cuenta', body: 'Radar hace una serie de chequeos concretos sobre tu exportación: solicitudes pendientes viejas, el año de follows que nunca te siguió, ráfagas de follows, caídas repentinas, mutuos perdidos y más. Cada uno trae tus números reales y una acción, ordenados por impacto.' },
      { icon: '↑', title: 'Crecimiento de seguidores en el tiempo', body: 'Cada vez que subes una nueva exportación, Radar traza tu número de seguidores en una línea de tiempo. Puedes ver exactamente cuándo ganaste o perdiste seguidores, y qué período tuvo la mayor caída. Convierte un número estático en una historia.' },
      { icon: '⧗', title: 'Análisis de antigüedad de seguimiento', body: 'Radar lee las marcas de tiempo en tu exportación para decirte cuánto tiempo llevas siguiendo a personas que nunca te siguieron de vuelta. Dividido en rangos: menos de un mes, 1–6 meses, 6–12, 1–2 años y 2+ años. Cuanto más larga la espera, más frío el interés.' },
      { icon: '◎', title: 'Desglose de audiencia', body: 'No todos los seguidores son iguales. Radar divide tu audiencia en Mutuos (se siguen entre sí), No seguidores (los sigues, no te siguen de vuelta) y Fans (te siguen, no los sigues). Un gráfico de dona lo hace instantáneo.' },
      { icon: '⏳', title: 'Solicitudes de seguimiento pendientes (Instagram)', body: 'Instagram registra cada solicitud de seguimiento que has enviado y que no ha sido aceptada. Radar las muestra, ordenadas de más antigua a más reciente. Las solicitudes de más de 30 días se marcan. Más de 90 días: "Ya lo vieron." Tú decides qué hacer.' },
      { icon: '✓', title: 'Dejados de seguir recientemente', body: 'Instagram y Threads registran cada cuenta que has dejado de seguir recientemente. Radar te lo muestra de nuevo, útil para confirmar que ya resolviste a alguien, o para ver patrones en a quién estás dejando de seguir.' },
    ],
    tipLabel: 'Cómo sacarle más provecho a Radar:',
    tip: 'Sube una nueva exportación cada pocas semanas. Cada subida añade un punto de datos a tu línea de tiempo, afina tu tendencia de crecimiento y activa los chequeos que comparan dos exportaciones.',
  },
  tutorial: [
    { title: 'El radar', body: 'Cada patrón que se puede arreglar es un punto. Cuanto más al centro, más impacto. Abre cualquiera para ver las cuentas detrás.' },
    { title: 'Gráfico de crecimiento', body: 'Sube una segunda exportación más adelante y esto se completa: seguidores ganados, perdidos y cambio neto en el tiempo.' },
    { title: 'Desglose de audiencia', body: 'Tus seguidores se dividen en mutuos, fans y no seguidores, con un gráfico de dona y ratio de seguimiento.' },
    { title: 'Barras de antigüedad de seguimiento', body: 'Cuánto tiempo llevas siguiendo a cada no seguidor. Toca una barra para expandirla y ver las cuentas en ese rango.' },
    { title: 'Solicitudes pendientes', body: 'Solicitudes de seguimiento que enviaste y que aún no han sido aceptadas, extraídas de tu exportación.' },
    { title: 'Dejados de seguir recientemente', body: 'Cuentas en tu exportación anterior pero no en esta: te dejaron de seguir entre subidas.' },
  ],
  tutorialLabels: { featureTour: 'Recorrido guiado', skipTour: 'Saltar recorrido', next: 'Siguiente', gotIt: 'Entendido' },
  proLock: {
    eyebrow: 'Función Pro',
    title: 'Radar es una función Pro',
    description: 'Tu chequeo de salud de cuenta, crecimiento en el tiempo, desglose de audiencia y análisis de antigüedad de seguimiento. Desbloquea el panorama completo de tu cuenta.',
    cta: 'Mejorar a Pro',
  },
  openOn: (u, app) => `Abrir @${u} en ${app}`,
  platformEmpty: {
    title: (app) => `Aún no hay snapshot de ${app}`,
    body: (app) => `Sube tu exportación de ${app} para ver su Radar aquí. Los datos de tu otra app se mantienen aparte.`,
    cta: 'Subir una exportación',
  },
};

const PT: DashboardContent = {
  metaTitle: 'Radar',
  loadingRadar: 'Carregando Radar…',
  emptyState: {
    title: 'Ainda não há dados para analisar',
    body: 'O Radar precisa de uma exportação do Instagram, do Threads ou do TikTok para analisar. Envie seus dados uma vez e seu radar de seguidores, não seguidores e crescimento aparecem aqui. Nada sai do seu navegador.',
    uploadExport: 'Envie sua exportação',
    howToExport: 'Como exportar',
    wrapNote: 'Sua retrospectiva é feita com a sua própria exportação, aqui mesmo no seu navegador, então este dispositivo precisa de uma primeiro. Baixe uma exportação nova, envie e abra seu Radar para ver sua retrospectiva de 3 meses.',
  },
  header: {
    radar: 'RADAR',
    exportDate: (date) => `· ${date}`,
    whatIsRadar: 'O que é o Radar?',
    platformSwitcherLabel: 'Escolha a plataforma',
    headline: 'O panorama completo.',
    summary: (followers, following, nonFollowers) => `${followers} seguidores · ${following} seguindo · ${nonFollowers} não te seguem de volta`,
  },
  heroStats: {
    followers: 'Seguidores', following: 'Seguindo', mutuals: 'Mútuos', nonFollowers: 'Não te seguem',
    noFollowBackPct: '% sem seguir de volta', followRatio: 'Proporção de seguimento',
  },
  audience: {
    sectionLabel: 'Audiência', title: 'Quem te segue',
    mutuals: 'Mútuos', dontFollowBack: 'Não te seguem de volta', fans: 'Fãs (te seguem)',
    tooltipRatio: 'Proporção', tooltipAccounts: 'Contas',
  },
  ratio: {
    sectionLabel: 'Proporção de seguimento', title: 'Seguidores vs seguindo',
    tooltipAria: 'O que é a proporção de seguimento?', tooltipTitle: 'O que é a proporção de seguimento?',
    tooltipP1: 'Seguidores ÷ Seguindo. Uma proporção de 1.0 significa igualdade. Acima de 1.0 significa que mais pessoas te seguem do que você segue de volta.',
    tooltipP2: 'A maioria das contas tem uma proporção bem abaixo de 1.0, isso é normal. Uma proporção muito baixa (como 0.00) geralmente significa que você seguiu muitas contas que nunca te seguiram de volta.',
    howToImprove: 'COMO MELHORAR',
    tooltipP3: 'Use a página de resultados para triar quem não te segue de volta. Marque-os como Deixar de seguir e deixe de segui-los no app. À medida que seu número de seguindo cai, a proporção sobe.',
    moreFollowers: (x) => `${x}x mais seguidores do que seguindo.`,
    followingMore: (x) => `Você segue ${x}x mais do que te seguem.`,
    improving: '↑ Melhorando', declining: '↓ Caindo', stable: '→ Estável',
    ratioOverTime: 'PROPORÇÃO AO LONGO DO TEMPO',
    chartAria: (n, fromRatio, fromDate, toRatio, toDate) =>
      `Proporção de seguimento nos seus últimos ${n} snapshots: de ${fromRatio} em ${fromDate} a ${toRatio} em ${toDate}.`,
  },
  followAge: {
    sectionLabel: 'Tempo de seguimento', title: 'Há quanto tempo você está esperando',
    emptyMessage: 'Registros de data e hora não disponíveis em exportações HTML. Baixe novamente em JSON para desbloquear isso.',
    longWait: 'Espera longa', longWaitDesc: 'contas que você segue há 1+ ano sem retorno',
    longestWait: 'Espera mais longa',
    followedDaysAgo: (n) => `seguido há ${n} dias - ainda esperando`,
    visitProfileToUnfollow: 'Visite o perfil para deixar de seguir',
    topOldest: (n) => `${n} não seguidores mais antigos`,
    copyAll: 'Copiar todos os usuários', copied: '✓ Copiado!', clickBarToSee: 'Clique em uma barra para ver as contas',
    chartAria: (parts) => `Não seguidores por quanto tempo você os segue: ${parts}.`,
    accountsSuffix: 'contas',
    buckets: ['< 1 mês', '1–6 meses', '6–12 meses', '1–2 anos', '2+ anos'],
  },
  pending: {
    sectionLabel: 'Solicitações pendentes', title: 'Enviadas, não aceitas',
    emptyMessage: 'Ninguém te deixando esperando.',
    bucket90: '90+ dias', bucket30to90: '30–90 dias', bucketUnder30: '< 30 dias',
    filterBy: (label) => `Filtrar por ${label}`,
    tapToReset: 'toque para redefinir', sortToTop: 'ordenar no topo',
    labelsYearPlus: ['Mais de um ano e nada.', 'Solicitação antiga.', 'Deixa pra lá.', 'Esqueceram.'],
    labelsHalfYear: ['Meio ano.', 'Seis meses ignorada.', 'Silêncio longo.', 'Provavelmente nunca.'],
    labelsNinetyDays: ['Já viram.', 'Sem resposta.', 'Ainda esperando.', 'Levou um perdido.'],
    labelsThirtyDays: ['Provavelmente não.', 'Esfriando.', 'Ainda pendente.', 'Sem pressa, aparentemente.'],
  },
  recentlyUnfollowed: {
    sectionLabel: 'Deixados de seguir recentemente', title: 'Sua limpeza recente',
    emptyMessage: 'Isso não foi incluído na sua exportação.',
  },
  growth: {
    sectionLabel: 'Crescimento', title: 'Crescimento de seguidores ao longo do tempo',
    emptyMessage: 'Envie um segundo snapshot para ver sua tendência de crescimento.',
    sinceLastSnapshot: 'desde o último snapshot',
    biggestDrop: (date, n) => `Maior queda: ${date} - perdeu ${n} seguidores em um período.`,
    chartAria: (n, fromCount, fromDate, toCount, toDate, dropSuffix) =>
      `Número de seguidores em ${n} snapshots, de ${fromCount} em ${fromDate} a ${toCount} em ${toDate}${dropSuffix}.`,
    dropSuffix: (date, n) => `. A maior queda foi em ${date}, perdendo ${n} seguidores`,
    followersUnit: 'seguidores',
    gained: (n) => `+${n} ganhos`,
    lost: (n) => `−${n} perdidos`,
    totalGained: 'total ganho', totalLost: 'total perdido',
  },
  radarModal: {
    eyebrow: 'RADAR', title: 'O que é o Radar?',
    intro: 'O Radar é a camada de inteligência sobre sua exportação do Instagram ou do Threads. Enquanto a página de resultados diz quem não te segue de volta agora, o Radar conta a história completa: tendências, saúde, histórico e contexto. Ele transforma um snapshot estático em uma visão contínua da sua conta.',
    sections: [
      { icon: '⬡', title: 'Check-up da conta', body: 'O Radar faz uma série de verificações concretas na sua exportação: pedidos pendentes antigos, o ano de follows que nunca seguiu de volta, rajadas de follows, quedas repentinas, mútuos perdidos e mais. Cada uma vem com seus números reais e uma ação, em ordem de impacto.' },
      { icon: '↑', title: 'Crescimento de seguidores ao longo do tempo', body: 'Toda vez que você envia uma nova exportação, o Radar plota seu número de seguidores em uma linha do tempo. Você pode ver exatamente quando ganhou ou perdeu seguidores, e qual período teve a maior queda. Transforma um número estático em uma história.' },
      { icon: '⧗', title: 'Análise de tempo de seguimento', body: 'O Radar lê os registros de data e hora da sua exportação para dizer há quanto tempo você segue pessoas que nunca te seguiram de volta. Dividido em faixas: menos de um mês, 1–6 meses, 6–12, 1–2 anos e 2+ anos. Quanto mais longa a espera, mais frio o interesse.' },
      { icon: '◎', title: 'Detalhamento de audiência', body: 'Nem todos os seguidores são iguais. O Radar divide sua audiência em Mútuos (se seguem mutuamente), Não seguidores (você os segue, eles não seguem de volta) e Fãs (te seguem, você não os segue). Um gráfico de rosca torna isso instantâneo.' },
      { icon: '⏳', title: 'Solicitações de seguimento pendentes (Instagram)', body: 'O Instagram registra cada solicitação de seguimento que você enviou e que não foi aceita. O Radar as mostra, ordenadas da mais antiga para a mais recente. Solicitações com mais de 30 dias são sinalizadas. Mais de 90 dias: "Já viram." Você decide o que fazer.' },
      { icon: '✓', title: 'Deixados de seguir recentemente', body: 'O Instagram e o Threads registram cada conta que você deixou de seguir recentemente. O Radar mostra isso de volta para você, útil para confirmar que você já resolveu alguém, ou para ver padrões em quem você está cortando.' },
    ],
    tipLabel: 'Como aproveitar mais o Radar:',
    tip: 'Envie uma nova exportação a cada poucas semanas. Cada envio adiciona um ponto de dados à sua linha do tempo, refina sua tendência de crescimento e libera as verificações que comparam duas exportações.',
  },
  tutorial: [
    { title: 'O radar', body: 'Cada padrão que dá para arrumar vira um ponto. Quanto mais perto do centro, maior o impacto. Abra qualquer um para ver as contas por trás.' },
    { title: 'Gráfico de crescimento', body: 'Envie uma segunda exportação depois e isso se preenche: seguidores ganhos, perdidos e variação líquida ao longo do tempo.' },
    { title: 'Detalhamento de audiência', body: 'Seus seguidores divididos em mútuos, fãs e não seguidores, com um gráfico de rosca e proporção de seguimento.' },
    { title: 'Barras de tempo de seguimento', body: 'Há quanto tempo você segue cada não seguidor. Toque em uma barra para expandi-la e ver as contas nessa faixa.' },
    { title: 'Solicitações pendentes', body: 'Solicitações de seguimento que você enviou e que ainda não foram aceitas, extraídas da sua exportação.' },
    { title: 'Deixados de seguir recentemente', body: 'Contas na sua exportação anterior mas não nesta - deixaram de te seguir entre os envios.' },
  ],
  tutorialLabels: { featureTour: 'Tour de recursos', skipTour: 'Pular tour', next: 'Próximo', gotIt: 'Entendi' },
  proLock: {
    eyebrow: 'Recurso Pro',
    title: 'O Radar é um recurso Pro',
    description: 'Seu check-up da conta, crescimento ao longo do tempo, detalhamento de audiência e análise de tempo de seguimento. Desbloqueie o panorama completo da sua conta.',
    cta: 'Assinar Pro',
  },
  openOn: (u, app) => `Abrir @${u} no ${app}`,
  platformEmpty: {
    title: (app) => `Ainda não há snapshot do ${app}`,
    body: (app) => `Envie sua exportação do ${app} para ver o Radar dele aqui. Os dados do seu outro app ficam separados.`,
    cta: 'Enviar uma exportação',
  },
};

export function getDashboardContent(locale: string): DashboardContent {
  if (locale === 'es') return ES;
  if (locale === 'pt') return PT;
  return EN;
}
