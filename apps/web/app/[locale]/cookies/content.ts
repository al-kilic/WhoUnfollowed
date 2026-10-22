import type { AppLocale } from '@/i18n/routing';

export interface CookiesContent {
  eyebrow: string;
  headline: string;
  lastUpdated: string;
  s1Title: string; s1Body: string;
  s2Title: string; s2Bold: string; s2Body1: string; s2Body2: string;
  s3Title: string; s3Body1: string; s3Bold: string; s3Body2Pre: string; s3Body2Post: string;
  s4Title: string; s4Body: string;
  backToHome: string;
}

const EN: CookiesContent = {
  eyebrow: 'LEGAL',
  headline: 'Cookie Policy',
  lastUpdated: 'Last updated: October 22, 2026',
  s1Title: 'What are Cookies?',
  s1Body: 'Cookies are small text files stored on your device by your web browser. They are commonly used to remember preferences, keep you logged in, or track behavior for analytics and advertising.',
  s2Title: 'How We Use Cookies',
  s2Bold: 'We do not use tracking or advertising cookies.',
  s2Body1: 'WhoUnfollowed is designed to be privacy-first. We use standard browser features like Local Storage and IndexedDB to save your snapshots locally on your machine, and to remember small settings such as your theme, whether you have seen the feature tour or an explainer, and the state of the feedback panel. If you use cloud sync, the encryption key derived from your password is kept in session storage for the current tab only and is cleared when you close it. None of this is transmitted to us.',
  s2Body2: 'We set two first-party cookies, both functional. If you sign in to your account (free or Pro), a "session cookie" keeps you logged in; it is strictly necessary for the account system. A NEXT_LOCALE cookie remembers your language so the site does not switch languages on every visit; it contains only a language code such as "en".',
  s3Title: 'Third-Party Cookies',
  s3Body1: 'We do not load third-party scripts that set cookies (like Facebook Pixel or Google Analytics).',
  s3Bold: 'does not use cookies',
  s3Body2Pre: 'We use a self-hosted instance of Umami, a privacy-friendly analytics tool that',
  s3Body2Post: 'and does not track you across different websites.',
  s4Title: 'Managing Your Data',
  s4Body: 'You can clear all data stored by WhoUnfollowed at any time by clearing your browser\'s site data or "cookies" for this domain. This will remove any saved snapshots stored in your browser.',
  backToHome: 'Back to WhoUnfollowed',
};

const ES: CookiesContent = {
  eyebrow: 'LEGAL',
  headline: 'Política de Cookies',
  lastUpdated: 'Última actualización: 22 de octubre de 2026',
  s1Title: '¿Qué son las Cookies?',
  s1Body: 'Las cookies son pequeños archivos de texto que tu navegador almacena en tu dispositivo. Se usan comúnmente para recordar preferencias, mantenerte conectado, o rastrear comportamiento con fines de analítica y publicidad.',
  s2Title: 'Cómo usamos las Cookies',
  s2Bold: 'No usamos cookies de seguimiento ni publicitarias.',
  s2Body1: 'WhoUnfollowed está diseñado para priorizar la privacidad. Usamos funciones estándar del navegador como Local Storage e IndexedDB para guardar tus snapshots localmente en tu equipo, y para recordar ajustes pequeños como tu tema, si ya viste el recorrido o una explicación, y el estado del panel de opiniones. Si usas la sincronización en la nube, la clave de cifrado derivada de tu contraseña se guarda en el almacenamiento de sesión solo para la pestaña actual y se borra al cerrarla. Nada de esto se nos transmite.',
  s2Body2: 'Usamos dos cookies propias, ambas funcionales. Si inicias sesión en tu cuenta (gratuita o Pro), una "cookie de sesión" te mantiene conectado; es estrictamente necesaria para el sistema de cuentas. Una cookie NEXT_LOCALE recuerda tu idioma para que el sitio no cambie de idioma en cada visita; solo contiene un código de idioma como "es".',
  s3Title: 'Cookies de terceros',
  s3Body1: 'No cargamos scripts de terceros que instalen cookies (como Facebook Pixel o Google Analytics).',
  s3Bold: 'no usa cookies',
  s3Body2Pre: 'Usamos una instancia autoalojada de Umami, una herramienta de analítica respetuosa con la privacidad que',
  s3Body2Post: 'y no te rastrea en otros sitios web.',
  s4Title: 'Gestión de tus datos',
  s4Body: 'Puedes borrar todos los datos almacenados por WhoUnfollowed en cualquier momento eliminando los datos del sitio o las "cookies" de tu navegador para este dominio. Esto eliminará cualquier snapshot guardado en tu navegador.',
  backToHome: 'Volver a WhoUnfollowed',
};

const PT: CookiesContent = {
  eyebrow: 'LEGAL',
  headline: 'Política de Cookies',
  lastUpdated: 'Última atualização: 22 de outubro de 2026',
  s1Title: 'O que são Cookies?',
  s1Body: 'Cookies são pequenos arquivos de texto armazenados no seu dispositivo pelo seu navegador. São comumente usados para lembrar preferências, manter você conectado, ou rastrear comportamento para fins de análise e publicidade.',
  s2Title: 'Como usamos Cookies',
  s2Bold: 'Não usamos cookies de rastreamento ou publicidade.',
  s2Body1: 'O WhoUnfollowed foi projetado para priorizar a privacidade. Usamos recursos padrão do navegador, como Local Storage e IndexedDB, para salvar seus snapshots localmente na sua máquina e lembrar pequenas configurações, como o seu tema, se você já viu o tour ou uma explicação, e o estado do painel de feedback. Se você usa a sincronização na nuvem, a chave de criptografia derivada da sua senha fica no armazenamento de sessão apenas para a aba atual e é apagada quando você a fecha. Nada disso é transmitido para nós.',
  s2Body2: 'Usamos dois cookies próprios, ambos funcionais. Se você fizer login na sua conta (gratuita ou Pro), um "cookie de sessão" mantém você conectado; ele é estritamente necessário para o sistema de contas. Um cookie NEXT_LOCALE lembra o seu idioma para que o site não mude de idioma a cada visita; ele contém apenas um código de idioma como "pt".',
  s3Title: 'Cookies de terceiros',
  s3Body1: 'Não carregamos scripts de terceiros que definem cookies (como Facebook Pixel ou Google Analytics).',
  s3Bold: 'não usa cookies',
  s3Body2Pre: 'Usamos uma instância auto-hospedada do Umami, uma ferramenta de análise que respeita a privacidade e que',
  s3Body2Post: 'e não rastreia você em diferentes sites.',
  s4Title: 'Gerenciando seus dados',
  s4Body: 'Você pode limpar todos os dados armazenados pelo WhoUnfollowed a qualquer momento limpando os dados do site ou "cookies" deste domínio no seu navegador. Isso removerá quaisquer snapshots salvos armazenados no seu navegador.',
  backToHome: 'Voltar ao WhoUnfollowed',
};

export function getCookiesContent(locale: AppLocale): CookiesContent {
  if (locale === 'es') return ES;
  if (locale === 'pt') return PT;
  return EN;
}
