'use client';

import { useStudio } from './StudioContext';

// A tiny ring showing how much of this month's coach use is gone (no numbers).
const LEVEL = {
  en: ['Most of this month left', 'About half of this month used', 'Most of this month used', 'This month used up'],
  es: ['Queda casi todo el mes', 'Usaste cerca de la mitad del mes', 'Usaste casi todo el mes', 'Ya usaste este mes'],
  pt: ['Resta quase todo o mês', 'Você usou cerca de metade do mês', 'Você usou quase todo o mês', 'Você já usou este mês'],
} as const;

export function UsageRing({ size = 14 }: { size?: number }) {
  const { coach, locale } = useStudio();
  const a = coach.state?.allowance;
  if (!a) return null;
  const share = Math.max(0, Math.min(1, a.empty ? 1 : a.usedShare));
  const r = 5.25;
  const len = 2 * Math.PI * r;
  const words = LEVEL[locale as keyof typeof LEVEL] ?? LEVEL.en;
  const label = a.empty ? words[3] : share >= 0.75 ? words[2] : share >= 0.35 ? words[1] : words[0];
  const tone = a.empty ? 'var(--bad)' : a.nearLimit ? 'var(--warn)' : 'var(--accent)';
  return (
    <svg className="s-ring" width={size} height={size} viewBox="0 0 14 14" role="img" aria-label={label} data-testid="usage-ring">
      <title>{label}</title>
      <circle cx="7" cy="7" r={r} fill="none" stroke="var(--line)" strokeWidth="2.2" />
      <circle cx="7" cy="7" r={r} fill="none" stroke={tone} strokeWidth="2.2" strokeLinecap="round"
        strokeDasharray={`${(share * len).toFixed(2)} ${len.toFixed(2)}`} transform="rotate(-90 7 7)" />
    </svg>
  );
}
