import type { AppLocale } from '@/i18n/routing';

// You > Memory: what the coach remembers about the member. Copy only talks
// about the coach remembering, never about how.

export type NoteGroup = 'about' | 'voice' | 'likes' | 'dislikes' | 'works' | 'photos' | 'audience';
export type MemoryTab = 'notes' | 'timeline' | 'learned' | 'archive';

export interface MemoryContent {
  title: string; intro: string;
  tabs: Record<MemoryTab, string>;
  groups: Record<NoteGroup, string>;
  groupEmpty: string;
  from: (source: string, date: string) => string;
  sources: Record<string, string>;
  sure: string; guessing: string; pinned: string; yours: string;
  pin: string; unpin: string; edit: string; save: string; cancel: string; forget: string;
  forgetAsk: string; forgetYes: string; forgotten: string;
  fading: string; keep: string;
  disputeTitle: string; disputeBody: string; thisOne: string;
  addTitle: string; addPlaceholder: string; addType: string; add: string; added: string;
  about: string; aboutBody: string; aboutSaved: string;
  download: string; failed: string; loading: string;
  timelineEmpty: string; learnedEmpty: string; archiveEmpty: string; archiveBody: string;
  week: (key: string) => string; newWeek: string;
  moments: Record<string, (p: Record<string, number | string>) => string>;
  sampleBanner: string;
  voice: {
    title: string; body: string; start: string; pick: string; reading: string;
    found: (n: number) => string; none: string; consent: string; remove: string;
    send: (n: number) => string; sending: string; done: string; again: string;
    stats: (s: { captions: number; chars: number; emoji: number; hashtags: number; questions: number }) => string;
    insights: (s: { stories: number; posts: number; account: boolean }) => string;
    sendNumbers: string; filled: (n: number) => string;
  };
  photo: {
    title: string; body: string; start: string; reading: string; none: string; consent: string;
    send: (n: number) => string; sending: string; done: (n: number) => string; again: string; noCredits: string;
  };
  summary: { notes: (n: number) => string; learned: string; open: string; none: string };
  notQuite: string; notQuiteDone: string;
}

const EN: MemoryContent = {
  title: 'Memory', intro: 'What your coach remembers about you and your account. Change anything, any time.',
  tabs: { notes: 'What it knows', timeline: 'Your history', learned: 'Weekly notes', archive: 'Archive' },
  groups: { about: 'About you', voice: 'Your voice', likes: 'Likes', dislikes: 'Dislikes', works: 'What works', photos: 'Photos', audience: 'Audience' },
  groupEmpty: 'Nothing here yet.',
  from: (s, d) => `From: ${s} on ${d}`,
  sources: { onboarding: 'Setup', user: 'You', read: 'Today', draft: 'Write', check: 'Check', ideas: 'Ideas', chat: 'Ask', plan: 'Plan', insights: 'Photo insights', digest: 'Your coach', signals: 'How you use it', export: 'Your export', backfill: 'Earlier memory' },
  sure: 'Sure', guessing: 'Guessing', pinned: 'Pinned', yours: 'Yours',
  pin: 'Pin', unpin: 'Unpin', edit: 'Edit', save: 'Save', cancel: 'Cancel', forget: 'Forget',
  forgetAsk: 'Forget this? Your coach won\'t bring it up again.', forgetYes: 'Forget it', forgotten: 'Forgotten. Your coach won\'t bring this up again.',
  fading: 'Fading. Keep it?', keep: 'Keep',
  disputeTitle: 'These disagree. Which is right?', disputeBody: 'Your coach holds back on both until you pick one.', thisOne: 'This one',
  addTitle: 'Add a note', addPlaceholder: 'Something your coach should always know', addType: 'Kind', add: 'Add', added: 'Added and pinned.',
  about: 'About me', aboutBody: 'Your own words. Your coach reads them first and they always win.', aboutSaved: 'Saved.',
  download: 'Download all', failed: 'That didn\'t work. Try again.', loading: 'Loading',
  timelineEmpty: 'Moments show up after your exports have some history.', learnedEmpty: 'Each week, a short note on what your coach picked up.', archiveEmpty: 'Nothing archived.', archiveBody: 'Older notes your coach no longer uses. Nothing is deleted unless you forget it.',
  week: (k) => `Week of ${k}`, newWeek: 'New',
  moments: {
    best_month: (p) => `Best month: +${p.followers} new followers`,
    spike: (p) => `A spike: +${p.followers} in a month, usually ${p.typical}`,
    drop: (p) => `A drop: ${p.net} between exports`,
    quiet_month: (p) => `A quiet month: ${p.followers} new followers, usually ${p.typical}`,
    follow_spree: (p) => `Followed ${p.count} accounts in a week, ${p.followedBack} followed back`,
    best_post: (p) => `Your most-reached post: ${(['', 'a photo', 'a carousel', 'a Reel', 'a video'])[Number(p.format)] ?? 'a post'} that reached ${p.reach} accounts${p.follows !== undefined ? ` and brought ${p.follows} follows` : ''}`,
    story_best_month: (p) => `Your stories' best month: about ${p.reach} people per story, over ${p.stories} stories`,
    busiest_month: (p) => `Your busiest month: ${p.posts} posts`,
    long_break: (p) => `Your longest break this year: ${p.days} days without a post`,
  },
  sampleBanner: 'Sample: nothing is saved.',
  voice: {
    title: 'Learn my voice', body: 'Your coach reads a few of your own captions so drafts sound like you.',
    start: 'Learn my voice', pick: 'Choose your export ZIP', reading: 'Reading your captions here, on this device',
    found: (n) => `${n} captions picked`, none: 'No captions found in this export.',
    consent: 'These captions go to your coach so it can write like you. You can remove any of them. Your coach also gets numbers only: how often you post, and Instagram\'s own reach and audience numbers. Nothing else from your export is sent.',
    remove: 'Remove', send: (n) => `Send ${n} captions`, sending: 'Sending', done: 'Done. Your coach now writes closer to you.', again: 'Update from a newer export',
    stats: (s) => `${s.captions} captions · about ${s.chars} characters · ${s.emoji} emoji each · ${s.hashtags} hashtags · questions in ${s.questions}%`,
    insights: (s) => `Instagram's own numbers: ${[s.stories ? `${s.stories} stories` : '', s.posts ? `${s.posts} posts` : '', s.account ? 'your last 90 days' : ''].filter(Boolean).join(', ')}`,
    sendNumbers: 'Send the numbers', filled: (n) => `${n} ${n === 1 ? 'post' : 'posts'} in Posted got their results from your export.`,
  },
  photo: {
    title: 'Learn my photo style', body: 'Your coach looks at the first photo of your recent posts once, so ideas and checks fit how you shoot.',
    start: 'Choose your export', reading: 'Picking your photos here, on this device', none: 'No post photos found in this export.',
    consent: 'These photos go to your coach once and are not kept. Your coach keeps a few short notes about your style (light, subjects, framing), which you can edit or forget. It never says who anyone is.',
    send: (n) => `Send ${n} photos`, sending: 'Looking at your photos', done: (n) => `Done. ${n} new notes under Photos.`, again: 'Run again', noCredits: "You've used this month's coach. It resets with your plan.",
  },
  summary: { notes: (n) => `${n} ${n === 1 ? 'note' : 'notes'}`, learned: 'This week', open: 'Open memory', none: 'Your coach hasn\'t learned anything yet.' },
  notQuite: 'Not quite', notQuiteDone: 'Forgotten',
};

const ES: MemoryContent = {
  title: 'Memoria', intro: 'Lo que tu coach recuerda de ti y de tu cuenta. Cambia lo que quieras, cuando quieras.',
  tabs: { notes: 'Lo que sabe', timeline: 'Tu historia', learned: 'Notas semanales', archive: 'Archivo' },
  groups: { about: 'Sobre ti', voice: 'Tu voz', likes: 'Te gusta', dislikes: 'No te gusta', works: 'Lo que funciona', photos: 'Fotos', audience: 'Audiencia' },
  groupEmpty: 'Nada todavía.',
  from: (s, d) => `De: ${s} el ${d}`,
  sources: { onboarding: 'Configuración', user: 'Tú', read: 'Hoy', draft: 'Escribir', check: 'Revisar', ideas: 'Ideas', chat: 'Preguntar', plan: 'Plan', insights: 'Insights de fotos', digest: 'Tu coach', signals: 'Cómo lo usas', export: 'Tu exportación', backfill: 'Memoria anterior' },
  sure: 'Seguro', guessing: 'Suposición', pinned: 'Fijada', yours: 'Tuya',
  pin: 'Fijar', unpin: 'Soltar', edit: 'Editar', save: 'Guardar', cancel: 'Cancelar', forget: 'Olvidar',
  forgetAsk: '¿Olvidar esto? Tu coach no lo volverá a mencionar.', forgetYes: 'Olvidarlo', forgotten: 'Olvidado. Tu coach no lo volverá a mencionar.',
  fading: 'Se está perdiendo. ¿La guardas?', keep: 'Guardar',
  disputeTitle: 'Estas no coinciden. ¿Cuál es la buena?', disputeBody: 'Tu coach no usa ninguna hasta que elijas.', thisOne: 'Esta',
  addTitle: 'Añadir una nota', addPlaceholder: 'Algo que tu coach siempre debe saber', addType: 'Tipo', add: 'Añadir', added: 'Añadida y fijada.',
  about: 'Sobre mí', aboutBody: 'Tus propias palabras. Tu coach las lee primero y siempre mandan.', aboutSaved: 'Guardado.',
  download: 'Descargar todo', failed: 'No funcionó. Inténtalo de nuevo.', loading: 'Cargando',
  timelineEmpty: 'Los momentos aparecen cuando tus exportaciones tienen algo de historia.', learnedEmpty: 'Cada semana, una nota corta con lo que aprendió tu coach.', archiveEmpty: 'Nada archivado.', archiveBody: 'Notas antiguas que tu coach ya no usa. No se borra nada salvo que lo olvides.',
  week: (k) => `Semana del ${k}`, newWeek: 'Nuevo',
  moments: {
    best_month: (p) => `Mejor mes: +${p.followers} seguidores nuevos`,
    spike: (p) => `Un pico: +${p.followers} en un mes, normalmente ${p.typical}`,
    drop: (p) => `Una caída: ${p.net} entre exportaciones`,
    quiet_month: (p) => `Un mes tranquilo: ${p.followers} seguidores nuevos, normalmente ${p.typical}`,
    follow_spree: (p) => `Seguiste ${p.count} cuentas en una semana, ${p.followedBack} te siguieron de vuelta`,
    best_post: (p) => `Tu publicación con más alcance: ${(['', 'una foto', 'un carrusel', 'un Reel', 'un video'])[Number(p.format)] ?? 'una publicación'} que llegó a ${p.reach} cuentas${p.follows !== undefined ? ` y trajo ${p.follows} seguidores` : ''}`,
    story_best_month: (p) => `El mejor mes de tus historias: unas ${p.reach} personas por historia, en ${p.stories} historias`,
    busiest_month: (p) => `Tu mes con más publicaciones: ${p.posts}`,
    long_break: (p) => `Tu pausa más larga este año: ${p.days} días sin publicar`,
  },
  sampleBanner: 'Ejemplo: no se guarda nada.',
  voice: {
    title: 'Aprender mi voz', body: 'Tu coach lee algunos de tus propios textos para que los borradores suenen a ti.',
    start: 'Aprender mi voz', pick: 'Elige el ZIP de tu exportación', reading: 'Leyendo tus textos aquí, en este dispositivo',
    found: (n) => `${n} textos elegidos`, none: 'No hay textos en esta exportación.',
    consent: 'Estos textos van a tu coach para que escriba como tú. Puedes quitar cualquiera. Tu coach también recibe solo números: cada cuánto publicas y las cifras de alcance y audiencia de Instagram. No se envía nada más de tu exportación.',
    remove: 'Quitar', send: (n) => `Enviar ${n} textos`, sending: 'Enviando', done: 'Listo. Tu coach ahora escribe más parecido a ti.', again: 'Actualizar con una exportación más reciente',
    stats: (s) => `${s.captions} textos · unos ${s.chars} caracteres · ${s.emoji} emoji cada uno · ${s.hashtags} hashtags · preguntas en el ${s.questions}%`,
    insights: (s) => `Cifras de Instagram: ${[s.stories ? `${s.stories} historias` : '', s.posts ? `${s.posts} publicaciones` : '', s.account ? 'tus últimos 90 días' : ''].filter(Boolean).join(', ')}`,
    sendNumbers: 'Enviar las cifras', filled: (n) => `${n} ${n === 1 ? 'publicación' : 'publicaciones'} en Publicadas recibieron sus resultados de tu exportación.`,
  },
  photo: {
    title: 'Aprender mi estilo de fotos', body: 'Tu coach mira una vez la primera foto de tus publicaciones recientes, para que las ideas y revisiones encajen con cómo fotografías.',
    start: 'Elegir tu exportación', reading: 'Eligiendo tus fotos aquí, en este dispositivo', none: 'No hay fotos de publicaciones en esta exportación.',
    consent: 'Estas fotos van a tu coach una vez y no se guardan. Tu coach guarda unas notas cortas sobre tu estilo (luz, temas, encuadre), que puedes editar u olvidar. Nunca dice quién es nadie.',
    send: (n) => `Enviar ${n} fotos`, sending: 'Mirando tus fotos', done: (n) => `Listo. ${n} notas nuevas en Fotos.`, again: 'Repetir', noCredits: 'Ya usaste el coach de este mes. Se renueva con tu plan.',
  },
  summary: { notes: (n) => `${n} ${n === 1 ? 'nota' : 'notas'}`, learned: 'Esta semana', open: 'Abrir memoria', none: 'Tu coach todavía no ha aprendido nada.' },
  notQuite: 'No del todo', notQuiteDone: 'Olvidado',
};

const PT: MemoryContent = {
  title: 'Memória', intro: 'O que seu coach lembra sobre você e sua conta. Mude o que quiser, quando quiser.',
  tabs: { notes: 'O que ele sabe', timeline: 'Sua história', learned: 'Notas semanais', archive: 'Arquivo' },
  groups: { about: 'Sobre você', voice: 'Sua voz', likes: 'Você gosta', dislikes: 'Você não gosta', works: 'O que funciona', photos: 'Fotos', audience: 'Público' },
  groupEmpty: 'Nada ainda.',
  from: (s, d) => `De: ${s} em ${d}`,
  sources: { onboarding: 'Configuração', user: 'Você', read: 'Hoje', draft: 'Escrever', check: 'Revisar', ideas: 'Ideias', chat: 'Perguntar', plan: 'Plano', insights: 'Insights de fotos', digest: 'Seu coach', signals: 'Como você usa', export: 'Sua exportação', backfill: 'Memória anterior' },
  sure: 'Certo', guessing: 'Palpite', pinned: 'Fixada', yours: 'Sua',
  pin: 'Fixar', unpin: 'Soltar', edit: 'Editar', save: 'Salvar', cancel: 'Cancelar', forget: 'Esquecer',
  forgetAsk: 'Esquecer isto? Seu coach não vai tocar mais no assunto.', forgetYes: 'Esquecer', forgotten: 'Esquecido. Seu coach não vai tocar mais no assunto.',
  fading: 'Está sumindo. Manter?', keep: 'Manter',
  disputeTitle: 'Estas não batem. Qual está certa?', disputeBody: 'Seu coach não usa nenhuma até você escolher.', thisOne: 'Esta',
  addTitle: 'Adicionar uma nota', addPlaceholder: 'Algo que seu coach deve sempre saber', addType: 'Tipo', add: 'Adicionar', added: 'Adicionada e fixada.',
  about: 'Sobre mim', aboutBody: 'Suas próprias palavras. Seu coach lê primeiro e elas sempre valem.', aboutSaved: 'Salvo.',
  download: 'Baixar tudo', failed: 'Não deu certo. Tente de novo.', loading: 'Carregando',
  timelineEmpty: 'Os momentos aparecem quando suas exportações têm algum histórico.', learnedEmpty: 'Toda semana, uma nota curta com o que seu coach aprendeu.', archiveEmpty: 'Nada arquivado.', archiveBody: 'Notas antigas que seu coach não usa mais. Nada é apagado, a não ser que você esqueça.',
  week: (k) => `Semana de ${k}`, newWeek: 'Novo',
  moments: {
    best_month: (p) => `Melhor mês: +${p.followers} novos seguidores`,
    spike: (p) => `Um pico: +${p.followers} em um mês, normalmente ${p.typical}`,
    drop: (p) => `Uma queda: ${p.net} entre exportações`,
    quiet_month: (p) => `Um mês tranquilo: ${p.followers} novos seguidores, normalmente ${p.typical}`,
    follow_spree: (p) => `Seguiu ${p.count} contas em uma semana, ${p.followedBack} seguiram de volta`,
    best_post: (p) => `Seu post com mais alcance: ${(['', 'uma foto', 'um carrossel', 'um Reel', 'um vídeo'])[Number(p.format)] ?? 'um post'} que alcançou ${p.reach} contas${p.follows !== undefined ? ` e trouxe ${p.follows} seguidores` : ''}`,
    story_best_month: (p) => `O melhor mês dos seus stories: umas ${p.reach} pessoas por story, em ${p.stories} stories`,
    busiest_month: (p) => `Seu mês com mais posts: ${p.posts}`,
    long_break: (p) => `Sua pausa mais longa este ano: ${p.days} dias sem postar`,
  },
  sampleBanner: 'Exemplo: nada é salvo.',
  voice: {
    title: 'Aprender minha voz', body: 'Seu coach lê algumas das suas próprias legendas para os rascunhos soarem como você.',
    start: 'Aprender minha voz', pick: 'Escolha o ZIP da sua exportação', reading: 'Lendo suas legendas aqui, neste aparelho',
    found: (n) => `${n} legendas escolhidas`, none: 'Nenhuma legenda nesta exportação.',
    consent: 'Estas legendas vão para o seu coach para ele escrever como você. Você pode remover qualquer uma. Seu coach também recebe só números: com que frequência você posta e os números de alcance e público do Instagram. Nada mais da sua exportação é enviado.',
    remove: 'Remover', send: (n) => `Enviar ${n} legendas`, sending: 'Enviando', done: 'Pronto. Seu coach agora escreve mais parecido com você.', again: 'Atualizar com uma exportação mais nova',
    stats: (s) => `${s.captions} legendas · cerca de ${s.chars} caracteres · ${s.emoji} emoji em cada · ${s.hashtags} hashtags · perguntas em ${s.questions}%`,
    insights: (s) => `Números do Instagram: ${[s.stories ? `${s.stories} stories` : '', s.posts ? `${s.posts} posts` : '', s.account ? 'seus últimos 90 dias' : ''].filter(Boolean).join(', ')}`,
    sendNumbers: 'Enviar os números', filled: (n) => `${n} ${n === 1 ? 'post' : 'posts'} em Postados receberam os resultados da sua exportação.`,
  },
  photo: {
    title: 'Aprender meu estilo de fotos', body: 'Seu coach olha uma vez a primeira foto dos seus posts recentes, para que ideias e revisões combinem com o jeito que você fotografa.',
    start: 'Escolher sua exportação', reading: 'Escolhendo suas fotos aqui, neste aparelho', none: 'Nenhuma foto de post nesta exportação.',
    consent: 'Estas fotos vão para o seu coach uma vez e não são guardadas. Seu coach guarda algumas notas curtas sobre seu estilo (luz, temas, enquadramento), que você pode editar ou esquecer. Ele nunca diz quem é alguém.',
    send: (n) => `Enviar ${n} fotos`, sending: 'Olhando suas fotos', done: (n) => `Pronto. ${n} notas novas em Fotos.`, again: 'Repetir', noCredits: 'Você já usou o coach deste mês. Ele renova com o seu plano.',
  },
  summary: { notes: (n) => `${n} ${n === 1 ? 'nota' : 'notas'}`, learned: 'Esta semana', open: 'Abrir memória', none: 'Seu coach ainda não aprendeu nada.' },
  notQuite: 'Não é bem isso', notQuiteDone: 'Esquecido',
};

const ALL: Record<AppLocale, MemoryContent> = { en: EN, es: ES, pt: PT };
export const getMemoryContent = (l: AppLocale): MemoryContent => ALL[l] ?? EN;
