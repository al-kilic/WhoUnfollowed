import { Fragment } from 'react';

// Renders copy where **text** marks bold.
export function Rich({ t }: { t: string }) {
  return <>{t.split('**').map((part, i) => (i % 2 ? <b key={i}>{part}</b> : <Fragment key={i}>{part}</Fragment>))}</>;
}

// The same, as escaped HTML for the few strings the animation code writes.
export function richHtml(t: string): string {
  const esc = t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return esc.split('**').map((p, i) => (i % 2 ? `<b>${p}</b>` : p)).join('');
}
