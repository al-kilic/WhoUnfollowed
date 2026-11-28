'use client';

import { useRef, useState } from 'react';
import { Popover } from '@base-ui/react/popover';
import type { Guide, GuideLabels } from './guides.content';
import { useStudio } from './StudioContext';

// The small "i" next to a Studio page title. Opens on hover (after a short
// intent delay), on keyboard focus and on click or tap; Escape and a click
// outside close it. The guide: what the page is, quick steps, one thing to know.
export function InfoTip({ guide, page, labels }: { guide: Guide; page: string; labels: GuideLabels }) {
  const [open, setOpen] = useState(false);
  // Closing (Escape, a click outside) hands focus from the guide back to the
  // button; that focus must not open the guide again.
  const dismissedAt = useRef(0);
  // Tabbing to the button opens the guide; the Enter or Space that usually
  // follows must not toggle it shut again. The next press closes it.
  const openedByFocus = useRef(false);
  const change = (next: boolean, details: { reason: string }) => {
    if (!next && details.reason === 'trigger-press' && openedByFocus.current) {
      openedByFocus.current = false;
      return;
    }
    openedByFocus.current = false;
    if (!next && (details.reason === 'escape-key' || details.reason === 'outside-press')) dismissedAt.current = Date.now();
    setOpen(next);
  };
  // The Studio portal carries the theme variables (they are scoped to .studio).
  const { portal } = useStudio();
  return (
    <Popover.Root open={open} onOpenChange={change}>
      <Popover.Trigger
        className="s-info"
        openOnHover
        delay={180}
        closeDelay={120}
        aria-label={labels.open(page)}
        data-testid="page-info"
        onFocus={(e) => {
          if (Date.now() - dismissedAt.current < 300) return;
          if (open || !e.currentTarget.matches(':focus-visible')) return;
          openedByFocus.current = true;
          setOpen(true);
        }}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="8" cy="4.4" r="1.15" fill="currentColor" />
          <path d="M8 7.2v5.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      </Popover.Trigger>
      <Popover.Portal container={portal}>
        <Popover.Positioner side="bottom" align="start" sideOffset={10} collisionPadding={12} className="s-guide-pos">
          <Popover.Popup className="s-guide" data-testid="page-guide">
            <Popover.Arrow className="s-guide-arrow" />
            <span className="s-guide-eye">{labels.eyebrow}</span>
            <Popover.Title className="s-guide-title">{page}</Popover.Title>
            <Popover.Description className="s-guide-lead">{guide.lead}</Popover.Description>
            <div className="s-guide-sec">
              <span className="s-guide-h">{labels.steps}</span>
              <ol className="s-guide-steps">{guide.steps.map((s, i) => <li key={i}><b aria-hidden="true">{i + 1}</b><span>{s}</span></li>)}</ol>
            </div>
            <p className="s-guide-good"><span className="s-guide-h">{labels.good}</span>{guide.good}</p>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
