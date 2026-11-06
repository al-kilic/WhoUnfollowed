import type { CSSProperties, ReactNode } from 'react';
import { T } from '@/components/landing/tokens';
import type { AppLocale } from '@/i18n/routing';

// Card shell shared by the tool cards (same look as the Radar cards).
export function ToolCard({ children, style, id }: { children: ReactNode; style?: CSSProperties | undefined; id?: string | undefined }) {
  return (
    <section id={id} style={{ background: 'var(--t-surface1)', border: '1px solid var(--t-border1)', borderRadius: 16, padding: 24, ...style }}>
      {children}
    </section>
  );
}

export function ToolLabel({ children, pro }: { children: ReactNode; pro?: string | undefined }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 10, color: T.tealMid, fontFamily: T.mono, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6 }}>
      {children}
      {pro && (
        <span style={{ fontSize: 9, letterSpacing: '0.1em', padding: '2px 7px', borderRadius: 10, color: T.terraText, border: '1px solid var(--t-terra)' }}>{pro}</span>
      )}
    </div>
  );
}

export function ToolTitle({ children }: { children: ReactNode }) {
  return (
    <h2 style={{ fontFamily: T.serif, fontSize: 20, fontWeight: 400, letterSpacing: '-0.02em', color: T.ink, marginBottom: 4 }}>
      {children}
    </h2>
  );
}

export function ToolSub({ children }: { children: ReactNode }) {
  return <p style={{ fontSize: 13.5, color: T.inkDim, lineHeight: 1.55, marginBottom: 16 }}>{children}</p>;
}

export const toolButton: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10,
  fontSize: 13, fontWeight: 600, cursor: 'pointer', border: '1px solid var(--t-border3)',
  background: 'transparent', color: 'var(--t-ink)', fontFamily: 'inherit',
};

export const toolButtonPrimary: CSSProperties = {
  ...toolButton, background: 'var(--t-teal)', color: '#f4f0e8', border: '1px solid rgba(2,136,143,0.5)',
};

export function fmt(n: number, locale: AppLocale): string {
  return new Intl.NumberFormat(locale).format(n);
}

// Fills {name} placeholders in a copy string.
export function fill(template: string, params: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => (k in params ? String(params[k]) : `{${k}}`));
}
