import type { AppLocale } from '@/i18n/routing';

// Short page descriptions for Studio pages that reuse existing screens.
export interface StudioPagesContent { resultsSub: string; historySub: string; compareTitle: string }

const EN: StudioPagesContent = {
  resultsSub: 'Who follows you, who you follow, and who doesn’t follow back. Worked out in this browser.',
  historySub: 'Every export you have checked, and what changed between them.',
  compareTitle: 'Compare checks',
};
const ES: StudioPagesContent = {
  resultsSub: 'Quién te sigue, a quién sigues y quién no te sigue de vuelta. Calculado en este navegador.',
  historySub: 'Cada exportación que revisaste y lo que cambió entre ellas.',
  compareTitle: 'Comparar revisiones',
};
const PT: StudioPagesContent = {
  resultsSub: 'Quem segue você, quem você segue e quem não segue de volta. Calculado neste navegador.',
  historySub: 'Cada exportação que você verificou e o que mudou entre elas.',
  compareTitle: 'Comparar verificações',
};

export function getStudioPagesContent(locale: AppLocale): StudioPagesContent {
  return locale === 'es' ? ES : locale === 'pt' ? PT : EN;
}
