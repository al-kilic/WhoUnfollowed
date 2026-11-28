import type { AppLocale } from '@/i18n/routing';

export interface StudioDoorContent { eyebrow: string; title: string; body: string; points: string[]; cta: string; note: string }

const EN: StudioDoorContent = {
  eyebrow: 'STUDIO',
  title: 'Everything else is in your Studio',
  body: 'This page is the list. Your Studio is where you work with it, using this same export.',
  points: ['Radar: who your audience is and what to fix', 'History: compare exports and see who left', 'Coach: a read of every export and a plan for your posts'],
  cta: 'Open your Studio',
  note: 'Opens in this browser. No account needed to look around.',
};
const ES: StudioDoorContent = {
  eyebrow: 'STUDIO',
  title: 'Todo lo demás está en tu Studio',
  body: 'Esta página es la lista. Tu Studio es donde trabajas con ella, con esta misma exportación.',
  points: ['Radar: quién es tu audiencia y qué arreglar', 'Historial: compara exportaciones y mira quién se fue', 'Coach: una lectura de cada exportación y un plan de publicaciones'],
  cta: 'Abrir tu Studio',
  note: 'Se abre en este navegador. No necesitas cuenta para echar un vistazo.',
};
const PT: StudioDoorContent = {
  eyebrow: 'STUDIO',
  title: 'Todo o resto está no seu Studio',
  body: 'Esta página é a lista. O seu Studio é onde você trabalha com ela, usando esta mesma exportação.',
  points: ['Radar: quem é o seu público e o que ajustar', 'Histórico: compare exportações e veja quem saiu', 'Coach: uma leitura de cada exportação e um plano de posts'],
  cta: 'Abrir seu Studio',
  note: 'Abre neste navegador. Não precisa de conta para dar uma olhada.',
};

export function getStudioDoorContent(locale: AppLocale): StudioDoorContent {
  return locale === 'es' ? ES : locale === 'pt' ? PT : EN;
}
