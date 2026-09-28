import type { AppLocale } from '@/i18n/routing';

export interface ThreadsFaqItem { q: string; a: string }
export interface ThreadsStep { title: string; body: string }

export interface ThreadsPageContent {
  eyebrow: string;
  headline: string;
  headlineItalic: string;
  intro: string;
  uploadCta: string;
  stats: { value: string; label: string }[];
  whatEyebrow: string;
  whatHeadline: string;
  whatItems: { title: string; body: string }[];
  stepsEyebrow: string;
  stepsHeadline: string;
  steps: ThreadsStep[];
  sizeTip: string;
  fullGuideLink: string;
  readEyebrow: string;
  readHeadline: string;
  readBody: string;
  readFiles: string[];
  readNever: string;
  faqEyebrow: string;
  faqHeadline: string;
  faq: ThreadsFaqItem[];
  ctaHeadline: string;
  ctaSubline: string;
  ctaButton: string;
  instagramLink: string;
}

const EN: ThreadsPageContent = {
  eyebrow: 'THREADS UNFOLLOWERS',
  headline: 'Who unfollowed you on Threads?',
  headlineItalic: 'Find out without your password.',
  intro:
    "WhoUnfollowed reads the official Threads data export that Meta gives you and shows who doesn't follow you back on Threads. Save snapshots over time to see exactly who unfollowed you. It runs entirely in your browser, needs no login, and the code is open source.",
  uploadCta: 'Upload your Threads ZIP',
  stats: [
    { value: '0', label: 'passwords asked' },
    { value: '100%', label: 'in your browser' },
    { value: 'Free', label: 'no account needed' },
  ],
  whatEyebrow: 'WHAT YOU GET',
  whatHeadline: 'The same tool, for your Threads account.',
  whatItems: [
    { title: "Who doesn't follow you back", body: 'Every Threads account you follow that does not follow you, with the date you followed them.' },
    { title: 'Fans and mutuals', body: "People who follow you that you don't follow back, and everyone you follow each other with." },
    { title: 'Who unfollowed you', body: 'Upload a newer export later and compare snapshots to see exactly who left. Pro keeps unlimited history.' },
    { title: 'Kept apart from Instagram', body: 'Threads and Instagram snapshots never mix. Radar, history, and comparisons stay per app.' },
  ],
  stepsEyebrow: 'HOW TO EXPORT',
  stepsHeadline: 'Get your Threads export in a few minutes.',
  steps: [
    { title: 'Open Accounts Center', body: 'Accounts Center → Your information and permissions → Export your information → Create export. You can get there from Threads or Instagram settings.' },
    { title: 'Pick your Threads profile', body: 'Select only your Threads profile. One profile per export: Instagram needs its own.' },
    { title: 'Choose Followers and Following', body: 'Pick only this category, not all of your information.' },
    { title: 'JSON, All time, Export to device', body: 'JSON keeps follow dates. All time gets your full lists, not just recent changes.' },
    { title: 'Upload the ZIP here', body: 'Meta emails you a download link. Download the ZIP and upload it without unzipping it.' },
  ],
  sizeTip: 'Tip: selecting only Followers and Following keeps the ZIP tiny. A full export also includes your photos, which makes it much bigger and slower to open.',
  fullGuideLink: 'Full export guide with screenshots →',
  readEyebrow: 'WHAT WE READ',
  readHeadline: 'Three files. Nothing else.',
  readBody: 'Your Threads ZIP stays on your device. The parser only reads these files from it:',
  readFiles: ['threads/followers.json', 'threads/following.json', 'threads/recently_unfollowed_profiles.json'],
  readNever: 'Your posts, likes, photos, and personal information in the same ZIP are never read. The parser is open source (MPL-2.0), so you can check.',
  faqEyebrow: 'QUESTIONS',
  faqHeadline: 'Threads, answered.',
  faq: [
    { q: 'Does Threads tell you when someone unfollows you?', a: "No. Threads doesn't notify you when someone unfollows you, and it doesn't tell anyone when you unfollow them. Comparing two exports is the reliable way to know." },
    { q: 'Can I see who unfollowed me on Threads for free?', a: 'Yes. The free plan shows who does not follow you back from one export, with no account. Seeing who unfollowed you between two exports needs saved snapshots, which Pro keeps.' },
    { q: 'Do I need to give my Threads or Instagram password?', a: 'No. You upload the export Meta sends you. There is no login and no connection to your account.' },
    { q: 'Can I use the same export as Instagram?', a: 'Request one export per profile. If a ZIP has both, we show the Instagram part and tell you to export Threads on its own.' },
    { q: 'Will Threads ban me for using this?', a: "No. The data export is Meta's own feature, offered under GDPR. Nothing here touches Threads or its API." },
  ],
  ctaHeadline: 'Have your Threads ZIP?',
  ctaSubline: 'Drop it on the homepage. It is read in your browser in seconds.',
  ctaButton: 'Upload your export',
  instagramLink: 'Looking for Instagram? Same tool, same steps →',
};

const ES: ThreadsPageContent = {
  eyebrow: 'QUIÉN TE DEJÓ DE SEGUIR EN THREADS',
  headline: '¿Quién te dejó de seguir en Threads?',
  headlineItalic: 'Descúbrelo sin tu contraseña.',
  intro:
    'WhoUnfollowed lee el export oficial de datos de Threads que Meta te da y te muestra quién no te sigue de vuelta en Threads. Guarda snapshots con el tiempo para ver exactamente quién te dejó de seguir. Funciona por completo en tu navegador, no necesita inicio de sesión y el código es abierto.',
  uploadCta: 'Sube tu ZIP de Threads',
  stats: [
    { value: '0', label: 'contraseñas pedidas' },
    { value: '100%', label: 'en tu navegador' },
    { value: 'Gratis', label: 'sin cuenta' },
  ],
  whatEyebrow: 'LO QUE OBTIENES',
  whatHeadline: 'La misma herramienta, para tu cuenta de Threads.',
  whatItems: [
    { title: 'Quién no te sigue de vuelta', body: 'Cada cuenta de Threads que sigues y no te sigue, con la fecha en que la empezaste a seguir.' },
    { title: 'Fans y mutuos', body: 'Quienes te siguen y tú no sigues, y todas las cuentas con las que se siguen mutuamente.' },
    { title: 'Quién te dejó de seguir', body: 'Sube un export más reciente y compara snapshots para ver exactamente quién se fue. Pro guarda historial ilimitado.' },
    { title: 'Separado de Instagram', body: 'Los snapshots de Threads e Instagram nunca se mezclan. Radar, historial y comparaciones van por app.' },
  ],
  stepsEyebrow: 'CÓMO EXPORTAR',
  stepsHeadline: 'Consigue tu export de Threads en pocos minutos.',
  steps: [
    { title: 'Abre el Centro de cuentas', body: 'Centro de cuentas → Tu información y permisos → Exportar tu información → Crear export. Puedes llegar desde la configuración de Threads o de Instagram.' },
    { title: 'Elige tu perfil de Threads', body: 'Selecciona solo tu perfil de Threads. Un perfil por export: Instagram necesita el suyo.' },
    { title: 'Elige Seguidores y Seguidos', body: 'Selecciona solo esta categoría, no toda tu información.' },
    { title: 'JSON, Todo el tiempo, Exportar al dispositivo', body: 'JSON conserva las fechas de seguimiento. Todo el tiempo trae tus listas completas, no solo los cambios recientes.' },
    { title: 'Sube el ZIP aquí', body: 'Meta te envía un enlace de descarga por correo. Descarga el ZIP y súbelo sin descomprimirlo.' },
  ],
  sizeTip: 'Consejo: elegir solo Seguidores y Seguidos mantiene el ZIP muy pequeño. Un export completo incluye también tus fotos, lo que lo hace mucho más pesado y lento de abrir.',
  fullGuideLink: 'Guía completa de exportación con capturas →',
  readEyebrow: 'QUÉ LEEMOS',
  readHeadline: 'Tres archivos. Nada más.',
  readBody: 'Tu ZIP de Threads se queda en tu dispositivo. El parser solo lee estos archivos:',
  readFiles: ['threads/followers.json', 'threads/following.json', 'threads/recently_unfollowed_profiles.json'],
  readNever: 'Tus publicaciones, me gusta, fotos e información personal del mismo ZIP nunca se leen. El parser es de código abierto (MPL-2.0), así que puedes comprobarlo.',
  faqEyebrow: 'PREGUNTAS',
  faqHeadline: 'Threads, respondido.',
  faq: [
    { q: '¿Threads te avisa cuando alguien te deja de seguir?', a: 'No. Threads no te avisa cuando alguien te deja de seguir, ni le dice a nadie cuando tú lo dejas de seguir. Comparar dos exports es la forma fiable de saberlo.' },
    { q: '¿Puedo ver gratis quién me dejó de seguir en Threads?', a: 'Sí. El plan gratis muestra quién no te sigue de vuelta a partir de un export, sin cuenta. Ver quién te dejó de seguir entre dos exports requiere snapshots guardados, que Pro conserva.' },
    { q: '¿Tengo que dar mi contraseña de Threads o Instagram?', a: 'No. Subes el export que Meta te envía. No hay inicio de sesión ni conexión con tu cuenta.' },
    { q: '¿Puedo usar el mismo export que en Instagram?', a: 'Solicita un export por perfil. Si un ZIP tiene ambos, mostramos la parte de Instagram y te pedimos exportar Threads por separado.' },
    { q: '¿Threads me bloqueará por usar esto?', a: 'No. El export de datos es una función de Meta, ofrecida bajo el RGPD. Nada de esto toca Threads ni su API.' },
  ],
  ctaHeadline: '¿Tienes tu ZIP de Threads?',
  ctaSubline: 'Súbelo en la página de inicio. Se lee en tu navegador en segundos.',
  ctaButton: 'Sube tu export',
  instagramLink: '¿Buscas Instagram? La misma herramienta, los mismos pasos →',
};

const PT: ThreadsPageContent = {
  eyebrow: 'QUEM DEIXOU DE TE SEGUIR NO THREADS',
  headline: 'Quem deixou de te seguir no Threads?',
  headlineItalic: 'Descubra sem sua senha.',
  intro:
    'O WhoUnfollowed lê o export oficial de dados do Threads que a Meta te fornece e mostra quem não te segue de volta no Threads. Guarde snapshots ao longo do tempo para ver exatamente quem deixou de te seguir. Roda inteiramente no seu navegador, não precisa de login e o código é aberto.',
  uploadCta: 'Envie seu ZIP do Threads',
  stats: [
    { value: '0', label: 'senhas pedidas' },
    { value: '100%', label: 'no seu navegador' },
    { value: 'Grátis', label: 'sem conta' },
  ],
  whatEyebrow: 'O QUE VOCÊ RECEBE',
  whatHeadline: 'A mesma ferramenta, para sua conta do Threads.',
  whatItems: [
    { title: 'Quem não te segue de volta', body: 'Cada conta do Threads que você segue e não te segue, com a data em que você começou a seguir.' },
    { title: 'Fãs e mútuos', body: 'Quem te segue e você não segue de volta, e todo mundo com quem vocês se seguem.' },
    { title: 'Quem deixou de te seguir', body: 'Envie um export mais recente depois e compare snapshots para ver exatamente quem saiu. O Pro guarda histórico ilimitado.' },
    { title: 'Separado do Instagram', body: 'Os snapshots do Threads e do Instagram nunca se misturam. Radar, histórico e comparações ficam por app.' },
  ],
  stepsEyebrow: 'COMO EXPORTAR',
  stepsHeadline: 'Consiga seu export do Threads em poucos minutos.',
  steps: [
    { title: 'Abra a Central de contas', body: 'Central de contas → Suas informações e permissões → Exportar suas informações → Criar export. Dá para chegar pelas configurações do Threads ou do Instagram.' },
    { title: 'Escolha seu perfil do Threads', body: 'Selecione só seu perfil do Threads. Um perfil por export: o Instagram precisa do seu.' },
    { title: 'Escolha Seguidores e Seguindo', body: 'Selecione só esta categoria, não todas as suas informações.' },
    { title: 'JSON, Todo o período, Exportar para o dispositivo', body: 'JSON mantém as datas de quando você seguiu. Todo o período traz suas listas completas, não só as mudanças recentes.' },
    { title: 'Envie o ZIP aqui', body: 'A Meta te envia um link de download por email. Baixe o ZIP e envie sem descompactar.' },
  ],
  sizeTip: 'Dica: escolher só Seguidores e Seguindo deixa o ZIP bem pequeno. Um export completo também inclui suas fotos, o que o deixa muito maior e mais lento para abrir.',
  fullGuideLink: 'Guia completo de exportação com capturas →',
  readEyebrow: 'O QUE LEMOS',
  readHeadline: 'Três arquivos. Mais nada.',
  readBody: 'Seu ZIP do Threads fica no seu dispositivo. O parser só lê estes arquivos:',
  readFiles: ['threads/followers.json', 'threads/following.json', 'threads/recently_unfollowed_profiles.json'],
  readNever: 'Suas publicações, curtidas, fotos e informações pessoais no mesmo ZIP nunca são lidas. O parser é de código aberto (MPL-2.0), então você pode conferir.',
  faqEyebrow: 'PERGUNTAS',
  faqHeadline: 'Threads, respondido.',
  faq: [
    { q: 'O Threads avisa quando alguém deixa de te seguir?', a: 'Não. O Threads não avisa quando alguém deixa de te seguir, nem avisa ninguém quando você deixa de seguir. Comparar dois exports é a forma confiável de saber.' },
    { q: 'Posso ver de graça quem deixou de me seguir no Threads?', a: 'Sim. O plano grátis mostra quem não te segue de volta a partir de um export, sem conta. Ver quem deixou de te seguir entre dois exports exige snapshots salvos, que o Pro guarda.' },
    { q: 'Preciso dar minha senha do Threads ou do Instagram?', a: 'Não. Você envia o export que a Meta te manda. Não há login nem conexão com sua conta.' },
    { q: 'Posso usar o mesmo export do Instagram?', a: 'Peça um export por perfil. Se um ZIP tiver os dois, mostramos a parte do Instagram e pedimos para exportar o Threads separado.' },
    { q: 'O Threads vai me banir por usar isso?', a: 'Não. O export de dados é um recurso da própria Meta, oferecido sob o RGPD. Nada aqui toca o Threads ou a API dele.' },
  ],
  ctaHeadline: 'Tem seu ZIP do Threads?',
  ctaSubline: 'Envie na página inicial. Ele é lido no seu navegador em segundos.',
  ctaButton: 'Envie seu export',
  instagramLink: 'Procurando o Instagram? Mesma ferramenta, mesmos passos →',
};

const CONTENT: Record<AppLocale, ThreadsPageContent> = { en: EN, es: ES, pt: PT };

export function getThreadsPageContent(locale: AppLocale): ThreadsPageContent {
  return CONTENT[locale];
}
