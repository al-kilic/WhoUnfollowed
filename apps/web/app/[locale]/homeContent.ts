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
    dropDateRange: string;
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
      // Loose files picked from an unzipped export, but not both lists.
      pickBoth: string;
      missingData: string;
      // The following list is there but the followers file is not (weekly report, Nov 2026).
      missingFollowers: string;
      missingThreadsData: string;
      missingTikTokData: string;
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
    videoTitle: string;
    videoBody: string;
    videoMeta: string[];
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
    freeBadge: string;
    freeNoSignup: string;
    freeBullets: string[];
    freeCta: string;
    proBadge: string;
    perMonthLabel: string;
    perYearLabel: string;
    proDescMonthly: string;
    proDescYearlyTemplate: string;
    proBullets: string[];
    proCta: string;
    paymentNotes: string[];
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
    headlineOnInstagram: 'on Instagram, Threads & TikTok.',
    headlineWithoutSharing: 'Without sharing',
    headlinePassword: 'your password.',
    subhead: 'The free tool reads your official Instagram, Threads or TikTok data export entirely in your browser, so your password and account data never leave your device.',
    dropIdleTitle: 'Have your Instagram, Threads or TikTok export? Upload it here.',
    dropDraggingTitle: 'Drop it here.',
    dropIdleBody: 'The file Instagram, Threads or TikTok gives you, as it is. Do not unzip it.',
    dropDateRange: 'Instagram and Threads: the export needs the date range set to All time, or your lists come out incomplete.',
    chooseFile: 'Choose file',
    orDropAnywhere: 'or drop it here',
    noExportYetLink: "Don't have it yet? See how to request your export →",
    alreadyUsingLink: 'Already using WhoUnfollowed? View snapshot history →',
    parsingTitle: 'Reading your data',
    parsingNote: 'Stays on your device. Nothing is uploaded.',
    errorTitle: 'Something went wrong.',
    tryAgain: 'Try again',
    guideCtaMissingData: 'Show me what to select in the export',
    guideCtaDefault: 'Show me the correct export settings',
    combinedExport: {
      title: 'We could not read the Threads part of this ZIP.',
      body: 'Your Instagram results are ready. To see Threads too, request a new export with your Threads profile selected and Followers and following ticked, then upload it.',
      continueCta: 'Got it, show Instagram',
    },
    deltaWarning: DELTA_WARNING_EN,
    largeFile: {
      title: 'This ZIP is very large.',
      body: 'Your export is {size}, probably because it includes your photos and videos. It usually still works, but files this big can be slow or fail on some phones. A new export with only Followers and Following selected is just a few MB.',
      smallerCta: 'Show me how to get a smaller export',
      continueCta: 'Try this file anyway',
      cancelCta: 'Cancel',
    },
    upgradeDialog: {
      eyebrow: 'Free plan limit reached',
      title: "You've already saved a snapshot",
      body: 'Without an account, 1 export is saved on this device; a free account keeps 2. Delete one to save this upload, or upgrade to Pro AI to keep every export.',
      oldestLabel: 'Oldest snapshot',
      deleteCta: 'Delete oldest & save new upload',
      upgradeCta: 'Upgrade to Pro AI',
      close: 'Close',
    },
    errors: {
      unzippedFile: 'This is a file from inside your export, not the ZIP itself. Upload the original .zip, drop the whole unzipped folder here, or open connections > followers_and_following and pick followers_1.json and following.json together.',
      pickBoth: 'Pick both lists together: followers_1.json and following.json, from connections > followers_and_following in your unzipped export. Or drop the whole folder here.',
      missingFollowers: 'This export has your following list but no followers file, so there is nothing to compare yet. If the account has followers, request the export again: Followers and following, All time, JSON. If nobody follows it yet, that is why the file is missing.',
      missingData: 'This ZIP does not include your followers and following lists (the connections/followers_and_following folder). Request a new export with Followers and Following selected. If your export came in several parts, upload the part that contains that folder.',
      missingThreadsData: 'This Threads export is missing your followers or following list. Request a new export with Followers and following selected, in JSON format.',
      missingTikTokData: 'This TikTok file has no follower or following list. Request your data again with All data (or your activity) included, in JSON format.',
      mixedFormat: 'This export mixes JSON and HTML files. Please request the JSON version again, then upload the ZIP.',
      invalidZip: 'We could not read this ZIP. Download the original file again and upload it without unzipping it.',
      schemaChanged: 'Meta may have changed the export format, so we could not read part of this file. Try requesting a fresh export.',
      unsupportedFormat: 'Please upload the original file Instagram, Threads or TikTok provided.',
      fileRead: 'Your browser could not read this file. If it is synced via iCloud, Google Drive, or another cloud service, make sure it has fully downloaded to your device, then try again.',
      unknown: 'Something went wrong. Make sure you uploaded the correct Instagram, Threads or TikTok file.',
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
    body: 'Drop the ZIP. Your browser reads it locally and gives you the exact list of who does not follow you back, a Radar with what to fix first, and a growth timeline. Nothing leaves your device.',
    panelAccountHealth: 'Radar · Account Health',
    panelAccountHealthDesc: "Radar is your account at a glance: a one-line summary, things you didn't know from your own export, your verdict, and what to fix first.",
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
    videoTitle: 'Watch the whole export in 68 seconds.',
    videoBody: 'Every screen in Meta Accounts Center, in order, from opening it to the download email. Press play, or jump straight to the step you are stuck on.',
    videoMeta: ['68 sec', 'No sound', '6 steps'],
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
    freeBadge: 'Free forever',
    freeNoSignup: 'no sign up required',
    freeBullets: ['Works with Instagram, Threads and TikTok', 'One snapshot at a time', 'Full non-followers list', 'CSV export', 'No account needed'],
    freeCta: 'Use it free',
    proBadge: 'Pro AI',
    perMonthLabel: 'a month',
    perYearLabel: 'a year',
    proDescMonthly: 'cancel any time',
    proDescYearlyTemplate: 'billed yearly · save {pct}%',
    proBullets: [
      'Everything in Free',
      'A coach that remembers your account',
      'Drafts hooks, captions and Reel scripts in your voice',
      'Checks a post before you share it, with fixes',
      'A 30-day post plan for your niche',
      'See exactly who unfollowed you, with every export kept',
      'Radar and cloud sync across your devices',
    ],
    proCta: 'See everything in Pro AI',
    paymentNotes: ['Stripe checkout', 'SCA compliant'],
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
        ['Do I need to give you my Instagram, Threads or TikTok password?',
         'No. There is no Instagram, Threads or TikTok login on WhoUnfollowed. You upload your own data export, the file the app gives you when you request your data. Your password is never involved.'],
        ['Where does my data go after I upload it?',
         "On the Free plan, nowhere. The ZIP is read by JavaScript inside your browser tab and discarded when you close the page. On Pro AI, snapshots you choose to save are stored encrypted in our cloud so you can compare them across devices."],
        ['Will Instagram, Threads or TikTok ban me for using this?',
         "No. The data export is a feature Meta and TikTok offer to comply with privacy laws like GDPR. You're using their official tool, not scraping their API or violating any terms."],
        ['If I unfollow someone, will they know?',
         "No notification is sent either way. Instagram, Threads and TikTok don't tell someone they've been unfollowed, or tell you when someone unfollows you. The only way to actually know is to compare your follower list before and after, which is what this tool is for."],
        ['What emails will you send me?',
         "Only the ones you ask for. If you leave your email, you get a reminder to download a fresh export (after 14 days, then monthly while you still open them) and a short note every 3 months when your wrap is ready. If you set up an unfollow plan, you get its nudges too. On Pro AI you also get a weekly brief, which you can turn off in Settings. One unsubscribe link stops the reminders and wraps. We store your email address, never your follower lists."],
      ],
      product: [
        ['How accurate are the results?',
         "Exact. We compare your Followers list against your Following list directly. If a username appears in one and not the other, that is the truth, not an estimate or a probability."],
        ["Why does my list show accounts I can't open on Instagram?",
         "The account is most likely deactivated, deleted, or suspended. Meta still includes it in your export: it keeps the follow on record for deactivated accounts, waits 30 days before removing deleted ones, and doesn't always remove suspended or banned accounts. So nothing is wrong with your account, your export, or our parser. On the results page you can mark these as Deactivated to move them out of your list."],
        ['Can I track changes over time?',
         "Yes. Each upload becomes a snapshot. Without an account you keep one, a free account keeps two, and Pro AI keeps every export, so you can compare any two to see who started following, who unfollowed, and who quietly came back."],
        ['What file format do you need?',
         "The file Instagram, Threads or TikTok gives you when you request your data, as it is. For Instagram and Threads that's a ZIP: just request followers and following in JSON, you don't need the whole archive. For TikTok, the ZIP or JSON file both work."],
        ['Does it work with Threads?',
         'Yes. Request a Threads export the same way, in JSON format, and upload it. If one ZIP holds both Instagram and Threads, both are read from it. Follower lists, history, Radar, goals and the coach read work on every platform; writing, post checks, plans and photo insights are built for Instagram posts. Threads and Instagram snapshots are kept separate, so you get a Threads non-followers list and, on Pro AI, Threads history and Radar too.'],
        ['Does it work with TikTok?',
         "Yes. In TikTok go to Settings and privacy, Account, Download your data, pick JSON and request it. When it's ready, upload the file here as it is. TikTok snapshots are kept apart from Instagram and Threads."],
        ['What are the Radar and the 3-month wrap?',
         "The Radar is your dashboard. It opens with an overview: counts, a few curiosities from your data and your account's verdict, free for everyone. Every 3 months of exports it also plays a short wrap: new followers, your best week, mutuals, who followed back. Both show counts only. The names behind them, and the full Radar checks, are Pro AI."],
        ['Is the code open source?',
         "Yes. The web app is AGPL-3.0 licensed and the parser is MPL-2.0, both public on GitHub. You don't have to take a privacy claim on faith, you can read exactly what the code does with your data."],
      ],
      billing: [
        ['How much does Pro AI cost?',
         'Pro AI is {price}, and you can cancel any time. The free plan stays free and needs no account. You get your full non-followers list, mutuals, and fans every time you upload. Everyone also gets the Radar overview and the 3-month wrap. Pro AI adds a coach that remembers your account, drafts posts in your voice and checks them before you share, plus the names behind every change, saved snapshot history, growth charts, and encrypted cloud sync across your devices.'],
        ['Is there a limit on the coach?',
         'Yes, a generous monthly one that most people never reach. Asking, drafts, post checks and plans all come from the same monthly use, and a short question uses much less than a long post check. If you reach it, it resets with your plan, or you can refill a full month for half price.'],
        ['What happens if I cancel?',
         'You keep Pro AI until the end of the period you paid for, then drop back to the free plan. Nothing else to cancel, and your saved snapshots still export to CSV whenever you want.'],
        ['I bought the old Pro unlock. What now?',
         'You keep Pro until it runs out, plus a gift of coach use to try it, on us. It never expires. Upgrading to Pro AI is optional.'],
      ],
    },
  },
};

const ES: HomeContent = {
  hero: {
    headlineSeeWho: 'Descubre quién',
    headlineDoesntFollowBack: 'no te sigue de vuelta',
    headlineOnInstagram: 'en Instagram, Threads y TikTok.',
    headlineWithoutSharing: 'Sin compartir',
    headlinePassword: 'tu contraseña.',
    subhead: 'La herramienta gratuita lee tu export oficial de Instagram, Threads o TikTok por completo en tu navegador, así que tu contraseña y datos de cuenta nunca salen de tu dispositivo.',
    dropIdleTitle: '¿Tienes tu export de Instagram, Threads o TikTok? Súbelo aquí.',
    dropDraggingTitle: 'Suéltalo aquí.',
    dropIdleBody: 'El archivo que te da Instagram, Threads o TikTok, tal cual. No lo descomprimas.',
    dropDateRange: 'Instagram y Threads: la exportación necesita el rango de fechas en Todo el tiempo, o tus listas salen incompletas.',
    chooseFile: 'Elegir archivo',
    orDropAnywhere: 'o suéltalo aquí',
    noExportYetLink: '¿Aún no lo tienes? Mira cómo solicitar tu export →',
    alreadyUsingLink: '¿Ya usas WhoUnfollowed? Ver historial de snapshots →',
    parsingTitle: 'Leyendo tus datos',
    parsingNote: 'Se queda en tu dispositivo. Nada se sube.',
    errorTitle: 'Algo salió mal.',
    tryAgain: 'Intentar de nuevo',
    guideCtaMissingData: 'Muéstrame qué seleccionar en el export',
    guideCtaDefault: 'Muéstrame la configuración correcta',
    combinedExport: {
      title: 'No pudimos leer la parte de Threads de este ZIP.',
      body: 'Tus resultados de Instagram están listos. Para ver Threads también, solicita un export nuevo con tu perfil de Threads seleccionado y Seguidores y seguidos marcado, y súbelo.',
      continueCta: 'Entendido, ver Instagram',
    },
    deltaWarning: DELTA_WARNING_ES,
    largeFile: {
      title: 'Este ZIP es muy grande.',
      body: 'Tu export pesa {size}, seguramente porque incluye tus fotos y videos. Suele funcionar igual, pero archivos tan grandes pueden ir lentos o fallar en algunos teléfonos. Un export nuevo con solo Seguidores y Seguidos pesa unos pocos MB.',
      smallerCta: 'Muéstrame cómo obtener un export más pequeño',
      continueCta: 'Probar este archivo igual',
      cancelCta: 'Cancelar',
    },
    upgradeDialog: {
      eyebrow: 'Límite del plan gratis',
      title: 'Ya guardaste un snapshot',
      body: 'Sin cuenta se guarda 1 exportación en este dispositivo; una cuenta gratis guarda 2. Borra una para guardar esta subida, o pásate a Pro AI para guardar todas.',
      oldestLabel: 'Snapshot más antiguo',
      deleteCta: 'Borrar el más antiguo y guardar esta subida',
      upgradeCta: 'Pasar a Pro AI',
      close: 'Cerrar',
    },
    errors: {
      unzippedFile: 'Este es un archivo de dentro de tu export, no el ZIP en sí. Sube el .zip original, suelta aquí toda la carpeta descomprimida, o abre connections > followers_and_following y elige followers_1.json y following.json juntos.',
      pickBoth: 'Elige las dos listas juntas: followers_1.json y following.json, de connections > followers_and_following en tu export descomprimido. O suelta aquí toda la carpeta.',
      missingFollowers: 'Este export tiene tu lista de seguidos pero no el archivo de seguidores, así que todavía no hay nada que comparar. Si la cuenta tiene seguidores, solicita el export otra vez: Seguidores y seguidos, Desde siempre, JSON. Si nadie la sigue todavía, por eso falta el archivo.',
      missingData: 'Este ZIP no incluye tus listas de seguidores y seguidos (la carpeta connections/followers_and_following). Solicita un export nuevo con Seguidores y Seguidos seleccionado. Si tu export llegó en varias partes, sube la parte que contiene esa carpeta.',
      missingThreadsData: 'A este export de Threads le falta tu lista de seguidores o seguidos. Solicita un export nuevo con Seguidores y seguidos seleccionado, en formato JSON.',
      missingTikTokData: 'Este archivo de TikTok no tiene tu lista de seguidores ni de seguidos. Vuelve a pedir tus datos con Todos los datos (o tu actividad) incluidos, en formato JSON.',
      mixedFormat: 'Este export mezcla archivos JSON y HTML. Vuelve a solicitar la versión JSON y sube el ZIP.',
      invalidZip: 'No pudimos leer este ZIP. Descarga de nuevo el archivo original y súbelo sin descomprimirlo.',
      schemaChanged: 'Es posible que Meta haya cambiado el formato del export, así que no pudimos leer parte de este archivo. Intenta solicitar un export nuevo.',
      unsupportedFormat: 'Sube el archivo original que te dio Instagram, Threads o TikTok.',
      fileRead: 'Tu navegador no pudo leer este archivo. Si se sincroniza con iCloud, Google Drive u otro servicio en la nube, asegúrate de que se haya descargado por completo en tu dispositivo y vuelve a intentarlo.',
      unknown: 'Algo salió mal. Asegúrate de haber subido el archivo correcto de Instagram, Threads o TikTok.',
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
    body: 'Suelta el ZIP. Tu navegador lo lee localmente y te da la lista exacta de quién no te sigue de vuelta, un Radar con lo que conviene arreglar primero y una línea de tiempo de crecimiento. Nada sale de tu dispositivo.',
    panelAccountHealth: 'Radar · Salud de la Cuenta',
    panelAccountHealthDesc: 'Radar es tu cuenta de un vistazo: un resumen en una línea, cosas que no sabías de tu propia exportación, tu veredicto y qué arreglar primero.',
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
    videoTitle: 'Mira todo el export en 68 segundos.',
    videoBody: 'Cada pantalla del Centro de cuentas de Meta, en orden, desde que lo abres hasta el correo de descarga. Dale a reproducir o salta directo al paso en el que te atascaste.',
    videoMeta: ['68 seg', 'Sin sonido', '6 pasos', 'Texto en inglés'],
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
    freeBadge: 'Gratis para siempre',
    freeNoSignup: 'sin necesidad de registrarte',
    freeBullets: ['Funciona con Instagram, Threads y TikTok', 'Un snapshot a la vez', 'Lista completa de quienes no te siguen', 'Exportar a CSV', 'Sin cuenta necesaria'],
    freeCta: 'Usarlo gratis',
    proBadge: 'Pro AI',
    perMonthLabel: 'al mes',
    perYearLabel: 'al año',
    proDescMonthly: 'cancela cuando quieras',
    proDescYearlyTemplate: 'pago anual · ahorra {pct}%',
    proBullets: [
      'Todo lo del plan Gratis',
      'Un coach que recuerda tu cuenta',
      'Escribe ganchos, textos y guiones de Reels con tu voz',
      'Revisa un post antes de publicarlo, con arreglos',
      'Un plan de publicaciones de 30 días para tu nicho',
      'Mira exactamente quién te dejó de seguir, con cada exportación guardada',
      'Radar y sincronización entre tus dispositivos',
    ],
    proCta: 'Ver todo lo de Pro AI',
    paymentNotes: ['Pago con Stripe', 'Cumple con SCA'],
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
        ['¿Tengo que darles mi contraseña de Instagram, Threads o TikTok?',
         'No. WhoUnfollowed no tiene inicio de sesión de Instagram, Threads ni TikTok. Subes tu propio export de datos, el archivo que la app te da cuando lo solicitas. Tu contraseña nunca está involucrada.'],
        ['¿A dónde van mis datos después de subirlos?',
         'En el plan Gratis, a ninguna parte. El ZIP se lee con JavaScript dentro de la pestaña de tu navegador y se descarta al cerrar la página. En Pro AI, los snapshots que decides guardar se almacenan cifrados en nuestra nube para que puedas compararlos entre dispositivos.'],
        ['¿Instagram, Threads o TikTok me bloquearán por usar esto?',
         'No. El export de datos es una función que Meta y TikTok ofrecen para cumplir leyes de privacidad como el RGPD. Estás usando su herramienta oficial, no raspando su API ni violando ningún término.'],
        ['Si dejo de seguir a alguien, ¿se enterará?',
         'No se envía ninguna notificación en ningún sentido. Ni Instagram, ni Threads, ni TikTok le dicen a alguien que lo dejaste de seguir, ni te avisan cuando alguien te deja de seguir. La única forma de saberlo de verdad es comparar tu lista de seguidores antes y después, que es exactamente para lo que sirve esta herramienta.'],
        ['¿Qué correos me van a enviar?',
         'Solo los que pidas. Si dejas tu email, recibes un recordatorio para descargar un export nuevo (a los 14 días y luego cada mes mientras los sigas abriendo) y un aviso corto cada 3 meses cuando tu resumen está listo. Si creas un plan de unfollows, también recibes sus avisos. En Pro AI también recibes un resumen semanal, que puedes desactivar en Ajustes. Un solo enlace para darte de baja detiene los recordatorios y los resúmenes. Guardamos tu email, nunca tus listas de seguidores.'],
      ],
      product: [
        ['¿Qué tan precisos son los resultados?',
         'Exactos. Comparamos directamente tu lista de Seguidores contra tu lista de Seguidos. Si un usuario aparece en una y no en la otra, esa es la verdad, no una estimación ni una probabilidad.'],
        ["¿Por qué mi lista muestra cuentas que no puedo abrir en Instagram?",
         "Lo más probable es que la cuenta esté desactivada, eliminada o suspendida. Meta la sigue incluyendo en tu exportación: guarda el seguimiento de las cuentas desactivadas, espera 30 días antes de quitar las eliminadas y no siempre quita las cuentas suspendidas o bloqueadas. Así que no pasa nada malo con tu cuenta, tu exportación ni nuestro parser. En la página de resultados puedes marcarlas como Desactivada para sacarlas de tu lista."],
        ['¿Puedo hacer seguimiento de cambios con el tiempo?',
         'Sí. Cada subida se convierte en un snapshot. Sin cuenta guardas uno, una cuenta gratis guarda dos y Pro AI guarda cada export, así que puedes comparar dos cualquiera para ver quién empezó a seguirte, quién dejó de seguirte y quién volvió en silencio.'],
        ['¿Qué formato de archivo necesitan?',
         'El archivo que Instagram, Threads o TikTok te da cuando solicitas tus datos, tal cual. En Instagram y Threads es un ZIP: solo pide seguidores y seguidos en JSON, no necesitas el archivo completo. En TikTok sirven el ZIP o el JSON.'],
        ['¿Funciona con Threads?',
         'Sí. Solicita un export de Threads de la misma forma, en formato JSON, y súbelo. Si un ZIP tiene Instagram y Threads, se leen los dos. Las listas de seguidores, el historial, el Radar, los objetivos y la lectura del coach funcionan en todas las plataformas; escribir, revisar posts, los planes y el análisis de fotos están pensados para posts de Instagram. Los snapshots de Threads e Instagram se mantienen aparte, así que obtienes tu lista de no seguidores de Threads y, en Pro AI, también historial y Radar de Threads.'],
        ['¿Funciona con TikTok?',
         'Sí. En TikTok ve a Ajustes y privacidad, Cuenta, Descargar tus datos, elige JSON y solicítalos. Cuando estén listos, sube el archivo aquí tal cual. Los snapshots de TikTok se guardan aparte de Instagram y Threads.'],
        ['¿Qué son el Radar y el resumen de 3 meses?',
         'El Radar es tu panel. Empieza con un resumen: cifras, algunas curiosidades de tus datos y el veredicto de tu cuenta, gratis para todos. Cada 3 meses de exports también muestra un resumen corto: nuevos seguidores, tu mejor semana, mutuos y quién te siguió de vuelta. Ambos muestran solo cifras. Los nombres detrás de ellas, y todas las revisiones del Radar, son Pro AI.'],
        ['¿El código es abierto?',
         'Sí. La app web tiene licencia AGPL-3.0 y el parser MPL-2.0, ambos públicos en GitHub. No tienes que confiar a ciegas en una promesa de privacidad, puedes leer exactamente qué hace el código con tus datos.'],
      ],
      billing: [
        ['¿Cuánto cuesta Pro AI?',
         'Pro AI cuesta {price}, y puedes cancelar cuando quieras. El plan gratis sigue siendo gratis y no necesita cuenta. Obtienes tu lista completa de no-seguidores, mutuos y fans cada vez que subes un export. Todos tienen también el resumen del Radar y el resumen de 3 meses. Pro AI añade un coach que recuerda tu cuenta, escribe posts con tu voz y los revisa antes de publicarlos, además de los nombres detrás de cada cambio, historial de snapshots guardado, gráficos de crecimiento y sincronización cifrada en la nube entre tus dispositivos.'],
        ['¿El coach tiene un límite?',
         'Sí, uno mensual y generoso que la mayoría nunca alcanza. Preguntar, los borradores, las revisiones de posts y los planes salen del mismo uso mensual, y una pregunta corta usa mucho menos que una revisión larga. Si llegas al límite, se renueva con tu plan, o puedes recargar un mes completo a mitad de precio.'],
        ['¿Qué pasa si cancelo?',
         'Conservas Pro AI hasta el final del periodo que pagaste y luego vuelves al plan gratis. No hay nada más que cancelar, y tus snapshots guardados se siguen exportando a CSV cuando quieras.'],
        ['Compré el antiguo desbloqueo Pro. ¿Y ahora?',
         'Conservas Pro hasta que caduque, más un regalo de uso del coach para probarlo, por nuestra cuenta. Nunca caduca. Pasarte a Pro AI es opcional.'],
      ],
    },
  },
};

const PT: HomeContent = {
  hero: {
    headlineSeeWho: 'Veja quem',
    headlineDoesntFollowBack: 'não te segue de volta',
    headlineOnInstagram: 'no Instagram, Threads e TikTok.',
    headlineWithoutSharing: 'Sem compartilhar',
    headlinePassword: 'sua senha.',
    subhead: 'A ferramenta gratuita lê seu export oficial do Instagram, do Threads ou do TikTok inteiramente no seu navegador, então sua senha e dados da conta nunca saem do seu dispositivo.',
    dropIdleTitle: 'Tem seu export do Instagram, Threads ou TikTok? Envie aqui.',
    dropDraggingTitle: 'Solte aqui.',
    dropIdleBody: 'O arquivo que o Instagram, o Threads ou o TikTok te entrega, do jeito que veio. Não descompacte.',
    dropDateRange: 'Instagram e Threads: a exportação precisa do período em Todo o período, senão suas listas saem incompletas.',
    chooseFile: 'Escolher arquivo',
    orDropAnywhere: 'ou solte aqui',
    noExportYetLink: 'Ainda não tem? Veja como solicitar seu export →',
    alreadyUsingLink: 'Já usa o WhoUnfollowed? Ver histórico de snapshots →',
    parsingTitle: 'Lendo seus dados',
    parsingNote: 'Fica no seu dispositivo. Nada é enviado.',
    errorTitle: 'Algo deu errado.',
    tryAgain: 'Tentar novamente',
    guideCtaMissingData: 'Me mostre o que selecionar no export',
    guideCtaDefault: 'Me mostre a configuração correta',
    combinedExport: {
      title: 'Não conseguimos ler a parte do Threads deste ZIP.',
      body: 'Seus resultados do Instagram estão prontos. Para ver o Threads também, solicite um export novo com o seu perfil do Threads selecionado e Seguidores e seguindo marcado, e envie.',
      continueCta: 'Entendi, ver Instagram',
    },
    deltaWarning: DELTA_WARNING_PT,
    largeFile: {
      title: 'Este ZIP é muito grande.',
      body: 'Seu export tem {size}, provavelmente porque inclui suas fotos e vídeos. Costuma funcionar mesmo assim, mas arquivos tão grandes podem ficar lentos ou falhar em alguns celulares. Um novo export só com Seguidores e Seguindo tem poucos MB.',
      smallerCta: 'Me mostre como conseguir um export menor',
      continueCta: 'Tentar este arquivo mesmo assim',
      cancelCta: 'Cancelar',
    },
    upgradeDialog: {
      eyebrow: 'Limite do plano grátis',
      title: 'Você já salvou um snapshot',
      body: 'Sem conta, 1 exportação fica salva neste dispositivo; uma conta grátis guarda 2. Apague uma para salvar este envio, ou assine o Pro AI para guardar todas.',
      oldestLabel: 'Snapshot mais antigo',
      deleteCta: 'Apagar o mais antigo e salvar este envio',
      upgradeCta: 'Assinar o Pro AI',
      close: 'Fechar',
    },
    errors: {
      unzippedFile: 'Este é um arquivo de dentro do seu export, não o ZIP em si. Envie o .zip original, solte aqui a pasta descompactada inteira, ou abra connections > followers_and_following e escolha followers_1.json e following.json juntos.',
      pickBoth: 'Escolha as duas listas juntas: followers_1.json e following.json, em connections > followers_and_following no seu export descompactado. Ou solte aqui a pasta inteira.',
      missingFollowers: 'Este export tem sua lista de quem você segue, mas não o arquivo de seguidores, então ainda não há o que comparar. Se a conta tem seguidores, peça o export de novo: Seguidores e seguindo, Desde o início, JSON. Se ninguém segue a conta ainda, é por isso que o arquivo falta.',
      missingData: 'Este ZIP não inclui suas listas de seguidores e seguindo (a pasta connections/followers_and_following). Solicite um novo export com Seguidores e Seguindo selecionado. Se o seu export veio em várias partes, envie a parte que contém essa pasta.',
      missingThreadsData: 'Este export do Threads não tem sua lista de seguidores ou seguindo. Solicite um novo export com Seguidores e seguindo selecionado, em formato JSON.',
      missingTikTokData: 'Este arquivo do TikTok não tem sua lista de seguidores nem de seguindo. Peça seus dados de novo com Todos os dados (ou sua atividade) incluídos, em formato JSON.',
      mixedFormat: 'Este export mistura arquivos JSON e HTML. Solicite a versão JSON de novo e envie o ZIP.',
      invalidZip: 'Não conseguimos ler este ZIP. Baixe o arquivo original novamente e envie sem descompactar.',
      schemaChanged: 'A Meta pode ter mudado o formato do export, então não conseguimos ler parte deste arquivo. Tente solicitar um export novo.',
      unsupportedFormat: 'Envie o arquivo original fornecido pelo Instagram, Threads ou TikTok.',
      fileRead: 'Seu navegador não conseguiu ler este arquivo. Se ele estiver sincronizado com iCloud, Google Drive ou outro serviço em nuvem, verifique se o download foi concluído no seu dispositivo e tente novamente.',
      unknown: 'Algo deu errado. Confira se você enviou o arquivo correto do Instagram, Threads ou TikTok.',
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
    body: 'Solte o ZIP. Seu navegador o lê localmente e te dá a lista exata de quem não te segue de volta, um Radar com o que arrumar primeiro e uma linha do tempo de crescimento. Nada sai do seu dispositivo.',
    panelAccountHealth: 'Radar · Saúde da Conta',
    panelAccountHealthDesc: 'O Radar é sua conta num relance: um resumo em uma linha, coisas que você não sabia da sua própria exportação, seu veredito e o que arrumar primeiro.',
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
    videoTitle: 'Veja todo o export em 68 segundos.',
    videoBody: 'Cada tela da Central de Contas da Meta, em ordem, desde abrir até o email de download. Dê o play ou vá direto ao passo em que você travou.',
    videoMeta: ['68 s', 'Sem som', '6 passos', 'Texto em inglês'],
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
    freeBadge: 'Grátis para sempre',
    freeNoSignup: 'sem necessidade de cadastro',
    freeBullets: ['Funciona com Instagram, Threads e TikTok', 'Um snapshot por vez', 'Lista completa de quem não te segue', 'Exportar CSV', 'Sem necessidade de conta'],
    freeCta: 'Usar grátis',
    proBadge: 'Pro AI',
    perMonthLabel: 'por mês',
    perYearLabel: 'por ano',
    proDescMonthly: 'cancele quando quiser',
    proDescYearlyTemplate: 'cobrança anual · economize {pct}%',
    proBullets: [
      'Tudo do plano Grátis',
      'Um coach que lembra da sua conta',
      'Escreve ganchos, legendas e roteiros de Reels com a sua voz',
      'Checa um post antes de você publicar, com ajustes',
      'Um plano de posts de 30 dias para o seu nicho',
      'Veja exatamente quem deixou de te seguir, com cada exportação guardada',
      'Radar e sincronização entre seus aparelhos',
    ],
    proCta: 'Ver tudo do Pro AI',
    paymentNotes: ['Checkout via Stripe', 'Compatível com SCA'],
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
        ['Preciso dar minha senha do Instagram, do Threads ou do TikTok?',
         'Não. O WhoUnfollowed não tem login do Instagram, do Threads nem do TikTok. Você envia seu próprio export de dados, o arquivo que o app te entrega quando você solicita. Sua senha nunca está envolvida.'],
        ['Para onde vão meus dados depois que eu envio?',
         'No plano Grátis, para lugar nenhum. O ZIP é lido por JavaScript dentro da aba do seu navegador e descartado quando você fecha a página. No Pro AI, os snapshots que você escolhe salvar ficam armazenados criptografados na nossa nuvem para você comparar entre dispositivos.'],
        ['O Instagram, o Threads ou o TikTok vão me banir por usar isso?',
         'Não. O export de dados é um recurso que a Meta e o TikTok oferecem para cumprir leis de privacidade como o RGPD e a LGPD. Você está usando a ferramenta oficial deles, não fazendo scraping da API nem violando nenhum termo.'],
        ['Se eu deixar de seguir alguém, a pessoa vai saber?',
         'Nenhuma notificação é enviada em nenhum dos sentidos. Nem o Instagram, nem o Threads, nem o TikTok avisam alguém que deixou de ser seguido, nem avisam você quando alguém deixa de te seguir. A única forma real de saber é comparar sua lista de seguidores antes e depois, que é exatamente para isso que esta ferramenta serve.'],
        ['Quais emails vocês vão me enviar?',
         'Só os que você pedir. Se deixar seu email, você recebe um lembrete para baixar um export novo (depois de 14 dias e depois todo mês enquanto continuar abrindo) e um aviso curto a cada 3 meses quando sua retrospectiva estiver pronta. Se criar um plano de unfollows, recebe os lembretes dele também. No Pro AI você também recebe um resumo semanal, que pode desligar nas Configurações. Um único link de descadastro para os lembretes e as retrospectivas. Guardamos seu email, nunca suas listas de seguidores.'],
      ],
      product: [
        ['Quão precisos são os resultados?',
         'Exatos. Comparamos diretamente sua lista de Seguidores com sua lista de Seguindo. Se um usuário aparece em uma e não na outra, essa é a verdade, não uma estimativa ou probabilidade.'],
        ["Por que minha lista mostra contas que não consigo abrir no Instagram?",
         "A conta provavelmente foi desativada, excluída ou suspensa. A Meta ainda a inclui na sua exportação: mantém o registro do follow de contas desativadas, espera 30 dias antes de remover as excluídas e nem sempre remove contas suspensas ou banidas. Ou seja, não há nada de errado com sua conta, sua exportação ou nosso parser. Na página de resultados você pode marcá-las como Desativada para tirá-las da sua lista."],
        ['Posso acompanhar mudanças ao longo do tempo?',
         'Sim. Cada envio se torna um snapshot. Sem conta você guarda um, uma conta grátis guarda dois e o Pro AI guarda cada export, então você pode comparar dois quaisquer para ver quem começou a seguir, quem deixou de seguir e quem voltou silenciosamente.'],
        ['Qual formato de arquivo vocês precisam?',
         'O arquivo que o Instagram, o Threads ou o TikTok te entrega quando você solicita seus dados, do jeito que veio. No Instagram e no Threads é um ZIP: peça apenas seguidores e seguindo em JSON, você não precisa do arquivo inteiro. No TikTok, o ZIP ou o JSON funcionam.'],
        ['Funciona com o Threads?',
         'Sim. Solicite um export do Threads do mesmo jeito, em formato JSON, e envie. Se um ZIP tiver Instagram e Threads, os dois são lidos. As listas de seguidores, o histórico, o Radar, as metas e a leitura do coach funcionam em todas as plataformas; escrever, revisar posts, os planos e a análise de fotos foram feitos para posts do Instagram. Os snapshots do Threads e do Instagram ficam separados, então você recebe sua lista de quem não te segue no Threads e, no Pro AI, também histórico e Radar do Threads.'],
        ['Funciona com o TikTok?',
         'Sim. No TikTok vá em Configurações e privacidade, Conta, Baixar seus dados, escolha JSON e solicite. Quando ficar pronto, envie o arquivo aqui do jeito que veio. Os snapshots do TikTok ficam separados do Instagram e do Threads.'],
        ['O que são o Radar e a retrospectiva de 3 meses?',
         'O Radar é o seu painel. Ele abre com um resumo: números, algumas curiosidades dos seus dados e o veredito da sua conta, grátis para todos. A cada 3 meses de exports ele também mostra uma retrospectiva curta: novos seguidores, sua melhor semana, mútuos e quem te seguiu de volta. Os dois mostram só números. Os nomes por trás deles, e todas as verificações do Radar, são Pro AI.'],
        ['O código é aberto?',
         'Sim. O app web tem licença AGPL-3.0 e o parser MPL-2.0, ambos públicos no GitHub. Você não precisa confiar cegamente numa promessa de privacidade, pode ler exatamente o que o código faz com seus dados.'],
      ],
      billing: [
        ['Quanto custa o Pro AI?',
         'O Pro AI custa {price}, e você pode cancelar quando quiser. O plano grátis continua grátis e não precisa de conta. Você tem sua lista completa de não-seguidores, mútuos e fãs toda vez que envia um export. Todos também têm o resumo do Radar e a retrospectiva de 3 meses. O Pro AI adiciona um coach que lembra da sua conta, escreve posts com a sua voz e checa antes de você publicar, além dos nomes por trás de cada mudança, histórico de snapshots salvo, gráficos de crescimento e sincronização criptografada na nuvem entre seus dispositivos.'],
        ['O coach tem um limite?',
         'Sim, um limite mensal generoso que a maioria nunca alcança. Perguntar, rascunhos, revisões de posts e planos saem do mesmo uso mensal, e uma pergunta curta usa bem menos que uma revisão longa. Se você chegar ao limite, ele renova com o seu plano, ou você pode recarregar um mês inteiro pela metade do preço.'],
        ['O que acontece se eu cancelar?',
         'Você fica com o Pro AI até o fim do período pago e depois volta para o plano grátis. Não há mais nada para cancelar, e seus snapshots salvos continuam exportando para CSV quando você quiser.'],
        ['Comprei o antigo desbloqueio Pro. E agora?',
         'Você fica com o Pro até ele acabar, mais um presente de uso do coach para testar, por nossa conta. Ele nunca expira. Mudar para o Pro AI é opcional.'],
      ],
    },
  },
};

export function getHomeContent(locale: AppLocale): HomeContent {
  if (locale === 'es') return ES;
  if (locale === 'pt') return PT;
  return EN;
}
