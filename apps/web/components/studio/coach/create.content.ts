import type { AppLocale } from '@/i18n/routing';

export interface CreateContent {
  w: {
    sub: string; tone: string; tones: { voice: string; warmer: string; bolder: string }; length: string; lengths: { short: string; medium: string; long: string };
    previewWith: string; write3: string; options: string; selected: string; redo: string; checkIt: string; earlier: string; noEarlier: string;
    empty: string; chars: (n: number, max: number) => string; tooLong: string;
  };
  k: {
    sub: string; yourDraft: string; imageNote: string; checkAgain: string; newDraft: string; fixesLeft: (n: number) => string; ready: string; outOf: string;
    firstSlide: string; altHooks: string; useHook: string; newCaption: string; useCaption: string; cover: string; empty: string; resultsSaved: string;
    demoTitle: string; example: string; demoFix: string; demoFixLab: string;
  };
  i: { sub: string; all: string; saved: string; more: string; save: string; unsave: string; write: string; nothingSaved: string; empty: string;
    heroTitle: string; heroBody: string; steps: string[]; get5: string; demo: string[] };
}

const EN: CreateContent = {
  w: {
    sub: 'Write a hook, caption or Reel script in your voice, next to how it looks on Instagram.',
    tone: 'Tone', tones: { voice: 'Your voice', warmer: 'Warmer', bolder: 'Bolder' }, length: 'Length', lengths: { short: 'Short', medium: 'Medium', long: 'Long' },
    previewWith: 'Preview with', write3: 'Write 3 options', options: 'Options', selected: 'Selected · edit it here, the preview follows',
    redo: 'Redo', checkIt: 'Check it', earlier: 'Earlier drafts', noEarlier: 'Nothing yet.',
    empty: 'Your options show up here. Pick one and edit it; the phone shows the result.', chars: (n, m) => `${n} / ${m} characters`, tooLong: 'Too long for Instagram',
  },
  k: {
    sub: 'Score a post before it goes live, with the fixes that matter most.',
    yourDraft: 'Your draft', imageNote: 'Text and image are both checked.', checkAgain: 'Check it', newDraft: 'New draft',
    fixesLeft: (n) => `${n} ${n === 1 ? 'fix' : 'fixes'} to make`, ready: 'Ready to post', outOf: 'Out of 100',
    firstSlide: 'The first slide is checked as the cover.', altHooks: 'Stronger hooks', useHook: 'Use this hook', newCaption: 'Improved caption', useCaption: 'Use this caption', cover: 'Cover',
    empty: 'Paste your hook and caption, add the cover if you have it, and check it before you post.', resultsSaved: 'Saved to Posted. Add results there once it is live.',
    demoTitle: 'What the check shows', example: 'Example', demoFixLab: 'Top fix', demoFix: 'Name the place in the first line.',
  },
  i: { sub: 'Post ideas built from what works for your account.', all: 'All', saved: 'Saved', more: '5 more ideas', save: 'Save idea', unsave: 'Remove from saved', write: 'Write', nothingSaved: 'Nothing saved yet.', empty: 'No ideas yet. Ask for five.',
    heroTitle: 'Five ideas made from your own account', heroBody: 'Each one comes with a hook and why it fits you, based on your niche, your goal and what you have already posted.', steps: ['Reads what worked for you', 'Matches it to what works right now', 'Gives five posts with a hook each'], get5: 'Get five ideas', demo: ['Before and after of one edit', 'Three spots nobody shoots at dawn', 'The gear in my bag, honestly'] },
};
const ES: CreateContent = {
  w: {
    sub: 'Escribe un gancho, texto o guion de Reel con tu voz, junto a cómo se ve en Instagram.',
    tone: 'Tono', tones: { voice: 'Tu voz', warmer: 'Más cálido', bolder: 'Más atrevido' }, length: 'Largo', lengths: { short: 'Corto', medium: 'Medio', long: 'Largo' },
    previewWith: 'Vista previa con', write3: 'Escribir 3 opciones', options: 'Opciones', selected: 'Elegida · edítala aquí, la vista previa la sigue',
    redo: 'Rehacer', checkIt: 'Revisarla', earlier: 'Borradores anteriores', noEarlier: 'Nada todavía.',
    empty: 'Tus opciones aparecen aquí. Elige una y edítala; el teléfono muestra el resultado.', chars: (n, m) => `${n} / ${m} caracteres`, tooLong: 'Demasiado largo para Instagram',
  },
  k: {
    sub: 'Puntúa una publicación antes de publicarla, con los arreglos que más importan.',
    yourDraft: 'Tu borrador', imageNote: 'Se revisan el texto y la imagen.', checkAgain: 'Revisarla', newDraft: 'Borrador nuevo',
    fixesLeft: (n) => `${n} ${n === 1 ? 'arreglo' : 'arreglos'} por hacer`, ready: 'Lista para publicar', outOf: 'Sobre 100',
    firstSlide: 'La primera imagen se revisa como portada.', altHooks: 'Ganchos más fuertes', useHook: 'Usar este gancho', newCaption: 'Texto mejorado', useCaption: 'Usar este texto', cover: 'Portada',
    empty: 'Pega tu gancho y tu texto, añade la portada si la tienes y revísala antes de publicar.', resultsSaved: 'Guardada en Publicadas. Añade los resultados allí cuando esté publicada.',
    demoTitle: 'Lo que muestra la revisión', example: 'Ejemplo', demoFixLab: 'Arreglo principal', demoFix: 'Nombra el lugar en la primera línea.',
  },
  i: { sub: 'Ideas de publicaciones hechas con lo que le funciona a tu cuenta.', all: 'Todas', saved: 'Guardadas', more: '5 ideas más', save: 'Guardar idea', unsave: 'Quitar de guardadas', write: 'Escribir', nothingSaved: 'Nada guardado todavía.', empty: 'Aún no hay ideas. Pide cinco.',
    heroTitle: 'Cinco ideas hechas con tu propia cuenta', heroBody: 'Cada una trae un gancho y por qué encaja contigo, según tu nicho, tu objetivo y lo que ya publicaste.', steps: ['Lee lo que te funcionó', 'Lo cruza con lo que funciona ahora', 'Te da cinco publicaciones con su gancho'], get5: 'Pedir cinco ideas', demo: ['Antes y después de una edición', 'Tres sitios que nadie fotografía al amanecer', 'Lo que llevo en la mochila, sin filtros'] },
};
const PT: CreateContent = {
  w: {
    sub: 'Escreva um gancho, legenda ou roteiro de Reel com a sua voz, ao lado de como fica no Instagram.',
    tone: 'Tom', tones: { voice: 'Sua voz', warmer: 'Mais caloroso', bolder: 'Mais ousado' }, length: 'Tamanho', lengths: { short: 'Curto', medium: 'Médio', long: 'Longo' },
    previewWith: 'Prévia com', write3: 'Escrever 3 opções', options: 'Opções', selected: 'Escolhida · edite aqui, a prévia acompanha',
    redo: 'Refazer', checkIt: 'Revisar', earlier: 'Rascunhos anteriores', noEarlier: 'Nada ainda.',
    empty: 'Suas opções aparecem aqui. Escolha uma e edite; o celular mostra o resultado.', chars: (n, m) => `${n} / ${m} caracteres`, tooLong: 'Longo demais para o Instagram',
  },
  k: {
    sub: 'Dê nota a um post antes de publicar, com os ajustes que mais importam.',
    yourDraft: 'Seu rascunho', imageNote: 'Texto e imagem são revisados.', checkAgain: 'Revisar', newDraft: 'Novo rascunho',
    fixesLeft: (n) => `${n} ${n === 1 ? 'ajuste' : 'ajustes'} a fazer`, ready: 'Pronto para postar', outOf: 'De 100',
    firstSlide: 'O primeiro slide é revisado como capa.', altHooks: 'Ganchos mais fortes', useHook: 'Usar este gancho', newCaption: 'Legenda melhorada', useCaption: 'Usar esta legenda', cover: 'Capa',
    empty: 'Cole seu gancho e legenda, adicione a capa se tiver e revise antes de postar.', resultsSaved: 'Salvo em Postados. Adicione os resultados lá quando estiver no ar.',
    demoTitle: 'O que a revisão mostra', example: 'Exemplo', demoFixLab: 'Ajuste principal', demoFix: 'Diga o lugar na primeira linha.',
  },
  i: { sub: 'Ideias de posts feitas com o que funciona para a sua conta.', all: 'Todas', saved: 'Salvas', more: 'Mais 5 ideias', save: 'Salvar ideia', unsave: 'Tirar das salvas', write: 'Escrever', nothingSaved: 'Nada salvo ainda.', empty: 'Ainda não há ideias. Peça cinco.',
    heroTitle: 'Cinco ideias feitas com a sua própria conta', heroBody: 'Cada uma vem com um gancho e o motivo de combinar com você, a partir do seu nicho, do seu objetivo e do que você já postou.', steps: ['Lê o que funcionou para você', 'Cruza com o que funciona agora', 'Entrega cinco posts com um gancho cada'], get5: 'Pedir cinco ideias', demo: ['Antes e depois de uma edição', 'Três lugares que ninguém fotografa ao amanhecer', 'O que levo na mochila, sem filtro'] },
};

export function getCreateContent(locale: AppLocale): CreateContent {
  return locale === 'es' ? ES : locale === 'pt' ? PT : EN;
}
