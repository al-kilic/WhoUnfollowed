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
};

export function getContactContent(locale: AppLocale): ContactContent {
  if (locale === 'es') return ES;
  if (locale === 'pt') return PT;
  return EN;
}
