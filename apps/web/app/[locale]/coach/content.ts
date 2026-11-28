import type { AppLocale } from '@/i18n/routing';

export interface CoachContent {
  metaTitle: string;
  eyebrow: string;
  title: string;
  memoryLink: string;
  free: string;
  tabs: { read: string; draft: string; check: string; plan: string };
  addedToMemory: string;
  errors: { busy: string; paused: string; failed: string; invalid: string; needs_onboarding: string; needs_export: string; allowance_empty: string; pace_limit: string; invalid_image: string; attach_limit: string };
  working: string;
  activating: string;
  copy: string;
  copied: string;
  onboarding: {
    title: string; intro: string;
    accountType: string; types: { personal: string; creator: string; business: string };
    niche: string; nichePh: string; goal: string; goalPh: string; whatYouPost: string; whatYouPostPh: string;
    voice: string; voiceHelp: string; voicePh: string; addSample: string;
    privacy: string; submit: string; fullExport: string;
  };
  read: { empty: string; happening: string; stop: string; try: string; from: (platform: string, date: string) => string };
  draft: { kind: string; kinds: { hook: string; caption: string; script: string }; format: string; topic: string; topicPh: string; submit: string };
  formats: { reel: string; carousel: string; photo: string; story: string };
  check: {
    hook: string; hookPh: string; caption: string; captionPh: string; cover: string; coverHelp: string; removeCover: string; submit: string;
    overall: string; fixes: string; altHooks: string; newCaption: string; coverNotes: string;
    criteria: { hook: string; clarity: string; value: string; fit_you: string; fit_trend: string; action: string };
    posted: string; postedDone: string; resultsTitle: string; likes: string; saves: string; newFollowers: string; saveResults: string;
  };
  plan: { focus: string; focusPh: string; perWeek: string; submit: string; principles: string; week: (n: number) => string };
  memory: {
    title: string; intro: string; save: string; saved: string; conflict: string; tooLong: string;
    wipe: string; wipeConfirm: string; wipeYes: string; wipeNo: string; wiped: string; back: string; chars: (n: number, max: number) => string;
  };
}

const EN: CoachContent = {
  metaTitle: 'Your coach',
  eyebrow: 'PRO AI',
  title: 'Your coach',
  memoryLink: 'Memory',
  free: 'Included',
  tabs: { read: 'Your read', draft: 'Write', check: 'Check a post', plan: '30-day plan' },
  addedToMemory: 'Added to memory',
  errors: {
    busy: 'Too many requests at once. Wait a minute and try again.',
    paused: 'The coach is taking a break for today. Try again tomorrow.',
    allowance_empty: 'You\'ve used this month\'s coach. It resets with your plan.',
    pace_limit: 'You\'ve used a lot today. Your coach is back tomorrow.',
    invalid_image: 'One of the photos could not be read. Use a JPEG, PNG or WebP photo and try again.',
    attach_limit: 'That is a lot of questions with attachments in a short time. Wait a few minutes and try again.',
    failed: 'That did not work. Try again.',
    invalid: 'Something in the form is missing or too long.',
    needs_onboarding: 'Answer a few questions first so the coach knows your account.',
    needs_export: 'Upload an export first: the plan is built on your real numbers.',
  },
  working: 'Working on it...',
  activating: 'Activating your Pro AI. This takes a few seconds...',
  copy: 'Copy',
  copied: 'Copied',
  onboarding: {
    title: 'Tell your coach about your account',
    intro: 'Two minutes. This starts your memory: everything the coach writes builds on it, and you can edit it any time.',
    accountType: 'What is this account for?',
    types: { personal: 'Personal', creator: 'Creator', business: 'Business' },
    niche: 'Your niche', nichePh: 'Street photography, fitness, a local bakery...',
    goal: 'Your goal', goalPh: '10k followers by June, my first brand deal...',
    whatYouPost: 'What you post', whatYouPostPh: 'Night walks in Istanbul, mostly carousels...',
    voice: 'Your voice (optional)', voiceHelp: 'Paste up to 5 of your own captions so drafts sound like you.', voicePh: 'One caption', addSample: 'Add another',
    privacy: 'Saved to your account so the coach remembers. Never your followers or their usernames. Delete it any time in Memory.',
    fullExport: 'Tip: also request your full Instagram export (All information, JSON, media quality Low). It lets Photo insights read your own posts and photos, in your browser.',
    submit: 'Start my coach',
  },
  read: {
    empty: 'Upload an export on the home page. Your coach reads every new one for free.',
    happening: 'What is happening', stop: 'Stop', try: 'Try next',
    from: (platform, date) => `From your ${platform} export, ${date}`,
  },
  draft: { kind: 'What to write', kinds: { hook: 'Hook', caption: 'Caption', script: 'Reel script' }, format: 'Format', topic: 'What the post is about', topicPh: 'A night walk through Balat after the rain', submit: 'Write it' },
  formats: { reel: 'Reel', carousel: 'Carousel', photo: 'Photo', story: 'Story' },
  check: {
    hook: 'Hook or first line', hookPh: 'The first thing people see', caption: 'Caption', captionPh: 'Paste the full caption',
    cover: 'Cover image (optional)', coverHelp: 'Resized on your device and used once. Never stored.', removeCover: 'Remove', submit: 'Check it',
    overall: 'Overall', fixes: 'Fix these first', altHooks: 'Stronger hooks', newCaption: 'Tighter caption', coverNotes: 'Cover',
    criteria: { hook: 'Stops the scroll', clarity: 'One clear idea', value: 'Worth it', fit_you: 'Fits what works for you', fit_trend: 'Fits right now', action: 'Gets saves and follows' },
    posted: 'I posted it', postedDone: 'Marked as posted', resultsTitle: 'How did it do? (optional)', likes: 'Likes', saves: 'Saves', newFollowers: 'New followers', saveResults: 'Save results',
  },
  plan: { focus: 'Anything to focus on? (optional)', focusPh: 'More Reels, a new series, a launch...', perWeek: 'Posts a week', submit: 'Write my plan', principles: 'Principles', week: (n) => `Week ${n}` },
  memory: {
    title: 'Memory',
    intro: 'Everything your coach knows about your account. Your lines always win over the coach\'s notes. Never your followers or their usernames.',
    save: 'Save', saved: 'Saved', conflict: 'Your coach added a note while you were editing. Reload to see it, then edit again.', tooLong: 'Memory is too long. Remove a few lines.',
    wipe: 'Delete my memory', wipeConfirm: 'Delete your memory, numbers and coach history? Your plan stays.', wipeYes: 'Delete', wipeNo: 'Keep it', wiped: 'Deleted. Answer the questions again to start fresh.',
    back: 'Back to your coach', chars: (n, max) => `${n} / ${max} characters`,
  },
};

const ES: CoachContent = {
  ...EN,
  metaTitle: 'Tu coach',
  title: 'Tu coach',
  memoryLink: 'Memoria',
  free: 'Incluido',
  tabs: { read: 'Tu lectura', draft: 'Escribir', check: 'Revisar un post', plan: 'Plan de 30 días' },
  addedToMemory: 'Añadido a la memoria',
  errors: {
    busy: 'Demasiadas peticiones a la vez. Espera un minuto y vuelve a intentarlo.',
    paused: 'El coach se toma un descanso por hoy. Inténtalo mañana.',
    allowance_empty: 'Ya usaste el coach de este mes. Se renueva con tu plan.',
    pace_limit: 'Hoy usaste mucho tu coach. Vuelve mañana.',
    invalid_image: 'No pudimos leer una de las fotos. Usa una foto JPEG, PNG o WebP e inténtalo de nuevo.',
    attach_limit: 'Son muchas preguntas con adjuntos en poco tiempo. Espera unos minutos e inténtalo de nuevo.',
    failed: 'No funcionó. Inténtalo de nuevo.',
    invalid: 'Falta algo en el formulario o es demasiado largo.',
    needs_onboarding: 'Responde primero unas preguntas para que el coach conozca tu cuenta.',
    needs_export: 'Sube primero una exportación: el plan se basa en tus cifras reales.',
  },
  working: 'Trabajando...',
  activating: 'Activando tu Pro AI. Tarda unos segundos...',
  copy: 'Copiar',
  copied: 'Copiado',
  onboarding: {
    title: 'Cuéntale a tu coach sobre tu cuenta',
    intro: 'Dos minutos. Esto inicia tu memoria: todo lo que escribe el coach parte de aquí, y puedes editarla cuando quieras.',
    accountType: '¿Para qué es esta cuenta?',
    types: { personal: 'Personal', creator: 'Creador', business: 'Negocio' },
    niche: 'Tu nicho', nichePh: 'Fotografía callejera, fitness, una panadería local...',
    goal: 'Tu objetivo', goalPh: '10k seguidores en junio, mi primer acuerdo con una marca...',
    whatYouPost: 'Qué publicas', whatYouPostPh: 'Paseos nocturnos por la ciudad, sobre todo carruseles...',
    voice: 'Tu voz (opcional)', voiceHelp: 'Pega hasta 5 de tus textos para que los borradores suenen como tú.', voicePh: 'Un texto', addSample: 'Añadir otro',
    privacy: 'Se guarda en tu cuenta para que el coach recuerde. Nunca tus seguidores ni sus nombres de usuario. Bórrala cuando quieras en Memoria.',
    fullExport: 'Consejo: pide también tu exportación completa de Instagram (Toda la información, JSON, calidad de medios Baja). Permite que el análisis de fotos lea tus publicaciones y fotos, en tu navegador.',
    submit: 'Empezar con mi coach',
  },
  read: {
    empty: 'Sube una exportación en la página de inicio. Tu coach lee cada una nueva gratis.',
    happening: 'Qué está pasando', stop: 'Deja de hacer', try: 'Prueba ahora',
    from: (platform, date) => `De tu exportación de ${platform}, ${date}`,
  },
  draft: { kind: 'Qué escribir', kinds: { hook: 'Gancho', caption: 'Texto', script: 'Guion de Reel' }, format: 'Formato', topic: 'De qué trata el post', topicPh: 'Un paseo nocturno por el centro después de la lluvia', submit: 'Escríbelo' },
  formats: { reel: 'Reel', carousel: 'Carrusel', photo: 'Foto', story: 'Historia' },
  check: {
    hook: 'Gancho o primera línea', hookPh: 'Lo primero que ve la gente', caption: 'Texto', captionPh: 'Pega el texto completo',
    cover: 'Portada (opcional)', coverHelp: 'Se reduce en tu dispositivo y se usa una vez. Nunca se guarda.', removeCover: 'Quitar', submit: 'Revisarlo',
    overall: 'Total', fixes: 'Arregla esto primero', altHooks: 'Ganchos más fuertes', newCaption: 'Texto más directo', coverNotes: 'Portada',
    criteria: { hook: 'Frena el scroll', clarity: 'Una idea clara', value: 'Vale la pena', fit_you: 'Encaja con lo que te funciona', fit_trend: 'Encaja con el momento', action: 'Consigue guardados y seguidores' },
    posted: 'Ya lo publiqué', postedDone: 'Marcado como publicado', resultsTitle: '¿Cómo le fue? (opcional)', likes: 'Me gusta', saves: 'Guardados', newFollowers: 'Nuevos seguidores', saveResults: 'Guardar resultados',
  },
  plan: { focus: '¿En qué enfocarse? (opcional)', focusPh: 'Más Reels, una serie nueva, un lanzamiento...', perWeek: 'Posts por semana', submit: 'Escribir mi plan', principles: 'Principios', week: (n) => `Semana ${n}` },
  memory: {
    title: 'Memoria',
    intro: 'Todo lo que tu coach sabe de tu cuenta. Tus líneas siempre ganan a las notas del coach. Nunca tus seguidores ni sus nombres de usuario.',
    save: 'Guardar', saved: 'Guardado', conflict: 'Tu coach añadió una nota mientras editabas. Recarga para verla y vuelve a editar.', tooLong: 'La memoria es demasiado larga. Quita algunas líneas.',
    wipe: 'Borrar mi memoria', wipeConfirm: '¿Borrar tu memoria, tus números y el historial del coach? Tu plan se mantiene.', wipeYes: 'Borrar', wipeNo: 'Mantener', wiped: 'Borrado. Responde de nuevo las preguntas para empezar de cero.',
    back: 'Volver a tu coach', chars: (n, max) => `${n} / ${max} caracteres`,
  },
};

const PT: CoachContent = {
  ...EN,
  metaTitle: 'Seu coach',
  title: 'Seu coach',
  memoryLink: 'Memória',
  free: 'Incluído',
  tabs: { read: 'Sua leitura', draft: 'Escrever', check: 'Checar um post', plan: 'Plano de 30 dias' },
  addedToMemory: 'Adicionado à memória',
  errors: {
    busy: 'Muitos pedidos ao mesmo tempo. Espere um minuto e tente de novo.',
    paused: 'O coach está fazendo uma pausa hoje. Tente amanhã.',
    allowance_empty: 'Você já usou o coach deste mês. Ele renova com o seu plano.',
    pace_limit: 'Você usou bastante o seu coach hoje. Ele volta amanhã.',
    invalid_image: 'Não conseguimos ler uma das fotos. Use uma foto JPEG, PNG ou WebP e tente de novo.',
    attach_limit: 'São muitas perguntas com anexos em pouco tempo. Espere alguns minutos e tente de novo.',
    failed: 'Não funcionou. Tente de novo.',
    invalid: 'Falta algo no formulário ou está longo demais.',
    needs_onboarding: 'Responda algumas perguntas primeiro para o coach conhecer sua conta.',
    needs_export: 'Envie uma exportação primeiro: o plano usa seus números reais.',
  },
  working: 'Trabalhando...',
  activating: 'Ativando seu Pro AI. Leva alguns segundos...',
  copy: 'Copiar',
  copied: 'Copiado',
  onboarding: {
    title: 'Conte ao seu coach sobre sua conta',
    intro: 'Dois minutos. Isso começa a sua memória: tudo o que o coach escreve parte daqui, e você pode editar quando quiser.',
    accountType: 'Para que é esta conta?',
    types: { personal: 'Pessoal', creator: 'Criador', business: 'Negócio' },
    niche: 'Seu nicho', nichePh: 'Fotografia de rua, fitness, uma padaria local...',
    goal: 'Seu objetivo', goalPh: '10 mil seguidores até junho, minha primeira parceria com marca...',
    whatYouPost: 'O que você posta', whatYouPostPh: 'Passeios noturnos pela cidade, principalmente carrosséis...',
    voice: 'Sua voz (opcional)', voiceHelp: 'Cole até 5 legendas suas para os rascunhos soarem como você.', voicePh: 'Uma legenda', addSample: 'Adicionar outra',
    privacy: 'Salvo na sua conta para o coach lembrar. Nunca seus seguidores nem os nomes de usuário deles. Apague quando quiser em Memória.',
    fullExport: 'Dica: peça também sua exportação completa do Instagram (Todas as informações, JSON, qualidade de mídia Baixa). Ela permite que a análise de fotos leia seus posts e fotos, no seu navegador.',
    submit: 'Começar com meu coach',
  },
  read: {
    empty: 'Envie uma exportação na página inicial. Seu coach lê cada nova de graça.',
    happening: 'O que está acontecendo', stop: 'Pare', try: 'Tente agora',
    from: (platform, date) => `Da sua exportação do ${platform}, ${date}`,
  },
  draft: { kind: 'O que escrever', kinds: { hook: 'Gancho', caption: 'Legenda', script: 'Roteiro de Reel' }, format: 'Formato', topic: 'Sobre o que é o post', topicPh: 'Uma caminhada noturna pelo centro depois da chuva', submit: 'Escrever' },
  formats: { reel: 'Reel', carousel: 'Carrossel', photo: 'Foto', story: 'Story' },
  check: {
    hook: 'Gancho ou primeira linha', hookPh: 'A primeira coisa que as pessoas veem', caption: 'Legenda', captionPh: 'Cole a legenda completa',
    cover: 'Capa (opcional)', coverHelp: 'Reduzida no seu aparelho e usada uma vez. Nunca é guardada.', removeCover: 'Remover', submit: 'Checar',
    overall: 'Geral', fixes: 'Corrija isto primeiro', altHooks: 'Ganchos mais fortes', newCaption: 'Legenda mais direta', coverNotes: 'Capa',
    criteria: { hook: 'Para o scroll', clarity: 'Uma ideia clara', value: 'Vale a pena', fit_you: 'Combina com o que funciona para você', fit_trend: 'Combina com o momento', action: 'Gera salvamentos e seguidores' },
    posted: 'Já postei', postedDone: 'Marcado como postado', resultsTitle: 'Como foi? (opcional)', likes: 'Curtidas', saves: 'Salvamentos', newFollowers: 'Novos seguidores', saveResults: 'Salvar resultados',
  },
  plan: { focus: 'Algum foco? (opcional)', focusPh: 'Mais Reels, uma série nova, um lançamento...', perWeek: 'Posts por semana', submit: 'Escrever meu plano', principles: 'Princípios', week: (n) => `Semana ${n}` },
  memory: {
    title: 'Memória',
    intro: 'Tudo o que seu coach sabe sobre sua conta. Suas linhas sempre valem mais que as notas do coach. Nunca seus seguidores nem os nomes de usuário deles.',
    save: 'Salvar', saved: 'Salvo', conflict: 'Seu coach adicionou uma nota enquanto você editava. Recarregue para ver e edite de novo.', tooLong: 'A memória está longa demais. Remova algumas linhas.',
    wipe: 'Apagar minha memória', wipeConfirm: 'Apagar sua memória, seus números e o histórico do coach? Seu plano continua.', wipeYes: 'Apagar', wipeNo: 'Manter', wiped: 'Apagado. Responda as perguntas de novo para começar do zero.',
    back: 'Voltar ao seu coach', chars: (n, max) => `${n} / ${max} caracteres`,
  },
};

export function getCoachContent(locale: AppLocale): CoachContent {
  return locale === 'es' ? ES : locale === 'pt' ? PT : EN;
}
