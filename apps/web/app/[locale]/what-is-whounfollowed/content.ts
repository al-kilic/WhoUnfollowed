import type { AppLocale } from '@/i18n/routing';
import { UNLOCK_PRICE_SUMMARY } from '@/lib/pricing';

export interface FaqItem { q: string; a: string; }

export interface WhatIsContent {
  eyebrow: string;
  headline: string;
  headlineItalic: string;
  intro: string;
  seeListNow: string;
  stats: { value: string; label: string }[];
  problemEyebrow: string;
  problemHeadline: string;
  problemItems: { icon: string; text: string }[];
  problemClosing: string;
  howEyebrow: string;
  howHeadline: string;
  howSteps: { time: string; title: string; body: string }[];
  fullGuideLink: string;
  whyUsEyebrow: string;
  whyUsHeadline: string;
  compareFeatureHeader: string;
  compareUsHeader: string;
  compareThemHeader: string;
  compareRows: { feature: string; us: boolean; them: boolean }[];
  whatYouGetEyebrow: string;
  whatYouGetHeadline: string;
  whatYouGetItems: { icon: string; title: string; body: string }[];
  faqEyebrow: string;
  faqHeadline: string;
  faqItems: FaqItem[];
  relatedGuideEyebrow: string;
  relatedGuideLink: string;
  ctaQuote: string;
  ctaSubline: string;
  ctaButton: string;
  backToHome: string;
}

const EN: WhatIsContent = {
  eyebrow: 'What is WhoUnfollowed',
  headline: "See who doesn't follow you back on Instagram.",
  headlineItalic: "Open source, so you don't have to take our word for it.",
  intro: 'You upload the data file Instagram already gave you. WhoUnfollowed reads it locally in your browser and shows the full list in under 2 seconds. No password, no server, no login. Every line of code that touches your data is public, so you can check that for yourself instead of trusting a privacy policy.',
  seeListNow: 'See your list now',
  stats: [
    { value: '2s', label: 'to see your results' },
    { value: '0', label: 'files sent to us' },
    { value: '2', label: 'open-source licenses' },
  ],
  problemEyebrow: 'The problem',
  problemHeadline: "Every app that tries asks for your password. That's illegal, dangerous, and unnecessary.",
  problemItems: [
    { icon: '🚫', text: "Violates Instagram's Terms of Service" },
    { icon: '⚠', text: 'Thousands of accounts have been permanently banned this way' },
    { icon: '💾', text: 'Several apps were caught storing and selling credentials' },
    { icon: '🔒', text: 'Closed source, so you have no way to check what they actually do with your data' },
  ],
  problemClosing: 'WhoUnfollowed solves the same problem without any of that risk, and the code that proves it is public on GitHub, so you can verify it yourself instead of taking our word for it.',
  howEyebrow: 'How it works',
  howHeadline: 'Instagram already has your data. We just read it.',
  howSteps: [
    { time: '30 sec', title: 'Request your export', body: 'Go to Instagram Settings → Accounts Center → Your Information → Download Your Information. Select Followers and Following.' },
    { time: 'Few min', title: 'Instagram emails you the ZIP', body: 'Usually arrives within minutes. You only need the followers and following section - not the full archive.' },
    { time: '2 sec', title: 'Drop the ZIP and see your list', body: "Your browser reads it locally, compares the two lists, and shows every account you follow that doesn't follow you back." },
  ],
  fullGuideLink: 'Full step-by-step export guide →',
  whyUsEyebrow: 'Why us',
  whyUsHeadline: 'The difference is clear.',
  compareFeatureHeader: 'Feature',
  compareUsHeader: 'WhoUnfollowed',
  compareThemHeader: 'Other apps',
  compareRows: [
    { feature: 'Never asks for your password', us: true, them: false },
    { feature: 'Zero risk of account ban', us: true, them: false },
    { feature: 'Credentials never stored', us: true, them: false },
    { feature: 'No signup required', us: true, them: false },
    { feature: 'Open source (AGPL-3.0 + MPL-2.0)', us: true, them: false },
    { feature: 'Works offline in browser', us: true, them: false },
    { feature: 'Free tier available', us: true, them: true },
  ],
  whatYouGetEyebrow: 'What you get',
  whatYouGetHeadline: 'One upload. Full clarity.',
  whatYouGetItems: [
    { icon: '👥', title: 'Non-followers list', body: "Every account you follow that doesn't follow you back, with timestamps." },
    { icon: '⭐', title: 'Fans', body: "Accounts that follow you but you don't follow back." },
    { icon: '🤝', title: 'Mutuals', body: 'Accounts you both follow each other.' },
    { icon: '📊', title: 'Radar (Pro)', body: 'Health score, follow age bars, growth charts, and who unfollowed between uploads.' },
    { icon: '📋', title: 'CSV export', body: 'Download any list as a spreadsheet.' },
    { icon: '🔍', title: 'Triage workflow', body: 'Mark accounts as Dropping, Whitelist, or Skip to track your clean-up.' },
  ],
  faqEyebrow: 'Questions',
  faqHeadline: 'Quick answers.',
  faqItems: [
    { q: 'Is WhoUnfollowed free?', a: `Yes. Seeing your full non-followers list, mutual followers, and fans is free with no account required. Pro is a one-time payment (${UNLOCK_PRICE_SUMMARY}, no recurring charge) that adds snapshot history, growth charts, ghost-follower detection, and encrypted cloud sync across your devices.` },
    { q: 'Does WhoUnfollowed need my Instagram password?', a: 'No. There is no Instagram login on WhoUnfollowed. You upload a ZIP file Instagram emails directly to you. Your password is never involved.' },
    { q: 'Will Instagram ban my account for using WhoUnfollowed?', a: "No. WhoUnfollowed uses Instagram's official GDPR data export. You are not using a third-party API, not scraping Instagram, and not violating any Terms of Service." },
    { q: 'How long does it take to get results?', a: 'About 15 minutes end to end. 30 seconds to request your export, a few minutes for Instagram to email it, and 2 seconds for WhoUnfollowed to parse it.' },
    { q: 'Is WhoUnfollowed open source?', a: 'The core parser (packages/core) is MPL-2.0 licensed and public on GitHub. You can read exactly what happens to your data. The web app is AGPL-3.0, and anyone can self-host it, but Pro features (snapshot history across devices, encrypted cloud sync, trend charts) require the cloud service because they depend on server infrastructure.' },
    { q: 'Does WhoUnfollowed work on iPhone and Android?', a: 'Yes. You can request your Instagram export and upload the ZIP from any mobile browser.' },
  ],
  relatedGuideEyebrow: 'Related guide',
  relatedGuideLink: 'How to see who unfollowed you on Instagram (without getting banned) →',
  ctaQuote: 'You already have the data. Instagram gave it to you.',
  ctaSubline: 'One ZIP. Dropped in your browser. Your list in 2 seconds.',
  ctaButton: 'See your list now',
  backToHome: 'Back to WhoUnfollowed',
};

const ES: WhatIsContent = {
  eyebrow: 'Qué es WhoUnfollowed',
  headline: 'Ve quién no te sigue de vuelta en Instagram.',
  headlineItalic: 'Código abierto, para que no tengas que creer en nuestra palabra.',
  intro: 'Subes el archivo de datos que Instagram ya te dio. WhoUnfollowed lo lee localmente en tu navegador y muestra la lista completa en menos de 2 segundos. Sin contraseña, sin servidor, sin inicio de sesión. Cada línea de código que toca tus datos es pública, así que puedes verificarlo tú mismo en lugar de confiar en una política de privacidad.',
  seeListNow: 'Ver tu lista ahora',
  stats: [
    { value: '2s', label: 'para ver tus resultados' },
    { value: '0', label: 'archivos enviados a nosotros' },
    { value: '2', label: 'licencias de código abierto' },
  ],
  problemEyebrow: 'El problema',
  problemHeadline: 'Cada app que lo intenta pide tu contraseña. Eso es ilegal, peligroso e innecesario.',
  problemItems: [
    { icon: '🚫', text: 'Viola los Términos de Servicio de Instagram' },
    { icon: '⚠', text: 'Miles de cuentas han sido baneadas permanentemente de esta forma' },
    { icon: '💾', text: 'Varias apps fueron sorprendidas almacenando y vendiendo credenciales' },
    { icon: '🔒', text: 'Código cerrado, así que no tienes forma de verificar qué hacen realmente con tus datos' },
  ],
  problemClosing: 'WhoUnfollowed resuelve el mismo problema sin ninguno de esos riesgos, y el código que lo demuestra es público en GitHub, así que puedes verificarlo tú mismo en lugar de creer en nuestra palabra.',
  howEyebrow: 'Cómo funciona',
  howHeadline: 'Instagram ya tiene tus datos. Nosotros solo los leemos.',
  howSteps: [
    { time: '30 seg', title: 'Solicita tu export', body: 'Ve a Configuración de Instagram → Centro de cuentas → Tu información → Descargar tu información. Selecciona Seguidores y Seguidos.' },
    { time: 'Unos min', title: 'Instagram te envía el ZIP por correo', body: 'Normalmente llega en minutos. Solo necesitas la sección de seguidores y seguidos, no el archivo completo.' },
    { time: '2 seg', title: 'Suelta el ZIP y ve tu lista', body: 'Tu navegador lo lee localmente, compara las dos listas y muestra cada cuenta que sigues y que no te sigue de vuelta.' },
  ],
  fullGuideLink: 'Guía completa paso a paso →',
  whyUsEyebrow: 'Por qué nosotros',
  whyUsHeadline: 'La diferencia es clara.',
  compareFeatureHeader: 'Función',
  compareUsHeader: 'WhoUnfollowed',
  compareThemHeader: 'Otras apps',
  compareRows: [
    { feature: 'Nunca pide tu contraseña', us: true, them: false },
    { feature: 'Cero riesgo de baneo de cuenta', us: true, them: false },
    { feature: 'Las credenciales nunca se guardan', us: true, them: false },
    { feature: 'No requiere registro', us: true, them: false },
    { feature: 'Código abierto (AGPL-3.0 + MPL-2.0)', us: true, them: false },
    { feature: 'Funciona sin conexión en el navegador', us: true, them: false },
    { feature: 'Plan gratuito disponible', us: true, them: true },
  ],
  whatYouGetEyebrow: 'Qué obtienes',
  whatYouGetHeadline: 'Una subida. Claridad total.',
  whatYouGetItems: [
    { icon: '👥', title: 'Lista de no-seguidores', body: 'Cada cuenta que sigues y que no te sigue de vuelta, con marcas de tiempo.' },
    { icon: '⭐', title: 'Fans', body: 'Cuentas que te siguen pero que tú no sigues de vuelta.' },
    { icon: '🤝', title: 'Mutuos', body: 'Cuentas que se siguen mutuamente.' },
    { icon: '📊', title: 'Radar (Pro)', body: 'Puntaje de salud, barras de antigüedad de seguidores, gráficos de crecimiento y quién te dejó de seguir entre subidas.' },
    { icon: '📋', title: 'Exportar CSV', body: 'Descarga cualquier lista como hoja de cálculo.' },
    { icon: '🔍', title: 'Flujo de triaje', body: 'Marca cuentas como Eliminar, Lista blanca o Omitir para llevar el control de tu limpieza.' },
  ],
  faqEyebrow: 'Preguntas',
  faqHeadline: 'Respuestas rápidas.',
  faqItems: [
    { q: '¿Es gratis WhoUnfollowed?', a: `Sí. Ver tu lista completa de no-seguidores, seguidores mutuos y fans es gratis y no necesita cuenta. Pro es un pago único (${UNLOCK_PRICE_SUMMARY}, sin cargo recurrente) que añade historial de snapshots, gráficos de crecimiento, detección de seguidores fantasma y sincronización cifrada en la nube entre tus dispositivos.` },
    { q: '¿WhoUnfollowed necesita mi contraseña de Instagram?', a: 'No. WhoUnfollowed no tiene inicio de sesión de Instagram. Subes un archivo ZIP que Instagram te envía directamente por correo. Tu contraseña nunca está involucrada.' },
    { q: '¿Instagram baneará mi cuenta por usar WhoUnfollowed?', a: 'No. WhoUnfollowed usa el export oficial de datos de Instagram bajo el RGPD. No estás usando una API de terceros, ni raspando Instagram, ni violando ningún Término de Servicio.' },
    { q: '¿Cuánto tiempo toma obtener resultados?', a: 'Unos 15 minutos de principio a fin. 30 segundos para solicitar tu export, unos minutos para que Instagram lo envíe por correo, y 2 segundos para que WhoUnfollowed lo procese.' },
    { q: '¿WhoUnfollowed es de código abierto?', a: 'El parser principal (packages/core) tiene licencia MPL-2.0 y es público en GitHub. Puedes leer exactamente qué pasa con tus datos. La app web es AGPL-3.0, y cualquiera puede alojarla por su cuenta, pero las funciones Pro (historial de snapshots entre dispositivos, sincronización cifrada en la nube, gráficos de tendencia) requieren el servicio en la nube porque dependen de infraestructura de servidor.' },
    { q: '¿WhoUnfollowed funciona en iPhone y Android?', a: 'Sí. Puedes solicitar tu export de Instagram y subir el ZIP desde cualquier navegador móvil.' },
  ],
  relatedGuideEyebrow: 'Guía relacionada',
  relatedGuideLink: 'Cómo ver quién te dejó de seguir en Instagram (sin que te baneen) →',
  ctaQuote: 'Ya tienes los datos. Instagram te los dio.',
  ctaSubline: 'Un ZIP. Soltado en tu navegador. Tu lista en 2 segundos.',
  ctaButton: 'Ver tu lista ahora',
  backToHome: 'Volver a WhoUnfollowed',
};

const PT: WhatIsContent = {
  eyebrow: 'O que é o WhoUnfollowed',
  headline: 'Veja quem não te segue de volta no Instagram.',
  headlineItalic: 'Código aberto, então você não precisa confiar na nossa palavra.',
  intro: 'Você envia o arquivo de dados que o Instagram já te deu. O WhoUnfollowed o lê localmente no seu navegador e mostra a lista completa em menos de 2 segundos. Sem senha, sem servidor, sem login. Cada linha de código que toca seus dados é pública, então você pode verificar por conta própria em vez de confiar numa política de privacidade.',
  seeListNow: 'Ver sua lista agora',
  stats: [
    { value: '2s', label: 'para ver seus resultados' },
    { value: '0', label: 'arquivos enviados para nós' },
    { value: '2', label: 'licenças de código aberto' },
  ],
  problemEyebrow: 'O problema',
  problemHeadline: 'Todo app que tenta pede sua senha. Isso é ilegal, perigoso e desnecessário.',
  problemItems: [
    { icon: '🚫', text: 'Viola os Termos de Serviço do Instagram' },
    { icon: '⚠', text: 'Milhares de contas já foram banidas permanentemente dessa forma' },
    { icon: '💾', text: 'Vários apps foram flagrados guardando e vendendo credenciais' },
    { icon: '🔒', text: 'Código fechado, então você não tem como verificar o que eles realmente fazem com seus dados' },
  ],
  problemClosing: 'O WhoUnfollowed resolve o mesmo problema sem nenhum desses riscos, e o código que prova isso é público no GitHub, então você pode verificar por conta própria em vez de confiar na nossa palavra.',
  howEyebrow: 'Como funciona',
  howHeadline: 'O Instagram já tem seus dados. A gente só lê.',
  howSteps: [
    { time: '30 seg', title: 'Solicite seu export', body: 'Vá em Configurações do Instagram → Central de contas → Suas informações → Baixar suas informações. Selecione Seguidores e Seguindo.' },
    { time: 'Poucos min', title: 'O Instagram te envia o ZIP por email', body: 'Geralmente chega em minutos. Você só precisa da seção de seguidores e seguindo, não do arquivo completo.' },
    { time: '2 seg', title: 'Solte o ZIP e veja sua lista', body: 'Seu navegador o lê localmente, compara as duas listas e mostra cada conta que você segue e que não te segue de volta.' },
  ],
  fullGuideLink: 'Guia completo passo a passo →',
  whyUsEyebrow: 'Por que a gente',
  whyUsHeadline: 'A diferença é clara.',
  compareFeatureHeader: 'Recurso',
  compareUsHeader: 'WhoUnfollowed',
  compareThemHeader: 'Outros apps',
  compareRows: [
    { feature: 'Nunca pede sua senha', us: true, them: false },
    { feature: 'Zero risco de banimento de conta', us: true, them: false },
    { feature: 'Credenciais nunca são armazenadas', us: true, them: false },
    { feature: 'Sem necessidade de cadastro', us: true, them: false },
    { feature: 'Código aberto (AGPL-3.0 + MPL-2.0)', us: true, them: false },
    { feature: 'Funciona offline no navegador', us: true, them: false },
    { feature: 'Plano grátis disponível', us: true, them: true },
  ],
  whatYouGetEyebrow: 'O que você ganha',
  whatYouGetHeadline: 'Um envio. Clareza total.',
  whatYouGetItems: [
    { icon: '👥', title: 'Lista de não-seguidores', body: 'Cada conta que você segue e que não te segue de volta, com data e hora.' },
    { icon: '⭐', title: 'Fãs', body: 'Contas que te seguem mas que você não segue de volta.' },
    { icon: '🤝', title: 'Mútuos', body: 'Contas que se seguem mutuamente.' },
    { icon: '📊', title: 'Radar (Pro)', body: 'Pontuação de saúde, barras de tempo de seguidor, gráficos de crescimento e quem deixou de te seguir entre envios.' },
    { icon: '📋', title: 'Exportar CSV', body: 'Baixe qualquer lista como planilha.' },
    { icon: '🔍', title: 'Fluxo de triagem', body: 'Marque contas como Remover, Lista branca ou Pular para acompanhar sua limpeza.' },
  ],
  faqEyebrow: 'Perguntas',
  faqHeadline: 'Respostas rápidas.',
  faqItems: [
    { q: 'O WhoUnfollowed é grátis?', a: `Sim. Ver sua lista completa de não-seguidores, seguidores mútuos e fãs é grátis e não precisa de conta. O Pro é um pagamento único (${UNLOCK_PRICE_SUMMARY}, sem cobrança recorrente) que adiciona histórico de snapshots, gráficos de crescimento, detecção de seguidores fantasma e sincronização criptografada na nuvem entre seus dispositivos.` },
    { q: 'O WhoUnfollowed precisa da minha senha do Instagram?', a: 'Não. O WhoUnfollowed não tem login do Instagram. Você envia um arquivo ZIP que o Instagram te manda diretamente por email. Sua senha nunca está envolvida.' },
    { q: 'O Instagram vai banir minha conta por usar o WhoUnfollowed?', a: 'Não. O WhoUnfollowed usa o export oficial de dados do Instagram sob o RGPD. Você não está usando uma API de terceiros, nem fazendo scraping do Instagram, nem violando nenhum Termo de Serviço.' },
    { q: 'Quanto tempo leva para ter os resultados?', a: 'Cerca de 15 minutos do início ao fim. 30 segundos para solicitar seu export, alguns minutos para o Instagram enviar por email, e 2 segundos para o WhoUnfollowed processar.' },
    { q: 'O WhoUnfollowed é de código aberto?', a: 'O parser principal (packages/core) tem licença MPL-2.0 e é público no GitHub. Você pode ler exatamente o que acontece com seus dados. O app web é AGPL-3.0, e qualquer um pode hospedá-lo por conta própria, mas os recursos Pro (histórico de snapshots entre dispositivos, sincronização criptografada na nuvem, gráficos de tendência) exigem o serviço na nuvem porque dependem de infraestrutura de servidor.' },
    { q: 'O WhoUnfollowed funciona no iPhone e Android?', a: 'Sim. Você pode solicitar seu export do Instagram e enviar o ZIP de qualquer navegador móvel.' },
  ],
  relatedGuideEyebrow: 'Guia relacionado',
  relatedGuideLink: 'Como ver quem deixou de te seguir no Instagram (sem ser banido) →',
  ctaQuote: 'Você já tem os dados. O Instagram te deu.',
  ctaSubline: 'Um ZIP. Solto no seu navegador. Sua lista em 2 segundos.',
  ctaButton: 'Ver sua lista agora',
  backToHome: 'Voltar ao WhoUnfollowed',
};

export function getWhatIsContent(locale: AppLocale): WhatIsContent {
  if (locale === 'es') return ES;
  if (locale === 'pt') return PT;
  return EN;
}
