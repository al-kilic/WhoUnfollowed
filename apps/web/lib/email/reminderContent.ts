import type { AppLocale } from '@/i18n/routing';

// Copy for the "time to check again" reminder emails (lib/reminders). Kept
// apart from content.ts, which holds the account and purchase emails. No em
// dashes, same voice as the rest of the site.
export interface ReminderEmailContent {
  confirmSubject: string;
  confirmPreview: string;
  confirmTitle: string;
  confirmBody: (dateLabel: string) => string;
  confirmTip: string;

  subjects: [first: string, second: string, monthly: string];
  previews: [first: string, second: string, monthly: string];
  titles: [first: string, second: string, monthly: string];
  body: string;
  steps: [string, string, string];
  button: string;
  privacyNote: string;

  footer: string;
  unsubscribe: string;
}

const en: ReminderEmailContent = {
  confirmSubject: 'Reminder set. We will tell you when to check again',
  confirmPreview: 'Your first reminder is on its way in 2 weeks.',
  confirmTitle: 'You are set',
  confirmBody: (date) => `We will email you on ${date}, when a new export can show who unfollowed you since your last check.`,
  confirmTip: 'Tip: keep the export you just uploaded. Comparing two exports is how you see exactly who left.',

  subjects: [
    '2 weeks since your last check. Who left?',
    'A month since your last check',
    'Time for your monthly follower check',
  ],
  previews: [
    'A fresh export shows who unfollowed you since last time.',
    'See who unfollowed you this month. Takes about 2 minutes to request.',
    'Your monthly reminder to see who left.',
  ],
  titles: [
    'Time to check who left',
    'A month has passed',
    'Your monthly check',
  ],
  body: 'A new Instagram export, compared with your last one, shows exactly who unfollowed you and who followed you since.',
  steps: [
    'Request a new export from Instagram (JSON, Followers and following, All time).',
    'Wait for Instagram to email it. Usually minutes, sometimes a few hours.',
    'Upload the ZIP. It is compared with your last one, right in your browser.',
  ],
  button: 'Show me how to request it',
  privacyNote: 'We only know your email address and when to remind you. Your followers never leave your browser.',

  footer: 'You get this because you asked to be reminded on whounfollowed.co.',
  unsubscribe: 'Stop these reminders',
};

const es: ReminderEmailContent = {
  confirmSubject: 'Recordatorio activado. Te avisaremos cuándo volver a revisar',
  confirmPreview: 'Tu primer recordatorio llega en 2 semanas.',
  confirmTitle: 'Listo',
  confirmBody: (date) => `Te escribiremos el ${date}, cuando una nueva exportación pueda mostrar quién te dejó de seguir desde tu última revisión.`,
  confirmTip: 'Consejo: guarda la exportación que acabas de subir. Comparar dos exportaciones es la forma de ver exactamente quién se fue.',

  subjects: [
    '2 semanas desde tu última revisión. ¿Quién se fue?',
    'Un mes desde tu última revisión',
    'Hora de tu revisión mensual de seguidores',
  ],
  previews: [
    'Una exportación nueva muestra quién te dejó de seguir desde la última vez.',
    'Mira quién te dejó de seguir este mes. Pedirla toma unos 2 minutos.',
    'Tu recordatorio mensual para ver quién se fue.',
  ],
  titles: [
    'Hora de ver quién se fue',
    'Ya pasó un mes',
    'Tu revisión mensual',
  ],
  body: 'Una nueva exportación de Instagram, comparada con la anterior, muestra exactamente quién te dejó de seguir y quién empezó a seguirte.',
  steps: [
    'Pide una nueva exportación a Instagram (JSON, Seguidores y seguidos, Desde el principio).',
    'Espera el email de Instagram. Suele tardar minutos, a veces unas horas.',
    'Sube el ZIP. Se compara con el anterior, dentro de tu navegador.',
  ],
  button: 'Enséñame a pedirla',
  privacyNote: 'Solo sabemos tu email y cuándo recordártelo. Tus seguidores nunca salen de tu navegador.',

  footer: 'Recibes esto porque pediste un recordatorio en whounfollowed.co.',
  unsubscribe: 'Dejar de recibir recordatorios',
};

const pt: ReminderEmailContent = {
  confirmSubject: 'Lembrete ativado. Vamos avisar quando conferir de novo',
  confirmPreview: 'Seu primeiro lembrete chega em 2 semanas.',
  confirmTitle: 'Tudo certo',
  confirmBody: (date) => `Vamos te enviar um email em ${date}, quando uma nova exportação puder mostrar quem deixou de te seguir desde a última vez.`,
  confirmTip: 'Dica: guarde a exportação que você acabou de enviar. Comparar duas exportações é como você vê exatamente quem saiu.',

  subjects: [
    '2 semanas desde a última conferida. Quem saiu?',
    'Um mês desde a última conferida',
    'Hora da sua conferida mensal de seguidores',
  ],
  previews: [
    'Uma exportação nova mostra quem deixou de te seguir desde a última vez.',
    'Veja quem deixou de te seguir este mês. Pedir leva uns 2 minutos.',
    'Seu lembrete mensal para ver quem saiu.',
  ],
  titles: [
    'Hora de ver quem saiu',
    'Já se passou um mês',
    'Sua conferida mensal',
  ],
  body: 'Uma nova exportação do Instagram, comparada com a anterior, mostra exatamente quem deixou de te seguir e quem começou a seguir.',
  steps: [
    'Peça uma nova exportação ao Instagram (JSON, Seguidores e seguindo, Desde o início).',
    'Espere o email do Instagram. Costuma levar minutos, às vezes algumas horas.',
    'Envie o ZIP. Ele é comparado com o anterior, dentro do seu navegador.',
  ],
  button: 'Me mostre como pedir',
  privacyNote: 'Só sabemos seu email e quando te lembrar. Seus seguidores nunca saem do seu navegador.',

  footer: 'Você recebe isto porque pediu um lembrete no whounfollowed.co.',
  unsubscribe: 'Parar estes lembretes',
};

const all: Record<AppLocale, ReminderEmailContent> = { en, es, pt };

export function getReminderEmailContent(locale: AppLocale): ReminderEmailContent {
  return all[locale];
}
