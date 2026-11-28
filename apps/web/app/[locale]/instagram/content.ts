import type { AppLocale } from '@/i18n/routing';

// The Instagram pillar page: the full guide, not the tool itself. The
// homepage is the tool (upload); this page answers the questions around it
// (export steps, what each list means, limits), so the two don't compete for
// the same search.

export interface IgItem { t: string; b: string }

export interface InstagramPageContent {
  meta: { title: string; description: string };
  eyebrow: string;
  h1: string;
  h1Sub: string;
  intro: string;
  ctaUpload: string;
  ctaExport: string;
  chips: string[];
  diffLab: string;
  diffH: string;
  diff: [IgItem, IgItem];
  diffNote: string;
  stepsLab: string;
  stepsH: string;
  steps: IgItem[];
  stepsTip: string;
  stepsGuide: string;
  listsLab: string;
  listsH: string;
  lists: IgItem[];
  limitsLab: string;
  limitsH: string;
  limits: IgItem[];
  readLab: string;
  readH: string;
  readBody: string;
  readFiles: string[];
  readNever: string;
  faqLab: string;
  faqH: string;
  faq: { q: string; a: string }[];
  moreLab: string;
  moreH: string;
  morePlatforms: { threads: string; tiktok: string; compare: string; guide: string };
  finalH: string;
  finalSub: string;
}

const EN: InstagramPageContent = {
  meta: {
    title: 'Who Unfollowed Me on Instagram? The Full Guide',
    description: "How to see who unfollowed you and who doesn't follow you back on Instagram, from your official data export. Steps, what each list means, limits. No password.",
  },
  eyebrow: 'Instagram · the full guide',
  h1: 'Who unfollowed you on Instagram?',
  h1Sub: "And who doesn't follow you back, without giving anyone your password.",
  intro: "Instagram doesn't tell you when someone unfollows you. Its own data export does, if you know how to read it. This guide covers the export, what every list means and what an export can't show you.",
  ctaUpload: 'Upload your Instagram ZIP',
  ctaExport: 'Request your export on Meta',
  chips: ['No password', 'Read in your browser', 'Open source', 'Free'],
  diffLab: 'Two different questions',
  diffH: 'Unfollowers and non-followers are not the same list.',
  diff: [
    { t: "Who doesn't follow you back", b: 'Accounts you follow that are not in your followers. One export is enough, and it is free.' },
    { t: 'Who unfollowed you', b: 'People who followed you before and are gone now. That needs two exports from different dates, compared.' },
  ],
  diffNote: 'Most apps blur the two. A non-follower may never have followed you at all.',
  stepsLab: 'How to export',
  stepsH: 'Get your Instagram export in five steps.',
  steps: [
    { t: 'Open Accounts Center', b: 'Settings, then Accounts Center, Your information and permissions, Export your information, Create export.' },
    { t: 'Pick your Instagram profile', b: 'One profile per export. Threads needs its own.' },
    { t: 'Choose Followers and following', b: 'Only this category. It keeps the file small and quick.' },
    { t: 'JSON, All time, Export to device', b: 'JSON keeps follow dates. All time gets your full lists, not just recent changes.' },
    { t: 'Upload the ZIP as it is', b: 'Meta emails a link when it is ready. Download the ZIP and upload it without unzipping.' },
  ],
  stepsTip: 'The date range must be All time. A shorter range only holds recent changes, so most people would look like non-followers.',
  stepsGuide: 'Full export guide with screenshots',
  listsLab: 'What you see',
  listsH: 'Every list in your results, explained.',
  lists: [
    { t: "Don't follow you back", b: 'You follow them, they do not follow you. Sorted by when you followed them.' },
    { t: 'Fans', b: 'They follow you, you do not follow them back.' },
    { t: 'Mutuals', b: 'You follow each other.' },
    { t: 'Who left', b: 'Followers missing from your newer export. Shown once you have two.' },
    { t: 'Requests still waiting', b: 'Follow requests you sent to private accounts that were never accepted.' },
    { t: 'Recently unfollowed by you', b: 'Accounts you unfollowed yourself, in case you want any of them back.' },
  ],
  limitsLab: 'Limits worth knowing',
  limitsH: 'What an export can and cannot tell you.',
  limits: [
    { t: 'It is a snapshot', b: 'An export shows one moment. To see change, export again later and compare.' },
    { t: 'No live alerts', b: 'Nothing can warn you the minute someone leaves without your login. We never ask for it.' },
    { t: 'No ghost-follower data', b: 'The export has no likes or views per follower, so no tool can honestly list ghost followers from it.' },
    { t: 'Deactivated accounts', b: 'A deactivated account can look like an unfollow. It may come back.' },
    { t: 'The 7,500 cap', b: 'Instagram limits how many accounts you can follow. Results show how close you are.' },
  ],
  readLab: 'What we read',
  readH: 'A few files. Nothing else.',
  readBody: 'Your ZIP stays on your device. The parser only reads these files:',
  readFiles: [
    'connections/followers_and_following/followers_*.json',
    'connections/followers_and_following/following.json',
    'connections/followers_and_following/pending_follow_requests.json',
    'connections/followers_and_following/recently_unfollowed_profiles.json',
  ],
  readNever: 'Your messages, photos and personal details in the same ZIP are never read. The parser is open source (MPL-2.0), so you can check.',
  faqLab: 'Questions',
  faqH: 'Instagram unfollowers, answered.',
  faq: [
    { q: 'Does Instagram tell you who unfollowed you?', a: "No. Instagram doesn't notify you when someone unfollows you. Comparing two of your own data exports is the reliable way to know." },
    { q: "How do I see who doesn't follow me back on Instagram?", a: 'Request your export in Accounts Center (Followers and following, JSON, All time), then upload the ZIP. You get the list in seconds, free.' },
    { q: 'Is it safe? Do you need my Instagram password?', a: 'We never ask for your password. You upload the export Meta gives you, and it is read in your browser, not on our servers.' },
    { q: 'How long does the Instagram export take?', a: 'Usually minutes, sometimes a few hours or days for large accounts. Meta emails you when it is ready.' },
    { q: 'Why do people I know follow me show up as non-followers?', a: 'Usually the date range was not All time, so the export only held recent changes. Export again with All time.' },
    { q: 'Can I see who unfollowed me for free?', a: 'One export shows who does not follow you back, free and without an account. A free account keeps two exports and shows how many left; the names are in Pro AI.' },
    { q: 'Will Instagram ban me for this?', a: 'No. You use Instagram\'s own export tool and nothing logs in to your account, so there is nothing for Instagram to flag.' },
    { q: 'Does it work for Threads and TikTok too?', a: 'Yes. Threads uses the same Accounts Center export, and TikTok has its own download. Each platform is kept separate.' },
  ],
  moreLab: 'Keep reading',
  moreH: 'More guides',
  morePlatforms: { threads: 'Who unfollowed you on Threads', tiktok: 'Who unfollowed you on TikTok', compare: 'Compare unfollower apps', guide: 'The full export guide' },
  finalH: 'Find out who left. Nobody finds out you looked.',
  finalSub: 'Free, in your browser, no password.',
};

const ES: InstagramPageContent = {
  meta: {
    title: '¿Quién me dejó de seguir en Instagram? Guía completa',
    description: 'Cómo ver quién te dejó de seguir y quién no te sigue de vuelta en Instagram con tu export oficial de datos. Pasos, qué significa cada lista, límites. Sin contraseña.',
  },
  eyebrow: 'Instagram · la guía completa',
  h1: '¿Quién te dejó de seguir en Instagram?',
  h1Sub: 'Y quién no te sigue de vuelta, sin darle tu contraseña a nadie.',
  intro: 'Instagram no te avisa cuando alguien deja de seguirte. Su propio export de datos sí, si sabes leerlo. Esta guía cubre el export, qué significa cada lista y lo que un export no puede mostrar.',
  ctaUpload: 'Sube tu ZIP de Instagram',
  ctaExport: 'Pide tu export en Meta',
  chips: ['Sin contraseña', 'En tu navegador', 'Código abierto', 'Gratis'],
  diffLab: 'Dos preguntas distintas',
  diffH: 'Quien te dejó de seguir y quien no te sigue no son la misma lista.',
  diff: [
    { t: 'Quién no te sigue de vuelta', b: 'Cuentas que sigues y que no están entre tus seguidores. Basta un export y es gratis.' },
    { t: 'Quién te dejó de seguir', b: 'Personas que te seguían y ya no. Hacen falta dos exports de fechas distintas, comparados.' },
  ],
  diffNote: 'Muchas apps mezclan las dos. Alguien que no te sigue quizá nunca te siguió.',
  stepsLab: 'Cómo exportar',
  stepsH: 'Consigue tu export de Instagram en cinco pasos.',
  steps: [
    { t: 'Abre el Centro de cuentas', b: 'Configuración, Centro de cuentas, Tu información y permisos, Exportar tu información, Crear exportación.' },
    { t: 'Elige tu perfil de Instagram', b: 'Un perfil por export. Threads necesita el suyo.' },
    { t: 'Elige Seguidores y seguidos', b: 'Solo esta categoría. El archivo queda pequeño y rápido.' },
    { t: 'JSON, Todo el tiempo, Exportar al dispositivo', b: 'JSON conserva las fechas. Todo el tiempo trae tus listas completas, no solo los cambios recientes.' },
    { t: 'Sube el ZIP tal cual', b: 'Meta te envía un enlace cuando está listo. Descarga el ZIP y súbelo sin descomprimirlo.' },
  ],
  stepsTip: 'El rango de fechas debe ser Todo el tiempo. Con un rango corto solo están los cambios recientes y casi todos parecerían no seguidores.',
  stepsGuide: 'Guía completa con capturas',
  listsLab: 'Lo que ves',
  listsH: 'Cada lista de tus resultados, explicada.',
  lists: [
    { t: 'No te siguen de vuelta', b: 'Tú los sigues, ellos a ti no. Ordenados por cuándo los seguiste.' },
    { t: 'Fans', b: 'Te siguen y tú no los sigues.' },
    { t: 'Mutuos', b: 'Se siguen mutuamente.' },
    { t: 'Quién se fue', b: 'Seguidores que faltan en tu export más reciente. Aparece cuando tienes dos.' },
    { t: 'Solicitudes pendientes', b: 'Solicitudes que enviaste a cuentas privadas y nunca se aceptaron.' },
    { t: 'Dejaste de seguir hace poco', b: 'Cuentas que dejaste de seguir tú, por si quieres recuperar alguna.' },
  ],
  limitsLab: 'Límites que conviene saber',
  limitsH: 'Lo que un export puede y no puede decirte.',
  limits: [
    { t: 'Es una foto fija', b: 'Un export muestra un momento. Para ver cambios, exporta de nuevo más tarde y compara.' },
    { t: 'Sin alertas en vivo', b: 'Nada puede avisarte al minuto sin tu contraseña. Nunca te la pedimos.' },
    { t: 'Sin datos de seguidores fantasma', b: 'El export no trae likes ni vistas por seguidor, así que ninguna herramienta puede listar fantasmas con honestidad.' },
    { t: 'Cuentas desactivadas', b: 'Una cuenta desactivada puede parecer un unfollow. Puede volver.' },
    { t: 'El límite de 7.500', b: 'Instagram limita cuántas cuentas puedes seguir. Los resultados muestran cuánto te falta.' },
  ],
  readLab: 'Lo que leemos',
  readH: 'Unos pocos archivos. Nada más.',
  readBody: 'Tu ZIP se queda en tu dispositivo. El analizador solo lee estos archivos:',
  readFiles: EN.readFiles,
  readNever: 'Tus mensajes, fotos y datos personales del mismo ZIP nunca se leen. El analizador es de código abierto (MPL-2.0), así que puedes comprobarlo.',
  faqLab: 'Preguntas',
  faqH: 'Unfollows de Instagram, respondidos.',
  faq: [
    { q: '¿Instagram te dice quién te dejó de seguir?', a: 'No. Instagram no avisa cuando alguien deja de seguirte. Comparar dos de tus propios exports es la forma fiable de saberlo.' },
    { q: '¿Cómo veo quién no me sigue de vuelta en Instagram?', a: 'Pide tu export en el Centro de cuentas (Seguidores y seguidos, JSON, Todo el tiempo) y sube el ZIP. Tienes la lista en segundos, gratis.' },
    { q: '¿Es seguro? ¿Necesitan mi contraseña?', a: 'Nunca pedimos tu contraseña. Subes el export que te da Meta y se lee en tu navegador, no en nuestros servidores.' },
    { q: '¿Cuánto tarda el export de Instagram?', a: 'Normalmente minutos; a veces horas o días en cuentas grandes. Meta te avisa por correo cuando está listo.' },
    { q: '¿Por qué gente que me sigue aparece como que no?', a: 'Casi siempre el rango no era Todo el tiempo y el export solo traía cambios recientes. Exporta de nuevo con Todo el tiempo.' },
    { q: '¿Puedo ver gratis quién me dejó de seguir?', a: 'Un export muestra quién no te sigue de vuelta, gratis y sin cuenta. Una cuenta gratis guarda dos exports y muestra cuántos se fueron; los nombres están en Pro AI.' },
    { q: '¿Instagram me puede bloquear por esto?', a: 'No. Usas la herramienta de export de Instagram y nada inicia sesión en tu cuenta, así que no hay nada que marcar.' },
    { q: '¿Funciona también con Threads y TikTok?', a: 'Sí. Threads usa el mismo export del Centro de cuentas y TikTok tiene su propia descarga. Cada plataforma va por separado.' },
  ],
  moreLab: 'Sigue leyendo',
  moreH: 'Más guías',
  morePlatforms: { threads: 'Quién te dejó en Threads', tiktok: 'Quién te dejó en TikTok', compare: 'Comparar apps de unfollows', guide: 'La guía completa del export' },
  finalH: 'Descubre quién se fue. Nadie sabrá que miraste.',
  finalSub: 'Gratis, en tu navegador, sin contraseña.',
};

const PT: InstagramPageContent = {
  meta: {
    title: 'Quem Deixou de Me Seguir no Instagram? Guia Completo',
    description: 'Como ver quem deixou de te seguir e quem não te segue de volta no Instagram com seu export oficial de dados. Passos, o que cada lista significa, limites. Sem senha.',
  },
  eyebrow: 'Instagram · o guia completo',
  h1: 'Quem deixou de te seguir no Instagram?',
  h1Sub: 'E quem não te segue de volta, sem dar sua senha a ninguém.',
  intro: 'O Instagram não avisa quando alguém deixa de te seguir. O próprio export de dados avisa, se você souber ler. Este guia cobre o export, o que cada lista significa e o que um export não consegue mostrar.',
  ctaUpload: 'Envie seu ZIP do Instagram',
  ctaExport: 'Peça seu export na Meta',
  chips: ['Sem senha', 'No seu navegador', 'Código aberto', 'Grátis'],
  diffLab: 'Duas perguntas diferentes',
  diffH: 'Quem deixou de seguir e quem não segue de volta não são a mesma lista.',
  diff: [
    { t: 'Quem não te segue de volta', b: 'Contas que você segue e que não estão entre seus seguidores. Um export basta, e é grátis.' },
    { t: 'Quem deixou de te seguir', b: 'Pessoas que te seguiam e não seguem mais. Precisa de dois exports de datas diferentes, comparados.' },
  ],
  diffNote: 'Muitos apps misturam as duas. Quem não te segue talvez nunca tenha seguido.',
  stepsLab: 'Como exportar',
  stepsH: 'Pegue seu export do Instagram em cinco passos.',
  steps: [
    { t: 'Abra a Central de Contas', b: 'Configurações, Central de Contas, Suas informações e permissões, Exportar suas informações, Criar exportação.' },
    { t: 'Escolha seu perfil do Instagram', b: 'Um perfil por export. O Threads precisa do dele.' },
    { t: 'Escolha Seguidores e seguindo', b: 'Só esta categoria. O arquivo fica pequeno e rápido.' },
    { t: 'JSON, Todo o período, Exportar para o dispositivo', b: 'JSON mantém as datas. Todo o período traz suas listas completas, não só as mudanças recentes.' },
    { t: 'Envie o ZIP como veio', b: 'A Meta manda um link por e-mail quando fica pronto. Baixe o ZIP e envie sem descompactar.' },
  ],
  stepsTip: 'O período precisa ser Todo o período. Com um período curto só vêm mudanças recentes, e quase todo mundo pareceria não seguidor.',
  stepsGuide: 'Guia completo com capturas de tela',
  listsLab: 'O que você vê',
  listsH: 'Cada lista dos seus resultados, explicada.',
  lists: [
    { t: 'Não te seguem de volta', b: 'Você segue, eles não te seguem. Ordenados por quando você seguiu.' },
    { t: 'Fãs', b: 'Eles te seguem e você não segue de volta.' },
    { t: 'Mútuos', b: 'Vocês se seguem.' },
    { t: 'Quem saiu', b: 'Seguidores que faltam no seu export mais novo. Aparece quando você tem dois.' },
    { t: 'Solicitações pendentes', b: 'Pedidos que você enviou a contas privadas e nunca foram aceitos.' },
    { t: 'Você deixou de seguir há pouco', b: 'Contas que você mesmo deixou de seguir, caso queira alguma de volta.' },
  ],
  limitsLab: 'Limites que vale saber',
  limitsH: 'O que um export pode e não pode te contar.',
  limits: [
    { t: 'É uma foto do momento', b: 'Um export mostra um momento. Para ver mudanças, exporte de novo depois e compare.' },
    { t: 'Sem alertas ao vivo', b: 'Nada pode te avisar na hora sem sua senha. Nunca pedimos ela.' },
    { t: 'Sem dados de seguidores fantasmas', b: 'O export não traz curtidas nem visualizações por seguidor, então nenhuma ferramenta pode listar fantasmas com honestidade.' },
    { t: 'Contas desativadas', b: 'Uma conta desativada pode parecer um unfollow. Ela pode voltar.' },
    { t: 'O limite de 7.500', b: 'O Instagram limita quantas contas você pode seguir. Os resultados mostram quanto falta.' },
  ],
  readLab: 'O que lemos',
  readH: 'Poucos arquivos. Nada mais.',
  readBody: 'Seu ZIP fica no seu dispositivo. O analisador só lê estes arquivos:',
  readFiles: EN.readFiles,
  readNever: 'Suas mensagens, fotos e dados pessoais do mesmo ZIP nunca são lidos. O analisador é de código aberto (MPL-2.0), então você pode conferir.',
  faqLab: 'Perguntas',
  faqH: 'Unfollows do Instagram, respondidos.',
  faq: [
    { q: 'O Instagram avisa quem deixou de te seguir?', a: 'Não. O Instagram não avisa quando alguém deixa de te seguir. Comparar dois exports seus é o jeito confiável de saber.' },
    { q: 'Como vejo quem não me segue de volta no Instagram?', a: 'Peça seu export na Central de Contas (Seguidores e seguindo, JSON, Todo o período) e envie o ZIP. A lista sai em segundos, grátis.' },
    { q: 'É seguro? Vocês precisam da minha senha?', a: 'Nunca pedimos sua senha. Você envia o export que a Meta te dá, e ele é lido no seu navegador, não nos nossos servidores.' },
    { q: 'Quanto tempo demora o export do Instagram?', a: 'Normalmente minutos; às vezes horas ou dias em contas grandes. A Meta avisa por e-mail quando fica pronto.' },
    { q: 'Por que gente que me segue aparece como não seguidor?', a: 'Quase sempre o período não era Todo o período, e o export só trazia mudanças recentes. Exporte de novo com Todo o período.' },
    { q: 'Posso ver grátis quem deixou de me seguir?', a: 'Um export mostra quem não te segue de volta, grátis e sem conta. Uma conta grátis guarda dois exports e mostra quantos saíram; os nomes ficam no Pro AI.' },
    { q: 'O Instagram pode me banir por isso?', a: 'Não. Você usa a ferramenta de export do próprio Instagram e nada entra na sua conta, então não há o que sinalizar.' },
    { q: 'Funciona com Threads e TikTok também?', a: 'Sim. O Threads usa o mesmo export da Central de Contas e o TikTok tem o próprio download. Cada plataforma fica separada.' },
  ],
  moreLab: 'Continue lendo',
  moreH: 'Mais guias',
  morePlatforms: { threads: 'Quem deixou de seguir no Threads', tiktok: 'Quem deixou de seguir no TikTok', compare: 'Comparar apps de unfollow', guide: 'O guia completo do export' },
  finalH: 'Descubra quem saiu. Ninguém vai saber que você olhou.',
  finalSub: 'Grátis, no seu navegador, sem senha.',
};

const CONTENT: Record<AppLocale, InstagramPageContent> = { en: EN, es: ES, pt: PT };

export function getInstagramPageContent(locale: AppLocale): InstagramPageContent {
  return CONTENT[locale] ?? EN;
}
