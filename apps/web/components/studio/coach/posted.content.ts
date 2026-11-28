import type { AppLocale } from '@/i18n/routing';

// Copy for Studio > Plan > Posted.
export interface PostedContent {
  coach: string;
  better: (best: string, times: string, other: string) => string;
  onlyOne: (fmt: string, n: string) => string;
  needResults: string;
  privacy: string;
  addFor: (hook: string) => string;
  seeRadar: string;
  barsNote: (n: number) => string;
  log: string; date: string; post: string; score: string; status: string;
  checked: string; fromPlan: string; postedS: string; result: (n: string) => string;
  addResults: string; markPosted: string; save: string; cancel: string;
  likes: string; saves: string; newFollowers: string;
  empty: string; check: string;
  kPosted: string; kFrom: string; kBeat: string; kWait: string; vsLast: (n: number) => string; thisMonth: string; of: (n: number) => string;
  addNow: string; caughtUp: string; postedOn: (d: string) => string;
  pattern: string; perPost: string; avg: (n: string) => string; noChart: string;
  learned: string; memory: string; learnedNote: string; noLessons: string; inMemory: string;
  addPost: string; addTitle: string; add: string; manual: string;
}

const EN: PostedContent = {
  coach: 'Your coach',
  better: (b, x, o) => `Your ${b} posts bring you ${x}× more new followers than your ${o} posts. Keep adding results: each one teaches the coach what works for you.`,
  onlyOne: (f, n) => `Your ${f} posts bring you about ${n} new followers each so far. Add results for other formats to see what works best.`,
  needResults: 'Add the numbers once a post has been up for a few days. With a couple of results, your coach can tell which formats bring you followers.',
  privacy: 'Saved to your account: format, hook and the numbers you type. No images, no names.',
  addFor: (h) => `Add the result for "${h}"`, seeRadar: 'See it in Radar',
  barsNote: (n) => `Average new followers per post, from ${n} ${n === 1 ? 'post' : 'posts'} with results.`,
  log: 'Your posts', date: 'Date', post: 'Post', score: 'Score', status: 'Status',
  checked: 'Checked', fromPlan: 'From your plan', postedS: 'Posted', result: (n) => `+${n} followers`,
  addResults: 'Add results', markPosted: 'Mark posted', save: 'Save', cancel: 'Cancel',
  likes: 'Likes', saves: 'Saves', newFollowers: 'New followers',
  empty: 'No posts yet. Check a post in Create, then mark it as posted here.', check: 'Check a post',
  kPosted: 'Posted this month', kFrom: 'Followers from posts', kBeat: 'Beat your average', kWait: 'Waiting for a result',
  vsLast: (n) => `${n >= 0 ? '+' : ''}${n} vs last month`, thisMonth: 'this month', of: (n) => `of ${n}`,
  addNow: 'Add now', caughtUp: 'All caught up', postedOn: (d) => `posted ${d}`,
  pattern: 'Biggest pattern', perPost: 'New followers per post', avg: (n) => `Your average, +${n}`, noChart: 'Add results to a few posts to see them side by side.',
  learned: 'What the coach learned', memory: 'Memory', learnedNote: 'The coach adds a lesson when you add results. Edit or remove any of them in Memory.', noLessons: 'No lessons yet. Add results to a post and the coach writes what it learned here.', inMemory: 'In memory',
  addPost: 'Add post', addTitle: 'What was the post about?', add: 'Add', manual: 'Added by you',
};
const ES: PostedContent = {
  coach: 'Tu coach',
  better: (b, x, o) => `Tus publicaciones de ${b} te traen ${x}× más seguidores nuevos que las de ${o}. Sigue añadiendo resultados: cada uno le enseña al coach qué te funciona.`,
  onlyOne: (f, n) => `Tus publicaciones de ${f} te traen unos ${n} seguidores nuevos cada uno por ahora. Añade resultados de otros formatos para ver qué funciona mejor.`,
  needResults: 'Añade los números cuando una publicación lleve unos días. Con un par de resultados, tu coach sabrá qué formatos te traen seguidores.',
  privacy: 'Se guarda en tu cuenta: formato, gancho y los números que escribes. Sin imágenes ni nombres.',
  addFor: (h) => `Añadir el resultado de "${h}"`, seeRadar: 'Verlo en Radar',
  barsNote: (n) => `Media de seguidores nuevos por publicación, de ${n} ${n === 1 ? 'publicación' : 'publicaciones'} con resultados.`,
  log: 'Tus publicaciones', date: 'Fecha', post: 'Publicación', score: 'Nota', status: 'Estado',
  checked: 'Revisada', fromPlan: 'De tu plan', postedS: 'Publicada', result: (n) => `+${n} seguidores`,
  addResults: 'Añadir resultados', markPosted: 'Marcar como publicada', save: 'Guardar', cancel: 'Cancelar',
  likes: 'Me gusta', saves: 'Guardados', newFollowers: 'Seguidores nuevos',
  empty: 'Aún no hay publicaciones. Revisa una en Crear y márcala aquí como publicada.', check: 'Revisar una publicación',
  kPosted: 'Publicadas este mes', kFrom: 'Seguidores por publicaciones', kBeat: 'Superaron tu media', kWait: 'Esperan resultado',
  vsLast: (n) => `${n >= 0 ? '+' : ''}${n} vs el mes pasado`, thisMonth: 'este mes', of: (n) => `de ${n}`,
  addNow: 'Añadir', caughtUp: 'Todo al día', postedOn: (d) => `publicada el ${d}`,
  pattern: 'El patrón más claro', perPost: 'Seguidores nuevos por publicación', avg: (n) => `Tu media, +${n}`, noChart: 'Añade resultados a unas cuantas publicaciones para verlas juntas.',
  learned: 'Lo que aprendió el coach', memory: 'Memoria', learnedNote: 'El coach añade una lección cuando añades resultados. Edita o borra cualquiera en Memoria.', noLessons: 'Aún no hay lecciones. Añade resultados a una publicación y el coach escribirá aquí lo que aprendió.', inMemory: 'En memoria',
  addPost: 'Añadir publicación', addTitle: '¿De qué iba la publicación?', add: 'Añadir', manual: 'Añadida por ti',
};
const PT: PostedContent = {
  coach: 'Seu coach',
  better: (b, x, o) => `Seus posts de ${b} trazem ${x}× mais seguidores novos que os de ${o}. Continue adicionando resultados: cada um ensina ao coach o que funciona para você.`,
  onlyOne: (f, n) => `Seus posts de ${f} trazem cerca de ${n} seguidores novos cada por enquanto. Adicione resultados de outros formatos para ver o que funciona melhor.`,
  needResults: 'Adicione os números quando o post estiver no ar há alguns dias. Com alguns resultados, seu coach sabe quais formatos trazem seguidores.',
  privacy: 'Salvo na sua conta: formato, gancho e os números que você digita. Sem imagens, sem nomes.',
  addFor: (h) => `Adicionar o resultado de "${h}"`, seeRadar: 'Ver no Radar',
  barsNote: (n) => `Média de seguidores novos por post, de ${n} ${n === 1 ? 'post' : 'posts'} com resultados.`,
  log: 'Seus posts', date: 'Data', post: 'Post', score: 'Nota', status: 'Status',
  checked: 'Revisado', fromPlan: 'Do seu plano', postedS: 'Postado', result: (n) => `+${n} seguidores`,
  addResults: 'Adicionar resultados', markPosted: 'Marcar como postado', save: 'Salvar', cancel: 'Cancelar',
  likes: 'Curtidas', saves: 'Salvos', newFollowers: 'Seguidores novos',
  empty: 'Ainda não há posts. Revise um em Criar e marque como postado aqui.', check: 'Revisar um post',
  kPosted: 'Postados este mês', kFrom: 'Seguidores vindos de posts', kBeat: 'Acima da sua média', kWait: 'Aguardando resultado',
  vsLast: (n) => `${n >= 0 ? '+' : ''}${n} vs mês passado`, thisMonth: 'este mês', of: (n) => `de ${n}`,
  addNow: 'Adicionar', caughtUp: 'Tudo em dia', postedOn: (d) => `postado em ${d}`,
  pattern: 'O padrão mais claro', perPost: 'Seguidores novos por post', avg: (n) => `Sua média, +${n}`, noChart: 'Adicione resultados a alguns posts para vê-los lado a lado.',
  learned: 'O que o coach aprendeu', memory: 'Memória', learnedNote: 'O coach adiciona uma lição quando você adiciona resultados. Edite ou remova qualquer uma na Memória.', noLessons: 'Ainda não há lições. Adicione resultados a um post e o coach escreve aqui o que aprendeu.', inMemory: 'Na memória',
  addPost: 'Adicionar post', addTitle: 'Sobre o que era o post?', add: 'Adicionar', manual: 'Adicionado por você',
};

export function getPostedContent(locale: AppLocale): PostedContent {
  return locale === 'es' ? ES : locale === 'pt' ? PT : EN;
}
