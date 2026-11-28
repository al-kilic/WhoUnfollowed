import type { AppLocale } from '@/i18n/routing';

// The story panel next to the sign-in forms (AuthPanel.tsx). One message per
// screen; the proof points are the same everywhere and are all true today.

export type AuthVariant = 'signup' | 'login' | 'forgot' | 'reset' | 'verify' | 'welcome' | 'unsubscribe';

interface Line { eyebrow: string; title: string; body: string }

export interface AuthPanelCopy {
  screens: Record<AuthVariant, Line>;
  proofs: [string, string, string];
  card: { title: string; left: string; joined: string };
  art: string;
}

const en: AuthPanelCopy = {
  screens: {
    signup: { eyebrow: 'Free account', title: 'See who left. Then grow from there.', body: 'Keep your exports, get a reminder when it is time to check again, and open your Studio whenever you like.' },
    login: { eyebrow: 'Welcome back', title: 'Your Studio is where you left it.', body: 'Your exports, your lists and your plan are waiting. Sign in and pick up where you stopped.' },
    forgot: { eyebrow: 'No stress', title: 'A new password in a minute.', body: 'Enter your email and we send you a link. Your exports on this device stay exactly as they are.' },
    reset: { eyebrow: 'Almost there', title: 'Pick a new password, then straight back in.', body: 'Use something you do not use anywhere else. It only protects your WhoUnfollowed account.' },
    verify: { eyebrow: 'One last step', title: 'One code and you are in.', body: 'Check your inbox for the 6-digit code. It keeps your account yours.' },
    welcome: { eyebrow: 'Pro AI is ready', title: 'Set a password and meet your coach.', body: 'Your plan is active. One password and your Studio opens with everything Pro AI includes.' },
    unsubscribe: { eyebrow: 'Your inbox, your call', title: 'Fewer emails, same app.', body: 'Unsubscribing only changes what we send you. Your account and your exports stay as they are.' },
  },
  proofs: ['No Instagram password, ever', 'Your export is read in this browser', 'Open source, so anyone can check'],
  card: { title: 'Since your last export', left: 'Left', joined: 'New' },
  art: 'Your followers as a small network around you. A few fade out: the ones who left.',
};

const es: AuthPanelCopy = {
  screens: {
    signup: { eyebrow: 'Cuenta gratis', title: 'Mira quién se fue. Y crece desde ahí.', body: 'Guarda tus exportaciones, recibe un aviso cuando toque revisar otra vez y abre tu Studio cuando quieras.' },
    login: { eyebrow: 'Hola de nuevo', title: 'Tu Studio está como lo dejaste.', body: 'Tus exportaciones, tus listas y tu plan te esperan. Inicia sesión y sigue donde quedaste.' },
    forgot: { eyebrow: 'Sin estrés', title: 'Una contraseña nueva en un minuto.', body: 'Escribe tu email y te enviamos un enlace. Tus exportaciones en este dispositivo quedan igual.' },
    reset: { eyebrow: 'Casi listo', title: 'Elige una contraseña nueva y vuelve a entrar.', body: 'Usa una que no uses en otro sitio. Solo protege tu cuenta de WhoUnfollowed.' },
    verify: { eyebrow: 'Un último paso', title: 'Un código y ya estás dentro.', body: 'Busca en tu correo el código de 6 dígitos. Así tu cuenta sigue siendo tuya.' },
    welcome: { eyebrow: 'Pro AI está listo', title: 'Crea una contraseña y conoce a tu coach.', body: 'Tu plan está activo. Una contraseña y tu Studio se abre con todo lo que incluye Pro AI.' },
    unsubscribe: { eyebrow: 'Tu correo, tu decisión', title: 'Menos emails, la misma app.', body: 'Darte de baja solo cambia lo que te enviamos. Tu cuenta y tus exportaciones quedan igual.' },
  },
  proofs: ['Nunca tu contraseña de Instagram', 'Tu exportación se lee en este navegador', 'Código abierto, cualquiera puede revisarlo'],
  card: { title: 'Desde tu última exportación', left: 'Se fue', joined: 'Nuevo' },
  art: 'Tus seguidores como una pequeña red a tu alrededor. Algunos se desvanecen: los que se fueron.',
};

const pt: AuthPanelCopy = {
  screens: {
    signup: { eyebrow: 'Conta grátis', title: 'Veja quem saiu. E cresça a partir daí.', body: 'Guarde seus exports, receba um lembrete quando for hora de checar de novo e abra seu Studio quando quiser.' },
    login: { eyebrow: 'Que bom te ver', title: 'Seu Studio está como você deixou.', body: 'Seus exports, suas listas e seu plano estão esperando. Entre e continue de onde parou.' },
    forgot: { eyebrow: 'Sem estresse', title: 'Uma senha nova em um minuto.', body: 'Digite seu email e enviamos um link. Seus exports neste aparelho continuam iguais.' },
    reset: { eyebrow: 'Quase lá', title: 'Escolha uma senha nova e entre de novo.', body: 'Use uma que você não usa em outro lugar. Ela só protege sua conta do WhoUnfollowed.' },
    verify: { eyebrow: 'Último passo', title: 'Um código e você entra.', body: 'Procure no seu email o código de 6 dígitos. Assim sua conta continua sua.' },
    welcome: { eyebrow: 'O Pro AI está pronto', title: 'Crie uma senha e conheça seu coach.', body: 'Seu plano está ativo. Uma senha e seu Studio abre com tudo o que o Pro AI inclui.' },
    unsubscribe: { eyebrow: 'Seu email, sua escolha', title: 'Menos emails, o mesmo app.', body: 'Cancelar a inscrição só muda o que enviamos. Sua conta e seus exports continuam iguais.' },
  },
  proofs: ['Nunca a sua senha do Instagram', 'Seu export é lido neste navegador', 'Código aberto, qualquer um pode conferir'],
  card: { title: 'Desde o seu último export', left: 'Saiu', joined: 'Novo' },
  art: 'Seus seguidores como uma pequena rede ao seu redor. Alguns somem: os que saíram.',
};

const ALL: Record<AppLocale, AuthPanelCopy> = { en, es, pt };
export const getAuthPanelCopy = (locale: string): AuthPanelCopy => ALL[locale as AppLocale] ?? en;

// Which screen the shell is on, from the path (/es/signup, /login, ...).
export function variantFromPath(path: string | null): AuthVariant {
  const p = path ?? '';
  if (p.includes('/signup')) return 'signup';
  if (p.includes('/forgot-password')) return 'forgot';
  if (p.includes('/reset-password')) return 'reset';
  if (p.includes('/verify-email')) return 'verify';
  if (p.includes('/welcome')) return 'welcome';
  if (p.includes('/unsubscribe')) return 'unsubscribe';
  return 'login';
}
