import type { AppLocale } from '@/i18n/routing';

// You > Memory > "Teach your coach": voice and photo style, explained for a
// first-time member. The export is read in the browser; nothing is sent until
// they press the button on the review step.
export interface TeachContent {
  title: string; sub: string;
  exportTitle: string; exportBody: string; exportPick: string; exportUsing: (name: string) => string; exportChange: string; exportHow: string;
  igOnly: string;
  voiceTitle: string; voiceWhat: string; voiceLearn: string; voiceLearned: string; voiceNotYet: string;
  photoTitle: string; photoWhat: string; photoLearn: string; photoLearned: string; photoNotYet: string;
  needExport: string;
  or: string;
  pasteOpen: string; pasteLabel: string; pastePh: string; pasteUse: string; pasteTooFew: string;
  photosOpen: string; photosPick: (min: number, max: number) => string; photosBad: string; photosTooFew: (min: number) => string;
  knowsTitle: string; knowsSub: string;
}

const EN: TeachContent = {
  title: 'Teach your coach', sub: 'Two quick steps so drafts sound like you and ideas look like your photos.',
  exportTitle: 'Your Instagram export', exportBody: 'The full ZIP from Instagram (with your posts), not the followers-only one. It is read here, in this browser.',
  exportPick: 'Choose the ZIP', exportUsing: (n) => `Using ${n}`, exportChange: 'Use another', exportHow: 'How to get it',
  igOnly: 'Instagram only',
  voiceTitle: 'Your voice', voiceWhat: 'Your coach reads a few of your own captions, so drafts sound like you, not like a robot.',
  voiceLearn: 'Learn from my export', voiceLearned: 'Learned', voiceNotYet: 'Not learned yet',
  photoTitle: 'Your photo style', photoWhat: 'Your coach looks at your recent photos once, so ideas and checks fit how you shoot. Photos are never kept.',
  photoLearn: 'Learn from my export', photoLearned: 'Learned', photoNotYet: 'Not learned yet',
  needExport: 'Choose your export above first.',
  or: 'or',
  pasteOpen: 'Paste captions instead', pasteLabel: 'Your captions', pastePh: 'Paste 5 or more of your own captions. Leave an empty line between them.',
  pasteUse: 'Use these captions', pasteTooFew: 'Paste at least 5 captions, with an empty line between them.',
  photosOpen: 'Pick photos instead', photosPick: (a, b) => `Pick ${a} to ${b} of your own photos`, photosBad: 'Some files were skipped: only photos, up to 25 MB each.',
  photosTooFew: (a) => `Pick at least ${a} photos.`,
  knowsTitle: 'What your coach knows', knowsSub: 'Notes it keeps about you. Pin, edit or forget any of them.',
};

const ES: TeachContent = {
  title: 'Enséñale a tu coach', sub: 'Dos pasos rápidos para que los borradores suenen como tú y las ideas se parezcan a tus fotos.',
  exportTitle: 'Tu exportación de Instagram', exportBody: 'El ZIP completo de Instagram (con tus publicaciones), no el de solo seguidores. Se lee aquí, en este navegador.',
  exportPick: 'Elegir el ZIP', exportUsing: (n) => `Usando ${n}`, exportChange: 'Usar otro', exportHow: 'Cómo conseguirlo',
  igOnly: 'Solo Instagram',
  voiceTitle: 'Tu voz', voiceWhat: 'Tu coach lee algunos de tus propios textos para que los borradores suenen como tú, no como un robot.',
  voiceLearn: 'Aprender de mi exportación', voiceLearned: 'Aprendido', voiceNotYet: 'Aún no aprendido',
  photoTitle: 'Tu estilo de foto', photoWhat: 'Tu coach mira tus fotos recientes una vez para que las ideas y revisiones encajen con cómo fotografías. Las fotos nunca se guardan.',
  photoLearn: 'Aprender de mi exportación', photoLearned: 'Aprendido', photoNotYet: 'Aún no aprendido',
  needExport: 'Primero elige tu exportación arriba.',
  or: 'o',
  pasteOpen: 'Pegar textos en su lugar', pasteLabel: 'Tus textos', pastePh: 'Pega 5 o más de tus propios textos. Deja una línea vacía entre ellos.',
  pasteUse: 'Usar estos textos', pasteTooFew: 'Pega al menos 5 textos, con una línea vacía entre ellos.',
  photosOpen: 'Elegir fotos en su lugar', photosPick: (a, b) => `Elige de ${a} a ${b} de tus propias fotos`, photosBad: 'Se omitieron algunos archivos: solo fotos, hasta 25 MB cada una.',
  photosTooFew: (a) => `Elige al menos ${a} fotos.`,
  knowsTitle: 'Lo que sabe tu coach', knowsSub: 'Notas que guarda sobre ti. Fija, edita u olvida cualquiera.',
};

const PT: TeachContent = {
  title: 'Ensine seu coach', sub: 'Dois passos rápidos para os rascunhos soarem como você e as ideias combinarem com suas fotos.',
  exportTitle: 'Sua exportação do Instagram', exportBody: 'O ZIP completo do Instagram (com seus posts), não o de só seguidores. Ele é lido aqui, neste navegador.',
  exportPick: 'Escolher o ZIP', exportUsing: (n) => `Usando ${n}`, exportChange: 'Usar outro', exportHow: 'Como conseguir',
  igOnly: 'Só Instagram',
  voiceTitle: 'Sua voz', voiceWhat: 'Seu coach lê algumas das suas próprias legendas para os rascunhos soarem como você, não como um robô.',
  voiceLearn: 'Aprender com minha exportação', voiceLearned: 'Aprendido', voiceNotYet: 'Ainda não aprendido',
  photoTitle: 'Seu estilo de foto', photoWhat: 'Seu coach olha suas fotos recentes uma vez para as ideias e revisões combinarem com o seu jeito de fotografar. As fotos nunca são guardadas.',
  photoLearn: 'Aprender com minha exportação', photoLearned: 'Aprendido', photoNotYet: 'Ainda não aprendido',
  needExport: 'Primeiro escolha sua exportação acima.',
  or: 'ou',
  pasteOpen: 'Colar legendas em vez disso', pasteLabel: 'Suas legendas', pastePh: 'Cole 5 ou mais das suas próprias legendas. Deixe uma linha vazia entre elas.',
  pasteUse: 'Usar estas legendas', pasteTooFew: 'Cole pelo menos 5 legendas, com uma linha vazia entre elas.',
  photosOpen: 'Escolher fotos em vez disso', photosPick: (a, b) => `Escolha de ${a} a ${b} fotos suas`, photosBad: 'Alguns arquivos foram ignorados: só fotos, até 25 MB cada.',
  photosTooFew: (a) => `Escolha pelo menos ${a} fotos.`,
  knowsTitle: 'O que seu coach sabe', knowsSub: 'Notas que ele guarda sobre você. Fixe, edite ou esqueça qualquer uma.',
};

const BY: Record<AppLocale, TeachContent> = { en: EN, es: ES, pt: PT };
export const getTeachContent = (l: AppLocale): TeachContent => BY[l] ?? EN;
