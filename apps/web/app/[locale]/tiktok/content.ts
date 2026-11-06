import type { AppLocale } from '@/i18n/routing';
import type { ThreadsPageContent } from '../threads/content';

// Same shape as the Threads landing page, so both pages stay in step.
export type TikTokPageContent = ThreadsPageContent;

const EN: TikTokPageContent = {
  eyebrow: 'TIKTOK UNFOLLOWERS',
  headline: 'Who unfollowed you on TikTok?',
  headlineItalic: 'Find out without your password.',
  intro:
    "WhoUnfollowed reads the data download TikTok gives you and shows who doesn't follow you back on TikTok. Save snapshots over time to see exactly who unfollowed you. It runs entirely in your browser, needs no login, and the code is open source.",
  uploadCta: 'Upload your TikTok file',
  stats: [
    { value: '0', label: 'passwords asked' },
    { value: '100%', label: 'in your browser' },
    { value: 'Free', label: 'no account needed' },
  ],
  whatEyebrow: 'WHAT YOU GET',
  whatHeadline: 'The same tool, for your TikTok account.',
  whatItems: [
    { title: "Who doesn't follow you back", body: 'Every TikTok account you follow that does not follow you, with the date you followed them.' },
    { title: 'Fans and mutuals', body: "People who follow you that you don't follow back, and everyone you follow each other with." },
    { title: 'Who unfollowed you', body: 'Upload a newer download later and compare snapshots to see exactly who left. Pro keeps unlimited history.' },
    { title: 'Kept apart from Instagram', body: 'TikTok, Instagram and Threads snapshots never mix. Radar, history and comparisons stay per app.' },
  ],
  stepsEyebrow: 'HOW TO EXPORT',
  stepsHeadline: 'Request your TikTok data in a minute.',
  steps: [
    { title: 'Open Settings and privacy', body: 'In the TikTok app, go to Profile, tap the menu (three lines), then Settings and privacy.' },
    { title: 'Account, then Download your data', body: 'Tap Account, then Download your data. You can also do this on tiktok.com under Settings.' },
    { title: 'Pick JSON', body: 'Choose the JSON file format (TikTok defaults to TXT, which also works). All data is fine, or a custom selection that includes your activity.' },
    { title: 'Request data and wait', body: 'Tap Request data. TikTok prepares it in the background, which can take a few days. Check the Download data tab.' },
    { title: 'Upload the file here', body: 'Download the file and upload it as it is, ZIP or JSON. No need to unzip it.' },
  ],
  sizeTip: 'Heads up: TikTok\'s download lists up to about 10,000 followers. Above that, the oldest ones may be missing, and we\'ll tell you when that might be the case.',
  fullGuideLink: 'Full export guide →',
  readEyebrow: 'WHAT WE READ',
  readHeadline: 'Two lists. Nothing else.',
  readBody: 'Your TikTok file stays on your device. The parser only reads your follower and following lists from it:',
  readFiles: ['user_data_tiktok.json → Follower, Following', 'or Activity/Follower.txt and Following.txt'],
  readNever: 'Your videos, messages, watch history, likes and personal information in the same file are never read. The parser is open source (MPL-2.0), so you can check.',
  faqEyebrow: 'QUESTIONS',
  faqHeadline: 'TikTok, answered.',
  faq: [
    { q: 'Does TikTok tell you when someone unfollows you?', a: "No. TikTok doesn't notify you when someone unfollows you. Comparing two data downloads is the reliable way to know." },
    { q: 'Can I see who unfollowed me on TikTok for free?', a: 'Yes. The free plan shows who does not follow you back from one download, with no account. Seeing who unfollowed you between two downloads needs saved snapshots, which Pro keeps.' },
    { q: 'Do I need to give my TikTok password?', a: 'No. You upload the file TikTok gives you. There is no login and no connection to your account.' },
    { q: 'How long does the TikTok download take?', a: 'TikTok prepares it in the background. It is often ready within a day, sometimes a few days. Request it now and come back when it lands.' },
    { q: 'Will TikTok ban me for using this?', a: "No. Download your data is TikTok's own feature. Nothing here touches TikTok or its API." },
    { q: 'Why are some of my followers missing?', a: 'TikTok\'s download includes up to about 10,000 followers. If you have more, the oldest may be cut off, so treat the oldest part of the list with care.' },
  ],
  ctaHeadline: 'Have your TikTok file?',
  ctaSubline: 'Drop it on the homepage. It is read in your browser in seconds.',
  ctaButton: 'Upload your file',
  instagramLink: 'Looking for Instagram? Same tool, same idea →',
};

const ES: TikTokPageContent = {
  eyebrow: 'QUIÉN TE DEJÓ DE SEGUIR EN TIKTOK',
  headline: '¿Quién te dejó de seguir en TikTok?',
  headlineItalic: 'Descúbrelo sin tu contraseña.',
  intro:
    'WhoUnfollowed lee la descarga de datos que TikTok te da y te muestra quién no te sigue de vuelta en TikTok. Guarda snapshots con el tiempo para ver exactamente quién te dejó de seguir. Funciona por completo en tu navegador, no necesita inicio de sesión y el código es abierto.',
  uploadCta: 'Sube tu archivo de TikTok',
  stats: [
    { value: '0', label: 'contraseñas pedidas' },
    { value: '100%', label: 'en tu navegador' },
    { value: 'Gratis', label: 'sin cuenta' },
  ],
  whatEyebrow: 'QUÉ OBTIENES',
  whatHeadline: 'La misma herramienta, para tu cuenta de TikTok.',
  whatItems: [
    { title: 'Quién no te sigue de vuelta', body: 'Cada cuenta de TikTok que sigues y no te sigue, con la fecha en que la seguiste.' },
    { title: 'Fans y mutuos', body: 'Quienes te siguen y no sigues, y todas las personas con las que se siguen mutuamente.' },
    { title: 'Quién te dejó de seguir', body: 'Sube una descarga más nueva después y compara snapshots para ver exactamente quién se fue. Pro guarda historial ilimitado.' },
    { title: 'Separado de Instagram', body: 'Los snapshots de TikTok, Instagram y Threads nunca se mezclan. Radar, historial y comparaciones van por app.' },
  ],
  stepsEyebrow: 'CÓMO EXPORTAR',
  stepsHeadline: 'Pide tus datos de TikTok en un minuto.',
  steps: [
    { title: 'Abre Ajustes y privacidad', body: 'En la app de TikTok, ve a Perfil, toca el menú (tres líneas) y luego Ajustes y privacidad.' },
    { title: 'Cuenta, luego Descargar tus datos', body: 'Toca Cuenta y luego Descargar tus datos. También puedes hacerlo en tiktok.com desde Ajustes.' },
    { title: 'Elige JSON', body: 'Elige el formato JSON (TikTok usa TXT por defecto, que también funciona). Todos los datos sirve, o una selección que incluya tu actividad.' },
    { title: 'Solicita los datos y espera', body: 'Toca Solicitar datos. TikTok los prepara en segundo plano, lo que puede tardar unos días. Revisa la pestaña Descargar datos.' },
    { title: 'Sube el archivo aquí', body: 'Descarga el archivo y súbelo tal cual, ZIP o JSON. No hace falta descomprimirlo.' },
  ],
  sizeTip: 'Ojo: la descarga de TikTok lista hasta unos 10.000 seguidores. Por encima de eso pueden faltar los más antiguos, y te avisaremos cuando pueda pasar.',
  fullGuideLink: 'Guía completa de exportación →',
  readEyebrow: 'QUÉ LEEMOS',
  readHeadline: 'Dos listas. Nada más.',
  readBody: 'Tu archivo de TikTok se queda en tu dispositivo. El parser solo lee tus listas de seguidores y seguidos:',
  readFiles: ['user_data_tiktok.json → Follower, Following', 'o Activity/Follower.txt y Following.txt'],
  readNever: 'Tus videos, mensajes, historial, likes e información personal en el mismo archivo nunca se leen. El parser es de código abierto (MPL-2.0), así que puedes comprobarlo.',
  faqEyebrow: 'PREGUNTAS',
  faqHeadline: 'TikTok, respondido.',
  faq: [
    { q: '¿TikTok te avisa cuando alguien te deja de seguir?', a: 'No. TikTok no te avisa cuando alguien te deja de seguir. Comparar dos descargas de datos es la forma fiable de saberlo.' },
    { q: '¿Puedo ver gratis quién me dejó de seguir en TikTok?', a: 'Sí. El plan gratis muestra quién no te sigue de vuelta con una descarga, sin cuenta. Ver quién te dejó de seguir entre dos descargas necesita snapshots guardados, que guarda Pro.' },
    { q: '¿Tengo que dar mi contraseña de TikTok?', a: 'No. Subes el archivo que TikTok te da. No hay inicio de sesión ni conexión con tu cuenta.' },
    { q: '¿Cuánto tarda la descarga de TikTok?', a: 'TikTok la prepara en segundo plano. Muchas veces está lista en un día, a veces en unos días. Pídela ahora y vuelve cuando llegue.' },
    { q: '¿TikTok me puede banear por usar esto?', a: 'No. Descargar tus datos es una función de TikTok. Nada aquí toca TikTok ni su API.' },
    { q: '¿Por qué faltan algunos de mis seguidores?', a: 'La descarga de TikTok incluye hasta unos 10.000 seguidores. Si tienes más, los más antiguos pueden quedar fuera, así que toma esa parte de la lista con cuidado.' },
  ],
  ctaHeadline: '¿Tienes tu archivo de TikTok?',
  ctaSubline: 'Súbelo en la página principal. Se lee en tu navegador en segundos.',
  ctaButton: 'Sube tu archivo',
  instagramLink: '¿Buscas Instagram? La misma herramienta →',
};

const PT: TikTokPageContent = {
  eyebrow: 'QUEM DEIXOU DE TE SEGUIR NO TIKTOK',
  headline: 'Quem deixou de te seguir no TikTok?',
  headlineItalic: 'Descubra sem a sua senha.',
  intro:
    'O WhoUnfollowed lê o download de dados que o TikTok te dá e mostra quem não te segue de volta no TikTok. Salve snapshots ao longo do tempo para ver exatamente quem deixou de te seguir. Roda inteiro no seu navegador, sem login, e o código é aberto.',
  uploadCta: 'Envie seu arquivo do TikTok',
  stats: [
    { value: '0', label: 'senhas pedidas' },
    { value: '100%', label: 'no seu navegador' },
    { value: 'Grátis', label: 'sem conta' },
  ],
  whatEyebrow: 'O QUE VOCÊ GANHA',
  whatHeadline: 'A mesma ferramenta, para sua conta do TikTok.',
  whatItems: [
    { title: 'Quem não te segue de volta', body: 'Cada conta do TikTok que você segue e não te segue, com a data em que você seguiu.' },
    { title: 'Fãs e mútuos', body: 'Quem te segue e você não segue, e todo mundo com quem vocês se seguem.' },
    { title: 'Quem deixou de te seguir', body: 'Envie um download mais novo depois e compare snapshots para ver exatamente quem saiu. O Pro guarda histórico ilimitado.' },
    { title: 'Separado do Instagram', body: 'Snapshots de TikTok, Instagram e Threads nunca se misturam. Radar, histórico e comparações ficam por app.' },
  ],
  stepsEyebrow: 'COMO EXPORTAR',
  stepsHeadline: 'Peça seus dados do TikTok em um minuto.',
  steps: [
    { title: 'Abra Configurações e privacidade', body: 'No app do TikTok, vá em Perfil, toque no menu (três linhas) e depois em Configurações e privacidade.' },
    { title: 'Conta, depois Baixar seus dados', body: 'Toque em Conta e depois em Baixar seus dados. Também dá para fazer em tiktok.com, nas Configurações.' },
    { title: 'Escolha JSON', body: 'Escolha o formato JSON (o TikTok usa TXT por padrão, que também funciona). Todos os dados serve, ou uma seleção que inclua sua atividade.' },
    { title: 'Solicite e espere', body: 'Toque em Solicitar dados. O TikTok prepara em segundo plano, o que pode levar alguns dias. Confira a aba Baixar dados.' },
    { title: 'Envie o arquivo aqui', body: 'Baixe o arquivo e envie do jeito que veio, ZIP ou JSON. Não precisa descompactar.' },
  ],
  sizeTip: 'Atenção: o download do TikTok lista até uns 10.000 seguidores. Acima disso os mais antigos podem faltar, e a gente avisa quando isso puder acontecer.',
  fullGuideLink: 'Guia completo de exportação →',
  readEyebrow: 'O QUE LEMOS',
  readHeadline: 'Duas listas. Nada mais.',
  readBody: 'Seu arquivo do TikTok fica no seu aparelho. O parser só lê suas listas de seguidores e seguindo:',
  readFiles: ['user_data_tiktok.json → Follower, Following', 'ou Activity/Follower.txt e Following.txt'],
  readNever: 'Seus vídeos, mensagens, histórico, curtidas e informações pessoais no mesmo arquivo nunca são lidos. O parser é de código aberto (MPL-2.0), então você pode conferir.',
  faqEyebrow: 'PERGUNTAS',
  faqHeadline: 'TikTok, respondido.',
  faq: [
    { q: 'O TikTok avisa quando alguém deixa de te seguir?', a: 'Não. O TikTok não avisa quando alguém deixa de te seguir. Comparar dois downloads de dados é o jeito confiável de saber.' },
    { q: 'Dá para ver de graça quem deixou de me seguir no TikTok?', a: 'Sim. O plano grátis mostra quem não te segue de volta com um download, sem conta. Ver quem deixou de te seguir entre dois downloads precisa de snapshots salvos, que o Pro guarda.' },
    { q: 'Preciso dar minha senha do TikTok?', a: 'Não. Você envia o arquivo que o TikTok te dá. Não tem login nem conexão com sua conta.' },
    { q: 'Quanto tempo leva o download do TikTok?', a: 'O TikTok prepara em segundo plano. Muitas vezes fica pronto em um dia, às vezes em alguns dias. Peça agora e volte quando chegar.' },
    { q: 'O TikTok pode me banir por usar isso?', a: 'Não. Baixar seus dados é um recurso do próprio TikTok. Nada aqui mexe no TikTok ou na API dele.' },
    { q: 'Por que faltam alguns seguidores?', a: 'O download do TikTok inclui até uns 10.000 seguidores. Se você tem mais, os mais antigos podem ficar de fora, então trate essa parte da lista com cuidado.' },
  ],
  ctaHeadline: 'Já tem seu arquivo do TikTok?',
  ctaSubline: 'Envie na página inicial. Ele é lido no seu navegador em segundos.',
  ctaButton: 'Envie seu arquivo',
  instagramLink: 'Procurando o Instagram? A mesma ferramenta →',
};

const all: Record<AppLocale, TikTokPageContent> = { en: EN, es: ES, pt: PT };
export const getTikTokPageContent = (locale: AppLocale) => all[locale];
