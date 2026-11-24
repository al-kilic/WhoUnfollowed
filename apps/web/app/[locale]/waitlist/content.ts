import type { AppLocale } from '@/i18n/routing';

// Copy for /waitlist: the "something big is coming" page the sitewide strip
// links to. Joining creates a free account. Teases what's coming without
// prices, dates or names that could change before launch.
export interface WaitlistFeature {
  title: string;
  body: string;
}

export interface WaitlistContent {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  lead: string;
  features: WaitlistFeature[];
  trust: string[];
  formTitle: string;
  formSubtitle: string;
  submit: string;
  submitting: string;
  consent: string;
  haveAccountPre: string;
  logIn: string;
  emailTaken: string;
  signedInAs: string;
  join: string;
  joining: string;
  joinError: string;
  doneTitle: string;
  doneBody: string;
  doneCta: string;
}

const EN: WaitlistContent = {
  metaTitle: 'Something big is coming: join the waitlist',
  metaDescription: 'New WhoUnfollowed tools that help you grow on Instagram and Threads, not just track. Join the waitlist with a free account and get in first.',
  eyebrow: 'Coming very soon',
  title: 'Something big is coming to WhoUnfollowed.',
  lead: 'Seeing who left was step one. Next: tools that show you why, and what to post to grow. Join the waitlist with a free account and you get in first.',
  features: [
    { title: 'A coach for your account', body: 'Ask anything about your followers and posts. Answers come from your own data, not generic tips.' },
    { title: 'What to post next', body: 'Ideas and a weekly plan shaped by what already works for you.' },
    { title: 'Growth radar', body: 'See which posts, days and formats bring followers in, and which push them out.' },
    { title: 'Proof it worked', body: 'Follow every change over time and see what actually moved your numbers.' },
  ],
  trust: ['No Instagram password, ever', 'Open source', 'Free account, no card'],
  formTitle: 'Get in first',
  formSubtitle: 'Create a free account and you\'re on the list. The free tools you use today stay free.',
  submit: 'Create free account and join',
  submitting: 'Creating your account...',
  consent: 'We\'ll email you when it opens. Leave the list any time.',
  haveAccountPre: 'Already have an account?',
  logIn: 'Log in',
  emailTaken: 'You already have an account. Log in, then open this page again to join with one click.',
  signedInAs: 'Signed in as',
  join: 'Join the waitlist',
  joining: 'Joining...',
  joinError: 'That didn\'t work. Try again in a moment.',
  doneTitle: 'You\'re on the list.',
  doneBody: 'We\'ll email you the day it opens. Your free account works now: upload an export any time.',
  doneCta: 'Upload an export',
};

const ES: WaitlistContent = {
  metaTitle: 'Algo grande se acerca: únete a la lista',
  metaDescription: 'Nuevas herramientas de WhoUnfollowed para crecer en Instagram y Threads, no solo medir. Únete a la lista con una cuenta gratis y entra primero.',
  eyebrow: 'Muy pronto',
  title: 'Algo grande llega a WhoUnfollowed.',
  lead: 'Ver quién se fue era el primer paso. Lo siguiente: herramientas que te muestran por qué, y qué publicar para crecer. Únete a la lista con una cuenta gratis y entra primero.',
  features: [
    { title: 'Un coach para tu cuenta', body: 'Pregunta lo que quieras sobre tus seguidores y publicaciones. Las respuestas salen de tus propios datos, no de consejos genéricos.' },
    { title: 'Qué publicar ahora', body: 'Ideas y un plan semanal basados en lo que ya te funciona.' },
    { title: 'Radar de crecimiento', body: 'Mira qué publicaciones, días y formatos atraen seguidores, y cuáles los alejan.' },
    { title: 'Prueba de que funcionó', body: 'Sigue cada cambio en el tiempo y mira qué movió de verdad tus números.' },
  ],
  trust: ['Nunca tu contraseña de Instagram', 'Código abierto', 'Cuenta gratis, sin tarjeta'],
  formTitle: 'Entra primero',
  formSubtitle: 'Crea una cuenta gratis y ya estás en la lista. Las herramientas gratis que usas hoy siguen gratis.',
  submit: 'Crear cuenta gratis y unirme',
  submitting: 'Creando tu cuenta...',
  consent: 'Te escribiremos cuando abra. Sal de la lista cuando quieras.',
  haveAccountPre: '¿Ya tienes una cuenta?',
  logIn: 'Iniciar sesión',
  emailTaken: 'Ya tienes una cuenta. Inicia sesión y vuelve a esta página para unirte con un clic.',
  signedInAs: 'Sesión iniciada como',
  join: 'Unirme a la lista',
  joining: 'Uniéndote...',
  joinError: 'No funcionó. Inténtalo de nuevo en un momento.',
  doneTitle: 'Estás en la lista.',
  doneBody: 'Te escribiremos el día que abra. Tu cuenta gratis ya funciona: sube una exportación cuando quieras.',
  doneCta: 'Subir una exportación',
};

const PT: WaitlistContent = {
  metaTitle: 'Algo grande está chegando: entre na lista',
  metaDescription: 'Novas ferramentas do WhoUnfollowed para crescer no Instagram e no Threads, não só acompanhar. Entre na lista com uma conta grátis e tenha acesso primeiro.',
  eyebrow: 'Em breve',
  title: 'Algo grande está chegando ao WhoUnfollowed.',
  lead: 'Ver quem saiu era o primeiro passo. O próximo: ferramentas que mostram o porquê, e o que postar para crescer. Entre na lista com uma conta grátis e tenha acesso primeiro.',
  features: [
    { title: 'Um coach para sua conta', body: 'Pergunte o que quiser sobre seus seguidores e posts. As respostas vêm dos seus próprios dados, não de dicas genéricas.' },
    { title: 'O que postar agora', body: 'Ideias e um plano semanal baseados no que já funciona para você.' },
    { title: 'Radar de crescimento', body: 'Veja quais posts, dias e formatos trazem seguidores, e quais os afastam.' },
    { title: 'Prova de que funcionou', body: 'Acompanhe cada mudança ao longo do tempo e veja o que realmente mexeu nos seus números.' },
  ],
  trust: ['Nunca sua senha do Instagram', 'Código aberto', 'Conta grátis, sem cartão'],
  formTitle: 'Tenha acesso primeiro',
  formSubtitle: 'Crie uma conta grátis e você já está na lista. As ferramentas grátis que você usa hoje continuam grátis.',
  submit: 'Criar conta grátis e entrar',
  submitting: 'Criando sua conta...',
  consent: 'Vamos te avisar por email quando abrir. Saia da lista quando quiser.',
  haveAccountPre: 'Já tem uma conta?',
  logIn: 'Entrar',
  emailTaken: 'Você já tem uma conta. Entre e abra esta página de novo para entrar na lista com um clique.',
  signedInAs: 'Conectado como',
  join: 'Entrar na lista',
  joining: 'Entrando...',
  joinError: 'Não funcionou. Tente de novo em um instante.',
  doneTitle: 'Você está na lista.',
  doneBody: 'Vamos te avisar no dia em que abrir. Sua conta grátis já funciona: envie uma exportação quando quiser.',
  doneCta: 'Enviar uma exportação',
};

export function getWaitlistContent(locale: AppLocale): WaitlistContent {
  if (locale === 'es') return ES;
  if (locale === 'pt') return PT;
  return EN;
}
