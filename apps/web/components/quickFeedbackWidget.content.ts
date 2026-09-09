export interface QuickFeedbackWidgetContent {
  ariaToggleOpen: string;
  ariaToggleClose: string;
  dialogAriaLabel: string;
  heading: string;
  subheading: string;
  emailLabel: string;
  emailOptional: string;
  messagePlaceholder: string;
  send: string;
  sending: string;
  thanks: string;
  errorMissingMessage: string;
  errorInvalidEmail: string;
  errorGeneric: string;
}

export const EN_QUICK_FEEDBACK_WIDGET: QuickFeedbackWidgetContent = {
  ariaToggleOpen: 'Send quick feedback',
  ariaToggleClose: 'Close feedback form',
  dialogAriaLabel: 'Quick feedback form',
  heading: 'Got a second?',
  subheading: 'Tell us what\'s working, what\'s confusing, or what\'s missing.',
  emailLabel: 'Email',
  emailOptional: 'optional, only if you want a reply',
  messagePlaceholder: 'Type here…',
  send: 'Send',
  sending: 'Sending…',
  thanks: 'Got it. Thanks for taking the time.',
  errorMissingMessage: 'Write something before sending.',
  errorInvalidEmail: 'That email address doesn\'t look right.',
  errorGeneric: 'Something went wrong. Mind trying again?',
};

export const ES_QUICK_FEEDBACK_WIDGET: QuickFeedbackWidgetContent = {
  ariaToggleOpen: 'Enviar opinión rápida',
  ariaToggleClose: 'Cerrar formulario de opinión',
  dialogAriaLabel: 'Formulario de opinión rápida',
  heading: '¿Tienes un segundo?',
  subheading: 'Cuéntanos qué funciona, qué confunde, o qué falta.',
  emailLabel: 'Correo',
  emailOptional: 'opcional, solo si quieres una respuesta',
  messagePlaceholder: 'Escribe aquí…',
  send: 'Enviar',
  sending: 'Enviando…',
  thanks: 'Listo. Gracias por tomarte el tiempo.',
  errorMissingMessage: 'Escribe algo antes de enviar.',
  errorInvalidEmail: 'Esa dirección de correo no parece válida.',
  errorGeneric: 'Algo salió mal. ¿Puedes intentarlo de nuevo?',
};

export const PT_QUICK_FEEDBACK_WIDGET: QuickFeedbackWidgetContent = {
  ariaToggleOpen: 'Enviar feedback rápido',
  ariaToggleClose: 'Fechar formulário de feedback',
  dialogAriaLabel: 'Formulário de feedback rápido',
  heading: 'Tem um segundo?',
  subheading: 'Conte o que está funcionando, o que confunde, ou o que falta.',
  emailLabel: 'Email',
  emailOptional: 'opcional, só se quiser uma resposta',
  messagePlaceholder: 'Digite aqui…',
  send: 'Enviar',
  sending: 'Enviando…',
  thanks: 'Recebido. Obrigado pelo seu tempo.',
  errorMissingMessage: 'Escreva algo antes de enviar.',
  errorInvalidEmail: 'Esse endereço de email não parece válido.',
  errorGeneric: 'Algo deu errado. Pode tentar novamente?',
};

export function getQuickFeedbackWidgetContent(locale: string): QuickFeedbackWidgetContent {
  if (locale === 'es') return ES_QUICK_FEEDBACK_WIDGET;
  if (locale === 'pt') return PT_QUICK_FEEDBACK_WIDGET;
  return EN_QUICK_FEEDBACK_WIDGET;
}
