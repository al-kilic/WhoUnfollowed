import type { AppLocale } from '@/i18n/routing';

// Deliberately NOT moved under app/[locale]: deploy.yml's CI smoke test greps
// `slug: '...'` directly out of this file's path, and llms.txt/route.ts +
// sitemap.ts both import it from here. Keep the file location and the
// `slug: '...'` literal shape stable — only the display text below is
// locale-keyed.
type L = Record<AppLocale, string>;

// Feature icon key, set explicitly per row rather than inferred from the
// feature label text at render time — that text is translated, and matching
// English keywords like "password"/"ban" against Spanish/Portuguese strings
// would silently fail and fall back to the generic icon on every row.
export type CompareRowIcon = 'lock' | 'shield' | 'server' | 'code' | 'bolt';

export interface CompareRow {
  feature: L;
  icon: CompareRowIcon;
  us: boolean;
  them: boolean;
}

export interface Comparison {
  slug: string;
  competitorName: string;
  title: L;
  metaTitle: L;
  metaDescription: L;
  excerpt: L;
  rows: CompareRow[];
  body: L;
  verdict: L;
  cta: L;
}

// Flattened, single-locale view of a Comparison — what the detail page and
// its content component actually render.
export interface ResolvedComparison {
  slug: string;
  competitorName: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  rows: { feature: string; icon: CompareRowIcon; us: boolean; them: boolean }[];
  body: string;
  verdict: string;
  cta: string;
}

export function resolveComparison(c: Comparison, locale: AppLocale): ResolvedComparison {
  return {
    slug: c.slug,
    competitorName: c.competitorName,
    title: c.title[locale],
    metaTitle: c.metaTitle[locale],
    metaDescription: c.metaDescription[locale],
    excerpt: c.excerpt[locale],
    rows: c.rows.map((r) => ({ feature: r.feature[locale], icon: r.icon, us: r.us, them: r.them })),
    body: c.body[locale],
    verdict: c.verdict[locale],
    cta: c.cta[locale],
  };
}

const SHARED_ROWS = (): CompareRow[] => [
  { feature: { en: 'Requires Instagram password', es: 'Requiere contraseña de Instagram', pt: 'Exige senha do Instagram' }, icon: 'lock', us: false, them: true },
  { feature: { en: 'Risk of account ban', es: 'Riesgo de baneo de cuenta', pt: 'Risco de banimento de conta' }, icon: 'shield', us: false, them: true },
  { feature: { en: 'Data sent to servers', es: 'Datos enviados a servidores', pt: 'Dados enviados a servidores' }, icon: 'server', us: false, them: true },
  { feature: { en: 'Open source', es: 'Código abierto', pt: 'Código aberto' }, icon: 'code', us: true, them: false },
  { feature: { en: 'Free tier', es: 'Plan gratuito', pt: 'Plano grátis' }, icon: 'bolt', us: true, them: true },
  { feature: { en: 'No signup required', es: 'No requiere registro', pt: 'Sem necessidade de cadastro' }, icon: 'lock', us: true, them: false },
  { feature: { en: 'Works offline', es: 'Funciona sin conexión', pt: 'Funciona offline' }, icon: 'bolt', us: true, them: false },
];

export const COMPARISONS: Comparison[] = [
  {
    slug: 'whounfollowed-vs-followers-unfollowers',
    competitorName: 'Followers & Unfollowers',
    title: {
      en: 'WhoUnfollowed vs Followers & Unfollowers',
      es: 'WhoUnfollowed vs Followers & Unfollowers',
      pt: 'WhoUnfollowed vs Followers & Unfollowers',
    },
    metaTitle: {
      en: 'WhoUnfollowed vs Followers & Unfollowers App',
      es: 'WhoUnfollowed vs la App Followers & Unfollowers',
      pt: 'WhoUnfollowed vs o App Followers & Unfollowers',
    },
    metaDescription: {
      en: 'WhoUnfollowed never asks for your Instagram password. Followers & Unfollowers does. See the full comparison and decide what your account is worth.',
      es: 'WhoUnfollowed nunca pide tu contraseña de Instagram. Followers & Unfollowers sí. Ve la comparación completa y decide cuánto vale tu cuenta.',
      pt: 'O WhoUnfollowed nunca pede sua senha do Instagram. O Followers & Unfollowers pede. Veja a comparação completa e decida quanto vale sua conta.',
    },
    excerpt: {
      en: 'WhoUnfollowed analyzes your Instagram followers using your own exported data. No password, no server upload, no ban risk.',
      es: 'WhoUnfollowed analiza tus seguidores de Instagram usando tus propios datos exportados. Sin contraseña, sin subida a servidor, sin riesgo de baneo.',
      pt: 'O WhoUnfollowed analisa seus seguidores do Instagram usando seus próprios dados exportados. Sem senha, sem envio a servidor, sem risco de banimento.',
    },
    rows: SHARED_ROWS(),
    body: {
      en: `Followers & Unfollowers is one of the most downloaded Instagram tracker apps on mobile. The reviews are decent, the interface is clean, and it does surface the data you want. But it gets that data by logging into Instagram on your behalf. You hand over your credentials, and the app acts as you. That is not a design quirk. That is the only way it can work.

Instagram's terms of service prohibit third-party apps from storing or using account passwords. Accounts caught doing this get flagged. Sometimes they get suspended. The risk is real and well-documented across creator forums and subreddits. You may never have a problem, or you may lose an account you spent years building.

WhoUnfollowed takes a different route entirely. You request your data directly from Instagram through their official "Download Your Information" settings page, which is a right guaranteed under GDPR Article 20. Instagram prepares a ZIP file and emails it to you, usually within a few hours. You upload that ZIP to WhoUnfollowed. The app reads it in your browser, shows you your non-followers and unfollowers across snapshots, and closes. Nothing is transmitted to a server. The parsing code is open-source. There is no account to create, no password to share, and no ongoing access to your Instagram profile.

The analysis you get is identical. The exposure is not.`,
      es: `Followers & Unfollowers es una de las apps de seguimiento de Instagram más descargadas en móvil. Las reseñas son decentes, la interfaz es limpia y sí muestra los datos que buscas. Pero obtiene esos datos iniciando sesión en Instagram en tu nombre. Le entregas tus credenciales, y la app actúa como si fueras tú. Eso no es un detalle de diseño. Es la única forma en que puede funcionar.

Los términos de servicio de Instagram prohíben que apps de terceros almacenen o usen contraseñas de cuentas. Las cuentas sorprendidas haciendo esto se marcan. A veces se suspenden. El riesgo es real y está bien documentado en foros de creadores y en Reddit. Puede que nunca tengas un problema, o puede que pierdas una cuenta en la que trabajaste durante años.

WhoUnfollowed toma un camino completamente distinto. Solicitas tus datos directamente a Instagram a través de su página oficial de configuración "Descargar tu información", un derecho garantizado bajo el Artículo 20 del RGPD. Instagram prepara un archivo ZIP y te lo envía por correo, normalmente en unas horas. Subes ese ZIP a WhoUnfollowed. La app lo lee en tu navegador, te muestra tus no-seguidores y quién te dejó de seguir entre snapshots, y se cierra. Nada se transmite a un servidor. El código de procesamiento es de código abierto. No hay cuenta que crear, ni contraseña que compartir, ni acceso continuo a tu perfil de Instagram.

El análisis que obtienes es idéntico. La exposición no lo es.`,
      pt: `O Followers & Unfollowers é um dos apps de rastreamento do Instagram mais baixados no celular. As avaliações são boas, a interface é limpa e ele realmente mostra os dados que você quer. Mas ele consegue esses dados fazendo login no Instagram em seu nome. Você entrega suas credenciais, e o app age como se fosse você. Isso não é um detalhe de design. É a única forma de funcionar.

Os termos de serviço do Instagram proíbem que apps de terceiros armazenem ou usem senhas de contas. Contas flagradas fazendo isso são sinalizadas. Às vezes são suspensas. O risco é real e bem documentado em fóruns de criadores e no Reddit. Você pode nunca ter um problema, ou pode perder uma conta que levou anos para construir.

O WhoUnfollowed segue um caminho completamente diferente. Você solicita seus dados diretamente do Instagram pela página oficial de configurações "Baixar suas informações", um direito garantido pelo Artigo 20 do RGPD. O Instagram prepara um arquivo ZIP e te envia por email, geralmente em algumas horas. Você envia esse ZIP para o WhoUnfollowed. O app o lê no seu navegador, mostra seus não-seguidores e quem deixou de te seguir entre snapshots, e encerra. Nada é transmitido a um servidor. O código de processamento é de código aberto. Não há conta para criar, senha para compartilhar, nem acesso contínuo ao seu perfil do Instagram.

A análise que você recebe é idêntica. A exposição não é.`,
    },
    verdict: {
      en: 'If you want to know who unfollowed you without risking your Instagram account, WhoUnfollowed gives you the same result with zero credential exposure. Followers & Unfollowers works until it doesn\'t, and when it doesn\'t, it\'s your account that pays.',
      es: 'Si quieres saber quién te dejó de seguir sin arriesgar tu cuenta de Instagram, WhoUnfollowed te da el mismo resultado sin exponer ninguna credencial. Followers & Unfollowers funciona hasta que deja de hacerlo, y cuando eso pasa, tu cuenta es la que paga el precio.',
      pt: 'Se você quer saber quem deixou de te seguir sem arriscar sua conta do Instagram, o WhoUnfollowed te dá o mesmo resultado sem expor nenhuma credencial. O Followers & Unfollowers funciona até não funcionar mais, e quando isso acontece, é sua conta que paga o preço.',
    },
    cta: {
      en: 'Upload your Instagram ZIP and see your unfollowers now. Free, no account needed.',
      es: 'Sube tu ZIP de Instagram y ve quién te dejó de seguir ahora. Gratis, sin necesidad de cuenta.',
      pt: 'Envie seu ZIP do Instagram e veja quem deixou de te seguir agora. Grátis, sem necessidade de conta.',
    },
  },
  {
    slug: 'whounfollowed-vs-followmeter',
    competitorName: 'FollowMeter',
    title: {
      en: 'WhoUnfollowed vs FollowMeter',
      es: 'WhoUnfollowed vs FollowMeter',
      pt: 'WhoUnfollowed vs FollowMeter',
    },
    metaTitle: {
      en: 'WhoUnfollowed vs FollowMeter for Instagram',
      es: 'WhoUnfollowed vs FollowMeter para Instagram',
      pt: 'WhoUnfollowed vs FollowMeter para Instagram',
    },
    metaDescription: {
      en: 'FollowMeter needs your Instagram login. WhoUnfollowed uses your data export instead. Compare both tools and see which one doesn\'t put your account at risk.',
      es: 'FollowMeter necesita tu inicio de sesión de Instagram. WhoUnfollowed usa tu export de datos en su lugar. Compara ambas herramientas y ve cuál no pone en riesgo tu cuenta.',
      pt: 'O FollowMeter precisa do seu login do Instagram. O WhoUnfollowed usa seu export de dados em vez disso. Compare as duas ferramentas e veja qual não coloca sua conta em risco.',
    },
    excerpt: {
      en: 'WhoUnfollowed and FollowMeter both track Instagram unfollowers, but only one of them requires your Instagram password.',
      es: 'WhoUnfollowed y FollowMeter rastrean a quién te dejó de seguir en Instagram, pero solo uno de ellos requiere tu contraseña de Instagram.',
      pt: 'O WhoUnfollowed e o FollowMeter rastreiam quem deixou de te seguir no Instagram, mas só um deles exige sua senha do Instagram.',
    },
    rows: SHARED_ROWS(),
    body: {
      en: `FollowMeter has been around long enough to build a real user base and a reasonably polished iOS and Android app. It shows follower counts, non-followers, recent unfollows, and engagement approximations. For a lot of users it does what they need. The problem is the access model. To pull any of that data, FollowMeter authenticates with your Instagram account using your username and password. Your credentials leave your device. Where they go after that, and how they are stored, is not something you can verify.

This matters more than most people realize. Instagram actively detects and suppresses accounts that connect to unauthorized third-party services. The platform uses behavioral signals and session fingerprinting to identify non-human access patterns. An app logging in as you, on a server, from a data center IP, is a recognizable pattern. Some users lose access to their accounts. Others face repeated checkpoint challenges.

WhoUnfollowed never touches Instagram's servers. You download your own data directly from Instagram's settings panel, a standard export that Instagram is legally required to provide under GDPR. You upload that ZIP to WhoUnfollowed, and the app parses it locally in your browser. Your followers list, your following list, and the difference between them. If you upload a second ZIP from a later date, you see exactly who unfollowed you in between. The file never reaches a server. The app never touches Instagram.

FollowMeter gives you convenience. WhoUnfollowed gives you the same information without the exposure.`,
      es: `FollowMeter lleva suficiente tiempo en el mercado como para construir una base de usuarios real y una app para iOS y Android razonablemente pulida. Muestra el número de seguidores, no-seguidores, unfollows recientes y aproximaciones de interacción. Para muchos usuarios hace lo que necesitan. El problema es el modelo de acceso. Para obtener cualquiera de esos datos, FollowMeter se autentica con tu cuenta de Instagram usando tu usuario y contraseña. Tus credenciales salen de tu dispositivo. A dónde van después, y cómo se almacenan, no es algo que puedas verificar.

Esto importa más de lo que la mayoría cree. Instagram detecta y suprime activamente cuentas que se conectan a servicios de terceros no autorizados. La plataforma usa señales de comportamiento y huellas de sesión para identificar patrones de acceso no humanos. Una app que inicia sesión como si fueras tú, desde un servidor, con una IP de centro de datos, es un patrón reconocible. Algunos usuarios pierden acceso a sus cuentas. Otros enfrentan desafíos de verificación repetidos.

WhoUnfollowed nunca toca los servidores de Instagram. Descargas tus propios datos directamente desde el panel de configuración de Instagram, un export estándar que Instagram está legalmente obligado a proporcionar bajo el RGPD. Subes ese ZIP a WhoUnfollowed, y la app lo procesa localmente en tu navegador. Tu lista de seguidores, tu lista de seguidos, y la diferencia entre ambas. Si subes un segundo ZIP de una fecha posterior, ves exactamente quién te dejó de seguir en ese intervalo. El archivo nunca llega a un servidor. La app nunca toca Instagram.

FollowMeter te da comodidad. WhoUnfollowed te da la misma información sin la exposición.`,
      pt: `O FollowMeter existe há tempo suficiente para construir uma base real de usuários e um app razoavelmente polido para iOS e Android. Ele mostra número de seguidores, não-seguidores, unfollows recentes e aproximações de engajamento. Para muitos usuários, ele faz o que precisam. O problema é o modelo de acesso. Para puxar qualquer um desses dados, o FollowMeter se autentica na sua conta do Instagram usando seu usuário e senha. Suas credenciais saem do seu dispositivo. Para onde elas vão depois, e como são armazenadas, não é algo que você possa verificar.

Isso importa mais do que a maioria imagina. O Instagram detecta e suprime ativamente contas que se conectam a serviços de terceiros não autorizados. A plataforma usa sinais de comportamento e fingerprinting de sessão para identificar padrões de acesso não humanos. Um app que faz login como você, num servidor, com um IP de data center, é um padrão reconhecível. Alguns usuários perdem acesso às contas. Outros enfrentam desafios de verificação repetidos.

O WhoUnfollowed nunca toca nos servidores do Instagram. Você baixa seus próprios dados diretamente do painel de configurações do Instagram, um export padrão que o Instagram é legalmente obrigado a fornecer sob o RGPD. Você envia esse ZIP para o WhoUnfollowed, e o app o processa localmente no seu navegador. Sua lista de seguidores, sua lista de seguindo, e a diferença entre elas. Se você enviar um segundo ZIP de uma data posterior, vê exatamente quem deixou de te seguir nesse intervalo. O arquivo nunca chega a um servidor. O app nunca toca no Instagram.

O FollowMeter te dá conveniência. O WhoUnfollowed te dá a mesma informação sem a exposição.`,
    },
    verdict: {
      en: 'FollowMeter is a capable app built on a method that violates Instagram\'s terms of service. WhoUnfollowed does the same job through Instagram\'s own official data export, with no credentials required and no server involved.',
      es: 'FollowMeter es una app capaz construida sobre un método que viola los términos de servicio de Instagram. WhoUnfollowed hace el mismo trabajo a través del export oficial de datos de Instagram, sin necesidad de credenciales y sin ningún servidor involucrado.',
      pt: 'O FollowMeter é um app capaz construído sobre um método que viola os termos de serviço do Instagram. O WhoUnfollowed faz o mesmo trabalho através do export oficial de dados do Instagram, sem necessidade de credenciais e sem nenhum servidor envolvido.',
    },
    cta: {
      en: 'Try WhoUnfollowed free. Upload your Instagram export and get your results in under a minute.',
      es: 'Prueba WhoUnfollowed gratis. Sube tu export de Instagram y obtén tus resultados en menos de un minuto.',
      pt: 'Experimente o WhoUnfollowed grátis. Envie seu export do Instagram e tenha seus resultados em menos de um minuto.',
    },
  },
  {
    slug: 'whounfollowed-vs-unfollowers-instagram',
    competitorName: 'Unfollowers for Instagram',
    title: {
      en: 'WhoUnfollowed vs Unfollowers for Instagram',
      es: 'WhoUnfollowed vs Unfollowers for Instagram',
      pt: 'WhoUnfollowed vs Unfollowers for Instagram',
    },
    metaTitle: {
      en: 'WhoUnfollowed vs Unfollowers for Instagram',
      es: 'WhoUnfollowed vs Unfollowers for Instagram',
      pt: 'WhoUnfollowed vs Unfollowers for Instagram',
    },
    metaDescription: {
      en: 'Unfollowers for Instagram wants your login credentials. WhoUnfollowed works from your data export. Here\'s what that difference means for your account.',
      es: 'Unfollowers for Instagram quiere tus credenciales de inicio de sesión. WhoUnfollowed trabaja desde tu export de datos. Esto es lo que esa diferencia significa para tu cuenta.',
      pt: 'O Unfollowers for Instagram quer suas credenciais de login. O WhoUnfollowed trabalha a partir do seu export de dados. Veja o que essa diferença significa para sua conta.',
    },
    excerpt: {
      en: 'Both tools show you who stopped following you on Instagram, but only one of them accesses your account directly.',
      es: 'Ambas herramientas te muestran quién dejó de seguirte en Instagram, pero solo una de ellas accede directamente a tu cuenta.',
      pt: 'As duas ferramentas mostram quem deixou de te seguir no Instagram, mas só uma delas acessa sua conta diretamente.',
    },
    rows: SHARED_ROWS(),
    body: {
      en: `Unfollowers for Instagram is a well-reviewed app in its category. It surfaces the core data points creators care about: who unfollowed recently, who you follow that ignores you back, and how those numbers move over time. Users download it precisely because it works. The issue is not whether it delivers the data. The issue is how it gets the data, and what that costs you.

To retrieve your follower information, Unfollowers for Instagram needs active access to your Instagram account. That means your login credentials, passed to a third-party service. Instagram does not authorize this. Their Platform Policy explicitly prohibits storing user passwords or impersonating users to access the API. When Instagram detects it (and they do), the account faces action. That can mean a temporary lock, a forced password reset, or in repeat cases, a permanent ban.

WhoUnfollowed was built specifically because this tradeoff is a bad one. Instagram gives every user the right to download their own data under GDPR Article 20. You go to Instagram's settings, request a data export, and Instagram prepares a ZIP file. You upload that ZIP to WhoUnfollowed, and the app parses it locally in your browser. If you upload a second ZIP from a later date, you see the diff: everyone who unfollowed you in that window, timestamped. The file never reaches a server. The app never touches Instagram. There is nothing to flag.`,
      es: `Unfollowers for Instagram es una app bien valorada en su categoría. Muestra los datos que más le importan a los creadores: quién te dejó de seguir recientemente, a quién sigues que no te sigue de vuelta, y cómo cambian esos números con el tiempo. Los usuarios la descargan precisamente porque funciona. La cuestión no es si entrega los datos. La cuestión es cómo obtiene esos datos, y qué te cuesta eso.

Para obtener tu información de seguidores, Unfollowers for Instagram necesita acceso activo a tu cuenta de Instagram. Eso significa tus credenciales de inicio de sesión, entregadas a un servicio de terceros. Instagram no autoriza esto. Su Política de Plataforma prohíbe explícitamente almacenar contraseñas de usuarios o suplantar usuarios para acceder a la API. Cuando Instagram lo detecta (y lo hace), la cuenta enfrenta consecuencias. Eso puede significar un bloqueo temporal, un restablecimiento forzado de contraseña, o en casos repetidos, un baneo permanente.

WhoUnfollowed se construyó específicamente porque este intercambio es malo. Instagram le da a cada usuario el derecho de descargar sus propios datos bajo el Artículo 20 del RGPD. Vas a la configuración de Instagram, solicitas un export de datos, e Instagram prepara un archivo ZIP. Subes ese ZIP a WhoUnfollowed, y la app lo procesa localmente en tu navegador. Si subes un segundo ZIP de una fecha posterior, ves la diferencia: todos los que te dejaron de seguir en ese periodo, con marca de tiempo. El archivo nunca llega a un servidor. La app nunca toca Instagram. No hay nada que pueda marcarse.`,
      pt: `O Unfollowers for Instagram é um app bem avaliado na sua categoria. Ele mostra os dados que mais importam para criadores: quem deixou de seguir recentemente, quem você segue que não te segue de volta, e como esses números mudam ao longo do tempo. Os usuários baixam justamente porque funciona. A questão não é se ele entrega os dados. A questão é como ele consegue esses dados, e o que isso custa para você.

Para obter suas informações de seguidores, o Unfollowers for Instagram precisa de acesso ativo à sua conta do Instagram. Isso significa suas credenciais de login, entregues a um serviço de terceiros. O Instagram não autoriza isso. A Política de Plataforma deles proíbe explicitamente armazenar senhas de usuários ou se passar por usuários para acessar a API. Quando o Instagram detecta isso (e detecta), a conta sofre consequências. Isso pode significar um bloqueio temporário, uma redefinição forçada de senha, ou em casos repetidos, um banimento permanente.

O WhoUnfollowed foi criado especificamente porque essa troca é ruim. O Instagram dá a cada usuário o direito de baixar seus próprios dados sob o Artigo 20 do RGPD. Você vai nas configurações do Instagram, solicita um export de dados, e o Instagram prepara um arquivo ZIP. Você envia esse ZIP para o WhoUnfollowed, e o app o processa localmente no seu navegador. Se você enviar um segundo ZIP de uma data posterior, vê a diferença: todos que deixaram de te seguir naquele período, com data e hora. O arquivo nunca chega a um servidor. O app nunca toca no Instagram. Não há nada que possa ser sinalizado.`,
    },
    verdict: {
      en: 'Unfollowers for Instagram delivers real results through a method that carries real account risk. WhoUnfollowed delivers the same results through a method Instagram explicitly supports, with no credential exposure and no ongoing account access.',
      es: 'Unfollowers for Instagram entrega resultados reales a través de un método que conlleva un riesgo real para la cuenta. WhoUnfollowed entrega los mismos resultados a través de un método que Instagram respalda explícitamente, sin exposición de credenciales y sin acceso continuo a la cuenta.',
      pt: 'O Unfollowers for Instagram entrega resultados reais através de um método que carrega um risco real para a conta. O WhoUnfollowed entrega os mesmos resultados através de um método que o Instagram apoia explicitamente, sem exposição de credenciais e sem acesso contínuo à conta.',
    },
    cta: {
      en: 'Upload your Instagram ZIP now. See your unfollowers instantly, nothing sent to any server.',
      es: 'Sube tu ZIP de Instagram ahora. Ve quién te dejó de seguir al instante, nada se envía a ningún servidor.',
      pt: 'Envie seu ZIP do Instagram agora. Veja quem deixou de te seguir instantaneamente, nada é enviado a nenhum servidor.',
    },
  },
  {
    slug: 'whounfollowed-vs-followbuddy',
    competitorName: 'FollowBuddy',
    title: {
      en: 'WhoUnfollowed vs FollowBuddy',
      es: 'WhoUnfollowed vs FollowBuddy',
      pt: 'WhoUnfollowed vs FollowBuddy',
    },
    metaTitle: {
      en: 'WhoUnfollowed vs FollowBuddy for Instagram',
      es: 'WhoUnfollowed vs FollowBuddy para Instagram',
      pt: 'WhoUnfollowed vs FollowBuddy para Instagram',
    },
    metaDescription: {
      en: 'FollowBuddy also skips your Instagram password, but it locks results behind a subscription and closed-source code. See how it compares to WhoUnfollowed.',
      es: 'FollowBuddy también evita tu contraseña de Instagram, pero bloquea los resultados detrás de una suscripción y código cerrado. Ve cómo se compara con WhoUnfollowed.',
      pt: 'O FollowBuddy também não pede sua senha do Instagram, mas bloqueia os resultados atrás de uma assinatura e código fechado. Veja como ele se compara ao WhoUnfollowed.',
    },
    excerpt: {
      en: 'FollowBuddy and WhoUnfollowed both read your official Instagram data export instead of asking for your password. The real differences show up after that.',
      es: 'FollowBuddy y WhoUnfollowed leen tu export oficial de datos de Instagram en lugar de pedir tu contraseña. Las diferencias reales aparecen después de eso.',
      pt: 'O FollowBuddy e o WhoUnfollowed leem seu export oficial de dados do Instagram em vez de pedir sua senha. As diferenças reais aparecem depois disso.',
    },
    rows: [
      { feature: { en: 'Requires Instagram password', es: 'Requiere contraseña de Instagram', pt: 'Exige senha do Instagram' }, icon: 'lock', us: false, them: false },
      { feature: { en: 'Free to see who unfollowed you', es: 'Gratis para ver quién te dejó de seguir', pt: 'Grátis para ver quem deixou de te seguir' }, icon: 'bolt', us: true, them: false },
      { feature: { en: 'Open source, code is auditable', es: 'Código abierto, auditable', pt: 'Código aberto, auditável' }, icon: 'code', us: true, them: false },
      { feature: { en: 'Works in your browser, no app install', es: 'Funciona en tu navegador, sin instalar app', pt: 'Funciona no navegador, sem instalar app' }, icon: 'bolt', us: true, them: false },
    ],
    body: {
      en: `FollowBuddy is not one of the password-harvesting apps we usually write about here. To its credit, it uses the same starting point WhoUnfollowed does: Instagram's own "Download Your Information" export. You request your data from Instagram directly, Instagram sends you a ZIP file, and you upload that file to the app instead of typing in your username and password. On that specific point, FollowBuddy gets it right, and it deserves credit for not following the industry's worst habit.

Where the two tools diverge is what happens next. FollowBuddy is a mobile app, iOS and Android only, and viewing your actual list of unfollowers requires an active paid subscription. You upload your data first, then hit a paywall to see the results. WhoUnfollowed runs in any browser, no download, no app store, and shows you the full non-follower and unfollower breakdown for free.

The bigger difference is verifiability. FollowBuddy's own marketing says your data stays off their servers, but the app is closed source, so that claim rests on trust alone. There is no code for anyone to read and confirm it. WhoUnfollowed's parsing logic is open source under a public license. The ZIP you upload is processed entirely in your browser tab, and anyone technical enough to check can go look at exactly what the code does with your file, line by line.

Neither tool is going to get your Instagram account banned. That much is genuinely true of both. The question is whether you want to pay a subscription to see your own data, install an app to get it, and take a company's word for how your file is handled, or get the same answer for free, in a browser tab, with the code sitting in the open.`,
      es: `FollowBuddy no es una de esas apps que roban contraseñas de las que solemos escribir aquí. Para su crédito, usa el mismo punto de partida que WhoUnfollowed: el export "Descargar tu información" del propio Instagram. Solicitas tus datos directamente a Instagram, Instagram te envía un archivo ZIP, y subes ese archivo a la app en lugar de escribir tu usuario y contraseña. En ese punto específico, FollowBuddy lo hace bien, y merece crédito por no seguir el peor hábito de la industria.

Donde las dos herramientas se separan es en lo que pasa después. FollowBuddy es una app móvil, solo iOS y Android, y ver tu lista real de quién te dejó de seguir requiere una suscripción de pago activa. Subes tus datos primero, y luego chocas con un muro de pago para ver los resultados. WhoUnfollowed funciona en cualquier navegador, sin descargas, sin tienda de apps, y te muestra el desglose completo de no-seguidores y quién te dejó de seguir de forma gratuita.

La diferencia más grande es la verificabilidad. El propio marketing de FollowBuddy dice que tus datos no salen de sus servidores, pero la app es de código cerrado, así que esa afirmación descansa solo en la confianza. No hay código que nadie pueda leer y confirmar. La lógica de procesamiento de WhoUnfollowed es de código abierto bajo una licencia pública. El ZIP que subes se procesa por completo en la pestaña de tu navegador, y cualquiera con conocimientos técnicos suficientes puede ir a ver exactamente qué hace el código con tu archivo, línea por línea.

Ninguna de las dos apps va a hacer que baneen tu cuenta de Instagram. Eso es genuinamente cierto para ambas. La pregunta es si quieres pagar una suscripción para ver tus propios datos, instalar una app para conseguirlo, y confiar en la palabra de una empresa sobre cómo se maneja tu archivo, o conseguir la misma respuesta gratis, en una pestaña del navegador, con el código a la vista de todos.`,
      pt: `O FollowBuddy não é um daqueles apps que coletam senhas dos quais costumamos escrever aqui. Para seu crédito, ele usa o mesmo ponto de partida que o WhoUnfollowed: o próprio export "Baixar suas informações" do Instagram. Você solicita seus dados diretamente do Instagram, o Instagram te envia um arquivo ZIP, e você envia esse arquivo para o app em vez de digitar seu usuário e senha. Nesse ponto específico, o FollowBuddy acerta, e merece crédito por não seguir o pior hábito do setor.

Onde as duas ferramentas se separam é no que acontece depois. O FollowBuddy é um app móvel, só iOS e Android, e ver sua lista real de quem deixou de te seguir exige uma assinatura paga ativa. Você envia seus dados primeiro, e depois esbarra num paywall para ver os resultados. O WhoUnfollowed roda em qualquer navegador, sem download, sem loja de apps, e mostra o detalhamento completo de não-seguidores e quem deixou de te seguir de graça.

A diferença maior é a verificabilidade. O próprio marketing do FollowBuddy diz que seus dados não saem dos servidores deles, mas o app é de código fechado, então essa afirmação depende só de confiança. Não há código que alguém possa ler e confirmar. A lógica de processamento do WhoUnfollowed é de código aberto sob uma licença pública. O ZIP que você envia é processado inteiramente na aba do seu navegador, e qualquer pessoa com conhecimento técnico suficiente pode ir ver exatamente o que o código faz com seu arquivo, linha por linha.

Nenhum dos dois apps vai fazer sua conta do Instagram ser banida. Isso é genuinamente verdade para os dois. A questão é se você quer pagar uma assinatura para ver seus próprios dados, instalar um app para consegui-los, e confiar na palavra de uma empresa sobre como seu arquivo é tratado, ou obter a mesma resposta de graça, numa aba do navegador, com o código à vista de todos.`,
    },
    verdict: {
      en: 'FollowBuddy avoids the password trap, which puts it a step ahead of most of the competition. It still charges a subscription to unlock your own results and asks you to trust a closed codebase. WhoUnfollowed gives you the same unfollower and non-follower breakdown for free, in your browser, with nothing to install and nothing hidden.',
      es: 'FollowBuddy evita la trampa de la contraseña, lo cual lo pone un paso adelante de la mayoría de la competencia. Aun así cobra una suscripción para desbloquear tus propios resultados y te pide confiar en un código cerrado. WhoUnfollowed te da el mismo desglose de no-seguidores y quién te dejó de seguir de forma gratuita, en tu navegador, sin nada que instalar y sin nada oculto.',
      pt: 'O FollowBuddy evita a armadilha da senha, o que o coloca um passo à frente da maior parte da concorrência. Ainda assim cobra uma assinatura para desbloquear seus próprios resultados e pede que você confie num código fechado. O WhoUnfollowed te dá o mesmo detalhamento de não-seguidores e quem deixou de te seguir de graça, no seu navegador, sem nada para instalar e nada escondido.',
    },
    cta: {
      en: 'Upload your Instagram ZIP and see your unfollowers free, right in your browser. Nothing to install, nothing to subscribe to.',
      es: 'Sube tu ZIP de Instagram y ve quién te dejó de seguir gratis, directo en tu navegador. Nada que instalar, nada a lo que suscribirse.',
      pt: 'Envie seu ZIP do Instagram e veja quem deixou de te seguir de graça, direto no seu navegador. Nada para instalar, nada para assinar.',
    },
  },
];

export function getComparison(slug: string): Comparison | undefined {
  return COMPARISONS.find(c => c.slug === slug);
}
