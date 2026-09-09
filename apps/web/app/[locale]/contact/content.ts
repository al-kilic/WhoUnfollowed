import type { AppLocale } from '@/i18n/routing';

export interface ContactContent {
  eyebrow: string;
  headline: string;
  intro: string;
  quickQuestionPrefix: string;
  exportGuideLink: string;
  orWord: string;
  faqLink: string;
  quickQuestionSuffix: string;
  whatIsThisAbout: string;
  topics: { id: string; label: string; desc: string }[];
  emailLabel: string;
  copyEmail: string;
  copied: string;
  openInMailApp: string;
  subjectPrefilled: string;
  responseRows: { label: string; detail: string }[];
  backToHome: string;
  // Direct-message form (sends to the team, not a mailto link).
  form: {
    heading: string;
    nameLabel: string;
    nameOptional: string;
    emailLabel: string;
    messageLabel: string;
    messagePlaceholder: string;
    send: string;
    sending: string;
    successTitle: string;
    successBody: string;
    sendAnother: string;
    errorMissingEmail: string;
    errorInvalidEmail: string;
    errorMissingMessage: string;
    errorGeneric: string;
    orEmailDirectly: string;
  };
}

const EN: ContactContent = {
  eyebrow: 'Contact',
  headline: 'Get in touch.',
  intro: 'One person reads every email. Response time is usually within 24 hours.',
  quickQuestionPrefix: 'Quick question about exporting your data? The',
  exportGuideLink: 'export guide',
  orWord: 'or',
  faqLink: 'FAQ',
  quickQuestionSuffix: 'might already have it.',
  whatIsThisAbout: 'What is this about?',
  topics: [
    { id: 'bug',     label: 'Bug report',       desc: 'Something is broken or not working as expected' },
    { id: 'feature', label: 'Feature request',  desc: 'Something you want WhoUnfollowed to do' },
    { id: 'privacy', label: 'Privacy question', desc: 'Questions about data handling or this policy' },
    { id: 'press',   label: 'Press / media',    desc: 'Journalist or publication inquiry' },
    { id: 'other',   label: 'Anything else',    desc: 'Whatever is on your mind' },
  ],
  emailLabel: 'Email',
  copyEmail: 'Copy email address',
  copied: '✓ Copied',
  openInMailApp: 'or open in mail app',
  subjectPrefilled: '(subject pre-filled)',
  responseRows: [
    { label: 'Bug reports', detail: 'Acknowledged within 24h. Fix timeline depends on severity.' },
    { label: 'Feature requests', detail: 'Read every one. Not all are built, but all are considered.' },
    { label: 'Privacy questions', detail: 'Responded same day when possible.' },
    { label: 'Press inquiries', detail: 'Happy to respond. Please include publication name.' },
  ],
  backToHome: 'Back to WhoUnfollowed',
  form: {
    heading: 'Send a message',
    nameLabel: 'Name',
    nameOptional: 'optional',
    emailLabel: 'Your email',
    messageLabel: 'Message',
    messagePlaceholder: 'What\'s going on?',
    send: 'Send message',
    sending: 'Sending…',
    successTitle: 'Message sent',
    successBody: 'Thanks. One person reads every message, usually within 24 hours.',
    sendAnother: 'Send another message',
    errorMissingEmail: 'Enter your email so we can reply.',
    errorInvalidEmail: 'That email address doesn\'t look right.',
    errorMissingMessage: 'Write a message before sending.',
    errorGeneric: 'Something went wrong sending that. Try again, or use the email address below.',
    orEmailDirectly: 'Prefer email directly?',
  },
};

const ES: ContactContent = {
  eyebrow: 'Contacto',
  headline: 'Ponte en contacto.',
  intro: 'Una sola persona lee cada correo. El tiempo de respuesta suele ser menos de 24 horas.',
  quickQuestionPrefix: '¿Tienes una pregunta rápida sobre exportar tus datos? La',
  exportGuideLink: 'guía de exportación',
  orWord: 'o las',
  faqLink: 'preguntas frecuentes',
  quickQuestionSuffix: 'podrían ya tener la respuesta.',
  whatIsThisAbout: '¿De qué se trata?',
  topics: [
    { id: 'bug',     label: 'Reporte de error',        desc: 'Algo está roto o no funciona como debería' },
    { id: 'feature', label: 'Solicitud de función',    desc: 'Algo que quieres que WhoUnfollowed haga' },
    { id: 'privacy', label: 'Pregunta de privacidad',  desc: 'Preguntas sobre el manejo de datos o esta política' },
    { id: 'press',   label: 'Prensa / medios',         desc: 'Consulta de periodista o publicación' },
    { id: 'other',   label: 'Cualquier otra cosa',     desc: 'Lo que tengas en mente' },
  ],
  emailLabel: 'Correo',
  copyEmail: 'Copiar dirección de correo',
  copied: '✓ Copiado',
  openInMailApp: 'o abrir en la app de correo',
  subjectPrefilled: '(asunto ya completado)',
  responseRows: [
    { label: 'Reportes de errores', detail: 'Confirmación en 24h. El tiempo de solución depende de la gravedad.' },
    { label: 'Solicitudes de funciones', detail: 'Leemos todas. No todas se construyen, pero todas se consideran.' },
    { label: 'Preguntas de privacidad', detail: 'Respondidas el mismo día cuando es posible.' },
    { label: 'Consultas de prensa', detail: 'Encantados de responder. Por favor incluye el nombre de la publicación.' },
  ],
  backToHome: 'Volver a WhoUnfollowed',
  form: {
    heading: 'Envía un mensaje',
    nameLabel: 'Nombre',
    nameOptional: 'opcional',
    emailLabel: 'Tu correo',
    messageLabel: 'Mensaje',
    messagePlaceholder: '¿Qué está pasando?',
    send: 'Enviar mensaje',
    sending: 'Enviando…',
    successTitle: 'Mensaje enviado',
    successBody: 'Gracias. Una sola persona lee cada mensaje, normalmente en menos de 24 horas.',
    sendAnother: 'Enviar otro mensaje',
    errorMissingEmail: 'Ingresa tu correo para poder responderte.',
    errorInvalidEmail: 'Esa dirección de correo no parece válida.',
    errorMissingMessage: 'Escribe un mensaje antes de enviar.',
    errorGeneric: 'Algo salió mal al enviar esto. Intenta de nuevo, o usa la dirección de correo de abajo.',
    orEmailDirectly: '¿Prefieres escribir por correo directamente?',
  },
};

const PT: ContactContent = {
  eyebrow: 'Contato',
  headline: 'Entre em contato.',
  intro: 'Uma só pessoa lê cada email. O tempo de resposta costuma ser dentro de 24 horas.',
  quickQuestionPrefix: 'Uma dúvida rápida sobre exportar seus dados? O',
  exportGuideLink: 'guia de exportação',
  orWord: 'ou as',
  faqLink: 'perguntas frequentes',
  quickQuestionSuffix: 'já podem ter a resposta.',
  whatIsThisAbout: 'Sobre o que é isso?',
  topics: [
    { id: 'bug',     label: 'Relatar um bug',        desc: 'Algo está quebrado ou não funciona como esperado' },
    { id: 'feature', label: 'Sugerir uma funcionalidade', desc: 'Algo que você quer que o WhoUnfollowed faça' },
    { id: 'privacy', label: 'Pergunta de privacidade',    desc: 'Perguntas sobre o tratamento de dados ou esta política' },
    { id: 'press',   label: 'Imprensa / mídia',           desc: 'Consulta de jornalista ou publicação' },
    { id: 'other',   label: 'Outro assunto',              desc: 'O que estiver na sua cabeça' },
  ],
  emailLabel: 'Email',
  copyEmail: 'Copiar endereço de email',
  copied: '✓ Copiado',
  openInMailApp: 'ou abrir no app de email',
  subjectPrefilled: '(assunto já preenchido)',
  responseRows: [
    { label: 'Relatos de bugs', detail: 'Confirmação em até 24h. O prazo de correção depende da gravidade.' },
    { label: 'Sugestões de funcionalidades', detail: 'Lemos todas. Nem todas são construídas, mas todas são consideradas.' },
    { label: 'Perguntas de privacidade', detail: 'Respondidas no mesmo dia quando possível.' },
    { label: 'Consultas de imprensa', detail: 'Teremos prazer em responder. Inclua o nome da publicação.' },
  ],
  backToHome: 'Voltar ao WhoUnfollowed',
  form: {
    heading: 'Envie uma mensagem',
    nameLabel: 'Nome',
    nameOptional: 'opcional',
    emailLabel: 'Seu email',
    messageLabel: 'Mensagem',
    messagePlaceholder: 'O que está acontecendo?',
    send: 'Enviar mensagem',
    sending: 'Enviando…',
    successTitle: 'Mensagem enviada',
    successBody: 'Obrigado. Uma só pessoa lê cada mensagem, geralmente em até 24 horas.',
    sendAnother: 'Enviar outra mensagem',
    errorMissingEmail: 'Digite seu email para que possamos responder.',
    errorInvalidEmail: 'Esse endereço de email não parece válido.',
    errorMissingMessage: 'Escreva uma mensagem antes de enviar.',
    errorGeneric: 'Algo deu errado ao enviar isso. Tente novamente, ou use o endereço de email abaixo.',
    orEmailDirectly: 'Prefere escrever por email diretamente?',
  },
};

export function getContactContent(locale: AppLocale): ContactContent {
  if (locale === 'es') return ES;
  if (locale === 'pt') return PT;
  return EN;
}
