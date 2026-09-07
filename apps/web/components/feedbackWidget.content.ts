import type { FeedbackSentiment } from '@ig-tracker/core';

export interface FeedbackSentimentContent {
  value: FeedbackSentiment;
  emoji: string;
  label: string;
  reasons: string[];
}

export interface FeedbackWidgetContent {
  ariaToggleOpen: string;
  ariaToggleClose: string;
  dialogAriaLabel: string;
  thanks: string;
  howsItGoing: string;
  radioGroupAriaLabel: string;
  commentPlaceholder: string;
  errorMessage: string;
  sending: string;
  sendFeedback: string;
  sentiments: FeedbackSentimentContent[];
}

export const EN_FEEDBACK_WIDGET: FeedbackWidgetContent = {
  ariaToggleOpen: 'Give feedback',
  ariaToggleClose: 'Close feedback form',
  dialogAriaLabel: 'Feedback form',
  thanks: 'Thanks for the feedback.',
  howsItGoing: "How's it going so far?",
  radioGroupAriaLabel: "How's your experience been?",
  commentPlaceholder: 'Anything else? (optional)',
  errorMessage: 'Something went wrong. Mind trying again?',
  sending: 'Sending…',
  sendFeedback: 'Send feedback',
  sentiments: [
    { value: 'angry', emoji: '😠', label: 'Angry', reasons: [
      "Couldn't get my export to work",
      'The upload or parsing broke',
      'Lost my snapshot history',
    ] },
    { value: 'sad', emoji: '😞', label: 'Sad', reasons: [
      'Confusing to use',
      'Missing a feature I needed',
      'Pro price feels high',
    ] },
    { value: 'neutral', emoji: '😐', label: 'Neutral', reasons: [
      'Works, but nothing stood out',
      'Just exploring',
    ] },
    { value: 'happy', emoji: '🙂', label: 'Happy', reasons: [
      'Found exactly who unfollowed me',
      'Clean and easy to use',
    ] },
    { value: 'delighted', emoji: '🤩', label: 'Delighted', reasons: [
      'Exactly what I needed',
      'Already recommending it',
    ] },
  ],
};

export const ES_FEEDBACK_WIDGET: FeedbackWidgetContent = {
  ariaToggleOpen: 'Dar tu opinión',
  ariaToggleClose: 'Cerrar formulario de opinión',
  dialogAriaLabel: 'Formulario de opinión',
  thanks: 'Gracias por tu opinión.',
  howsItGoing: '¿Qué tal va todo hasta ahora?',
  radioGroupAriaLabel: '¿Cómo ha sido tu experiencia?',
  commentPlaceholder: '¿Algo más? (opcional)',
  errorMessage: 'Algo salió mal. ¿Puedes intentarlo de nuevo?',
  sending: 'Enviando…',
  sendFeedback: 'Enviar opinión',
  sentiments: [
    { value: 'angry', emoji: '😠', label: 'Enfadado', reasons: [
      'No pude hacer que mi exportación funcionara',
      'La carga o el análisis fallaron',
      'Perdí mi historial de snapshots',
    ] },
    { value: 'sad', emoji: '😞', label: 'Triste', reasons: [
      'Confuso de usar',
      'Falta una función que necesitaba',
      'El precio de Pro se siente alto',
    ] },
    { value: 'neutral', emoji: '😐', label: 'Neutral', reasons: [
      'Funciona, pero nada destacó',
      'Solo estoy explorando',
    ] },
    { value: 'happy', emoji: '🙂', label: 'Contento', reasons: [
      'Encontré exactamente quién me dejó de seguir',
      'Limpio y fácil de usar',
    ] },
    { value: 'delighted', emoji: '🤩', label: 'Encantado', reasons: [
      'Exactamente lo que necesitaba',
      'Ya lo estoy recomendando',
    ] },
  ],
};

export const PT_FEEDBACK_WIDGET: FeedbackWidgetContent = {
  ariaToggleOpen: 'Dar feedback',
  ariaToggleClose: 'Fechar formulário de feedback',
  dialogAriaLabel: 'Formulário de feedback',
  thanks: 'Obrigado pelo feedback.',
  howsItGoing: 'Como está indo até agora?',
  radioGroupAriaLabel: 'Como tem sido sua experiência?',
  commentPlaceholder: 'Mais alguma coisa? (opcional)',
  errorMessage: 'Algo deu errado. Pode tentar novamente?',
  sending: 'Enviando…',
  sendFeedback: 'Enviar feedback',
  sentiments: [
    { value: 'angry', emoji: '😠', label: 'Bravo', reasons: [
      'Não consegui fazer minha exportação funcionar',
      'O upload ou a análise quebrou',
      'Perdi meu histórico de snapshots',
    ] },
    { value: 'sad', emoji: '😞', label: 'Triste', reasons: [
      'Confuso de usar',
      'Faltou um recurso que eu precisava',
      'O preço do Pro parece alto',
    ] },
    { value: 'neutral', emoji: '😐', label: 'Neutro', reasons: [
      'Funciona, mas nada se destacou',
      'Só estou explorando',
    ] },
    { value: 'happy', emoji: '🙂', label: 'Feliz', reasons: [
      'Encontrei exatamente quem deixou de me seguir',
      'Limpo e fácil de usar',
    ] },
    { value: 'delighted', emoji: '🤩', label: 'Encantado', reasons: [
      'Exatamente o que eu precisava',
      'Já estou recomendando',
    ] },
  ],
};

export function getFeedbackWidgetContent(locale: string): FeedbackWidgetContent {
  if (locale === 'es') return ES_FEEDBACK_WIDGET;
  if (locale === 'pt') return PT_FEEDBACK_WIDGET;
  return EN_FEEDBACK_WIDGET;
}
