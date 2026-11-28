import type { AppLocale } from '@/i18n/routing';

// Copy for "Try it with sample data": the banner, the try button and the
// "request your own export" ending.

export interface SampleContent {
  tag: string;
  banner: string;
  useMine: string;
  exit: string;
  tryIt: string;
  tryHint: string;
  noLink: string;
  end: {
    title: string; sub: string; steps: [string, string][]; open: string;
    remindT: string; google: string; ics: string; evTitle: string; evBody: string;
    have: string;
  };
  // Shown instead of the ending to members who already have their own exports.
  back: string;
  // On You pages, which keep showing the real account.
  ownSettings: string;
}

const en: SampleContent = {
  tag: 'Sample data',
  banner: 'A made-up account: Inês, a film photographer in Lisbon. Every screen is unlocked, the coach answers are written examples, and nothing is saved.',
  back: 'Back to my own data',
  ownSettings: 'Settings always show your real account.',
  useMine: 'Use my own export',
  exit: 'Leave sample',
  tryIt: 'Try it with sample data',
  tryHint: 'No export yet? Click around a made-up account first.',
  noLink: 'Sample account, no profile to open',
  end: {
    title: 'Now see your own', sub: 'Three steps. Meta emails your file, then it opens here in seconds.',
    steps: [['Request it', 'Open Meta\'s export page and choose Followers and following.'], ['Pick All time', 'Set the date range to All time and the format to JSON.'], ['Drop the ZIP', 'When the email arrives, drop the file on the homepage.']],
    open: 'Open Meta\'s export page',
    remindT: 'Remind me to check my email in 24h', google: 'Google Calendar', ics: 'Apple or Outlook (.ics)',
    evTitle: 'Check your email for your Instagram export', evBody: 'Your export from Meta should be ready. Drop the ZIP on WhoUnfollowed to see your results.',
    have: 'I have my file',
  },
};

const es: SampleContent = {
  tag: 'Datos de ejemplo',
  banner: 'Una cuenta inventada: Inês, fotógrafa analógica en Lisboa. Todas las pantallas están desbloqueadas, las respuestas del coach son ejemplos escritos y nada se guarda.',
  back: 'Volver a mis datos',
  ownSettings: 'Los ajustes siempre muestran tu cuenta real.',
  useMine: 'Usar mi propia exportación',
  exit: 'Salir del ejemplo',
  tryIt: 'Pruébalo con datos de ejemplo',
  tryHint: '¿Aún sin exportación? Explora primero una cuenta inventada.',
  noLink: 'Cuenta de ejemplo, sin perfil que abrir',
  end: {
    title: 'Ahora mira la tuya', sub: 'Tres pasos. Meta te envía el archivo por email y aquí se abre en segundos.',
    steps: [['Pídela', 'Abre la página de exportación de Meta y elige Seguidores y seguidos.'], ['Elige Todo el tiempo', 'Pon el rango de fechas en Todo el tiempo y el formato en JSON.'], ['Suelta el ZIP', 'Cuando llegue el email, suelta el archivo en la página de inicio.']],
    open: 'Abrir la página de exportación de Meta',
    remindT: 'Recuérdame revisar mi email en 24 h', google: 'Google Calendar', ics: 'Apple u Outlook (.ics)',
    evTitle: 'Revisa tu email: tu exportación de Instagram', evBody: 'Tu exportación de Meta debería estar lista. Suelta el ZIP en WhoUnfollowed para ver tus resultados.',
    have: 'Ya tengo mi archivo',
  },
};

const pt: SampleContent = {
  tag: 'Dados de exemplo',
  banner: 'Uma conta inventada: Inês, fotógrafa analógica em Lisboa. Todas as telas estão liberadas, as respostas do coach são exemplos escritos e nada fica salvo.',
  back: 'Voltar aos meus dados',
  ownSettings: 'As configurações sempre mostram a sua conta real.',
  useMine: 'Usar minha própria exportação',
  exit: 'Sair do exemplo',
  tryIt: 'Experimente com dados de exemplo',
  tryHint: 'Ainda sem exportação? Explore primeiro uma conta inventada.',
  noLink: 'Conta de exemplo, sem perfil para abrir',
  end: {
    title: 'Agora veja a sua', sub: 'Três passos. A Meta envia o arquivo por email e ele abre aqui em segundos.',
    steps: [['Peça', 'Abra a página de exportação da Meta e escolha Seguidores e seguindo.'], ['Escolha Todo o período', 'Defina o período como Todo o período e o formato como JSON.'], ['Solte o ZIP', 'Quando o email chegar, solte o arquivo na página inicial.']],
    open: 'Abrir a página de exportação da Meta',
    remindT: 'Me lembre de checar o email em 24 h', google: 'Google Calendar', ics: 'Apple ou Outlook (.ics)',
    evTitle: 'Cheque seu email: sua exportação do Instagram', evBody: 'Sua exportação da Meta deve estar pronta. Solte o ZIP no WhoUnfollowed para ver seus resultados.',
    have: 'Já tenho meu arquivo',
  },
};

const ALL: Record<AppLocale, SampleContent> = { en, es, pt };
export const getSampleContent = (locale: AppLocale): SampleContent => ALL[locale] ?? en;
