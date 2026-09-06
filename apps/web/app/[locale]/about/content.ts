import type { AppLocale } from '@/i18n/routing';

export interface AboutContent {
  eyebrow: string;
  headlineLine1: string;
  headlineLine2: string;
  intro1: string;
  intro2Prefix: string;
  intro2GithubLink: string;
  intro2Suffix: string;
  devName: string;
  devTagline: string;
  devBio1: string;
  devBioStudio: string;
  devBio2: string;
  emailLabel: string;
  philosophyEyebrow: string;
  philosophyHeadlineLine1: string;
  philosophyHeadlineLine2: string;
  principles: { title: string; body: string }[];
  comingEyebrow: string;
  comingHeadline: string;
  comingBody: string;
  apps: { name: string; desc: string }[];
  soonBadge: string;
  tryIt: string;
  followOnGithub: string;
  ctaQuote: string;
  ctaTryFree: string;
  ctaGetInTouch: string;
  backToHome: string;
}

const EN: AboutContent = {
  eyebrow: 'About',
  headlineLine1: 'Built by one person.',
  headlineLine2: 'For everyone tired of the alternative.',
  intro1: 'WhoUnfollowed is an independent product. No VC funding. No team of twenty. Just a developer who got tired of every Instagram tool asking for a password it had no business asking for.',
  intro2Prefix: 'So the whole thing is open source: the web app under AGPL-3.0, the parser that touches your data under MPL-2.0. If you don\'t want to trust a privacy policy, don\'t. Read the code on',
  intro2GithubLink: 'GitHub',
  intro2Suffix: 'instead.',
  devName: 'Alan Kilic',
  devTagline: 'Product builder, photographer, entrepreneur.',
  devBio1: 'I build privacy-first software under the name',
  devBioStudio: 'Alcatraz Studio',
  devBio2: '- a one-person lab focused on giving people control over their own data. Every app I ship does one thing well and never asks for more access than it needs.',
  emailLabel: 'Email',
  philosophyEyebrow: 'Philosophy',
  philosophyHeadlineLine1: 'Privacy is not a feature.',
  philosophyHeadlineLine2: "It's the baseline.",
  principles: [
    { title: 'Minimum access', body: 'Every app I build asks for the least access necessary to do its job. If an app can work without touching your credentials, it works without your credentials.' },
    { title: 'Auditable code', body: 'WhoUnfollowed ships fully open source, the web app under AGPL-3.0 and the parser under MPL-2.0. You should be able to verify what happens to your information, not just trust a privacy policy.' },
    { title: 'No dark patterns', body: "No misleading defaults. No 'agree to share your data' buried in onboarding. If something is optional, it's off by default." },
  ],
  comingEyebrow: "What's coming",
  comingHeadline: 'More apps. Same principles.',
  comingBody: 'WhoUnfollowed is the first of several privacy-first tools. Each one targets a space where existing apps routinely overstep.',
  apps: [
    { name: 'WhoUnfollowed', desc: 'See who stopped following you on Instagram. No password.' },
    { name: 'DataVault', desc: 'See and delete everything companies know about you.' },
    { name: 'TrackOut', desc: 'Find hidden trackers across the apps on your phone.' },
  ],
  soonBadge: 'SOON',
  tryIt: 'Try it →',
  followOnGithub: 'Follow the work on GitHub:',
  ctaQuote: 'Start with WhoUnfollowed. It takes 2 minutes.',
  ctaTryFree: 'Try it free →',
  ctaGetInTouch: 'Get in touch',
  backToHome: 'Back to WhoUnfollowed',
};

const ES: AboutContent = {
  eyebrow: 'Acerca de',
  headlineLine1: 'Construido por una sola persona.',
  headlineLine2: 'Para todos los que están cansados de la alternativa.',
  intro1: 'WhoUnfollowed es un producto independiente. Sin financiación de inversores. Sin un equipo de veinte personas. Solo un desarrollador cansado de que cada herramienta de Instagram pidiera una contraseña que no tenía por qué pedir.',
  intro2Prefix: 'Así que todo es de código abierto: la app web bajo AGPL-3.0, el parser que toca tus datos bajo MPL-2.0. Si no quieres confiar en una política de privacidad, no lo hagas. Lee el código en',
  intro2GithubLink: 'GitHub',
  intro2Suffix: 'en su lugar.',
  devName: 'Alan Kilic',
  devTagline: 'Constructor de productos, fotógrafo, emprendedor.',
  devBio1: 'Construyo software que respeta la privacidad bajo el nombre',
  devBioStudio: 'Alcatraz Studio',
  devBio2: '- un laboratorio de una sola persona enfocado en darle a la gente control sobre sus propios datos. Cada app que lanzo hace una cosa bien y nunca pide más acceso del que necesita.',
  emailLabel: 'Correo',
  philosophyEyebrow: 'Filosofía',
  philosophyHeadlineLine1: 'La privacidad no es una función.',
  philosophyHeadlineLine2: 'Es la base.',
  principles: [
    { title: 'Acceso mínimo', body: 'Cada app que construyo pide el mínimo acceso necesario para hacer su trabajo. Si una app puede funcionar sin tocar tus credenciales, funciona sin tus credenciales.' },
    { title: 'Código auditable', body: 'WhoUnfollowed se distribuye completamente de código abierto, la app web bajo AGPL-3.0 y el parser bajo MPL-2.0. Deberías poder verificar qué pasa con tu información, no solo confiar en una política de privacidad.' },
    { title: 'Sin patrones oscuros', body: 'Sin configuraciones predeterminadas engañosas. Sin "acepta compartir tus datos" escondido en el onboarding. Si algo es opcional, viene desactivado por defecto.' },
  ],
  comingEyebrow: 'Lo que viene',
  comingHeadline: 'Más apps. Los mismos principios.',
  comingBody: 'WhoUnfollowed es la primera de varias herramientas que respetan la privacidad. Cada una se enfoca en un área donde las apps existentes suelen sobrepasar los límites.',
  apps: [
    { name: 'WhoUnfollowed', desc: 'Ve quién dejó de seguirte en Instagram. Sin contraseña.' },
    { name: 'DataVault', desc: 'Ve y elimina todo lo que las empresas saben sobre ti.' },
    { name: 'TrackOut', desc: 'Encuentra rastreadores ocultos en las apps de tu teléfono.' },
  ],
  soonBadge: 'PRONTO',
  tryIt: 'Probar →',
  followOnGithub: 'Sigue el trabajo en GitHub:',
  ctaQuote: 'Empieza con WhoUnfollowed. Toma 2 minutos.',
  ctaTryFree: 'Probar gratis →',
  ctaGetInTouch: 'Ponte en contacto',
  backToHome: 'Volver a WhoUnfollowed',
};

const PT: AboutContent = {
  eyebrow: 'Sobre',
  headlineLine1: 'Feito por uma pessoa só.',
  headlineLine2: 'Para todos que estão cansados da alternativa.',
  intro1: 'O WhoUnfollowed é um produto independente. Sem investimento de capital de risco. Sem uma equipe de vinte pessoas. Só um desenvolvedor cansado de todo app do Instagram pedir uma senha que não tinha motivo para pedir.',
  intro2Prefix: 'Por isso tudo é de código aberto: o app web sob AGPL-3.0, o parser que toca seus dados sob MPL-2.0. Se você não quer confiar numa política de privacidade, não confie. Leia o código no',
  intro2GithubLink: 'GitHub',
  intro2Suffix: 'em vez disso.',
  devName: 'Alan Kilic',
  devTagline: 'Construtor de produtos, fotógrafo, empreendedor.',
  devBio1: 'Eu construo software com privacidade em primeiro lugar sob o nome',
  devBioStudio: 'Alcatraz Studio',
  devBio2: '- um laboratório de uma pessoa só focado em dar às pessoas controle sobre os próprios dados. Cada app que eu lanço faz uma coisa bem e nunca pede mais acesso do que precisa.',
  emailLabel: 'Email',
  philosophyEyebrow: 'Filosofia',
  philosophyHeadlineLine1: 'Privacidade não é um recurso.',
  philosophyHeadlineLine2: 'É a base.',
  principles: [
    { title: 'Acesso mínimo', body: 'Cada app que eu construo pede o mínimo de acesso necessário para fazer seu trabalho. Se um app pode funcionar sem tocar nas suas credenciais, ele funciona sem suas credenciais.' },
    { title: 'Código auditável', body: 'O WhoUnfollowed é distribuído totalmente de código aberto, o app web sob AGPL-3.0 e o parser sob MPL-2.0. Você deve conseguir verificar o que acontece com suas informações, não só confiar numa política de privacidade.' },
    { title: 'Sem padrões obscuros', body: 'Sem padrões enganosos. Sem "aceite compartilhar seus dados" escondido no onboarding. Se algo é opcional, vem desativado por padrão.' },
  ],
  comingEyebrow: 'O que vem por aí',
  comingHeadline: 'Mais apps. Os mesmos princípios.',
  comingBody: 'O WhoUnfollowed é o primeiro de vários apps com privacidade em primeiro lugar. Cada um foca numa área onde os apps existentes costumam ultrapassar limites.',
  apps: [
    { name: 'WhoUnfollowed', desc: 'Veja quem deixou de te seguir no Instagram. Sem senha.' },
    { name: 'DataVault', desc: 'Veja e apague tudo que as empresas sabem sobre você.' },
    { name: 'TrackOut', desc: 'Encontre rastreadores ocultos nos apps do seu celular.' },
  ],
  soonBadge: 'EM BREVE',
  tryIt: 'Testar →',
  followOnGithub: 'Acompanhe o trabalho no GitHub:',
  ctaQuote: 'Comece com o WhoUnfollowed. Leva 2 minutos.',
  ctaTryFree: 'Testar grátis →',
  ctaGetInTouch: 'Entre em contato',
  backToHome: 'Voltar ao WhoUnfollowed',
};

export function getAboutContent(locale: AppLocale): AboutContent {
  if (locale === 'es') return ES;
  if (locale === 'pt') return PT;
  return EN;
}
