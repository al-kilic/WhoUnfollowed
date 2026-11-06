import type { AppLocale } from '@/i18n/routing';

// Copy for the "next check" section under the results list: the reminder
// opt-in (everyone) and the Pro offer (free users). Plain strings with
// {placeholders} so it stays easy to translate.
export interface NextCheckContent {
  reminderEyebrow: string;
  reminderTitle: string;
  reminderBody: string;
  reminderPrivacy: string;
  placeholder: string;
  cta: string;
  sending: string;
  error: string;
  disposable: string;
  // {date}
  reminderDone: string;
  reminderAlready: string;

  offerEyebrow: string;
  offerTitle: string;
  offerBody: string;
  // {price}
  offerCta: string;
  // {price}
  offerMonthly: string;
  // {std}
  offerLaunch: string;
  // {n} = non-followers to go through
  bigListHint: string;
  redirecting: string;
  offerError: string;
}

const EN: NextCheckContent = {
  reminderEyebrow: 'Next check',
  reminderTitle: 'Want to know who unfollows you next?',
  reminderBody: 'We\'ll email you in 2 weeks, when a new export is worth it.',
  reminderPrivacy: 'Only your email is stored. Never your followers. One click to stop.',
  placeholder: 'you@email.com',
  cta: 'Remind me',
  sending: 'Saving...',
  error: 'That didn\'t work. Check the address and try again.',
  disposable: 'Please use a regular email address, not a temporary one.',
  reminderDone: 'Done. We\'ll remind you on {date}. Keep this export, you\'ll compare against it.',
  reminderAlready: 'You already have a reminder set. We\'ll email you when it\'s time.',

  offerEyebrow: 'Pro · 1 year',
  offerTitle: 'Your next export will show who left.',
  offerBody: 'Upload again in 2 weeks and see every unfollower by name, with dates. Every export stays saved, so each check builds on the last.',
  offerCta: 'Track for a year · {price}',
  offerMonthly: 'or {price} for one check',
  offerLaunch: 'Launch price. {std} from January 1.',
  bigListHint: '{n} accounts to go through? Pro opens them in batches of 20 and keeps your progress on every device.',
  redirecting: 'Redirecting...',
  offerError: 'Checkout didn\'t start. Please try again.',
};

const ES: NextCheckContent = {
  reminderEyebrow: 'Próxima revisión',
  reminderTitle: '¿Quieres saber quién te deja de seguir después?',
  reminderBody: 'Te escribiremos en 2 semanas, cuando valga la pena una nueva exportación.',
  reminderPrivacy: 'Solo guardamos tu email. Nunca tus seguidores. Un clic para dejarlo.',
  placeholder: 'tu@email.com',
  cta: 'Recuérdamelo',
  sending: 'Guardando...',
  error: 'No funcionó. Revisa el email e inténtalo de nuevo.',
  disposable: 'Usa un correo normal, no uno temporal.',
  reminderDone: 'Listo. Te lo recordaremos el {date}. Guarda esta exportación, compararás con ella.',
  reminderAlready: 'Ya tienes un recordatorio. Te escribiremos cuando toque.',

  offerEyebrow: 'Pro · 1 año',
  offerTitle: 'Tu próxima exportación mostrará quién se fue.',
  offerBody: 'Vuelve a subir en 2 semanas y ve a cada persona que te dejó de seguir, con fechas. Cada exportación queda guardada, así cada revisión suma a la anterior.',
  offerCta: 'Seguimiento por un año · {price}',
  offerMonthly: 'o {price} por una revisión',
  offerLaunch: 'Precio de lanzamiento. {std} desde el 1 de enero.',
  bigListHint: '¿{n} cuentas por revisar? Pro las abre en lotes de 20 y guarda tu progreso en todos tus dispositivos.',
  redirecting: 'Redirigiendo...',
  offerError: 'No se pudo abrir el pago. Inténtalo de nuevo.',
};

const PT: NextCheckContent = {
  reminderEyebrow: 'Próxima conferida',
  reminderTitle: 'Quer saber quem vai deixar de te seguir?',
  reminderBody: 'Vamos te enviar um email em 2 semanas, quando valer a pena uma nova exportação.',
  reminderPrivacy: 'Só guardamos seu email. Nunca seus seguidores. Um clique para parar.',
  placeholder: 'voce@email.com',
  cta: 'Me lembre',
  sending: 'Salvando...',
  error: 'Não funcionou. Confira o email e tente de novo.',
  disposable: 'Use um e-mail normal, não um temporário.',
  reminderDone: 'Pronto. Vamos te lembrar em {date}. Guarde esta exportação, você vai comparar com ela.',
  reminderAlready: 'Você já tem um lembrete. Vamos te avisar quando for a hora.',

  offerEyebrow: 'Pro · 1 ano',
  offerTitle: 'Sua próxima exportação vai mostrar quem saiu.',
  offerBody: 'Envie de novo em 2 semanas e veja cada pessoa que deixou de te seguir, com datas. Cada exportação fica salva, então cada conferida soma à anterior.',
  offerCta: 'Acompanhar por um ano · {price}',
  offerMonthly: 'ou {price} por uma conferida',
  offerLaunch: 'Preço de lançamento. {std} a partir de 1º de janeiro.',
  bigListHint: '{n} contas para revisar? O Pro abre em lotes de 20 e guarda seu progresso em todos os dispositivos.',
  redirecting: 'Redirecionando...',
  offerError: 'O pagamento não abriu. Tente de novo.',
};

export function getNextCheckContent(locale: AppLocale): NextCheckContent {
  if (locale === 'es') return ES;
  if (locale === 'pt') return PT;
  return EN;
}
