import type { CSSProperties } from 'react';

// The homepage's icon set (drawn for the prototype), as inline SVG. `Ic` for
// JSX; `icSvg` for the few pieces the animation code builds as markup.
// The markup below is constant and ours, never user input.

const I: Record<string, [string, string]> = {
  chart: ['0 0 24 24', '<path d="M4 20h16M7 16v-4M12 16V7M17 16v-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'],
  up: ['0 0 24 24', '<path d="M12 16V4m0 0-5 5m5-5 5 5M4 17v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'],
  ch: ['0 0 10 10', '<path d="M2 3.5 5 6.5 8 3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>'],
  check: ['0 0 16 16', '<path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'],
  x: ['0 0 16 16', '<path d="m4.5 4.5 7 7m0-7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'],
  lock: ['0 0 16 16', '<rect x="3" y="7" width="10" height="7" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" fill="none" stroke="currentColor" stroke-width="1.6"/>'],
  arrow: ['0 0 16 16', '<path d="M3 8h10m-4-4 4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>'],
  gh: ['0 0 16 16', '<path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>'],
  sun: ['0 0 24 24', '<circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'],
  moon: ['0 0 24 24', '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>'],
  menu: ['0 0 24 24', '<path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'],
  heart: ['0 0 16 16', '<path d="M8 13.5S2 10 2 6a3 3 0 0 1 6-1 3 3 0 0 1 6 1c0 4-6 7.5-6 7.5z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>'],
  minus: ['0 0 16 16', '<circle cx="6.5" cy="5" r="2.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M2 13c.6-2.4 2.3-3.6 4.5-3.6S10.4 10.6 11 13M10.5 7h4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'],
  play: ['0 0 24 24', '<path d="M8 5.5v13l11-6.5z" fill="currentColor"/>'],
  dl: ['0 0 24 24', '<path d="M12 4v11m0 0 4.5-4.5M12 15l-4.5-4.5M5 19h14" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>'],
  list: ['0 0 24 24', '<path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'],
  warn: ['0 0 16 16', '<path d="M8 2 1.5 13.5h13z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 6.5v3.2M8 11.6v.1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>'],
  comment: ['0 0 24 24', '<path d="M20.5 11.5a8.4 8.4 0 0 1-12.3 7.5L3.5 20.5l1.5-4.6A8.4 8.4 0 1 1 20.5 11.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>'],
  send: ['0 0 24 24', '<path d="M21 3 10 14M21 3l-7 18-4-7-7-4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>'],
  save: ['0 0 24 24', '<path d="M6 3h12v18l-6-5-6 5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>'],
  like: ['0 0 24 24', '<path d="M12 20.5S3.5 15.6 3.5 9.4A4.4 4.4 0 0 1 12 7a4.4 4.4 0 0 1 8.5 2.4c0 6.2-8.5 11.1-8.5 11.1z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>'],
  cursor: ['0 0 16 16', '<path d="M2 1.5 13 8l-4.6 1.2L6.6 14z" fill="#fff" stroke="#0b1212" stroke-width="1.2" stroke-linejoin="round"/>'],
  globe: ['0 0 16 16', '<circle cx="8" cy="8" r="6.2" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M1.8 8h12.4M8 1.8c1.8 1.9 2.6 3.9 2.6 6.2S9.8 12.3 8 14.2M8 1.8C6.2 3.7 5.4 5.7 5.4 8s.8 4.3 2.6 6.2" fill="none" stroke="currentColor" stroke-width="1.4"/>'],
  clock: ['0 0 16 16', '<circle cx="8" cy="8" r="6.2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 4.6V8l2.3 1.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'],
  bell: ['0 0 16 16', '<path d="M4 11.5V7.2a4 4 0 0 1 8 0v4.3l1.2 1.2H2.8zM6.6 14a1.5 1.5 0 0 0 2.8 0" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round"/>'],
  mail: ['0 0 16 16', '<rect x="1.8" y="3.4" width="12.4" height="9.2" rx="1.8" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="m2.4 4.6 5.6 4.2 5.6-4.2" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>'],
  redo: ['0 0 16 16', '<path d="M13.2 7.8A5.2 5.2 0 1 1 11.6 4M13.2 2.6V6H9.8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'],
  cal: ['0 0 16 16', '<rect x="2" y="3" width="12" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M2 6.6h12M5.4 1.8v2.6M10.6 1.8v2.6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>'],
  code: ['0 0 16 16', '<path d="M5.5 4 1.5 8l4 4M10.5 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>'],
};

export type IconName = keyof typeof I;

export function icSvg(name: IconName, size: number, cls = ''): string {
  const [vb, body] = I[name]!;
  return `<svg${cls ? ` class="${cls}"` : ''} width="${size}" height="${size}" viewBox="${vb}" aria-hidden="true">${body}</svg>`;
}

export function Ic({ n, s = 16, className, style }: { n: IconName; s?: number; className?: string; style?: CSSProperties }) {
  const [vb, body] = I[n]!;
  return <svg className={className} style={style} width={s} height={s} viewBox={vb} aria-hidden="true" dangerouslySetInnerHTML={{ __html: body }} />;
}
