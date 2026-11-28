import { PLATFORM_NAME, snapshotPlatform } from '@/lib/platform';
import type { AppLocale } from '@/i18n/routing';
import type { ParsedSnapshot } from '@ig-tracker/core';

// Labels made when an export is saved are English ("Upload Nov 25, 2026
// 02:38", "Threads upload ..."). Show those in the reader's language; a name
// the member typed is shown exactly as typed.
const AUTO_LABEL = /^(?:(?:Threads|TikTok) )?[Uu]pload [A-Z][a-z]{2} \d{1,2}, \d{4} \d{2}:\d{2}$/;

const COPY: Record<AppLocale, (app: string, date: string) => string> = {
  en: (app, date) => `${app} export, ${date}`,
  es: (app, date) => `Exportación de ${app}, ${date}`,
  pt: (app, date) => `Exportação do ${app}, ${date}`,
};

export function isAutoLabel(label: string): boolean {
  return AUTO_LABEL.test(label);
}

export function exportLabel(record: { label: string; exportedAt: number; data: Pick<ParsedSnapshot, 'platform'> }, locale: AppLocale): string {
  if (!isAutoLabel(record.label)) return record.label;
  const date = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(record.exportedAt * 1000));
  return COPY[locale](PLATFORM_NAME[snapshotPlatform(record.data)], date);
}
