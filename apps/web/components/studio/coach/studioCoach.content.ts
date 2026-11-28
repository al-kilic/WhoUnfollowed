import type { AppLocale } from '@/i18n/routing';

// Copy for the coach pages in Studio (Today, Create, Plan, Posted, You).
// The tools themselves keep their copy in app/[locale]/coach/content.ts.

export interface StudioCoachContent {
  sub: { today: string; create: string; plan: string; posted: string; you: string };
  unlock: string;
  example: string;
  exampleNote: string;
  exampleDraft: { text: string; why: string };
  exampleCheck: { score: number; line: string; fix: string };
  examplePlan: string[];
  today: {
    shortcuts: string; create: string; plan: string; radar: string; noExport: string;
    readFrom: (date: string, app: string) => string; stop: string; tryNext: string; reading: string; setup: string; unlockRead: string;
    sinceLast: (n: string) => string; createSub: string; planSub: string; goal: string; goalSub: string; radarSub: string;
  };
  posted: { empty: string; checked: (date: string) => string; postedOn: (date: string) => string; notPosted: string; score: string; addResults: string; check: string };
  you: { memory: string; memoryBody: string; billing: string; account: string; signedOut: string;
    renews: (d: string) => string; manage: string; opening: string; billingError: string };
  ask: {
    title: string; body: string; points: string[];
    newChat: string; chats: string; threads: { t: string; d: string }[]; emptyTitle: string; emptySub: string;
    placeholder: string; send: string; note: string;
    sample: { q: string; a: string };
    freeLine: string; proLine: string; sampleTag: string; sampleNote: string; lockedPh: string; unlockAsk: string;
    deeper: string; deeperHint: string; deepTag: string; noChats: string; removeChat: string; included: string;
  };
  ideas: { sub: string; theme: string; themePh: string; submit: string; past: string; checkIt: string };
  phone: { posts: string; reels: string; follow: string; sendMessage: string; noPhoto: string; tapToAdd: string; addPhoto: string; removePhoto: string; photoNote: string; option: (n: number) => string; preview: string; account: string; addPhotos: string; count: (n: number, max: number) => string; moveLeft: string; moveRight: string; carouselNote: string };
  planCal: { newPlan: string; noPlan: string; emptyDay: string; emptyDaySub: string; getIdeas: string; writePost: string; hook: string; unplaced: string; principles: string };
  brief: {
    sub: string; general: string; empty: string; past: string; locked: string;
    weekOf: (d: string) => string; sample: string; sampleNote: string; editionLine: (n: number) => string; writeMove: string; why: string; less: string;
    cards: { lab: string; t: string; p: string; cap: string }[];
  };
  usage: { near: (d: string | null) => string; empty: (d: string | null) => string; refill: (price: string) => string; pace: string; gift: string; dismiss: string; insiderTitle: string; insiderBody: string; insiderCta: string };
}

const EN: StudioCoachContent = {
  sub: {
    today: 'Your coach’s read of your latest export, and what to do next.',
    create: 'Write a post in your own voice, or check one before it goes live.',
    plan: 'A 30-day post plan built around your audience.',
    posted: 'Your posts and how they did. Add results so your coach learns what works.',
    you: 'Your memory, monthly use and plan.',
  },
  unlock: 'Unlock to generate',
  example: 'Example',
  exampleNote: 'This is what you get. Yours is written for your account, in your voice.',
  exampleDraft: {
    text: 'Same bridge, 6 a.m. vs 6 p.m. Which one would you print?',
    why: 'A question in the first line gets replies, and your audience saves comparison posts.',
  },
  exampleCheck: { score: 72, line: 'Strong cover. The hook takes too long to get to the point.', fix: 'Start with the result, then the story.' },
  examplePlan: ['Week 1: two Reels about places your followers saved most', 'Week 2: one carousel, behind the shot', 'Week 3: a before and after edit'],
  today: {
    shortcuts: 'Next steps', create: 'Write a post', plan: 'Plan the month', radar: 'See your Radar', noExport: 'Upload an export so your coach can read it.',
    readFrom: (d, app) => `Your read · from your ${app} export of ${d}`, stop: 'Stop', tryNext: 'Try next', reading: 'Your coach is reading this export...',
    setup: 'Answer a few questions so your coach knows your account.', unlockRead: 'Unlock your read',
    sinceLast: (n) => `${n} since last export`, createSub: 'A hook, caption or Reel script in your voice', planSub: '30 days of posts around your audience',
    goal: 'Your goal', goalSub: 'Set a follower goal and track it per export', radarSub: 'Who follows you and what to fix',
  },
  posted: {
    empty: 'No posts yet. Check a post in Create, then mark it as posted here.',
    checked: (d) => `Checked ${d}`,
    postedOn: (d) => `Posted ${d}`,
    notPosted: 'Not posted yet',
    score: 'Score',
    addResults: 'Add results',
    check: 'Check a post',
  },
  you: {
    memory: 'Memory',
    memoryBody: 'What your coach knows about your account. Edit or delete it any time.',
    billing: 'Plan and billing',
    account: 'Account settings',
    signedOut: 'Sign in to see your memory, monthly use and plan.',
    renews: (d) => `Renews on ${d}. Cancel any time.`, manage: 'Manage billing', opening: 'Opening...', billingError: 'Could not open billing. Try again.',
  },
  ask: {
    title: 'Ask your coach',
    body: 'A chat with a coach that knows your account: your memory, your exports and the posts you checked.',
    points: ['Why did growth slow down this month?', 'What should I post this week?', 'Is it safe to unfollow 10 accounts a day?'],
    newChat: 'New chat', chats: 'Chats',
    threads: [{ t: 'Why did I lose followers?', d: 'Sample' }, { t: 'Best time to post', d: 'Sample' }, { t: 'Rewrite my bio', d: 'Sample' }],
    emptyTitle: 'What do you want to know?', emptySub: 'Your coach knows your memory, your plan and the numbers from your exports.',
    placeholder: 'Ask anything about your account', send: 'Send', note: "Uses your memory and the numbers from your exports. Never your followers' usernames.",
    freeLine: 'Asking your coach is part of Pro AI. Tap a question to see a sample answer.', proLine: 'Part of Pro AI, with generous monthly use. Ask for a deeper answer when you need more detail.', sampleTag: 'Sample answer', sampleNote: 'Sample answer, not about your account.', lockedPh: 'Unlock Pro AI to ask your own questions', unlockAsk: 'Unlock',
    deeper: 'Deeper answer', deeperHint: 'A fuller, more thorough answer from your coach', deepTag: 'Deeper answer', noChats: 'No chats yet. Ask your first question.', removeChat: 'Delete chat', included: 'Included',
    sample: { q: 'Is my follow-back rate good?', a: 'Your follow-back rate is 76%, higher than most accounts your size. The gap is posting: you post about 3 times a week, and accounts growing faster post 4.' },
  },
  ideas: { sub: 'Five post ideas at a time, built from your memory and your numbers.', theme: 'Anything in mind? (optional)', themePh: 'Rainy days, a new lens, a trip...', submit: 'Give me 5 ideas', past: 'Earlier ideas', checkIt: 'Write this one' },
  phone: { posts: 'Posts', reels: 'Reels', follow: 'Follow', sendMessage: 'Send message', noPhoto: 'Add a photo to see it here', tapToAdd: 'Tap to add your photos', addPhoto: 'Add a photo', removePhoto: 'Remove photo', photoNote: 'Only for this preview. The photo stays in your browser.', option: (n) => `Option ${n}`, preview: 'Preview', account: 'your.account', addPhotos: 'Add photos', count: (n, m) => `${n} of ${m}`, moveLeft: 'Move left', moveRight: 'Move right', carouselNote: 'Swipe the preview to see each slide.' },
  planCal: { newPlan: 'Make a new plan', noPlan: 'No plan yet. Make your first one below: 30 days of posts built around your audience.', emptyDay: 'Nothing planned this day', emptyDaySub: 'Rest days are fine. Or pick an idea and post anyway.', getIdeas: 'Get ideas', writePost: 'Write this post', hook: 'Hook', unplaced: 'Also in this plan', principles: 'What this plan follows' },
  brief: {
    sub: 'What changed on Instagram, Threads and TikTok this week, and what to do about it.', general: 'General', empty: 'No brief yet. New ones come out weekly.', past: 'Earlier briefs', locked: 'The edition for your niche comes with Pro AI. The general edition is free.',
    weekOf: (d) => `Week of ${d}`, sample: 'Sample', sampleNote: 'This is a sample of what a brief looks like. The first real one arrives with the next weekly issue.', editionLine: (n) => `General edition · ${n} ${n === 1 ? 'change' : 'changes'} · ${Math.max(1, Math.round(n * 0.7))} min`, writeMove: 'Write your move', why: 'Why it matters', less: 'Less',
    cards: [
      { lab: 'Instagram changed', t: 'Carousels get a second showing.', p: 'If someone skips your carousel, Instagram can show it to them again starting on slide two. Make slide two as strong as the cover.', cap: 'Shown again from slide 2' },
      { lab: 'Working for small accounts', t: 'Put the place in the first line.', p: 'Small accounts that lead with the place name are getting more saves than ones that end with it.', cap: 'More saves' },
      { lab: 'Your move', t: 'Turn one strong photo into a carousel.', p: 'You likely have alternates of your best shot. Lead with the classic frame and end on the one nobody expects.', cap: '3 frames you already have' },
    ],
  },
  usage: {
    near: (d) => (d ? `You've used most of this month's coach. It resets ${d}.` : "You've used most of this month's coach."),
    empty: (d) => (d ? `You've used this month's coach. It resets ${d}.` : "You've used this month's coach."),
    refill: (p) => `Or refill a full month for half price, ${p}.`,
    pace: "You've used a lot today. Your coach is back tomorrow.",
    gift: 'Your thank-you gift of coach use is in your account. It never expires.',
    dismiss: 'Got it',
    insiderTitle: 'Your Insider price',
    insiderBody: 'Your thank-you gift is used up. As an early Lifetime member, Pro AI monthly is 60% off, for life.',
    insiderCta: 'See Pro AI',
  },
};

const ES: StudioCoachContent = {
  sub: {
    today: 'Lo que tu coach ve en tu última exportación y qué hacer ahora.',
    create: 'Escribe una publicación con tu voz o revísala antes de publicarla.',
    plan: 'Un plan de publicaciones de 30 días pensado para tu audiencia.',
    posted: 'Tus publicaciones y cómo les fue. Añade resultados para que tu coach aprenda.',
    you: 'Tu memoria, tu uso mensual y tu plan.',
  },
  unlock: 'Desbloquear para generar',
  example: 'Ejemplo',
  exampleNote: 'Esto es lo que recibes. El tuyo se escribe para tu cuenta, con tu voz.',
  exampleDraft: {
    text: 'El mismo puente, 6 a. m. contra 6 p. m. ¿Cuál imprimirías?',
    why: 'Una pregunta en la primera línea genera respuestas, y tu audiencia guarda las comparaciones.',
  },
  exampleCheck: { score: 72, line: 'Buena portada. El gancho tarda demasiado en llegar al punto.', fix: 'Empieza por el resultado y luego la historia.' },
  examplePlan: ['Semana 1: dos Reels sobre los lugares que más guardaron tus seguidores', 'Semana 2: un carrusel, detrás de la foto', 'Semana 3: un antes y después de la edición'],
  today: {
    shortcuts: 'Siguientes pasos', create: 'Escribir una publicación', plan: 'Planificar el mes', radar: 'Ver tu Radar', noExport: 'Sube una exportación para que tu coach la lea.',
    readFrom: (d, app) => `Tu lectura · de tu exportación de ${app} del ${d}`, stop: 'Evita', tryNext: 'Prueba ahora', reading: 'Tu coach está leyendo esta exportación...',
    setup: 'Responde unas preguntas para que tu coach conozca tu cuenta.', unlockRead: 'Desbloquear tu lectura',
    sinceLast: (n) => `${n} desde la última exportación`, createSub: 'Un gancho, texto o guion de Reel con tu voz', planSub: '30 días de publicaciones pensadas para tu audiencia',
    goal: 'Tu objetivo', goalSub: 'Fija un objetivo de seguidores y síguelo en cada exportación', radarSub: 'Quién te sigue y qué arreglar',
  },
  posted: {
    empty: 'Aún no hay publicaciones. Revisa una en Crear y márcala aquí como publicada.',
    checked: (d) => `Revisada el ${d}`,
    postedOn: (d) => `Publicada el ${d}`,
    notPosted: 'Aún sin publicar',
    score: 'Puntuación',
    addResults: 'Añadir resultados',
    check: 'Revisar una publicación',
  },
  you: {
    memory: 'Memoria',
    memoryBody: 'Lo que tu coach sabe de tu cuenta. Edítalo o bórralo cuando quieras.',
    billing: 'Plan y facturación',
    account: 'Ajustes de la cuenta',
    signedOut: 'Inicia sesión para ver tu memoria, tu uso mensual y tu plan.',
    renews: (d) => `Se renueva el ${d}. Cancela cuando quieras.`, manage: 'Gestionar pagos', opening: 'Abriendo...', billingError: 'No se pudo abrir la facturación. Inténtalo de nuevo.',
  },
  ask: {
    title: 'Pregúntale a tu coach',
    body: 'Un chat con un coach que conoce tu cuenta: tu memoria, tus exportaciones y las publicaciones que revisaste.',
    points: ['¿Por qué se frenó el crecimiento este mes?', '¿Qué publico esta semana?', '¿Es seguro dejar de seguir 10 cuentas al día?'],
    newChat: 'Chat nuevo', chats: 'Chats',
    threads: [{ t: '¿Por qué perdí seguidores?', d: 'Ejemplo' }, { t: 'Mejor hora para publicar', d: 'Ejemplo' }, { t: 'Reescribir mi bio', d: 'Ejemplo' }],
    emptyTitle: '¿Qué quieres saber?', emptySub: 'Tu coach conoce tu memoria, tu plan y las cifras de tus exportaciones.',
    placeholder: 'Pregunta lo que quieras sobre tu cuenta', send: 'Enviar', note: 'Usa tu memoria y las cifras de tus exportaciones. Nunca los nombres de usuario de tus seguidores.',
    freeLine: 'Preguntarle a tu coach es parte de Pro AI. Toca una pregunta para ver una respuesta de ejemplo.', proLine: 'Parte de Pro AI, con uso mensual generoso. Pide una respuesta más profunda cuando necesites más detalle.', sampleTag: 'Respuesta de ejemplo', sampleNote: 'Respuesta de ejemplo, no habla de tu cuenta.', lockedPh: 'Desbloquea Pro AI para hacer tus propias preguntas', unlockAsk: 'Desbloquear',
    deeper: 'Respuesta más profunda', deeperHint: 'Una respuesta más completa y a fondo de tu coach', deepTag: 'Respuesta más profunda', noChats: 'Aún no hay chats. Haz tu primera pregunta.', removeChat: 'Borrar chat', included: 'Incluido',
    sample: { q: '¿Mi tasa de seguimiento mutuo es buena?', a: 'Tu tasa es del 76%, más alta que la de la mayoría de cuentas de tu tamaño. La diferencia está en publicar: publicas unas 3 veces por semana y las cuentas que crecen más rápido publican 4.' },
  },
  ideas: { sub: 'Cinco ideas de publicaciones cada vez, hechas con tu memoria y tus cifras.', theme: '¿Algo en mente? (opcional)', themePh: 'Días de lluvia, un objetivo nuevo, un viaje...', submit: 'Dame 5 ideas', past: 'Ideas anteriores', checkIt: 'Escribir esta' },
  phone: { posts: 'Publicaciones', reels: 'Reels', follow: 'Seguir', sendMessage: 'Enviar mensaje', noPhoto: 'Añade una foto para verla aquí', tapToAdd: 'Toca para añadir tus fotos', addPhoto: 'Añadir una foto', removePhoto: 'Quitar foto', photoNote: 'Solo para esta vista previa. La foto se queda en tu navegador.', option: (n) => `Opción ${n}`, preview: 'Vista previa', account: 'tu.cuenta', addPhotos: 'Añadir fotos', count: (n, m) => `${n} de ${m}`, moveLeft: 'Mover a la izquierda', moveRight: 'Mover a la derecha', carouselNote: 'Desliza la vista previa para ver cada imagen.' },
  planCal: { newPlan: 'Hacer un plan nuevo', noPlan: 'Aún no hay plan. Haz el primero abajo: 30 días de publicaciones pensadas para tu audiencia.', emptyDay: 'Nada planeado este día', emptyDaySub: 'Los días de descanso están bien. O elige una idea y publica igual.', getIdeas: 'Ver ideas', writePost: 'Escribir esta publicación', hook: 'Gancho', unplaced: 'También en este plan', principles: 'Lo que sigue este plan' },
  brief: {
    sub: 'Qué cambió esta semana en Instagram, Threads y TikTok, y qué hacer al respecto.', general: 'General', empty: 'Aún no hay resumen. Salen cada semana.', past: 'Resúmenes anteriores', locked: 'La edición de tu nicho llega con Pro AI. La edición general es gratis.',
    weekOf: (d) => `Semana del ${d}`, sample: 'Ejemplo', sampleNote: 'Así se ve un resumen. El primero de verdad llega con la próxima edición semanal.', editionLine: (n) => `Edición general · ${n} ${n === 1 ? 'cambio' : 'cambios'} · ${Math.max(1, Math.round(n * 0.7))} min`, writeMove: 'Escribir tu jugada', why: 'Por qué importa', less: 'Menos',
    cards: [
      { lab: 'Instagram cambió', t: 'Los carruseles tienen una segunda oportunidad.', p: 'Si alguien salta tu carrusel, Instagram puede mostrárselo de nuevo desde la segunda imagen. Haz la segunda tan fuerte como la portada.', cap: 'Se muestra otra vez desde la imagen 2' },
      { lab: 'Funciona en cuentas pequeñas', t: 'Pon el lugar en la primera línea.', p: 'Las cuentas pequeñas que empiezan con el nombre del lugar reciben más guardados que las que lo dejan al final.', cap: 'Más guardados' },
      { lab: 'Tu jugada', t: 'Convierte una buena foto en un carrusel.', p: 'Seguramente tienes alternativas de tu mejor foto. Empieza con la clásica y termina con la que nadie espera.', cap: '3 fotos que ya tienes' },
    ],
  },
  usage: {
    near: (d) => (d ? `Ya usaste casi todo el coach de este mes. Se renueva el ${d}.` : 'Ya usaste casi todo el coach de este mes.'),
    empty: (d) => (d ? `Ya usaste el coach de este mes. Se renueva el ${d}.` : 'Ya usaste el coach de este mes.'),
    refill: (p) => `O recarga un mes completo a mitad de precio, ${p}.`,
    pace: 'Hoy usaste mucho tu coach. Vuelve mañana.',
    gift: 'Tu regalo de agradecimiento con uso del coach ya está en tu cuenta. No vence nunca.',
    dismiss: 'Entendido',
    insiderTitle: 'Tu precio Insider',
    insiderBody: 'Ya usaste tu regalo de agradecimiento. Como miembro Lifetime de los primeros, Pro AI mensual tiene un 60% de descuento, de por vida.',
    insiderCta: 'Ver Pro AI',
  },
};

const PT: StudioCoachContent = {
  sub: {
    today: 'O que seu coach vê na sua última exportação e o que fazer agora.',
    create: 'Escreva um post com a sua voz ou revise antes de publicar.',
    plan: 'Um plano de posts de 30 dias pensado para o seu público.',
    posted: 'Seus posts e como foram. Adicione resultados para seu coach aprender.',
    you: 'Sua memória, seu uso mensal e seu plano.',
  },
  unlock: 'Desbloquear para gerar',
  example: 'Exemplo',
  exampleNote: 'É isto que você recebe. O seu é escrito para a sua conta, com a sua voz.',
  exampleDraft: {
    text: 'A mesma ponte, 6h da manhã vs 6h da tarde. Qual você imprimiria?',
    why: 'Uma pergunta na primeira linha gera respostas, e seu público salva comparações.',
  },
  exampleCheck: { score: 72, line: 'Capa forte. O gancho demora demais para chegar ao ponto.', fix: 'Comece pelo resultado, depois a história.' },
  examplePlan: ['Semana 1: dois Reels sobre os lugares que seus seguidores mais salvaram', 'Semana 2: um carrossel, os bastidores da foto', 'Semana 3: um antes e depois da edição'],
  today: {
    shortcuts: 'Próximos passos', create: 'Escrever um post', plan: 'Planejar o mês', radar: 'Ver seu Radar', noExport: 'Envie uma exportação para o seu coach ler.',
    readFrom: (d, app) => `Sua leitura · da exportação do ${app} de ${d}`, stop: 'Evite', tryNext: 'Tente agora', reading: 'Seu coach está lendo esta exportação...',
    setup: 'Responda algumas perguntas para o seu coach conhecer sua conta.', unlockRead: 'Desbloquear sua leitura',
    sinceLast: (n) => `${n} desde a última exportação`, createSub: 'Um gancho, legenda ou roteiro de Reel com a sua voz', planSub: '30 dias de posts pensados para o seu público',
    goal: 'Sua meta', goalSub: 'Defina uma meta de seguidores e acompanhe a cada exportação', radarSub: 'Quem segue você e o que ajustar',
  },
  posted: {
    empty: 'Nenhum post ainda. Revise um em Criar e marque aqui como postado.',
    checked: (d) => `Revisado em ${d}`,
    postedOn: (d) => `Postado em ${d}`,
    notPosted: 'Ainda não postado',
    score: 'Nota',
    addResults: 'Adicionar resultados',
    check: 'Revisar um post',
  },
  you: {
    memory: 'Memória',
    memoryBody: 'O que seu coach sabe sobre a sua conta. Edite ou apague quando quiser.',
    billing: 'Plano e cobrança',
    account: 'Configurações da conta',
    signedOut: 'Entre para ver sua memória, seu uso mensal e seu plano.',
    renews: (d) => `Renova em ${d}. Cancele quando quiser.`, manage: 'Gerenciar pagamento', opening: 'Abrindo...', billingError: 'Não foi possível abrir o pagamento. Tente de novo.',
  },
  ask: {
    title: 'Pergunte ao seu coach',
    body: 'Um chat com um coach que conhece sua conta: sua memória, suas exportações e os posts que você revisou.',
    points: ['Por que o crescimento desacelerou este mês?', 'O que devo postar esta semana?', 'É seguro deixar de seguir 10 contas por dia?'],
    newChat: 'Nova conversa', chats: 'Conversas',
    threads: [{ t: 'Por que perdi seguidores?', d: 'Exemplo' }, { t: 'Melhor horário para postar', d: 'Exemplo' }, { t: 'Reescrever minha bio', d: 'Exemplo' }],
    emptyTitle: 'O que você quer saber?', emptySub: 'Seu coach conhece sua memória, seu plano e os números das suas exportações.',
    placeholder: 'Pergunte qualquer coisa sobre sua conta', send: 'Enviar', note: 'Usa sua memória e os números das suas exportações. Nunca os nomes de usuário dos seus seguidores.',
    freeLine: 'Perguntar ao seu coach faz parte do Pro AI. Toque em uma pergunta para ver uma resposta de exemplo.', proLine: 'Parte do Pro AI, com uso mensal generoso. Peça uma resposta mais profunda quando precisar de mais detalhes.', sampleTag: 'Resposta de exemplo', sampleNote: 'Resposta de exemplo, não fala da sua conta.', lockedPh: 'Desbloqueie o Pro AI para fazer suas próprias perguntas', unlockAsk: 'Desbloquear',
    deeper: 'Resposta mais profunda', deeperHint: 'Uma resposta mais completa e a fundo do seu coach', deepTag: 'Resposta mais profunda', noChats: 'Ainda não há conversas. Faça sua primeira pergunta.', removeChat: 'Apagar conversa', included: 'Incluído',
    sample: { q: 'Minha taxa de retorno de follow é boa?', a: 'Sua taxa é de 76%, maior que a da maioria das contas do seu tamanho. A diferença está em postar: você posta umas 3 vezes por semana e contas que crescem mais rápido postam 4.' },
  },
  ideas: { sub: 'Cinco ideias de posts por vez, feitas com a sua memória e os seus números.', theme: 'Algo em mente? (opcional)', themePh: 'Dias de chuva, uma lente nova, uma viagem...', submit: 'Quero 5 ideias', past: 'Ideias anteriores', checkIt: 'Escrever esta' },
  phone: { posts: 'Publicações', reels: 'Reels', follow: 'Seguir', sendMessage: 'Enviar mensagem', noPhoto: 'Adicione uma foto para ver aqui', tapToAdd: 'Toque para adicionar suas fotos', addPhoto: 'Adicionar uma foto', removePhoto: 'Remover foto', photoNote: 'Só para esta prévia. A foto fica no seu navegador.', option: (n) => `Opção ${n}`, preview: 'Prévia', account: 'sua.conta', addPhotos: 'Adicionar fotos', count: (n, m) => `${n} de ${m}`, moveLeft: 'Mover para a esquerda', moveRight: 'Mover para a direita', carouselNote: 'Deslize a prévia para ver cada slide.' },
  planCal: { newPlan: 'Fazer um plano novo', noPlan: 'Ainda não há plano. Faça o primeiro abaixo: 30 dias de posts pensados para o seu público.', emptyDay: 'Nada planejado neste dia', emptyDaySub: 'Dias de descanso são normais. Ou escolha uma ideia e poste mesmo assim.', getIdeas: 'Ver ideias', writePost: 'Escrever este post', hook: 'Gancho', unplaced: 'Também neste plano', principles: 'O que este plano segue' },
  brief: {
    sub: 'O que mudou no Instagram, Threads e TikTok nesta semana, e o que fazer a respeito.', general: 'Geral', empty: 'Ainda não há resumo. Saem toda semana.', past: 'Resumos anteriores', locked: 'A edição do seu nicho vem com o Pro AI. A edição geral é grátis.',
    weekOf: (d) => `Semana de ${d}`, sample: 'Exemplo', sampleNote: 'É assim que um resumo aparece. O primeiro de verdade chega com a próxima edição semanal.', editionLine: (n) => `Edição geral · ${n} ${n === 1 ? 'mudança' : 'mudanças'} · ${Math.max(1, Math.round(n * 0.7))} min`, writeMove: 'Escrever sua jogada', why: 'Por que importa', less: 'Menos',
    cards: [
      { lab: 'O Instagram mudou', t: 'Carrosséis ganham uma segunda exibição.', p: 'Se alguém pular seu carrossel, o Instagram pode mostrá-lo de novo a partir do segundo slide. Faça o segundo slide tão forte quanto a capa.', cap: 'Mostrado de novo a partir do slide 2' },
      { lab: 'Funcionando para contas pequenas', t: 'Coloque o lugar na primeira linha.', p: 'Contas pequenas que começam com o nome do lugar estão recebendo mais salvamentos do que as que deixam para o fim.', cap: 'Mais salvamentos' },
      { lab: 'Sua jogada', t: 'Transforme uma boa foto em carrossel.', p: 'Você provavelmente tem alternativas da sua melhor foto. Comece com a clássica e termine com a que ninguém espera.', cap: '3 fotos que você já tem' },
    ],
  },
  usage: {
    near: (d) => (d ? `Você já usou quase todo o coach deste mês. Ele renova em ${d}.` : 'Você já usou quase todo o coach deste mês.'),
    empty: (d) => (d ? `Você já usou o coach deste mês. Ele renova em ${d}.` : 'Você já usou o coach deste mês.'),
    refill: (p) => `Ou recarregue um mês inteiro pela metade do preço, ${p}.`,
    pace: 'Você usou bastante o seu coach hoje. Ele volta amanhã.',
    gift: 'Seu presente de agradecimento com uso do coach já está na sua conta. Ele nunca expira.',
    dismiss: 'Entendi',
    insiderTitle: 'Seu preço Insider',
    insiderBody: 'Você já usou seu presente de agradecimento. Como membro Lifetime dos primeiros, o Pro AI mensal tem 60% de desconto, para sempre.',
    insiderCta: 'Ver o Pro AI',
  },
};

export function getStudioCoachContent(locale: AppLocale): StudioCoachContent {
  return locale === 'es' ? ES : locale === 'pt' ? PT : EN;
}
