import type { AppLocale } from '@/i18n/routing';

// Studio > Plan and You > Settings: calendar feed and posting reminders.
export interface PlanRemindersContent {
  title: string; addCal: string; why: string; turnOn: string; working: string; error: string;
  google: string; apple: string; outlook: string; copy: string; copied: string;
  rotate: string; revoke: string; manage: string; privateNote: string; rotateNote: string;
  emailTitle: string; emailWhy: string; dayOf: string; dayBefore: string; when: string; sampleNote: string;
  calWay: string; emailWay: string;
}

const en: PlanRemindersContent = {
  title: 'Calendar and reminders', addCal: 'Add to my calendar',
  why: 'Subscribe once. Your calendar then follows the plan by itself: moved posts, edits and new plans show up on their own.',
  turnOn: 'Get my calendar link', working: 'Working on it', error: 'Could not update the link. Try again.',
  google: 'Google Calendar', apple: 'Apple Calendar', outlook: 'Outlook', copy: 'Copy link', copied: 'Copied',
  rotate: 'Make a new link', revoke: 'Turn off the link', manage: 'Manage in You, Settings',
  privateNote: 'This link is private. Anyone who has it can see the post ideas in your plan.',
  rotateNote: 'A new link stops the old one, for example if you shared it by mistake.',
  emailTitle: 'Email reminder', emailWhy: 'An email on your posting days, if you prefer it to a calendar.',
  dayOf: 'On the day', dayBefore: 'The day before', when: 'When', sampleNote: 'Calendar links work with your own plan once you have Pro AI.',
  calWay: 'Calendar: one tap, then every post sits in the calendar you already use.',
  emailWay: 'Email: one message on each posting day, nothing to install.',
};

const es: PlanRemindersContent = {
  title: 'Calendario y avisos', addCal: 'Añadir a mi calendario',
  why: 'Suscríbete una vez. Tu calendario sigue el plan solo: los posts que muevas, los cambios y los planes nuevos aparecen sin hacer nada.',
  turnOn: 'Obtener mi enlace de calendario', working: 'Un momento', error: 'No pudimos actualizar el enlace. Inténtalo de nuevo.',
  google: 'Google Calendar', apple: 'Calendario de Apple', outlook: 'Outlook', copy: 'Copiar enlace', copied: 'Copiado',
  rotate: 'Crear un enlace nuevo', revoke: 'Desactivar el enlace', manage: 'Gestionar en Tú, Ajustes',
  privateNote: 'Este enlace es privado. Quien lo tenga puede ver las ideas de posts de tu plan.',
  rotateNote: 'Un enlace nuevo anula el anterior, por ejemplo si lo compartiste por error.',
  emailTitle: 'Aviso por email', emailWhy: 'Un email en tus días de publicar, si lo prefieres a un calendario.',
  dayOf: 'Ese mismo día', dayBefore: 'El día antes', when: 'Cuándo', sampleNote: 'Los enlaces de calendario funcionan con tu propio plan cuando tienes Pro AI.',
  calWay: 'Calendario: un toque y cada post queda en el calendario que ya usas.',
  emailWay: 'Email: un mensaje en cada día de publicar, sin instalar nada.',
};

const pt: PlanRemindersContent = {
  title: 'Calendário e lembretes', addCal: 'Adicionar ao meu calendário',
  why: 'Assine uma vez. Seu calendário acompanha o plano sozinho: posts movidos, edições e planos novos aparecem sem você fazer nada.',
  turnOn: 'Pegar meu link de calendário', working: 'Um momento', error: 'Não conseguimos atualizar o link. Tente de novo.',
  google: 'Google Agenda', apple: 'Calendário da Apple', outlook: 'Outlook', copy: 'Copiar link', copied: 'Copiado',
  rotate: 'Criar um link novo', revoke: 'Desativar o link', manage: 'Gerenciar em Você, Configurações',
  privateNote: 'Este link é privado. Quem tiver o link pode ver as ideias de posts do seu plano.',
  rotateNote: 'Um link novo cancela o anterior, por exemplo se você compartilhou por engano.',
  emailTitle: 'Lembrete por email', emailWhy: 'Um email nos seus dias de postar, se preferir isso a um calendário.',
  dayOf: 'No dia', dayBefore: 'Na véspera', when: 'Quando', sampleNote: 'Os links de calendário funcionam com o seu próprio plano quando você tem Pro AI.',
  calWay: 'Calendário: um toque e cada post fica no calendário que você já usa.',
  emailWay: 'Email: uma mensagem em cada dia de postar, sem instalar nada.',
};

const all: Record<AppLocale, PlanRemindersContent> = { en, es, pt };
export const getPlanRemindersContent = (locale: AppLocale): PlanRemindersContent => all[locale];
