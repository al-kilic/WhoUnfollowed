import type { AppLocale } from '@/i18n/routing';
import { EN, type HomeCopy } from './en';
import { ES } from './es';
import { PT } from './pt';

export type { HomeCopy };

export function getHomeCopy(locale: AppLocale): HomeCopy {
  return locale === 'es' ? ES : locale === 'pt' ? PT : EN;
}

// Fills {name} placeholders. Values come from code (prices, credits, counts).
export function fill(t: string, vars: Record<string, string | number>): string {
  return t.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m));
}
