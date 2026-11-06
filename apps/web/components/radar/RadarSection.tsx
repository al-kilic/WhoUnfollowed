'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { T } from '@/components/landing/tokens';

// Numbered editorial section head: a big outlined numeral, title and one line.
export function SectionHead({ kicker, title, sub }: { kicker: string; title: string; sub: string }) {
  return (
    <header style={{ display: 'flex', alignItems: 'flex-end', gap: 18, margin: '0 0 20px', paddingBottom: 14, borderBottom: '1px solid var(--t-border1)' }}>
      <span aria-hidden="true" style={{
        fontFamily: T.serif, fontSize: 'clamp(44px, 6vw, 64px)', lineHeight: 0.8, letterSpacing: '-0.04em',
        color: 'transparent', WebkitTextStroke: '1px var(--t-tealMid)',
      }}>{kicker}</span>
      <div style={{ minWidth: 0 }}>
        <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.05, color: T.ink, margin: 0 }}>{title}</h2>
        <p style={{ fontSize: 13.5, color: T.inkDim, lineHeight: 1.5, margin: '6px 0 0' }}>{sub}</p>
      </div>
    </header>
  );
}

export function RadarSection({ id, children, style }: { id: string; children: ReactNode; style?: React.CSSProperties }) {
  return <section id={id} style={{ scrollMarginTop: 120, marginBottom: 56, ...style }}>{children}</section>;
}

// Sticky pill nav that highlights the section in view.
export function SectionNav({ items, label }: { items: { id: string; label: string }[]; label: string }) {
  const [active, setActive] = useState(items[0]?.id ?? '');
  const ids = items.map(i => i.id).join('|');
  useEffect(() => {
    const els = ids.split('|').map(id => document.getElementById(id)).filter((e): e is HTMLElement => e !== null);
    const io = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-30% 0px -60% 0px' },
    );
    els.forEach(e => io.observe(e));
    return () => io.disconnect();
  }, [ids]);

  return (
    <nav aria-label={label} style={{ position: 'sticky', top: 76, zIndex: 30, display: 'flex', justifyContent: 'center', pointerEvents: 'none', margin: '0 0 8px' }}>
      <div style={{
        pointerEvents: 'auto', display: 'flex', gap: 2, padding: 4, borderRadius: 999, maxWidth: '100%', overflowX: 'auto',
        background: 'var(--t-navBg)', border: '1px solid var(--t-border2)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.18)', scrollbarWidth: 'none',
      }}>
        {items.map(i => {
          const on = active === i.id;
          return (
            <a key={i.id} href={`#${i.id}`} aria-current={on ? 'true' : undefined} style={{
              fontSize: 12, fontFamily: T.mono, letterSpacing: '0.04em', whiteSpace: 'nowrap', textDecoration: 'none',
              padding: '6px 12px', borderRadius: 999, transition: 'background 0.2s, color 0.2s',
              background: on ? 'var(--t-teal)' : 'transparent', color: on ? '#F4F0E8' : T.inkDim,
            }}>{i.label}</a>
          );
        })}
      </div>
    </nav>
  );
}
