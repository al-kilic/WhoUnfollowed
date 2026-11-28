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
      en: 'Upload your Instagram ZIP and see who doesn\'t follow you back now. Free, no account needed.',
      es: 'Sube tu ZIP de Instagram y ve quién no te sigue de vuelta ahora. Gratis, sin necesidad de cuenta.',
      pt: 'Envie seu ZIP do Instagram e veja quem não te segue de volta agora. Grátis, sem necessidade de conta.',
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
      { feature: { en: 'Free list of who doesn\'t follow you back', es: 'Lista gratis de quién no te sigue de vuelta', pt: 'Lista grátis de quem não te segue de volta' }, icon: 'bolt', us: true, them: false },
      { feature: { en: 'Open source, code is auditable', es: 'Código abierto, auditable', pt: 'Código aberto, auditável' }, icon: 'code', us: true, them: false },
      { feature: { en: 'Works in your browser, no app install', es: 'Funciona en tu navegador, sin instalar app', pt: 'Funciona no navegador, sem instalar app' }, icon: 'bolt', us: true, them: false },
    ],
    body: {
      en: `FollowBuddy is not one of the password-harvesting apps we usually write about here. To its credit, it uses the same starting point WhoUnfollowed does: Instagram's own "Download Your Information" export. You request your data from Instagram directly, Instagram sends you a ZIP file, and you upload that file to the app instead of typing in your username and password. On that specific point, FollowBuddy gets it right, and it deserves credit for not following the industry's worst habit.

Where the two tools diverge is what happens next. FollowBuddy is a mobile app, iOS and Android only, and viewing your actual list of unfollowers requires an active paid subscription. You upload your data first, then hit a paywall to see the results. WhoUnfollowed runs in any browser, no download, no app store, and shows you who doesn't follow you back for free. A free account keeps two exports and shows how many people left; the names come with Pro AI.

The bigger difference is verifiability. FollowBuddy's own marketing says your data stays off their servers, but the app is closed source, so that claim rests on trust alone. There is no code for anyone to read and confirm it. WhoUnfollowed's parsing logic is open source under a public license. The ZIP you upload is processed entirely in your browser tab, and anyone technical enough to check can go look at exactly what the code does with your file, line by line.

Neither tool is going to get your Instagram account banned. That much is genuinely true of both. The question is whether you want to pay a subscription to see your own data, install an app to get it, and take a company's word for how your file is handled, or get your list for free, in a browser tab, with the code sitting in the open.`,
      es: `FollowBuddy no es una de esas apps que roban contraseñas de las que solemos escribir aquí. Para su crédito, usa el mismo punto de partida que WhoUnfollowed: el export "Descargar tu información" del propio Instagram. Solicitas tus datos directamente a Instagram, Instagram te envía un archivo ZIP, y subes ese archivo a la app en lugar de escribir tu usuario y contraseña. En ese punto específico, FollowBuddy lo hace bien, y merece crédito por no seguir el peor hábito de la industria.

Donde las dos herramientas se separan es en lo que pasa después. FollowBuddy es una app móvil, solo iOS y Android, y ver tu lista real de quién te dejó de seguir requiere una suscripción de pago activa. Subes tus datos primero, y luego chocas con un muro de pago para ver los resultados. WhoUnfollowed funciona en cualquier navegador, sin descargas, sin tienda de apps, y te muestra gratis quién no te sigue de vuelta. Una cuenta gratis guarda dos exports y muestra cuántas personas se fueron; los nombres vienen con Pro AI.

La diferencia más grande es la verificabilidad. El propio marketing de FollowBuddy dice que tus datos no salen de sus servidores, pero la app es de código cerrado, así que esa afirmación descansa solo en la confianza. No hay código que nadie pueda leer y confirmar. La lógica de procesamiento de WhoUnfollowed es de código abierto bajo una licencia pública. El ZIP que subes se procesa por completo en la pestaña de tu navegador, y cualquiera con conocimientos técnicos suficientes puede ir a ver exactamente qué hace el código con tu archivo, línea por línea.

Ninguna de las dos apps va a hacer que baneen tu cuenta de Instagram. Eso es genuinamente cierto para ambas. La pregunta es si quieres pagar una suscripción para ver tus propios datos, instalar una app para conseguirlo, y confiar en la palabra de una empresa sobre cómo se maneja tu archivo, o conseguir tu lista gratis, en una pestaña del navegador, con el código a la vista de todos.`,
      pt: `O FollowBuddy não é um daqueles apps que coletam senhas dos quais costumamos escrever aqui. Para seu crédito, ele usa o mesmo ponto de partida que o WhoUnfollowed: o próprio export "Baixar suas informações" do Instagram. Você solicita seus dados diretamente do Instagram, o Instagram te envia um arquivo ZIP, e você envia esse arquivo para o app em vez de digitar seu usuário e senha. Nesse ponto específico, o FollowBuddy acerta, e merece crédito por não seguir o pior hábito do setor.

Onde as duas ferramentas se separam é no que acontece depois. O FollowBuddy é um app móvel, só iOS e Android, e ver sua lista real de quem deixou de te seguir exige uma assinatura paga ativa. Você envia seus dados primeiro, e depois esbarra num paywall para ver os resultados. O WhoUnfollowed roda em qualquer navegador, sem download, sem loja de apps, e mostra de graça quem não te segue de volta. Uma conta grátis guarda dois exports e mostra quantas pessoas saíram; os nomes vêm com o Pro AI.

A diferença maior é a verificabilidade. O próprio marketing do FollowBuddy diz que seus dados não saem dos servidores deles, mas o app é de código fechado, então essa afirmação depende só de confiança. Não há código que alguém possa ler e confirmar. A lógica de processamento do WhoUnfollowed é de código aberto sob uma licença pública. O ZIP que você envia é processado inteiramente na aba do seu navegador, e qualquer pessoa com conhecimento técnico suficiente pode ir ver exatamente o que o código faz com seu arquivo, linha por linha.

Nenhum dos dois apps vai fazer sua conta do Instagram ser banida. Isso é genuinamente verdade para os dois. A questão é se você quer pagar uma assinatura para ver seus próprios dados, instalar um app para consegui-los, e confiar na palavra de uma empresa sobre como seu arquivo é tratado, ou obter a sua lista de graça, numa aba do navegador, com o código à vista de todos.`,
    },
    verdict: {
      en: 'FollowBuddy avoids the password trap, which puts it a step ahead of most of the competition. It still charges a subscription to unlock your own results and asks you to trust a closed codebase. WhoUnfollowed shows you who doesn\'t follow you back for free, in your browser, with nothing to install and nothing hidden, and Pro AI adds who unfollowed you by name when you want more.',
      es: 'FollowBuddy evita la trampa de la contraseña, lo cual lo pone un paso adelante de la mayoría de la competencia. Aun así cobra una suscripción para desbloquear tus propios resultados y te pide confiar en un código cerrado. WhoUnfollowed te muestra gratis quién no te sigue de vuelta, en tu navegador, sin nada que instalar y sin nada oculto, y Pro AI añade por nombre quién te dejó de seguir cuando quieras más.',
      pt: 'O FollowBuddy evita a armadilha da senha, o que o coloca um passo à frente da maior parte da concorrência. Ainda assim cobra uma assinatura para desbloquear seus próprios resultados e pede que você confie num código fechado. O WhoUnfollowed mostra de graça quem não te segue de volta, no seu navegador, sem nada para instalar e nada escondido, e o Pro AI adiciona pelo nome quem deixou de te seguir quando você quiser mais.',
    },
    cta: {
      en: 'Upload your Instagram ZIP and see who doesn\'t follow you back free, right in your browser. Nothing to install.',
      es: 'Sube tu ZIP de Instagram y ve gratis quién no te sigue de vuelta, directo en tu navegador. Nada que instalar.',
      pt: 'Envie seu ZIP do Instagram e veja de graça quem não te segue de volta, direto no seu navegador. Nada para instalar.',
    },
  },
  {
    slug: 'whounfollowed-vs-reports-plus',
    competitorName: 'Reports+',
    title: {
      en: 'WhoUnfollowed vs Reports+',
      es: 'WhoUnfollowed vs Reports+',
      pt: 'WhoUnfollowed vs Reports+',
    },
    metaTitle: {
      en: 'WhoUnfollowed vs Reports+ for Instagram',
      es: 'WhoUnfollowed vs Reports+ para Instagram',
      pt: 'WhoUnfollowed vs Reports+ para Instagram',
    },
    metaDescription: {
      en: 'Reports+ is the most rated unfollower app on the App Store, and it works by signing in to Instagram as you. WhoUnfollowed reads your official export instead.',
      es: 'Reports+ es la app de unfollowers con más valoraciones en el App Store y funciona iniciando sesión en Instagram por ti. WhoUnfollowed lee tu export oficial.',
      pt: 'O Reports+ é o app de unfollowers mais avaliado da App Store e funciona entrando no Instagram como você. O WhoUnfollowed lê o seu export oficial.',
    },
    excerpt: {
      en: 'Reports+ is the biggest unfollower app on the iPhone. It gets its data by having you sign in to Instagram inside the app. WhoUnfollowed reads the export Instagram gives you, with no password.',
      es: 'Reports+ es la app de unfollowers más grande del iPhone. Obtiene sus datos pidiéndote que inicies sesión en Instagram dentro de la app. WhoUnfollowed lee el export que te da Instagram, sin contraseña.',
      pt: 'O Reports+ é o maior app de unfollowers do iPhone. Ele consegue os dados pedindo que você entre no Instagram dentro do app. O WhoUnfollowed lê o export que o Instagram te dá, sem senha.',
    },
    rows: SHARED_ROWS(),
    body: {
      en: `Reports+ is the most rated unfollower app on the iPhone App Store, with around half a million ratings as of November 2026. It promises more than 50 metrics: story interactions, "secret admirers", profile interactions and live changes to your followers.

Data like that does not come from a file. To show it, Reports+ has you sign in with your Instagram account inside the app, so it reads your account through your own login. App Store reviews describe being asked to log in again through a page that looked like Instagram's, and being logged out of their own account afterwards. Instagram's terms do not allow third-party apps to collect login details, and accounts that use them can be flagged or restricted.

WhoUnfollowed takes the slower, safer route. You request your data from Instagram's Accounts Center, Instagram emails you a ZIP, and you open it on WhoUnfollowed. Your browser reads it, and the code that reads it is open source. You see who doesn't follow you back for free, with no account. Pro AI adds who unfollowed you by name across exports, and a coach for your posts.

The trade-off is real: Reports+ is instant and shows more live engagement data, while WhoUnfollowed needs a fresh export each time you check. In exchange, your password never leaves your hands.`,
      es: `Reports+ es la app de unfollowers con más valoraciones del App Store de iPhone, con cerca de medio millón a noviembre de 2026. Promete más de 50 métricas: interacciones con historias, "admiradores secretos", interacciones con el perfil y cambios en vivo de tus seguidores.

Datos así no salen de un archivo. Para mostrarlos, Reports+ te pide iniciar sesión con tu cuenta de Instagram dentro de la app, así que lee tu cuenta a través de tu propio inicio de sesión. Reseñas del App Store describen que se les pidió volver a iniciar sesión en una página que parecía la de Instagram, y que después perdieron la sesión de su propia cuenta. Los términos de Instagram no permiten que apps de terceros recojan datos de inicio de sesión, y las cuentas que las usan pueden ser marcadas o limitadas.

WhoUnfollowed toma el camino más lento y más seguro. Pides tus datos en el Centro de cuentas de Instagram, Instagram te envía un ZIP por correo y lo abres en WhoUnfollowed. Tu navegador lo lee, y el código que lo lee es de código abierto. Ves gratis quién no te sigue de vuelta, sin cuenta. Pro AI añade por nombre quién te dejó de seguir entre exports, y un coach para tus posts.

El intercambio es real: Reports+ es instantáneo y muestra más datos de interacción en vivo, mientras que WhoUnfollowed necesita un export nuevo cada vez que revisas. A cambio, tu contraseña nunca sale de tus manos.`,
      pt: `O Reports+ é o app de unfollowers mais avaliado da App Store do iPhone, com cerca de meio milhão de avaliações em novembro de 2026. Ele promete mais de 50 métricas: interações com stories, "admiradores secretos", interações com o perfil e mudanças ao vivo nos seus seguidores.

Dados assim não vêm de um arquivo. Para mostrá-los, o Reports+ pede que você entre com sua conta do Instagram dentro do app, então ele lê sua conta pelo seu próprio login. Avaliações na App Store descrevem pedidos para entrar de novo numa página parecida com a do Instagram, e perda do acesso à própria conta depois. Os termos do Instagram não permitem que apps de terceiros coletem dados de login, e contas que os usam podem ser sinalizadas ou limitadas.

O WhoUnfollowed segue o caminho mais lento e mais seguro. Você pede seus dados na Central de contas do Instagram, o Instagram te envia um ZIP por email e você o abre no WhoUnfollowed. Seu navegador lê o arquivo, e o código que o lê é aberto. Você vê de graça quem não te segue de volta, sem conta. O Pro AI adiciona pelo nome quem deixou de te seguir entre exports, e um coach para os seus posts.

A troca é real: o Reports+ é instantâneo e mostra mais dados de interação ao vivo, enquanto o WhoUnfollowed precisa de um export novo a cada verificação. Em troca, sua senha nunca sai das suas mãos.`,
    },
    verdict: {
      en: 'If your account matters to you, don\'t trade your login for a dashboard. Reports+ shows more live data, but only by signing in as you. WhoUnfollowed gives you who doesn\'t follow you back, and with Pro AI who left, from Instagram\'s own export, with no password and no ban risk.',
      es: 'Si tu cuenta te importa, no cambies tu inicio de sesión por un panel. Reports+ muestra más datos en vivo, pero solo entrando como tú. WhoUnfollowed te muestra quién no te sigue de vuelta, y con Pro AI quién se fue, desde el propio export de Instagram, sin contraseña y sin riesgo de baneo.',
      pt: 'Se a sua conta importa para você, não troque o seu login por um painel. O Reports+ mostra mais dados ao vivo, mas só entrando como você. O WhoUnfollowed mostra quem não te segue de volta, e com o Pro AI quem saiu, a partir do próprio export do Instagram, sem senha e sem risco de banimento.',
    },
    cta: {
      en: 'Upload your Instagram ZIP and see who doesn\'t follow you back. Free, no login.',
      es: 'Sube tu ZIP de Instagram y ve quién no te sigue de vuelta. Gratis, sin iniciar sesión.',
      pt: 'Envie seu ZIP do Instagram e veja quem não te segue de volta. Grátis, sem login.',
    },
  },
  {
    slug: 'whounfollowed-vs-nfollowers',
    competitorName: 'nFollowers',
    title: {
      en: 'WhoUnfollowed vs nFollowers',
      es: 'WhoUnfollowed vs nFollowers',
      pt: 'WhoUnfollowed vs nFollowers',
    },
    metaTitle: {
      en: 'WhoUnfollowed vs nFollowers for Instagram',
      es: 'WhoUnfollowed vs nFollowers para Instagram',
      pt: 'WhoUnfollowed vs nFollowers para Instagram',
    },
    metaDescription: {
      en: 'nFollowers lets you follow and unfollow people from the app, which only works through your Instagram login. WhoUnfollowed needs no login at all. Compare them.',
      es: 'nFollowers te deja seguir y dejar de seguir desde la app, algo que solo funciona con tu inicio de sesión de Instagram. WhoUnfollowed no necesita ninguno.',
      pt: 'O nFollowers deixa você seguir e deixar de seguir pelo app, o que só funciona com o seu login do Instagram. O WhoUnfollowed não precisa de login nenhum.',
    },
    excerpt: {
      en: 'nFollowers tracks unfollowers and lets you unfollow people from inside the app. That only works with your Instagram login. WhoUnfollowed reads your official export instead.',
      es: 'nFollowers sigue a quién te deja de seguir y te deja dejar de seguir gente desde la app. Eso solo funciona con tu inicio de sesión de Instagram. WhoUnfollowed lee tu export oficial.',
      pt: 'O nFollowers acompanha quem deixou de te seguir e deixa você deixar de seguir pessoas dentro do app. Isso só funciona com o seu login do Instagram. O WhoUnfollowed lê o seu export oficial.',
    },
    rows: SHARED_ROWS(),
    body: {
      en: `nFollowers is one of the older unfollower apps on the App Store, with about 42,000 ratings. It tracks new followers, unfollowers and people who don't follow you back, and it lets you follow and unfollow accounts without leaving the app. Its premium features are an auto-renewing subscription.

That last feature tells you how it works. An app can only follow or unfollow people for you if it is signed in to your Instagram account. Instagram offers no public way for unfollower apps to do that, so apps like this run on your login, and Instagram can flag or limit accounts that use them. As of November 2026, its App Store listing shows the last update in September 2024.

WhoUnfollowed never touches your account. You request your data export from Instagram, open the ZIP on WhoUnfollowed, and your browser reads it. Seeing who doesn't follow you back is free, with no account. Pro AI adds who unfollowed you by name, every export kept, and a coach for your posts. When you want to unfollow someone, you do it yourself in Instagram, which also keeps you clear of Instagram's limits on mass unfollowing.`,
      es: `nFollowers es una de las apps de unfollowers más antiguas del App Store, con unas 42.000 valoraciones. Sigue a tus nuevos seguidores, a quién te deja de seguir y a quién no te sigue de vuelta, y te deja seguir y dejar de seguir cuentas sin salir de la app. Sus funciones premium son una suscripción que se renueva sola.

Esa última función te dice cómo funciona. Una app solo puede seguir o dejar de seguir gente por ti si tiene la sesión iniciada en tu cuenta de Instagram. Instagram no ofrece una vía pública para que las apps de unfollowers hagan eso, así que apps como esta funcionan con tu inicio de sesión, e Instagram puede marcar o limitar las cuentas que las usan. A noviembre de 2026, su ficha del App Store muestra la última actualización en septiembre de 2024.

WhoUnfollowed nunca toca tu cuenta. Pides tu export de datos a Instagram, abres el ZIP en WhoUnfollowed y tu navegador lo lee. Ver quién no te sigue de vuelta es gratis, sin cuenta. Pro AI añade por nombre quién te dejó de seguir, todos tus exports guardados y un coach para tus posts. Cuando quieras dejar de seguir a alguien, lo haces tú mismo en Instagram, lo que también te mantiene lejos de los límites de Instagram para dejar de seguir en masa.`,
      pt: `O nFollowers é um dos apps de unfollowers mais antigos da App Store, com cerca de 42 mil avaliações. Ele acompanha novos seguidores, quem deixou de te seguir e quem não te segue de volta, e deixa você seguir e deixar de seguir contas sem sair do app. Os recursos premium são uma assinatura com renovação automática.

Esse último recurso mostra como ele funciona. Um app só consegue seguir ou deixar de seguir pessoas por você se estiver com login na sua conta do Instagram. O Instagram não oferece um caminho público para apps de unfollowers fazerem isso, então apps assim funcionam com o seu login, e o Instagram pode sinalizar ou limitar contas que os usam. Em novembro de 2026, a página dele na App Store mostra a última atualização em setembro de 2024.

O WhoUnfollowed nunca mexe na sua conta. Você pede seu export de dados ao Instagram, abre o ZIP no WhoUnfollowed e o seu navegador o lê. Ver quem não te segue de volta é grátis, sem conta. O Pro AI adiciona pelo nome quem deixou de te seguir, todos os exports guardados e um coach para os seus posts. Quando quiser deixar de seguir alguém, você faz isso no próprio Instagram, o que também te mantém longe dos limites do Instagram para deixar de seguir em massa.`,
    },
    verdict: {
      en: 'nFollowers is convenient because it acts inside your account. That is also the risk. WhoUnfollowed shows you the same lists from Instagram\'s own export, without a login, and leaves the unfollow button where it belongs, in your hands.',
      es: 'nFollowers es cómodo porque actúa dentro de tu cuenta. Ese es también el riesgo. WhoUnfollowed te muestra las mismas listas desde el propio export de Instagram, sin iniciar sesión, y deja el botón de dejar de seguir donde debe estar, en tus manos.',
      pt: 'O nFollowers é prático porque age dentro da sua conta. Esse também é o risco. O WhoUnfollowed mostra as mesmas listas a partir do próprio export do Instagram, sem login, e deixa o botão de deixar de seguir onde ele deve estar, nas suas mãos.',
    },
    cta: {
      en: 'Upload your Instagram ZIP and see who doesn\'t follow you back. Free, no login.',
      es: 'Sube tu ZIP de Instagram y ve quién no te sigue de vuelta. Gratis, sin iniciar sesión.',
      pt: 'Envie seu ZIP do Instagram e veja quem não te segue de volta. Grátis, sem login.',
    },
  },
  {
    slug: 'whounfollowed-vs-fans',
    competitorName: 'FANS',
    title: {
      en: 'WhoUnfollowed vs FANS Unfollow Tracker',
      es: 'WhoUnfollowed vs FANS Unfollow Tracker',
      pt: 'WhoUnfollowed vs FANS Unfollow Tracker',
    },
    metaTitle: {
      en: 'WhoUnfollowed vs FANS Unfollow Tracker',
      es: 'WhoUnfollowed vs FANS Unfollow Tracker',
      pt: 'WhoUnfollowed vs FANS Unfollow Tracker',
    },
    metaDescription: {
      en: 'FANS and WhoUnfollowed both read your Instagram export with no password. They differ on price, devices, open source and what you get free. See the comparison.',
      es: 'FANS y WhoUnfollowed leen tu export de Instagram sin contraseña. Se diferencian en precio, dispositivos, código abierto y lo que obtienes gratis.',
      pt: 'O FANS e o WhoUnfollowed leem seu export do Instagram sem senha. Eles diferem em preço, aparelhos, código aberto e no que você recebe de graça.',
    },
    excerpt: {
      en: 'FANS is an iPhone app that reads your official Instagram export, like WhoUnfollowed. Here is where the two differ once the password question is settled.',
      es: 'FANS es una app de iPhone que lee tu export oficial de Instagram, igual que WhoUnfollowed. Esto es lo que los separa una vez resuelto lo de la contraseña.',
      pt: 'O FANS é um app de iPhone que lê seu export oficial do Instagram, como o WhoUnfollowed. Veja onde os dois diferem depois que a questão da senha está resolvida.',
    },
    rows: [
      { feature: { en: 'Requires Instagram password', es: 'Requiere contraseña de Instagram', pt: 'Exige senha do Instagram' }, icon: 'lock', us: false, them: false },
      { feature: { en: 'Reads Instagram\'s official export', es: 'Lee el export oficial de Instagram', pt: 'Lê o export oficial do Instagram' }, icon: 'shield', us: true, them: true },
      { feature: { en: 'Free list of who doesn\'t follow you back', es: 'Lista gratis de quién no te sigue de vuelta', pt: 'Lista grátis de quem não te segue de volta' }, icon: 'bolt', us: true, them: false },
      { feature: { en: 'Open source, code is auditable', es: 'Código abierto, auditable', pt: 'Código aberto, auditável' }, icon: 'code', us: true, them: false },
      { feature: { en: 'Works in any browser, phone or computer', es: 'Funciona en cualquier navegador, móvil u ordenador', pt: 'Funciona em qualquer navegador, celular ou computador' }, icon: 'bolt', us: true, them: false },
      { feature: { en: 'Threads and TikTok exports too', es: 'También exports de Threads y TikTok', pt: 'Também exports do Threads e do TikTok' }, icon: 'bolt', us: true, them: false },
      { feature: { en: 'Coach that drafts, checks and plans your posts', es: 'Coach que escribe, revisa y planifica tus posts', pt: 'Coach que escreve, revisa e planeja seus posts' }, icon: 'bolt', us: true, them: false },
    ],
    body: {
      en: `FANS (Unfollow Tracker, by Walter Labs) gets the most important thing right: it never asks for your Instagram password. Like WhoUnfollowed, it reads the data export you download from Instagram's Accounts Center, it accepts both JSON and HTML exports, and it walks you through the export steps with a video.

The differences start after that. FANS is an iPhone app. Several App Store reviews say the list of who doesn't follow you back sits behind an in-app purchase, some mention weekly pricing, and some say this wasn't clear until after they had uploaded their file. WhoUnfollowed shows that list free, with no account, in the browser on any phone or computer.

The other difference is what you can check for yourself. FANS is closed source, so its privacy promises rest on trust. WhoUnfollowed's parser and web app are open source, so anyone can read exactly what happens to your file. WhoUnfollowed also reads Threads and TikTok exports, keeps your exports over time to show who left, and Pro AI adds a coach that drafts, checks and plans your posts.`,
      es: `FANS (Unfollow Tracker, de Walter Labs) acierta en lo más importante: nunca te pide la contraseña de Instagram. Igual que WhoUnfollowed, lee el export de datos que descargas del Centro de cuentas de Instagram, acepta exports en JSON y HTML, y te guía por los pasos del export con un video.

Las diferencias empiezan después. FANS es una app de iPhone. Varias reseñas del App Store dicen que la lista de quién no te sigue de vuelta está detrás de una compra dentro de la app, algunas mencionan precios semanales, y otras dicen que no quedó claro hasta después de subir su archivo. WhoUnfollowed muestra esa lista gratis, sin cuenta, en el navegador de cualquier móvil u ordenador.

La otra diferencia es lo que puedes comprobar por ti mismo. FANS es de código cerrado, así que sus promesas de privacidad dependen de la confianza. El parser y la app web de WhoUnfollowed son de código abierto, así que cualquiera puede leer exactamente qué pasa con tu archivo. WhoUnfollowed también lee exports de Threads y TikTok, guarda tus exports en el tiempo para mostrar quién se fue, y Pro AI añade un coach que escribe, revisa y planifica tus posts.`,
      pt: `O FANS (Unfollow Tracker, da Walter Labs) acerta no mais importante: nunca pede a sua senha do Instagram. Como o WhoUnfollowed, ele lê o export de dados que você baixa da Central de contas do Instagram, aceita exports em JSON e HTML, e te guia pelos passos do export com um vídeo.

As diferenças começam depois disso. O FANS é um app de iPhone. Várias avaliações na App Store dizem que a lista de quem não te segue de volta fica atrás de uma compra no app, algumas mencionam preço semanal, e outras dizem que isso só ficou claro depois de enviar o arquivo. O WhoUnfollowed mostra essa lista de graça, sem conta, no navegador de qualquer celular ou computador.

A outra diferença é o que você pode conferir por conta própria. O FANS tem código fechado, então as promessas de privacidade dependem de confiança. O parser e o app web do WhoUnfollowed são abertos, então qualquer pessoa pode ler exatamente o que acontece com o seu arquivo. O WhoUnfollowed também lê exports do Threads e do TikTok, guarda seus exports ao longo do tempo para mostrar quem saiu, e o Pro AI adiciona um coach que escreve, revisa e planeja seus posts.`,
    },
    verdict: {
      en: 'Both are safe for your account. FANS is a tidy iPhone app. WhoUnfollowed gives you the non-follower list free, works on any device, reads Threads and TikTok too, and lets you check the code instead of taking anyone\'s word for it.',
      es: 'Los dos son seguros para tu cuenta. FANS es una app de iPhone cuidada. WhoUnfollowed te da gratis la lista de quién no te sigue, funciona en cualquier dispositivo, también lee Threads y TikTok, y te deja revisar el código en lugar de fiarte de la palabra de nadie.',
      pt: 'Os dois são seguros para a sua conta. O FANS é um app de iPhone caprichado. O WhoUnfollowed te dá de graça a lista de quem não te segue, funciona em qualquer aparelho, também lê Threads e TikTok, e deixa você conferir o código em vez de confiar na palavra de alguém.',
    },
    cta: {
      en: 'Upload your Instagram ZIP and see who doesn\'t follow you back. Free, no paywall on the list.',
      es: 'Sube tu ZIP de Instagram y ve quién no te sigue de vuelta. Gratis, la lista sin muro de pago.',
      pt: 'Envie seu ZIP do Instagram e veja quem não te segue de volta. Grátis, sem paywall na lista.',
    },
  },
  {
    slug: 'whounfollowed-vs-unfollowify',
    competitorName: 'Unfollowify',
    title: {
      en: 'WhoUnfollowed vs Unfollowify',
      es: 'WhoUnfollowed vs Unfollowify',
      pt: 'WhoUnfollowed vs Unfollowify',
    },
    metaTitle: {
      en: 'WhoUnfollowed vs Unfollowify for Instagram',
      es: 'WhoUnfollowed vs Unfollowify para Instagram',
      pt: 'WhoUnfollowed vs Unfollowify para Instagram',
    },
    metaDescription: {
      en: 'Unfollowify and WhoUnfollowed both skip your Instagram password and read your export. Compare devices, pricing, open source and what each adds on top.',
      es: 'Unfollowify y WhoUnfollowed no piden tu contraseña de Instagram y leen tu export. Compara dispositivos, precio, código abierto y lo que añade cada uno.',
      pt: 'O Unfollowify e o WhoUnfollowed não pedem sua senha do Instagram e leem seu export. Compare aparelhos, preço, código aberto e o que cada um adiciona.',
    },
    excerpt: {
      en: 'Unfollowify is a newer no-password app for iPhone and Android that reads your Instagram export. Here is how it compares with WhoUnfollowed.',
      es: 'Unfollowify es una app más nueva para iPhone y Android que lee tu export de Instagram sin contraseña. Así se compara con WhoUnfollowed.',
      pt: 'O Unfollowify é um app mais novo para iPhone e Android que lê seu export do Instagram sem senha. Veja como ele se compara ao WhoUnfollowed.',
    },
    rows: [
      { feature: { en: 'Requires Instagram password', es: 'Requiere contraseña de Instagram', pt: 'Exige senha do Instagram' }, icon: 'lock', us: false, them: false },
      { feature: { en: 'Reads Instagram\'s official export', es: 'Lee el export oficial de Instagram', pt: 'Lê o export oficial do Instagram' }, icon: 'shield', us: true, them: true },
      { feature: { en: 'Open source, code is auditable', es: 'Código abierto, auditable', pt: 'Código aberto, auditável' }, icon: 'code', us: true, them: false },
      { feature: { en: 'Works in any browser, phone or computer', es: 'Funciona en cualquier navegador, móvil u ordenador', pt: 'Funciona em qualquer navegador, celular ou computador' }, icon: 'bolt', us: true, them: false },
      { feature: { en: 'Threads and TikTok exports too', es: 'También exports de Threads y TikTok', pt: 'Também exports do Threads e do TikTok' }, icon: 'bolt', us: true, them: false },
      { feature: { en: 'Coach that drafts, checks and plans your posts', es: 'Coach que escribe, revisa y planifica tus posts', pt: 'Coach que escreve, revisa e planeja seus posts' }, icon: 'bolt', us: true, them: false },
    ],
    body: {
      en: `Unfollowify is a newer iPhone and Android app built on the same idea as WhoUnfollowed: no Instagram login, just the JSON data export you request from Instagram. It also digs into more of the export than most trackers, including saved posts, liked content, comments, your Stories archive, login activity and pending follow requests, and you can try it with sample data while you wait for your export.

Where it differs: Unfollowify is an app you install, and its paid features are an in-app subscription. WhoUnfollowed runs in the browser on any phone or computer, shows who doesn't follow you back free with no account, and its code is open source, so its privacy claims can be checked rather than trusted.

WhoUnfollowed also reads Threads and TikTok exports, not only Instagram. Pro AI adds who unfollowed you by name across exports, and a coach that drafts, checks and plans your posts from your own account.`,
      es: `Unfollowify es una app más nueva para iPhone y Android basada en la misma idea que WhoUnfollowed: sin iniciar sesión en Instagram, solo con el export de datos en JSON que pides a Instagram. Además explora más partes del export que la mayoría, como posts guardados, contenido que te gustó, comentarios, el archivo de tus historias, la actividad de inicio de sesión y las solicitudes de seguimiento pendientes, y puedes probarla con datos de ejemplo mientras llega tu export.

En qué se diferencia: Unfollowify es una app que instalas, y sus funciones de pago son una suscripción dentro de la app. WhoUnfollowed funciona en el navegador de cualquier móvil u ordenador, muestra gratis quién no te sigue de vuelta sin cuenta, y su código es abierto, así que sus promesas de privacidad se pueden comprobar en lugar de creerlas.

WhoUnfollowed también lee exports de Threads y TikTok, no solo de Instagram. Pro AI añade por nombre quién te dejó de seguir entre exports, y un coach que escribe, revisa y planifica tus posts desde tu propia cuenta.`,
      pt: `O Unfollowify é um app mais novo para iPhone e Android com a mesma ideia do WhoUnfollowed: sem login no Instagram, só o export de dados em JSON que você pede ao Instagram. Ele também explora mais partes do export do que a maioria, como posts salvos, conteúdo curtido, comentários, o arquivo dos seus stories, atividade de login e pedidos para seguir pendentes, e dá para testar com dados de exemplo enquanto o export não chega.

Onde ele difere: o Unfollowify é um app que você instala, e os recursos pagos são uma assinatura dentro do app. O WhoUnfollowed roda no navegador de qualquer celular ou computador, mostra de graça quem não te segue de volta sem conta, e o código é aberto, então as promessas de privacidade podem ser conferidas em vez de só acreditadas.

O WhoUnfollowed também lê exports do Threads e do TikTok, não só do Instagram. O Pro AI adiciona pelo nome quem deixou de te seguir entre exports, e um coach que escreve, revisa e planeja seus posts a partir da sua própria conta.`,
    },
    verdict: {
      en: 'Unfollowify is a solid no-password app if you want a native install and extra details from your export. WhoUnfollowed gives you the core lists free in any browser, covers Threads and TikTok, is open source, and adds a coach when you want to grow.',
      es: 'Unfollowify es una buena app sin contraseña si quieres algo instalado y más detalles de tu export. WhoUnfollowed te da las listas principales gratis en cualquier navegador, cubre Threads y TikTok, es de código abierto y añade un coach cuando quieras crecer.',
      pt: 'O Unfollowify é um bom app sem senha se você quer algo instalado e mais detalhes do seu export. O WhoUnfollowed te dá as listas principais de graça em qualquer navegador, cobre Threads e TikTok, é aberto e adiciona um coach quando você quiser crescer.',
    },
    cta: {
      en: 'Upload your Instagram ZIP and see who doesn\'t follow you back. Free, nothing to install.',
      es: 'Sube tu ZIP de Instagram y ve quién no te sigue de vuelta. Gratis, nada que instalar.',
      pt: 'Envie seu ZIP do Instagram e veja quem não te segue de volta. Grátis, nada para instalar.',
    },
  },
];

export function getComparison(slug: string): Comparison | undefined {
  return COMPARISONS.find(c => c.slug === slug);
}
