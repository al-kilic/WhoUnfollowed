import type { AppLocale } from '@/i18n/routing';

export interface CoachCardContent {
  eyebrow: string;
  blurTitle: string;
  bestMonths: (list: string) => string;
  followBack: (now: string, before: string) => string;
  followBackOne: (now: string) => string;
  sample: string[];
  cta: string;
  ctaNote: string;
  setupTitle: string;
  setupBody: string;
  setupCta: string;
  open: string;
  reading: string;
}

const EN: CoachCardContent = {
  eyebrow: 'YOUR AI READ',
  blurTitle: 'What your coach sees in this export',
  bestMonths: (list) => `Your biggest months for new followers: ${list}.`,
  followBack: (now, before) => `Follow-back rate on accounts you followed: ${now} this year, ${before} the year before.`,
  followBackOne: (now) => `Follow-back rate on accounts you followed this year: ${now}.`,
  sample: [
    'What changed around those months, and how to repeat it.',
    'The one habit that is costing you follow-backs right now.',
    'Three things to post next, written in your voice.',
  ],
  cta: 'Unlock your AI read with Pro AI',
  ctaNote: 'Your coach remembers your account, writes in your voice and checks posts before you share them.',
  setupTitle: 'Your coach is ready',
  setupBody: 'Answer four quick questions so it knows your account. Then every new export gets a free read.',
  setupCta: 'Set up your coach',
  open: 'Open your coach',
  reading: 'Your coach is reading this export...',
};

const ES: CoachCardContent = {
  eyebrow: 'TU LECTURA CON IA',
  blurTitle: 'Lo que tu coach ve en esta exportación',
  bestMonths: (list) => `Tus meses con más seguidores nuevos: ${list}.`,
  followBack: (now, before) => `Tasa de seguimiento de vuelta de las cuentas que seguiste: ${now} este año, ${before} el año anterior.`,
  followBackOne: (now) => `Tasa de seguimiento de vuelta de las cuentas que seguiste este año: ${now}.`,
  sample: [
    'Qué cambió en esos meses y cómo repetirlo.',
    'El hábito que te está costando seguidores de vuelta ahora mismo.',
    'Tres cosas para publicar, escritas con tu voz.',
  ],
  cta: 'Desbloquea tu lectura con Pro AI',
  ctaNote: 'Tu coach recuerda tu cuenta, escribe con tu voz y revisa tus posts antes de publicarlos.',
  setupTitle: 'Tu coach está listo',
  setupBody: 'Responde cuatro preguntas rápidas para que conozca tu cuenta. Después, cada exportación nueva tiene una lectura gratis.',
  setupCta: 'Configurar tu coach',
  open: 'Abrir tu coach',
  reading: 'Tu coach está leyendo esta exportación...',
};

const PT: CoachCardContent = {
  eyebrow: 'SUA LEITURA COM IA',
  blurTitle: 'O que seu coach vê nesta exportação',
  bestMonths: (list) => `Seus meses com mais seguidores novos: ${list}.`,
  followBack: (now, before) => `Taxa de retorno das contas que você seguiu: ${now} este ano, ${before} no ano anterior.`,
  followBackOne: (now) => `Taxa de retorno das contas que você seguiu este ano: ${now}.`,
  sample: [
    'O que mudou nesses meses e como repetir.',
    'O hábito que está custando seguidores de volta agora.',
    'Três coisas para postar, escritas com a sua voz.',
  ],
  cta: 'Desbloqueie sua leitura com o Pro AI',
  ctaNote: 'Seu coach lembra da sua conta, escreve com a sua voz e checa seus posts antes de você publicar.',
  setupTitle: 'Seu coach está pronto',
  setupBody: 'Responda quatro perguntas rápidas para ele conhecer sua conta. Depois, cada exportação nova ganha uma leitura grátis.',
  setupCta: 'Configurar seu coach',
  open: 'Abrir seu coach',
  reading: 'Seu coach está lendo esta exportação...',
};

export function getCoachCardContent(locale: AppLocale): CoachCardContent {
  return locale === 'es' ? ES : locale === 'pt' ? PT : EN;
}
