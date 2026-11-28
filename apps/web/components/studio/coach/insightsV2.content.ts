import type { AppLocale } from '@/i18n/routing';

// Photo insights v2 (Nov 2026): the promise, the one-click path from the
// export, the ranked image cards and the way back to earlier analyses.
export interface InsightsV2 {
  kicker: string; title: string; body: string; start: string; byHand: string; steps: string[];
  example: string; exampleNote: string;
  picked: (n: number) => string; analyzeN: (n: number) => string; noNumbers: string; reachShort: string; likesShort: string;
  ranked: string; times: (x: string) => string; worked: string; flat: string; tryTip: string; noRank: string;
  newAnalysis: string; earlierTitle: string; back: string; postsN: (n: number) => string; latest: string;
  toPosted: string; toPostedDone: (n: number) => string; toPostedNote: string;
  shootNextSub: string; patternsSub: string;
}

const EN: InsightsV2 = {
  kicker: 'Photo insights',
  title: 'Find out which of your photos grow your account, and what to shoot next.',
  body: 'Choose your full Instagram export. Each post is matched with Instagram’s own numbers, your strongest and weakest recent posts are picked for you, and your coach explains what separates them.',
  start: 'Analyze my posts', byHand: 'Add photos by hand instead',
  steps: ['Choose your export ZIP', 'Your best and weakest posts are picked, with their numbers', 'See what worked and what to shoot next'],
  example: 'Example', exampleNote: 'An example from a sample account. Yours uses your own photos and numbers.',
  picked: (n) => `${n} posts picked: your strongest and weakest recent ones. Tap to change.`,
  analyzeN: (n) => `Analyze ${n} ${n === 1 ? 'post' : 'posts'}`,
  noNumbers: 'This export has no Instagram numbers for these posts, so your coach compares the photos and captions.',
  reachShort: 'reach', likesShort: 'likes',
  ranked: 'Your posts, ranked', times: (x) => `${x}× your usual`, worked: 'Worked', flat: 'Fell flat', tryTip: 'Try', noRank: 'No numbers',
  newAnalysis: 'New analysis', earlierTitle: 'Your analyses', back: 'Back to your analyses', postsN: (n) => `${n} posts`, latest: 'Latest',
  toPosted: 'Add these posts to Posted', toPostedDone: (n) => `${n} posts added to Posted`, toPostedNote: 'With Instagram’s numbers, so your goals and patterns use them.',
  shootNextSub: 'Three ideas built on what already works for you.', patternsSub: 'What your best posts have in common.',
};
const ES: InsightsV2 = {
  kicker: 'Análisis de fotos',
  title: 'Descubre qué fotos hacen crecer tu cuenta y qué fotografiar después.',
  body: 'Elige tu exportación completa de Instagram. Cada publicación se cruza con los números de Instagram, se eligen tus publicaciones recientes más fuertes y más flojas, y tu coach explica qué las separa.',
  start: 'Analizar mis publicaciones', byHand: 'Mejor añadir fotos a mano',
  steps: ['Elige el ZIP de tu exportación', 'Se eligen tus mejores y peores publicaciones, con sus números', 'Mira qué funcionó y qué fotografiar después'],
  example: 'Ejemplo', exampleNote: 'Un ejemplo de una cuenta de muestra. El tuyo usa tus fotos y tus números.',
  picked: (n) => `${n} publicaciones elegidas: tus recientes más fuertes y más flojas. Toca para cambiar.`,
  analyzeN: (n) => `Analizar ${n} ${n === 1 ? 'publicación' : 'publicaciones'}`,
  noNumbers: 'Esta exportación no trae números de Instagram para estas publicaciones, así que tu coach compara las fotos y los textos.',
  reachShort: 'alcance', likesShort: 'me gusta',
  ranked: 'Tus publicaciones, en orden', times: (x) => `${x}× lo habitual`, worked: 'Funcionó', flat: 'No funcionó', tryTip: 'Prueba', noRank: 'Sin números',
  newAnalysis: 'Nuevo análisis', earlierTitle: 'Tus análisis', back: 'Volver a tus análisis', postsN: (n) => `${n} publicaciones`, latest: 'Último',
  toPosted: 'Añadir estas publicaciones a Publicadas', toPostedDone: (n) => `${n} publicaciones añadidas a Publicadas`, toPostedNote: 'Con los números de Instagram, para tus metas y patrones.',
  shootNextSub: 'Tres ideas basadas en lo que ya te funciona.', patternsSub: 'Lo que tienen en común tus mejores publicaciones.',
};
const PT: InsightsV2 = {
  kicker: 'Análise de fotos',
  title: 'Descubra quais fotos fazem sua conta crescer e o que fotografar depois.',
  body: 'Escolha sua exportação completa do Instagram. Cada post é cruzado com os números do Instagram, seus posts recentes mais fortes e mais fracos são escolhidos para você, e seu coach explica o que os separa.',
  start: 'Analisar meus posts', byHand: 'Prefiro adicionar fotos à mão',
  steps: ['Escolha o ZIP da sua exportação', 'Seus melhores e piores posts são escolhidos, com os números', 'Veja o que funcionou e o que fotografar depois'],
  example: 'Exemplo', exampleNote: 'Um exemplo de uma conta de amostra. O seu usa suas fotos e seus números.',
  picked: (n) => `${n} posts escolhidos: seus recentes mais fortes e mais fracos. Toque para mudar.`,
  analyzeN: (n) => `Analisar ${n} ${n === 1 ? 'post' : 'posts'}`,
  noNumbers: 'Esta exportação não tem números do Instagram para estes posts, então seu coach compara as fotos e as legendas.',
  reachShort: 'alcance', likesShort: 'curtidas',
  ranked: 'Seus posts, em ordem', times: (x) => `${x}× o normal`, worked: 'Funcionou', flat: 'Não funcionou', tryTip: 'Tente', noRank: 'Sem números',
  newAnalysis: 'Nova análise', earlierTitle: 'Suas análises', back: 'Voltar às suas análises', postsN: (n) => `${n} posts`, latest: 'Última',
  toPosted: 'Adicionar estes posts a Postados', toPostedDone: (n) => `${n} posts adicionados a Postados`, toPostedNote: 'Com os números do Instagram, para suas metas e padrões.',
  shootNextSub: 'Três ideias baseadas no que já funciona para você.', patternsSub: 'O que seus melhores posts têm em comum.',
};

const ALL: Record<AppLocale, InsightsV2> = { en: EN, es: ES, pt: PT };
export const getInsightsV2 = (l: AppLocale): InsightsV2 => ALL[l] ?? EN;
