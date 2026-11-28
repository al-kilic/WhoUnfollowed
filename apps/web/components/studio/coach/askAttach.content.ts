export interface AskAttachContent {
  add: string; menu: string; photo: string; photoHint: string; report: string; reportHint: string;
  plan: string; goal: string; insights: string; check: string; radar: string;
  remove: (what: string) => string; nothing: string; tooMuch: string; maxPhotos: string; exportOf: (platform: string, date: string) => string;
  labels: { report: (platform: string, date: string) => string; plan: string; goal: (platform: string) => string; insights: string; check: string; radar: (platform: string) => string; photo: (n: number) => string };
  privacy: string;
}

const en: AskAttachContent = {
  add: 'Add to your question', menu: 'Attach', photo: 'Photos', photoHint: 'Up to 3, only for this question',
  report: 'An export report', reportHint: 'Numbers only, never usernames',
  plan: 'Your 30-day plan', goal: 'Your goal', insights: 'Latest photo insights', check: 'Recent post checks', radar: 'Radar summary',
  remove: (w) => `Remove ${w}`, nothing: 'Nothing to attach yet for this. Create it first, then attach it here.',
  tooMuch: 'That is more than your coach can read with one question. Remove something first.', maxPhotos: 'Up to 3 photos per question.',
  exportOf: (p, d) => `${p} · ${d}`,
  labels: { report: (p, d) => `${p} export, ${d}`, plan: '30-day plan', goal: (p) => `${p} goal`, insights: 'Photo insights', check: 'Post checks', radar: (p) => `${p} Radar`, photo: (n) => `Photo ${n}` },
  privacy: 'Attachments go with this question only and are not saved.',
};

const es: AskAttachContent = {
  add: 'Añadir a tu pregunta', menu: 'Adjuntar', photo: 'Fotos', photoHint: 'Hasta 3, solo para esta pregunta',
  report: 'Un informe de exportación', reportHint: 'Solo números, nunca nombres de usuario',
  plan: 'Tu plan de 30 días', goal: 'Tu objetivo', insights: 'Último análisis de fotos', check: 'Revisiones recientes', radar: 'Resumen del Radar',
  remove: (w) => `Quitar ${w}`, nothing: 'Todavía no hay nada que adjuntar aquí. Créalo primero y luego adjúntalo.',
  tooMuch: 'Es más de lo que tu coach puede leer en una pregunta. Quita algo primero.', maxPhotos: 'Hasta 3 fotos por pregunta.',
  exportOf: (p, d) => `${p} · ${d}`,
  labels: { report: (p, d) => `Exportación de ${p}, ${d}`, plan: 'Plan de 30 días', goal: (p) => `Objetivo de ${p}`, insights: 'Análisis de fotos', check: 'Revisiones de posts', radar: (p) => `Radar de ${p}`, photo: (n) => `Foto ${n}` },
  privacy: 'Los adjuntos van solo con esta pregunta y no se guardan.',
};

const pt: AskAttachContent = {
  add: 'Adicionar à sua pergunta', menu: 'Anexar', photo: 'Fotos', photoHint: 'Até 3, só para esta pergunta',
  report: 'Um relatório de exportação', reportHint: 'Só números, nunca nomes de usuário',
  plan: 'Seu plano de 30 dias', goal: 'Sua meta', insights: 'Última análise de fotos', check: 'Revisões recentes', radar: 'Resumo do Radar',
  remove: (w) => `Remover ${w}`, nothing: 'Ainda não há nada para anexar aqui. Crie primeiro e depois anexe.',
  tooMuch: 'É mais do que seu coach consegue ler numa pergunta. Remova algo primeiro.', maxPhotos: 'Até 3 fotos por pergunta.',
  exportOf: (p, d) => `${p} · ${d}`,
  labels: { report: (p, d) => `Exportação do ${p}, ${d}`, plan: 'Plano de 30 dias', goal: (p) => `Meta do ${p}`, insights: 'Análise de fotos', check: 'Revisões de posts', radar: (p) => `Radar do ${p}`, photo: (n) => `Foto ${n}` },
  privacy: 'Os anexos vão só com esta pergunta e não são salvos.',
};

export const getAskAttachContent = (locale: string): AskAttachContent => (locale === 'es' ? es : locale === 'pt' ? pt : en);
