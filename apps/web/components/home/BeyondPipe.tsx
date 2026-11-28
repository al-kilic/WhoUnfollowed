import type { HomeCopy } from './copy';
import { Ic, type IconName } from './icons';
import { cv } from './cssVars';

// The six steps behind one coach answer, left to right (top to bottom on
// phones). A light runs along the line and each step lights up in turn; CSS
// only, and still under reduced motion.
const ICONS: IconName[] = ['dl', 'chart', 'list', 'check', 'comment', 'bell'];

export function BeyondPipe({ c }: { c: HomeCopy['beyond'] }) {
  return (
    <ol className="why-pipe rv" aria-label={c.pipeAria}>
      {c.pipe.map(([t, b, tag], i) => (
        <li key={t} className="why-n" style={cv({ '--i': i })}>
          <span className="why-ic"><Ic n={ICONS[i] ?? 'check'} s={16} /></span>
          <span className="why-k num">{String(i + 1).padStart(2, '0')}</span>
          <b>{t}</b>
          <span className="why-b">{b}</span>
          <span className="why-tag">{tag}</span>
        </li>
      ))}
    </ol>
  );
}
