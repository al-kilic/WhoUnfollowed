'use client';

import { useState, type CSSProperties, type ReactNode } from 'react';
import { T } from '@/components/landing/tokens';

// Small shared pieces for the coach screens, so each tool file stays short.

export const card: CSSProperties = { background: T.surface1, border: `1px solid ${T.border2}`, borderRadius: 16, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 };
export const label: CSSProperties = { fontSize: 13, fontWeight: 600, color: T.ink, display: 'flex', flexDirection: 'column', gap: 6 };
export const input: CSSProperties = { font: 'inherit', fontSize: 14, padding: '10px 12px', borderRadius: 10, border: `1px solid ${T.border2}`, background: T.bg, color: T.ink, width: '100%' };
export const eyebrow: CSSProperties = { fontFamily: T.mono, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.tealMid };

export function PrimaryButton({ children, disabled, onClick, type = 'button' }: { children: ReactNode; disabled?: boolean; onClick?: () => void; type?: 'button' | 'submit' }) {
  return (
    <button type={type} disabled={disabled} onClick={onClick}
      style={{ alignSelf: 'flex-start', font: 'inherit', fontSize: 14, fontWeight: 600, padding: '11px 18px', borderRadius: 10, border: 'none', background: disabled ? T.border2 : T.teal, color: T.onTeal, cursor: disabled ? 'default' : 'pointer' }}>
      {children}
    </button>
  );
}

export function Choice<V extends string>({ value, options, onChange, name }: { value: V; options: { value: V; label: string }[]; onChange: (v: V) => void; name: string }) {
  return (
    <div role="radiogroup" aria-label={name} style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {options.map((o) => (
        <button key={o.value} type="button" role="radio" aria-checked={value === o.value} onClick={() => onChange(o.value)}
          style={{ font: 'inherit', fontSize: 13, padding: '7px 12px', borderRadius: 99, cursor: 'pointer', border: `1px solid ${value === o.value ? T.teal : T.border2}`, background: value === o.value ? 'rgba(var(--t-accent-rgb),0.12)' : 'transparent', color: T.ink }}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

// "Added to memory" lines, each with a one-tap "Not quite".
export { AddedToMemory } from '@/components/studio/you/memory/AddedChips';

export function ErrorLine({ text }: { text: string | null }) {
  if (!text) return null;
  return <p role="alert" style={{ margin: 0, fontSize: 13, color: T.terra }}>{text}</p>;
}

export function CopyButton({ text, labels }: { text: string; labels: { copy: string; copied: string } }) {
  const [done, setDone] = useState(false);
  return (
    <button type="button" onClick={() => { void navigator.clipboard?.writeText(text).then(() => { setDone(true); setTimeout(() => setDone(false), 1500); }); }}
      style={{ font: 'inherit', fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 8, border: `1px solid ${T.border2}`, background: 'transparent', color: T.tealLight, cursor: 'pointer' }}>
      {done ? labels.copied : labels.copy}
    </button>
  );
}

