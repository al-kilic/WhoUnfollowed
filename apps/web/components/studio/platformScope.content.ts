// Which Studio features read Instagram data only, said plainly (see
// .claude/reference/platform-matrix.md).
export type ScopeFeature = 'create' | 'plan' | 'insights' | 'memory';

interface ScopeContent {
  chip: string;
  chipLabel: string;
  // The small badge left of the section tabs, and what works on other platforms.
  badge: string;
  others: string;
  lines: Record<ScopeFeature, string>;
  elsewhere: (p: string, line: string) => string;
  switchIg: string;
  getIg: string;
  newer: (p: string) => string;
  show: (p: string) => string;
}

const EN: ScopeContent = {
  chip: 'Instagram',
  chipLabel: 'Built for Instagram',
  badge: 'Instagram only',
  others: 'Threads and TikTok exports work in Results, Radar and Goals.',
  lines: {
    create: 'Writing, post checks and ideas are built for Instagram posts: Reels, carousels and photos.',
    plan: 'Plans and the posted log are built for Instagram posts for now.',
    insights: "Photo insights reads your Instagram posts. Threads and TikTok exports don't include them yet.",
    memory: "Voice and photo style are learned from your Instagram posts. Threads and TikTok exports don't include them yet.",
  },
  elsewhere: (p, line) => `You're looking at ${p}. ${line} Your ${p} followers are in Results, Radar and Goal.`,
  switchIg: 'Switch to Instagram',
  getIg: 'Get your Instagram export',
  newer: (p) => `Your ${p} export is newer.`,
  show: (p) => `Show ${p}`,
};

const ES: ScopeContent = {
  chip: 'Instagram',
  chipLabel: 'Pensado para Instagram',
  badge: 'Solo Instagram',
  others: 'Los exports de Threads y TikTok funcionan en Resultados, Radar y Objetivos.',
  lines: {
    create: 'Escribir, revisar posts e ideas están pensados para posts de Instagram: Reels, carruseles y fotos.',
    plan: 'Los planes y el registro de publicaciones están pensados para posts de Instagram por ahora.',
    insights: 'El análisis de fotos lee tus posts de Instagram. Los exports de Threads y TikTok todavía no los incluyen.',
    memory: 'Tu voz y tu estilo de fotos se aprenden de tus posts de Instagram. Los exports de Threads y TikTok todavía no los incluyen.',
  },
  elsewhere: (p, line) => `Estás viendo ${p}. ${line} Tus seguidores de ${p} están en Resultados, Radar y Objetivo.`,
  switchIg: 'Cambiar a Instagram',
  getIg: 'Consigue tu export de Instagram',
  newer: (p) => `Tu export de ${p} es más reciente.`,
  show: (p) => `Ver ${p}`,
};

const PT: ScopeContent = {
  chip: 'Instagram',
  chipLabel: 'Feito para o Instagram',
  badge: 'Só Instagram',
  others: 'As exportações do Threads e do TikTok funcionam em Resultados, Radar e Metas.',
  lines: {
    create: 'Escrever, revisar posts e ideias foram feitos para posts do Instagram: Reels, carrosséis e fotos.',
    plan: 'Os planos e o registro de posts são feitos para posts do Instagram por enquanto.',
    insights: 'A análise de fotos lê seus posts do Instagram. Os exports do Threads e do TikTok ainda não os incluem.',
    memory: 'Sua voz e seu estilo de fotos são aprendidos dos seus posts do Instagram. Os exports do Threads e do TikTok ainda não os incluem.',
  },
  elsewhere: (p, line) => `Você está vendo o ${p}. ${line} Seus seguidores do ${p} estão em Resultados, Radar e Meta.`,
  switchIg: 'Mudar para o Instagram',
  getIg: 'Pegue seu export do Instagram',
  newer: (p) => `Seu export do ${p} é mais recente.`,
  show: (p) => `Ver ${p}`,
};

export function getScopeContent(locale: string): ScopeContent {
  return locale === 'es' ? ES : locale === 'pt' ? PT : EN;
}
