import { DELTA_WARNING_EN, DELTA_WARNING_ES, DELTA_WARNING_PT, type DeltaWarningContent } from '@/components/deltaWarning.content';
import type { AppLocale } from '@/i18n/routing';

// All translatable homepage copy, per locale, mirroring the pattern in
// app/[locale]/pricing/content.ts. Split by section so each component only
// needs the slice it renders. Decorative, aria-hidden mockup content inside
// ValueSection's illustrations (fake usernames, mock chart labels like
// "gained"/"unfollowed", month tags) is intentionally left in English: it's
// invisible to screen readers and irrelevant to SEO, so translating it would
// be pure effort with no reader ever seeing the difference.
export interface HomeContent {
  hero: {
    headlineSeeWho: string;
    headlineDoesntFollowBack: string;
    headlineOnInstagram: string;
    headlineWithoutSharing: string;
    headlinePassword: string;
    subhead: string;
    dropIdleTitle: string;
    dropDraggingTitle: string;
    dropIdleBody: string;
    chooseFile: string;
    orDropAnywhere: string;
    noExportYetLink: string;
    alreadyUsingLink: string;
    parsingTitle: string;
    parsingNote: string;
    errorTitle: string;
    tryAgain: string;
    guideCtaMissingData: string;
    guideCtaDefault: string;
    combinedExport: {
      title: string;
      body: string;
      continueCta: string;
    };
    deltaWarning: DeltaWarningContent;
    largeFile: {
      title: string;
      body: string;
      smallerCta: string;
      continueCta: string;
      cancelCta: string;
    };
    upgradeDialog: {
      eyebrow: string;
      title: string;
      body: string;
      oldestLabel: string;
      deleteCta: string;
      upgradeCta: string;
      close: string;
    };
    errors: {
      unzippedFile: string;
      missingData: string;
      missingThreadsData: string;
      mixedFormat: string;
      invalidZip: string;
      schemaChanged: string;
      unsupportedFormat: string;
      fileRead: string;
      unknown: string;
    };
    trustOpenSourcePrefix: string;
    trustOpenSourceSuffix: string;
    trustNoLoginPrefix: string;
    trustNoLoginSuffix: string;
    trustNothingStoredPrefix: string;
    trustNothingStoredSuffix: string;
    statAnalyses: string;
    statAvgNonFollowers: string;
    statPasswords: string;
  };
  whatYouGet: {
    eyebrow: string;
    card1Eyebrow: string;
    card1Title: string;
    card1Body: string;
    card2Eyebrow: string;
    card2Title: string;
    card2Body: string;
    trustLine: string;
  };
  marquee: string[];
  value: {
    eyebrow: string;
    headlineLine1: string;
    headlineLine2: string;
    body: string;
    panelAccountHealth: string;
    panelAccountHealthDesc: string;
    panelResults: string;
    panelCompare: string;
    panelCompareDesc: string;
    statParseTime: string;
    statParseTimeNote: string;
    statDataLeaves: string;
    statDataLeavesNote: string;
    statApiCalls: string;
    statApiCallsNote: string;
  };
  flow: {
    eyebrow: string;
    headlinePrefix: string;
    headlineSuffix: string;
    step1Title: string;
    step1Body: string;
    step1Eta: string;
    step2Title: string;
    step2Eta: string;
    step2Items: string[];
    step3Title: string;
    step3Body: string;
    step3Eta: string;
    waitNote: string;
    notSure: string;
    guideCta: string;
  };
  compare: {
    eyebrow: string;
    headlineLine1: string;
    headlineStrikethrough: string;
    subheadItalic: string;
    body: string;
    usTag: string;
    usTitle: string;
    usItems: string[];
    themTag: string;
    themTitle: string;
    themItems: string[];
  };
  pricingTeaser: {
    eyebrow: string;
    headlineLine1: string;
    headlineLine2: string;
    monthlyLabel: string;
    yearlyLabel: string;
    freeBadge: string;
    freeNoSignup: string;
    freeBullets: string[];
    freeCta: string;
    proBadge: string;
    oneTime: string;
    proDescMonthly: string;
    proDescYearlyTemplate: string;
    proBullets: string[];
    proCta: string;
    mobileBadge: string;
    mobileSoon: string;
    mobileIncludedWithPro: string;
    mobileQuote: string;
    mobileBullets: string[];
    mobileEmailPlaceholder: string;
    mobileNotifyButton: string;
    mobileOnTheList: string;
    mobileError: string;
    freeTab: string;
    proTab: string;
    mobileTab: string;
    paymentNotes: string[];
    learnMore: string;
    lifetimeBanner: { badge: string; text: string; cta: string };
  };
  faq: {
    eyebrow: string;
    headlineLine1: string;
    headlineLine2: string;
    intro: string;
    stillWondering: string;
    emailUs: string;
    categories: { privacy: string; product: string; billing: string };
    items: {
      privacy: [string, string][];
      product: [string, string][];
      billing: [string, string][];
    };
  };
}

const EN: HomeContent = {
  hero: {
    headlineSeeWho: 'See who',
    headlineDoesntFollowBack: "doesn't follow you back",
    headlineOnInstagram: 'on Instagram & Threads.',
    headlineWithoutSharing: 'Without sharing',
    headlinePassword: 'your password.',
    subhead: 'The free tool reads your official Instagram or Threads data export entirely in your browser, so your password and account data never leave your device.',
    dropIdleTitle: 'Have your Instagram or Threads ZIP? Upload it here.',
    dropDraggingTitle: 'Drop it here.',
    dropIdleBody: 'The ZIP Meta emails you after your request. Do not unzip it.',
    chooseFile: 'Choose file',
    orDropAnywhere: 'or drop it anywhere on this page',
    noExportYetLink: "Don't have it yet? See how to request your export →",
    alreadyUsingLink: 'Already using WhoUnfollowed? View snapshot history →',
    parsingTitle: 'Reading your data',
    parsingNote: 'Stays on your device. Nothing is uploaded.',
    errorTitle: 'Something went wrong.',
    tryAgain: 'Try again',
    guideCtaMissingData: 'Show me what to select in the export',
    guideCtaDefault: 'Show me the correct export settings',
    combinedExport: {
      title: 'This ZIP has Instagram and Threads data.',
      body: 'We are showing your Instagram results. To see Threads too, request a separate export with only your Threads profile selected, then upload that ZIP on its own.',
      continueCta: 'Got it, show Instagram',
    },
    deltaWarning: DELTA_WARNING_EN,
    largeFile: {
      title: 'This ZIP is too big to open here.',
      body: 'Your export is {size}, probably because it includes your photos and videos. Your browser has to read the whole file at once, and phones often run out of memory and close the tab. Request a new export with only Followers and Following selected: it is only a few MB.',
      smallerCta: 'Show me how to get a smaller export',
      continueCta: 'Try this file anyway',
      cancelCta: 'Cancel',
    },
    upgradeDialog: {
      eyebrow: 'Free plan limit reached',
      title: "You've already saved a snapshot",
      body: 'The free plan stores 1 snapshot locally. Delete the existing one to save this upload, or upgrade to Pro for unlimited history.',
      oldestLabel: 'Oldest snapshot',
      deleteCta: 'Delete oldest & save new upload',
      upgradeCta: 'Upgrade to Pro',
      close: 'Close',
    },
    errors: {
      unzippedFile: 'This is a file from inside your export, not the ZIP itself. On Mac, Safari unzips downloads automatically: upload the original .zip from your Downloads folder, or right-click the unzipped folder and choose Compress to make a new ZIP.',
      missingData: 'This ZIP does not include your followers and following lists (the connections/followers_and_following folder). Request a new export with Followers and Following selected. If your export came in several parts, upload the part that contains that folder.',
      missingThreadsData: 'This Threads export is missing your followers or following list. Request a new export with Followers and following selected, in JSON format.',
      mixedFormat: 'This export mixes JSON and HTML files. Please request the JSON version again, then upload the ZIP.',
      invalidZip: 'We could not read this ZIP. Download the original file again and upload it without unzipping it.',
      schemaChanged: 'Meta may have changed the export format, so we could not read part of this file. Try requesting a fresh export.',
      unsupportedFormat: 'Please upload the original ZIP file Instagram or Threads provided.',
      fileRead: 'Your browser could not read this file. If it is synced via iCloud, Google Drive, or another cloud service, make sure it has fully downloaded to your device, then try again.',
      unknown: 'Something went wrong. Make sure you uploaded the correct Instagram or Threads ZIP.',
    },
    trustOpenSourcePrefix: 'open source,',
    trustOpenSourceSuffix: 'free forever',
    trustNoLoginPrefix: 'no password,',
    trustNoLoginSuffix: 'no risk',
    trustNothingStoredPrefix: 'nothing stored,',
    trustNothingStoredSuffix: 'nothing shared',
    statAnalyses: 'Analyses run',
    statAvgNonFollowers: 'Avg non-followers',
    statPasswords: 'Passwords shared',
  },
  whatYouGet: {
    eyebrow: 'WHAT YOU GET',
    card1Eyebrow: 'Today · one export',
    card1Title: "See who doesn't follow you back",
    card1Body: 'Find every account you follow that does not currently follow you.',
    card2Eyebrow: 'Over time · snapshots',
    card2Title: 'See who unfollowed you',
    card2Body: 'Save a snapshot, upload another export later, and compare what changed.',
    trustLine: 'No password. No account connection. Your ZIP is processed locally in this browser.',
  },
  marquee: [
    "see who doesn't follow back",
    'no login needed',
    'runs in your browser',
    'open-source',
    'instagram and threads',
    'your data stays yours',
  ],
  value: {
    eyebrow: 'RESULTS',
    headlineLine1: '2 seconds to parse.',
    headlineLine2: 'A full picture to act on.',
    body: 'Drop the ZIP. Your browser reads it locally and gives you the exact list of who does not follow you back, a Radar health score, and a growth timeline. Nothing leaves your device.',
    panelAccountHealth: 'Radar · Account Health',
    panelAccountHealthDesc: "Radar is your account health score: how many followers are sticking around, how long they've followed you, and how your growth is trending.",
    panelResults: 'Results · Non-followers',
    panelCompare: 'Radar · Compare',
    panelCompareDesc: "Compare shows the difference between two snapshots: exactly who unfollowed you and who's new, between the export you uploaded before and this one.",
    statParseTime: 'Parse time',
    statParseTimeNote: 'in your browser',
    statDataLeaves: 'Data leaves device',
    statDataLeavesNote: 'nothing uploaded',
    statApiCalls: 'Meta API calls',
    statApiCallsNote: 'uses your own export',
  },
  flow: {
    eyebrow: 'HOW IT WORKS',
    headlinePrefix: '30 seconds to request.',
    headlineSuffix: 'Minutes to receive. 2 seconds to parse.',
    step1Title: 'Request your export',
    step1Body: 'In Instagram or Threads: Accounts Center → Your information and permissions → Export your information → Create export.',
    step1Eta: '~30 sec',
    step2Title: 'Choose these settings',
    step2Eta: 'few min',
    step2Items: [
      'Select one profile: Instagram or Threads (one export each)',
      'Choose Followers and following',
      'Set date range to All time',
      'Choose JSON format (recommended, keeps follow timestamps)',
      'Choose Export to device',
    ],
    step3Title: 'Download and upload the ZIP',
    step3Body: 'Meta sends a download link by email. Download the ZIP and upload it here without unzipping it.',
    step3Eta: '~2 sec',
    waitNote: 'Meta may take a few minutes to prepare the download. Once it arrives, come back and upload the ZIP.',
    notSure: 'Not sure how to get your export?',
    guideCta: 'Step-by-step export guide',
  },
  compare: {
    eyebrow: 'PRIVACY',
    headlineLine1: 'Every other tool',
    headlineStrikethrough: 'asks for your password.',
    subheadItalic: 'You should not need to hand over your password.',
    body: 'Most follower-tracking services require you to connect your Instagram or Threads account. WhoUnfollowed works differently: you upload the data export Meta provides to you, and it is processed locally in your browser.',
    usTag: 'WhoUnfollowed',
    usTitle: 'Your data, your device.',
    usItems: [
      'You upload your own data export, never your password',
      'ZIP is parsed in your browser tab',
      'No account, no email, no signup',
      'Entire app is open source · AGPL-3.0 web app, MPL-2.0 parser',
      'Built on the data export Meta offers under GDPR',
    ],
    themTag: 'EVERYONE ELSE',
    themTitle: 'Hostage transaction.',
    themItems: [
      'Demands your username + password',
      'Stores your credentials and full account graph',
      'Requires signup and often payment',
      'Closed-source · you trust their word for it',
      'TOS-violating · accounts get flagged or banned',
    ],
  },
  pricingTeaser: {
    eyebrow: 'PRICING',
    headlineLine1: 'Free is the answer',
    headlineLine2: 'for almost everyone.',
    monthlyLabel: '30 days',
    yearlyLabel: '365 days',
    freeBadge: 'Free forever',
    freeNoSignup: 'no sign up required',
    freeBullets: ['Works with Instagram and Threads', 'One snapshot at a time', 'Full non-followers list', 'CSV export', 'No account needed'],
    freeCta: 'Use it free',
    proBadge: 'Pro',
    oneTime: 'one-time',
    proDescMonthly: 'unlocks Pro for 30 days',
    proDescYearlyTemplate: 'unlocks Pro for 365 days · save {pct}%',
    proBullets: [
      'Everything in Free',
      'Unlimited snapshot history',
      'Radar: an account health score plus how long each follower has stuck around',
      'Compare any two snapshots to see exactly who unfollowed',
      'Follower growth charts',
      'Triage: mark non-followers to drop, whitelist, or skip for now',
      'Cloud sync across your devices',
    ],
    proCta: 'See everything in Pro',
    mobileBadge: 'Mobile App',
    mobileSoon: 'Soon',
    mobileIncludedWithPro: 'Included with Pro',
    mobileQuote: '"Your full Radar, in your pocket. No browser needed."',
    mobileBullets: ['Everything in Pro', 'Native iOS and Android', 'Works offline', 'Share results as an image'],
    mobileEmailPlaceholder: 'your@email.com',
    mobileNotifyButton: 'Notify me at launch',
    mobileOnTheList: 'You are on the list.',
    mobileError: 'Something went wrong. Try again.',
    freeTab: 'Free',
    proTab: 'Pro',
    mobileTab: 'Mobile',
    paymentNotes: ['Stripe checkout', 'SCA compliant', 'EU VAT included'],
    learnMore: 'Get more information about Pro →',
    lifetimeBanner: { badge: 'Founding Member', text: 'Pay $19.99 once and keep Pro for good. Available for a limited time to support an independent product.', cta: 'See the Lifetime offer' },
  },
  faq: {
    eyebrow: 'QUESTIONS',
    headlineLine1: 'The honest',
    headlineLine2: 'answers.',
    intro: "Not the marketing ones. If something here doesn't address what you actually want to know, the contact link is real.",
    stillWondering: 'Still wondering?',
    emailUs: 'Email us.',
    categories: { privacy: 'Privacy & data', product: 'How it works', billing: 'Plans & billing' },
    items: {
      privacy: [
        ['Do I need to give you my Instagram or Threads password?',
         'No. There is no Instagram or Threads login on WhoUnfollowed. You upload your own data export, a ZIP file Meta emails to you on request. Your password is never involved.'],
        ['Where does my data go after I upload it?',
         "On the Free plan, nowhere. The ZIP is read by JavaScript inside your browser tab and discarded when you close the page. On Pro, snapshots you choose to save are stored encrypted in our cloud so you can compare them across devices."],
        ['Will Instagram or Threads ban me for using this?',
         "No. The data export is a feature Meta offers for both apps to comply with GDPR. You're using their official tool, not scraping their API or violating any terms."],
        ['If I unfollow someone, will they know?',
         "No notification is sent either way. Neither Instagram nor Threads tells someone they've been unfollowed, or tells you when someone unfollows you. The only way to actually know is to compare your follower list before and after, which is what this tool is for."],
      ],
      product: [
        ['How accurate are the results?',
         "Exact. We compare your Followers list against your Following list directly. If a username appears in one and not the other, that is the truth, not an estimate or a probability."],
        ['Can I track changes over time?',
         "Yes, on Pro. Each upload becomes a snapshot. You can compare any two snapshots to see who started following, who unfollowed, and who quietly came back."],
        ['What file format do you need?',
         "The ZIP file Instagram or Threads sends you when you request your data. Just request followers and following, you don't need the whole archive."],
        ['Does it work with Threads?',
         'Yes. Request a Threads export the same way, in JSON format, and upload it on its own. Threads and Instagram snapshots are kept separate, so you get a Threads non-followers list and, on Pro, Threads history and Radar too.'],
        ['Is the code open source?',
         "Yes. The web app is AGPL-3.0 licensed and the parser is MPL-2.0, both public on GitHub. You don't have to take a privacy claim on faith, you can read exactly what the code does with your data."],
      ],
      billing: [
        ['How much does Pro cost?',
         'Pro is a one-time payment: {price}. No recurring charge, no auto-renewal. The free plan stays free and needs no account. You get your full non-followers list, mutuals, and fans every time you upload. Pro adds saved snapshot history, growth charts, ghost-follower detection, and encrypted cloud sync across your devices.'],
        ['What happens when my Pro unlock runs out?',
         'You drop back to the free plan automatically, no charge, nothing to cancel. Your saved snapshots still export to CSV whenever you want. Buy another unlock any time you want Pro again.'],
      ],
    },
  },
};

const ES: HomeContent = {
  hero: {
    headlineSeeWho: 'Descubre quién',
    headlineDoesntFollowBack: 'no te sigue de vuelta',
    headlineOnInstagram: 'en Instagram y Threads.',
    headlineWithoutSharing: 'Sin compartir',
    headlinePassword: 'tu contraseña.',
    subhead: 'La herramienta gratuita lee tu export oficial de Instagram o Threads por completo en tu navegador, así que tu contraseña y datos de cuenta nunca salen de tu dispositivo.',
    dropIdleTitle: '¿Tienes tu ZIP de Instagram o Threads? Súbelo aquí.',
    dropDraggingTitle: 'Suéltalo aquí.',
    dropIdleBody: 'El ZIP que Meta te envía por correo tras tu solicitud. No lo descomprimas.',
    chooseFile: 'Elegir archivo',
    orDropAnywhere: 'o suéltalo en cualquier parte',
    noExportYetLink: '¿Aún no lo tienes? Mira cómo solicitar tu export →',
    alreadyUsingLink: '¿Ya usas WhoUnfollowed? Ver historial de snapshots →',
    parsingTitle: 'Leyendo tus datos',
    parsingNote: 'Se queda en tu dispositivo. Nada se sube.',
    errorTitle: 'Algo salió mal.',
    tryAgain: 'Intentar de nuevo',
    guideCtaMissingData: 'Muéstrame qué seleccionar en el export',
    guideCtaDefault: 'Muéstrame la configuración correcta',
    combinedExport: {
      title: 'Este ZIP tiene datos de Instagram y de Threads.',
      body: 'Te mostramos los resultados de Instagram. Para ver Threads, solicita un export aparte con solo tu perfil de Threads seleccionado y sube ese ZIP por separado.',
      continueCta: 'Entendido, ver Instagram',
    },
    deltaWarning: DELTA_WARNING_ES,
    largeFile: {
      title: 'Este ZIP es demasiado grande para abrirlo aquí.',
      body: 'Tu export pesa {size}, seguramente porque incluye tus fotos y videos. Tu navegador tiene que leer todo el archivo a la vez, y los teléfonos suelen quedarse sin memoria y cerrar la pestaña. Solicita un export nuevo con solo Seguidores y Seguidos: pesa unos pocos MB.',
      smallerCta: 'Muéstrame cómo obtener un export más pequeño',
      continueCta: 'Probar este archivo igual',
      cancelCta: 'Cancelar',
    },
    upgradeDialog: {
      eyebrow: 'Límite del plan gratis',
      title: 'Ya guardaste un snapshot',
      body: 'El plan gratis guarda 1 snapshot en tu dispositivo. Borra el que tienes para guardar esta subida, o mejora a Pro para tener historial ilimitado.',
      oldestLabel: 'Snapshot más antiguo',
      deleteCta: 'Borrar el más antiguo y guardar esta subida',
      upgradeCta: 'Mejorar a Pro',
      close: 'Cerrar',
    },
    errors: {
      unzippedFile: 'Este es un archivo de dentro de tu export, no el ZIP en sí. En Mac, Safari descomprime las descargas automáticamente: sube el .zip original de tu carpeta Descargas, o haz clic derecho en la carpeta descomprimida y elige Comprimir para crear un ZIP nuevo.',
      missingData: 'Este ZIP no incluye tus listas de seguidores y seguidos (la carpeta connections/followers_and_following). Solicita un export nuevo con Seguidores y Seguidos seleccionado. Si tu export llegó en varias partes, sube la parte que contiene esa carpeta.',
      missingThreadsData: 'A este export de Threads le falta tu lista de seguidores o seguidos. Solicita un export nuevo con Seguidores y seguidos seleccionado, en formato JSON.',
      mixedFormat: 'Este export mezcla archivos JSON y HTML. Vuelve a solicitar la versión JSON y sube el ZIP.',
      invalidZip: 'No pudimos leer este ZIP. Descarga de nuevo el archivo original y súbelo sin descomprimirlo.',
      schemaChanged: 'Es posible que Meta haya cambiado el formato del export, así que no pudimos leer parte de este archivo. Intenta solicitar un export nuevo.',
      unsupportedFormat: 'Sube el archivo ZIP original que te dio Instagram o Threads.',
      fileRead: 'Tu navegador no pudo leer este archivo. Si se sincroniza con iCloud, Google Drive u otro servicio en la nube, asegúrate de que se haya descargado por completo en tu dispositivo y vuelve a intentarlo.',
      unknown: 'Algo salió mal. Asegúrate de haber subido el ZIP correcto de Instagram o Threads.',
    },
    trustOpenSourcePrefix: 'código abierto,',
    trustOpenSourceSuffix: 'gratis para siempre',
    trustNoLoginPrefix: 'sin contraseña,',
    trustNoLoginSuffix: 'sin riesgo',
    trustNothingStoredPrefix: 'nada se guarda,',
    trustNothingStoredSuffix: 'nada se comparte',
    statAnalyses: 'Análisis realizados',
    statAvgNonFollowers: 'Prom. no te siguen',
    statPasswords: 'Contraseñas compartidas',
  },
  whatYouGet: {
    eyebrow: 'QUÉ OBTIENES',
    card1Eyebrow: 'Hoy · un export',
    card1Title: 'Ve quién no te sigue de vuelta',
    card1Body: 'Encuentra cada cuenta que sigues y que actualmente no te sigue.',
    card2Eyebrow: 'Con el tiempo · snapshots',
    card2Title: 'Ve quién te dejó de seguir',
    card2Body: 'Guarda un snapshot, sube otro export más tarde y compara qué cambió.',
    trustLine: 'Sin contraseña. Sin conexión de cuenta. Tu ZIP se procesa localmente en este navegador.',
  },
  marquee: [
    've quién no te sigue de vuelta',
    'sin inicio de sesión',
    'funciona en tu navegador',
    'código abierto',
    'instagram y threads',
    'tus datos siguen siendo tuyos',
  ],
  value: {
    eyebrow: 'RESULTADOS',
    headlineLine1: '2 segundos para procesar.',
    headlineLine2: 'Una imagen completa para actuar.',
    body: 'Suelta el ZIP. Tu navegador lo lee localmente y te da la lista exacta de quién no te sigue de vuelta, un puntaje de salud Radar y una línea de tiempo de crecimiento. Nada sale de tu dispositivo.',
    panelAccountHealth: 'Radar · Salud de la Cuenta',
    panelAccountHealthDesc: 'Radar es tu puntaje de salud de cuenta: cuántos seguidores se quedan, hace cuánto te siguen y cómo va tu crecimiento.',
    panelResults: 'Resultados · No te siguen',
    panelCompare: 'Radar · Comparar',
    panelCompareDesc: 'Comparar muestra la diferencia entre dos snapshots: exactamente quién te dejó de seguir y quién es nuevo, entre el export que subiste antes y este.',
    statParseTime: 'Tiempo de procesamiento',
    statParseTimeNote: 'en tu navegador',
    statDataLeaves: 'Datos que salen del dispositivo',
    statDataLeavesNote: 'nada se sube',
    statApiCalls: 'Llamadas a la API de Meta',
    statApiCallsNote: 'usa tu propio export',
  },
  flow: {
    eyebrow: 'CÓMO FUNCIONA',
    headlinePrefix: '30 segundos para solicitarlo.',
    headlineSuffix: 'Minutos para recibirlo. 2 segundos para procesarlo.',
    step1Title: 'Solicita tu export',
    step1Body: 'En Instagram o Threads: Centro de cuentas → Tu información y permisos → Exportar tu información → Crear export.',
    step1Eta: '~30 seg',
    step2Title: 'Elige esta configuración',
    step2Eta: 'unos min',
    step2Items: [
      'Selecciona un perfil: Instagram o Threads (un export por cada uno)',
      'Elige Seguidores y seguidos',
      'Pon el rango de fechas en Todo el tiempo',
      'Elige formato JSON (recomendado, conserva las marcas de tiempo)',
      'Elige Exportar al dispositivo',
    ],
    step3Title: 'Descarga y sube el ZIP',
    step3Body: 'Meta envía un enlace de descarga por correo. Descarga el ZIP y súbelo aquí sin descomprimirlo.',
    step3Eta: '~2 seg',
    waitNote: 'Meta puede tardar unos minutos en preparar la descarga. Cuando llegue, vuelve y sube el ZIP.',
    notSure: '¿No sabes cómo obtener tu export?',
    guideCta: 'Guía paso a paso',
  },
  compare: {
    eyebrow: 'PRIVACIDAD',
    headlineLine1: 'Todas las demás herramientas',
    headlineStrikethrough: 'piden tu contraseña.',
    subheadItalic: 'No deberías tener que entregar tu contraseña.',
    body: 'La mayoría de los servicios de seguimiento de seguidores requieren conectar tu cuenta de Instagram o Threads. WhoUnfollowed funciona diferente: subes el export de datos que Meta te da, y se procesa localmente en tu navegador.',
    usTag: 'WhoUnfollowed',
    usTitle: 'Tus datos, tu dispositivo.',
    usItems: [
      'Subes tu propio export de datos, nunca tu contraseña',
      'El ZIP se procesa en la pestaña de tu navegador',
      'Sin cuenta, sin correo, sin registro',
      'Toda la app es de código abierto · app web AGPL-3.0, parser MPL-2.0',
      'Basado en el export de datos que Meta ofrece bajo el RGPD',
    ],
    themTag: 'TODAS LAS DEMÁS',
    themTitle: 'Transacción de rehén.',
    themItems: [
      'Exige tu usuario y contraseña',
      'Guarda tus credenciales y todo el grafo de tu cuenta',
      'Requiere registro y a menudo un pago',
      'Código cerrado · confías en su palabra',
      'Viola los términos · las cuentas se marcan o se banean',
    ],
  },
  pricingTeaser: {
    eyebrow: 'PRECIOS',
    headlineLine1: 'Gratis es la respuesta',
    headlineLine2: 'para casi todos.',
    monthlyLabel: '30 días',
    yearlyLabel: '365 días',
    freeBadge: 'Gratis para siempre',
    freeNoSignup: 'sin necesidad de registrarte',
    freeBullets: ['Funciona con Instagram y Threads', 'Un snapshot a la vez', 'Lista completa de quienes no te siguen', 'Exportar a CSV', 'Sin cuenta necesaria'],
    freeCta: 'Usarlo gratis',
    proBadge: 'Pro',
    oneTime: 'pago único',
    proDescMonthly: 'desbloquea Pro por 30 días',
    proDescYearlyTemplate: 'desbloquea Pro por 365 días · ahorra {pct}%',
    proBullets: [
      'Todo lo del plan Gratis',
      'Historial ilimitado de snapshots',
      'Radar: un puntaje de salud de cuenta más cuánto tiempo lleva cada seguidor',
      'Compara dos snapshots cualquiera para ver exactamente quién te dejó de seguir',
      'Gráficos de crecimiento de seguidores',
      'Triaje: marca no-seguidores para eliminar, poner en lista blanca o dejar para después',
      'Sincronización en la nube entre tus dispositivos',
    ],
    proCta: 'Ver todo lo de Pro',
    mobileBadge: 'App móvil',
    mobileSoon: 'Pronto',
    mobileIncludedWithPro: 'Incluido con Pro',
    mobileQuote: '"Tu Radar completo, en tu bolsillo. Sin necesidad de navegador."',
    mobileBullets: ['Todo lo de Pro', 'iOS y Android nativos', 'Funciona sin conexión', 'Comparte resultados como imagen'],
    mobileEmailPlaceholder: 'tu@email.com',
    mobileNotifyButton: 'Avisarme en el lanzamiento',
    mobileOnTheList: 'Ya estás en la lista.',
    mobileError: 'Algo salió mal. Inténtalo de nuevo.',
    freeTab: 'Gratis',
    proTab: 'Pro',
    mobileTab: 'Móvil',
    paymentNotes: ['Pago con Stripe', 'Cumple con SCA', 'IVA de la UE incluido'],
    learnMore: 'Más información sobre Pro →',
    lifetimeBanner: { badge: 'Miembro Fundador', text: 'Paga $19.99 una vez y conserva Pro para siempre. Disponible por tiempo limitado para apoyar un producto independiente.', cta: 'Ver la oferta Lifetime' },
  },
  faq: {
    eyebrow: 'PREGUNTAS',
    headlineLine1: 'Las respuestas',
    headlineLine2: 'honestas.',
    intro: 'No las de marketing. Si algo aquí no responde lo que realmente quieres saber, el enlace de contacto es real.',
    stillWondering: '¿Aún tienes dudas?',
    emailUs: 'Escríbenos.',
    categories: { privacy: 'Privacidad y datos', product: 'Cómo funciona', billing: 'Planes y pagos' },
    items: {
      privacy: [
        ['¿Tengo que darles mi contraseña de Instagram o Threads?',
         'No. WhoUnfollowed no tiene inicio de sesión de Instagram ni de Threads. Subes tu propio export de datos, un archivo ZIP que Meta te envía por correo cuando lo solicitas. Tu contraseña nunca está involucrada.'],
        ['¿A dónde van mis datos después de subirlos?',
         'En el plan Gratis, a ninguna parte. El ZIP se lee con JavaScript dentro de la pestaña de tu navegador y se descarta al cerrar la página. En Pro, los snapshots que decides guardar se almacenan cifrados en nuestra nube para que puedas compararlos entre dispositivos.'],
        ['¿Instagram o Threads me bloquearán por usar esto?',
         'No. El export de datos es una función que Meta ofrece en ambas apps para cumplir con el RGPD. Estás usando su herramienta oficial, no raspando su API ni violando ningún término.'],
        ['Si dejo de seguir a alguien, ¿se enterará?',
         'No se envía ninguna notificación en ningún sentido. Ni Instagram ni Threads le dicen a alguien que lo dejaste de seguir, ni te avisan cuando alguien te deja de seguir. La única forma de saberlo de verdad es comparar tu lista de seguidores antes y después, que es exactamente para lo que sirve esta herramienta.'],
      ],
      product: [
        ['¿Qué tan precisos son los resultados?',
         'Exactos. Comparamos directamente tu lista de Seguidores contra tu lista de Seguidos. Si un usuario aparece en una y no en la otra, esa es la verdad, no una estimación ni una probabilidad.'],
        ['¿Puedo hacer seguimiento de cambios con el tiempo?',
         'Sí, en Pro. Cada subida se convierte en un snapshot. Puedes comparar dos snapshots cualquiera para ver quién empezó a seguirte, quién dejó de seguirte y quién volvió en silencio.'],
        ['¿Qué formato de archivo necesitan?',
         'El archivo ZIP que Instagram o Threads te envía cuando solicitas tus datos. Solo pide seguidores y seguidos, no necesitas el archivo completo.'],
        ['¿Funciona con Threads?',
         'Sí. Solicita un export de Threads de la misma forma, en formato JSON, y súbelo por separado. Los snapshots de Threads e Instagram se mantienen aparte, así que obtienes tu lista de no seguidores de Threads y, en Pro, también historial y Radar de Threads.'],
        ['¿El código es abierto?',
         'Sí. La app web tiene licencia AGPL-3.0 y el parser MPL-2.0, ambos públicos en GitHub. No tienes que confiar a ciegas en una promesa de privacidad, puedes leer exactamente qué hace el código con tus datos.'],
      ],
      billing: [
        ['¿Cuánto cuesta Pro?',
         'Pro es un pago único: {price}. Sin cargo recurrente, sin renovación automática. El plan gratis sigue siendo gratis y no necesita cuenta. Obtienes tu lista completa de no-seguidores, mutuos y fans cada vez que subes un export. Pro añade historial de snapshots guardado, gráficos de crecimiento, detección de seguidores fantasma y sincronización cifrada en la nube entre tus dispositivos.'],
        ['¿Qué pasa cuando se acaba mi desbloqueo Pro?',
         'Vuelves automáticamente al plan gratis, sin cargo, sin nada que cancelar. Tus snapshots guardados se siguen exportando a CSV cuando quieras. Compra otro desbloqueo cuando quieras volver a tener Pro.'],
      ],
    },
  },
};

const PT: HomeContent = {
  hero: {
    headlineSeeWho: 'Veja quem',
    headlineDoesntFollowBack: 'não te segue de volta',
    headlineOnInstagram: 'no Instagram e no Threads.',
    headlineWithoutSharing: 'Sem compartilhar',
    headlinePassword: 'sua senha.',
    subhead: 'A ferramenta gratuita lê seu export oficial do Instagram ou do Threads inteiramente no seu navegador, então sua senha e dados da conta nunca saem do seu dispositivo.',
    dropIdleTitle: 'Tem seu ZIP do Instagram ou do Threads? Envie aqui.',
    dropDraggingTitle: 'Solte aqui.',
    dropIdleBody: 'O ZIP que a Meta te envia por email após o pedido. Não descompacte.',
    chooseFile: 'Escolher arquivo',
    orDropAnywhere: 'ou solte em qualquer lugar',
    noExportYetLink: 'Ainda não tem? Veja como solicitar seu export →',
    alreadyUsingLink: 'Já usa o WhoUnfollowed? Ver histórico de snapshots →',
    parsingTitle: 'Lendo seus dados',
    parsingNote: 'Fica no seu dispositivo. Nada é enviado.',
    errorTitle: 'Algo deu errado.',
    tryAgain: 'Tentar novamente',
    guideCtaMissingData: 'Me mostre o que selecionar no export',
    guideCtaDefault: 'Me mostre a configuração correta',
    combinedExport: {
      title: 'Este ZIP tem dados do Instagram e do Threads.',
      body: 'Estamos mostrando os resultados do Instagram. Para ver o Threads, solicite um export separado com apenas o seu perfil do Threads selecionado e envie esse ZIP sozinho.',
      continueCta: 'Entendi, ver Instagram',
    },
    deltaWarning: DELTA_WARNING_PT,
    largeFile: {
      title: 'Este ZIP é grande demais para abrir aqui.',
      body: 'Seu export tem {size}, provavelmente porque inclui suas fotos e vídeos. O navegador precisa ler o arquivo inteiro de uma vez, e celulares costumam ficar sem memória e fechar a aba. Solicite um novo export só com Seguidores e Seguindo selecionado: ele tem poucos MB.',
      smallerCta: 'Me mostre como conseguir um export menor',
      continueCta: 'Tentar este arquivo mesmo assim',
      cancelCta: 'Cancelar',
    },
    upgradeDialog: {
      eyebrow: 'Limite do plano grátis',
      title: 'Você já salvou um snapshot',
      body: 'O plano grátis guarda 1 snapshot no seu dispositivo. Apague o atual para salvar este envio, ou assine o Pro para ter histórico ilimitado.',
      oldestLabel: 'Snapshot mais antigo',
      deleteCta: 'Apagar o mais antigo e salvar este envio',
      upgradeCta: 'Assinar Pro',
      close: 'Fechar',
    },
    errors: {
      unzippedFile: 'Este é um arquivo de dentro do seu export, não o ZIP em si. No Mac, o Safari descompacta os downloads automaticamente: envie o .zip original da sua pasta Downloads, ou clique com o botão direito na pasta descompactada e escolha Comprimir para criar um novo ZIP.',
      missingData: 'Este ZIP não inclui suas listas de seguidores e seguindo (a pasta connections/followers_and_following). Solicite um novo export com Seguidores e Seguindo selecionado. Se o seu export veio em várias partes, envie a parte que contém essa pasta.',
      missingThreadsData: 'Este export do Threads não tem sua lista de seguidores ou seguindo. Solicite um novo export com Seguidores e seguindo selecionado, em formato JSON.',
      mixedFormat: 'Este export mistura arquivos JSON e HTML. Solicite a versão JSON de novo e envie o ZIP.',
      invalidZip: 'Não conseguimos ler este ZIP. Baixe o arquivo original novamente e envie sem descompactar.',
      schemaChanged: 'A Meta pode ter mudado o formato do export, então não conseguimos ler parte deste arquivo. Tente solicitar um export novo.',
      unsupportedFormat: 'Envie o arquivo ZIP original fornecido pelo Instagram ou pelo Threads.',
      fileRead: 'Seu navegador não conseguiu ler este arquivo. Se ele estiver sincronizado com iCloud, Google Drive ou outro serviço em nuvem, verifique se o download foi concluído no seu dispositivo e tente novamente.',
      unknown: 'Algo deu errado. Confira se você enviou o ZIP correto do Instagram ou do Threads.',
    },
    trustOpenSourcePrefix: 'código aberto,',
    trustOpenSourceSuffix: 'grátis para sempre',
    trustNoLoginPrefix: 'sem senha,',
    trustNoLoginSuffix: 'sem risco',
    trustNothingStoredPrefix: 'nada é guardado,',
    trustNothingStoredSuffix: 'nada é compartilhado',
    statAnalyses: 'Análises feitas',
    statAvgNonFollowers: 'Média não-seguidores',
    statPasswords: 'Senhas compartilhadas',
  },
  whatYouGet: {
    eyebrow: 'O QUE VOCÊ GANHA',
    card1Eyebrow: 'Hoje · um export',
    card1Title: 'Veja quem não te segue de volta',
    card1Body: 'Encontre cada conta que você segue e que não te segue atualmente.',
    card2Eyebrow: 'Com o tempo · snapshots',
    card2Title: 'Veja quem deixou de te seguir',
    card2Body: 'Guarde um snapshot, envie outro export depois e compare o que mudou.',
    trustLine: 'Sem senha. Sem conexão de conta. Seu ZIP é processado localmente neste navegador.',
  },
  marquee: [
    'veja quem não te segue de volta',
    'sem necessidade de login',
    'roda no seu navegador',
    'código aberto',
    'instagram e threads',
    'seus dados continuam seus',
  ],
  value: {
    eyebrow: 'RESULTADOS',
    headlineLine1: '2 segundos para processar.',
    headlineLine2: 'Uma visão completa para agir.',
    body: 'Solte o ZIP. Seu navegador o lê localmente e te dá a lista exata de quem não te segue de volta, uma pontuação de saúde Radar e uma linha do tempo de crescimento. Nada sai do seu dispositivo.',
    panelAccountHealth: 'Radar · Saúde da Conta',
    panelAccountHealthDesc: 'O Radar é sua pontuação de saúde de conta: quantos seguidores continuam, há quanto tempo te seguem e como está sua tendência de crescimento.',
    panelResults: 'Resultados · Não-seguidores',
    panelCompare: 'Radar · Comparar',
    panelCompareDesc: 'Comparar mostra a diferença entre dois snapshots: exatamente quem deixou de te seguir e quem é novo, entre o export que você enviou antes e este.',
    statParseTime: 'Tempo de processamento',
    statParseTimeNote: 'no seu navegador',
    statDataLeaves: 'Dados que saem do dispositivo',
    statDataLeavesNote: 'nada é enviado',
    statApiCalls: 'Chamadas à API da Meta',
    statApiCallsNote: 'usa seu próprio export',
  },
  flow: {
    eyebrow: 'COMO FUNCIONA',
    headlinePrefix: '30 segundos para solicitar.',
    headlineSuffix: 'Minutos para receber. 2 segundos para processar.',
    step1Title: 'Solicite seu export',
    step1Body: 'No Instagram ou no Threads: Central de contas → Suas informações e permissões → Exportar suas informações → Criar export.',
    step1Eta: '~30 seg',
    step2Title: 'Escolha estas configurações',
    step2Eta: 'poucos min',
    step2Items: [
      'Selecione um perfil: Instagram ou Threads (um export para cada)',
      'Escolha Seguidores e seguindo',
      'Defina o período como Todo o período',
      'Escolha o formato JSON (recomendado, mantém as marcas de tempo)',
      'Escolha Exportar para o dispositivo',
    ],
    step3Title: 'Baixe e envie o ZIP',
    step3Body: 'A Meta envia um link de download por email. Baixe o ZIP e envie aqui sem descompactar.',
    step3Eta: '~2 seg',
    waitNote: 'A Meta pode levar alguns minutos para preparar o download. Quando chegar, volte e envie o ZIP.',
    notSure: 'Não sabe como conseguir seu export?',
    guideCta: 'Guia passo a passo',
  },
  compare: {
    eyebrow: 'PRIVACIDADE',
    headlineLine1: 'Toda outra ferramenta',
    headlineStrikethrough: 'pede sua senha.',
    subheadItalic: 'Você não deveria precisar entregar sua senha.',
    body: 'A maioria dos serviços de rastreamento de seguidores exige conectar sua conta do Instagram ou do Threads. O WhoUnfollowed funciona diferente: você envia o export de dados que a Meta te fornece, e ele é processado localmente no seu navegador.',
    usTag: 'WhoUnfollowed',
    usTitle: 'Seus dados, seu dispositivo.',
    usItems: [
      'Você envia seu próprio export de dados, nunca sua senha',
      'O ZIP é processado na aba do seu navegador',
      'Sem conta, sem email, sem cadastro',
      'App inteiramente de código aberto · app web AGPL-3.0, parser MPL-2.0',
      'Construído sobre o export de dados que a Meta oferece sob o RGPD',
    ],
    themTag: 'TODOS OS OUTROS',
    themTitle: 'Transação de refém.',
    themItems: [
      'Exige seu usuário e senha',
      'Guarda suas credenciais e todo o grafo da sua conta',
      'Exige cadastro e muitas vezes pagamento',
      'Código fechado · você confia na palavra deles',
      'Viola os termos · contas são sinalizadas ou banidas',
    ],
  },
  pricingTeaser: {
    eyebrow: 'PREÇOS',
    headlineLine1: 'Grátis é a resposta',
    headlineLine2: 'para quase todo mundo.',
    monthlyLabel: '30 dias',
    yearlyLabel: '365 dias',
    freeBadge: 'Grátis para sempre',
    freeNoSignup: 'sem necessidade de cadastro',
    freeBullets: ['Funciona com Instagram e Threads', 'Um snapshot por vez', 'Lista completa de quem não te segue', 'Exportar CSV', 'Sem necessidade de conta'],
    freeCta: 'Usar grátis',
    proBadge: 'Pro',
    oneTime: 'pagamento único',
    proDescMonthly: 'libera o Pro por 30 dias',
    proDescYearlyTemplate: 'libera o Pro por 365 dias · economize {pct}%',
    proBullets: [
      'Tudo do plano Grátis',
      'Histórico ilimitado de snapshots',
      'Radar: uma pontuação de saúde de conta mais há quanto tempo cada seguidor permanece',
      'Compare dois snapshots quaisquer para ver exatamente quem deixou de te seguir',
      'Gráficos de crescimento de seguidores',
      'Triagem: marque não-seguidores para remover, colocar na lista branca ou deixar para depois',
      'Sincronização na nuvem entre seus dispositivos',
    ],
    proCta: 'Ver tudo do Pro',
    mobileBadge: 'App Móvel',
    mobileSoon: 'Em breve',
    mobileIncludedWithPro: 'Incluído com o Pro',
    mobileQuote: '"Seu Radar completo, no seu bolso. Sem precisar de navegador."',
    mobileBullets: ['Tudo do Pro', 'iOS e Android nativos', 'Funciona offline', 'Compartilhe resultados como imagem'],
    mobileEmailPlaceholder: 'seu@email.com',
    mobileNotifyButton: 'Avise-me no lançamento',
    mobileOnTheList: 'Você está na lista.',
    mobileError: 'Algo deu errado. Tente novamente.',
    freeTab: 'Grátis',
    proTab: 'Pro',
    mobileTab: 'Móvel',
    paymentNotes: ['Checkout via Stripe', 'Compatível com SCA', 'IVA da UE incluído'],
    learnMore: 'Mais informações sobre o Pro →',
    lifetimeBanner: { badge: 'Membro Fundador', text: 'Pague $19.99 uma vez e mantenha o Pro para sempre. Disponível por tempo limitado para apoiar um produto independente.', cta: 'Ver a oferta Lifetime' },
  },
  faq: {
    eyebrow: 'PERGUNTAS',
    headlineLine1: 'As respostas',
    headlineLine2: 'honestas.',
    intro: 'Não as de marketing. Se algo aqui não responder o que você realmente quer saber, o link de contato é real.',
    stillWondering: 'Ainda com dúvidas?',
    emailUs: 'Envie um email.',
    categories: { privacy: 'Privacidade e dados', product: 'Como funciona', billing: 'Planos e pagamento' },
    items: {
      privacy: [
        ['Preciso dar minha senha do Instagram ou do Threads?',
         'Não. O WhoUnfollowed não tem login do Instagram nem do Threads. Você envia seu próprio export de dados, um arquivo ZIP que a Meta te envia por email quando solicitado. Sua senha nunca está envolvida.'],
        ['Para onde vão meus dados depois que eu envio?',
         'No plano Grátis, para lugar nenhum. O ZIP é lido por JavaScript dentro da aba do seu navegador e descartado quando você fecha a página. No Pro, os snapshots que você escolhe salvar ficam armazenados criptografados na nossa nuvem para você comparar entre dispositivos.'],
        ['O Instagram ou o Threads vão me banir por usar isso?',
         'Não. O export de dados é um recurso que a Meta oferece nos dois apps para cumprir o RGPD. Você está usando a ferramenta oficial deles, não fazendo scraping da API nem violando nenhum termo.'],
        ['Se eu deixar de seguir alguém, a pessoa vai saber?',
         'Nenhuma notificação é enviada em nenhum dos sentidos. Nem o Instagram nem o Threads avisam alguém que deixou de ser seguido, nem avisam você quando alguém deixa de te seguir. A única forma real de saber é comparar sua lista de seguidores antes e depois, que é exatamente para isso que esta ferramenta serve.'],
      ],
      product: [
        ['Quão precisos são os resultados?',
         'Exatos. Comparamos diretamente sua lista de Seguidores com sua lista de Seguindo. Se um usuário aparece em uma e não na outra, essa é a verdade, não uma estimativa ou probabilidade.'],
        ['Posso acompanhar mudanças ao longo do tempo?',
         'Sim, no Pro. Cada envio se torna um snapshot. Você pode comparar dois snapshots quaisquer para ver quem começou a seguir, quem deixou de seguir e quem voltou silenciosamente.'],
        ['Qual formato de arquivo vocês precisam?',
         'O arquivo ZIP que o Instagram ou o Threads te envia quando você solicita seus dados. Peça apenas seguidores e seguindo, você não precisa do arquivo inteiro.'],
        ['Funciona com o Threads?',
         'Sim. Solicite um export do Threads do mesmo jeito, em formato JSON, e envie separado. Os snapshots do Threads e do Instagram ficam separados, então você recebe sua lista de quem não te segue no Threads e, no Pro, também histórico e Radar do Threads.'],
        ['O código é aberto?',
         'Sim. O app web tem licença AGPL-3.0 e o parser MPL-2.0, ambos públicos no GitHub. Você não precisa confiar cegamente numa promessa de privacidade, pode ler exatamente o que o código faz com seus dados.'],
      ],
      billing: [
        ['Quanto custa o Pro?',
         'O Pro é um pagamento único: {price}. Sem cobrança recorrente, sem renovação automática. O plano grátis continua grátis e não precisa de conta. Você tem sua lista completa de não-seguidores, mútuos e fãs toda vez que envia um export. O Pro adiciona histórico de snapshots salvo, gráficos de crescimento, detecção de seguidores fantasma e sincronização criptografada na nuvem entre seus dispositivos.'],
        ['O que acontece quando meu desbloqueio Pro acaba?',
         'Você volta automaticamente para o plano grátis, sem cobrança, sem nada para cancelar. Seus snapshots salvos continuam exportando para CSV quando você quiser. Compre outro desbloqueio quando quiser ter o Pro de novo.'],
      ],
    },
  },
};

export function getHomeContent(locale: AppLocale): HomeContent {
  if (locale === 'es') return ES;
  if (locale === 'pt') return PT;
  return EN;
}
