'use client';

import { useRef, type PointerEvent } from 'react';
import { Link } from '@/i18n/navigation';
import { Ic } from '@/components/home/icons';

const moves = () => typeof window !== 'undefined' && window.matchMedia('(pointer:fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Open Studio: light follows the pointer, a slight magnetic pull, and a short
// ripple from the press point. Still with reduced motion.
export function StudioButton({ label }: { label: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const onMove = (e: PointerEvent<HTMLAnchorElement>) => {
    const b = ref.current; if (!b || !moves()) return;
    const r = b.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    b.style.setProperty('--px', `${x}px`); b.style.setProperty('--py', `${y}px`);
    b.style.translate = `${((x - r.width / 2) * 0.12).toFixed(1)}px ${((y - r.height / 2) * 0.2).toFixed(1)}px`;
  };
  const onDown = (e: PointerEvent<HTMLAnchorElement>) => {
    const b = ref.current;
    if (!b || !b.animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = b.getBoundingClientRect(), size = Math.max(r.width, r.height) * 2.2, s = document.createElement('span');
    s.className = 'sb-rip'; s.style.width = s.style.height = `${size}px`;
    s.style.left = `${e.clientX - r.left - size / 2}px`; s.style.top = `${e.clientY - r.top - size / 2}px`;
    b.appendChild(s);
    s.animate([{ transform: 'scale(0)', opacity: 0.38 }, { transform: 'scale(1)', opacity: 0 }], { duration: 380, easing: 'cubic-bezier(.2,.8,.2,1)' }).onfinish = () => s.remove();
  };
  return (
    <Link ref={ref} className="sbtn" href="/app" onPointerMove={onMove} onPointerLeave={() => { if (ref.current) ref.current.style.translate = ''; }} onPointerDown={onDown}>
      <span className="sb-t">{label}</span><Ic n="arrow" s={13} className="sb-a" />
    </Link>
  );
}
