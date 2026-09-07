import type { AppLocale } from '@/i18n/routing';

export interface AccessibilityContent {
  eyebrow: string;
  headline: string;
  lastUpdated: string;
  sections: { title: string; body: string }[];
  catchingUpTitle: string;
  catchingUpBold: string;
  catchingUpBody: string;
  tellUsTitle: string;
  tellUsPrefix: string;
  tellUsSuffix: string;
  backToHome: string;
}

const EN: AccessibilityContent = {
  eyebrow: 'LEGAL',
  headline: 'Accessibility',
  lastUpdated: 'Last updated: September 5, 2026',
  sections: [
    { title: 'Our Commitment', body: 'WhoUnfollowed should work for everyone, including people who use a screen reader, navigate by keyboard only, or rely on other assistive technology. Accessibility is not an afterthought we bolt on. We treat it as part of building the product correctly.' },
    { title: "What We've Done", body: 'The site is built with semantic HTML, so headings, landmarks, and links are structured the way assistive technology expects. Buttons and forms are keyboard-navigable. Images carry alt text. Both the dark and light themes are designed with text contrast in mind, and the theme toggle respects your system preference by default.' },
    { title: 'Our Standard', body: "We use the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA as our working target. This is a goal we're building toward, not a certification we hold." },
  ],
  catchingUpTitle: "Where We're Still Catching Up",
  catchingUpBold: "We are not going to claim full compliance we haven't verified.",
  catchingUpBody: "The Pro dashboard's charts (follower growth, follow ratio over time, follow age) now carry text descriptions for screen readers, and the click-to-filter bar chart has a keyboard-accessible equivalent. What's still incomplete: none of this has been tested with a real screen reader end to end, only built to the spec, so treat it as improved, not verified.",
  tellUsTitle: "Tell Us What's Broken",
  tellUsPrefix: 'If you hit a barrier using WhoUnfollowed with a screen reader, keyboard, or any other assistive technology, email us at',
  tellUsSuffix: 'with what happened and the page you were on. We read every message and fix real barriers.',
  backToHome: 'Back to WhoUnfollowed',
};

const ES: AccessibilityContent = {
  eyebrow: 'LEGAL',
  headline: 'Accesibilidad',
  lastUpdated: 'Última actualización: 5 de septiembre de 2026',
  sections: [
    { title: 'Nuestro compromiso', body: 'WhoUnfollowed debería funcionar para todos, incluyendo personas que usan un lector de pantalla, navegan solo con teclado o dependen de otra tecnología de asistencia. La accesibilidad no es algo que añadimos después. La tratamos como parte de construir el producto correctamente.' },
    { title: 'Lo que hemos hecho', body: 'El sitio está construido con HTML semántico, así que los encabezados, landmarks y enlaces están estructurados como la tecnología de asistencia espera. Los botones y formularios son navegables por teclado. Las imágenes llevan texto alternativo. Ambos temas, oscuro y claro, están diseñados pensando en el contraste de texto, y el selector de tema respeta tu preferencia del sistema por defecto.' },
    { title: 'Nuestro estándar', body: 'Usamos las Pautas de Accesibilidad para el Contenido Web (WCAG) 2.1 Nivel AA como nuestro objetivo de trabajo. Es una meta hacia la que estamos construyendo, no una certificación que tengamos.' },
  ],
  catchingUpTitle: 'Dónde todavía estamos poniéndonos al día',
  catchingUpBold: 'No vamos a afirmar un cumplimiento total que no hemos verificado.',
  catchingUpBody: 'Los gráficos del panel Pro (crecimiento de seguidores, proporción de seguidos con el tiempo, antigüedad de seguidores) ahora llevan descripciones de texto para lectores de pantalla, y el gráfico de barras con clic para filtrar tiene un equivalente accesible por teclado. Lo que sigue incompleto: nada de esto se ha probado de principio a fin con un lector de pantalla real, solo se construyó según la especificación, así que considéralo mejorado, no verificado.',
  tellUsTitle: 'Dinos qué está roto',
  tellUsPrefix: 'Si encuentras una barrera usando WhoUnfollowed con un lector de pantalla, teclado o cualquier otra tecnología de asistencia, escríbenos a',
  tellUsSuffix: 'con lo que pasó y la página en la que estabas. Leemos cada mensaje y arreglamos las barreras reales.',
  backToHome: 'Volver a WhoUnfollowed',
};

const PT: AccessibilityContent = {
  eyebrow: 'LEGAL',
  headline: 'Acessibilidade',
  lastUpdated: 'Última atualização: 5 de setembro de 2026',
  sections: [
    { title: 'Nosso compromisso', body: 'O WhoUnfollowed deveria funcionar para todos, incluindo pessoas que usam leitor de tela, navegam só pelo teclado ou dependem de outra tecnologia assistiva. Acessibilidade não é algo que adicionamos depois. Tratamos como parte de construir o produto corretamente.' },
    { title: 'O que já fizemos', body: 'O site é construído com HTML semântico, então títulos, landmarks e links são estruturados como a tecnologia assistiva espera. Botões e formulários são navegáveis pelo teclado. Imagens têm texto alternativo. Os temas escuro e claro foram projetados pensando no contraste de texto, e o alternador de tema respeita a preferência do sistema por padrão.' },
    { title: 'Nosso padrão', body: 'Usamos as Diretrizes de Acessibilidade para Conteúdo Web (WCAG) 2.1 Nível AA como nossa meta de trabalho. É um objetivo que estamos buscando, não uma certificação que temos.' },
  ],
  catchingUpTitle: 'Onde ainda estamos nos atualizando',
  catchingUpBold: 'Não vamos afirmar conformidade total que não verificamos.',
  catchingUpBody: 'Os gráficos do painel Pro (crescimento de seguidores, proporção de seguindo ao longo do tempo, tempo de seguidor) agora têm descrições em texto para leitores de tela, e o gráfico de barras com clique para filtrar tem um equivalente acessível por teclado. O que ainda está incompleto: nada disso foi testado de ponta a ponta com um leitor de tela real, só foi construído conforme a especificação, então trate como melhorado, não verificado.',
  tellUsTitle: 'Nos diga o que está quebrado',
  tellUsPrefix: 'Se você encontrar uma barreira usando o WhoUnfollowed com leitor de tela, teclado ou qualquer outra tecnologia assistiva, envie um email para',
  tellUsSuffix: 'com o que aconteceu e a página em que você estava. Lemos cada mensagem e corrigimos barreiras reais.',
  backToHome: 'Voltar ao WhoUnfollowed',
};

export function getAccessibilityContent(locale: AppLocale): AccessibilityContent {
  if (locale === 'es') return ES;
  if (locale === 'pt') return PT;
  return EN;
}
