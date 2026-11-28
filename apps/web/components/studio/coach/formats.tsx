'use client';

import type { ComponentType } from 'react';
import { CircleDashed, Clapperboard, GalleryHorizontalEnd, Image as ImageIcon } from 'lucide-react';
import { getCoachContent } from '@/app/[locale]/coach/content';
import { useStudio } from '../StudioContext';

import { FORMATS, type Format } from './postedMath';
export { FORMATS, type Format };
export const FORMAT_ICON: Record<Format, ComponentType<{ size?: number }>> = { reel: Clapperboard, carousel: GalleryHorizontalEnd, photo: ImageIcon, story: CircleDashed };

// A coloured chip with the format's icon and name.
export function FormatBadge({ format }: { format: Format }) {
  const { locale } = useStudio();
  const Ic = FORMAT_ICON[format];
  return <span className={`s-fmt f-${format}`}><Ic size={12} />{getCoachContent(locale).formats[format]}</span>;
}

// The format legend: icon and name for each format.
export function FormatLegend() {
  const { locale } = useStudio();
  const c = getCoachContent(locale);
  return <span className="s-legend">{FORMATS.map((f) => { const Ic = FORMAT_ICON[f]; return <span key={f} className={`f-${f}`}><Ic size={13} />{c.formats[f]}</span>; })}</span>;
}

// A segmented picker of formats.
export function FormatSeg({ value, onChange, label }: { value: Format; onChange: (f: Format) => void; label: string }) {
  const { locale } = useStudio();
  const c = getCoachContent(locale);
  return (
    <div className="s-seg" role="radiogroup" aria-label={label}>
      {FORMATS.map((f) => <button key={f} type="button" role="radio" aria-checked={value === f} className={value === f ? 'on' : undefined} onClick={() => onChange(f)}>{c.formats[f]}</button>)}
    </div>
  );
}

// Any segmented picker.
export function Seg<V extends string>({ value, options, onChange, label }: { value: V; options: { value: V; label: string }[]; onChange: (v: V) => void; label: string }) {
  return (
    <div className="s-seg" role="radiogroup" aria-label={label}>
      {options.map((o) => <button key={o.value} type="button" role="radio" aria-checked={value === o.value} className={value === o.value ? 'on' : undefined} onClick={() => onChange(o.value)}>{o.label}</button>)}
    </div>
  );
}
