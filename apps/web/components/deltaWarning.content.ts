// Copy for the "incremental export" warning (components/DeltaWarning.tsx).
// Rich sentences are arrays that alternate plain and bold text:
// even indexes render plain, odd indexes render <strong>.
// Plain data only (no functions): it is passed from a Server Component to a
// Client Component. {followers} and {following} are filled in at render.

export interface DeltaWarningContent {
  topLabel: string;
  headingPrefix: string;
  headingHighlight: string;
  tip: string[];
  allTime: string;
  tipAfter: string;
  body: string[];
  whyLabel: string;
  reasons: {
    smallCountsOne: string;
    smallCounts: string;
    allRecent: string;
    massiveDrop: string;
    limitedDateRange: string;
  };
  whatLabel: string;
  step1: string[];
  step2: string;
  step3: string;
  cta: string;
  notIncremental: string;
  chooseWhy: string;
  newAccount: string;
  proceedAnyway: string;
  // Swapped in when the export was made with a date range shorter than All
  // time (DeltaReason 'limited_date_range'), which is a different mistake
  // from uploading a scheduled incremental export.
  dateRange: {
    headingPrefix: string;
    headingHighlight: string;
    tip: string[];
    body: string[];
    notIncremental: string;
    newAccount: string;
  };
}

export const DELTA_WARNING_EN: DeltaWarningContent = {
  topLabel: 'EXPORT WARNING',
  headingPrefix: 'This looks like an',
  headingHighlight: 'incremental export',
  tip: ['An ', 'incremental export', ' is what Meta sends on a schedule. It only contains activity since your last export, not your full account history. To get complete data, manually request a new export and select '],
  allTime: 'All time',
  tipAfter: ' as the date range.',
  body: ['Scheduled exports from Instagram and Threads only include ', 'new activity since your last export', ', not your complete followers and following lists. Uploading this will produce incorrect results.'],
  whyLabel: 'WHY WE THINK THIS',
  reasons: {
    smallCountsOne: 'Only {followers} follower and {following} following detected. Full exports typically have hundreds or thousands.',
    smallCounts: 'Only {followers} followers and {following} following detected. Full exports typically have hundreds or thousands.',
    allRecent: 'All follow timestamps are from the last 14 days, which is typical of an incremental export.',
    massiveDrop: 'Follower count dropped over 80% compared to your previous snapshot.',
    limitedDateRange: 'None of your {followers} followers in this file followed you more than a year before the export. Unless your account is that new, the date range was shorter than All time.',
  },
  whatLabel: 'WHAT TO DO',
  step1: ['Go to the Instagram or Threads ', 'Accounts Center', ', then ', 'Your information and permissions', ', then ', 'Download your information'],
  step2: 'Request a new export and set the date range to',
  step3: 'Wait for the email from Meta, then upload the new ZIP here',
  cta: 'Take me to re-export with',
  notIncremental: 'This is not an incremental export',
  chooseWhy: 'Choose why you want to continue:',
  newAccount: 'My account is new. I genuinely have under 50 followers.',
  proceedAnyway: 'I know the results may be incorrect. Show me anyway.',
  dateRange: {
    headingPrefix: 'This looks like a',
    headingHighlight: 'partial export',
    tip: ['Meta only puts follows made ', 'inside the date range you pick', ' into the export. To get your full lists, request a new export and select '],
    body: ['This export only covers ', 'recent follows', '. Everyone who followed you before the date range is missing from the file, so they would wrongly show up as not following you back.'],
    notIncremental: 'My export is complete',
    newAccount: 'My account is less than a year old. This is everyone.',
  },
};

export const DELTA_WARNING_ES: DeltaWarningContent = {
  topLabel: 'AVISO SOBRE EL EXPORT',
  headingPrefix: 'Esto parece un',
  headingHighlight: 'export incremental',
  tip: ['Un ', 'export incremental', ' es lo que Meta envía de forma programada. Solo incluye la actividad desde tu último export, no el historial completo de tu cuenta. Para tener los datos completos, solicita un export nuevo a mano y elige '],
  allTime: 'Todo el tiempo',
  tipAfter: ' como rango de fechas.',
  body: ['Los exports programados de Instagram y Threads solo incluyen ', 'la actividad nueva desde tu último export', ', no tus listas completas de seguidores y seguidos. Si subes este, los resultados serán incorrectos.'],
  whyLabel: 'POR QUÉ LO CREEMOS',
  reasons: {
    smallCountsOne: 'Solo se detectaron {followers} seguidor y {following} seguidos. Los exports completos suelen tener cientos o miles.',
    smallCounts: 'Solo se detectaron {followers} seguidores y {following} seguidos. Los exports completos suelen tener cientos o miles.',
    allRecent: 'Todas las fechas de seguimiento son de los últimos 14 días, algo típico de un export incremental.',
    massiveDrop: 'El número de seguidores bajó más de un 80% respecto a tu snapshot anterior.',
    limitedDateRange: 'Ninguno de tus {followers} seguidores en este archivo te sigue desde hace más de un año antes del export. Salvo que tu cuenta sea así de nueva, el rango de fechas fue más corto que Todo el tiempo.',
  },
  whatLabel: 'QUÉ HACER',
  step1: ['Ve al ', 'Centro de cuentas', ' de Instagram o Threads, luego a ', 'Tu información y permisos', ' y después a ', 'Descargar tu información'],
  step2: 'Solicita un export nuevo y pon el rango de fechas en',
  step3: 'Espera el correo de Meta y luego sube aquí el ZIP nuevo',
  cta: 'Llévame a exportar de nuevo con',
  notIncremental: 'No es un export incremental',
  chooseWhy: 'Elige por qué quieres continuar:',
  newAccount: 'Mi cuenta es nueva. De verdad tengo menos de 50 seguidores.',
  proceedAnyway: 'Sé que los resultados pueden ser incorrectos. Muéstramelos igual.',
  dateRange: {
    headingPrefix: 'Esto parece un',
    headingHighlight: 'export parcial',
    tip: ['Meta solo incluye en el export los seguimientos hechos ', 'dentro del rango de fechas que elijas', '. Para tener tus listas completas, solicita un export nuevo y elige '],
    body: ['Este export solo cubre ', 'seguimientos recientes', '. Quien te siguió antes del rango de fechas no está en el archivo, así que aparecería por error como alguien que no te sigue de vuelta.'],
    notIncremental: 'Mi export está completo',
    newAccount: 'Mi cuenta tiene menos de un año. Esto es todo.',
  },
};

export const DELTA_WARNING_PT: DeltaWarningContent = {
  topLabel: 'AVISO SOBRE O EXPORT',
  headingPrefix: 'Isto parece um',
  headingHighlight: 'export incremental',
  tip: ['Um ', 'export incremental', ' é o que a Meta envia de forma programada. Ele só inclui a atividade desde o seu último export, não o histórico completo da sua conta. Para ter os dados completos, solicite um novo export manualmente e escolha '],
  allTime: 'Todo o período',
  tipAfter: ' como período.',
  body: ['Os exports programados do Instagram e do Threads só incluem ', 'a atividade nova desde o seu último export', ', não suas listas completas de seguidores e seguindo. Enviar este vai gerar resultados incorretos.'],
  whyLabel: 'POR QUE ACHAMOS ISSO',
  reasons: {
    smallCountsOne: 'Só {followers} seguidor e {following} seguindo foram detectados. Exports completos costumam ter centenas ou milhares.',
    smallCounts: 'Só {followers} seguidores e {following} seguindo foram detectados. Exports completos costumam ter centenas ou milhares.',
    allRecent: 'Todas as datas de quando você seguiu são dos últimos 14 dias, algo típico de um export incremental.',
    massiveDrop: 'O número de seguidores caiu mais de 80% em relação ao seu snapshot anterior.',
    limitedDateRange: 'Nenhum dos seus {followers} seguidores neste arquivo segue você há mais de um ano antes do export. A não ser que sua conta seja nova assim, o período escolhido foi menor que Todo o período.',
  },
  whatLabel: 'O QUE FAZER',
  step1: ['Vá na ', 'Central de contas', ' do Instagram ou do Threads, depois em ', 'Suas informações e permissões', ' e então em ', 'Baixar suas informações'],
  step2: 'Solicite um novo export e defina o período como',
  step3: 'Espere o email da Meta e depois envie o novo ZIP aqui',
  cta: 'Me leve para exportar de novo com',
  notIncremental: 'Não é um export incremental',
  chooseWhy: 'Escolha por que você quer continuar:',
  newAccount: 'Minha conta é nova. Eu realmente tenho menos de 50 seguidores.',
  proceedAnyway: 'Sei que os resultados podem estar incorretos. Mostre mesmo assim.',
  dateRange: {
    headingPrefix: 'Isto parece um',
    headingHighlight: 'export parcial',
    tip: ['A Meta só coloca no export quem seguiu ', 'dentro do período que você escolher', '. Para ter suas listas completas, solicite um novo export e escolha '],
    body: ['Este export só cobre ', 'seguidas recentes', '. Quem seguiu você antes do período não está no arquivo, então apareceria por engano como alguém que não te segue de volta.'],
    notIncremental: 'Meu export está completo',
    newAccount: 'Minha conta tem menos de um ano. Isso é tudo.',
  },
};
