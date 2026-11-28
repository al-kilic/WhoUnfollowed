import type { AppLocale } from '@/i18n/routing';

export interface AccountTypeContent {
  question: string; types: { personal: string; creator: string; business: string };
  nicheQuestion: string; niches: Record<string, string>; other: string; thanks: string; change: string; why: string;
}

const EN: AccountTypeContent = {
  question: 'What is this account for?',
  types: { personal: 'Personal', creator: 'Creator', business: 'Business' },
  nicheQuestion: 'What do you post about?',
  niches: { 'photo-video': 'Photo and video', fitness: 'Fitness', 'beauty-fashion': 'Beauty and fashion', 'small-business': 'Small business' },
  other: 'Something else', thanks: 'Thanks. Your Studio will use this.', change: 'Change',
  why: 'Stays in this browser. Helps us pick what to show you next.',
};
const ES: AccountTypeContent = {
  question: '¿Para qué es esta cuenta?',
  types: { personal: 'Personal', creator: 'Creador', business: 'Negocio' },
  nicheQuestion: '¿Sobre qué publicas?',
  niches: { 'photo-video': 'Foto y video', fitness: 'Fitness', 'beauty-fashion': 'Belleza y moda', 'small-business': 'Pequeño negocio' },
  other: 'Otra cosa', thanks: 'Gracias. Tu Studio usará esto.', change: 'Cambiar',
  why: 'Se queda en este navegador. Nos ayuda a elegir qué mostrarte después.',
};
const PT: AccountTypeContent = {
  question: 'Para que é esta conta?',
  types: { personal: 'Pessoal', creator: 'Criador', business: 'Negócio' },
  nicheQuestion: 'Sobre o que você posta?',
  niches: { 'photo-video': 'Foto e vídeo', fitness: 'Fitness', 'beauty-fashion': 'Beleza e moda', 'small-business': 'Pequeno negócio' },
  other: 'Outra coisa', thanks: 'Obrigado. Seu Studio vai usar isso.', change: 'Mudar',
  why: 'Fica neste navegador. Ajuda a escolher o que mostrar a seguir.',
};

export function getAccountTypeContent(locale: AppLocale): AccountTypeContent {
  return locale === 'es' ? ES : locale === 'pt' ? PT : EN;
}
