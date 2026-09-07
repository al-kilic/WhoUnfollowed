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
  lastUpdated: 'Last updated: May 5, 2026',
  s1Title: 'What are Cookies?',
  s1Body: 'Cookies are small text files stored on your device by your web browser. They are commonly used to remember preferences, keep you logged in, or track behavior for analytics and advertising.',
  s2Title: 'How We Use Cookies',
  s2Bold: 'We do not use tracking or advertising cookies.',
  s2Body1: 'WhoUnfollowed is designed to be privacy-first. We use standard browser features like Local Storage and IndexedDB to save your snapshots locally on your machine. These are not transmitted to us.',
  s2Body2: 'If you sign in to a Pro account, we use a single "session cookie" to keep you logged in. This cookie is strictly necessary for the operation of the account system.',
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
  lastUpdated: 'Última actualización: 5 de mayo de 2026',
  s1Title: '¿Qué son las Cookies?',
  s1Body: 'Las cookies son pequeños archivos de texto que tu navegador almacena en tu dispositivo. Se usan comúnmente para recordar preferencias, mantenerte conectado, o rastrear comportamiento con fines de analítica y publicidad.',
  s2Title: 'Cómo usamos las Cookies',
  s2Bold: 'No usamos cookies de seguimiento ni publicitarias.',
  s2Body1: 'WhoUnfollowed está diseñado para priorizar la privacidad. Usamos funciones estándar del navegador como Local Storage e IndexedDB para guardar tus snapshots localmente en tu equipo. Estas no se nos transmiten.',
  s2Body2: 'Si inicias sesión en una cuenta Pro, usamos una única "cookie de sesión" para mantenerte conectado. Esta cookie es estrictamente necesaria para el funcionamiento del sistema de cuentas.',
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
  lastUpdated: 'Última atualização: 5 de maio de 2026',
  s1Title: 'O que são Cookies?',
  s1Body: 'Cookies são pequenos arquivos de texto armazenados no seu dispositivo pelo seu navegador. São comumente usados para lembrar preferências, manter você conectado, ou rastrear comportamento para fins de análise e publicidade.',
  s2Title: 'Como usamos Cookies',
  s2Bold: 'Não usamos cookies de rastreamento ou publicidade.',
  s2Body1: 'O WhoUnfollowed foi projetado para priorizar a privacidade. Usamos recursos padrão do navegador, como Local Storage e IndexedDB, para salvar seus snapshots localmente na sua máquina. Eles não são transmitidos para nós.',
  s2Body2: 'Se você fizer login em uma conta Pro, usamos um único "cookie de sessão" para manter você conectado. Esse cookie é estritamente necessário para o funcionamento do sistema de contas.',
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
