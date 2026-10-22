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
  pickReason: string;
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
  pickReason: 'Pick the closest one',
  commentPlaceholder: 'Anything else? (optional)',
  errorMessage: 'Something went wrong. Mind trying again?',
  sending: 'Sending…',
  sendFeedback: 'Send feedback',
  sentiments: [
    { value: 'angry', emoji: '😠', label: 'Angry', reasons: [
      'My results are wrong',
      "Couldn't get my export to work",
      'The upload or parsing broke',
      'Lost my snapshot history',
      'Something else',
    ] },
    { value: 'sad', emoji: '😞', label: 'Sad', reasons: [
      'Followers show up as not following back',
      "Numbers don't match Instagram",
      'Instagram export took too long',
      'Confusing to use',
      'Missing a feature I needed',
      'Pro price feels high',
      'Something else',
    ] },
    { value: 'neutral', emoji: '😐', label: 'Neutral', reasons: [
      'Works, but some numbers look off',
      'Works, but nothing stood out',
      'Just exploring',
      'Something else',
    ] },
    { value: 'happy', emoji: '🙂', label: 'Happy', reasons: [
      'Found exactly who unfollowed me',
      'Clean and easy to use',
      'Something else',
    ] },
    { value: 'delighted', emoji: '🤩', label: 'Delighted', reasons: [
      'Exactly what I needed',
      'Already recommending it',
      'Something else',
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
  pickReason: 'Elige la más cercana',
  commentPlaceholder: '¿Algo más? (opcional)',
  errorMessage: 'Algo salió mal. ¿Puedes intentarlo de nuevo?',
  sending: 'Enviando…',
  sendFeedback: 'Enviar opinión',
  sentiments: [
    { value: 'angry', emoji: '😠', label: 'Enfadado', reasons: [
      'Mis resultados están mal',
      'No pude hacer que mi exportación funcionara',
      'La carga o el análisis fallaron',
      'Perdí mi historial de snapshots',
      'Otra cosa',
    ] },
    { value: 'sad', emoji: '😞', label: 'Triste', reasons: [
      'Seguidores aparecen como que no me siguen',
      'Los números no coinciden con Instagram',
      'La exportación de Instagram tardó demasiado',
      'Confuso de usar',
      'Falta una función que necesitaba',
      'El precio de Pro se siente alto',
      'Otra cosa',
    ] },
    { value: 'neutral', emoji: '😐', label: 'Neutral', reasons: [
      'Funciona, pero algunos números no cuadran',
      'Funciona, pero nada destacó',
      'Solo estoy explorando',
      'Otra cosa',
    ] },
    { value: 'happy', emoji: '🙂', label: 'Contento', reasons: [
      'Encontré exactamente quién me dejó de seguir',
      'Limpio y fácil de usar',
      'Otra cosa',
    ] },
    { value: 'delighted', emoji: '🤩', label: 'Encantado', reasons: [
      'Exactamente lo que necesitaba',
      'Ya lo estoy recomendando',
      'Otra cosa',
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
  pickReason: 'Escolha a mais próxima',
  commentPlaceholder: 'Mais alguma coisa? (opcional)',
  errorMessage: 'Algo deu errado. Pode tentar novamente?',
  sending: 'Enviando…',
  sendFeedback: 'Enviar feedback',
  sentiments: [
    { value: 'angry', emoji: '😠', label: 'Bravo', reasons: [
      'Meus resultados estão errados',
      'Não consegui fazer minha exportação funcionar',
      'O upload ou a análise quebrou',
      'Perdi meu histórico de snapshots',
      'Outra coisa',
    ] },
    { value: 'sad', emoji: '😞', label: 'Triste', reasons: [
      'Seguidores aparecem como se não me seguissem',
      'Os números não batem com o Instagram',
      'A exportação do Instagram demorou demais',
      'Confuso de usar',
      'Faltou um recurso que eu precisava',
      'O preço do Pro parece alto',
      'Outra coisa',
    ] },
    { value: 'neutral', emoji: '😐', label: 'Neutro', reasons: [
      'Funciona, mas alguns números parecem errados',
      'Funciona, mas nada se destacou',
      'Só estou explorando',
      'Outra coisa',
    ] },
    { value: 'happy', emoji: '🙂', label: 'Feliz', reasons: [
      'Encontrei exatamente quem deixou de me seguir',
      'Limpo e fácil de usar',
      'Outra coisa',
    ] },
    { value: 'delighted', emoji: '🤩', label: 'Encantado', reasons: [
      'Exatamente o que eu precisava',
      'Já estou recomendando',
      'Outra coisa',
    ] },
  ],
};

export function getFeedbackWidgetContent(locale: string): FeedbackWidgetContent {
  if (locale === 'es') return ES_FEEDBACK_WIDGET;
  if (locale === 'pt') return PT_FEEDBACK_WIDGET;
  return EN_FEEDBACK_WIDGET;
}
