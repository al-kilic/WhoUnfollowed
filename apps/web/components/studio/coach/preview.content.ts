import type { AppLocale } from '@/i18n/routing';

// Copy for the Pro AI previews on locked coach pages: a question that makes
// people curious, and what unlocking gives. Never a fake result.
export interface PreviewContent {
  badge: string; hidden: string; from: (price: string) => string; unlock: string;
  check: { title: string; body: string };
  goal: { title: string; body: string };
  posted: { title: string; body: string };
  plan: { title: string; body: string };
  ideas: { title: string; body: string };
  write: { title: string; body: string };
  insights: { title: string; body: string };
}

const EN: PreviewContent = {
  badge: 'Pro AI', hidden: 'Hidden until you unlock', from: (p) => `From ${p} a month · cancel any time`, unlock: 'Unlock with Pro AI',
  check: { title: 'What would your post score?', body: 'Six checks, the fixes that matter most, and stronger hooks in your voice. Before anyone sees it.' },
  goal: { title: 'When will you hit your number?', body: 'Your pace from every export, the date you get there, and what to change if you are behind.' },
  posted: { title: 'Which posts actually brought followers?', body: 'Every post you checked, with what it did. Your coach learns what works for you.' },
  plan: { title: 'Thirty days of posts, already planned.', body: 'Built from what works for your account, one idea and hook per day. Every day stays editable.' },
  ideas: { title: 'Five ideas made for your account.', body: 'From your niche and what has worked for you before, each with a hook in your voice.' },
  write: { title: 'Three options, in your voice.', body: 'Hooks, captions and Reel scripts that sound like you, next to how they look on Instagram.' },
  insights: { title: 'Which of your photos actually worked, and why?', body: 'Your best and weakest posts side by side: the light, angle, place and crop that made the difference, and what to shoot next.' },
};
const ES: PreviewContent = {
  badge: 'Pro AI', hidden: 'Oculto hasta que desbloquees', from: (p) => `Desde ${p} al mes · cancela cuando quieras`, unlock: 'Desbloquear con Pro AI',
  check: { title: '¿Qué puntuación sacaría tu publicación?', body: 'Seis revisiones, los arreglos que más importan y ganchos más fuertes con tu voz. Antes de que nadie la vea.' },
  goal: { title: '¿Cuándo llegarás a tu cifra?', body: 'Tu ritmo en cada exportación, la fecha en que llegas y qué cambiar si vas por detrás.' },
  posted: { title: '¿Qué publicaciones te trajeron seguidores de verdad?', body: 'Cada publicación que revisaste, con lo que logró. Tu coach aprende qué te funciona.' },
  plan: { title: 'Treinta días de publicaciones, ya planeados.', body: 'Hechos con lo que le funciona a tu cuenta, una idea y un gancho por día. Cada día se puede editar.' },
  ideas: { title: 'Cinco ideas hechas para tu cuenta.', body: 'A partir de tu nicho y de lo que te ha funcionado, cada una con un gancho con tu voz.' },
  write: { title: 'Tres opciones, con tu voz.', body: 'Ganchos, textos y guiones de Reel que suenan a ti, junto a cómo se ven en Instagram.' },
  insights: { title: '¿Cuáles de tus fotos funcionaron de verdad, y por qué?', body: 'Tus mejores y peores publicaciones lado a lado: la luz, el ángulo, el lugar y el recorte que marcaron la diferencia, y qué fotografiar después.' },
};
const PT: PreviewContent = {
  badge: 'Pro AI', hidden: 'Oculto até você desbloquear', from: (p) => `A partir de ${p} por mês · cancele quando quiser`, unlock: 'Desbloquear com o Pro AI',
  check: { title: 'Qual nota seu post tiraria?', body: 'Seis checagens, os ajustes que mais importam e ganchos mais fortes com a sua voz. Antes de alguém ver.' },
  goal: { title: 'Quando você chega no seu número?', body: 'Seu ritmo a cada exportação, a data em que você chega e o que mudar se estiver atrás.' },
  posted: { title: 'Quais posts trouxeram seguidores de verdade?', body: 'Cada post que você revisou, com o resultado. Seu coach aprende o que funciona para você.' },
  plan: { title: 'Trinta dias de posts, já planejados.', body: 'Feitos com o que funciona para a sua conta, uma ideia e um gancho por dia. Cada dia pode ser editado.' },
  ideas: { title: 'Cinco ideias feitas para a sua conta.', body: 'A partir do seu nicho e do que já funcionou, cada uma com um gancho com a sua voz.' },
  write: { title: 'Três opções, com a sua voz.', body: 'Ganchos, legendas e roteiros de Reel com a sua cara, ao lado de como ficam no Instagram.' },
  insights: { title: 'Quais das suas fotos funcionaram de verdade, e por quê?', body: 'Seus melhores e piores posts lado a lado: a luz, o ângulo, o lugar e o corte que fizeram a diferença, e o que fotografar a seguir.' },
};

export function getPreviewContent(locale: AppLocale): PreviewContent {
  return locale === 'es' ? ES : locale === 'pt' ? PT : EN;
}
