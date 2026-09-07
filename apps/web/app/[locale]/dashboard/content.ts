export interface DashboardContent {
  metaTitle: string;
  loadingRadar: string;
  emptyState: {
    title: string;
    body: string;
    uploadExport: string;
    howToExport: string;
  };
  header: {
    radar: string;
    exportDate: (date: string) => string;
    whatIsRadar: string;
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
  health: {
    accountHealth: string;
    gradeDesc: Record<'A' | 'B' | 'C' | 'D' | 'F', string>;
    scoreSummary: { topTier: string; aboveAverage: string; roomToGrow: string; needsWork: string; critical: string };
    breakdownLabels: { ratio: string; mutual: string; nonFollower: string; growth: string };
    ratioNote: (tier: number, ratio: string) => string;
    ratioAction: (tier: number, nonFollowers: number, improvedRatio: string) => string;
    mutualNote: (tier: number, pct: number) => string;
    mutualAction: (isHigh: boolean, toRemove: number) => string;
    nfNote: (tier: number, pct: number, toHitTen: number) => string;
    nfAction: (isLow: boolean, toHitTen: number) => string;
    growthNote: (kind: 'noData' | 'strong' | 'positive' | 'flat' | 'slight' | 'drop', delta: number) => string;
    growthAction: (kind: 'noData' | 'keepCadence' | 'uploadMore' | 'checkCompare') => string;
  };
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
  proLock: { title: string; description: string };
  openOnInstagram: (username: string) => string;
}

const EN: DashboardContent = {
  metaTitle: 'Radar',
  loadingRadar: 'Loading Radar…',
  emptyState: {
    title: 'No data to scan yet',
    body: 'Radar needs an Instagram export to analyze. Upload your data once and your follower radar, non-followers, and growth show up here. Nothing leaves your browser.',
    uploadExport: 'Upload your export',
    howToExport: 'How to export',
  },
  header: {
    radar: 'RADAR',
    exportDate: (date) => `· ${date}`,
    whatIsRadar: 'What is Radar?',
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
    tooltipP3: 'Use the Results page to triage non-followers. Mark them as Dropping and unfollow them on Instagram. As your following count drops, the ratio rises.',
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
    emptyMessage: "Instagram didn't include this in your export.",
  },
  health: {
    accountHealth: 'ACCOUNT HEALTH',
    gradeDesc: {
      A: 'Top tier. Your account is clean, growing, and well-balanced.',
      B: 'One focused cleanup session pushes this to an A.',
      C: 'Average standing. Your non-follower list needs attention - start with the oldest.',
      D: 'Multiple signals need work. Open the triage list now.',
      F: 'Account health is critical. The triage list is your first priority today.',
    },
    scoreSummary: { topTier: 'Top tier', aboveAverage: 'Above average', roomToGrow: 'Room to grow', needsWork: 'Needs work', critical: 'Critical' },
    breakdownLabels: { ratio: 'Follow ratio', mutual: 'Mutual health', nonFollower: 'Non-follower %', growth: 'Growth trend' },
    ratioNote: (tier, ratio) => [
      `${ratio}x ratio - top tier. Followers outnumber following 2:1.`,
      `${ratio}x ratio - healthy. Unfollow non-followers to push toward 2x.`,
      `${ratio}x ratio - you follow more than follow you. Triage the list.`,
      `${ratio}x ratio - significantly one-sided. Needs a cleanup session.`,
      `${ratio}x ratio - critical imbalance. Start with the oldest non-followers.`,
    ][tier]!,
    ratioAction: (tier, nonFollowers, improvedRatio) => [
      'Maintain this.',
      `Unfollow ${nonFollowers} non-followers → ratio hits ${improvedRatio}x.`,
      `Unfollowing non-followers alone pushes ratio to ${improvedRatio}x.`,
    ][tier]!,
    mutualNote: (tier, pct) => [
      `${pct}% mutual - elite account hygiene. Most follows are intentional.`,
      `${pct}% mutual - above average. A small cleanup hits the 70% threshold.`,
      `${pct}% mutual - below average. Half your following doesn't follow back.`,
      `${pct}% mutual - most follows aren't returned. Worth a full audit.`,
      `${pct}% mutual - almost no reciprocation. Start triaging today.`,
    ][tier]!,
    mutualAction: (isHigh, toRemove) => isHigh ? 'Nothing to do here.' : `Remove ${toRemove} one-sided follows → hits 70%.`,
    nfNote: (tier, pct, toHitTen) => [
      `Only ${pct}% don't follow back - already elite.`,
      `${pct}% don't follow back. ${toHitTen} removals hit the <10% mark.`,
      `${pct}% don't follow back. Triage the list - quick wins are in there.`,
      `${pct}% don't follow back. Nearly half. This is the main thing to fix.`,
      `${pct}% don't follow back - over half. This is the #1 priority.`,
    ][tier]!,
    nfAction: (isLow, toHitTen) => isLow ? 'Maintain this.' : `Unfollow ${toHitTen} accounts → non-follower rate drops to 10% (A-grade threshold).`,
    growthNote: (kind, delta) => ({
      noData: 'Only 1 snapshot - no trend to measure yet.',
      strong: `+${delta} followers since last snapshot. Strong growth.`,
      positive: `+${delta} followers since last snapshot. Positive momentum.`,
      flat: 'No change since last snapshot. Neither growing nor declining.',
      slight: `${delta} followers since last snapshot. Slight decline.`,
      drop: `${delta} followers since last snapshot. Significant drop.`,
    })[kind],
    growthAction: (kind) => ({
      noData: 'Upload again in 2 weeks - then trend data unlocks.',
      keepCadence: 'Keep the cadence. Upload every 2 weeks to track momentum.',
      uploadMore: 'Upload more snapshots to find your real pattern over time.',
      checkCompare: 'Check who unfollowed in the Compare view - find the pattern.',
    })[kind],
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
    intro: "Radar is the intelligence layer on top of your Instagram export. While the results page tells you who doesn't follow you back right now, Radar tells you the full story - trends, health, history, and context. It turns a static snapshot into an ongoing picture of your account.",
    sections: [
      { icon: '⬡', title: 'Account Health Score', body: 'Radar calculates a single A–F grade from four signals: your follow ratio, how many of your following are mutual, your non-follower rate, and your growth trend over time. One letter that tells the whole story - and gives you something to improve.' },
      { icon: '↑', title: 'Follower Growth Over Time', body: 'Every time you upload a new Instagram export, Radar plots your follower count on a timeline. You can see exactly when you gained or lost followers, and which period had the biggest drop. It turns a static number into a story.' },
      { icon: '⧗', title: 'Follow Age Analysis', body: "Radar reads the timestamps in your export to tell you how long you've been following people who never followed back. Broken into buckets: under a month, 1–6 months, 6–12, 1–2 years, and 2+ years. The longer the wait, the colder the lead." },
      { icon: '◎', title: 'Audience Breakdown', body: "Not all followers are equal. Radar splits your audience into Mutuals (both follow each other), Non-followers (you follow them, they don't follow back), and Fans (they follow you, you don't follow back). A donut chart makes it instant." },
      { icon: '⏳', title: 'Pending Follow Requests', body: 'Instagram tracks every follow request you\'ve sent that hasn\'t been accepted. Radar surfaces them, sorted oldest-first. Requests over 30 days get flagged. Over 90 days: "They saw it." You decide what to do.' },
      { icon: '✓', title: 'Recently Unfollowed', body: "Instagram logs every account you've recently unfollowed. Radar shows it back to you - useful for confirming you already handled someone, or for seeing patterns in who you're cutting." },
    ],
    tipLabel: 'How to get more from Radar:',
    tip: 'Upload a new export every few weeks. Each upload adds a data point to your timeline, sharpens your growth trend, and improves the accuracy of your health score.',
  },
  tutorial: [
    { title: 'Account health score', body: 'A grade from your follow ratio, non-follower %, and triage progress. Improves as you work the list.' },
    { title: 'Growth chart', body: 'Upload a second export later and this fills in - followers gained, lost, and net change over time.' },
    { title: 'Audience breakdown', body: 'Your followers split into mutuals, fans, and non-followers - with a donut chart and follow ratio.' },
    { title: 'Follow age bars', body: "How long you've been following each non-follower. Tap a bar to expand it and see the accounts in that range." },
    { title: 'Pending requests', body: "Follow requests you sent that haven't been accepted yet - pulled from your export." },
    { title: 'Recently unfollowed', body: 'Accounts in your previous export but not this one - they unfollowed you between uploads.' },
  ],
  tutorialLabels: { featureTour: 'Feature tour', skipTour: 'Skip tour', next: 'Next', gotIt: 'Got it' },
  proLock: {
    title: 'Radar is a Pro feature',
    description: 'Your account health score, growth over time, audience breakdown, follow-age analysis, and pending requests. Unlock the full picture of your account.',
  },
  openOnInstagram: (u) => `Open @${u} on Instagram`,
};

const ES: DashboardContent = {
  metaTitle: 'Radar',
  loadingRadar: 'Cargando Radar…',
  emptyState: {
    title: 'Aún no hay datos para analizar',
    body: 'Radar necesita una exportación de Instagram para analizar. Sube tus datos una vez y tu radar de seguidores, no seguidores y crecimiento aparecerán aquí. Nada sale de tu navegador.',
    uploadExport: 'Sube tu exportación',
    howToExport: 'Cómo exportar',
  },
  header: {
    radar: 'RADAR',
    exportDate: (date) => `· ${date}`,
    whatIsRadar: '¿Qué es Radar?',
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
    tooltipP3: 'Usa la página de resultados para clasificar a quienes no te siguen. Márcalos como Dejar de seguir y déjalos de seguir en Instagram. A medida que baje tu número de seguidos, el ratio sube.',
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
    emptyMessage: 'Instagram no incluyó esto en tu exportación.',
  },
  health: {
    accountHealth: 'SALUD DE LA CUENTA',
    gradeDesc: {
      A: 'Nivel superior. Tu cuenta está limpia, creciendo y bien equilibrada.',
      B: 'Una sesión de limpieza enfocada la lleva a un A.',
      C: 'Nivel promedio. Tu lista de no seguidores necesita atención: empieza por los más antiguos.',
      D: 'Varias señales necesitan trabajo. Abre la lista de clasificación ahora.',
      F: 'La salud de la cuenta es crítica. La lista de clasificación es tu prioridad número uno hoy.',
    },
    scoreSummary: { topTier: 'Nivel superior', aboveAverage: 'Por encima del promedio', roomToGrow: 'Con margen de mejora', needsWork: 'Necesita trabajo', critical: 'Crítico' },
    breakdownLabels: { ratio: 'Ratio de seguimiento', mutual: 'Salud de mutuos', nonFollower: '% sin seguimiento mutuo', growth: 'Tendencia de crecimiento' },
    ratioNote: (tier, ratio) => [
      `Ratio de ${ratio}x - nivel superior. Los seguidores superan 2 a 1 a los seguidos.`,
      `Ratio de ${ratio}x - saludable. Deja de seguir a quienes no te siguen para acercarte a 2x.`,
      `Ratio de ${ratio}x - sigues a más de los que te siguen. Clasifica la lista.`,
      `Ratio de ${ratio}x - muy desequilibrado. Necesita una sesión de limpieza.`,
      `Ratio de ${ratio}x - desequilibrio crítico. Empieza por los no seguidores más antiguos.`,
    ][tier]!,
    ratioAction: (tier, nonFollowers, improvedRatio) => [
      'Mantén esto así.',
      `Deja de seguir a ${nonFollowers} no seguidores → el ratio llega a ${improvedRatio}x.`,
      `Solo con dejar de seguir a los no seguidores, el ratio sube a ${improvedRatio}x.`,
    ][tier]!,
    mutualNote: (tier, pct) => [
      `${pct}% mutuo - higiene de cuenta de élite. La mayoría de tus follows son intencionales.`,
      `${pct}% mutuo - por encima del promedio. Una pequeña limpieza alcanza el umbral del 70%.`,
      `${pct}% mutuo - por debajo del promedio. La mitad de a quienes sigues no te sigue de vuelta.`,
      `${pct}% mutuo - la mayoría de tus follows no se corresponden. Vale la pena una auditoría completa.`,
      `${pct}% mutuo - casi ninguna reciprocidad. Empieza a clasificar hoy.`,
    ][tier]!,
    mutualAction: (isHigh, toRemove) => isHigh ? 'No hay nada que hacer aquí.' : `Elimina ${toRemove} follows unilaterales → alcanzas el 70%.`,
    nfNote: (tier, pct, toHitTen) => [
      `Solo el ${pct}% no te sigue de vuelta - ya eres de élite.`,
      `${pct}% no te sigue de vuelta. ${toHitTen} eliminaciones alcanzan la marca del <10%.`,
      `${pct}% no te sigue de vuelta. Clasifica la lista, ahí hay victorias rápidas.`,
      `${pct}% no te sigue de vuelta. Casi la mitad. Esto es lo principal a corregir.`,
      `${pct}% no te sigue de vuelta - más de la mitad. Esta es la prioridad número uno.`,
    ][tier]!,
    nfAction: (isLow, toHitTen) => isLow ? 'Mantén esto así.' : `Deja de seguir a ${toHitTen} cuentas → la tasa de no seguidores baja al 10% (umbral de grado A).`,
    growthNote: (kind, delta) => ({
      noData: 'Solo 1 snapshot - aún no hay tendencia que medir.',
      strong: `+${delta} seguidores desde el último snapshot. Crecimiento fuerte.`,
      positive: `+${delta} seguidores desde el último snapshot. Impulso positivo.`,
      flat: 'Sin cambios desde el último snapshot. Ni crece ni decae.',
      slight: `${delta} seguidores desde el último snapshot. Ligero descenso.`,
      drop: `${delta} seguidores desde el último snapshot. Caída significativa.`,
    })[kind],
    growthAction: (kind) => ({
      noData: 'Sube otra exportación en 2 semanas, entonces se desbloquean los datos de tendencia.',
      keepCadence: 'Mantén el ritmo. Sube una exportación cada 2 semanas para seguir el impulso.',
      uploadMore: 'Sube más snapshots para encontrar tu patrón real con el tiempo.',
      checkCompare: 'Revisa quién te dejó de seguir en la vista de comparación, ahí está el patrón.',
    })[kind],
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
    intro: 'Radar es la capa de inteligencia sobre tu exportación de Instagram. Mientras la página de resultados te dice quién no te sigue de vuelta ahora mismo, Radar te cuenta la historia completa: tendencias, salud, historial y contexto. Convierte un snapshot estático en una imagen continua de tu cuenta.',
    sections: [
      { icon: '⬡', title: 'Puntuación de salud de la cuenta', body: 'Radar calcula una única calificación de A a F a partir de cuatro señales: tu ratio de seguimiento, cuántos de tus seguidos son mutuos, tu tasa de no seguidores y tu tendencia de crecimiento en el tiempo. Una sola letra que cuenta toda la historia y te da algo que mejorar.' },
      { icon: '↑', title: 'Crecimiento de seguidores en el tiempo', body: 'Cada vez que subes una nueva exportación de Instagram, Radar traza tu número de seguidores en una línea de tiempo. Puedes ver exactamente cuándo ganaste o perdiste seguidores, y qué período tuvo la mayor caída. Convierte un número estático en una historia.' },
      { icon: '⧗', title: 'Análisis de antigüedad de seguimiento', body: 'Radar lee las marcas de tiempo en tu exportación para decirte cuánto tiempo llevas siguiendo a personas que nunca te siguieron de vuelta. Dividido en rangos: menos de un mes, 1–6 meses, 6–12, 1–2 años y 2+ años. Cuanto más larga la espera, más frío el interés.' },
      { icon: '◎', title: 'Desglose de audiencia', body: 'No todos los seguidores son iguales. Radar divide tu audiencia en Mutuos (se siguen entre sí), No seguidores (los sigues, no te siguen de vuelta) y Fans (te siguen, no los sigues). Un gráfico de dona lo hace instantáneo.' },
      { icon: '⏳', title: 'Solicitudes de seguimiento pendientes', body: 'Instagram registra cada solicitud de seguimiento que has enviado y que no ha sido aceptada. Radar las muestra, ordenadas de más antigua a más reciente. Las solicitudes de más de 30 días se marcan. Más de 90 días: "Ya lo vieron." Tú decides qué hacer.' },
      { icon: '✓', title: 'Dejados de seguir recientemente', body: 'Instagram registra cada cuenta que has dejado de seguir recientemente. Radar te lo muestra de nuevo, útil para confirmar que ya resolviste a alguien, o para ver patrones en a quién estás dejando de seguir.' },
    ],
    tipLabel: 'Cómo sacarle más provecho a Radar:',
    tip: 'Sube una nueva exportación cada pocas semanas. Cada subida añade un punto de datos a tu línea de tiempo, afina tu tendencia de crecimiento y mejora la precisión de tu puntuación de salud.',
  },
  tutorial: [
    { title: 'Puntuación de salud de la cuenta', body: 'Una calificación basada en tu ratio de seguimiento, % de no seguidores y progreso de clasificación. Mejora a medida que trabajas la lista.' },
    { title: 'Gráfico de crecimiento', body: 'Sube una segunda exportación más adelante y esto se completa: seguidores ganados, perdidos y cambio neto en el tiempo.' },
    { title: 'Desglose de audiencia', body: 'Tus seguidores se dividen en mutuos, fans y no seguidores, con un gráfico de dona y ratio de seguimiento.' },
    { title: 'Barras de antigüedad de seguimiento', body: 'Cuánto tiempo llevas siguiendo a cada no seguidor. Toca una barra para expandirla y ver las cuentas en ese rango.' },
    { title: 'Solicitudes pendientes', body: 'Solicitudes de seguimiento que enviaste y que aún no han sido aceptadas, extraídas de tu exportación.' },
    { title: 'Dejados de seguir recientemente', body: 'Cuentas en tu exportación anterior pero no en esta: te dejaron de seguir entre subidas.' },
  ],
  tutorialLabels: { featureTour: 'Recorrido guiado', skipTour: 'Saltar recorrido', next: 'Siguiente', gotIt: 'Entendido' },
  proLock: {
    title: 'Radar es una función Pro',
    description: 'Tu puntuación de salud de cuenta, crecimiento en el tiempo, desglose de audiencia, análisis de antigüedad de seguimiento y solicitudes pendientes. Desbloquea el panorama completo de tu cuenta.',
  },
  openOnInstagram: (u) => `Abrir @${u} en Instagram`,
};

const PT: DashboardContent = {
  metaTitle: 'Radar',
  loadingRadar: 'Carregando Radar…',
  emptyState: {
    title: 'Ainda não há dados para analisar',
    body: 'O Radar precisa de uma exportação do Instagram para analisar. Envie seus dados uma vez e seu radar de seguidores, não seguidores e crescimento aparecem aqui. Nada sai do seu navegador.',
    uploadExport: 'Envie sua exportação',
    howToExport: 'Como exportar',
  },
  header: {
    radar: 'RADAR',
    exportDate: (date) => `· ${date}`,
    whatIsRadar: 'O que é o Radar?',
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
    tooltipP3: 'Use a página de resultados para triar quem não te segue de volta. Marque-os como Deixar de seguir e deixe de segui-los no Instagram. À medida que seu número de seguindo cai, a proporção sobe.',
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
    emptyMessage: 'O Instagram não incluiu isso na sua exportação.',
  },
  health: {
    accountHealth: 'SAÚDE DA CONTA',
    gradeDesc: {
      A: 'Nível máximo. Sua conta está limpa, crescendo e bem equilibrada.',
      B: 'Uma sessão de limpeza focada leva isso a um A.',
      C: 'Nível médio. Sua lista de não seguidores precisa de atenção: comece pelos mais antigos.',
      D: 'Vários sinais precisam de trabalho. Abra a lista de triagem agora.',
      F: 'A saúde da conta é crítica. A lista de triagem é sua prioridade número um hoje.',
    },
    scoreSummary: { topTier: 'Nível máximo', aboveAverage: 'Acima da média', roomToGrow: 'Espaço para melhorar', needsWork: 'Precisa de trabalho', critical: 'Crítico' },
    breakdownLabels: { ratio: 'Proporção de seguimento', mutual: 'Saúde de mútuos', nonFollower: '% sem seguir de volta', growth: 'Tendência de crescimento' },
    ratioNote: (tier, ratio) => [
      `Proporção de ${ratio}x - nível máximo. Seguidores superam seguindo em 2 para 1.`,
      `Proporção de ${ratio}x - saudável. Deixe de seguir não seguidores para se aproximar de 2x.`,
      `Proporção de ${ratio}x - você segue mais do que te seguem. Trie a lista.`,
      `Proporção de ${ratio}x - significativamente desequilibrada. Precisa de uma sessão de limpeza.`,
      `Proporção de ${ratio}x - desequilíbrio crítico. Comece pelos não seguidores mais antigos.`,
    ][tier]!,
    ratioAction: (tier, nonFollowers, improvedRatio) => [
      'Mantenha assim.',
      `Deixe de seguir ${nonFollowers} não seguidores → a proporção chega a ${improvedRatio}x.`,
      `Só deixar de seguir os não seguidores já leva a proporção a ${improvedRatio}x.`,
    ][tier]!,
    mutualNote: (tier, pct) => [
      `${pct}% mútuo - higiene de conta de elite. A maioria dos seus follows é intencional.`,
      `${pct}% mútuo - acima da média. Uma pequena limpeza atinge o limite de 70%.`,
      `${pct}% mútuo - abaixo da média. Metade de quem você segue não te segue de volta.`,
      `${pct}% mútuo - a maioria dos seus follows não é correspondida. Vale uma auditoria completa.`,
      `${pct}% mútuo - quase nenhuma reciprocidade. Comece a triagem hoje.`,
    ][tier]!,
    mutualAction: (isHigh, toRemove) => isHigh ? 'Nada a fazer aqui.' : `Remova ${toRemove} follows unilaterais → atinge 70%.`,
    nfNote: (tier, pct, toHitTen) => [
      `Apenas ${pct}% não te seguem de volta - já é elite.`,
      `${pct}% não te seguem de volta. ${toHitTen} remoções atingem a marca de <10%.`,
      `${pct}% não te seguem de volta. Trie a lista, há vitórias rápidas ali.`,
      `${pct}% não te seguem de volta. Quase metade. Esse é o principal a corrigir.`,
      `${pct}% não te seguem de volta - mais da metade. Essa é a prioridade número um.`,
    ][tier]!,
    nfAction: (isLow, toHitTen) => isLow ? 'Mantenha assim.' : `Deixe de seguir ${toHitTen} contas → a taxa de não seguidores cai para 10% (limite de grau A).`,
    growthNote: (kind, delta) => ({
      noData: 'Apenas 1 snapshot - ainda não há tendência para medir.',
      strong: `+${delta} seguidores desde o último snapshot. Crescimento forte.`,
      positive: `+${delta} seguidores desde o último snapshot. Momentum positivo.`,
      flat: 'Sem mudanças desde o último snapshot. Nem crescendo nem caindo.',
      slight: `${delta} seguidores desde o último snapshot. Leve declínio.`,
      drop: `${delta} seguidores desde o último snapshot. Queda significativa.`,
    })[kind],
    growthAction: (kind) => ({
      noData: 'Envie outra exportação em 2 semanas - aí os dados de tendência são desbloqueados.',
      keepCadence: 'Mantenha o ritmo. Envie uma exportação a cada 2 semanas para acompanhar o momentum.',
      uploadMore: 'Envie mais snapshots para encontrar seu padrão real ao longo do tempo.',
      checkCompare: 'Veja quem deixou de te seguir na visão de comparação - encontre o padrão.',
    })[kind],
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
    intro: 'O Radar é a camada de inteligência sobre sua exportação do Instagram. Enquanto a página de resultados diz quem não te segue de volta agora, o Radar conta a história completa: tendências, saúde, histórico e contexto. Ele transforma um snapshot estático em uma visão contínua da sua conta.',
    sections: [
      { icon: '⬡', title: 'Pontuação de saúde da conta', body: 'O Radar calcula uma única nota de A a F a partir de quatro sinais: sua proporção de seguimento, quantos dos seus seguindo são mútuos, sua taxa de não seguidores e sua tendência de crescimento ao longo do tempo. Uma única letra que conta toda a história e te dá algo para melhorar.' },
      { icon: '↑', title: 'Crescimento de seguidores ao longo do tempo', body: 'Toda vez que você envia uma nova exportação do Instagram, o Radar plota seu número de seguidores em uma linha do tempo. Você pode ver exatamente quando ganhou ou perdeu seguidores, e qual período teve a maior queda. Transforma um número estático em uma história.' },
      { icon: '⧗', title: 'Análise de tempo de seguimento', body: 'O Radar lê os registros de data e hora da sua exportação para dizer há quanto tempo você segue pessoas que nunca te seguiram de volta. Dividido em faixas: menos de um mês, 1–6 meses, 6–12, 1–2 anos e 2+ anos. Quanto mais longa a espera, mais frio o interesse.' },
      { icon: '◎', title: 'Detalhamento de audiência', body: 'Nem todos os seguidores são iguais. O Radar divide sua audiência em Mútuos (se seguem mutuamente), Não seguidores (você os segue, eles não seguem de volta) e Fãs (te seguem, você não os segue). Um gráfico de rosca torna isso instantâneo.' },
      { icon: '⏳', title: 'Solicitações de seguimento pendentes', body: 'O Instagram registra cada solicitação de seguimento que você enviou e que não foi aceita. O Radar as mostra, ordenadas da mais antiga para a mais recente. Solicitações com mais de 30 dias são sinalizadas. Mais de 90 dias: "Já viram." Você decide o que fazer.' },
      { icon: '✓', title: 'Deixados de seguir recentemente', body: 'O Instagram registra cada conta que você deixou de seguir recentemente. O Radar mostra isso de volta para você, útil para confirmar que você já resolveu alguém, ou para ver padrões em quem você está cortando.' },
    ],
    tipLabel: 'Como aproveitar mais o Radar:',
    tip: 'Envie uma nova exportação a cada poucas semanas. Cada envio adiciona um ponto de dados à sua linha do tempo, refina sua tendência de crescimento e melhora a precisão da sua pontuação de saúde.',
  },
  tutorial: [
    { title: 'Pontuação de saúde da conta', body: 'Uma nota baseada na sua proporção de seguimento, % de não seguidores e progresso de triagem. Melhora conforme você trabalha na lista.' },
    { title: 'Gráfico de crescimento', body: 'Envie uma segunda exportação depois e isso se preenche: seguidores ganhos, perdidos e variação líquida ao longo do tempo.' },
    { title: 'Detalhamento de audiência', body: 'Seus seguidores divididos em mútuos, fãs e não seguidores, com um gráfico de rosca e proporção de seguimento.' },
    { title: 'Barras de tempo de seguimento', body: 'Há quanto tempo você segue cada não seguidor. Toque em uma barra para expandi-la e ver as contas nessa faixa.' },
    { title: 'Solicitações pendentes', body: 'Solicitações de seguimento que você enviou e que ainda não foram aceitas, extraídas da sua exportação.' },
    { title: 'Deixados de seguir recentemente', body: 'Contas na sua exportação anterior mas não nesta - deixaram de te seguir entre os envios.' },
  ],
  tutorialLabels: { featureTour: 'Tour de recursos', skipTour: 'Pular tour', next: 'Próximo', gotIt: 'Entendi' },
  proLock: {
    title: 'O Radar é um recurso Pro',
    description: 'Sua pontuação de saúde da conta, crescimento ao longo do tempo, detalhamento de audiência, análise de tempo de seguimento e solicitações pendentes. Desbloqueie o panorama completo da sua conta.',
  },
  openOnInstagram: (u) => `Abrir @${u} no Instagram`,
};

export function getDashboardContent(locale: string): DashboardContent {
  if (locale === 'es') return ES;
  if (locale === 'pt') return PT;
  return EN;
}
