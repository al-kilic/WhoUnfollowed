import type { AppLocale } from '@/i18n/routing';

export interface UnsubscribeContent {
  metaTitle: string;
  title: string;
  body: string;
  button: string;
  working: string;
  doneTitle: string;
  doneBody: string;
  missing: string;
  failed: string;
  backHome: string;
}

const EN: UnsubscribeContent = {
  metaTitle: 'Stop reminder emails',
  title: 'Stop reminder emails?',
  body: 'You will no longer get the "time to check again" emails. You can turn them back on any time from the results page or your account.',
  button: 'Stop reminders',
  working: 'Stopping...',
  doneTitle: 'Done. No more reminders.',
  doneBody: 'We removed you from reminder emails. Your account and data are untouched.',
  missing: 'This link is incomplete. Use the link from the email again.',
  failed: 'That link did not work. It may be old or already used. Write to us from the contact page and we will remove you by hand.',
  backHome: 'Back to WhoUnfollowed',
};

const ES: UnsubscribeContent = {
  metaTitle: 'Dejar los recordatorios',
  title: '¿Dejar de recibir recordatorios?',
  body: 'Ya no recibirás los emails de "hora de revisar de nuevo". Puedes volver a activarlos cuando quieras desde la página de resultados o tu cuenta.',
  button: 'Dejar los recordatorios',
  working: 'Desactivando...',
  doneTitle: 'Listo. No más recordatorios.',
  doneBody: 'Te quitamos de los emails de recordatorio. Tu cuenta y tus datos siguen igual.',
  missing: 'Este enlace está incompleto. Usa de nuevo el enlace del email.',
  failed: 'Ese enlace no funcionó. Puede ser antiguo o ya usado. Escríbenos desde la página de contacto y te quitamos a mano.',
  backHome: 'Volver a WhoUnfollowed',
};

const PT: UnsubscribeContent = {
  metaTitle: 'Parar os lembretes',
  title: 'Parar os emails de lembrete?',
  body: 'Você não vai mais receber os emails de "hora de conferir de novo". Pode reativar quando quiser na página de resultados ou na sua conta.',
  button: 'Parar lembretes',
  working: 'Parando...',
  doneTitle: 'Pronto. Sem mais lembretes.',
  doneBody: 'Tiramos você dos emails de lembrete. Sua conta e seus dados continuam iguais.',
  missing: 'Este link está incompleto. Use de novo o link do email.',
  failed: 'Esse link não funcionou. Pode ser antigo ou já usado. Escreva para nós pela página de contato e removemos você manualmente.',
  backHome: 'Voltar ao WhoUnfollowed',
};

export function getUnsubscribeContent(locale: AppLocale): UnsubscribeContent {
  if (locale === 'es') return ES;
  if (locale === 'pt') return PT;
  return EN;
}
