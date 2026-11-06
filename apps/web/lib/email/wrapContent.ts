import type { AppLocale } from '@/i18n/routing';

// Copy for the "your 3-month wrap is ready" email. The server knows nothing
// about anyone's followers, so this only points at the wrap. No em dashes.
export interface WrapEmailContent {
  subject: string;
  preview: string;
  title: string;
  body: string;
  bullets: [string, string, string];
  button: string;
  lastExport: string;
  privacyNote: string;
  footer: string;
  unsubscribe: string;
}

const en: WrapEmailContent = {
  subject: 'Your 3-month wrap is ready',
  preview: 'Who found you, who left, and your new verdict. Grab a fresh export to see it.',
  title: 'Three months since you signed up for reminders',
  body: 'Your wrap plays the moment you upload a fresh export: a short story of the last three months on your account.',
  bullets: ['How many people found you, and your best week', 'Who you followed and how many followed back', 'Who left since your last export, and your new verdict'],
  button: 'Get a fresh export',
  lastExport: 'Or play it on the export you already have',
  privacyNote: 'We only know your email address and your sign-up date. The wrap is made in your browser from your own export.',
  footer: 'You get this every 3 months because you asked for reminders on whounfollowed.co. Stopping reminders stops these too.',
  unsubscribe: 'Stop these emails',
};

const es: WrapEmailContent = {
  subject: 'Tu resumen de 3 meses está listo',
  preview: 'Quién te encontró, quién se fue y tu nuevo veredicto. Descarga una exportación nueva para verlo.',
  title: 'Tres meses desde que activaste los recordatorios',
  body: 'Tu resumen se reproduce en cuanto subes una exportación nueva: una historia corta de los últimos tres meses de tu cuenta.',
  bullets: ['Cuántas personas te encontraron, y tu mejor semana', 'A quién seguiste y cuántos te siguieron', 'Quién se fue desde tu última exportación, y tu nuevo veredicto'],
  button: 'Conseguir una exportación nueva',
  lastExport: 'O míralo con la exportación que ya tienes',
  privacyNote: 'Solo sabemos tu email y la fecha en que te apuntaste. El resumen se hace en tu navegador con tu propia exportación.',
  footer: 'Recibes esto cada 3 meses porque pediste recordatorios en whounfollowed.co. Si dejas los recordatorios, también dejas estos.',
  unsubscribe: 'Dejar estos emails',
};

const pt: WrapEmailContent = {
  subject: 'Sua retrospectiva de 3 meses está pronta',
  preview: 'Quem te achou, quem saiu e seu novo veredito. Baixe uma exportação nova para ver.',
  title: 'Três meses desde que você ativou os lembretes',
  body: 'Sua retrospectiva começa assim que você envia uma exportação nova: uma história curta dos últimos três meses da sua conta.',
  bullets: ['Quantas pessoas te acharam, e sua melhor semana', 'Quem você seguiu e quantos seguiram de volta', 'Quem saiu desde a última exportação, e seu novo veredito'],
  button: 'Pegar uma exportação nova',
  lastExport: 'Ou veja com a exportação que você já tem',
  privacyNote: 'Só sabemos seu email e a data em que você se inscreveu. A retrospectiva é feita no seu navegador com a sua exportação.',
  footer: 'Você recebe isto a cada 3 meses porque pediu lembretes no whounfollowed.co. Parar os lembretes para estes também.',
  unsubscribe: 'Parar estes emails',
};

const all: Record<AppLocale, WrapEmailContent> = { en, es, pt };
export const getWrapEmailContent = (locale: AppLocale) => all[locale];
