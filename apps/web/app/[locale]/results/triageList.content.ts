import type { TriageState } from '@/hooks/useTriage';

export interface TriageOptionContent {
  state: TriageState;
  label: string;
  description: string;
  wittys: string[];
}

export interface TriageListContent {
  options: TriageOptionContent[];
  toast: { addedTo: (username: string) => string; whitelist: string; undo: string };
  clear: string;
  openOnInstagram: (username: string) => string;
  visited: string;
  progress: {
    triagedOf: (done: string, total: string) => string;
    gettingStarted: string;
    gettingSomewhere: string;
    halfwayThrough: string;
    listCleared: string;
  };
  proTeaser: {
    pro: string;
    body: string;
    upgradeToPro: string;
    dismissAria: string;
  };
  importBanner: {
    carryOverQuestion: string;
    from: string;
    loading: string;
    match: (n: number) => string;
    importable: { state: TriageState; label: string; description: string }[];
    importBtn: (n: number) => string;
    startFresh: string;
    dismissAria: string;
  };
  filters: {
    all: string;
    untriaged: string;
    allInfo: string;
    untriagedInfo: string;
    accountsHaventReviewed: string;
  };
  count: {
    accounts: (n: string) => string;
    ofTotal: (shown: string, total: string) => string;
  };
  noResultsFor: (q: string) => string;
  everyoneEarnedSpot: string;
  deactivatedSection: { label: string; description: string };
  whitelistSection: { label: string; description: string };
}

const EN: TriageListContent = {
  options: [
    {
      state: 'not_a_fan', label: 'Dropping',
      description: 'You plan to unfollow this account. Marks it for your clean-up run.',
      wittys: [
        'They made their choice. Now make yours.',
        'Long overdue.',
        'You already knew.',
        'No hard feelings. Well, maybe a few.',
        'The list gets shorter.',
        'This one was never a surprise.',
        'Cleaning house.',
        "It's not personal. Actually, it is.",
        'Ready when you are.',
        'They were never really there.',
        'One less distraction.',
        'You saw this coming.',
      ],
    },
    {
      state: 'let_it_slide', label: 'Whitelist',
      description: 'You want to keep following them - hides them from the list permanently.',
      wittys: [
        'You follow for the content. Fair enough.',
        "They don't follow back. You don't care. Perfect.",
        'Not everything needs to be mutual.',
        'Conscious decision. Respect.',
        'This one earns their place.',
        'Content over reciprocity.',
        'Some follows are just one-way. Fine.',
        'Quality content forgives a lot.',
        'You chose this. Intentionally.',
        'Keeping this one around.',
        'This one stays.',
        'No follow-back required.',
      ],
    },
    {
      state: 'done', label: 'Unfollowed',
      description: 'Already unfollowed them outside the app - marks it to keep your count accurate.',
      wittys: [
        'Gone. Next.',
        'Done and dusted.',
        'Clean cut.',
        "Didn't even notice, did they?",
        'You moved on.',
        'Already handled.',
        'One less.',
        'Lighter already?',
        "The algorithm won't miss them.",
        "That one's behind you.",
        "Didn't linger.",
        'Handled.',
      ],
    },
    {
      state: 'check_later', label: 'Skip for now',
      description: 'Not sure yet - come back to this one later. Nothing is marked.',
      wittys: [
        'Not today. Maybe not ever.',
        'Still deciding. Fair.',
        'The jury is still out.',
        'Come back when you know.',
        'Parking this one.',
        'Some decisions take time.',
        'No rush.',
        'One for the back burner.',
        'Complicated. Got it.',
        "Not ready yet. That's okay.",
        "We'll revisit.",
        'Leave it for now.',
      ],
    },
    {
      state: 'deactivated', label: 'Deactivated',
      description: 'This account is deactivated or deleted. Not a real unfollow. Moves them out of the list.',
      wittys: [
        "Not their choice. Instagram's.",
        "The account is gone, not the friendship.",
        "They didn't leave. They just… disappeared.",
        'Ghost account. Different kind of ghost.',
        "Can't unfollow you if they don't exist.",
        'Collateral damage.',
        'Instagram made this decision for them.',
        'Account closed. Case closed.',
        'Not a snub. Just a casualty.',
        'The platform got to them first.',
        'One less active account, one less clean break.',
        "They're gone. Probably temporary.",
      ],
    },
  ],
  toast: { addedTo: (u) => `@${u} added to`, whitelist: 'Whitelist', undo: 'Undo' },
  clear: 'Clear',
  openOnInstagram: (u) => `Open @${u} on Instagram`,
  visited: 'visited',
  progress: {
    triagedOf: (done, total) => `Triaged ${done} of ${total}`,
    gettingStarted: 'Getting started.',
    gettingSomewhere: "You're getting somewhere.",
    halfwayThrough: 'Halfway through. Radar is warming up.',
    listCleared: 'List cleared. Suspiciously loyal bunch.',
  },
  proTeaser: {
    pro: 'Pro',
    body: 'Upload a new export later and Pro carries this triage over, so you never re-triage the same accounts.',
    upgradeToPro: 'Upgrade to Pro',
    dismissAria: 'Dismiss',
  },
  importBanner: {
    carryOverQuestion: 'Carry over triage from a previous snapshot?',
    from: 'From:',
    loading: 'loading...',
    match: (n) => `match${n !== 1 ? 'es' : ''}`,
    importable: [
      { state: 'let_it_slide', label: 'Whitelist', description: 'accounts you follow for content' },
      { state: 'check_later', label: 'Skip for now', description: 'accounts you were undecided on' },
      { state: 'not_a_fan', label: 'Dropping', description: 'accounts you planned to unfollow' },
    ],
    importBtn: (n) => `Import ${n > 0 ? `${n} account${n !== 1 ? 's' : ''}` : ''}`,
    startFresh: 'Start fresh',
    dismissAria: 'Dismiss',
  },
  filters: {
    all: 'All',
    untriaged: 'Untriaged',
    allInfo: 'Everyone in your non-followers list.',
    untriagedInfo: "Accounts you haven't reviewed yet.",
    accountsHaventReviewed: "Accounts you haven't reviewed yet.",
  },
  count: {
    accounts: (n) => `${n} accounts`,
    ofTotal: (shown, total) => `${shown} of ${total}`,
  },
  noResultsFor: (q) => `No results for "${q}"`,
  everyoneEarnedSpot: "Everyone here earned their spot. Radar's got nothing.",
  deactivatedSection: { label: 'Deactivated', description: 'Accounts that deactivated. Not a real unfollow.' },
  whitelistSection: { label: 'Whitelist', description: 'You follow them for the content, not the follow-back.' },
};

const ES: TriageListContent = {
  options: [
    {
      state: 'not_a_fan', label: 'Dejar de seguir',
      description: 'Planeas dejar de seguir esta cuenta. La marca para tu limpieza.',
      wittys: [
        'Ellos tomaron su decisión. Ahora toma la tuya.',
        'Ya era hora.',
        'Ya lo sabías.',
        'Sin rencores. Bueno, quizás algunos.',
        'La lista se acorta.',
        'Esta nunca fue una sorpresa.',
        'Limpiando la casa.',
        'No es personal. Bueno, en realidad sí.',
        'Listo cuando tú lo estés.',
        'Nunca estuvieron realmente ahí.',
        'Una distracción menos.',
        'Lo viste venir.',
      ],
    },
    {
      state: 'let_it_slide', label: 'Lista blanca',
      description: 'Quieres seguir siguiéndolos: los oculta de la lista de forma permanente.',
      wittys: [
        'Los sigues por el contenido. Justo.',
        'No te siguen de vuelta. No te importa. Perfecto.',
        'No todo tiene que ser mutuo.',
        'Decisión consciente. Respeto.',
        'Este se gana su lugar.',
        'Contenido antes que reciprocidad.',
        'Algunos seguimientos son de un solo sentido. Está bien.',
        'El buen contenido perdona mucho.',
        'Elegiste esto. A propósito.',
        'Conservando a este.',
        'Este se queda.',
        'No se requiere seguimiento mutuo.',
      ],
    },
    {
      state: 'done', label: 'Dejado de seguir',
      description: 'Ya los dejaste de seguir fuera de la app: lo marca para mantener tu conteo exacto.',
      wittys: [
        'Se fue. Siguiente.',
        'Hecho y terminado.',
        'Corte limpio.',
        '¿Ni siquiera lo notaron?',
        'Seguiste adelante.',
        'Ya resuelto.',
        'Uno menos.',
        '¿Ya te sientes más ligero?',
        'El algoritmo no los extrañará.',
        'Eso ya quedó atrás.',
        'No se demoró.',
        'Resuelto.',
      ],
    },
    {
      state: 'check_later', label: 'Dejar para después',
      description: 'Aún no estás seguro: vuelve a esta más tarde. No se marca nada.',
      wittys: [
        'Hoy no. Quizás nunca.',
        'Aún decidiendo. Justo.',
        'El jurado sigue deliberando.',
        'Vuelve cuando lo sepas.',
        'Aparcando esta.',
        'Algunas decisiones toman tiempo.',
        'Sin prisa.',
        'Una para más adelante.',
        'Complicado. Entendido.',
        'Aún no estás listo. Está bien.',
        'Lo revisaremos.',
        'Déjalo por ahora.',
      ],
    },
    {
      state: 'deactivated', label: 'Desactivada',
      description: 'Esta cuenta está desactivada o eliminada. No es un dejar de seguir real. La saca de la lista.',
      wittys: [
        'No fue su elección. Fue de Instagram.',
        'La cuenta desapareció, no la amistad.',
        'No se fueron. Simplemente… desaparecieron.',
        'Cuenta fantasma. Otro tipo de fantasma.',
        'No pueden dejar de seguirte si no existen.',
        'Daño colateral.',
        'Instagram tomó esta decisión por ellos.',
        'Cuenta cerrada. Caso cerrado.',
        'No es un desaire. Solo una baja.',
        'La plataforma les ganó primero.',
        'Una cuenta activa menos, una ruptura limpia menos.',
        'Se fueron. Probablemente temporal.',
      ],
    },
  ],
  toast: { addedTo: (u) => `@${u} añadido a`, whitelist: 'Lista blanca', undo: 'Deshacer' },
  clear: 'Borrar',
  openOnInstagram: (u) => `Abrir @${u} en Instagram`,
  visited: 'visto',
  progress: {
    triagedOf: (done, total) => `Clasificados ${done} de ${total}`,
    gettingStarted: 'Empezando.',
    gettingSomewhere: 'Ya vas avanzando.',
    halfwayThrough: 'Vas a la mitad. Radar se está calentando.',
    listCleared: 'Lista despejada. Un grupo sospechosamente leal.',
  },
  proTeaser: {
    pro: 'Pro',
    body: 'Sube una nueva exportación más tarde y Pro conserva esta clasificación, así nunca vuelves a clasificar las mismas cuentas.',
    upgradeToPro: 'Mejorar a Pro',
    dismissAria: 'Descartar',
  },
  importBanner: {
    carryOverQuestion: '¿Trasladar la clasificación de un snapshot anterior?',
    from: 'Desde:',
    loading: 'cargando...',
    match: (n) => `coincidencia${n !== 1 ? 's' : ''}`,
    importable: [
      { state: 'let_it_slide', label: 'Lista blanca', description: 'cuentas que sigues por el contenido' },
      { state: 'check_later', label: 'Dejar para después', description: 'cuentas que no habías decidido' },
      { state: 'not_a_fan', label: 'Dejar de seguir', description: 'cuentas que planeabas dejar de seguir' },
    ],
    importBtn: (n) => `Importar ${n > 0 ? `${n} cuenta${n !== 1 ? 's' : ''}` : ''}`,
    startFresh: 'Empezar de cero',
    dismissAria: 'Descartar',
  },
  filters: {
    all: 'Todos',
    untriaged: 'Sin clasificar',
    allInfo: 'Todos en tu lista de no seguidores.',
    untriagedInfo: 'Cuentas que aún no has revisado.',
    accountsHaventReviewed: 'Cuentas que aún no has revisado.',
  },
  count: {
    accounts: (n) => `${n} cuentas`,
    ofTotal: (shown, total) => `${shown} de ${total}`,
  },
  noResultsFor: (q) => `Sin resultados para "${q}"`,
  everyoneEarnedSpot: 'Todos aquí se ganaron su lugar. Radar no tiene nada.',
  deactivatedSection: { label: 'Desactivadas', description: 'Cuentas que se desactivaron. No es un dejar de seguir real.' },
  whitelistSection: { label: 'Lista blanca', description: 'Las sigues por el contenido, no por el seguimiento mutuo.' },
};

const PT: TriageListContent = {
  options: [
    {
      state: 'not_a_fan', label: 'Deixar de seguir',
      description: 'Você planeja deixar de seguir esta conta. Marca para sua limpeza.',
      wittys: [
        'Eles fizeram a escolha deles. Agora faça a sua.',
        'Já estava demorando.',
        'Você já sabia.',
        'Sem ressentimentos. Bem, talvez alguns.',
        'A lista fica menor.',
        'Esta nunca foi surpresa.',
        'Fazendo faxina.',
        'Não é pessoal. Na verdade, é.',
        'Pronto quando você estiver.',
        'Nunca estiveram realmente presentes.',
        'Uma distração a menos.',
        'Você já sabia que isso ia acontecer.',
      ],
    },
    {
      state: 'let_it_slide', label: 'Lista branca',
      description: 'Você quer continuar seguindo: oculta permanentemente da lista.',
      wittys: [
        'Você segue pelo conteúdo. Justo.',
        'Não te seguem de volta. Você não liga. Perfeito.',
        'Nem tudo precisa ser mútuo.',
        'Decisão consciente. Respeito.',
        'Esta conquistou seu lugar.',
        'Conteúdo acima de reciprocidade.',
        'Alguns seguimentos são de mão única. Tudo bem.',
        'Conteúdo de qualidade perdoa muita coisa.',
        'Você escolheu isso. De propósito.',
        'Mantendo esta por aqui.',
        'Esta fica.',
        'Não é preciso seguir de volta.',
      ],
    },
    {
      state: 'done', label: 'Deixou de seguir',
      description: 'Já deixou de seguir fora do app: marca para manter sua contagem precisa.',
      wittys: [
        'Foi-se. Próximo.',
        'Feito e encerrado.',
        'Corte limpo.',
        'Nem perceberam, né?',
        'Você seguiu em frente.',
        'Já resolvido.',
        'Um a menos.',
        'Já se sentindo mais leve?',
        'O algoritmo não vai sentir falta.',
        'Isso já ficou para trás.',
        'Não se demorou.',
        'Resolvido.',
      ],
    },
    {
      state: 'check_later', label: 'Deixar para depois',
      description: 'Ainda não tem certeza: volte a esta mais tarde. Nada é marcado.',
      wittys: [
        'Não hoje. Talvez nunca.',
        'Ainda decidindo. Justo.',
        'O júri ainda está deliberando.',
        'Volte quando souber.',
        'Deixando esta de lado.',
        'Algumas decisões levam tempo.',
        'Sem pressa.',
        'Uma para depois.',
        'Complicado. Entendi.',
        'Ainda não está pronto. Tudo bem.',
        'A gente revisita.',
        'Deixe por enquanto.',
      ],
    },
    {
      state: 'deactivated', label: 'Desativada',
      description: 'Esta conta está desativada ou excluída. Não é um deixar de seguir de verdade. Tira da lista.',
      wittys: [
        'Não foi escolha deles. Foi do Instagram.',
        'A conta sumiu, não a amizade.',
        'Eles não saíram. Só... desapareceram.',
        'Conta fantasma. Um tipo diferente de fantasma.',
        'Não podem deixar de te seguir se não existem.',
        'Dano colateral.',
        'O Instagram tomou essa decisão por eles.',
        'Conta encerrada. Caso encerrado.',
        'Não é desfeita. Só uma baixa.',
        'A plataforma chegou neles primeiro.',
        'Uma conta ativa a menos, uma ruptura limpa a menos.',
        'Sumiram. Provavelmente temporário.',
      ],
    },
  ],
  toast: { addedTo: (u) => `@${u} adicionado à`, whitelist: 'Lista branca', undo: 'Desfazer' },
  clear: 'Limpar',
  openOnInstagram: (u) => `Abrir @${u} no Instagram`,
  visited: 'visitado',
  progress: {
    triagedOf: (done, total) => `Triados ${done} de ${total}`,
    gettingStarted: 'Começando.',
    gettingSomewhere: 'Já está avançando.',
    halfwayThrough: 'Na metade do caminho. O Radar está esquentando.',
    listCleared: 'Lista limpa. Um grupo suspeitosamente leal.',
  },
  proTeaser: {
    pro: 'Pro',
    body: 'Envie uma nova exportação depois e o Pro mantém essa triagem, assim você nunca re-triagem as mesmas contas.',
    upgradeToPro: 'Assinar Pro',
    dismissAria: 'Dispensar',
  },
  importBanner: {
    carryOverQuestion: 'Trazer a triagem de um snapshot anterior?',
    from: 'De:',
    loading: 'carregando...',
    match: (n) => `correspondência${n !== 1 ? 's' : ''}`,
    importable: [
      { state: 'let_it_slide', label: 'Lista branca', description: 'contas que você segue pelo conteúdo' },
      { state: 'check_later', label: 'Deixar para depois', description: 'contas que você ainda não decidiu' },
      { state: 'not_a_fan', label: 'Deixar de seguir', description: 'contas que você planejava deixar de seguir' },
    ],
    importBtn: (n) => `Importar ${n > 0 ? `${n} conta${n !== 1 ? 's' : ''}` : ''}`,
    startFresh: 'Começar do zero',
    dismissAria: 'Dispensar',
  },
  filters: {
    all: 'Todas',
    untriaged: 'Não triadas',
    allInfo: 'Todas na sua lista de não seguidores.',
    untriagedInfo: 'Contas que você ainda não revisou.',
    accountsHaventReviewed: 'Contas que você ainda não revisou.',
  },
  count: {
    accounts: (n) => `${n} contas`,
    ofTotal: (shown, total) => `${shown} de ${total}`,
  },
  noResultsFor: (q) => `Nenhum resultado para "${q}"`,
  everyoneEarnedSpot: 'Todos aqui conquistaram seu lugar. O Radar não tem nada.',
  deactivatedSection: { label: 'Desativadas', description: 'Contas que se desativaram. Não é um deixar de seguir de verdade.' },
  whitelistSection: { label: 'Lista branca', description: 'Você as segue pelo conteúdo, não pelo seguir de volta.' },
};

export function getTriageListContent(locale: string): TriageListContent {
  if (locale === 'es') return ES;
  if (locale === 'pt') return PT;
  return EN;
}
