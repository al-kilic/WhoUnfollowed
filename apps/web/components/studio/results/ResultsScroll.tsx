'use client';

import { useEffect, useRef, type ReactNode } from 'react';

// The list scrolls inside its card, so the tabs, search and filters above it
// stay put and the page never grows. More rows load when the reader nears the
// bottom of the box (no "show more" button).
export function ResultsScroll({ shown, total, onMore, countLabel, resetKey, children }: {
  shown: number; total: number; onMore: () => void; countLabel: string; resetKey: string; children: ReactNode;
}) {
  const box = useRef<HTMLDivElement>(null);
  const end = useRef<HTMLDivElement>(null);
  const more = useRef(onMore);
  more.current = onMore;

  // A new tab, search, sort or filter starts at the top again.
  useEffect(() => { box.current?.scrollTo({ top: 0 }); }, [resetKey]);

  useEffect(() => {
    const root = box.current;
    const target = end.current;
    if (!root || !target || shown >= total) return;
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) more.current(); }, { root, rootMargin: '0px 0px 240px 0px' });
    io.observe(target);
    return () => io.disconnect();
  }, [shown, total]);

  return (
    <>
      <div ref={box} className="s-rscroll" tabIndex={-1}>
        {children}
        {shown < total && <div ref={end} className="s-rmore" aria-hidden="true" />}
      </div>
      {total > 0 && <div className="s-rcount" aria-live="polite">{countLabel}</div>}
    </>
  );
}
