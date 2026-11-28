import type { AppLocale } from '@/i18n/routing';

// The public Pro AI page: what the coach does for an Instagram account, in
// plain outcomes. Studio (/app) is noindex and /coach needs an account, so
// this is the one page search and AI answer engines can read about the coach.
// Copy rules: .claude/reference/research-2026-11/ai-copy-rework.md (say "the
// coach", sell outcomes, never name the engine or explain how it works).
// {monthly} and {yearly} are filled from lib/pricing.ts by the page.

export interface CoachItem { t: string; b: string }

export interface CoachPageContent {
  meta: { title: string; description: string };
  eyebrow: string;
  h1: string;
  h1Sub: string;
  intro: string;
  ctaStudio: string;
  ctaPricing: string;
  chips: string[];
  whyLab: string;
  whyH: string;
  why: CoachItem[];
  doLab: string;
  doH: string;
  do: CoachItem[];
  stayLab: string;
  stayH: string;
  stay: CoachItem[];
  seesLab: string;
  seesH: string;
  sees: string;
  never: string;
  priceLab: string;
  priceH: string;
  priceBody: string;
  priceFree: string;
  faqLab: string;
  faqH: string;
  faq: { q: string; a: string }[];
  moreLab: string;
  moreH: string;
  more: { instagram: string; brief: string; pricing: string; compare: string };
  finalH: string;
  finalSub: string;
}

const EN: CoachPageContent = {
  meta: {
    title: 'Instagram Coach That Knows Your Account',
    description: 'A coach for your Instagram that remembers your account, drafts posts in your voice, checks them before you share and plans your week. No password.',
  },
  eyebrow: 'Pro AI · the coach',
  h1: 'An Instagram coach that knows your account.',
  h1Sub: 'Draft it, check it, plan it. Without explaining yourself every time.',
  intro: 'Your coach starts from your own Instagram export, remembers your goals and your past posts, and tells you what to post next. You never share your password.',
  ctaStudio: 'Open Studio',
  ctaPricing: 'See Pro AI pricing',
  chips: ['No password', 'Remembers your account', 'Cancel any time'],
  whyLab: 'Why not just use a chat?',
  whyH: 'A chat knows what you paste in. Your coach knows your account.',
  why: [
    { t: 'Knows your account from day one', b: 'Upload once. No briefing, no pasting stats.' },
    { t: 'Remembers what you posted', b: 'And how each post did. You can read and edit what it remembers.' },
    { t: 'Tells you before you post', b: 'A score and the exact fix, not an opinion afterwards.' },
    { t: 'Shows up on your posting days', b: 'Reminders and goal check-ins, without you asking.' },
  ],
  doLab: 'What it does',
  doH: 'Draft it. Check it. Plan it.',
  do: [
    { t: 'Writes in your voice', b: 'Hooks, captions, carousels and Reel scripts that sound like you, not like a template.' },
    { t: 'Checks a post before you share it', b: 'Hook, length and call to action, each with a plain fix you can apply in a minute.' },
    { t: 'Plans your weeks', b: 'A 30-day plan around your best posting days, with reminders you can add to your calendar.' },
    { t: 'Reads every new export', b: 'Who left, who came in and what changed since last time, explained in a few lines.' },
    { t: 'Ideas from your own data', b: 'Post ideas built on what already worked for your account, not generic trends.' },
    { t: 'Answers your questions', b: 'Ask what to post this week, why reach dropped or what to fix first.' },
  ],
  stayLab: 'Stay consistent',
  stayH: 'A plan only works if you post.',
  stay: [
    { t: 'Posting-day reminders', b: 'Your plan nudges you on the days you post, caption ready.' },
    { t: 'Goal check-ins', b: 'An email with your progress toward the goal you set.' },
    { t: 'A weekly brief', b: 'What changed on Instagram, Threads and TikTok this week, and what to do about it.' },
  ],
  seesLab: 'Privacy',
  seesH: 'What your coach sees, and what it never sees',
  sees: 'Only what you choose to give it: counts and dates from your exports, what you write, and the posts or photos you pick for a request.',
  never: "Never your follower lists or anyone's username. Your export is read in your browser, and you can read, edit or delete your coach's memory any time.",
  priceLab: 'Price',
  priceH: 'Pro AI is {monthly} a month or {yearly} a year.',
  priceBody: 'It includes generous monthly use of the coach that resets with your plan, plus every Pro feature: who unfollowed you and when, every export kept, Radar and encrypted cloud sync. Cancel any time.',
  priceFree: "Seeing who doesn't follow you back stays free, with no account.",
  faqLab: 'FAQ',
  faqH: 'Questions about the coach',
  faq: [
    { q: 'What is the WhoUnfollowed coach?', a: 'It is the coach in WhoUnfollowed Pro AI. It starts from your own Instagram export, remembers your goals and past posts, drafts posts in your voice, checks a post before you share it and plans your posting weeks with reminders.' },
    { q: 'How is it different from asking a chat app?', a: 'A chat starts from zero every time and only knows what you paste in. Your coach already knows your account, remembers what you posted and how it did, and follows up on your posting days without you asking.' },
    { q: 'Do I need to give my Instagram password?', a: "No. The coach works from the official data export you download from Instagram yourself. WhoUnfollowed never asks for your password and never logs in to your account." },
    { q: 'What does the coach see?', a: "Counts and dates from your exports, what you write, and the posts or photos you pick for a request. It never sees your follower lists or anyone's username." },
    { q: 'How much does Pro AI cost?', a: 'Pro AI is {monthly} a month or {yearly} a year, and you can cancel any time. Checking who doesn\'t follow you back stays free, with no account.' },
    { q: 'Does it work for Threads and TikTok?', a: 'Unfollower tracking works for Instagram, Threads and TikTok. Writing, checks and posting plans are built for Instagram posts.' },
    { q: 'Is there a limit on how much I can use it?', a: 'Yes, a generous monthly one that resets with your plan. If you reach it, you can refill a full month for half the monthly price.' },
  ],
  moreLab: 'Keep reading',
  moreH: 'More from WhoUnfollowed',
  more: { instagram: 'Who unfollowed you on Instagram: the full guide', brief: 'This week on Instagram, Threads and TikTok', pricing: 'Free vs Pro AI, side by side', compare: 'How we compare with other tracker apps' },
  finalH: 'Start with your own export.',
  finalSub: 'Open Studio, upload your Instagram ZIP and see what your coach makes of it.',
};

const ES: CoachPageContent = {
  meta: {
    title: 'Coach de Instagram que conoce tu cuenta',
    description: 'Un coach para tu Instagram que recuerda tu cuenta, escribe posts con tu voz, los revisa antes de publicar y planifica tu semana. Sin contraseña.',
  },
  eyebrow: 'Pro AI · el coach',
  h1: 'Un coach de Instagram que conoce tu cuenta.',
  h1Sub: 'Escríbelo, revísalo, planifícalo. Sin explicarte cada vez.',
  intro: 'Tu coach parte de tu propio export de Instagram, recuerda tus objetivos y tus posts anteriores, y te dice qué publicar después. Nunca compartes tu contraseña.',
  ctaStudio: 'Abrir Studio',
  ctaPricing: 'Ver precios de Pro AI',
  chips: ['Sin contraseña', 'Recuerda tu cuenta', 'Cancela cuando quieras'],
  whyLab: '¿Por qué no usar un chat?',
  whyH: 'Un chat sabe lo que pegas. Tu coach conoce tu cuenta.',
  why: [
    { t: 'Conoce tu cuenta desde el primer día', b: 'Sube tu export una vez. Sin explicaciones, sin pegar estadísticas.' },
    { t: 'Recuerda lo que publicaste', b: 'Y cómo le fue a cada post. Puedes leer y editar lo que recuerda.' },
    { t: 'Te avisa antes de publicar', b: 'Una nota y el arreglo exacto, no una opinión después.' },
    { t: 'Aparece en tus días de publicar', b: 'Recordatorios y seguimiento de objetivos, sin que lo pidas.' },
  ],
  doLab: 'Qué hace',
  doH: 'Escríbelo. Revísalo. Planifícalo.',
  do: [
    { t: 'Escribe con tu voz', b: 'Ganchos, textos, carruseles y guiones de Reels que suenan a ti, no a una plantilla.' },
    { t: 'Revisa un post antes de publicarlo', b: 'Gancho, longitud y llamada a la acción, cada uno con un arreglo claro que aplicas en un minuto.' },
    { t: 'Planifica tus semanas', b: 'Un plan de 30 días según tus mejores días para publicar, con recordatorios para tu calendario.' },
    { t: 'Lee cada export nuevo', b: 'Quién se fue, quién llegó y qué cambió desde la última vez, explicado en pocas líneas.' },
    { t: 'Ideas a partir de tus datos', b: 'Ideas de posts basadas en lo que ya funcionó en tu cuenta, no en tendencias genéricas.' },
    { t: 'Responde tus preguntas', b: 'Pregunta qué publicar esta semana, por qué bajó el alcance o qué arreglar primero.' },
  ],
  stayLab: 'Sé constante',
  stayH: 'Un plan solo funciona si publicas.',
  stay: [
    { t: 'Recordatorios en tus días de publicar', b: 'Tu plan te avisa los días que publicas, con el texto listo.' },
    { t: 'Seguimiento de objetivos', b: 'Un email con tu avance hacia el objetivo que fijaste.' },
    { t: 'Un resumen semanal', b: 'Qué cambió esta semana en Instagram, Threads y TikTok, y qué hacer al respecto.' },
  ],
  seesLab: 'Privacidad',
  seesH: 'Qué ve tu coach y qué nunca ve',
  sees: 'Solo lo que tú decides darle: cifras y fechas de tus exports, lo que escribes y los posts o fotos que eliges para una petición.',
  never: 'Nunca tus listas de seguidores ni el nombre de usuario de nadie. Tu export se lee en tu navegador y puedes leer, editar o borrar la memoria de tu coach cuando quieras.',
  priceLab: 'Precio',
  priceH: 'Pro AI cuesta {monthly} al mes o {yearly} al año.',
  priceBody: 'Incluye un uso mensual generoso del coach que se renueva con tu plan, además de todas las funciones Pro: quién te dejó de seguir y cuándo, todos tus exports guardados, Radar y sincronización en la nube cifrada. Cancela cuando quieras.',
  priceFree: 'Ver quién no te sigue de vuelta sigue siendo gratis, sin cuenta.',
  faqLab: 'Preguntas',
  faqH: 'Preguntas sobre el coach',
  faq: [
    { q: '¿Qué es el coach de WhoUnfollowed?', a: 'Es el coach de WhoUnfollowed Pro AI. Parte de tu propio export de Instagram, recuerda tus objetivos y tus posts anteriores, escribe posts con tu voz, revisa un post antes de publicarlo y planifica tus semanas con recordatorios.' },
    { q: '¿En qué se diferencia de preguntarle a una app de chat?', a: 'Un chat empieza de cero cada vez y solo sabe lo que pegas. Tu coach ya conoce tu cuenta, recuerda lo que publicaste y cómo le fue, y te sigue en tus días de publicar sin que lo pidas.' },
    { q: '¿Tengo que dar mi contraseña de Instagram?', a: 'No. El coach trabaja con el export oficial de datos que descargas tú mismo de Instagram. WhoUnfollowed nunca pide tu contraseña ni entra en tu cuenta.' },
    { q: '¿Qué ve el coach?', a: 'Cifras y fechas de tus exports, lo que escribes y los posts o fotos que eliges para una petición. Nunca ve tus listas de seguidores ni el nombre de usuario de nadie.' },
    { q: '¿Cuánto cuesta Pro AI?', a: 'Pro AI cuesta {monthly} al mes o {yearly} al año, y puedes cancelar cuando quieras. Ver quién no te sigue de vuelta sigue siendo gratis, sin cuenta.' },
    { q: '¿Funciona con Threads y TikTok?', a: 'El seguimiento de quién te deja de seguir funciona con Instagram, Threads y TikTok. La escritura, las revisiones y los planes están pensados para posts de Instagram.' },
    { q: '¿Hay un límite de uso?', a: 'Sí, uno mensual generoso que se renueva con tu plan. Si lo alcanzas, puedes recargar un mes entero por la mitad del precio mensual.' },
  ],
  moreLab: 'Sigue leyendo',
  moreH: 'Más de WhoUnfollowed',
  more: { instagram: 'Quién te dejó de seguir en Instagram: la guía completa', brief: 'Esta semana en Instagram, Threads y TikTok', pricing: 'Gratis vs Pro AI, lado a lado', compare: 'Cómo nos comparamos con otras apps' },
  finalH: 'Empieza con tu propio export.',
  finalSub: 'Abre Studio, sube tu ZIP de Instagram y mira qué saca tu coach de él.',
};

const PT: CoachPageContent = {
  meta: {
    title: 'Coach de Instagram que conhece sua conta',
    description: 'Um coach para o seu Instagram que lembra da sua conta, escreve posts com a sua voz, revisa antes de publicar e planeja a sua semana. Sem senha.',
  },
  eyebrow: 'Pro AI · o coach',
  h1: 'Um coach de Instagram que conhece a sua conta.',
  h1Sub: 'Escreva, revise, planeje. Sem se explicar toda vez.',
  intro: 'Seu coach parte do seu próprio export do Instagram, lembra dos seus objetivos e dos seus posts anteriores, e diz o que postar a seguir. Você nunca compartilha a sua senha.',
  ctaStudio: 'Abrir o Studio',
  ctaPricing: 'Ver preços do Pro AI',
  chips: ['Sem senha', 'Lembra da sua conta', 'Cancele quando quiser'],
  whyLab: 'Por que não usar um chat?',
  whyH: 'Um chat sabe o que você cola. Seu coach conhece a sua conta.',
  why: [
    { t: 'Conhece a sua conta desde o primeiro dia', b: 'Envie o export uma vez. Sem explicações, sem colar números.' },
    { t: 'Lembra do que você postou', b: 'E de como cada post foi. Você pode ler e editar o que ele lembra.' },
    { t: 'Avisa antes de você postar', b: 'Uma nota e a correção exata, não uma opinião depois.' },
    { t: 'Aparece nos seus dias de postar', b: 'Lembretes e acompanhamento de metas, sem você pedir.' },
  ],
  doLab: 'O que ele faz',
  doH: 'Escreva. Revise. Planeje.',
  do: [
    { t: 'Escreve com a sua voz', b: 'Ganchos, legendas, carrosséis e roteiros de Reels que soam como você, não como um modelo pronto.' },
    { t: 'Revisa um post antes de você publicar', b: 'Gancho, tamanho e chamada para ação, cada um com uma correção clara que você aplica em um minuto.' },
    { t: 'Planeja as suas semanas', b: 'Um plano de 30 dias nos seus melhores dias para postar, com lembretes para a sua agenda.' },
    { t: 'Lê cada export novo', b: 'Quem saiu, quem chegou e o que mudou desde a última vez, explicado em poucas linhas.' },
    { t: 'Ideias a partir dos seus dados', b: 'Ideias de posts baseadas no que já funcionou na sua conta, não em tendências genéricas.' },
    { t: 'Responde às suas perguntas', b: 'Pergunte o que postar nesta semana, por que o alcance caiu ou o que corrigir primeiro.' },
  ],
  stayLab: 'Seja constante',
  stayH: 'Um plano só funciona se você postar.',
  stay: [
    { t: 'Lembretes nos seus dias de postar', b: 'Seu plano te avisa nos dias em que você posta, com a legenda pronta.' },
    { t: 'Acompanhamento de metas', b: 'Um email com o seu progresso rumo à meta que você definiu.' },
    { t: 'Um resumo semanal', b: 'O que mudou nesta semana no Instagram, no Threads e no TikTok, e o que fazer a respeito.' },
  ],
  seesLab: 'Privacidade',
  seesH: 'O que o seu coach vê, e o que ele nunca vê',
  sees: 'Só o que você escolhe dar a ele: números e datas dos seus exports, o que você escreve e os posts ou fotos que você escolhe para um pedido.',
  never: 'Nunca as suas listas de seguidores nem o nome de usuário de ninguém. Seu export é lido no seu navegador, e você pode ler, editar ou apagar a memória do seu coach quando quiser.',
  priceLab: 'Preço',
  priceH: 'O Pro AI custa {monthly} por mês ou {yearly} por ano.',
  priceBody: 'Inclui um uso mensal generoso do coach que renova com o seu plano, além de todos os recursos Pro: quem deixou de te seguir e quando, todos os exports guardados, Radar e sincronização na nuvem criptografada. Cancele quando quiser.',
  priceFree: 'Ver quem não te segue de volta continua grátis, sem conta.',
  faqLab: 'Perguntas',
  faqH: 'Perguntas sobre o coach',
  faq: [
    { q: 'O que é o coach do WhoUnfollowed?', a: 'É o coach do WhoUnfollowed Pro AI. Ele parte do seu próprio export do Instagram, lembra dos seus objetivos e posts anteriores, escreve posts com a sua voz, revisa um post antes de você publicar e planeja as suas semanas com lembretes.' },
    { q: 'Qual a diferença para perguntar a um app de chat?', a: 'Um chat começa do zero toda vez e só sabe o que você cola. Seu coach já conhece a sua conta, lembra do que você postou e de como foi, e te acompanha nos seus dias de postar sem você pedir.' },
    { q: 'Preciso dar a minha senha do Instagram?', a: 'Não. O coach trabalha com o export oficial de dados que você mesmo baixa do Instagram. O WhoUnfollowed nunca pede a sua senha nem entra na sua conta.' },
    { q: 'O que o coach vê?', a: 'Números e datas dos seus exports, o que você escreve e os posts ou fotos que você escolhe para um pedido. Ele nunca vê as suas listas de seguidores nem o nome de usuário de ninguém.' },
    { q: 'Quanto custa o Pro AI?', a: 'O Pro AI custa {monthly} por mês ou {yearly} por ano, e você pode cancelar quando quiser. Ver quem não te segue de volta continua grátis, sem conta.' },
    { q: 'Funciona com Threads e TikTok?', a: 'O acompanhamento de quem deixou de te seguir funciona com Instagram, Threads e TikTok. A escrita, as revisões e os planos são feitos para posts do Instagram.' },
    { q: 'Existe um limite de uso?', a: 'Sim, um limite mensal generoso que renova com o seu plano. Se você chegar nele, pode recarregar um mês inteiro pela metade do preço mensal.' },
  ],
  moreLab: 'Continue lendo',
  moreH: 'Mais do WhoUnfollowed',
  more: { instagram: 'Quem deixou de te seguir no Instagram: o guia completo', brief: 'Nesta semana no Instagram, Threads e TikTok', pricing: 'Grátis vs Pro AI, lado a lado', compare: 'Como nos comparamos com outros apps' },
  finalH: 'Comece com o seu próprio export.',
  finalSub: 'Abra o Studio, envie o seu ZIP do Instagram e veja o que o seu coach tira dele.',
};

const CONTENT: Record<AppLocale, CoachPageContent> = { en: EN, es: ES, pt: PT };

// Fills {monthly} and {yearly} in every string, so the page, its FAQ markup
// and its meta all quote the same prices from lib/pricing.ts.
export function getCoachPageContent(locale: AppLocale, prices: { monthly: string; yearly: string }): CoachPageContent {
  const fill = (s: string) => s.replace('{monthly}', prices.monthly).replace('{yearly}', prices.yearly);
  return JSON.parse(JSON.stringify(CONTENT[locale]), (_k, v: unknown) => (typeof v === 'string' ? fill(v) : v)) as CoachPageContent;
}
