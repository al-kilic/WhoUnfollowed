import type { AppLocale } from '@/i18n/routing';

// Studio > Plan > Photo insights.
export interface InsightsContent {
  sub: string; how: string; privacy: string;
  post: (n: number) => string; photo: string; changePhoto: string; place: string; placePh: string; date: string; caption: string;
  likes: string; comments: string; saves: string; shares: string; reach: string; numbersHint: string;
  addPost: string; remove: string; analyze: string; needMore: (n: number) => string;
  winners: string; losers: string; patterns: string; shootNext: string; crop: string; again: string; earlier: string;
  previewTitle: string; previewBody: string;
  pullTitle: string; pullBody: string; pullCta: string; reading: string; noPosts: string; bigFile: string; howExport: string;
  pickHelp: (n: number) => string; addSelected: (n: number) => string; likesNote: string;
  handTitle: string; handBody: string; postsTitle: string; ready: (n: number, max: number) => string;
  analysis: string; youGet: string; gets: string[]; recommended: string;
  step1: string; step2: string; openMeta: string; pick: string[]; important: string; requested: (ago: string) => string;
  remindIn: string; hours: (n: number) => string; google: string; ics: string; remindTitle: string; remindBody: string; remindNote: string; noExportYet: string;
}

const EN: InsightsContent = {
  sub: 'Your own posts side by side: what made the best ones work, and what to shoot next.',
  how: 'Pick 3 to 8 of your posts, your best and your weakest. Add the numbers from Instagram: open the post, then View insights.',
  privacy: 'Photos are resized in your browser and sent only for this analysis. They are never stored.',
  post: (n) => `Post ${n}`, photo: 'Add the first slide', changePhoto: 'Change photo', place: 'Place', placePh: 'Brooklyn Bridge, New York', date: 'Posted on', caption: 'Caption (optional)',
  likes: 'Likes', comments: 'Comments', saves: 'Saves', shares: 'Shares', reach: 'Reach', numbersHint: 'Leave empty what you do not see.',
  addPost: 'Add a post', remove: 'Remove', analyze: 'Analyze my posts', needMore: (n) => `Add ${n} more ${n === 1 ? 'post' : 'posts'} with a photo`,
  winners: 'What worked', losers: 'What did not', patterns: 'Patterns', shootNext: 'Shoot next', crop: 'Crop and slide order', again: 'Analyze other posts', earlier: 'Earlier insights',
  previewTitle: 'Which of your photos actually worked, and why?',
  previewBody: 'Your best and weakest posts side by side: the light, angle, place and crop that made the difference, and what to shoot next.',
  pullTitle: 'Pull from your full export', pullBody: 'Pick the ZIP of your full Instagram export. Your posts and photos are read here, in your browser.', pullCta: 'Choose the ZIP', reading: 'Reading your export...',
  noPosts: 'No posts in this ZIP. Photo insights needs the full export (All information), not only followers.', bigFile: 'This ZIP is very large. If it fails, request the export again with media quality Low or a shorter date range.',
  howExport: 'To get it: Instagram, Accounts Center, Your information and permissions, Download your information, All available information, date range All time, format JSON, media quality Low.',
  pickHelp: (n) => `Pick up to ${n} posts: your best and your weakest.`, addSelected: (n) => `Add ${n} ${n === 1 ? 'post' : 'posts'}`, likesNote: 'The export has no likes. Add them from the app: open the post, then View insights.',
  handTitle: 'Add posts by hand', handBody: 'Pick photos from your phone or computer and type the numbers.', postsTitle: 'Your posts', ready: (n, m) => `${n} of ${m}`,
  analysis: 'Analysis', youGet: 'What you get', gets: ['Which photos worked, and why: light, angle, place, crop', 'What did not, side by side', 'What to shoot next, and how to order the slides'], recommended: 'Recommended',
  step1: 'Request it from Instagram', step2: 'Choose the ZIP when it arrives', openMeta: 'Open the export page',
  pick: ['Download or transfer information, then your Instagram profile', 'How much information: All available information', 'Download to device', 'Date range: All time', 'Format: JSON, media quality: Low'],
  important: 'Pick All available information and All time, or your posts will be missing.',
  requested: (ago) => `Requested ${ago}. Meta emails the link when it is ready, usually within a few hours, sometimes up to two days.`,
  remindIn: 'Remind me in', hours: (n) => `${n} ${n === 1 ? 'hour' : 'hours'}`, google: 'Google Calendar', ics: 'Apple or Outlook (.ics)',
  remindTitle: 'Your Instagram export should be ready', remindBody: 'Download the ZIP from the email Meta sent, then open Photo insights in WhoUnfollowed and choose it.',
  remindNote: 'The reminder goes to your own calendar. Nothing is sent to us.', noExportYet: 'No export yet? Request it in a minute.',
};
const ES: InsightsContent = {
  sub: 'Tus publicaciones lado a lado: qué hizo funcionar a las mejores y qué fotografiar después.',
  how: 'Elige de 3 a 8 publicaciones, las mejores y las más flojas. Añade los números de Instagram: abre la publicación y luego Ver estadísticas.',
  privacy: 'Las fotos se reducen en tu navegador y se envían solo para este análisis. Nunca se guardan.',
  post: (n) => `Publicación ${n}`, photo: 'Añade la primera foto', changePhoto: 'Cambiar foto', place: 'Lugar', placePh: 'Puente de Brooklyn, Nueva York', date: 'Publicada el', caption: 'Texto (opcional)',
  likes: 'Me gusta', comments: 'Comentarios', saves: 'Guardados', shares: 'Compartidos', reach: 'Alcance', numbersHint: 'Deja vacío lo que no veas.',
  addPost: 'Añadir publicación', remove: 'Quitar', analyze: 'Analizar mis publicaciones', needMore: (n) => `Añade ${n} ${n === 1 ? 'publicación' : 'publicaciones'} más con foto`,
  winners: 'Lo que funcionó', losers: 'Lo que no', patterns: 'Patrones', shootNext: 'Qué fotografiar', crop: 'Recorte y orden', again: 'Analizar otras publicaciones', earlier: 'Análisis anteriores',
  previewTitle: '¿Cuáles de tus fotos funcionaron de verdad, y por qué?',
  previewBody: 'Tus mejores y peores publicaciones lado a lado: la luz, el ángulo, el lugar y el recorte que marcaron la diferencia, y qué fotografiar después.',
  pullTitle: 'Traer desde tu exportación completa', pullBody: 'Elige el ZIP de tu exportación completa de Instagram. Tus publicaciones y fotos se leen aquí, en tu navegador.', pullCta: 'Elegir el ZIP', reading: 'Leyendo tu exportación...',
  noPosts: 'No hay publicaciones en este ZIP. El análisis de fotos necesita la exportación completa (Toda la información), no solo seguidores.', bigFile: 'Este ZIP es muy grande. Si falla, vuelve a pedir la exportación con calidad de medios Baja o un rango de fechas más corto.',
  howExport: 'Para conseguirla: Instagram, Centro de cuentas, Tu información y permisos, Descargar tu información, Toda la información disponible, intervalo Desde el principio, formato JSON, calidad de medios Baja.',
  pickHelp: (n) => `Elige hasta ${n} publicaciones: las mejores y las más flojas.`, addSelected: (n) => `Añadir ${n} ${n === 1 ? 'publicación' : 'publicaciones'}`, likesNote: 'La exportación no trae los me gusta. Añádelos desde la app: abre la publicación y luego Ver estadísticas.',
  handTitle: 'Añadir a mano', handBody: 'Elige fotos del móvil o del ordenador y escribe los números.', postsTitle: 'Tus publicaciones', ready: (n, m) => `${n} de ${m}`,
  analysis: 'Análisis', youGet: 'Qué obtienes', gets: ['Qué fotos funcionaron y por qué: luz, ángulo, lugar, recorte', 'Lo que no, lado a lado', 'Qué fotografiar después y cómo ordenar las fotos'], recommended: 'Recomendado',
  step1: 'Pídela a Instagram', step2: 'Elige el ZIP cuando llegue', openMeta: 'Abrir la página de exportación',
  pick: ['Descargar o transferir información, luego tu perfil de Instagram', 'Cuánta información: Toda la información disponible', 'Descargar en el dispositivo', 'Intervalo de fechas: Desde el principio', 'Formato: JSON, calidad de medios: Baja'],
  important: 'Elige Toda la información disponible y Desde el principio, o faltarán tus publicaciones.',
  requested: (ago) => `Pedida ${ago}. Meta te envía el enlace por email cuando está lista, normalmente en unas horas, a veces hasta dos días.`,
  remindIn: 'Recuérdamelo en', hours: (n) => `${n} ${n === 1 ? 'hora' : 'horas'}`, google: 'Google Calendar', ics: 'Apple u Outlook (.ics)',
  remindTitle: 'Tu exportación de Instagram debería estar lista', remindBody: 'Descarga el ZIP del email de Meta, abre Análisis de fotos en WhoUnfollowed y elígelo.',
  remindNote: 'El recordatorio va a tu propio calendario. No nos llega nada.', noExportYet: '¿Aún no la tienes? Pídela en un minuto.',
};
const PT: InsightsContent = {
  sub: 'Seus posts lado a lado: o que fez os melhores funcionarem e o que fotografar a seguir.',
  how: 'Escolha de 3 a 8 posts, os melhores e os mais fracos. Adicione os números do Instagram: abra o post e depois Ver insights.',
  privacy: 'As fotos são reduzidas no seu navegador e enviadas só para esta análise. Nunca são guardadas.',
  post: (n) => `Post ${n}`, photo: 'Adicione a primeira foto', changePhoto: 'Trocar foto', place: 'Lugar', placePh: 'Ponte do Brooklyn, Nova York', date: 'Postado em', caption: 'Legenda (opcional)',
  likes: 'Curtidas', comments: 'Comentários', saves: 'Salvamentos', shares: 'Compartilhamentos', reach: 'Alcance', numbersHint: 'Deixe vazio o que você não vê.',
  addPost: 'Adicionar post', remove: 'Remover', analyze: 'Analisar meus posts', needMore: (n) => `Adicione mais ${n} ${n === 1 ? 'post' : 'posts'} com foto`,
  winners: 'O que funcionou', losers: 'O que não funcionou', patterns: 'Padrões', shootNext: 'O que fotografar', crop: 'Corte e ordem', again: 'Analisar outros posts', earlier: 'Análises anteriores',
  previewTitle: 'Quais das suas fotos funcionaram de verdade, e por quê?',
  previewBody: 'Seus melhores e piores posts lado a lado: a luz, o ângulo, o lugar e o corte que fizeram a diferença, e o que fotografar a seguir.',
  pullTitle: 'Trazer da sua exportação completa', pullBody: 'Escolha o ZIP da sua exportação completa do Instagram. Seus posts e fotos são lidos aqui, no seu navegador.', pullCta: 'Escolher o ZIP', reading: 'Lendo sua exportação...',
  noPosts: 'Não há posts neste ZIP. A análise de fotos precisa da exportação completa (Todas as informações), não só seguidores.', bigFile: 'Este ZIP é muito grande. Se falhar, peça a exportação de novo com qualidade de mídia Baixa ou um período menor.',
  howExport: 'Para conseguir: Instagram, Central de Contas, Suas informações e permissões, Baixar suas informações, Todas as informações disponíveis, período Desde o início, formato JSON, qualidade de mídia Baixa.',
  pickHelp: (n) => `Escolha até ${n} posts: os melhores e os mais fracos.`, addSelected: (n) => `Adicionar ${n} ${n === 1 ? 'post' : 'posts'}`, likesNote: 'A exportação não traz as curtidas. Adicione pelo app: abra o post e depois Ver insights.',
  handTitle: 'Adicionar à mão', handBody: 'Escolha fotos do celular ou do computador e digite os números.', postsTitle: 'Seus posts', ready: (n, m) => `${n} de ${m}`,
  analysis: 'Análise', youGet: 'O que você recebe', gets: ['Quais fotos funcionaram e por quê: luz, ângulo, lugar, corte', 'O que não funcionou, lado a lado', 'O que fotografar a seguir e como ordenar as fotos'], recommended: 'Recomendado',
  step1: 'Peça ao Instagram', step2: 'Escolha o ZIP quando chegar', openMeta: 'Abrir a página de exportação',
  pick: ['Baixar ou transferir informações, depois seu perfil do Instagram', 'Quantas informações: Todas as informações disponíveis', 'Baixar no dispositivo', 'Período: Desde o início', 'Formato: JSON, qualidade de mídia: Baixa'],
  important: 'Escolha Todas as informações disponíveis e Desde o início, ou seus posts vão faltar.',
  requested: (ago) => `Pedida ${ago}. A Meta envia o link por email quando fica pronta, geralmente em algumas horas, às vezes até dois dias.`,
  remindIn: 'Lembrar em', hours: (n) => `${n} ${n === 1 ? 'hora' : 'horas'}`, google: 'Google Agenda', ics: 'Apple ou Outlook (.ics)',
  remindTitle: 'Sua exportação do Instagram deve estar pronta', remindBody: 'Baixe o ZIP do email da Meta, abra Análise de fotos no WhoUnfollowed e escolha o arquivo.',
  remindNote: 'O lembrete vai para a sua própria agenda. Nada é enviado para nós.', noExportYet: 'Ainda não tem? Peça em um minuto.',
};

export function getInsightsContent(locale: AppLocale): InsightsContent {
  return locale === 'es' ? ES : locale === 'pt' ? PT : EN;
}
